import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = createAdminClient();

  const LIST_SELECT = `
    id, title, short_description, category, goal_amount, total_raised, backer_count,
    images, status, is_featured, logo_config, logo_approved, project_type, group_name, created_at,
    student:user_profiles!projects_student_id_fkey(id, full_name, display_handle, avatar_url, avatar_config, school:schools(name, city))
  `;

  const { data, error, count } = await supabase
    .from('projects')
    .select(LIST_SELECT)
    .in('status', ['live', 'funded', 'completed'])
    .order('created_at', { ascending: false })
    .range(0, 11);

  return NextResponse.json({
    error: error ? { message: error.message, code: error.code, details: error.details, hint: error.hint } : null,
    count,
    dataLength: data?.length ?? 0,
    firstProject: data?.[0] ? { id: data[0].id, title: data[0].title } : null,
  });
}
