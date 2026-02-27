'use server';

import { createAdminClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/supabase/auth-helpers';
import { getProjectById } from '@/lib/queries/projects';
import { revalidatePath } from 'next/cache';
import { sendNotificationEmail, notificationEmailHtml } from '@/lib/email/resend';
import { createAuditEvent } from '@/lib/queries/audit-events';

export async function createProjectUpdate(data: {
  projectId: string;
  title: string;
  content: string;
  updateType: string;
  images: string[];
  fundsBreakdown: { label: string; amount: number }[] | null;
  learnings: string | null;
}) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'student') {
    return { error: 'Only students can post updates' };
  }

  const project = await getProjectById(data.projectId, { useAdmin: true });
  if (!project) return { error: 'Project not found' };
  if (project.student_id !== user.id) {
    return { error: 'You can only post updates on your own projects' };
  }

  const validStatuses = ['live', 'funded', 'completed'];
  if (!validStatuses.includes(project.status)) {
    return { error: 'Updates can only be posted on live, funded, or completed projects' };
  }

  if (!data.title.trim() || !data.content.trim()) {
    return { error: 'Title and content are required' };
  }

  const validTypes = ['general', 'impact_report', 'milestone_complete', 'thank_you'];
  if (!validTypes.includes(data.updateType)) {
    return { error: 'Invalid update type' };
  }

  const admin = createAdminClient();

  const { data: update, error } = await admin
    .from('project_updates')
    .insert({
      project_id: data.projectId,
      author_id: user.id,
      title: data.title.trim().slice(0, 200),
      content: data.content.trim().slice(0, 5000),
      update_type: data.updateType,
      images: data.images.slice(0, 5),
      funds_breakdown: data.fundsBreakdown,
      learnings: data.learnings?.trim().slice(0, 2000) || null,
      status: 'pending',
    })
    .select('id')
    .single();

  if (error || !update) {
    console.error('Failed to create update:', error);
    return { error: 'Failed to create update' };
  }

  await createAuditEvent(data.projectId, user.id, 'update_submitted', {
    update_id: update.id,
    update_type: data.updateType,
  });

  // Notify teacher
  if (project.mentor_id) {
    await admin.from('notifications').insert({
      user_id: project.mentor_id,
      type: 'update_submitted',
      title: 'New project update to review',
      message: `${user.full_name} posted an update on "${project.title}": "${data.title}"`,
      link: `/dashboard/verify-updates/${update.id}`,
    });
    await sendNotificationEmail(
      project.mentor_id,
      `New update to review — ${project.title}`,
      notificationEmailHtml(
        'New project update to review',
        `${user.full_name} posted an update on "${project.title}": "${data.title}". Please review and approve or reject.`,
        `/dashboard/verify-updates/${update.id}`
      )
    );
  }

  revalidatePath(`/dashboard/projects/${data.projectId}/updates`);
  revalidatePath('/dashboard/verify-updates');
  return { success: true };
}

export async function approveProjectUpdate(updateId: string) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'teacher') {
    return { error: 'Only teachers can approve updates' };
  }

  const admin = createAdminClient();

  const { data: update } = await admin
    .from('project_updates')
    .select('*, project:projects(title, student_id, mentor_id)')
    .eq('id', updateId)
    .single();

  if (!update) return { error: 'Update not found' };

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const project = Array.isArray(update.project) ? update.project[0] : update.project;
  /* eslint-enable @typescript-eslint/no-explicit-any */

  if (project?.mentor_id !== user.id) {
    return { error: 'You can only approve updates for projects you mentor' };
  }
  if (update.status !== 'pending') {
    return { error: 'This update has already been processed' };
  }

  await admin
    .from('project_updates')
    .update({
      status: 'approved',
      approved_by: user.id,
      approved_at: new Date().toISOString(),
    })
    .eq('id', updateId);

  await createAuditEvent(update.project_id, user.id, 'update_approved', {
    update_id: updateId,
  });

  // Notify student
  if (project?.student_id) {
    await admin.from('notifications').insert({
      user_id: project.student_id,
      type: 'update_approved',
      title: 'Update approved!',
      message: `Your update "${update.title}" has been approved and is now visible to backers.`,
      link: `/projects/${update.project_id}`,
    });
    await sendNotificationEmail(
      project.student_id,
      'Update approved!',
      notificationEmailHtml(
        'Your update has been approved!',
        `"${update.title}" is now visible on your project page.`,
        `/projects/${update.project_id}`
      )
    );
  }

  // Notify all backers
  const { data: backers } = await admin
    .from('backings')
    .select('backer_id, backer_email')
    .eq('project_id', update.project_id)
    .in('status', ['held', 'collected']);

  if (backers) {
    const notifiedEmails = new Set<string>();
    for (const backer of backers) {
      if (backer.backer_id) {
        await admin.from('notifications').insert({
          user_id: backer.backer_id,
          type: 'project_update',
          title: `New update on "${project?.title}"`,
          message: update.title,
          link: `/projects/${update.project_id}`,
        });
      }
      if (backer.backer_email && !notifiedEmails.has(backer.backer_email)) {
        notifiedEmails.add(backer.backer_email);
        await sendNotificationEmail(
          backer.backer_id || '',
          `Update on "${project?.title}"`,
          notificationEmailHtml(
            `New update on "${project?.title}"`,
            update.title,
            `/projects/${update.project_id}`
          )
        );
      }
    }
  }

  revalidatePath(`/dashboard/projects/${update.project_id}/updates`);
  revalidatePath('/dashboard/verify-updates');
  revalidatePath(`/projects/${update.project_id}`);
  return { success: true };
}

export async function rejectProjectUpdate(updateId: string, reason: string) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'teacher') {
    return { error: 'Only teachers can reject updates' };
  }

  if (!reason.trim()) {
    return { error: 'Please provide a reason for rejection' };
  }

  const admin = createAdminClient();

  const { data: update } = await admin
    .from('project_updates')
    .select('*, project:projects(title, student_id, mentor_id)')
    .eq('id', updateId)
    .single();

  if (!update) return { error: 'Update not found' };

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const project = Array.isArray(update.project) ? update.project[0] : update.project;
  /* eslint-enable @typescript-eslint/no-explicit-any */

  if (project?.mentor_id !== user.id) {
    return { error: 'You can only reject updates for projects you mentor' };
  }
  if (update.status !== 'pending') {
    return { error: 'This update has already been processed' };
  }

  await admin
    .from('project_updates')
    .update({
      status: 'rejected',
      rejection_reason: reason.trim().slice(0, 500),
    })
    .eq('id', updateId);

  await createAuditEvent(update.project_id, user.id, 'update_rejected', {
    update_id: updateId,
    reason: reason.trim(),
  });

  // Notify student
  if (project?.student_id) {
    await admin.from('notifications').insert({
      user_id: project.student_id,
      type: 'update_rejected',
      title: 'Update needs changes',
      message: `Your update "${update.title}" was not approved: ${reason.trim()}`,
      link: `/dashboard/projects/${update.project_id}/updates`,
    });
    await sendNotificationEmail(
      project.student_id,
      'Update needs changes',
      notificationEmailHtml(
        'Update needs changes',
        `Your update "${update.title}" was not approved: ${reason.trim()}`,
        `/dashboard/projects/${update.project_id}/updates`
      )
    );
  }

  revalidatePath(`/dashboard/projects/${update.project_id}/updates`);
  revalidatePath('/dashboard/verify-updates');
  return { success: true };
}
