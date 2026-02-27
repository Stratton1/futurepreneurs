import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/supabase/auth-helpers';
import { getProjectById } from '@/lib/queries/projects';
import { getStretchGoalsForProject } from '@/lib/queries/stretch-goals';
import { ArrowLeft, Target, Sparkles, Clock, CheckCircle2, XCircle, Unlock } from 'lucide-react';
import { CURRENCY_SYMBOL } from '@/lib/constants';
import { StretchGoalForm } from './stretch-goal-form';
import { DeleteStretchGoalButton } from './delete-button';

interface Props {
  params: Promise<{ id: string }>;
}

const STATUS_CONFIG: Record<string, { label: string; icon: typeof Clock; colour: string }> = {
  draft: { label: 'Draft', icon: Clock, colour: 'text-gray-600 bg-gray-50 border-gray-200' },
  pending_approval: { label: 'Pending Review', icon: Clock, colour: 'text-amber-700 bg-amber-50 border-amber-200' },
  approved: { label: 'Approved', icon: CheckCircle2, colour: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  unlocked: { label: 'Unlocked!', icon: Unlock, colour: 'text-purple-700 bg-purple-50 border-purple-200' },
  rejected: { label: 'Rejected', icon: XCircle, colour: 'text-red-700 bg-red-50 border-red-200' },
};

export default async function StretchGoalsPage({ params }: Props) {
  const { id } = await params;
  const user = await getCurrentUser();

  if (!user) redirect('/login');
  if (user.role !== 'student') redirect('/dashboard');

  const project = await getProjectById(id, { useAdmin: true });
  if (!project) notFound();
  if (project.student_id !== user.id) redirect('/dashboard');

  const goals = await getStretchGoalsForProject(id);
  const canCreate = project.status === 'live' || project.status === 'funded';

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Link
          href={`/dashboard/projects/${id}`}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Stretch Goals</h1>
          <p className="text-sm text-gray-500">{project.title}</p>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-2">
          <Sparkles className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-blue-800">
            Stretch goals are bonus targets beyond your original goal of{' '}
            <strong>{CURRENCY_SYMBOL}{Number(project.goal_amount).toLocaleString()}</strong>.
            When funding passes a stretch goal target, it automatically unlocks!
          </p>
        </div>
      </div>

      {/* Existing goals */}
      {goals.length > 0 && (
        <div className="space-y-3 mb-8">
          {goals.map((goal) => {
            const statusInfo = STATUS_CONFIG[goal.status] || STATUS_CONFIG.draft;
            const StatusIcon = statusInfo.icon;
            const progress = Number(project.total_raised) / Number(goal.target_amount) * 100;

            return (
              <div key={goal.id} className="bg-white rounded-xl border border-gray-100 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <Target className="h-4 w-4 text-gray-400" />
                      <h3 className="font-semibold text-gray-900">{goal.title}</h3>
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${statusInfo.colour}`}
                      >
                        <StatusIcon className="h-3 w-3" />
                        {statusInfo.label}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{goal.description}</p>
                    <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
                      <span className="font-medium">Target: {CURRENCY_SYMBOL}{Number(goal.target_amount).toLocaleString()}</span>
                      {(goal.status === 'approved' || goal.status === 'unlocked') && (
                        <span>{Math.min(100, Math.round(progress))}% reached</span>
                      )}
                    </div>
                    {(goal.status === 'approved' || goal.status === 'unlocked') && (
                      <div className="mt-2 w-full bg-gray-100 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full transition-all ${
                            goal.status === 'unlocked' ? 'bg-purple-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.min(100, progress)}%` }}
                        />
                      </div>
                    )}
                  </div>
                  {['draft', 'rejected'].includes(goal.status) && (
                    <DeleteStretchGoalButton goalId={goal.id} />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create new */}
      {canCreate && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Add a Stretch Goal</h2>
          <StretchGoalForm
            projectId={id}
            goalAmount={Number(project.goal_amount)}
          />
        </div>
      )}

      {!canCreate && goals.length === 0 && (
        <div className="bg-gray-50 rounded-xl p-8 text-center">
          <p className="text-gray-500">
            Stretch goals can be added once your project is live or funded.
          </p>
        </div>
      )}
    </div>
  );
}
