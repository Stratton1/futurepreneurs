import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/supabase/auth-helpers';
import { getLatestDraft } from '@/lib/queries/pitch-drafts';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { id } = await params;
  const draft = await getLatestDraft(id);

  if (!draft) {
    return NextResponse.json(null);
  }

  // Only the owner can view their drafts
  if (draft.user_id !== user.id) {
    return NextResponse.json({ error: 'Not authorised' }, { status: 403 });
  }

  return NextResponse.json(draft);
}
