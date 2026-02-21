'use server';

import { createClient, createAdminClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/supabase/auth-helpers';
import { revalidatePath } from 'next/cache';
import type { LogoConfig } from '@/lib/logo-templates';

/** Save a logo configuration for a project (student action) */
export async function saveLogo(projectId: string, config: LogoConfig) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Not authenticated' };

  const supabase = await createClient();

  // Verify ownership and draft status
  const { data: project } = await supabase
    .from('projects')
    .select('id, student_id, status')
    .eq('id', projectId)
    .single();

  if (!project) return { error: 'Project not found' };
  if (project.student_id !== user.id) return { error: 'Not your project' };
  if (project.status !== 'draft') return { error: 'Project can only be edited in draft status' };

  const { error } = await supabase
    .from('projects')
    .update({
      logo_config: config,
      logo_approved: false,
    })
    .eq('id', projectId);

  if (error) return { error: 'Failed to save logo' };

  revalidatePath(`/dashboard/projects/${projectId}/logo`);
  revalidatePath(`/dashboard/projects/${projectId}/edit`);
  return { success: true };
}

/** Remove logo from a project (student action) */
export async function removeLogo(projectId: string) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Not authenticated' };

  const supabase = await createClient();

  const { data: project } = await supabase
    .from('projects')
    .select('id, student_id, status')
    .eq('id', projectId)
    .single();

  if (!project) return { error: 'Project not found' };
  if (project.student_id !== user.id) return { error: 'Not your project' };
  if (project.status !== 'draft') return { error: 'Project can only be edited in draft status' };

  const { error } = await supabase
    .from('projects')
    .update({
      logo_config: null,
      logo_url: null,
      logo_approved: false,
    })
    .eq('id', projectId);

  if (error) return { error: 'Failed to remove logo' };

  revalidatePath(`/dashboard/projects/${projectId}/logo`);
  revalidatePath(`/dashboard/projects/${projectId}/edit`);
  return { success: true };
}

/** Approve a project logo (teacher action) */
export async function approveLogo(projectId: string) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'teacher') return { error: 'Not authorised' };

  const admin = createAdminClient();

  const { data: project } = await admin
    .from('projects')
    .select('id, mentor_id')
    .eq('id', projectId)
    .single();

  if (!project) return { error: 'Project not found' };
  if (project.mentor_id !== user.id) return { error: 'Not the assigned mentor' };

  const { error } = await admin
    .from('projects')
    .update({ logo_approved: true })
    .eq('id', projectId);

  if (error) return { error: 'Failed to approve logo' };

  revalidatePath(`/dashboard/verify/${projectId}`);
  return { success: true };
}

/** Reject a project logo (teacher action) */
export async function rejectLogo(projectId: string) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'teacher') return { error: 'Not authorised' };

  const admin = createAdminClient();

  const { data: project } = await admin
    .from('projects')
    .select('id, mentor_id')
    .eq('id', projectId)
    .single();

  if (!project) return { error: 'Project not found' };
  if (project.mentor_id !== user.id) return { error: 'Not the assigned mentor' };

  const { error } = await admin
    .from('projects')
    .update({ logo_approved: false, logo_config: null })
    .eq('id', projectId);

  if (error) return { error: 'Failed to reject logo' };

  revalidatePath(`/dashboard/verify/${projectId}`);
  return { success: true };
}
