'use server';

import { revalidatePath } from 'next/cache';
import { createAdminClient } from '@/lib/supabase/server';

/** Resolve a report (mark as resolved). Admin only. */
export async function resolveReport(reportId: string): Promise<{ error: string | null }> {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from('reports')
    .update({ status: 'resolved', reviewed_by: null }) // reviewed_by could be set from session if we had admin user id
    .eq('id', reportId);
  revalidatePath('/admin/reports');
  revalidatePath('/admin');
  return { error: error?.message ?? null };
}

/** Dismiss a report (mark as dismissed). Admin only. */
export async function dismissReport(reportId: string): Promise<{ error: string | null }> {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from('reports')
    .update({ status: 'dismissed' })
    .eq('id', reportId);
  revalidatePath('/admin/reports');
  revalidatePath('/admin');
  return { error: error?.message ?? null };
}

/** Remove (cancel) a project and notify the student. Admin only. */
export async function removeProject(projectId: string, reason?: string): Promise<{ error: string | null }> {
  const supabase = createAdminClient();

  const { data: project } = await supabase
    .from('projects')
    .select('id, student_id, title')
    .eq('id', projectId)
    .single();

  if (!project) return { error: 'Project not found' };

  const { error: updateError } = await supabase
    .from('projects')
    .update({ status: 'cancelled' })
    .eq('id', projectId);

  if (updateError) return { error: updateError.message };

  const message = reason
    ? `Your project "${project.title}" has been removed by the platform. Reason: ${reason}`
    : `Your project "${project.title}" has been removed by the platform.`;

  await supabase.from('notifications').insert({
    user_id: project.student_id,
    type: 'project_removed',
    title: 'Project removed',
    message,
    link: '/dashboard/projects',
  });

  revalidatePath('/admin/reports');
  revalidatePath('/admin');
  revalidatePath('/admin/projects');
  return { error: null };
}
