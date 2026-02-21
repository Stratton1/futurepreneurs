import { createAdminClient } from '@/lib/supabase/server';

export interface Collaborator {
  id: string;
  project_id: string;
  user_id: string;
  role: string;
  invited_by: string;
  accepted: boolean;
  created_at: string;
  user?: {
    id: string;
    full_name: string;
    email: string;
    display_handle: string | null;
  };
}

/** Get all collaborators for a project */
export async function getProjectCollaborators(projectId: string): Promise<Collaborator[]> {
  const supabase = createAdminClient();

  const { data } = await supabase
    .from('project_collaborators')
    .select('*, user:user_profiles!project_collaborators_user_id_fkey(id, full_name, email, display_handle)')
    .eq('project_id', projectId)
    .order('created_at');

  if (!data) return [];

  return data.map((row) => ({
    ...row,
    user: Array.isArray(row.user) ? row.user[0] : row.user,
  })) as Collaborator[];
}

/** Get pending invitations for a user */
export async function getPendingInvitations(userId: string): Promise<(Collaborator & { project_title: string })[]> {
  const supabase = createAdminClient();

  const { data } = await supabase
    .from('project_collaborators')
    .select('*, project:projects(title)')
    .eq('user_id', userId)
    .eq('accepted', false)
    .order('created_at', { ascending: false });

  if (!data) return [];

  return data.map((row) => {
    const project = Array.isArray(row.project) ? row.project[0] : row.project;
    return {
      ...row,
      project_title: project?.title ?? 'Unknown Project',
    };
  }) as (Collaborator & { project_title: string })[];
}

/** Get projects where user is an accepted collaborator */
export async function getCollaboratingProjects(userId: string): Promise<string[]> {
  const supabase = createAdminClient();

  const { data } = await supabase
    .from('project_collaborators')
    .select('project_id')
    .eq('user_id', userId)
    .eq('accepted', true);

  return (data ?? []).map((r) => r.project_id);
}
