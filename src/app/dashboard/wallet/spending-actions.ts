'use server';

import { createAdminClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/supabase/auth-helpers';
import { getCustodialAccountForStudent, getCustodialAccountById } from '@/lib/queries/custodial-accounts';
import { getWalletBalanceForProject, holdFundsInWallet, returnHeldFundsToAvailable } from '@/lib/queries/wallet-balances';
import { getSpendingRequestById } from '@/lib/queries/spending-requests';
import { checkVelocityLimits } from '@/lib/wallet/velocity-limits';
import { sendNotificationEmail, notificationEmailHtml } from '@/lib/email/resend';
import { revalidatePath } from 'next/cache';

const COOLING_OFF_HOURS = 1;

/** Student creates a spending request. */
export async function createSpendingRequest(data: {
  projectId: string;
  milestoneId?: string;
  vendorName: string;
  vendorUrl?: string;
  amount: number;
  reason: string;
}) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'student') {
    return { error: 'Only students can create spending requests' };
  }

  if (data.amount <= 0) return { error: 'Amount must be positive' };
  if (!data.vendorName.trim()) return { error: 'Vendor name is required' };
  if (!data.reason.trim()) return { error: 'Reason is required' };

  const admin = createAdminClient();

  // Get custodial account
  const custodialAccount = await getCustodialAccountForStudent(user.id);
  if (!custodialAccount) {
    return { error: 'No wallet account found. Ask your parent to set up your wallet.' };
  }
  if (custodialAccount.kyc_status === 'failed') {
    return { error: 'Wallet verification has failed. Please contact support.' };
  }

  // Get project and verify ownership
  const { data: project } = await admin
    .from('projects')
    .select('id, student_id, mentor_id, title, status')
    .eq('id', data.projectId)
    .single();

  if (!project) return { error: 'Project not found' };
  if (project.student_id !== user.id) return { error: 'Not your project' };
  if (project.status !== 'funded' && project.status !== 'completed') {
    return { error: 'Spending requests are only available for funded projects' };
  }
  if (!project.mentor_id) {
    return { error: 'Project must have an assigned mentor' };
  }

  // Check wallet balance
  const wallet = await getWalletBalanceForProject(custodialAccount.id, data.projectId);
  if (!wallet || Number(wallet.available_balance) < data.amount) {
    return { error: 'Insufficient wallet balance for this request' };
  }

  // Check velocity limits
  const velocityCheck = await checkVelocityLimits(
    custodialAccount.id,
    data.projectId,
    data.amount
  );
  if (!velocityCheck.allowed) {
    return { error: velocityCheck.reason ?? 'Spending limit exceeded' };
  }

  // Validate milestone if provided
  if (data.milestoneId) {
    const { data: milestone } = await admin
      .from('milestones')
      .select('id, project_id')
      .eq('id', data.milestoneId)
      .eq('project_id', data.projectId)
      .single();

    if (!milestone) return { error: 'Milestone not found for this project' };
  }

  // Create spending request
  const { data: request, error: insertError } = await admin
    .from('spending_requests')
    .insert({
      custodial_account_id: custodialAccount.id,
      project_id: data.projectId,
      milestone_id: data.milestoneId || null,
      student_id: user.id,
      parent_id: custodialAccount.parent_id,
      mentor_id: project.mentor_id,
      vendor_name: data.vendorName.trim(),
      vendor_url: data.vendorUrl?.trim() || null,
      amount: data.amount,
      reason: data.reason.trim(),
      status: 'pending_parent',
    })
    .select('id')
    .single();

  if (insertError || !request) {
    console.error('Spending request insert error:', insertError);
    return { error: 'Failed to create spending request' };
  }

  // Notify parent
  await admin.from('notifications').insert({
    user_id: custodialAccount.parent_id,
    type: 'spending_request',
    title: 'New spending request',
    message: `${user.full_name} wants to spend £${data.amount.toFixed(2)} at ${data.vendorName} for "${project.title}".`,
    link: '/dashboard/wallet/parent',
  });
  await sendNotificationEmail(
    custodialAccount.parent_id,
    'New spending request needs your approval',
    notificationEmailHtml(
      'New spending request',
      `${user.full_name} wants to spend £${data.amount.toFixed(2)} at ${data.vendorName} for "${project.title}". Please review and approve or decline.`,
      '/dashboard/wallet/parent'
    )
  );

  revalidatePath('/dashboard/wallet');
  return { success: true, requestId: request.id };
}

