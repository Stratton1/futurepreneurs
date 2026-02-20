import { createAdminClient } from '@/lib/supabase/server';

const ADJECTIVES = [
  'Bright', 'Swift', 'Clever', 'Bold', 'Calm', 'Eager', 'Happy', 'Kind', 'Lucky', 'Noble',
  'Proud', 'Quick', 'Brave', 'Cool', 'Daring', 'Fresh', 'Golden', 'Honest', 'Jolly', 'Lively',
  'Mighty', 'Peppy', 'Radiant', 'Smart', 'True', 'Wise', 'Young', 'Zesty', 'Active', 'Breezy',
];

const NOUNS = [
  'Spark', 'Maker', 'Star', 'Dream', 'Flame', 'Heart', 'Idea', 'Jewel', 'Lark', 'Mind',
  'Note', 'Oak', 'Peak', 'Quest', 'Rise', 'Seed', 'Tide', 'Wave', 'Bolt', 'Cloud',
  'Dawn', 'Echo', 'Frost', 'Glow', 'Haven', 'Ivy', 'Joy', 'Kite', 'Lotus', 'Mist',
];

const MAX_ATTEMPTS = 20;

/**
 * Generate a unique safe display handle (e.g. BrightSpark42).
 * Checks DB for uniqueness; retries with new suffix or words if collision.
 */
export async function generateDisplayHandle(): Promise<string> {
  const supabase = createAdminClient();

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
    const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
    const num = Math.floor(Math.random() * 100);
    const handle = `${adj}${noun}${num}`;

    const { data } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('display_handle', handle)
      .maybeSingle();

    if (!data) return handle;
  }

  // Fallback: timestamp-based to guarantee uniqueness
  const fallback = `Creator${Date.now().toString(36).slice(-6)}`;
  const { data } = await supabase
    .from('user_profiles')
    .select('id')
    .eq('display_handle', fallback)
    .maybeSingle();
  return data ? `Creator${Date.now().toString(36)}` : fallback;
}
