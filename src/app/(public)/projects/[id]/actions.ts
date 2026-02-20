'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/server';

const ALLOWED_REPORT_REASONS = [
  'inappropriate_content',
  'misleading_or_false',
  'spam',
  'harassment_or_bullying',
  'copyright',
  'other',
] as const;

/** Create a report for a project. Logged-in users only; project must be public (live/funded/completed). */
export async function createReport(
  projectId: string,
  reason: string,
  details?: string | null
): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: 'You must be signed in to report a project' };

  if (!reason?.trim()) return { error: 'Please select a reason' };
  const normalizedReason = reason.trim().toLowerCase().replace(/\s+/g, '_');
  if (!ALLOWED_REPORT_REASONS.includes(normalizedReason as (typeof ALLOWED_REPORT_REASONS)[number])) {
    return { error: 'Invalid reason' };
  }

  const admin = createAdminClient();
  const { data: project } = await admin
    .from('projects')
    .select('id, status')
    .eq('id', projectId)
    .single();

  if (!project) return { error: 'Project not found' };
  if (!['live', 'funded', 'completed'].includes(project.status)) {
    return { error: 'This project cannot be reported' };
  }

  const { error } = await supabase.from('reports').insert({
    project_id: projectId,
    reporter_id: user.id,
    reason: normalizedReason,
    details: details?.trim() || null,
    status: 'pending',
  });

  if (error) {
    console.error('Report insert error:', error);
    return { error: 'Failed to submit report' };
  }

  return { error: null };
}
