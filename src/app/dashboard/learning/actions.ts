'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/supabase/auth-helpers';
import { revalidatePath } from 'next/cache';
import { LEARNING_MODULES, getTotalLessonCount } from '@/lib/learning-modules';
import { awardLearningComplete } from '@/lib/badges';

/** Mark a lesson as complete */
export async function markLessonComplete(moduleId: string, lessonId: string, score?: number) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Not logged in' };

  const supabase = await createClient();

  const { error } = await supabase.from('learning_progress').upsert(
    {
      user_id: user.id,
      module_id: moduleId,
      lesson_id: lessonId,
      score: score ?? null,
      completed_at: new Date().toISOString(),
    },
    { onConflict: 'user_id,module_id,lesson_id' }
  );

  if (error) return { error: 'Failed to save progress' };

  // Check if all lessons across all modules are now complete
  const admin = createAdminClient();
  const { count } = await admin
    .from('learning_progress')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id);

  const totalLessons = getTotalLessonCount();
  if ((count ?? 0) >= totalLessons) {
    await awardLearningComplete(user.id);
  }

  revalidatePath('/dashboard/learning');
  revalidatePath(`/learn/${moduleId}`);
  return { success: true };
}

/** Submit all quiz answers for a lesson and mark complete */
export async function submitQuizAnswers(
  moduleId: string,
  lessonId: string,
  selectedIndices: number[]
) {
  const mod = LEARNING_MODULES.find((m) => m.id === moduleId);
  const lesson = mod?.lessons.find((l) => l.id === lessonId);

  if (!lesson?.quiz || lesson.quiz.length === 0) {
    return { error: 'No quiz found for this lesson' };
  }

  const results: { isCorrect: boolean; explanation: string }[] = [];
  let correctCount = 0;

  for (let i = 0; i < lesson.quiz.length; i++) {
    const q = lesson.quiz[i];
    const selectedIndex = selectedIndices[i] ?? -1;
    const isCorrect = q.options[selectedIndex]?.isCorrect ?? false;
    if (isCorrect) correctCount++;
    results.push({ isCorrect, explanation: q.explanation });
  }

  const score = Math.round((correctCount / lesson.quiz.length) * 100);

  // Mark lesson complete with score
  const result = await markLessonComplete(moduleId, lessonId, score);
  if ('error' in result) return result;

  return {
    success: true,
    correctCount,
    totalQuestions: lesson.quiz.length,
    results,
  };
}

/** Legacy single-answer submit — kept for backward compatibility */
export async function submitQuizAnswer(
  moduleId: string,
  lessonId: string,
  selectedIndex: number
) {
  const mod = LEARNING_MODULES.find((m) => m.id === moduleId);
  const lesson = mod?.lessons.find((l) => l.id === lessonId);

  if (!lesson?.quiz || lesson.quiz.length === 0) return { error: 'No quiz found for this lesson' };

  // Use the first quiz question for legacy support
  const isCorrect = lesson.quiz[0].options[selectedIndex]?.isCorrect ?? false;
  const score = isCorrect ? 100 : 0;

  const result = await markLessonComplete(moduleId, lessonId, score);
  if ('error' in result) return result;

  return {
    success: true,
    isCorrect,
    explanation: lesson.quiz[0].explanation,
  };
}

/** Toggle a task's completion status */
export async function toggleTaskComplete(moduleId: string, lessonId: string, taskId: string) {
  const user = await getCurrentUser();
  if (!user) return;

  const supabase = await createClient();

  // Check if already completed
  const { data: existing } = await supabase
    .from('task_progress')
    .select('id')
    .eq('user_id', user.id)
    .eq('module_id', moduleId)
    .eq('lesson_id', lessonId)
    .eq('task_id', taskId)
    .maybeSingle();

  if (existing) {
    // Un-complete
    await supabase.from('task_progress').delete().eq('id', existing.id);
  } else {
    // Mark complete
    await supabase.from('task_progress').insert({
      user_id: user.id,
      module_id: moduleId,
      lesson_id: lessonId,
      task_id: taskId,
    });
  }

  revalidatePath(`/dashboard/learning/${moduleId}/${lessonId}`);
}

/** Get completed task IDs for a lesson */
export async function getTaskCompletionForLesson(
  userId: string,
  moduleId: string,
  lessonId: string
): Promise<Set<string>> {
  try {
    const admin = createAdminClient();
    const { data } = await admin
      .from('task_progress')
      .select('task_id')
      .eq('user_id', userId)
      .eq('module_id', moduleId)
      .eq('lesson_id', lessonId);

    return new Set((data ?? []).map((r) => r.task_id));
  } catch {
    // Table may not exist yet if migration hasn't been applied
    return new Set();
  }
}
