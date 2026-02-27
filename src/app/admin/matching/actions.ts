'use server';

import { createAdminClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/supabase/auth-helpers';
import { getSponsorById } from '@/lib/queries/matching';
import { getProjectById } from '@/lib/queries/projects';
import { sendNotificationEmail, notificationEmailHtml } from '@/lib/email/resend';
import { revalidatePath } from 'next/cache';

export async function createSponsor(data: {
  name: string;
  description: string | null;
  sponsorType: 'corporate' | 'grant';
  matchRatio: number;
  maxMatchPerProject: number;
  totalBudget: number;
  contactEmail: string | null;
}) {
  await requireAdmin();

  if (!data.name.trim()) return { error: 'Name is required' };
  if (data.matchRatio <= 0) return { error: 'Match ratio must be positive' };
  if (data.totalBudget <= 0) return { error: 'Budget must be positive' };

  const admin = createAdminClient();

  const { error } = await admin.from('matching_sponsors').insert({
    name: data.name.trim(),
    description: data.description?.trim() || null,
    sponsor_type: data.sponsorType,
    match_ratio: data.matchRatio,
    max_match_per_project: data.maxMatchPerProject,
    total_budget: data.totalBudget,
    contact_email: data.contactEmail?.trim() || null,
    is_active: true,
  });

  if (error) {
    console.error('Failed to create sponsor:', error);
    return { error: 'Failed to create sponsor' };
  }

  revalidatePath('/admin/matching');
  return { success: true };
}

export async function updateSponsor(
  sponsorId: string,
  data: {
    name?: string;
    description?: string | null;
    matchRatio?: number;
    maxMatchPerProject?: number;
    totalBudget?: number;
    contactEmail?: string | null;
    isActive?: boolean;
  }
) {
  await requireAdmin();

  const admin = createAdminClient();

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const updates: Record<string, any> = { updated_at: new Date().toISOString() };
  /* eslint-enable @typescript-eslint/no-explicit-any */

  if (data.name !== undefined) updates.name = data.name.trim();
  if (data.description !== undefined) updates.description = data.description?.trim() || null;
  if (data.matchRatio !== undefined) updates.match_ratio = data.matchRatio;
  if (data.maxMatchPerProject !== undefined) updates.max_match_per_project = data.maxMatchPerProject;
  if (data.totalBudget !== undefined) updates.total_budget = data.totalBudget;
  if (data.contactEmail !== undefined) updates.contact_email = data.contactEmail?.trim() || null;
  if (data.isActive !== undefined) updates.is_active = data.isActive;

  const { error } = await admin
    .from('matching_sponsors')
    .update(updates)
    .eq('id', sponsorId);

  if (error) {
    console.error('Failed to update sponsor:', error);
    return { error: 'Failed to update sponsor' };
  }

  revalidatePath('/admin/matching');
  revalidatePath(`/admin/matching/${sponsorId}`);
  return { success: true };
}

export async function deactivateSponsor(sponsorId: string) {
  return updateSponsor(sponsorId, { isActive: false });
}

export async function assignSponsorToProject(
  sponsorId: string,
  projectId: string
) {
  await requireAdmin();

  const sponsor = await getSponsorById(sponsorId);
  if (!sponsor) return { error: 'Sponsor not found' };
  if (!sponsor.is_active) return { error: 'Sponsor is not active' };

  const project = await getProjectById(projectId, { useAdmin: true });
  if (!project) return { error: 'Project not found' };

  const admin = createAdminClient();

  // Check for existing pledge
  const { data: existing } = await admin
    .from('matching_pledges')
    .select('id')
    .eq('sponsor_id', sponsorId)
    .eq('project_id', projectId)
    .maybeSingle();

  if (existing) return { error: 'This sponsor is already assigned to this project' };

  const { error } = await admin.from('matching_pledges').insert({
    sponsor_id: sponsorId,
    project_id: projectId,
    match_ratio: sponsor.match_ratio,
    max_match_amount: sponsor.max_match_per_project,
    status: 'active',
  });

  if (error) {
    console.error('Failed to assign sponsor:', error);
    return { error: 'Failed to assign sponsor to project' };
  }

  // Notify student + teacher
  if (project.student_id) {
    await admin.from('notifications').insert({
      user_id: project.student_id,
      type: 'matching_activated',
      title: 'Matching activated!',
      message: `"${project.title}" is now matched by ${sponsor.name} at ${sponsor.match_ratio}x!`,
      link: `/projects/${projectId}`,
    });
    await sendNotificationEmail(
      project.student_id,
      `Matching activated — ${project.title}`,
      notificationEmailHtml(
        'Matching activated on your project!',
        `"${project.title}" is now matched by ${sponsor.name}. Every £1 backed becomes £${(1 + sponsor.match_ratio).toFixed(0)}!`,
        `/projects/${projectId}`
      )
    );
  }

  if (project.mentor_id) {
    await admin.from('notifications').insert({
      user_id: project.mentor_id,
      type: 'matching_activated',
      title: 'Matching activated',
      message: `"${project.title}" is now matched by ${sponsor.name} at ${sponsor.match_ratio}x.`,
      link: `/projects/${projectId}`,
    });
  }

  revalidatePath(`/admin/matching/${sponsorId}`);
  revalidatePath(`/projects/${projectId}`);
  return { success: true };
}

export async function removePledge(pledgeId: string) {
  await requireAdmin();

  const admin = createAdminClient();

  const { error } = await admin
    .from('matching_pledges')
    .update({ status: 'inactive', updated_at: new Date().toISOString() })
    .eq('id', pledgeId);

  if (error) {
    console.error('Failed to remove pledge:', error);
    return { error: 'Failed to remove pledge' };
  }

  revalidatePath('/admin/matching');
  return { success: true };
}
