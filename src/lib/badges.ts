import { createAdminClient } from '@/lib/supabase/server';
import { createClient } from '@/lib/supabase/server';

export const BADGE_TYPES = {
  first_project: { name: 'First Project', description: 'Created your first project', icon: 'FolderPlus' },
  fully_funded: { name: 'Fully Funded', description: 'Reached your funding goal', icon: 'Trophy' },
  milestone_master: { name: 'Milestone Master', description: 'First drawdown approved for a project', icon: 'Banknote' },
  learning_complete: { name: 'Scholar', description: 'Completed all learning modules', icon: 'GraduationCap' },
  pitch_pro: { name: 'Pitch Pro', description: 'Used the AI Pitch Builder', icon: 'Sparkles' },
  team_player: { name: 'Team Player', description: 'Collaborated on a group project', icon: 'Users' },
} as const;

export type BadgeType = keyof typeof BADGE_TYPES;

export interface UserBadge {
  id: string;
  user_id: string;
  badge_type: BadgeType;
  project_id: string | null;
  earned_at: string;
}

/** Award "First Project" when this is the student's first project. Idempotent. */
export async function awardFirstProject(userId: string, projectId: string): Promise<boolean> {
  const admin = createAdminClient();
  const { count } = await admin
    .from('projects')
    .select('id', { count: 'exact', head: true })
    .eq('student_id', userId);

  if ((count ?? 0) !== 1) return false;

  const { error } = await admin.from('user_badges').insert({
    user_id: userId,
    badge_type: 'first_project',
    project_id: projectId,
  });
  if (error && error.code !== '23505') return false; // 23505 = unique violation
  return true;
}

/** Award "Fully Funded" when project reaches goal. Idempotent. */
export async function awardFullyFunded(userId: string, projectId: string): Promise<boolean> {
  const admin = createAdminClient();
  const { error } = await admin.from('user_badges').insert({
    user_id: userId,
    badge_type: 'fully_funded',
    project_id: projectId,
  });
  if (error && error.code !== '23505') return false;
  return true;
}

/** Award "Milestone Master" when first drawdown for a project is approved. Idempotent. */
export async function awardMilestoneMaster(userId: string, projectId: string): Promise<boolean> {
  const admin = createAdminClient();
  const { error } = await admin.from('user_badges').insert({
    user_id: userId,
    badge_type: 'milestone_master',
    project_id: projectId,
  });
  if (error && error.code !== '23505') return false;
  return true;
}

/** Award "Scholar" when user completes all learning modules. Idempotent. */
export async function awardLearningComplete(userId: string): Promise<boolean> {
  const admin = createAdminClient();
  const { error } = await admin.from('user_badges').insert({
    user_id: userId,
    badge_type: 'learning_complete',
    project_id: null,
  });
  if (error && error.code !== '23505') return false;
  return true;
}

/** Award "Pitch Pro" when user uses the AI Pitch Builder. Idempotent. */
export async function awardPitchPro(userId: string, projectId: string): Promise<boolean> {
  const admin = createAdminClient();
  const { error } = await admin.from('user_badges').insert({
    user_id: userId,
    badge_type: 'pitch_pro',
    project_id: projectId,
  });
  if (error && error.code !== '23505') return false;
  return true;
}

/** Award "Team Player" when user joins or creates a group project. Idempotent. */
export async function awardTeamPlayer(userId: string, projectId: string): Promise<boolean> {
  const admin = createAdminClient();
  const { error } = await admin.from('user_badges').insert({
    user_id: userId,
    badge_type: 'team_player',
    project_id: projectId,
  });
  if (error && error.code !== '23505') return false;
  return true;
}

/** Get all badges for a user (for Trophy Room). Uses RLS so user sees own only. */
export async function getBadgesForUser(userId: string): Promise<(UserBadge & { project_title?: string })[]> {
  const supabase = await createClient();
  const { data: badges } = await supabase
    .from('user_badges')
    .select('id, user_id, badge_type, project_id, earned_at')
    .eq('user_id', userId)
    .order('earned_at', { ascending: false });

  if (!badges?.length) return [];

  const projectIds = [...new Set((badges as UserBadge[]).map((b) => b.project_id).filter(Boolean))] as string[];
  let projectTitles: Record<string, string> = {};
  if (projectIds.length > 0) {
    const admin = createAdminClient();
    const { data: projects } = await admin
      .from('projects')
      .select('id, title')
      .in('id', projectIds);
    projectTitles = Object.fromEntries((projects ?? []).map((p) => [p.id, p.title]));
  }

  return (badges as UserBadge[]).map((b) => ({
    ...b,
    project_title: b.project_id ? projectTitles[b.project_id] : undefined,
  }));
}
