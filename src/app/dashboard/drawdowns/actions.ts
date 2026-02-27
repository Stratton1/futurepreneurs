'use server';

import { createAdminClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/supabase/auth-helpers';
import { getProjectById } from '@/lib/queries/projects';
import {
  getApprovedAmountForMilestone,
  getMilestoneRemaining,
} from '@/lib/queries/drawdowns';
import { canRequestDrawdown } from '@/lib/project-status';
import { revalidatePath } from 'next/cache';
import { sendNotificationEmail, notificationEmailHtml } from '@/lib/email/resend';
import { awardMilestoneMaster } from '@/lib/badges';
import { getCustodialAccountForProject } from '@/lib/queries/custodial-accounts';
import { addFundsToWallet } from '@/lib/queries/wallet-balances';
import { createAuditEvent } from '@/lib/queries/audit-events';

/** Student creates a drawdown request for a milestone. */
export async function createDrawdownRequest(
  projectId: string,
  milestoneId: string,
  amount: number,
  reason: string | null
) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'student') {
    return { error: 'Only students can request drawdowns' };
  }

  const project = await getProjectById(projectId, { useAdmin: true });
  if (!project) return { error: 'Project not found' };
  if (project.student_id !== user.id) {
    return { error: 'You can only request drawdowns for your own projects' };
  }
  if (!canRequestDrawdown(project.status)) {
    return { error: 'Drawdowns are only available for funded projects' };
  }

  const milestone = project.milestones.find((m) => m.id === milestoneId);
  if (!milestone) return { error: 'Milestone not found' };
  if (milestone.status === 'disbursed') {
    return { error: 'This milestone has already been fully disbursed' };
  }

  const remaining = await getMilestoneRemaining(milestone);
  if (amount <= 0 || amount > remaining) {
    return {
      error: `Amount must be between £1 and £${remaining.toFixed(2)} (remaining for this milestone)`,
    };
  }

  const admin = createAdminClient();

  const { data: drawdown, error: insertError } = await admin
    .from('drawdown_requests')
    .insert({
      project_id: projectId,
      milestone_id: milestoneId,
      requested_by: user.id,
      amount,
      reason: reason?.trim() || null,
      status: 'pending',
    })
    .select('id')
    .single();

  if (insertError || !drawdown) {
    console.error('Drawdown insert error:', insertError);
    return { error: 'Failed to create drawdown request' };
  }

  await createAuditEvent(projectId, user.id, 'drawdown_requested', {
    drawdown_id: drawdown.id,
    milestone_id: milestoneId,
    amount,
  });

  if (project.mentor_id) {
    await admin.from('notifications').insert({
      user_id: project.mentor_id,
      type: 'drawdown_request',
      title: 'New drawdown request',
      message: `${user.full_name} has requested £${amount.toFixed(2)} for "${milestone.title}" on "${project.title}".`,
      link: '/dashboard/drawdowns',
    });
    await sendNotificationEmail(
      project.mentor_id,
      'New drawdown request',
      notificationEmailHtml(
        'New drawdown request',
        `${user.full_name} has requested £${amount.toFixed(2)} for "${milestone.title}" on "${project.title}".`,
        '/dashboard/drawdowns'
      )
    );
  }

  revalidatePath('/dashboard/projects');
  revalidatePath(`/dashboard/projects/${projectId}/drawdowns`);
  revalidatePath('/dashboard/drawdowns');
  return { success: true };
}

