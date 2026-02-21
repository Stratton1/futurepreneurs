'use server';

import { createClient, createAdminClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/supabase/auth-helpers';
import { revalidatePath } from 'next/cache';

/** Create a new reward tier */
export async function createRewardTier(
  projectId: string,
  data: { title: string; description: string; minAmount: number; maxClaims: number | null }
) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'student') {
    return { error: 'Only students can create reward tiers' };
  }

  if (!data.title.trim() || data.title.trim().length < 3) {
    return { error: 'Title must be at least 3 characters' };
  }
  if (data.minAmount <= 0) {
    return { error: 'Minimum amount must be greater than £0' };
  }

  const supabase = await createClient();

  // Verify project belongs to student and is a draft
  const { data: project } = await supabase
    .from('projects')
    .select('id, student_id, status')
    .eq('id', projectId)
    .single();

  if (!project) return { error: 'Project not found' };
  if (project.student_id !== user.id) return { error: 'You can only manage your own projects' };
  if (project.status !== 'draft') return { error: 'Reward tiers can only be added to draft projects' };

  // Get current count for sort_order
  const { count } = await supabase
    .from('reward_tiers')
    .select('id', { count: 'exact', head: true })
    .eq('project_id', projectId);

  const { error } = await supabase.from('reward_tiers').insert({
    project_id: projectId,
    title: data.title.trim(),
    description: data.description.trim(),
    min_amount: data.minAmount,
    max_claims: data.maxClaims,
    sort_order: (count ?? 0),
  });

  if (error) return { error: 'Failed to create reward tier' };

  revalidatePath(`/dashboard/projects/${projectId}/rewards`);
  return { success: true };
}

/** Delete a reward tier */
export async function deleteRewardTier(projectId: string, tierId: string) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'student') {
    return { error: 'Only students can delete reward tiers' };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from('reward_tiers')
    .delete()
    .eq('id', tierId)
    .eq('project_id', projectId);

  if (error) return { error: 'Failed to delete reward tier' };

  revalidatePath(`/dashboard/projects/${projectId}/rewards`);
  return { success: true };
}

/** Teacher approves a reward tier */
export async function approveRewardTier(projectId: string, tierId: string) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'teacher') {
    return { error: 'Only teachers can approve reward tiers' };
  }

  const admin = createAdminClient();

  // Verify teacher is mentor
  const { data: project } = await admin
    .from('projects')
    .select('mentor_id')
    .eq('id', projectId)
    .single();

  if (!project || project.mentor_id !== user.id) {
    return { error: 'You are not the mentor for this project' };
  }

  const { error } = await admin
    .from('reward_tiers')
    .update({ approval_status: 'approved', approved_by: user.id })
    .eq('id', tierId)
    .eq('project_id', projectId);

  if (error) return { error: 'Failed to approve reward tier' };

  revalidatePath(`/dashboard/verify/${projectId}`);
  return { success: true };
}

/** Teacher rejects a reward tier */
export async function rejectRewardTier(projectId: string, tierId: string) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'teacher') {
    return { error: 'Only teachers can reject reward tiers' };
  }

  const admin = createAdminClient();

  const { data: project } = await admin
    .from('projects')
    .select('mentor_id')
    .eq('id', projectId)
    .single();

  if (!project || project.mentor_id !== user.id) {
    return { error: 'You are not the mentor for this project' };
  }

  const { error } = await admin
    .from('reward_tiers')
    .update({ approval_status: 'rejected', approved_by: user.id })
    .eq('id', tierId)
    .eq('project_id', projectId);

  if (error) return { error: 'Failed to reject reward tier' };

  revalidatePath(`/dashboard/verify/${projectId}`);
  return { success: true };
}
