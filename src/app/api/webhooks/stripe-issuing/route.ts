import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createAdminClient } from '@/lib/supabase/server';
import { isBlockedMCC } from '@/lib/wallet/mcc-validation';
import { sendNotificationEmail, notificationEmailHtml } from '@/lib/email/resend';
import type Stripe from 'stripe';

export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_ISSUING_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return NextResponse.json({ error: 'Missing signature or webhook secret' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error('Issuing webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const admin = createAdminClient();

  switch (event.type) {
    case 'issuing_authorization.request': {
      // Real-time authorization decision
      const auth = event.data.object as Stripe.Issuing.Authorization;
      const mcc = auth.merchant_data.category_code;

      // Check if MCC is blocked
      if (mcc) {
        const mccCheck = await isBlockedMCC(mcc);
        if (mccCheck.blocked) {
          // Decline the authorization
          return NextResponse.json({
            approved: false,
            reason: `Blocked category: ${mccCheck.reason}`,
          });
        }
      }

      // Check that there's a matching funded spending request
      const cardId = typeof auth.card === 'string' ? auth.card : auth.card.id;
      const { data: card } = await admin
        .from('issued_cards')
        .select('custodial_account_id, project_id')
        .eq('stripe_card_id', cardId)
        .single();

      if (!card) {
        return NextResponse.json({ approved: false, reason: 'Card not recognized' });
      }

      const { data: activeRequest } = await admin
        .from('spending_requests')
        .select('id, amount')
        .eq('custodial_account_id', card.custodial_account_id)
        .eq('project_id', card.project_id)
        .eq('status', 'funded')
        .gt('card_window_expires_at', new Date().toISOString())
        .single();

      if (!activeRequest) {
        return NextResponse.json({
          approved: false,
          reason: 'No active spending window',
        });
      }

      // Check amount
      if (auth.amount > Number(activeRequest.amount) * 100) {
        return NextResponse.json({
          approved: false,
          reason: 'Amount exceeds approved amount',
        });
      }

      return NextResponse.json({ approved: true });
    }

    case 'issuing_authorization.created': {
      // Authorization was created (either approved or declined externally)
      const auth = event.data.object as Stripe.Issuing.Authorization;
      if (auth.approved) {
        const cardId = typeof auth.card === 'string' ? auth.card : auth.card.id;
        const { data: card } = await admin
          .from('issued_cards')
          .select('custodial_account_id, project_id')
          .eq('stripe_card_id', cardId)
          .single();

        if (card) {
          // Link authorization to spending request
          await admin
            .from('spending_requests')
            .update({ stripe_authorization_id: auth.id })
            .eq('custodial_account_id', card.custodial_account_id)
            .eq('project_id', card.project_id)
            .eq('status', 'funded');
        }
      }
      break;
    }

    case 'issuing_transaction.created': {
      // Transaction completed
      const transaction = event.data.object as Stripe.Issuing.Transaction;
      const authId = typeof transaction.authorization === 'string'
        ? transaction.authorization
        : transaction.authorization?.id;

      if (authId) {
        const { data: request } = await admin
          .from('spending_requests')
          .select('id, student_id, amount, vendor_name')
          .eq('stripe_authorization_id', authId)
          .single();

        if (request) {
          await admin
            .from('spending_requests')
            .update({
              status: 'completed',
              completed_at: new Date().toISOString(),
            })
            .eq('id', request.id);

          await admin.from('notifications').insert({
            user_id: request.student_id,
            type: 'transaction_complete',
            title: 'Purchase complete',
            message: `Your £${Number(request.amount).toFixed(2)} purchase at ${request.vendor_name} is complete. Don't forget to upload your receipt!`,
            link: '/dashboard/wallet',
          });
          await sendNotificationEmail(
            request.student_id,
            'Purchase complete — upload your receipt',
            notificationEmailHtml(
              'Purchase complete',
              `Your £${Number(request.amount).toFixed(2)} purchase at ${request.vendor_name} is complete. Please upload your receipt within 48 hours.`,
              '/dashboard/wallet'
            )
          );
        }
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
