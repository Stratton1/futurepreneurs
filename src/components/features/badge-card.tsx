import Link from 'next/link';
import { FolderPlus, Trophy, Banknote, Award } from 'lucide-react';
import { BADGE_TYPES, type BadgeType } from '@/lib/badges';

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  FolderPlus,
  Trophy,
  Banknote,
};

interface BadgeCardProps {
  badgeType: BadgeType;
  earnedAt: string;
  projectId?: string | null;
  projectTitle?: string | null;
}

export function BadgeCard({ badgeType, earnedAt, projectId, projectTitle }: BadgeCardProps) {
  const meta = BADGE_TYPES[badgeType];
  const Icon = meta ? ICONS[meta.icon] ?? Award : Award;
  const name = meta?.name ?? badgeType;
  const description = meta?.description ?? '';

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-start gap-4">
      <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
        <Icon className="h-6 w-6 text-amber-700" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900">{name}</h3>
        <p className="text-sm text-gray-500 mt-0.5">{description}</p>
        {projectId && projectTitle && (
          <Link
            href={`/projects/${projectId}`}
            className="text-sm text-emerald-600 hover:text-emerald-700 font-medium mt-1 inline-block"
          >
            {projectTitle}
          </Link>
        )}
        <p className="text-xs text-gray-400 mt-1">
          Earned {new Date(earnedAt).toLocaleDateString('en-GB', { dateStyle: 'medium' })}
        </p>
      </div>
    </div>
  );
}
