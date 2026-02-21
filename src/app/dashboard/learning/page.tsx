import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, BookOpen, GraduationCap, BarChart3 } from 'lucide-react';
import { getCurrentUser } from '@/lib/supabase/auth-helpers';
import { getModuleCompletionCounts } from '@/lib/queries/learning';
import { LEARNING_MODULES, getTotalLessonCount } from '@/lib/learning-modules';
import { LearningModuleCard } from '@/components/features/learning-module-card';

export default async function LearningDashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const completionCounts = await getModuleCompletionCounts(user.id);
  const totalCompleted = Object.values(completionCounts).reduce((sum, c) => sum + c, 0);
  const totalLessons = getTotalLessonCount();
  const allComplete = totalCompleted >= totalLessons;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <Link href="/dashboard" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-6">
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to Dashboard
      </Link>

      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
          <BookOpen className="h-6 w-6 text-blue-700" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Learning</h1>
          <p className="text-gray-600 mt-0.5">
            {totalCompleted} of {totalLessons} lessons completed
          </p>
        </div>
      </div>

      {/* Overall progress */}
      <div className="mb-6 bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Overall progress</span>
          <span className="text-sm font-medium text-gray-900">
            {totalLessons > 0 ? Math.round((totalCompleted / totalLessons) * 100) : 0}%
          </span>
        </div>
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all duration-500"
            style={{ width: `${totalLessons > 0 ? (totalCompleted / totalLessons) * 100 : 0}%` }}
          />
        </div>
        {allComplete && (
          <div className="flex items-center gap-2 mt-3 text-emerald-600">
            <GraduationCap className="h-5 w-5" />
            <span className="font-medium text-sm">All modules complete! You&apos;ve earned the Scholar badge.</span>
          </div>
        )}
      </div>

      {/* View progress link */}
      <div className="mb-6">
        <Link
          href="/dashboard/learning/progress"
          className="inline-flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700 font-medium"
        >
          <BarChart3 className="h-4 w-4" />
          View detailed progress &amp; quiz scores
        </Link>
      </div>

      {/* Module cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        {LEARNING_MODULES.map((mod) => (
          <LearningModuleCard
            key={mod.id}
            module={mod}
            completedCount={completionCounts[mod.id] ?? 0}
          />
        ))}
      </div>
    </div>
  );
}
