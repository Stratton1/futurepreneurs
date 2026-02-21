import { createAdminClient } from '@/lib/supabase/server';
import type { SpendingRequest, SpendingRequestWithDetails, ApprovalLog } from '@/types/wallet';

/** Get spending requests for a student. Admin client (joins across tables). */
export async function getSpendingRequestsForStudent(
  studentId: string
): Promise<SpendingRequestWithDetails[]> {
  const supabase = createAdminClient();

  const { data: requests } = await supabase
    .from('spending_requests')
    .select('*')
    .eq('student_id', studentId)
    .order('created_at', { ascending: false });

  if (!requests || requests.length === 0) return [];

  return enrichSpendingRequests(requests);
}

/** Get pending spending requests awaiting parent approval. Admin client. */
export async function getPendingRequestsForParent(
  parentId: string
): Promise<SpendingRequestWithDetails[]> {
  const supabase = createAdminClient();

  const { data: requests } = await supabase
    .from('spending_requests')
    .select('*')
    .eq('parent_id', parentId)
    .eq('status', 'pending_parent')
    .order('created_at', { ascending: true });

  if (!requests || requests.length === 0) return [];

  return enrichSpendingRequests(requests);
}

/** Get pending spending requests awaiting mentor approval. Admin client. */
export async function getPendingRequestsForMentor(
  mentorId: string
): Promise<SpendingRequestWithDetails[]> {
  const supabase = createAdminClient();

  const { data: requests } = await supabase
    .from('spending_requests')
    .select('*')
    .eq('mentor_id', mentorId)
    .eq('status', 'pending_mentor')
    .order('created_at', { ascending: true });

  if (!requests || requests.length === 0) return [];

  return enrichSpendingRequests(requests);
}

/** Get all spending requests for projects a parent oversees. Admin client. */
export async function getAllRequestsForParent(
  parentId: string
): Promise<SpendingRequestWithDetails[]> {
  const supabase = createAdminClient();

  const { data: requests } = await supabase
    .from('spending_requests')
    .select('*')
    .eq('parent_id', parentId)
    .order('created_at', { ascending: false });

  if (!requests || requests.length === 0) return [];

  return enrichSpendingRequests(requests);
}

/** Get all spending requests for projects a mentor oversees. Admin client. */
export async function getAllRequestsForMentor(
  mentorId: string
): Promise<SpendingRequestWithDetails[]> {
  const supabase = createAdminClient();

  const { data: requests } = await supabase
    .from('spending_requests')
    .select('*')
    .eq('mentor_id', mentorId)
    .order('created_at', { ascending: false });

  if (!requests || requests.length === 0) return [];

  return enrichSpendingRequests(requests);
}

/** Get a spending request by ID with full details. Admin client. */
export async function getSpendingRequestById(
  requestId: string
): Promise<SpendingRequestWithDetails | null> {
  const supabase = createAdminClient();

  const { data: request } = await supabase
    .from('spending_requests')
    .select('*')
    .eq('id', requestId)
    .single();

  if (!request) return null;

  const enriched = await enrichSpendingRequests([request]);
  return enriched[0] ?? null;
}

/** Get approval logs for a spending request. Admin client. */
export async function getApprovalLogs(requestId: string): Promise<ApprovalLog[]> {
  const supabase = createAdminClient();

  const { data } = await supabase
    .from('approval_logs')
    .select('*')
    .eq('spending_request_id', requestId)
    .order('decided_at', { ascending: true });

  return data ?? [];
}

/** Get spending requests that are funded and past their card window. Admin client (for cron). */
export async function getExpiredFundedRequests(): Promise<SpendingRequest[]> {
  const supabase = createAdminClient();

  const { data } = await supabase
    .from('spending_requests')
    .select('*')
    .eq('status', 'funded')
    .lt('card_window_expires_at', new Date().toISOString());

  return data ?? [];
}

