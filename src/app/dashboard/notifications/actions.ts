'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { markNotificationRead as markReadQuery, markAllNotificationsRead as markAllReadQuery } from '@/lib/queries/notifications';

export async function markNotificationRead(formOrId: FormData | string): Promise<{ error: string | null }> {
  const notificationId = typeof formOrId === 'string' ? formOrId : (formOrId.get('id') as string);
  if (!notificationId) return { error: 'Missing id' };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not signed in' };

  const ok = await markReadQuery(notificationId, user.id);
  if (!ok) return { error: 'Failed to mark as read' };
  revalidatePath('/dashboard/notifications');
  revalidatePath('/dashboard');
  return { error: null };
}

export async function markAllNotificationsRead(): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not signed in' };

  const ok = await markAllReadQuery(user.id);
  if (!ok) return { error: 'Failed to mark all as read' };
  revalidatePath('/dashboard/notifications');
  revalidatePath('/dashboard');
  return { error: null };
}

/** Wrapper for form action (returns void). */
export async function markAllNotificationsReadFormAction(_formData: FormData): Promise<void> {
  await markAllNotificationsRead();
}

/** Wrapper for form action (returns void). */
export async function markNotificationReadFormAction(formData: FormData): Promise<void> {
  await markNotificationRead(formData);
}
