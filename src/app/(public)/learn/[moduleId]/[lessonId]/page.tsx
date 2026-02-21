import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, CheckCircle, Clock, BookOpen } from 'lucide-react';
import { getLessonById } from '@/lib/learning-modules';
import { getCurrentUser } from '@/lib/supabase/auth-helpers';
import { getModuleProgress } from '@/lib/queries/learning';
import { LessonContent } from './lesson-content';

interface LessonPageProps {
  params: Promise<{ moduleId: string; lessonId: string }>;
}

export async function generateMetadata({ params }: LessonPageProps) {
  const { moduleId, lessonId } = await params;
  const result = getLessonById(moduleId, lessonId);
  if (!result) return { title: 'Lesson Not Found' };
  return {
    title: `${result.lesson.title} — ${result.module.title} — Futurepreneurs Learn`,
    description: `Learn about ${result.lesson.title.toLowerCase()} in our ${result.module.title} module.`,
  };
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { moduleId, lessonId } = await params;
  const result = getLessonById(moduleId, lessonId);
  if (!result) notFound();

  const { module: mod, lesson } = result;

  const user = await getCurrentUser();
  let completedLessons = new Set<string>();
  if (user) {
    completedLessons = await getModuleProgress(user.id, moduleId);
  }

  const isCompleted = completedLessons.has(lessonId);

  // Find next and previous lessons
  const currentIndex = mod.lessons.findIndex((l) => l.id === lessonId);
  const prevLesson = currentIndex > 0 ? mod.lessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < mod.lessons.length - 1 ? mod.lessons[currentIndex + 1] : null;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <Link href={`/learn/${moduleId}`} className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-6">
        <ArrowLeft className="h-4 w-4 mr-1" /> {mod.title}
      </Link>

      {/* Lesson header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <span>Lesson {currentIndex + 1} of {mod.lessons.length}</span>
          <span className="text-gray-300">|</span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" /> {lesson.readingTime} min read
          </span>
          {lesson.quiz && (
            <>
              <span className="text-gray-300">|</span>
              <span className="flex items-center gap-1">
                <BookOpen className="h-3.5 w-3.5" /> Includes quiz
              </span>
            </>
          )}
          {isCompleted && (
            <>
              <span className="text-gray-300">|</span>
              <span className="flex items-center gap-1 text-emerald-600">
                <CheckCircle className="h-3.5 w-3.5" /> Completed
              </span>
            </>
          )}
        </div>
        <h1 className="text-2xl font-bold text-gray-900">{lesson.title}</h1>
      </div>

      {/* Lesson content (client component for interactivity) */}
      <LessonContent
        moduleId={moduleId}
        lessonId={lessonId}
        content={lesson.content}
        quiz={lesson.quiz ?? null}
        isLoggedIn={!!user}
        alreadyCompleted={isCompleted}
      />

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
        {prevLesson ? (
          <Link
            href={`/learn/${moduleId}/${prevLesson.id}`}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" /> {prevLesson.title}
          </Link>
        ) : (
          <div />
        )}
        {nextLesson ? (
          <Link
            href={`/learn/${moduleId}/${nextLesson.id}`}
            className="flex items-center gap-2 text-sm font-medium text-emerald-600 hover:text-emerald-700"
          >
            {nextLesson.title} <ArrowRight className="h-4 w-4" />
          </Link>
        ) : (
          <Link
            href={`/learn/${moduleId}`}
            className="flex items-center gap-2 text-sm font-medium text-emerald-600 hover:text-emerald-700"
          >
            Back to module <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>
    </div>
  );
}