/** Parent or mentor approves a spending request. */
export async function approveSpendingRequest(requestId: string) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Not authenticated' };

  const request = await getSpendingRequestById(requestId);
  if (!request) return { error: 'Spending request not found' };

  const admin = createAdminClient();
  const now = new Date().toISOString();

  if (user.role === 'parent' && user.id === request.parent_id) {
    // Parent approval
    if (request.status !== 'pending_parent') {
      return { error: 'This request is not awaiting parent approval' };
    }

    // Hold the funds
    const wallet = await getWalletBalanceForProject(request.custodial_account_id, request.project_id);
    if (!wallet || Number(wallet.available_balance) < Number(request.amount)) {
      return { error: 'Insufficient wallet balance' };
    }
    await holdFundsInWallet(wallet.id, Number(request.amount));

    // Update request to pending_mentor
    await admin
      .from('spending_requests')
      .update({ status: 'pending_mentor', parent_decision_at: now })
      .eq('id', requestId);

    // Log the approval
    await admin.from('approval_logs').insert({
      spending_request_id: requestId,
      approver_id: user.id,
      approver_role: 'parent',
      decision: 'approved',
    });

    // Notify mentor
    await admin.from('notifications').insert({
      user_id: request.mentor_id,
      type: 'spending_request_mentor',
      title: 'Spending request needs your approval',
      message: `Parent approved £${Number(request.amount).toFixed(2)} at ${request.vendor_name} for "${request.project_title}". Your approval is also needed.`,
      link: '/dashboard/wallet/mentor',
    });
    await sendNotificationEmail(
      request.mentor_id,
      'Spending request needs your approval',
      notificationEmailHtml(
        'Spending request needs your approval',
        `A parent has approved £${Number(request.amount).toFixed(2)} at ${request.vendor_name} for "${request.project_title}". As the project mentor, your approval is also needed.`,
        '/dashboard/wallet/mentor'
      )
    );

    revalidatePath('/dashboard/wallet');
    return { success: true };
  }

  if (user.role === 'teacher' && user.id === request.mentor_id) {
    // Mentor approval
    if (request.status !== 'pending_mentor') {
      return { error: 'This request is not awaiting mentor approval' };
    }

    const coolingOffEnds = new Date(Date.now() + COOLING_OFF_HOURS * 60 * 60 * 1000).toISOString();

    // Update to approved with cooling-off period
    await admin
      .from('spending_requests')
      .update({
        status: 'approved',
        mentor_decision_at: now,
        cooling_off_ends_at: coolingOffEnds,
      })
      .eq('id', requestId);

    // Log the approval
    await admin.from('approval_logs').insert({
      spending_request_id: requestId,
      approver_id: user.id,
      approver_role: 'mentor',
      decision: 'approved',
    });

    // Notify student
    await admin.from('notifications').insert({
      user_id: request.student_id,
      type: 'spending_approved',
      title: 'Spending request approved!',
      message: `Your request for £${Number(request.amount).toFixed(2)} at ${request.vendor_name} has been approved! Your card will be activated after a 1-hour cooling-off period.`,
      link: '/dashboard/wallet',
    });
    await sendNotificationEmail(
      request.student_id,
      'Spending request approved!',
      notificationEmailHtml(
        'Spending request approved!',
        `Your request for £${Number(request.amount).toFixed(2)} at ${request.vendor_name} has been approved! Your card will be activated after a 1-hour cooling-off period.`,
        '/dashboard/wallet'
      )
    );

    revalidatePath('/dashboard/wallet');
    return { success: true };
  }

  return { error: 'You are not authorized to approve this request' };
}

