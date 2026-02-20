import { createClient, createAdminClient } from '@/lib/supabase/server';
import type { DrawdownRequest, Milestone } from '@/types/database';

export interface DrawdownWithMilestone extends DrawdownRequest {
  milestone: Pick<Milestone, 'id' | 'title' | 'amount' | 'status'>;
}

export interface DrawdownForTeacher {
  id: string;
  project_id: string;
  milestone_id: string;
  amount: number;
  reason: string | null;
  status: string;
  requested_at: string;
  project_title: string;
  student_name: string;
  milestone_title: string;
  milestone_amount: number;
}

export interface DrawdownForParent {
  id: string;
  project_id: string;
  amount: number;
  reason: string | null;
  status: string;
  requested_at: string;
  approved_at: string | null;
  project_title: string;
  student_name: string;
  milestone_title: string;
}

/** All drawdown requests for a project (for student project detail). Uses RLS. */
export async function getDrawdownRequestsByProject(
  projectId: string
): Promise<DrawdownWithMilestone[]> {
  const supabase = await createClient();

  const { data: requests } = await supabase
    .from('drawdown_requests')
    .select('*')
    .eq('project_id', projectId)
    .order('requested_at', { ascending: false });

  if (!requests || requests.length === 0) return [];

  const milestoneIds = [...new Set(requests.map((r) => r.milestone_id))];
  const { data: milestones } = await supabase
    .from('milestones')
    .select('id, title, amount, status')
    .in('id', milestoneIds);

  const milestoneMap = new Map((milestones ?? []).map((m) => [m.id, m]));

  return requests.map((r) => ({
    ...r,
    milestone: milestoneMap.get(r.milestone_id) ?? {
      id: r.milestone_id,
      title: '',
      amount: 0,
      status: 'pending',
    },
  }));
}

/** Sum of approved amounts for a milestone (for remaining calculation). */
export async function getApprovedAmountForMilestone(milestoneId: string): Promise<number> {
  const supabase = createAdminClient();

  const { data } = await supabase
    .from('drawdown_requests')
    .select('amount')
    .eq('milestone_id', milestoneId)
    .eq('status', 'approved');

  if (!data || data.length === 0) return 0;
  return data.reduce((sum, row) => sum + Number(row.amount), 0);
}

/** Remaining amount available to draw down for a milestone. */
export async function getMilestoneRemaining(milestone: Milestone): Promise<number> {
  const approved = await getApprovedAmountForMilestone(milestone.id);
  return Math.max(0, Number(milestone.amount) - approved);
}

/** Pending drawdown requests for projects the teacher mentors. Uses admin for joins. */
export async function getPendingDrawdownsForTeacher(
  teacherId: string
): Promise<DrawdownForTeacher[]> {
  const supabase = createAdminClient();

  const { data: projects } = await supabase
    .from('projects')
    .select('id')
    .eq('mentor_id', teacherId);

  if (!projects || projects.length === 0) return [];

  const projectIds = projects.map((p) => p.id);

  const { data: requests } = await supabase
    .from('drawdown_requests')
    .select('*')
    .in('project_id', projectIds)
    .eq('status', 'pending')
    .order('requested_at', { ascending: true });

  if (!requests || requests.length === 0) return [];

  const milestoneIds = [...new Set(requests.map((r) => r.milestone_id))];
  const projectIdsFromRequests = [...new Set(requests.map((r) => r.project_id))];

  const [{ data: milestones }, { data: projectsFull }] = await Promise.all([
    supabase.from('milestones').select('id, title, amount').in('id', milestoneIds),
    supabase.from('projects').select('id, title, student_id').in('id', projectIdsFromRequests),
  ]);

  const projectList = projectsFull ?? [];
  const studentIds = [...new Set(projectList.map((p: { student_id: string }) => p.student_id))];
  const { data: students } = studentIds.length > 0
    ? await supabase.from('user_profiles').select('id, full_name').in('id', studentIds)
    : { data: [] };

  const milestoneMap = new Map((milestones ?? []).map((m) => [m.id, m]));
  const projectMap = new Map(projectList.map((p: { id: string; title: string; student_id: string }) => [p.id, p]));
  const studentMap = new Map((students ?? []).map((s) => [s.id, s]));

  return requests.map((r) => {
    const proj = projectMap.get(r.project_id);
    const student = proj ? studentMap.get(proj.student_id) : null;
    const milestone = milestoneMap.get(r.milestone_id);
    return {
      id: r.id,
      project_id: r.project_id,
      milestone_id: r.milestone_id,
      amount: Number(r.amount),
      reason: r.reason,
      status: r.status,
      requested_at: r.requested_at,
      project_title: proj?.title ?? '',
      student_name: student?.full_name ?? 'Unknown',
      milestone_title: milestone?.title ?? '',
      milestone_amount: milestone ? Number(milestone.amount) : 0,
    };
  });
}

/** All drawdown requests visible to a parent (consented or linked parent projects). */
export async function getDrawdownsForParent(parentId: string): Promise<DrawdownForParent[]> {
  const supabase = createAdminClient();

  const { data: consented } = await supabase
    .from('parental_consents')
    .select('project_id')
    .eq('parent_id', parentId)
    .eq('status', 'approved');

  const { data: children } = await supabase
    .from('user_profiles')
    .select('id')
    .eq('parent_id', parentId);

  const childIds = (children ?? []).map((c) => c.id);
  let linkedProjectIds: string[] = [];
  if (childIds.length > 0) {
    const { data: linkedProjects } = await supabase
      .from('projects')
      .select('id')
      .in('student_id', childIds);
    linkedProjectIds = (linkedProjects ?? []).map((p) => p.id);
  }

  const projectIds = new Set<string>();
  (consented ?? []).forEach((c) => projectIds.add(c.project_id));
  linkedProjectIds.forEach((id) => projectIds.add(id));

  if (projectIds.size === 0) return [];

  const { data: requests } = await supabase
    .from('drawdown_requests')
    .select('*')
    .in('project_id', [...projectIds])
    .order('requested_at', { ascending: false });

  if (!requests || requests.length === 0) return [];

  const milestoneIds = [...new Set(requests.map((r) => r.milestone_id))];
  const projectIdsFromRequests = [...new Set(requests.map((r) => r.project_id))];

  const [{ data: milestones }, { data: projectsFull }] = await Promise.all([
    supabase.from('milestones').select('id, title').in('id', milestoneIds),
    supabase.from('projects').select('id, title, student_id').in('id', projectIdsFromRequests),
  ]);

  const projectList = projectsFull ?? [];
  const studentIds = [...new Set(projectList.map((p: { student_id: string }) => p.student_id).filter(Boolean))];
  const { data: students } = studentIds.length > 0
    ? await supabase.from('user_profiles').select('id, full_name').in('id', studentIds)
    : { data: [] };

  const milestoneMap = new Map((milestones ?? []).map((m) => [m.id, m]));
  const projectMap = new Map(projectList.map((p: { id: string; title: string; student_id: string }) => [p.id, p]));
  const studentMap = new Map((students ?? []).map((s) => [s.id, s]));

  return requests.map((r) => {
    const proj = projectMap.get(r.project_id);
    const student = proj ? studentMap.get(proj.student_id) : null;
    const milestone = milestoneMap.get(r.milestone_id);
    return {
      id: r.id,
      project_id: r.project_id,
      amount: Number(r.amount),
      reason: r.reason,
      status: r.status,
      requested_at: r.requested_at,
      approved_at: r.approved_at,
      project_title: proj?.title ?? '',
      student_name: student?.full_name ?? 'Unknown',
      milestone_title: milestone?.title ?? '',
    };
  });
}
