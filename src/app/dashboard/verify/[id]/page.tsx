import { redirect, notFound } from 'next/navigation';
import { getCurrentUser } from '@/lib/supabase/auth-helpers';
import { getProjectById } from '@/lib/queries/projects';
import { CURRENCY_SYMBOL } from '@/lib/constants';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { VideoEmbed } from '@/components/features/video-embed';
import { LogoPreview } from '@/components/features/logo-preview';
import { getAllRewardTiers } from '@/lib/queries/reward-tiers';
import { RewardTierApprovalCard } from './reward-tier-approval';
import { LogoApprovalCard } from './logo-approval';
import { VerificationActions } from './verification-actions';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function VerifyProjectPage({ params }: Props) {
  const { id } = await params;
  const user = await getCurrentUser();

  if (!user) redirect('/login');
  if (user.role !== 'teacher') redirect('/dashboard');

  const project = await getProjectById(id, { useAdmin: true });
  if (!project) notFound();
  if (project.mentor_id !== user.id) redirect('/dashboard/verify');

  const rewardTiers = await getAllRewardTiers(id);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <Link href="/dashboard/verify" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-6">
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to Verification
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-1">{project.title}</h1>
      <p className="text-gray-600 mb-6">by {project.student?.full_name || 'Unknown Student'}</p>

      {/* Project Details */}
      <div className="space-y-6">
        <section className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900 mb-2">About This Project</h2>
          <p className="text-sm text-gray-500 mb-2">{project.short_description}</p>
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{project.description}</p>
        </section>

        <section className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900 mb-3">Funding Details</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Category</span>
              <p className="font-medium text-gray-900">{project.category}</p>
            </div>
            <div>
              <span className="text-gray-500">Funding Goal</span>
              <p className="font-medium text-gray-900">{CURRENCY_SYMBOL}{project.goal_amount.toLocaleString()}</p>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900 mb-3">Milestones ({project.milestones.length})</h2>
          <div className="space-y-3">
            {project.milestones.map((milestone, index) => (
              <div key={milestone.id} className="bg-gray-50 rounded-lg p-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs text-gray-400">Milestone {index + 1}</span>
                    <p className="font-medium text-gray-900 text-sm">{milestone.title}</p>
                    {milestone.description && (
                      <p className="text-xs text-gray-500 mt-0.5">{milestone.description}</p>
                    )}
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {CURRENCY_SYMBOL}{milestone.amount.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {project.video_url && (
          <section className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="font-semibold text-gray-900 mb-3">Video</h2>
            <VideoEmbed url={project.video_url} title={`${project.title} — Video Pitch`} />
          </section>
        )}

        {/* Logo */}
        {project.logo_config && (
          <section className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="font-semibold text-gray-900 mb-3">Business Logo</h2>
            <div className="flex items-start gap-4">
              <LogoPreview config={project.logo_config} size={100} />
              <LogoApprovalCard
                projectId={id}
                approved={project.logo_approved}
                canApprove={project.status === 'pending_verification'}
              />
            </div>
          </section>
        )}

        {/* Reward Tiers */}
        {rewardTiers.length > 0 && (
          <section className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="font-semibold text-gray-900 mb-3">Reward Tiers ({rewardTiers.length})</h2>
            <div className="space-y-3">
              {rewardTiers.map((tier) => (
                <RewardTierApprovalCard
                  key={tier.id}
                  tier={tier}
                  projectId={id}
                  canApprove={project.status === 'pending_verification'}
                />
              ))}
            </div>
          </section>
        )}

        {/* Actions */}
        {project.status === 'pending_verification' && (
          <VerificationActions projectId={project.id} />
        )}
      </div>
    </div>
  );
}
