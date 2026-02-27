import { createAdminClient } from '@/lib/supabase/server';
import type { StretchGoal } from '@/types/funding';

/** Get all stretch goals for a project (student/teacher view). */
export async function getStretchGoalsForProject(
  projectId: string
): Promise<StretchGoal[]> {
  const supabase = createAdminClient();

  const { data } = await supabase
    .from('stretch_goals')
    .select('*')
    .eq('project_id', projectId)
    .order('sort_order', { ascending: true });

  return (data || []) as StretchGoal[];
}

/** Get approved/unlocked stretch goals for a project (public view). */
export async function getApprovedStretchGoalsForProject(
  projectId: string
): Promise<StretchGoal[]> {
  const supabase = createAdminClient();

  const { data } = await supabase
    .from('stretch_goals')
    .select('*')
    .eq('project_id', projectId)
    .in('status', ['approved', 'unlocked'])
    .order('target_amount', { ascending: true });

  return (data || []) as StretchGoal[];
}

/** Get pending stretch goals for projects mentored by a teacher. */
export async function getPendingStretchGoalsForTeacher(
  teacherId: string
): Promise<(StretchGoal & { project_title: string })[]> {
  const supabase = createAdminClient();

  const { data: projects } = await supabase
    .from('projects')
    .select('id, title')
    .eq('mentor_id', teacherId);

  if (!projects || projects.length === 0) return [];

  const projectIds = projects.map((p) => p.id);
  const projectMap = new Map(projects.map((p) => [p.id, p.title]));

  const { data: goals } = await supabase
    .from('stretch_goals')
    .select('*')
    .in('project_id', projectIds)
    .eq('status', 'pending_approval')
    .order('created_at', { ascending: true });

  return (goals || []).map((g) => ({
    ...(g as StretchGoal),
    project_title: projectMap.get(g.project_id) ?? '',
  }));
}

/** Check and auto-unlock stretch goals when total_raised increases. */
export async function checkAndUnlockStretchGoals(
  projectId: string,
  totalRaised: number
): Promise<StretchGoal[]> {
  const supabase = createAdminClient();

  // Find approved goals where target <= totalRaised
  const { data: goalsToUnlock } = await supabase
    .from('stretch_goals')
    .select('*')
    .eq('project_id', projectId)
    .eq('status', 'approved')
    .lte('target_amount', totalRaised);

  if (!goalsToUnlock || goalsToUnlock.length === 0) return [];

  const unlocked: StretchGoal[] = [];

  for (const goal of goalsToUnlock) {
    const { error } = await supabase
      .from('stretch_goals')
      .update({
        status: 'unlocked',
        unlocked_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', goal.id);

    if (!error) {
      unlocked.push({ ...goal, status: 'unlocked' } as StretchGoal);
    }
  }

  return unlocked;
}

/** Get a single stretch goal by ID. */
export async function getStretchGoalById(
  goalId: string
): Promise<StretchGoal | null> {
  const supabase = createAdminClient();

  const { data } = await supabase
    .from('stretch_goals')
    .select('*')
    .eq('id', goalId)
    .single();

  return (data as StretchGoal) || null;
}