/** Parent or mentor declines a spending request. */
export async function declineSpendingRequest(requestId: string, reason: string) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Not authenticated' };

  const request = await getSpendingRequestById(requestId);
  if (!request) return { error: 'Spending request not found' };

  const admin = createAdminClient();
  const now = new Date().toISOString();

  let declinedBy: 'parent' | 'mentor';
  let newStatus: 'declined_parent' | 'declined_mentor';

  if (user.role === 'parent' && user.id === request.parent_id && request.status === 'pending_parent') {
    declinedBy = 'parent';
    newStatus = 'declined_parent';
  } else if (user.role === 'teacher' && user.id === request.mentor_id && request.status === 'pending_mentor') {
    declinedBy = 'mentor';
    newStatus = 'declined_mentor';
    // Return held funds since parent had already approved
    const wallet = await getWalletBalanceForProject(request.custodial_account_id, request.project_id);
    if (wallet) {
      await returnHeldFundsToAvailable(wallet.id, Number(request.amount));
    }
  } else {
    return { error: 'You are not authorized to decline this request at this stage' };
  }

  await admin
    .from('spending_requests')
    .update({
      status: newStatus,
      ...(declinedBy === 'parent'
        ? { parent_decision_at: now }
        : { mentor_decision_at: now }),
    })
    .eq('id', requestId);

  // Log the decline
  await admin.from('approval_logs').insert({
    spending_request_id: requestId,
    approver_id: user.id,
    approver_role: declinedBy,
    decision: 'declined',
    reason: reason.trim() || null,
  });

  // Notify student
  const reasonText = reason.trim() ? `: "${reason.trim()}"` : '';
  await admin.from('notifications').insert({
    user_id: request.student_id,
    type: 'spending_declined',
    title: 'Spending request declined',
    message: `Your request for £${Number(request.amount).toFixed(2)} at ${request.vendor_name} was declined by your ${declinedBy}${reasonText}`,
    link: '/dashboard/wallet',
  });
  await sendNotificationEmail(
    request.student_id,
    'Spending request declined',
    notificationEmailHtml(
      'Spending request declined',
      `Your request for £${Number(request.amount).toFixed(2)} at ${request.vendor_name} was declined by your ${declinedBy}${reasonText}`,
      '/dashboard/wallet'
    )
  );

  revalidatePath('/dashboard/wallet');
  return { success: true };
}

/** Reverse an approval during cooling-off period. Either parent or mentor can reverse. */
export async function reverseApproval(requestId: string, reason: string) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Not authenticated' };

  const request = await getSpendingRequestById(requestId);
  if (!request) return { error: 'Spending request not found' };

  if (request.status !== 'approved') {
    return { error: 'Only approved requests can be reversed' };
  }

  // Check cooling-off period
  if (request.cooling_off_ends_at && new Date(request.cooling_off_ends_at) < new Date()) {
    return { error: 'Cooling-off period has expired. Contact support for assistance.' };
  }

  // Must be parent or mentor on this request
  let reverserRole: 'parent' | 'mentor';
  if (user.id === request.parent_id) {
    reverserRole = 'parent';
  } else if (user.id === request.mentor_id) {
    reverserRole = 'mentor';
  } else {
    return { error: 'Not authorized to reverse this request' };
  }

  const admin = createAdminClient();

  // Return held funds
  const wallet = await getWalletBalanceForProject(request.custodial_account_id, request.project_id);
  if (wallet) {
    await returnHeldFundsToAvailable(wallet.id, Number(request.amount));
  }

  await admin
    .from('spending_requests')
    .update({ status: 'reversed' })
    .eq('id', requestId);

  await admin.from('approval_logs').insert({
    spending_request_id: requestId,
    approver_id: user.id,
    approver_role: reverserRole,
    decision: 'reversed',
    reason: reason.trim() || null,
  });

  // Notify student
  await admin.from('notifications').insert({
    user_id: request.student_id,
    type: 'spending_reversed',
    title: 'Spending approval reversed',
    message: `Your approved request for £${Number(request.amount).toFixed(2)} at ${request.vendor_name} has been reversed by your ${reverserRole}.`,
    link: '/dashboard/wallet',
  });

  revalidatePath('/dashboard/wallet');
  return { success: true };
}

/** Student uploads a receipt for a completed spending request. */
export async function uploadReceipt(requestId: string, receiptUrl: string) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'student') {
    return { error: 'Only students can upload receipts' };
  }

  const admin = createAdminClient();

  const { data: request } = await admin
    .from('spending_requests')
    .select('id, student_id, status')
    .eq('id', requestId)
    .single();

  if (!request) return { error: 'Spending request not found' };
  if (request.student_id !== user.id) return { error: 'Not your request' };
  if (request.status !== 'completed' && request.status !== 'funded') {
    return { error: 'Receipts can only be uploaded for completed transactions' };
  }

  const { error } = await admin
    .from('spending_requests')
    .update({
      receipt_url: receiptUrl,
      receipt_uploaded_at: new Date().toISOString(),
    })
    .eq('id', requestId);

  if (error) {
    console.error('Receipt upload error:', error);
    return { error: 'Failed to save receipt' };
  }

  revalidatePath('/dashboard/wallet');
  return { success: true };
}
