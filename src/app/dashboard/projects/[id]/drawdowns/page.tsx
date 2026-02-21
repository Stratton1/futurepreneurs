import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/supabase/auth-helpers';
import { getProjectById } from '@/lib/queries/projects';
import { getDrawdownRequestsByProject, getMilestoneRemaining } from '@/lib/queries/drawdowns';
import { canRequestDrawdown } from '@/lib/project-status';
import { CURRENCY_SYMBOL } from '@/lib/constants';
import { ArrowLeft, Target } from 'lucide-react';
import { DrawdownRequestForm } from './drawdown-request-form';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProjectDrawdownsPage({ params }: Props) {
  const { id: projectId } = await params;
  const user = await getCurrentUser();

  if (!user) redirect('/login');
  if (user.role !== 'student') redirect('/dashboard');

  const project = await getProjectById(projectId);
  if (!project) notFound();
  if (project.student_id !== user.id) redirect('/dashboard/projects');

  const canRequest = canRequestDrawdown(project.status);
  const drawdowns = await getDrawdownRequestsByProject(projectId);

  const milestonesWithRemaining = await Promise.all(
    project.milestones.map(async (m) => ({
      ...m,
      remaining: await getMilestoneRemaining(m),
    }))
  );

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <Link
        href="/dashboard/projects"
        className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to My Projects
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-1">{project.title}</h1>
      <p className="text-gray-600 mb-6">Request drawdowns against your milestones.</p>

      {!canRequest && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-amber-800 text-sm">
          Drawdowns are only available once your project is fully funded.
        </div>
      )}

      <section className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
        <h2 className="flex items-center gap-2 font-semibold text-gray-900 mb-4">
          <Target className="h-5 w-5 text-gray-500" />
          Milestones & requests
        </h2>

        <div className="space-y-6">
          {milestonesWithRemaining.map((milestone) => (
            <div
              key={milestone.id}
              className="border border-gray-100 rounded-xl p-4 bg-gray-50/50"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
                <h3 className="font-medium text-gray-900">{milestone.title}</h3>
                <span className="text-sm text-gray-500">
                  {CURRENCY_SYMBOL}{milestone.amount.toLocaleString('en-GB')} total
                  {milestone.remaining > 0 && (
                    <span className="text-emerald-600 ml-1">
                      · {CURRENCY_SYMBOL}{milestone.remaining.toFixed(2)} available
                    </span>
                  )}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-3">{milestone.description}</p>

              {canRequest && milestone.remaining > 0 && (
                <DrawdownRequestForm
                  projectId={projectId}
                  milestoneId={milestone.id}
                  milestoneTitle={milestone.title}
                  maxAmount={milestone.remaining}
                />
              )}

              {drawdowns.filter((d) => d.milestone_id === milestone.id).length > 0 && (
                <ul className="mt-3 space-y-2">
                  {drawdowns
                    .filter((d) => d.milestone_id === milestone.id)
                    .map((d) => (
                      <li
                        key={d.id}
                        className="flex flex-wrap items-center justify-between gap-2 text-sm py-2 border-t border-gray-100"
                      >
                        <span>
                          {CURRENCY_SYMBOL}{d.amount.toFixed(2)}
                          {d.reason && (
                            <span className="text-gray-500 ml-1">— {d.reason}</span>
                          )}
                        </span>
                        <span
                          className={
                            d.status === 'approved'
                              ? 'text-emerald-600 font-medium'
                              : d.status === 'rejected'
                                ? 'text-red-600'
                                : 'text-amber-600'
                          }
                        >
                          {d.status === 'pending' && 'Pending'}
                          {d.status === 'approved' && 'Approved'}
                          {d.status === 'rejected' && 'Not approved'}
                        </span>
                        <span className="text-gray-400 text-xs w-full">
                          Requested {new Date(d.requested_at).toLocaleDateString('en-GB')}
                          {d.approved_at &&
                            ` · ${d.status === 'approved' ? 'Approved' : 'Rejected'} ${new Date(d.approved_at).toLocaleDateString('en-GB')}`}
                        </span>
                      </li>
                    ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
