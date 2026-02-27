import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/supabase/auth-helpers';
import { getProjectById } from '@/lib/queries/projects';
import { getAllUpdatesForProject } from '@/lib/queries/project-updates';
import ProjectUpdateCard from '@/components/features/project-update-card';
import Link from 'next/link';
import { Plus, ArrowLeft } from 'lucide-react';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProjectUpdatesPage({ params }: Props) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user || user.role !== 'student') redirect('/dashboard');

  const project = await getProjectById(id, { useAdmin: true });
  if (!project || project.student_id !== user.id) redirect('/dashboard/projects');

  const updates = await getAllUpdatesForProject(id);
  const canPost = ['live', 'funded', 'completed'].includes(project.status);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Link
          href={`/dashboard/projects`}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-900">Updates for &ldquo;{project.title}&rdquo;</h1>
          <p className="text-sm text-gray-500">Share progress with your backers</p>
        </div>
        {canPost && (
          <Link
            href={`/dashboard/projects/${id}/updates/new`}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm px-4 py-2 rounded-xl transition-colors"
          >
            <Plus className="h-4 w-4" />
            Post Update
          </Link>
        )}
      </div>

      {!canPost && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-sm text-amber-800">
          Updates can only be posted on live, funded, or completed projects.
        </div>
      )}

      {updates.length === 0 ? (
        <div className="bg-gray-50 rounded-2xl p-12 text-center">
          <p className="text-gray-500">No updates posted yet.</p>
          {canPost && (
            <p className="text-sm text-gray-400 mt-2">
              Share how things are going with your backers!
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {updates.map((update) => (
            <ProjectUpdateCard key={update.id} update={update} showStatus />
          ))}
        </div>
      )}
    </div>
  );
}
