import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/supabase/auth-helpers';
import { getProjectCollaborators } from '@/lib/queries/collaborators';
import { createAdminClient } from '@/lib/supabase/server';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { id } = await params;
  const admin = createAdminClient();

  // Get the project to verify access
  const { data: project } = await admin
    .from('projects')
    .select('id, student_id')
    .eq('id', id)
    .single();

  if (!project) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }

  if (project.student_id !== user.id) {
    return NextResponse.json({ error: 'Not authorised' }, { status: 403 });
  }

  const members = await getProjectCollaborators(id);

  return NextResponse.json({
    members,
    ownerName: user.full_name,
  });
}
