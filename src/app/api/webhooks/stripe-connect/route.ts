import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createAdminClient } from '@/lib/supabase/server';
import { sendNotificationEmail, notificationEmailHtml } from '@/lib/email/resend';
import type Stripe from 'stripe';

export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_CONNECT_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return NextResponse.json({ error: 'Missing signature or webhook secret' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error('Connect webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const admin = createAdminClient();

  switch (event.type) {
    case 'account.updated': {
      const account = event.data.object as Stripe.Account;
      const connectedAccountId = account.id;

      // Find our custodial account record
      const { data: custodialAccount } = await admin
        .from('custodial_accounts')
        .select('id, parent_id, student_id, kyc_status')
        .eq('stripe_connected_account_id', connectedAccountId)
        .single();

      if (!custodialAccount) break;

      const requirementsMet =
        !account.requirements?.currently_due?.length &&
        !account.requirements?.past_due?.length;

      if (requirementsMet && custodialAccount.kyc_status !== 'adult_verified') {
        await admin
          .from('custodial_accounts')
          .update({ kyc_status: 'adult_verified' })
          .eq('id', custodialAccount.id);

        // Notify parent
        await admin.from('notifications').insert({
          user_id: custodialAccount.parent_id,
          type: 'kyc_complete',
          title: 'Verification complete',
          message: 'Your identity verification is complete! The digital wallet is now ready to receive funds.',
          link: '/dashboard/wallet/parent',
        });
        await sendNotificationEmail(
          custodialAccount.parent_id,
          'Wallet verification complete',
          notificationEmailHtml(
            'Verification complete',
            'Your identity verification is complete! The digital wallet is now ready to receive funds.',
            '/dashboard/wallet/parent'
          )
        );

        // Notify student
        await admin.from('notifications').insert({
          user_id: custodialAccount.student_id,
          type: 'wallet_ready',
          title: 'Your wallet is ready!',
          message: 'Your digital wallet has been set up by your parent. You can now view your wallet and request purchases for funded projects.',
          link: '/dashboard/wallet',
        });
        await sendNotificationEmail(
          custodialAccount.student_id,
          'Your wallet is ready!',
          notificationEmailHtml(
            'Your wallet is ready!',
            'Your digital wallet has been set up by your parent. You can now view your wallet and request purchases for funded projects.',
            '/dashboard/wallet'
          )
        );
      }

      if (account.requirements?.disabled_reason && custodialAccount.kyc_status !== 'failed') {
        await admin
          .from('custodial_accounts')
          .update({ kyc_status: 'failed' })
          .eq('id', custodialAccount.id);

        await admin.from('notifications').insert({
          user_id: custodialAccount.parent_id,
          type: 'kyc_failed',
          title: 'Verification issue',
          message: 'There was an issue with your identity verification. Please visit the wallet settings to resolve it.',
          link: '/dashboard/wallet/onboard',
        });
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
