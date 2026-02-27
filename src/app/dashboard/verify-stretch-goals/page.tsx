import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/supabase/auth-helpers';
import { getPendingStretchGoalsForTeacher } from '@/lib/queries/stretch-goals';
import { CURRENCY_SYMBOL } from '@/lib/constants';
import { Target } from 'lucide-react';
import { StretchGoalActions } from './stretch-goal-actions';

export default async function VerifyStretchGoalsPage() {
  const user = await getCurrentUser();

  if (!user) redirect('/login');
  if (user.role !== 'teacher') redirect('/dashboard');

  const pending = await getPendingStretchGoalsForTeacher(user.id);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Moderate Stretch Goals</h1>
        <p className="text-gray-600 mt-1">
          Review and approve stretch goals from your students.
        </p>
      </div>

      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Target className="h-5 w-5 text-amber-500" />
        Pending Review ({pending.length})
      </h2>

      {pending.length === 0 ? (
        <div className="bg-gray-50 rounded-xl p-8 text-center">
          <p className="text-gray-500">No stretch goals waiting for review.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pending.map((goal) => (
            <div
              key={goal.id}
              className="bg-white rounded-xl border border-amber-200 p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900">{goal.title}</h3>
                  <p className="text-sm text-gray-600 mt-0.5">
                    on &quot;{goal.project_title}&quot;
                  </p>
                  <p className="text-sm text-gray-500 mt-2">{goal.description}</p>
                  <p className="text-sm font-medium text-gray-700 mt-2">
                    Target: {CURRENCY_SYMBOL}{Number(goal.target_amount).toLocaleString()}
                  </p>
                </div>
                <StretchGoalActions goalId={goal.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
