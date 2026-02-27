import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/supabase/auth-helpers';
import { getPendingUpdatesForTeacher } from '@/lib/queries/project-updates';
import { ClipboardCheck } from 'lucide-react';

const TYPE_LABELS: Record<string, string> = {
  general: 'General Update',
  impact_report: 'Impact Report',
  milestone_complete: 'Milestone Complete',
  thank_you: 'Thank You',
};

export default async function VerifyUpdatesPage() {
  const user = await getCurrentUser();

  if (!user) redirect('/login');
  if (user.role !== 'teacher') redirect('/dashboard');

  const pending = await getPendingUpdatesForTeacher(user.id);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Moderate Updates</h1>
        <p className="text-gray-600 mt-1">
          Review and approve project updates from your students.
        </p>
      </div>

      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <ClipboardCheck className="h-5 w-5 text-amber-500" />
        Pending Review ({pending.length})
      </h2>

      {pending.length === 0 ? (
        <div className="bg-gray-50 rounded-xl p-8 text-center">
          <p className="text-gray-500">No updates waiting for review right now.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pending.map((update) => {
            const date = new Date(update.created_at).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            });

            return (
              <div
                key={update.id}
                className="bg-white rounded-xl border border-amber-200 p-5"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-semibold text-gray-900">{update.title}</h3>
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">
                        {TYPE_LABELS[update.update_type] || update.update_type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      on &quot;{update.project_title}&quot; by{' '}
                      {update.author?.full_name || 'Unknown Student'}
                    </p>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                      {update.content}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">{date}</p>
                  </div>
                  <Link
                    href={`/dashboard/verify-updates/${update.id}`}
                    className="ml-4 shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                  >
                    Review
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
