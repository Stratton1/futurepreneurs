import { createAdminClient } from '@/lib/supabase/server';
import { getCustodialAccountById } from '@/lib/queries/custodial-accounts';
import { releaseHeldFunds } from '@/lib/queries/wallet-balances';
import { unfreezeCard, freezeCard } from '@/lib/stripe/issuing';
import { sendNotificationEmail, notificationEmailHtml } from '@/lib/email/resend';

const CARD_WINDOW_MINUTES = 30;

/** Execute an approved spending request: unfreeze card, fund it, set window timer. */
export async function executeApprovedSpending(spendingRequestId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  const admin = createAdminClient();

  // Fetch the spending request
  const { data: request } = await admin
    .from('spending_requests')
    .select('*')
    .eq('id', spendingRequestId)
    .single();

  if (!request) return { success: false, error: 'Spending request not found' };
  if (request.status !== 'approved') {
    return { success: false, error: 'Request is not in approved status' };
  }

  // Check cooling-off period
  if (request.cooling_off_ends_at && new Date(request.cooling_off_ends_at) > new Date()) {
    return { success: false, error: 'Cooling-off period has not ended yet' };
  }

  // Get custodial account
  const account = await getCustodialAccountById(request.custodial_account_id);
  if (!account || !account.stripe_connected_account_id) {
    return { success: false, error: 'Custodial account not configured' };
  }

  // Get the issued card for this project
  const { data: card } = await admin
    .from('issued_cards')
    .select('*')
    .eq('custodial_account_id', request.custodial_account_id)
    .eq('project_id', request.project_id)
    .single();

  if (!card) {
    // Fallback: no card issued, mark as funded for manual payout
    const now = new Date();
    const windowExpires = new Date(now.getTime() + CARD_WINDOW_MINUTES * 60 * 1000);

    await admin
      .from('spending_requests')
      .update({
        status: 'funded',
        funded_at: now.toISOString(),
        card_window_expires_at: windowExpires.toISOString(),
      })
      .eq('id', spendingRequestId);

    await admin.from('notifications').insert({
      user_id: request.student_id,
      type: 'spending_funded',
      title: 'Purchase approved and ready',
      message: `Your £${Number(request.amount).toFixed(2)} purchase at ${request.vendor_name} has been approved. Funds will be transferred to your parent's account.`,
      link: '/dashboard/wallet',
    });
    await sendNotificationEmail(
      request.student_id,
      'Purchase approved and ready',
      notificationEmailHtml(
        'Purchase approved and ready',
        `Your £${Number(request.amount).toFixed(2)} purchase at ${request.vendor_name} has been approved. Funds will be transferred to your parent's account.`,
        '/dashboard/wallet'
      )
    );

    return { success: true };
  }

  try {
    // Unfreeze the card
    await unfreezeCard(account.stripe_connected_account_id, card.stripe_card_id);

    const now = new Date();
    const windowExpires = new Date(now.getTime() + CARD_WINDOW_MINUTES * 60 * 1000);

    // Update spending request
    await admin
      .from('spending_requests')
      .update({
        status: 'funded',
        funded_at: now.toISOString(),
        card_unfrozen_at: now.toISOString(),
        card_window_expires_at: windowExpires.toISOString(),
      })
      .eq('id', spendingRequestId);

    // Update card status in DB
    await admin
      .from('issued_cards')
      .update({ card_status: 'active' })
      .eq('id', card.id);

    // Notify student
    await admin.from('notifications').insert({
      user_id: request.student_id,
      type: 'card_activated',
      title: 'Your card is active!',
      message: `Your card ending in ${card.last_four} is now active for ${CARD_WINDOW_MINUTES} minutes. You can spend up to £${Number(request.amount).toFixed(2)} at ${request.vendor_name}.`,
      link: '/dashboard/wallet',
    });
    await sendNotificationEmail(
      request.student_id,
      'Your card is active!',
      notificationEmailHtml(
        'Your card is active!',
        `Your card ending in ${card.last_four} is now active for ${CARD_WINDOW_MINUTES} minutes. You can spend up to £${Number(request.amount).toFixed(2)} at ${request.vendor_name}.`,
        '/dashboard/wallet'
      )
    );

    return { success: true };
  } catch (err) {
    console.error('Card unfreeze error:', err);
    return { success: false, error: 'Failed to activate card' };
  }
}

/** Refreeze a card after the spending window has expired. */
export async function refreezeExpiredCard(spendingRequestId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  const admin = createAdminClient();

  const { data: request } = await admin
    .from('spending_requests')
    .select('*')
    .eq('id', spendingRequestId)
    .single();

  if (!request) return { success: false, error: 'Request not found' };
  if (request.status !== 'funded') return { success: false, error: 'Not in funded status' };

  const account = await getCustodialAccountById(request.custodial_account_id);
  if (!account || !account.stripe_connected_account_id) {
    return { success: false, error: 'Custodial account not configured' };
  }

  const { data: card } = await admin
    .from('issued_cards')
    .select('*')
    .eq('custodial_account_id', request.custodial_account_id)
    .eq('project_id', request.project_id)
    .single();

  if (card) {
    try {
      await freezeCard(account.stripe_connected_account_id, card.stripe_card_id);
      await admin
        .from('issued_cards')
        .update({ card_status: 'frozen' })
        .eq('id', card.id);
    } catch (err) {
      console.error('Card refreeze error:', err);
    }
  }

  // If no transaction occurred, check if we need to release funds
  if (!request.stripe_authorization_id) {
    // No transaction happened — return held funds
    const { data: wallet } = await admin
      .from('wallet_balances')
      .select('id')
      .eq('custodial_account_id', request.custodial_account_id)
      .eq('project_id', request.project_id)
      .single();

    if (wallet) {
      await releaseHeldFunds(wallet.id, Number(request.amount));
      // Return to available
      const { data: walletData } = await admin
        .from('wallet_balances')
        .select('available_balance')
        .eq('id', wallet.id)
        .single();
      if (walletData) {
        await admin
          .from('wallet_balances')
          .update({
            available_balance: Number(walletData.available_balance) + Number(request.amount),
          })
          .eq('id', wallet.id);
      }
    }

    await admin
      .from('spending_requests')
      .update({ status: 'expired' })
      .eq('id', spendingRequestId);

    await admin.from('notifications').insert({
      user_id: request.student_id,
      type: 'spending_expired',
      title: 'Spending window expired',
      message: `The spending window for your £${Number(request.amount).toFixed(2)} purchase at ${request.vendor_name} has expired. The funds have been returned to your wallet.`,
      link: '/dashboard/wallet',
    });
  } else {
    // Transaction was made — mark as completed
    await admin
      .from('spending_requests')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
      })
      .eq('id', spendingRequestId);

    // Release the held funds (they've been spent via the card)
    const { data: wallet } = await admin
      .from('wallet_balances')
      .select('id')
      .eq('custodial_account_id', request.custodial_account_id)
      .eq('project_id', request.project_id)
      .single();

    if (wallet) {
      await releaseHeldFunds(wallet.id, Number(request.amount));
    }
  }

  return { success: true };
}