/** Teacher approves a drawdown request. Updates milestone status; disbursement recorded (stripe_transfer_id reserved for Epic 4). */
export async function approveDrawdownRequest(drawdownId: string) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'teacher') {
    return { error: 'Only teachers can approve drawdowns' };
  }

  const admin = createAdminClient();

  const { data: drawdown, error: fetchError } = await admin
    .from('drawdown_requests')
    .select('*')
    .eq('id', drawdownId)
    .single();

  if (fetchError || !drawdown) return { error: 'Drawdown request not found' };
  if (drawdown.status !== 'pending') {
    return { error: 'This request has already been processed' };
  }

  const project = await getProjectById(drawdown.project_id, { useAdmin: true });
  if (!project || project.mentor_id !== user.id) {
    return { error: 'You can only approve drawdowns for projects you mentor' };
  }

  // First-drawdown gate: check if parent has acknowledged
  const { count: priorApproved } = await admin
    .from('drawdown_requests')
    .select('id', { count: 'exact', head: true })
    .eq('project_id', drawdown.project_id)
    .eq('status', 'approved');

  if ((priorApproved ?? 0) === 0) {
    const { data: consent } = await admin
      .from('parental_consents')
      .select('first_drawdown_acknowledged, parent_id')
      .eq('project_id', drawdown.project_id)
      .eq('status', 'approved')
      .maybeSingle();

    if (consent && !consent.first_drawdown_acknowledged) {
      // Notify parent that their acknowledgment is needed
      if (consent.parent_id) {
        await admin.from('notifications').insert({
          user_id: consent.parent_id,
          type: 'first_drawdown_gate',
          title: 'First drawdown pending your acknowledgment',
          message: `Your child has requested their first drawdown for "${project.title}". Please visit the Parent Hub to acknowledge.`,
          link: '/dashboard/parent-hub',
        });
        await sendNotificationEmail(
          consent.parent_id,
          `First drawdown pending — ${project.title}`,
          notificationEmailHtml(
            'First drawdown pending your acknowledgment',
            `Your child has requested their first drawdown for "${project.title}". Please visit the Parent Hub to acknowledge before the teacher can approve.`,
            '/dashboard/parent-hub'
          )
        );
      }
      return { error: 'The parent must acknowledge the first drawdown before it can be approved. They have been notified.' };
    }
  }

  const { error: updateError } = await admin
    .from('drawdown_requests')
    .update({
      status: 'approved',
      approved_by: user.id,
      approved_at: new Date().toISOString(),
    })
    .eq('id', drawdownId);

  if (updateError) {
    console.error('Drawdown approve error:', updateError);
    return { error: 'Failed to approve drawdown' };
  }

  await createAuditEvent(drawdown.project_id, user.id, 'drawdown_approved', {
    drawdown_id: drawdownId,
    amount: Number(drawdown.amount),
  });

  // Fund wallet if custodial account exists (Epic 4 integration)
  const custodialAccount = await getCustodialAccountForProject(drawdown.project_id);
  if (custodialAccount && custodialAccount.is_active) {
    try {
      await addFundsToWallet(
        custodialAccount.id,
        drawdown.project_id,
        Number(drawdown.amount)
      );
    } catch (err) {
      console.error('Wallet funding error (non-blocking):', err);
    }
  }

  const approvedSum = await getApprovedAmountForMilestone(drawdown.milestone_id);
  const milestone = project.milestones.find((m) => m.id === drawdown.milestone_id);
  const milestoneAmount = milestone ? Number(milestone.amount) : 0;
  const isFullyDisbursed = approvedSum >= milestoneAmount;

  if (milestone) {
    await admin
      .from('milestones')
      .update({
        status: isFullyDisbursed ? 'disbursed' : 'approved',
        updated_at: new Date().toISOString(),
      })
      .eq('id', drawdown.milestone_id);
  }

  const walletMsg = custodialAccount
    ? ' Funds have been added to the wallet.'
    : '';

  await admin.from('notifications').insert({
    user_id: project.student_id,
    type: 'drawdown_approved',
    title: 'Drawdown approved',
    message: `${user.full_name} has approved your request for £${Number(drawdown.amount).toFixed(2)}.${walletMsg}`,
    link: custodialAccount ? '/dashboard/wallet' : `/dashboard/projects/${project.id}/drawdowns`,
  });
  await sendNotificationEmail(
    project.student_id,
    'Drawdown approved',
    notificationEmailHtml(
      'Drawdown approved',
      `${user.full_name} has approved your request for £${Number(drawdown.amount).toFixed(2)}.${walletMsg}`,
      custodialAccount ? '/dashboard/wallet' : `/dashboard/projects/${project.id}/drawdowns`
    )
  );

  await awardMilestoneMaster(project.student_id, drawdown.project_id);

  revalidatePath('/dashboard/drawdowns');
  revalidatePath(`/dashboard/projects/${drawdown.project_id}/drawdowns`);
  return { success: true };
}

/** Teacher rejects a drawdown request. */
export async function rejectDrawdownRequest(drawdownId: string, reason: string | null) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'teacher') {
    return { error: 'Only teachers can reject drawdowns' };
  }

  const admin = createAdminClient();

  const { data: drawdown, error: fetchError } = await admin
    .from('drawdown_requests')
    .select('*')
    .eq('id', drawdownId)
    .single();

  if (fetchError || !drawdown) return { error: 'Drawdown request not found' };
  if (drawdown.status !== 'pending') {
    return { error: 'This request has already been processed' };
  }

  const project = await getProjectById(drawdown.project_id, { useAdmin: true });
  if (!project || project.mentor_id !== user.id) {
    return { error: 'You can only reject drawdowns for projects you mentor' };
  }

  const { error: updateError } = await admin
    .from('drawdown_requests')
    .update({
      status: 'rejected',
      approved_by: user.id,
      approved_at: new Date().toISOString(),
    })
    .eq('id', drawdownId);

  if (updateError) {
    console.error('Drawdown reject error:', updateError);
    return { error: 'Failed to reject drawdown' };
  }

  await createAuditEvent(drawdown.project_id, user.id, 'drawdown_rejected', {
    drawdown_id: drawdownId,
    amount: Number(drawdown.amount),
    reason: reason?.trim() || null,
  });

  const reasonText = reason?.trim() ? `: ${reason.trim()}` : '';
  await admin.from('notifications').insert({
    user_id: project.student_id,
    type: 'drawdown_rejected',
    title: 'Drawdown not approved',
    message: `${user.full_name} was unable to approve your request for £${Number(drawdown.amount).toFixed(2)}${reasonText}`,
    link: `/dashboard/projects/${project.id}/drawdowns`,
  });
  await sendNotificationEmail(
    project.student_id,
    'Drawdown not approved',
    notificationEmailHtml(
      'Drawdown not approved',
      `${user.full_name} was unable to approve your request for £${Number(drawdown.amount).toFixed(2)}${reasonText}`,
      `/dashboard/projects/${project.id}/drawdowns`
    )
  );

  revalidatePath('/dashboard/drawdowns');
  revalidatePath(`/dashboard/projects/${drawdown.project_id}/drawdowns`);
  return { success: true };
}
