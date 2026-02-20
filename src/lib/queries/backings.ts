import { createClient } from '@/lib/supabase/server';

export interface BackingWithProject {
  id: string;
  project_id: string;
  amount: number;
  status: string;
  created_at: string;
  project_title: string;
  project_status: string;
}

/** Backings for the current user (investor). Uses RLS (backer_id = auth.uid()). */
export async function getBackingsForUser(userId: string): Promise<BackingWithProject[]> {
  const supabase = await createClient();

  const { data: backings } = await supabase
    .from('backings')
    .select('id, project_id, amount, status, created_at')
    .eq('backer_id', userId)
    .order('created_at', { ascending: false });

  if (!backings || backings.length === 0) return [];

  const projectIds = [...new Set(backings.map((b) => b.project_id))];
  const { data: projects } = await supabase
    .from('projects')
    .select('id, title, status')
    .in('id', projectIds);

  const projectMap = new Map((projects ?? []).map((p) => [p.id, p]));

  return backings.map((b) => {
    const project = projectMap.get(b.project_id);
    return {
      id: b.id,
      project_id: b.project_id,
      amount: Number(b.amount),
      status: b.status,
      created_at: b.created_at,
      project_title: project?.title ?? 'Unknown project',
      project_status: project?.status ?? '',
    };
  });
}
