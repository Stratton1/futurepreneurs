import { NextRequest, NextResponse } from 'next/server';
import { stripe, toPounds } from '@/lib/stripe';
import { createAdminClient } from '@/lib/supabase/server';
import { awardFullyFunded } from '@/lib/badges';
import Stripe from 'stripe';

/**
 * POST /api/webhooks/stripe
 * Handles Stripe webhook events for payment lifecycle.
 *
 * Key events:
 * - checkout.session.completed → Mark backing as "held", update project totals
 * - charge.refunded → Mark backing as "refunded", reduce project totals
 */
export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Webhook signature verification failed:', message);
    return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 });
  }

  const supabase = createAdminClient();

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const backingId = session.metadata?.backing_id;
      const projectId = session.metadata?.project_id;

      if (!backingId || !projectId) {
        console.error('Missing metadata in checkout session:', session.id);
        break;
      }

      // Update backing status to "held" and store payment intent
      const { error: updateError } = await supabase
        .from('backings')
        .update({
          status: 'held',
          stripe_payment_intent_id: session.payment_intent as string,
        })
        .eq('id', backingId);

      if (updateError) {
        console.error('Error updating backing:', updateError);
        break;
      }

      // Update project totals
      const amountPounds = toPounds(session.amount_total || 0);
      const { data: project } = await supabase
        .from('projects')
        .select('total_raised, backer_count, goal_amount, status, student_id')
        .eq('id', projectId)
        .single();

      if (project) {
        const newTotal = Number(project.total_raised) + amountPounds;
        const newCount = Number(project.backer_count) + 1;
        const goalMet = newTotal >= Number(project.goal_amount);

        // Update project
        await supabase
          .from('projects')
          .update({
            total_raised: newTotal,
            backer_count: newCount,
            // If goal is met, transition to "funded"
            ...(goalMet && project.status === 'live' ? { status: 'funded' } : {}),
          })
          .eq('id', projectId);

        // If goal is met, mark all held backings as "collected" and award badge
        if (goalMet) {
          await supabase
            .from('backings')
            .update({ status: 'collected' })
            .eq('project_id', projectId)
            .eq('status', 'held');
          if (project.student_id) {
            await awardFullyFunded(project.student_id, projectId);
          }
        }
      }

      console.log(`✅ Backing ${backingId} for project ${projectId} — payment held`);
      break;
    }

    case 'charge.refunded': {
      const charge = event.data.object as Stripe.Charge;
      const paymentIntentId = charge.payment_intent as string;

      if (!paymentIntentId) break;

      // Find the backing by payment intent
      const { data: backing } = await supabase
        .from('backings')
        .select('id, project_id, amount')
        .eq('stripe_payment_intent_id', paymentIntentId)
        .single();

      if (backing) {
        // Mark backing as refunded
        await supabase
          .from('backings')
          .update({ status: 'refunded' })
          .eq('id', backing.id);

        // Reduce project totals
        const { data: project } = await supabase
          .from('projects')
          .select('total_raised, backer_count')
          .eq('id', backing.project_id)
          .single();

        if (project) {
          await supabase
            .from('projects')
            .update({
              total_raised: Math.max(0, Number(project.total_raised) - Number(backing.amount)),
              backer_count: Math.max(0, Number(project.backer_count) - 1),
            })
            .eq('id', backing.project_id);
        }

        console.log(`↩️ Backing ${backing.id} refunded`);
      }
      break;
    }

    case 'payment_intent.payment_failed': {
      const intent = event.data.object as Stripe.PaymentIntent;
      console.warn(`⚠️ Payment failed: ${intent.id}`);

      // Find and remove the pending backing
      const { data: backing } = await supabase
        .from('backings')
        .select('id')
        .eq('stripe_payment_intent_id', intent.id)
        .single();

      if (backing) {
        await supabase
          .from('backings')
          .delete()
          .eq('id', backing.id);
      }
      break;
    }

    default:
      // Unhandled event type — acknowledge it
      break;
  }

  return NextResponse.json({ received: true });
}
