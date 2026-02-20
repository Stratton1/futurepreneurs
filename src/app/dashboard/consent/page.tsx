import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/supabase/auth-helpers';
import { getProjectsPendingConsent } from '@/lib/queries/projects';
import { ProjectStatusBadge } from '@/components/features/project-status-badge';
import { Button } from '@/components/ui/button';
import { CURRENCY_SYMBOL } from '@/lib/constants';
import { ShieldCheck } from 'lucide-react';

export default async function ParentConsentPage() {
  const user = await getCurrentUser();

  if (!user) redirect('/login');
  if (user.role !== 'parent') redirect('/dashboard');

  const pendingProjects = await getProjectsPendingConsent(user.id);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Parent Consent</h1>
        <p className="text-gray-600 mt-1">Review and give consent for your child&apos;s projects.</p>
      </div>

      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <ShieldCheck className="h-5 w-5 text-orange-500" />
        Awaiting Your Consent ({pendingProjects.length})
      </h2>

      {pendingProjects.length === 0 ? (
        <div className="bg-gray-50 rounded-xl p-8 text-center">
          <p className="text-gray-500">No projects need your consent right now.</p>
          <p className="text-gray-400 text-sm mt-2">When your child submits a project and their teacher approves it, you&apos;ll be asked to give consent here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingProjects.map((project) => (
            <div key={project.id} className="bg-white rounded-xl border border-orange-200 p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-semibold text-gray-900">{project.title}</h3>
                    <ProjectStatusBadge status={project.status} />
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    by {project.student?.full_name || 'Your child'}
                  </p>
                  {project.short_description && (
                    <p className="text-sm text-gray-500 mt-1">{project.short_description}</p>
                  )}
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <span>{project.category}</span>
                    <span>Goal: {CURRENCY_SYMBOL}{project.goal_amount.toLocaleString()}</span>
                    <span>{project.milestones.length} milestone{project.milestones.length !== 1 ? 's' : ''}</span>
                    {project.mentor && <span>Mentor: {project.mentor.full_name}</span>}
                  </div>
                </div>
                <Link href={`/dashboard/consent/${project.id}`}>
                  <Button size="sm">Review</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
