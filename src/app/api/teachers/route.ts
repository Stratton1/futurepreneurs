import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/supabase/auth-helpers';

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  if (!user.school_id) {
    return NextResponse.json({ teachers: [] });
  }

  const supabase = await createClient();

  const { data: teachers } = await supabase
    .from('user_profiles')
    .select('id, full_name')
    .eq('role', 'teacher')
    .eq('school_id', user.school_id)
    .eq('is_active', true)
    .order('full_name');

  return NextResponse.json({ teachers: teachers ?? [] });
}
