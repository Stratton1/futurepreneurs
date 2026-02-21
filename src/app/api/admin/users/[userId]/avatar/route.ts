import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/supabase/auth-helpers';
import type { AvatarConfig } from '@/types/database';

/**
 * PATCH /api/admin/users/[userId]/avatar
 * Set a user's avatar_config (zero-PII) from the backend.
 * Use this for support, testing, or scripts — not the profile UI.
 * Requires the caller to be an admin.
 */
export async function PATCH(
  _request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized — admin only' }, { status: 403 });
    }

    const { userId } = await params;
    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    const body = await _request.json();
    const avatarConfig = body?.avatar_config ?? null;

    if (avatarConfig !== null) {
      const c = avatarConfig as Record<string, unknown>;
      if (typeof c !== 'object' || Array.isArray(c)) {
        return NextResponse.json(
          { error: 'avatar_config must be an object or null' },
          { status: 400 }
        );
      }
      // Allow partial config; DB stores JSONB
      const sanitized: AvatarConfig = {
        hairStyle: typeof c.hairStyle === 'string' ? c.hairStyle : undefined,
        hairColor: typeof c.hairColor === 'string' ? c.hairColor : undefined,
        skinTone: typeof c.skinTone === 'string' ? c.skinTone : undefined,
        accessories: Array.isArray(c.accessories)
          ? (c.accessories as string[]).filter((a) => typeof a === 'string')
          : undefined,
      };
      const adminClient = createAdminClient();
      const { error } = await adminClient
        .from('user_profiles')
        .update({ avatar_config: sanitized as Record<string, unknown> })
        .eq('id', userId);

      if (error) {
        return NextResponse.json(
          { error: 'Failed to update avatar', details: error.message },
          { status: 500 }
        );
      }
    } else {
      const adminClient = createAdminClient();
      const { error } = await adminClient
        .from('user_profiles')
        .update({ avatar_config: null })
        .eq('id', userId);

      if (error) {
        return NextResponse.json(
          { error: 'Failed to clear avatar', details: error.message },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('Admin avatar PATCH error:', e);
    return NextResponse.json(
      { error: 'Request failed', details: String(e) },
      { status: 500 }
    );
  }
}
