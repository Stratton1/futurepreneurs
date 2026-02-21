import { createClient, createAdminClient } from '@/lib/supabase/server';
import type { CustodialAccount } from '@/types/wallet';

/** Get a custodial account by parent and student IDs. Uses RLS. */
export async function getCustodialAccount(
  parentId: string,
  studentId: string
): Promise<CustodialAccount | null> {
  const supabase = await createClient();

  const { data } = await supabase
    .from('custodial_accounts')
    .select('*')
    .eq('parent_id', parentId)
    .eq('student_id', studentId)
    .single();

  return data;
}

/** Get all custodial accounts for a parent. Uses RLS. */
export async function getCustodialAccountsForParent(
  parentId: string
): Promise<CustodialAccount[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from('custodial_accounts')
    .select('*')
    .eq('parent_id', parentId)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  return data ?? [];
}

/** Get a custodial account for a student. Uses RLS. */
export async function getCustodialAccountForStudent(
  studentId: string
): Promise<CustodialAccount | null> {
  const supabase = await createClient();

  const { data } = await supabase
    .from('custodial_accounts')
    .select('*')
    .eq('student_id', studentId)
    .eq('is_active', true)
    .single();

  return data;
}

/** Get a custodial account by ID. Uses admin client for cross-user reads. */
export async function getCustodialAccountById(
  accountId: string
): Promise<CustodialAccount | null> {
  const supabase = createAdminClient();

  const { data } = await supabase
    .from('custodial_accounts')
    .select('*')
    .eq('id', accountId)
    .single();

  return data;
}

/** Get custodial account for a project (via the project's student). Admin client. */
export async function getCustodialAccountForProject(
  projectId: string
): Promise<CustodialAccount | null> {
  const supabase = createAdminClient();

  const { data: project } = await supabase
    .from('projects')
    .select('student_id')
    .eq('id', projectId)
    .single();

  if (!project) return null;

  const { data } = await supabase
    .from('custodial_accounts')
    .select('*')
    .eq('student_id', project.student_id)
    .eq('is_active', true)
    .single();

  return data;
}

/** Get all custodial accounts with student and parent names. Admin client for admin dashboard. */
export async function getAllCustodialAccounts(): Promise<
  (CustodialAccount & { parent_name: string; student_name: string })[]
> {
  const supabase = createAdminClient();

  const { data: accounts } = await supabase
    .from('custodial_accounts')
    .select('*')
    .order('created_at', { ascending: false });

  if (!accounts || accounts.length === 0) return [];

  const userIds = [
    ...new Set([
      ...accounts.map((a) => a.parent_id),
      ...accounts.map((a) => a.student_id),
    ]),
  ];

  const { data: users } = await supabase
    .from('user_profiles')
    .select('id, full_name')
    .in('id', userIds);

  const userMap = new Map((users ?? []).map((u) => [u.id, u.full_name]));

  return accounts.map((a) => ({
    ...a,
    parent_name: userMap.get(a.parent_id) ?? 'Unknown',
    student_name: userMap.get(a.student_id) ?? 'Unknown',
  }));
}
