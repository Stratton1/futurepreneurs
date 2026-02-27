import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/supabase/auth-helpers';
import { getUpdateById } from '@/lib/queries/project-updates';
import { getProjectById } from '@/lib/queries/projects';
import { ArrowLeft } from 'lucide-react';
import ProjectUpdateCard from '@/components/features/project-update-card';
import { UpdateActions } from './update-actions';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ReviewUpdatePage({ params }: Props) {
  const { id } = await params;
  const user = await getCurrentUser();

  if (!user) redirect('/login');
  if (user.role !== 'teacher') redirect('/dashboard');

  const update = await getUpdateById(id);
  if (!update) notFound();

  const project = await getProjectById(update.project_id, { useAdmin: true });
  if (!project || project.mentor_id !== user.id) {
    redirect('/dashboard/verify-updates');
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <Link
        href="/dashboard/verify-updates"
        className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to Updates
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Review Update</h1>
        <p className="text-gray-600">
          For &quot;{project.title}&quot; by {project.student?.full_name || 'Unknown Student'}
        </p>
      </div>

      <ProjectUpdateCard update={update} showStatus />

      {update.status === 'pending' && (
        <div className="mt-6">
          <UpdateActions updateId={update.id} />
        </div>
      )}
    </div>
  );
}
