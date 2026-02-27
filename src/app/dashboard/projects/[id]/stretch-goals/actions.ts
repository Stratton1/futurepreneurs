'use server';

import { createAdminClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/supabase/auth-helpers';
import { getProjectById } from '@/lib/queries/projects';
import { getStretchGoalById } from '@/lib/queries/stretch-goals';
import { revalidatePath } from 'next/cache';
import { sendNotificationEmail, notificationEmailHtml } from '@/lib/email/resend';
import { createAuditEvent } from '@/lib/queries/audit-events';

export async function createStretchGoal(data: {
  projectId: string;
  title: string;
  description: string;
  targetAmount: number;
}) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'student') {
    return { error: 'Only students can create stretch goals' };
  }

  const project = await getProjectById(data.projectId, { useAdmin: true });
  if (!project) return { error: 'Project not found' };
  if (project.student_id !== user.id) {
    return { error: 'You can only add stretch goals to your own projects' };
  }

  const validStatuses = ['live', 'funded'];
  if (!validStatuses.includes(project.status)) {
    return { error: 'Stretch goals can only be added to live or funded projects' };
  }

  if (!data.title.trim() || !data.description.trim()) {
    return { error: 'Title and description are required' };
  }

  if (data.targetAmount <= Number(project.goal_amount)) {
    return { error: `Target must be greater than the project goal (£${Number(project.goal_amount).toFixed(0)})` };
  }

  const admin = createAdminClient();

  // Get current max sort_order
  const { data: existing } = await admin
    .from('stretch_goals')
    .select('sort_order')
    .eq('project_id', data.projectId)
    .order('sort_order', { ascending: false })
    .limit(1);

  const nextOrder = existing && existing.length > 0 ? existing[0].sort_order + 1 : 0;

  const { data: goal, error } = await admin
    .from('stretch_goals')
    .insert({
      project_id: data.projectId,
      title: data.title.trim().slice(0, 200),
      description: data.description.trim().slice(0, 1000),
      target_amount: data.targetAmount,
      sort_order: nextOrder,
      status: 'pending_approval',
    })
    .select('id')
    .single();

  if (error || !goal) {
    console.error('Failed to create stretch goal:', error);
    return { error: 'Failed to create stretch goal' };
  }

  await createAuditEvent(data.projectId, user.id, 'stretch_goal_submitted', {
    goal_id: goal.id,
    target_amount: data.targetAmount,
  });

  if (project.mentor_id) {
    await admin.from('notifications').insert({
      user_id: project.mentor_id,
      type: 'stretch_goal_submitted',
      title: 'New stretch goal to review',
      message: `${user.full_name} added a stretch goal on "${project.title}": "${data.title}" (£${data.targetAmount.toFixed(0)})`,
      link: '/dashboard/verify-stretch-goals',
    });
    await sendNotificationEmail(
      project.mentor_id,
      `New stretch goal — ${project.title}`,
      notificationEmailHtml(
        'New stretch goal to review',
        `${user.full_name} added a stretch goal on "${project.title}": "${data.title}" (target: £${data.targetAmount.toFixed(0)}).`,
        '/dashboard/verify-stretch-goals'
      )
    );
  }

  revalidatePath(`/dashboard/projects/${data.projectId}/stretch-goals`);
  revalidatePath('/dashboard/verify-stretch-goals');
  return { success: true };
}

export async function deleteStretchGoal(goalId: string) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'student') {
    return { error: 'Only students can delete stretch goals' };
  }

  const goal = await getStretchGoalById(goalId);
  if (!goal) return { error: 'Stretch goal not found' };

  const project = await getProjectById(goal.project_id, { useAdmin: true });
  if (!project || project.student_id !== user.id) {
    return { error: 'You can only delete your own stretch goals' };
  }

  if (!['draft', 'rejected'].includes(goal.status)) {
    return { error: 'Only draft or rejected stretch goals can be deleted' };
  }

  const admin = createAdminClient();
  await admin.from('stretch_goals').delete().eq('id', goalId);

  revalidatePath(`/dashboard/projects/${goal.project_id}/stretch-goals`);
  return { success: true };
}

