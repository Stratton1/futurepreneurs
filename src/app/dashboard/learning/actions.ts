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

/** Submit a quiz answer and mark lesson complete if correct */
export async function submitQuizAnswer(
  moduleId: string,
  lessonId: string,
  selectedIndex: number
) {
  const mod = LEARNING_MODULES.find((m) => m.id === moduleId);
  const lesson = mod?.lessons.find((l) => l.id === lessonId);

  if (!lesson?.quiz) return { error: 'No quiz found for this lesson' };

  const isCorrect = lesson.quiz.options[selectedIndex]?.isCorrect ?? false;
  const score = isCorrect ? 100 : 0;

  // Mark lesson complete regardless of answer (they still learned!)
  const result = await markLessonComplete(moduleId, lessonId, score);
  if ('error' in result) return result;

  return {
    success: true,
    isCorrect,
    explanation: lesson.quiz.explanation,
  };
}
