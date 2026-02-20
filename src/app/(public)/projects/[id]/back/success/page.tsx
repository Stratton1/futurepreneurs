import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Heart, ArrowRight } from 'lucide-react';
import { getPublicProjectById } from '@/lib/queries/public-projects';

interface SuccessPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ session_id?: string }>;
}

export default async function BackSuccessPage({ params, searchParams }: SuccessPageProps) {
  const { id: projectId } = await params;
  const { session_id } = await searchParams;

  const project = await getPublicProjectById(projectId);
  if (!project) {
    notFound();
  }

  const hasSession = Boolean(session_id?.trim());

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-6">
          <Heart className="h-8 w-8 text-emerald-600" />
        </div>

        {hasSession ? (
          <>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Thank you for backing!</h1>
            <p className="text-gray-600 mb-6">
              Your support means a lot. You&apos;ve helped bring <strong>{project.title}</strong> one
              step closer to its goal.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h1>
            <p className="text-gray-600 mb-6">
              We couldn&apos;t confirm your payment. If you were charged, our team will be in touch.
              Otherwise, feel free to try again.
            </p>
          </>
        )}

        <Link
          href={`/projects/${projectId}`}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-7 py-3.5 text-lg font-semibold text-white shadow-sm transition-colors hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        >
          View project
          <ArrowRight className="h-5 w-5" />
        </Link>

        <p className="mt-6 text-sm text-gray-500">
          <Link href="/projects" className="text-emerald-600 hover:text-emerald-700 font-medium">
            Browse more projects
          </Link>
        </p>
      </div>
    </div>
  );
}
