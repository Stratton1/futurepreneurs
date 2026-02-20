'use client';

import Link from 'next/link';
import { Bell, Check, CheckCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { markNotificationReadFormAction, markAllNotificationsReadFormAction } from './actions';
import type { Notification } from '@/types/database';

interface NotificationsListProps {
  notifications: Notification[];
  unreadCount: number;
}

export function NotificationsList({ notifications, unreadCount }: NotificationsListProps) {
  if (notifications.length === 0) {
    return (
      <div className="bg-gray-50 rounded-2xl p-12 text-center">
        <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h2 className="text-lg font-semibold text-gray-700 mb-2">No notifications yet</h2>
        <p className="text-gray-500">When something happens on your projects or account, you&apos;ll see it here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {unreadCount > 0 && (
        <div className="flex justify-end mb-2">
          <form action={markAllNotificationsReadFormAction}>
            <Button type="submit" variant="outline" size="sm">
              <CheckCheck className="h-4 w-4 mr-1" />
              Mark all as read
            </Button>
          </form>
        </div>
      )}
      <ul className="divide-y divide-gray-100 rounded-xl border border-gray-200 overflow-hidden bg-white">
        {notifications.map((n) => {
          const content = (
            <div className="flex items-start gap-3 p-4 hover:bg-gray-50/50 transition-colors">
              <div className="flex-1 min-w-0">
                <p className={`font-medium ${n.is_read ? 'text-gray-600' : 'text-gray-900'}`}>
                  {n.title}
                </p>
                <p className="text-sm text-gray-500 mt-0.5">{n.message}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(n.created_at).toLocaleDateString('en-GB', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </p>
              </div>
              {!n.is_read && (
                <form
                  action={markNotificationReadFormAction}
                  className="shrink-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input type="hidden" name="id" value={n.id} />
                  <Button type="submit" variant="ghost" size="sm" title="Mark as read">
                    <Check className="h-4 w-4" />
                  </Button>
                </form>
              )}
            </div>
          );

          return (
            <li key={n.id}>
              {n.link ? (
                <Link href={n.link} className="block">
                  {content}
                </Link>
              ) : (
                content
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
