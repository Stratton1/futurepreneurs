/**
 * Rate limiter for AI generation: 10 generations per student per day.
 */

import { createAdminClient } from '@/lib/supabase/server';

const DAILY_LIMIT = 10;

/**
 * Check if a user can generate AI content today.
 * Returns { allowed: true, remaining } or { allowed: false, remaining: 0 }.
 */
export async function checkRateLimit(userId: string): Promise<{
  allowed: boolean;
  remaining: number;
}> {
  const supabase = createAdminClient();

  // Count generations in the last 24 hours
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const { count } = await supabase
    .from('ai_generation_log')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', twentyFourHoursAgo);

  const used = count ?? 0;
  const remaining = Math.max(0, DAILY_LIMIT - used);

  return {
    allowed: remaining > 0,
    remaining,
  };
}

/**
 * Record an AI generation for rate limiting.
 */
export async function recordGeneration(userId: string, type = 'pitch') {
  const supabase = createAdminClient();

  await supabase
    .from('ai_generation_log')
    .insert({ user_id: userId, generation_type: type });
}
