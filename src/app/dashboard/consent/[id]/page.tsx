import { redirect, notFound } from 'next/navigation';
import { getCurrentUser } from '@/lib/supabase/auth-helpers';
import { getProjectById } from '@/lib/queries/projects';
import { CURRENCY_SYMBOL } from '@/lib/constants';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { ConsentActions } from './consent-actions';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ConsentProjectPage({ params }: Props) {
  const { id } = await params;
  const user = await getCurrentUser();

  if (!user) redirect('/login');
  if (user.role !== 'parent') redirect('/dashboard');

  const project = await getProjectById(id);
  if (!project) notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <Link href="/dashboard/consent" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-6">
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to Consent
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-1">{project.title}</h1>
      <p className="text-gray-600 mb-6">by {project.student?.full_name || 'Your child'}</p>

      <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-800 mb-6">
        <strong>What you&apos;re consenting to:</strong> By giving consent, your child&apos;s project will go live on Futurepreneurs and be visible to the public. Their teacher ({project.mentor?.full_name || 'assigned mentor'}) has already reviewed and approved this project. All funds will be managed through milestones with teacher approval.
      </div>

      <div className="space-y-6">
        <section className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900 mb-2">Project Details</h2>
          <p className="text-sm text-gray-500 mb-2">{project.short_description}</p>
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{project.description}</p>
        </section>

        <section className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900 mb-3">Funding & Milestones</h2>
          <p className="text-sm text-gray-700 mb-3">
            Goal: <strong>{CURRENCY_SYMBOL}{project.goal_amount.toLocaleString()}</strong> — {project.category}
          </p>
          <div className="space-y-2">
            {project.milestones.map((milestone, index) => (
              <div key={milestone.id} className="bg-gray-50 rounded-lg p-3 flex justify-between items-center">
                <div>
                  <span className="text-xs text-gray-400">Milestone {index + 1}</span>
                  <p className="text-sm font-medium text-gray-900">{milestone.title}</p>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  {CURRENCY_SYMBOL}{milestone.amount.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900 mb-2">Mentor</h2>
          <p className="text-sm text-gray-700">
            Verified by <strong>{project.mentor?.full_name || 'Teacher'}</strong>
          </p>
          <p className="text-xs text-gray-500 mt-1">
            The teacher will oversee all milestone drawdowns and fund releases.
          </p>
        </section>

        {project.status === 'pending_consent' && (
          <ConsentActions projectId={project.id} />
        )}
      </div>
    </div>
  );
}
