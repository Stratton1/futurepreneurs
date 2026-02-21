import { createClient, createAdminClient } from '@/lib/supabase/server';

export interface MicroGoal {
  id: string;
  project_id: string;
  title: string;
  target_amount: number;
  sort_order: number;
  reached_at: string | null;
  created_at: string;
}

/** Get micro-goals for a project (uses RLS) */
export async function getMicroGoals(projectId: string): Promise<MicroGoal[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('micro_goals')
    .select('*')
    .eq('project_id', projectId)
    .order('sort_order', { ascending: true });

  return (data ?? []) as MicroGoal[];
}

/** Auto-generate micro-goals when a project goes live (25%, 50%, 75%, 100%) */
export async function generateMicroGoals(projectId: string, goalAmount: number): Promise<void> {
  const admin = createAdminClient();

  // Check if micro-goals already exist
  const { count } = await admin
    .from('micro_goals')
    .select('id', { count: 'exact', head: true })
    .eq('project_id', projectId);

  if ((count ?? 0) > 0) return; // Already generated

  const percentages = [
    { pct: 25, title: `First quarter — £${(goalAmount * 0.25).toFixed(0)} raised!` },
    { pct: 50, title: `Halfway there — £${(goalAmount * 0.5).toFixed(0)} raised!` },
    { pct: 75, title: `Three quarters — £${(goalAmount * 0.75).toFixed(0)} raised!` },
    { pct: 100, title: `Fully funded — £${goalAmount.toFixed(0)} raised!` },
  ];

  const rows = percentages.map((p, i) => ({
    project_id: projectId,
    title: p.title,
    target_amount: Number((goalAmount * (p.pct / 100)).toFixed(2)),
    sort_order: i,
  }));

  await admin.from('micro_goals').insert(rows);
}

/** Mark micro-goals as reached based on current total raised. Returns newly reached goal titles. */
export async function checkAndMarkMicroGoals(
  projectId: string,
  totalRaised: number
): Promise<string[]> {
  const admin = createAdminClient();

  const { data: goals } = await admin
    .from('micro_goals')
    .select('id, title, target_amount, reached_at')
    .eq('project_id', projectId)
    .order('sort_order', { ascending: true });

  if (!goals?.length) return [];

  const newlyReached: string[] = [];

  for (const goal of goals) {
    if (!goal.reached_at && totalRaised >= Number(goal.target_amount)) {
      await admin
        .from('micro_goals')
        .update({ reached_at: new Date().toISOString() })
        .eq('id', goal.id);
      newlyReached.push(goal.title);
    }
  }

  return newlyReached;
}
