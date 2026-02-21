import { createClient } from '@/lib/supabase/server';
import type { LearningProgress } from '@/types/learning';

/** Get all completed lessons for a user */
export async function getLearningProgressForUser(userId: string): Promise<LearningProgress[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('learning_progress')
    .select('*')
    .eq('user_id', userId)
    .order('completed_at', { ascending: false });

  return (data ?? []) as LearningProgress[];
}

/** Get completed lesson IDs for a specific module */
export async function getModuleProgress(userId: string, moduleId: string): Promise<Set<string>> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('learning_progress')
    .select('lesson_id')
    .eq('user_id', userId)
    .eq('module_id', moduleId);

  return new Set((data ?? []).map((d) => d.lesson_id));
}

/** Get completion counts per module for a user */
export async function getModuleCompletionCounts(userId: string): Promise<Record<string, number>> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('learning_progress')
    .select('module_id, lesson_id')
    .eq('user_id', userId);

  const counts: Record<string, number> = {};
  for (const row of data ?? []) {
    counts[row.module_id] = (counts[row.module_id] ?? 0) + 1;
  }
  return counts;
}
