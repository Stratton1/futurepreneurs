import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/supabase/auth-helpers';

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  if (user.role !== 'student') {
    return NextResponse.json({ error: 'Only students can look up teachers' }, { status: 403 });
  }

  const { email } = await request.json();

  if (!email || typeof email !== 'string') {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  const supabase = await createClient();

  // Look up teacher by email
  const { data: teacher } = await supabase
    .from('user_profiles')
    .select('id, full_name, email, school_id')
    .eq('email', email.toLowerCase().trim())
    .eq('role', 'teacher')
    .eq('is_active', true)
    .single();

  if (!teacher) {
    return NextResponse.json({
      found: false,
      error: 'No teacher account found with that email. They need to sign up as a teacher first.',
    });
  }

  return NextResponse.json({
    found: true,
    teacher: { id: teacher.id, full_name: teacher.full_name },
  });
}
