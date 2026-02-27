import { NextRequest, NextResponse } from 'next/server';
import { stripe, toPounds } from '@/lib/stripe';
import { createAdminClient } from '@/lib/supabase/server';
import { awardFullyFunded } from '@/lib/badges';
import { checkAndMarkMicroGoals } from '@/lib/queries/micro-goals';
import { checkAndUnlockStretchGoals } from '@/lib/queries/stretch-goals';
import { processMatchingForBacking } from '@/lib/queries/matching';
import { incrementClaimedCount } from '@/lib/queries/reward-tiers';
import Stripe from 'stripe';

/**
 * POST /api/webhooks/stripe
 * Handles Stripe webhook events for payment lifecycle.
 *
 * Security:
 * - Stripe signature verification prevents forged webhooks
 * - Idempotency check via stripe_session_id prevents duplicate processing
 * - Atomic RPC calls prevent race conditions on project totals
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

      // Idempotency: check if this session was already processed
      const { data: existingBacking } = await supabase
        .from('backings')
        .select('id, status, stripe_session_id, reward_tier_id')
        .eq('id', backingId)
        .single();

      if (existingBacking?.stripe_session_id === session.id) {
        console.log(`Skipping duplicate webhook for session ${session.id}`);
        break;
      }

      // Update backing: mark as "held", store payment intent + session ID
      const { error: updateError } = await supabase
        .from('backings')
        .update({
          status: 'held',
          stripe_payment_intent_id: session.payment_intent as string,
          stripe_session_id: session.id,
        })
        .eq('id', backingId);

      if (updateError) {
        console.error('Error updating backing:', updateError);
        break;
      }

      // Increment reward tier claimed count if applicable
      if (existingBacking?.reward_tier_id) {
        await incrementClaimedCount(existingBacking.reward_tier_id);
      }

      // Atomic increment of project totals via RPC
      const amountPounds = toPounds(session.amount_total || 0);
      const { data: updated, error: rpcError } = await supabase.rpc(
        'increment_project_funding',
        {
          p_project_id: projectId,
          p_amount: amountPounds,
          p_backer_increment: 1,
        }
      );

      if (rpcError) {
        console.error('Error incrementing project funding:', rpcError);
        break;
      }

      // Process matching grants — add matched amount to project total
      const matchedAmount = await processMatchingForBacking(
        projectId,
        backingId,
        amountPounds
      );

      if (matchedAmount > 0) {
        // Add matched amount to project total (no extra backer)
        await supabase.rpc('increment_project_funding', {
          p_project_id: projectId,
          p_amount: matchedAmount,
          p_backer_increment: 0,
        });
        console.log(`Matching: £${matchedAmount.toFixed(2)} added to project ${projectId}`);
      }

      // Re-read the total after matching to get accurate figure
      const { data: projectAfterMatch } = matchedAmount > 0
        ? await supabase
            .from('projects')
            .select('total_raised, goal_amount, status, student_id')
            .eq('id', projectId)
            .single()
        : { data: null };

      const result = projectAfterMatch || (Array.isArray(updated) ? updated[0] : updated);
      if (result) {
        const currentTotal = Number(projectAfterMatch?.total_raised ?? result.new_total);
        const goalAmt = Number(projectAfterMatch?.goal_amount ?? result.goal_amount);
        const currentStatus = projectAfterMatch?.status ?? result.current_status;
        const studentId = projectAfterMatch?.student_id ?? result.student_id;
        const goalMet = currentTotal >= goalAmt;

        // Check and mark micro-goals as reached
        await checkAndMarkMicroGoals(projectId, currentTotal);

        // Check and auto-unlock stretch goals
        await checkAndUnlockStretchGoals(projectId, currentTotal);

        // If goal is met, transition to "funded" and collect all held backings
        if (goalMet && currentStatus === 'live') {
          await supabase
            .from('projects')
            .update({ status: 'funded' })
            .eq('id', projectId)
            .eq('status', 'live');

          await supabase
            .from('backings')
            .update({ status: 'collected' })
            .eq('project_id', projectId)
            .eq('status', 'held');

          if (studentId) {
            await awardFullyFunded(studentId, projectId);
          }
        }
      }

      console.log(`Backing ${backingId} for project ${projectId} — payment held`);
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

        // Atomic decrement of project totals via RPC
        await supabase.rpc('decrement_project_funding', {
          p_project_id: backing.project_id,
          p_amount: Number(backing.amount),
          p_backer_decrement: 1,
        });

        console.log(`Backing ${backing.id} refunded`);
      }
      break;
    }

    case 'payment_intent.payment_failed': {
      const intent = event.data.object as Stripe.PaymentIntent;
      console.warn(`Payment failed: ${intent.id}`);

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
      break;
  }

  return NextResponse.json({ received: true });
}
