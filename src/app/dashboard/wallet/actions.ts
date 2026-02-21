'use server';

import { createAdminClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/supabase/auth-helpers';
import { createConnectedAccount, createAccountLink, getAccountStatus } from '@/lib/stripe/connect';
import { getCustodialAccount, getCustodialAccountById } from '@/lib/queries/custodial-accounts';
import { sendNotificationEmail, notificationEmailHtml } from '@/lib/email/resend';
import { revalidatePath } from 'next/cache';

/** Parent initiates custodial account onboarding. Creates Stripe Connected Account + returns onboarding link. */
export async function initiateOnboarding(studentId: string) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'parent') {
    return { error: 'Only parents can initiate wallet onboarding' };
  }

  // Check student exists and is linked to this parent
  const admin = createAdminClient();
  const { data: student } = await admin
    .from('user_profiles')
    .select('id, full_name, parent_id')
    .eq('id', studentId)
    .eq('role', 'student')
    .single();

  if (!student) return { error: 'Student not found' };
  if (student.parent_id !== user.id) {
    return { error: 'This student is not linked to your account' };
  }

  // Check if custodial account already exists
  const existing = await getCustodialAccount(user.id, studentId);
  if (existing?.stripe_connected_account_id) {
    // Already have a connected account — check if onboarding is complete
    const status = await getAccountStatus(existing.stripe_connected_account_id);
    if (status.requirements_met) {
      return { error: 'Wallet onboarding is already complete' };
    }
    // Generate a new onboarding link for incomplete accounts
    const link = await createAccountLink(existing.stripe_connected_account_id);
    return { success: true, onboardingUrl: link.url, accountId: existing.id };
  }

  try {
    // Create Stripe Connect Custom Account
    const account = await createConnectedAccount(user.email, user.full_name, {
      parentId: user.id,
      studentId,
    });

    // Create custodial account record
    const { data: custodialAccount, error: insertError } = await admin
      .from('custodial_accounts')
      .upsert({
        parent_id: user.id,
        student_id: studentId,
        stripe_connected_account_id: account.id,
        kyc_status: 'pending',
        relationship_verified: true, // verified via parent_id link
        relationship_evidence: 'parental_consent',
      }, {
        onConflict: 'parent_id,student_id',
      })
      .select('id')
      .single();

    if (insertError || !custodialAccount) {
      console.error('Custodial account creation error:', insertError);
      return { error: 'Failed to create wallet account' };
    }

    // Generate onboarding link
    const link = await createAccountLink(account.id);

    // Notify the student
    await admin.from('notifications').insert({
      user_id: studentId,
      type: 'wallet_onboarding',
      title: 'Wallet being set up',
      message: `${user.full_name} has started setting up your digital wallet. You'll be notified when it's ready!`,
      link: '/dashboard/wallet',
    });

    revalidatePath('/dashboard/wallet');
    return { success: true, onboardingUrl: link.url, accountId: custodialAccount.id };
  } catch (err) {
    console.error('Onboarding error:', err);
    return { error: 'Failed to set up wallet. Please try again.' };
  }
}

/** Check the current onboarding/KYC status for a custodial account. */
export async function checkOnboardingStatus(custodialAccountId: string) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Not authenticated' };

  const account = await getCustodialAccountById(custodialAccountId);
  if (!account) return { error: 'Account not found' };

  // Only parent or student can check their own account
  if (account.parent_id !== user.id && account.student_id !== user.id) {
    return { error: 'Not authorized' };
  }

  if (!account.stripe_connected_account_id) {
    return { success: true, status: 'not_started', kycStatus: account.kyc_status };
  }

  try {
    const stripeStatus = await getAccountStatus(account.stripe_connected_account_id);

    // Update KYC status in our database if changed
    let newKycStatus = account.kyc_status;
    if (stripeStatus.requirements_met && account.kyc_status !== 'fully_verified') {
      newKycStatus = 'adult_verified';
      const admin = createAdminClient();
      await admin
        .from('custodial_accounts')
        .update({ kyc_status: 'adult_verified' })
        .eq('id', custodialAccountId);
    } else if (stripeStatus.disabled_reason && account.kyc_status !== 'failed') {
      newKycStatus = 'failed';
      const admin = createAdminClient();
      await admin
        .from('custodial_accounts')
        .update({ kyc_status: 'failed' })
        .eq('id', custodialAccountId);
    }

    return {
      success: true,
      status: stripeStatus.requirements_met ? 'complete' : 'pending',
      kycStatus: newKycStatus,
      requirementsMet: stripeStatus.requirements_met,
      currentlyDue: stripeStatus.currently_due,
    };
  } catch (err) {
    console.error('Status check error:', err);
    return { error: 'Failed to check onboarding status' };
  }
}

/** Generate a fresh onboarding link (if the previous one expired). */
export async function refreshOnboardingLink(custodialAccountId: string) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'parent') {
    return { error: 'Only parents can refresh onboarding links' };
  }

  const account = await getCustodialAccountById(custodialAccountId);
  if (!account) return { error: 'Account not found' };
  if (account.parent_id !== user.id) return { error: 'Not authorized' };
  if (!account.stripe_connected_account_id) return { error: 'No Stripe account found' };

  try {
    const link = await createAccountLink(account.stripe_connected_account_id);
    return { success: true, onboardingUrl: link.url };
  } catch (err) {
    console.error('Link refresh error:', err);
    return { error: 'Failed to generate onboarding link' };
  }
}

/** Parent updates spending limits for a card. */
export async function updateSpendingLimits(
  cardRecordId: string,
  limits: { daily: number; weekly: number; per_transaction: number }
) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'parent') {
    return { error: 'Only parents can update spending limits' };
  }

  const admin = createAdminClient();

  const { data: card } = await admin
    .from('issued_cards')
    .select('*, custodial_accounts!inner(parent_id)')
    .eq('id', cardRecordId)
    .single();

  if (!card) return { error: 'Card not found' };

  // Validate limits
  if (limits.daily < 1 || limits.daily > 500) {
    return { error: 'Daily limit must be between £1 and £500' };
  }
  if (limits.weekly < 1 || limits.weekly > 2000) {
    return { error: 'Weekly limit must be between £1 and £2,000' };
  }
  if (limits.per_transaction < 1 || limits.per_transaction > 1000) {
    return { error: 'Per-transaction limit must be between £1 and £1,000' };
  }

  const { error } = await admin
    .from('issued_cards')
    .update({
      spending_limit_daily: limits.daily,
      spending_limit_weekly: limits.weekly,
      spending_limit_per_transaction: limits.per_transaction,
    })
    .eq('id', cardRecordId);

  if (error) {
    console.error('Spending limits update error:', error);
    return { error: 'Failed to update spending limits' };
  }

  revalidatePath('/dashboard/wallet');
  return { success: true };
}
