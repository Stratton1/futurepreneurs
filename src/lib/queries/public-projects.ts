import { createClient } from '@/lib/supabase/server';

export interface PublicProject {
  id: string;
  title: string;
  short_description: string | null;
  description: string;
  category: string;
  goal_amount: number;
  total_raised: number;
  backer_count: number;
  images: string[];
  video_url: string | null;
  status: string;
  is_featured: boolean;
  created_at: string;
  student: {
    id: string;
    full_name: string;
    avatar_url: string | null;
    bio: string | null;
    school: {
      name: string;
      city: string | null;
    } | null;
  };
  mentor: {
    id: string;
    full_name: string;
  } | null;
  milestones: {
    id: string;
    title: string;
    description: string;
    amount: number;
    sort_order: number;
    status: string;
  }[];
}

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Normalise a raw Supabase project row:
 * - Coerce NUMERIC columns (returned as strings) to numbers
 * - Unwrap FK relations that Supabase may return as single-element arrays
 * - Default missing arrays to []
 */
function normaliseProject(raw: any): any {
  if (!raw) return raw;

  const student = Array.isArray(raw.student) ? raw.student[0] : raw.student;
  if (student && Array.isArray(student.school)) {
    student.school = student.school[0] || null;
  }

  return {
    ...raw,
    goal_amount: Number(raw.goal_amount) || 0,
    total_raised: Number(raw.total_raised) || 0,
    backer_count: Number(raw.backer_count) || 0,
    images: raw.images || [],
    student: student || null,
    mentor: Array.isArray(raw.mentor) ? raw.mentor[0] || null : raw.mentor || null,
    milestones: (raw.milestones || [])
      .map((m: any) => ({ ...m, amount: Number(m.amount) || 0 }))
      .sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0)),
  };
}

/* eslint-enable @typescript-eslint/no-explicit-any */

// Shared select for list queries (no description, video_url, bio, mentor, milestones)
const LIST_SELECT = `
  id, title, short_description, category, goal_amount, total_raised, backer_count,
  images, status, is_featured, created_at,
  student:user_profiles!projects_student_id_fkey(id, full_name, avatar_url, school:schools(name, city))
`;

// Full select for detail page
const DETAIL_SELECT = `
  id, title, short_description, description, category, goal_amount, total_raised, backer_count,
  images, video_url, status, is_featured, created_at,
  student:user_profiles!projects_student_id_fkey(id, full_name, avatar_url, bio, school:schools(name, city)),
  mentor:user_profiles!projects_mentor_id_fkey(id, full_name),
  milestones(id, title, description, amount, sort_order, status)
`;

/** Fetch live projects for the public browse page */
export async function getPublicProjects(options?: {
  category?: string;
  search?: string;
  sort?: 'newest' | 'most_funded' | 'closest_to_goal';
  limit?: number;
  offset?: number;
}) {
  const supabase = await createClient();
  const { category, search, sort = 'newest', limit = 12, offset = 0 } = options || {};

  let query = supabase
    .from('projects')
    .select(LIST_SELECT)
    .in('status', ['live', 'funded', 'completed']);

  if (category && category !== 'all') {
    query = query.eq('category', category);
  }

  if (search) {
    query = query.or(`title.ilike.%${search}%,short_description.ilike.%${search}%`);
  }

  switch (sort) {
    case 'most_funded':
      query = query.order('total_raised', { ascending: false });
      break;
    case 'closest_to_goal':
      query = query.order('total_raised', { ascending: false });
      break;
    case 'newest':
    default:
      query = query.order('created_at', { ascending: false });
      break;
  }

  query = query.range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) {
    console.error('Error fetching public projects:', error);
    return { projects: [], total: 0 };
  }

  return {
    projects: (data || []).map(normaliseProject),
    total: count || data?.length || 0,
  };
}

/** Fetch featured projects for homepage */
export async function getFeaturedProjects(limit = 3) {
  const supabase = await createClient();

  const { data } = await supabase
    .from('projects')
    .select(LIST_SELECT)
    .in('status', ['live', 'funded'])
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(limit);

  return (data || []).map(normaliseProject);
}

/** Fetch recently launched projects for homepage */
export async function getRecentProjects(limit = 6) {
  const supabase = await createClient();

  const { data } = await supabase
    .from('projects')
    .select(LIST_SELECT)
    .in('status', ['live', 'funded'])
    .order('created_at', { ascending: false })
    .limit(limit);

  return (data || []).map(normaliseProject);
}

/** Fetch projects closest to their goal for homepage */
export async function getAlmostThereProjects(limit = 3) {
  const supabase = await createClient();

  const { data } = await supabase
    .from('projects')
    .select(LIST_SELECT)
    .eq('status', 'live')
    .order('total_raised', { ascending: false })
    .limit(limit);

  const normalised = (data || []).map(normaliseProject);

  // Filter to projects that are at least 50% funded
  return normalised.filter(
    (p: PublicProject) => p.goal_amount > 0 && p.total_raised / p.goal_amount >= 0.5 && p.total_raised < p.goal_amount
  );
}

/** Fetch a single project with full details for the public project page */
export async function getPublicProjectById(id: string): Promise<PublicProject | null> {
  const supabase = await createClient();

  const { data: project, error } = await supabase
    .from('projects')
    .select(DETAIL_SELECT)
    .eq('id', id)
    .in('status', ['live', 'funded', 'completed'])
    .single();

  if (error || !project) {
    console.error('getPublicProjectById error:', error?.message || 'No project found');
    return null;
  }

  return normaliseProject(project) as PublicProject;
}

/** Count projects by category (for filter badges) */
export async function getProjectCountsByCategory() {
  const supabase = await createClient();

  const { data } = await supabase
    .from('projects')
    .select('category')
    .in('status', ['live', 'funded', 'completed']);

  const counts: Record<string, number> = {};
  if (data) {
    for (const p of data) {
      counts[p.category] = (counts[p.category] || 0) + 1;
    }
  }

  return counts;
}