/** Get completed requests without receipts older than a threshold. Admin client (for cron). */
export async function getRequestsMissingReceipts(hoursOld: number): Promise<SpendingRequest[]> {
  const supabase = createAdminClient();
  const threshold = new Date(Date.now() - hoursOld * 60 * 60 * 1000).toISOString();

  const { data } = await supabase
    .from('spending_requests')
    .select('*')
    .eq('status', 'completed')
    .is('receipt_url', null)
    .lt('completed_at', threshold);

  return data ?? [];
}

/** Get daily spending total for a custodial account + project. Admin client. */
export async function getDailySpendingTotal(
  custodialAccountId: string,
  projectId: string
): Promise<number> {
  const supabase = createAdminClient();
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const { data } = await supabase
    .from('spending_requests')
    .select('amount')
    .eq('custodial_account_id', custodialAccountId)
    .eq('project_id', projectId)
    .in('status', ['approved', 'funded', 'completed'])
    .gte('created_at', todayStart.toISOString());

  if (!data || data.length === 0) return 0;
  return data.reduce((sum, r) => sum + Number(r.amount), 0);
}

/** Get weekly spending total for a custodial account + project. Admin client. */
export async function getWeeklySpendingTotal(
  custodialAccountId: string,
  projectId: string
): Promise<number> {
  const supabase = createAdminClient();
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - 7);
  weekStart.setHours(0, 0, 0, 0);

  const { data } = await supabase
    .from('spending_requests')
    .select('amount')
    .eq('custodial_account_id', custodialAccountId)
    .eq('project_id', projectId)
    .in('status', ['approved', 'funded', 'completed'])
    .gte('created_at', weekStart.toISOString());

  if (!data || data.length === 0) return 0;
  return data.reduce((sum, r) => sum + Number(r.amount), 0);
}

/** All spending requests across the platform. Admin client (for admin dashboard). */
export async function getAllSpendingRequests(
  limit = 50
): Promise<SpendingRequestWithDetails[]> {
  const supabase = createAdminClient();

  const { data: requests } = await supabase
    .from('spending_requests')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (!requests || requests.length === 0) return [];

  return enrichSpendingRequests(requests);
}

// -- Internal helper --

async function enrichSpendingRequests(
  requests: SpendingRequest[]
): Promise<SpendingRequestWithDetails[]> {
  const supabase = createAdminClient();

  const projectIds = [...new Set(requests.map((r) => r.project_id))];
  const userIds = [
    ...new Set([
      ...requests.map((r) => r.student_id),
      ...requests.map((r) => r.parent_id),
      ...requests.map((r) => r.mentor_id),
    ]),
  ];
  const milestoneIds = [
    ...new Set(requests.map((r) => r.milestone_id).filter(Boolean)),
  ] as string[];

  const [{ data: projects }, { data: users }, { data: milestones }] = await Promise.all([
    supabase.from('projects').select('id, title').in('id', projectIds),
    supabase.from('user_profiles').select('id, full_name').in('id', userIds),
    milestoneIds.length > 0
      ? supabase.from('milestones').select('id, title').in('id', milestoneIds)
      : Promise.resolve({ data: [] }),
  ]);

  const projectMap = new Map((projects ?? []).map((p) => [p.id, p.title]));
  const userMap = new Map((users ?? []).map((u) => [u.id, u.full_name]));
  const milestoneMap = new Map((milestones ?? []).map((m) => [m.id, m.title]));

  return requests.map((r) => ({
    ...r,
    project_title: projectMap.get(r.project_id) ?? '',
    student_name: userMap.get(r.student_id) ?? 'Unknown',
    parent_name: userMap.get(r.parent_id) ?? 'Unknown',
    mentor_name: userMap.get(r.mentor_id) ?? 'Unknown',
    milestone_title: r.milestone_id ? milestoneMap.get(r.milestone_id) ?? '' : undefined,
  }));
}
