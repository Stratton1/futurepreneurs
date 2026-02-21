import { clsx } from 'clsx';
import type { ProjectStatus } from '@/types/database';

const STATUS_CONFIG: Record<ProjectStatus, { label: string; color: string }> = {
  draft: { label: 'Draft', color: 'bg-gray-100 text-gray-700' },
  pending_verification: { label: 'Awaiting Verification', color: 'bg-amber-100 text-amber-700' },
  pending_consent: { label: 'Awaiting Parent/Guardian Consent', color: 'bg-orange-100 text-orange-700' },
  live: { label: 'Live', color: 'bg-emerald-100 text-emerald-700' },
  funded: { label: 'Funded', color: 'bg-blue-100 text-blue-700' },
  completed: { label: 'Completed', color: 'bg-purple-100 text-purple-700' },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700' },
};

interface ProjectStatusBadgeProps {
  status: ProjectStatus;
  className?: string;
}

export function ProjectStatusBadge({ status, className }: ProjectStatusBadgeProps) {
  const config = STATUS_CONFIG[status] || { label: status, color: 'bg-gray-100 text-gray-700' };

  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
        config.color,
        className
      )}
    >
      {config.label}
    </span>
  );
}
