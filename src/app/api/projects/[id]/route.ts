import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/supabase/auth-helpers';
import { getProjectById } from '@/lib/queries/projects';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { id } = await params;
  const project = await getProjectById(id);

  if (!project) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }

  // Only the student who owns it can view via this API
  if (project.student_id !== user.id) {
    return NextResponse.json({ error: 'Not authorised' }, { status: 403 });
  }

  return NextResponse.json(project);
}
