import { createAdminClient } from '@/lib/supabase/server';
import { getRecentAuditEventsForParent } from './audit-events';
import { CURRENCY_SYMBOL } from '@/lib/constants';

export interface ChildProject {
  id: string;
  title: string;
  status: string;
  goal_amount: number;
  total_raised: number;
  backer_count: number;
  created_at: string;
}

export interface ChildOverview {
  id: string;
  full_name: string;
  email: string;
  projects: ChildProject[];
}

export interface ParentDashboardData {
  children: ChildOverview[];
  totalProjects: number;
  totalRaised: number;
  totalSpent: number;
  pendingConsentCount: number;
  pendingSpendingCount: number;
  firstDrawdownPending: { projectId: string; projectTitle: string }[];
  recentEvents: Awaited<ReturnType<typeof getRecentAuditEventsForParent>>;
  digestSettings: {
    digest_enabled: boolean;
    digest_day: string;
  } | null;
}

export async function getParentDashboardData(parentId: string): Promise<ParentDashboardData> {
  const supabase = createAdminClient();

  // Get all children of this parent
  const { data: children } = await supabase
    .from('user_profiles')
    .select('id, full_name, email')
    .eq('parent_id', parentId);

  if (!children || children.length === 0) {
    return {
      children: [],
      totalProjects: 0,
      totalRaised: 0,
      totalSpent: 0,
      pendingConsentCount: 0,
      pendingSpendingCount: 0,
      firstDrawdownPending: [],
      recentEvents: [],
      digestSettings: null,
    };
  }

  const childIds = children.map((c) => c.id);

  // Fetch all data in parallel
  const [
    projectsRes,
    consentRes,
    spendingRes,
    firstDrawdownRes,
    recentEvents,
    digestRes,
  ] = await Promise.all([
    // All projects for all children
    supabase
      .from('projects')
      .select('id, title, status, goal_amount, total_raised, backer_count, student_id, created_at')
      .in('student_id', childIds),

    // Pending consent requests for this parent
    supabase
      .from('parental_consents')
      .select('id', { count: 'exact', head: true })
      .eq('parent_id', parentId)
      .eq('status', 'pending'),

    // Pending spending approvals (parent step)
    supabase
      .from('spending_requests')
      .select('id', { count: 'exact', head: true })
      .eq('parent_id', parentId)
      .eq('status', 'pending_parent'),

    // Projects needing first-drawdown acknowledgment
    supabase
      .from('parental_consents')
      .select('project_id, projects(title)')
      .eq('parent_id', parentId)
      .eq('status', 'approved')
      .eq('first_drawdown_acknowledged', false),

    // Recent audit events
    getRecentAuditEventsForParent(parentId, 15),

    // Digest settings
    supabase
      .from('parent_digest_settings')
      .select('digest_enabled, digest_day')
      .eq('parent_id', parentId)
      .maybeSingle(),
  ]);

  const projects = (projectsRes.data ?? []).map((p) => ({
    ...p,
    goal_amount: Number(p.goal_amount) || 0,
    total_raised: Number(p.total_raised) || 0,
    backer_count: Number(p.backer_count) || 0,
  }));

  // Group projects by child
  const childOverviews: ChildOverview[] = children.map((child) => ({
    ...child,
    projects: projects
      .filter((p) => p.student_id === child.id)
      .map(({ student_id: _, ...rest }) => rest),
  }));

  const totalRaised = projects.reduce((sum, p) => sum + p.total_raised, 0);

  // Parse first-drawdown pending
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const firstDrawdownPending = (firstDrawdownRes.data ?? []).map((row: any) => {
    const proj = Array.isArray(row.projects) ? row.projects[0] : row.projects;
    return {
      projectId: row.project_id,
      projectTitle: proj?.title ?? 'Unknown project',
    };
  });
  /* eslint-enable @typescript-eslint/no-explicit-any */

  return {
    children: childOverviews,
    totalProjects: projects.length,
    totalRaised,
    totalSpent: 0, // TODO: compute from approved spending requests once wallet data is populated
    pendingConsentCount: consentRes.count ?? 0,
    pendingSpendingCount: spendingRes.count ?? 0,
    firstDrawdownPending,
    recentEvents,
    digestSettings: digestRes.data,
  };
}

export { auditEventLabel } from '@/types/audit';
export { CURRENCY_SYMBOL };
