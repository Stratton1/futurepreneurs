/**
 * Backfill user_badges for existing data (Epic 1 Trophy Room).
 *
 * Usage: npx tsx scripts/backfill-badges.ts
 *
 * Prerequisites: .env.local with NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function insertBadge(userId: string, badgeType: string, projectId: string | null) {
  const { error } = await supabase.from('user_badges').insert({
    user_id: userId,
    badge_type: badgeType,
    project_id: projectId,
  });
  if (error && error.code !== '23505') console.error('Badge insert error:', error);
  return !error || error.code === '23505';
}

async function main() {
  let first = 0;
  let funded = 0;
  let milestone = 0;

  // 1) First project: students with exactly one project
  const { data: projectsByStudent } = await supabase
    .from('projects')
    .select('student_id, id');
  const byStudent = new Map<string, string[]>();
  for (const p of projectsByStudent ?? []) {
    const list = byStudent.get(p.student_id) ?? [];
    list.push(p.id);
    byStudent.set(p.student_id, list);
  }
  for (const [studentId, projectIds] of byStudent) {
    if (projectIds.length === 1 && (await insertBadge(studentId, 'first_project', projectIds[0]))) first++;
  }

  // 2) Fully funded: projects with status funded or completed
  const { data: fundedProjects } = await supabase
    .from('projects')
    .select('id, student_id')
    .in('status', ['funded', 'completed']);
  for (const p of fundedProjects ?? []) {
    if (await insertBadge(p.student_id, 'fully_funded', p.id)) funded++;
  }

  // 3) Milestone master: at least one approved drawdown per project
  const { data: approved } = await supabase
    .from('drawdown_requests')
    .select('project_id')
    .eq('status', 'approved');
  const projectIdsWithApproval = [...new Set((approved ?? []).map((r) => r.project_id))];
  for (const projectId of projectIdsWithApproval) {
    const { data: proj } = await supabase.from('projects').select('student_id').eq('id', projectId).single();
    if (proj?.student_id && (await insertBadge(proj.student_id, 'milestone_master', projectId))) milestone++;
  }

  console.log('Backfill complete: first_project=%d, fully_funded=%d, milestone_master=%d', first, funded, milestone);
}

main().catch(console.error);
