import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Trophy, CheckCircle2, BarChart3 } from 'lucide-react';
import { getCurrentUser } from '@/lib/supabase/auth-helpers';
import { getLearningProgressForUser, getModuleCompletionCounts } from '@/lib/queries/learning';
import { LEARNING_MODULES, getTotalLessonCount } from '@/lib/learning-modules';
import { AnimateIn } from '@/components/ui/animate-in';

const COLOUR_PROGRESS: Record<string, string> = {
  amber: 'bg-amber-500',
  blue: 'bg-blue-500',
  purple: 'bg-purple-500',
  emerald: 'bg-emerald-500',
  pink: 'bg-pink-500',
  indigo: 'bg-indigo-500',
  slate: 'bg-slate-500',
};

const COLOUR_BG: Record<string, string> = {
  amber: 'bg-amber-50',
  blue: 'bg-blue-50',
  purple: 'bg-purple-50',
  emerald: 'bg-emerald-50',
  pink: 'bg-pink-50',
  indigo: 'bg-indigo-50',
  slate: 'bg-slate-50',
};

const COLOUR_TEXT: Record<string, string> = {
  amber: 'text-amber-600',
  blue: 'text-blue-600',
  purple: 'text-purple-600',
  emerald: 'text-emerald-600',
  pink: 'text-pink-600',
  indigo: 'text-indigo-600',
  slate: 'text-slate-600',
};

export default async function LearningProgressPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const [completionCounts, allProgress] = await Promise.all([
    getModuleCompletionCounts(user.id),
    getLearningProgressForUser(user.id),
  ]);

  const totalLessons = getTotalLessonCount();
  const totalCompleted = Object.values(completionCounts).reduce((s, c) => s + c, 0);
  const overallPct = totalLessons > 0 ? Math.round((totalCompleted / totalLessons) * 100) : 0;

  // Quiz scores per module
  const scoresByModule: Record<string, number[]> = {};
  for (const p of allProgress) {
    if (p.score != null) {
      if (!scoresByModule[p.module_id]) scoresByModule[p.module_id] = [];
      scoresByModule[p.module_id].push(p.score);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <Link href="/dashboard/learning" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-6">
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to Learning Hub
      </Link>

      <AnimateIn animation="fade-in">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
            <BarChart3 className="h-6 w-6 text-purple-700" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Learning Progress</h1>
            <p className="text-gray-600 mt-0.5">Track your journey across all modules</p>
          </div>
        </div>
      </AnimateIn>

      {/* Overall stats */}
      <AnimateIn animation="fade-up" delay={100}>
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-emerald-50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-emerald-700">{overallPct}%</p>
            <p className="text-xs text-emerald-600 mt-1">Overall</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-blue-700">{totalCompleted}/{totalLessons}</p>
            <p className="text-xs text-blue-600 mt-1">Lessons Done</p>
          </div>
          <div className="bg-amber-50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-amber-700">
              {allProgress.filter((p) => p.score != null).length}
            </p>
            <p className="text-xs text-amber-600 mt-1">Quizzes Taken</p>
          </div>
        </div>
      </AnimateIn>

      {/* Per-module breakdown */}
      <div className="space-y-4">
        {LEARNING_MODULES.map((mod, i) => {
          const completed = completionCounts[mod.id] ?? 0;
          const total = mod.lessons.length;
          const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
          const scores = scoresByModule[mod.id] ?? [];
          const avgScore = scores.length > 0 ? Math.round(scores.reduce((s, v) => s + v, 0) / scores.length) : null;
          const isComplete = completed >= total;
          const progressClass = COLOUR_PROGRESS[mod.colour] ?? 'bg-emerald-500';
          const bgClass = COLOUR_BG[mod.colour] ?? 'bg-emerald-50';
          const textClass = COLOUR_TEXT[mod.colour] ?? 'text-emerald-600';

          return (
            <AnimateIn key={mod.id} animation="fade-up" delay={150 + i * 80}>
              <Link
                href={`/dashboard/learning/${mod.id}`}
                className="block bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 ${bgClass} rounded-lg flex items-center justify-center`}>
                      {isComplete ? (
                        <CheckCircle2 className={`h-4 w-4 ${textClass}`} />
                      ) : (
                        <BookOpen className={`h-4 w-4 ${textClass}`} />
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-900 text-sm">{mod.title}</h3>
                  </div>
                  <div className="flex items-center gap-3">
                    {avgScore !== null && (
                      <span className="text-xs font-medium text-gray-500">
                        Avg quiz: <span className={avgScore >= 80 ? 'text-emerald-600' : avgScore >= 60 ? 'text-blue-600' : 'text-amber-600'}>{avgScore}%</span>
                      </span>
                    )}
                    <span className="text-xs font-medium text-gray-500">{completed}/{total}</span>
                  </div>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${progressClass} transition-all duration-500`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                {isComplete && (
                  <div className="flex items-center gap-1.5 mt-2">
                    <Trophy className="h-3.5 w-3.5 text-amber-500" />
                    <span className="text-xs font-medium text-amber-600">Complete!</span>
                  </div>
                )}
              </Link>
            </AnimateIn>
          );
        })}
      </div>
    </div>
  );
}
