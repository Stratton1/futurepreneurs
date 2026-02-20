import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/supabase/auth-helpers';
import { getNotificationsForUser, getUnreadNotificationCount } from '@/lib/queries/notifications';
import { NotificationsList } from './notifications-list';

export default async function NotificationsPage() {
  const user = await getCurrentUser();

  if (!user) redirect('/login');

  const [notifications, unreadCount] = await Promise.all([
    getNotificationsForUser(user.id),
    getUnreadNotificationCount(user.id),
  ]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600 mt-1">
            {unreadCount > 0
              ? `${unreadCount} unread`
              : 'All caught up!'}
          </p>
        </div>
      </div>

      <NotificationsList
        notifications={notifications}
        unreadCount={unreadCount}
      />
    </div>
  );
}
