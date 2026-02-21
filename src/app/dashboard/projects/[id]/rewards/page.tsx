import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Gift } from 'lucide-react';
import { getCurrentUser } from '@/lib/supabase/auth-helpers';
import { getProjectById } from '@/lib/queries/projects';
import { getAllRewardTiers } from '@/lib/queries/reward-tiers';
import { CURRENCY_SYMBOL } from '@/lib/constants';
import { RewardTierForm } from '@/components/features/reward-tier-form';
import { RewardTierCard } from '@/components/features/reward-tier-card';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ManageRewardsPage({ params }: Props) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  if (user.role !== 'student') redirect('/dashboard');

  const project = await getProjectById(id);
  if (!project) notFound();
  if (project.student_id !== user.id) redirect('/dashboard/projects');

  const tiers = await getAllRewardTiers(id);
  const isDraft = project.status === 'draft';

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <Link href={`/dashboard/projects/${id}/edit`} className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-6">
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to Project
      </Link>

      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
          <Gift className="h-5 w-5 text-purple-700" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Reward Tiers</h1>
          <p className="text-sm text-gray-600">Offer rewards to backers who support your project</p>
        </div>
      </div>

      {/* Info box */}
      <div className="bg-purple-50 rounded-xl p-4 text-sm text-purple-800 mb-6">
        <strong>How rewards work:</strong> Create reward tiers with a minimum backing amount. Your teacher will review and approve each tier before your project goes live. Backers can then choose a reward when they support your project.
      </div>

      {/* Existing tiers */}
      {tiers.length > 0 && (
        <div className="space-y-3 mb-6">
          {tiers.map((tier) => (
            <RewardTierCard
              key={tier.id}
              tier={tier}
              projectId={id}
              canDelete={isDraft}
              showApprovalStatus
            />
          ))}
        </div>
      )}

      {tiers.length === 0 && (
        <div className="bg-gray-50 rounded-xl p-6 text-center text-sm text-gray-500 mb-6">
          No reward tiers yet. Add one below to get started!
        </div>
      )}

      {/* Add new tier form */}
      {isDraft ? (
        <RewardTierForm projectId={id} currency={CURRENCY_SYMBOL} />
      ) : (
        <div className="bg-amber-50 rounded-xl p-4 text-sm text-amber-800">
          Reward tiers can only be added or removed while your project is in draft status.
        </div>
      )}
    </div>
  );
}
