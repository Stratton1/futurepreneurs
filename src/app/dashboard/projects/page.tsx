import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/supabase/auth-helpers';
import { getStudentProjects } from '@/lib/queries/projects';
import { ProjectStatusBadge } from '@/components/features/project-status-badge';
import { Button } from '@/components/ui/button';
import { CURRENCY_SYMBOL } from '@/lib/constants';
import { Plus, FolderOpen } from 'lucide-react';
import { SubmitButton } from './submit-button';

export default async function MyProjectsPage() {
  const user = await getCurrentUser();

  if (!user) redirect('/login');
  if (user.role !== 'student') redirect('/dashboard');

  const projects = await getStudentProjects(user.id);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Projects</h1>
          <p className="text-gray-600 mt-1">Manage your project ideas and track their progress.</p>
        </div>
        <Link href="/dashboard/projects/new">
          <Button asChild>
            <Plus className="h-4 w-4 mr-1" /> New Project
          </Button>
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="bg-gray-50 rounded-2xl p-12 text-center">
          <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-700 mb-2">No projects yet</h2>
          <p className="text-gray-500 mb-6">Ready to share your business idea with the world?</p>
          <Link href="/dashboard/projects/new">
            <Button asChild>Create Your First Project</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => (
            <div key={project.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-semibold text-gray-900">{project.title}</h3>
                    <ProjectStatusBadge status={project.status} />
                  </div>
                  {project.short_description && (
                    <p className="text-sm text-gray-600 mt-1">{project.short_description}</p>
                  )}
                  <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                    <span>{project.category}</span>
                    <span>Goal: {CURRENCY_SYMBOL}{project.goal_amount.toLocaleString()}</span>
                    {project.total_raised > 0 && (
                      <span>Raised: {CURRENCY_SYMBOL}{project.total_raised.toLocaleString()}</span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  {project.status === 'draft' && (
                    <>
                      <Link href={`/dashboard/projects/${project.id}/edit`}>
                        <Button variant="outline" size="sm" asChild>Edit</Button>
                      </Link>
                      <SubmitButton projectId={project.id} />
                    </>
                  )}
                  {project.status === 'pending_consent' && (
                    <Link href={`/dashboard/projects/${project.id}/invite-parent`}>
                      <Button variant="secondary" size="sm" asChild>Invite Parent/Guardian</Button>
                    </Link>
                  )}
                  {(project.status === 'funded' || project.status === 'completed') && (
                    <Link href={`/dashboard/projects/${project.id}/drawdowns`}>
                      <Button variant="outline" size="sm" asChild>Drawdowns</Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
