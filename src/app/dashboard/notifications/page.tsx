import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/supabase/auth-helpers';
import { getNotificationsForUser, getUnreadNotificationCount } from '@/lib/queries/notifications';
import { NotificationsList } from './notifications-list';
import { AnimateIn } from '@/components/ui/animate-in';
import { Bell, Sparkles } from 'lucide-react';

export default async function NotificationsPage() {
  const user = await getCurrentUser();

  if (!user) redirect('/login');

  const [notifications, unreadCount] = await Promise.all([
    getNotificationsForUser(user.id),
    getUnreadNotificationCount(user.id),
  ]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <AnimateIn animation="fade-up">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Bell className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
              <p className="text-gray-600 mt-0.5 text-sm flex items-center gap-1.5">
                {unreadCount > 0
                  ? `${unreadCount} unread`
                  : (
                    <>
                      <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
                      All caught up!
                    </>
                  )}
              </p>
            </div>
          </div>
        </div>
      </AnimateIn>

      <AnimateIn animation="fade-up" delay={100}>
        <NotificationsList
          notifications={notifications}
          unreadCount={unreadCount}
        />
      </AnimateIn>
    </div>
  );
}
