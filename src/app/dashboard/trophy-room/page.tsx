import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/supabase/auth-helpers';
import { getBadgesForUser } from '@/lib/badges';
import { BadgeCard } from '@/components/features/badge-card';
import { Trophy, ArrowLeft } from 'lucide-react';
import type { BadgeType } from '@/lib/badges';

export default async function TrophyRoomPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const badges = await getBadgesForUser(user.id);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <Link href="/dashboard" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-6">
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to Dashboard
      </Link>

      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
          <Trophy className="h-6 w-6 text-amber-700" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Trophy Room</h1>
          <p className="text-gray-600 mt-0.5">Your badges and achievements</p>
        </div>
      </div>

      {badges.length === 0 ? (
        <div className="bg-gray-50 rounded-2xl p-12 text-center">
          <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-700 mb-2">No badges yet</h2>
          <p className="text-gray-500">
            Create a project, reach your funding goal, or get a drawdown approved to earn badges.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {badges.map((b) => (
            <li key={b.id}>
              <BadgeCard
                badgeType={b.badge_type as BadgeType}
                earnedAt={b.earned_at}
                projectId={b.project_id}
                projectTitle={b.project_title}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
