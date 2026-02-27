'use client';

import { auditEventLabel } from '@/types/audit';
import type { AuditEventWithActor } from '@/types/audit';
import {
  Banknote, ShieldCheck, ClipboardCheck, CreditCard,
  FileText, Target, HandCoins, Clock,
} from 'lucide-react';

const eventIcons: Record<string, typeof Banknote> = {
  drawdown_requested: Banknote,
  drawdown_approved: Banknote,
  drawdown_rejected: Banknote,
  spending_requested: CreditCard,
  spending_parent_approved: CreditCard,
  spending_parent_declined: CreditCard,
  spending_mentor_approved: CreditCard,
  spending_mentor_rejected: CreditCard,
  consent_approved: ShieldCheck,
  consent_rejected: ShieldCheck,
  project_verified: ClipboardCheck,
  project_changes_requested: ClipboardCheck,
  project_rejected: ClipboardCheck,
  first_drawdown_acknowledged: ShieldCheck,
  update_submitted: FileText,
  update_approved: FileText,
  update_rejected: FileText,
  stretch_goal_created: Target,
  stretch_goal_approved: Target,
  stretch_goal_rejected: Target,
  stretch_goal_unlocked: Target,
};

interface ActivityTimelineProps {
  events: AuditEventWithActor[];
}

export function ActivityTimeline({ events }: ActivityTimelineProps) {
  if (events.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <Clock className="h-8 w-8 mx-auto mb-2" />
        <p className="text-sm">No activity yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {events.map((event) => {
        const Icon = eventIcons[event.event_type] || HandCoins;
        const timeAgo = formatTimeAgo(event.created_at);

        return (
          <div key={event.id} className="flex items-start gap-3 py-2">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
              <Icon className="h-4 w-4 text-gray-500" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-gray-900">
                <strong>{event.actor?.full_name ?? 'Someone'}</strong>{' '}
                {auditEventLabel(event.event_type).toLowerCase()}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                {event.project?.title ?? 'Unknown project'} &middot; {timeAgo}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function formatTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}
