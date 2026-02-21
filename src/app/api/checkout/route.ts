import { NextRequest, NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { stripe, toPence } from '@/lib/stripe';
import { createAdminClient } from '@/lib/supabase/server';
import { isRateLimited, getClientIp } from '@/lib/rate-limit';

/**
 * POST /api/checkout
 * Creates a Stripe Checkout Session for backing a project.
 *
 * Body: { projectId, amount, backerName, backerEmail, isAnonymous?, backerId?, rewardTierId? }
 *
 * Security:
 * - Rate limited to 5 requests per minute per IP
 * - Backing record created as "pending" before Stripe redirect
 * - Webhook confirms payment and transitions to "held"
 */
export async function POST(request: NextRequest) {
  try {
    // Rate limiting: 5 requests per minute per IP
    const clientIp = getClientIp(request.headers);
    if (isRateLimited(`checkout:${clientIp}`, 5, 60_000)) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a moment and try again.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { projectId, amount, backerName, backerEmail, isAnonymous, backerId, rewardTierId } = body;

    // Validate inputs
    if (!projectId || !amount || !backerName || !backerEmail) {
      return NextResponse.json(
        { error: 'Missing required fields: projectId, amount, backerName, backerEmail' },
        { status: 400 }
      );
    }

    const amountNum = Number(amount);
    if (isNaN(amountNum) || amountNum < 1 || amountNum > 10000) {
      return NextResponse.json(
        { error: 'Amount must be between £1 and £10,000' },
        { status: 400 }
      );
    }

    // Fetch project to verify it's live and can accept backings
    const supabase = createAdminClient();
    const { data: project, error: projError } = await supabase
      .from('projects')
      .select('id, title, status, goal_amount, total_raised')
      .eq('id', projectId)
      .single();

    if (projError || !project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    if (project.status !== 'live') {
      return NextResponse.json(
        { error: 'This project is not currently accepting funding' },
        { status: 400 }
      );
    }

    const remaining = Number(project.goal_amount) - Number(project.total_raised);
    if (amountNum > remaining) {
      return NextResponse.json(
        { error: `This project only needs £${remaining.toFixed(2)} more to reach its goal` },
        { status: 400 }
      );
    }

    const amountPence = toPence(amountNum);
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://futurepreneurs-sigma.vercel.app';

    // Create a backing record (pending — confirmed by webhook on checkout.session.completed)
    const { data: backing, error: backingError } = await supabase
      .from('backings')
      .insert({
        project_id: projectId,
        backer_id: backerId || null,
        backer_email: backerEmail,
        backer_name: backerName,
        amount: amountNum,
        is_anonymous: isAnonymous || false,
        reward_tier_id: rewardTierId || null,
        status: 'pending',
      })
      .select('id')
      .single();

    if (backingError) {
      console.error('Backing insert error:', backingError);
      return NextResponse.json({ error: 'Failed to create backing record' }, { status: 500 });
    }

    // Create Stripe Checkout Session
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: 'payment',
      payment_method_types: ['card', 'apple_pay', 'google_pay'] as Stripe.Checkout.SessionCreateParams['payment_method_types'],
      customer_email: backerEmail,
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            unit_amount: amountPence,
            product_data: {
              name: `Back "${project.title}"`,
              description: `Supporting a young entrepreneur on Futurepreneurs`,
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        backing_id: backing.id,
        project_id: projectId,
        backer_name: backerName,
        backer_email: backerEmail,
      },
      success_url: `${appUrl}/projects/${projectId}/back/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/projects/${projectId}`,
    };
    const session = await stripe.checkout.sessions.create(sessionParams);

    // Store the session ID on the backing for idempotency tracking
    if (session.payment_intent || session.id) {
      await supabase
        .from('backings')
        .update({
          stripe_payment_intent_id: (session.payment_intent as string) || null,
          stripe_session_id: session.id,
        })
        .eq('id', backing.id);
    }

    return NextResponse.json({ sessionUrl: session.url });
  } catch (err: unknown) {
    console.error('Checkout error:', err);
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