export async function approveStretchGoal(goalId: string) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'teacher') {
    return { error: 'Only teachers can approve stretch goals' };
  }

  const goal = await getStretchGoalById(goalId);
  if (!goal) return { error: 'Stretch goal not found' };
  if (goal.status !== 'pending_approval') {
    return { error: 'This goal has already been processed' };
  }

  const project = await getProjectById(goal.project_id, { useAdmin: true });
  if (!project || project.mentor_id !== user.id) {
    return { error: 'You can only approve stretch goals for projects you mentor' };
  }

  const admin = createAdminClient();

  // Check if already unlocked (total_raised >= target)
  const isUnlocked = Number(project.total_raised) >= Number(goal.target_amount);

  await admin
    .from('stretch_goals')
    .update({
      status: isUnlocked ? 'unlocked' : 'approved',
      approved_by: user.id,
      approved_at: new Date().toISOString(),
      unlocked_at: isUnlocked ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', goalId);

  await createAuditEvent(goal.project_id, user.id, 'stretch_goal_approved', {
    goal_id: goalId,
    auto_unlocked: isUnlocked,
  });

  await admin.from('notifications').insert({
    user_id: project.student_id,
    type: 'stretch_goal_approved',
    title: isUnlocked ? 'Stretch goal approved & unlocked!' : 'Stretch goal approved!',
    message: `Your stretch goal "${goal.title}" has been approved${isUnlocked ? ' and is already unlocked!' : '.'}`,
    link: `/dashboard/projects/${goal.project_id}/stretch-goals`,
  });
  await sendNotificationEmail(
    project.student_id,
    isUnlocked ? 'Stretch goal unlocked!' : 'Stretch goal approved',
    notificationEmailHtml(
      isUnlocked ? 'Stretch goal approved & unlocked!' : 'Stretch goal approved!',
      `Your stretch goal "${goal.title}" on "${project.title}" has been approved${isUnlocked ? ' and is already unlocked!' : '.'}`,
      `/dashboard/projects/${goal.project_id}/stretch-goals`
    )
  );

  revalidatePath(`/dashboard/projects/${goal.project_id}/stretch-goals`);
  revalidatePath('/dashboard/verify-stretch-goals');
  revalidatePath(`/projects/${goal.project_id}`);
  return { success: true };
}

export async function rejectStretchGoal(goalId: string) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'teacher') {
    return { error: 'Only teachers can reject stretch goals' };
  }

  const goal = await getStretchGoalById(goalId);
  if (!goal) return { error: 'Stretch goal not found' };
  if (goal.status !== 'pending_approval') {
    return { error: 'This goal has already been processed' };
  }

  const project = await getProjectById(goal.project_id, { useAdmin: true });
  if (!project || project.mentor_id !== user.id) {
    return { error: 'You can only reject stretch goals for projects you mentor' };
  }

  const admin = createAdminClient();

  await admin
    .from('stretch_goals')
    .update({
      status: 'rejected',
      updated_at: new Date().toISOString(),
    })
    .eq('id', goalId);

  await createAuditEvent(goal.project_id, user.id, 'stretch_goal_rejected', {
    goal_id: goalId,
  });

  await admin.from('notifications').insert({
    user_id: project.student_id,
    type: 'stretch_goal_rejected',
    title: 'Stretch goal not approved',
    message: `Your stretch goal "${goal.title}" was not approved.`,
    link: `/dashboard/projects/${goal.project_id}/stretch-goals`,
  });

  revalidatePath(`/dashboard/projects/${goal.project_id}/stretch-goals`);
  revalidatePath('/dashboard/verify-stretch-goals');
  return { success: true };
}
