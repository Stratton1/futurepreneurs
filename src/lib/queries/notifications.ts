import { createClient } from '@/lib/supabase/server';
import type { Notification } from '@/types/database';

/** Notifications for the current user (newest first). Uses RLS. */
export async function getNotificationsForUser(
  userId: string,
  limit = 50
): Promise<Notification[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  return (data ?? []) as Notification[];
}

/** Unread count for the current user. */
export async function getUnreadNotificationCount(userId: string): Promise<number> {
  const supabase = await createClient();

  const { count } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('is_read', false);

  return count ?? 0;
}

/** Mark a single notification as read. */
export async function markNotificationRead(
  notificationId: string,
  userId: string
): Promise<boolean> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId)
    .eq('user_id', userId);

  return !error;
}

/** Mark all notifications for user as read. */
export async function markAllNotificationsRead(userId: string): Promise<boolean> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', userId);

  return !error;
}
