import { createAdminClient } from '@/lib/supabase/server';

export interface ProjectUpdateWithAuthor {
  id: string;
  project_id: string;
  author_id: string | null;
  title: string;
  content: string;
  update_type: string;
  images: string[];
  funds_breakdown: { label: string; amount: number }[] | null;
  learnings: string | null;
  status: string;
  rejection_reason: string | null;
  approved_by: string | null;
  approved_at: string | null;
  created_at: string;
  updated_at: string;
  author?: { full_name: string } | null;
}

const UPDATE_SELECT = `
  id, project_id, author_id, title, content, update_type, images,
  funds_breakdown, learnings, status, rejection_reason,
  approved_by, approved_at, created_at, updated_at,
  author:user_profiles!project_updates_author_id_fkey(full_name)
`;

/* eslint-disable @typescript-eslint/no-explicit-any */
function normaliseUpdate(raw: any): ProjectUpdateWithAuthor {
  return {
    ...raw,
    images: raw.images || [],
    author: Array.isArray(raw.author) ? raw.author[0] || null : raw.author || null,
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

/** Get approved updates for a project (public view). */
export async function getApprovedUpdatesForProject(
  projectId: string
): Promise<ProjectUpdateWithAuthor[]> {
  const supabase = createAdminClient();

  const { data } = await supabase
    .from('project_updates')
    .select(UPDATE_SELECT)
    .eq('project_id', projectId)
    .eq('status', 'approved')
    .order('created_at', { ascending: false });

  return (data || []).map(normaliseUpdate);
}

/** Get all updates for a project (student view — includes pending/rejected). */
export async function getAllUpdatesForProject(
  projectId: string
): Promise<ProjectUpdateWithAuthor[]> {
  const supabase = createAdminClient();

  const { data } = await supabase
    .from('project_updates')
    .select(UPDATE_SELECT)
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });

  return (data || []).map(normaliseUpdate);
}

/** Get pending updates for projects mentored by a teacher. */
export async function getPendingUpdatesForTeacher(
  teacherId: string
): Promise<(ProjectUpdateWithAuthor & { project_title: string })[]> {
  const supabase = createAdminClient();

  // Get projects mentored by this teacher
  const { data: projects } = await supabase
    .from('projects')
    .select('id, title')
    .eq('mentor_id', teacherId);

  if (!projects || projects.length === 0) return [];

  const projectIds = projects.map((p) => p.id);
  const projectMap = new Map(projects.map((p) => [p.id, p.title]));

  const { data: updates } = await supabase
    .from('project_updates')
    .select(UPDATE_SELECT)
    .in('project_id', projectIds)
    .eq('status', 'pending')
    .order('created_at', { ascending: true });

  return (updates || []).map((u) => ({
    ...normaliseUpdate(u),
    project_title: projectMap.get(u.project_id) ?? '',
  }));
}

/** Get a single update by ID. */
export async function getUpdateById(
  updateId: string
): Promise<ProjectUpdateWithAuthor | null> {
  const supabase = createAdminClient();

  const { data } = await supabase
    .from('project_updates')
    .select(UPDATE_SELECT)
    .eq('id', updateId)
    .single();

  if (!data) return null;
  return normaliseUpdate(data);
}

/** Count pending updates for a teacher (for badge/indicator). */
export async function getPendingUpdateCountForTeacher(
  teacherId: string
): Promise<number> {
  const supabase = createAdminClient();

  const { data: projects } = await supabase
    .from('projects')
    .select('id')
    .eq('mentor_id', teacherId);

  if (!projects || projects.length === 0) return 0;

  const { count } = await supabase
    .from('project_updates')
    .select('id', { count: 'exact', head: true })
    .in('project_id', projects.map((p) => p.id))
    .eq('status', 'pending');

  return count ?? 0;
}
