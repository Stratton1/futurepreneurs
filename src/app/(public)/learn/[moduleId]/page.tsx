import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, BookOpen, CheckCircle, Clock } from 'lucide-react';
import { getModuleById } from '@/lib/learning-modules';
import { LessonProgressBar } from '@/components/features/lesson-progress-bar';
import { getCurrentUser } from '@/lib/supabase/auth-helpers';
import { getModuleProgress } from '@/lib/queries/learning';

interface ModulePageProps {
  params: Promise<{ moduleId: string }>;
}

export async function generateMetadata({ params }: ModulePageProps) {
  const { moduleId } = await params;
  const mod = getModuleById(moduleId);
  if (!mod) return { title: 'Module Not Found' };
  return {
    title: `${mod.title} — Futurepreneurs Learn`,
    description: mod.description,
  };
}

export default async function ModulePage({ params }: ModulePageProps) {
  const { moduleId } = await params;
  const mod = getModuleById(moduleId);
  if (!mod) notFound();

  const user = await getCurrentUser();
  let completedLessons = new Set<string>();
  if (user) {
    completedLessons = await getModuleProgress(user.id, moduleId);
  }

  const completedCount = completedLessons.size;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <Link href="/learn" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-6">
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to Learning Hub
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{mod.title}</h1>
        <p className="text-gray-600 mt-1">{mod.description}</p>
      </div>

      {user && (
        <div className="mb-6">
          <LessonProgressBar
            completed={completedCount}
            total={mod.lessons.length}
            colour={mod.colour}
          />
        </div>
      )}

      <div className="space-y-3">
        {mod.lessons.map((lesson, index) => {
          const isCompleted = completedLessons.has(lesson.id);
          return (
            <Link
              key={lesson.id}
              href={`/learn/${moduleId}/${lesson.id}`}
              className="block bg-white rounded-xl border border-gray-200 hover:border-gray-300 p-4 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  isCompleted
                    ? 'bg-emerald-100'
                    : 'bg-gray-100'
                }`}>
                  {isCompleted ? (
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                  ) : (
                    <span className="text-sm font-bold text-gray-500">{index + 1}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900">{lesson.title}</h3>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="h-3 w-3" /> {lesson.readingTime} min read
                    </span>
                    {lesson.quiz && (
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <BookOpen className="h-3 w-3" /> Quiz
                      </span>
                    )}
                  </div>
                </div>
                {isCompleted && (
                  <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                    Done
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
