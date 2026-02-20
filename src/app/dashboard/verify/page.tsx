import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/supabase/auth-helpers';
import { getProjectsPendingVerification, getTeacherMentoredProjects } from '@/lib/queries/projects';
import { ProjectStatusBadge } from '@/components/features/project-status-badge';
import { Button } from '@/components/ui/button';
import { CURRENCY_SYMBOL } from '@/lib/constants';
import { ClipboardCheck, FolderOpen } from 'lucide-react';

export default async function TeacherVerifyPage() {
  const user = await getCurrentUser();

  if (!user) redirect('/login');
  if (user.role !== 'teacher') redirect('/dashboard');

  const pendingProjects = await getProjectsPendingVerification(user.id);
  const allProjects = await getTeacherMentoredProjects(user.id);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Project Verification</h1>
        <p className="text-gray-600 mt-1">Review and approve your students&apos; projects.</p>
      </div>

      {/* Pending section */}
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <ClipboardCheck className="h-5 w-5 text-amber-500" />
        Awaiting Your Approval ({pendingProjects.length})
      </h2>

      {pendingProjects.length === 0 ? (
        <div className="bg-gray-50 rounded-xl p-8 text-center mb-8">
          <p className="text-gray-500">No projects waiting for verification right now.</p>
        </div>
      ) : (
        <div className="space-y-4 mb-8">
          {pendingProjects.map((project) => (
            <div key={project.id} className="bg-white rounded-xl border border-amber-200 p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-semibold text-gray-900">{project.title}</h3>
                    <ProjectStatusBadge status={project.status} />
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    by {project.student?.full_name || 'Unknown Student'}
                  </p>
                  {project.short_description && (
                    <p className="text-sm text-gray-500 mt-1">{project.short_description}</p>
                  )}
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <span>{project.category}</span>
                    <span>Goal: {CURRENCY_SYMBOL}{project.goal_amount.toLocaleString()}</span>
                    <span>{project.milestones.length} milestone{project.milestones.length !== 1 ? 's' : ''}</span>
                  </div>
                </div>
                <Link href={`/dashboard/verify/${project.id}`}>
                  <Button size="sm" asChild>Review</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* All mentored projects */}
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <FolderOpen className="h-5 w-5 text-gray-500" />
        All My Students&apos; Projects ({allProjects.length})
      </h2>

      {allProjects.length === 0 ? (
        <div className="bg-gray-50 rounded-xl p-8 text-center">
          <p className="text-gray-500">No students have selected you as their mentor yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {allProjects.map((project) => (
            <div key={project.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900 text-sm">{project.title}</span>
                  <ProjectStatusBadge status={project.status} />
                </div>
                <span className="text-xs text-gray-500">{project.category} — {CURRENCY_SYMBOL}{project.goal_amount.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
