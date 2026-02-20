'use server';

import { createAdminClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/supabase/auth-helpers';
import { revalidatePath } from 'next/cache';

/** Student links a parent by email */
export async function linkParent(parentEmail: string) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'student') {
    return { error: 'Only students can link a parent' };
  }

  // Use admin client — RLS only allows viewing own profile
  const adminClient = createAdminClient();

  const { data: parent } = await adminClient
    .from('user_profiles')
    .select('id, full_name')
    .eq('email', parentEmail.toLowerCase().trim())
    .eq('role', 'parent')
    .eq('is_active', true)
    .single();

  if (!parent) {
    return { error: 'No parent account found with that email. They need to sign up as a parent first.' };
  }

  const { error } = await adminClient
    .from('user_profiles')
    .update({ parent_id: parent.id })
    .eq('id', user.id);

  if (error) return { error: 'Failed to link parent' };

  revalidatePath('/dashboard/profile');
  return { success: true, parentName: parent.full_name };
}

/** Parent links a child (student) by email */
export async function linkChild(studentEmail: string) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'parent') {
    return { error: 'Only parents can link a child' };
  }

  // Use admin client — RLS only allows viewing/updating own profile
  const adminClient = createAdminClient();

  const { data: student } = await adminClient
    .from('user_profiles')
    .select('id, full_name')
    .eq('email', studentEmail.toLowerCase().trim())
    .eq('role', 'student')
    .eq('is_active', true)
    .single();

  if (!student) {
    return { error: 'No student account found with that email.' };
  }

  // Check if student already has a parent
  const { data: existing } = await adminClient
    .from('user_profiles')
    .select('parent_id')
    .eq('id', student.id)
    .single();

  if (existing?.parent_id && existing.parent_id !== user.id) {
    return { error: 'This student is already linked to another parent.' };
  }

  const { error } = await adminClient
    .from('user_profiles')
    .update({ parent_id: user.id })
    .eq('id', student.id);

  if (error) return { error: 'Failed to link child' };

  revalidatePath('/dashboard/profile');
  return { success: true, childName: student.full_name };
}

/** Remove parent link (student action) */
export async function unlinkParent() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'student') {
    return { error: 'Only students can unlink a parent' };
  }

  const adminClient = createAdminClient();

  const { error } = await adminClient
    .from('user_profiles')
    .update({ parent_id: null })
    .eq('id', user.id);

  if (error) return { error: 'Failed to unlink parent' };

  revalidatePath('/dashboard/profile');
  return { success: true };
}
