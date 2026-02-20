import { createClient } from '@/lib/supabase/server';
import type { Project, Milestone, UserProfile } from '@/types/database';

export interface ProjectWithDetails extends Project {
  milestones: Milestone[];
  student: Pick<UserProfile, 'id' | 'full_name' | 'email' | 'avatar_url' | 'school_id'> | null;
  mentor: Pick<UserProfile, 'id' | 'full_name' | 'email'> | null;
}

/** Fetch a single project with milestones, student, and mentor */
export async function getProjectById(projectId: string): Promise<ProjectWithDetails | null> {
  const supabase = await createClient();

  const { data: project } = await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .single();

  if (!project) return null;

  const { data: milestones } = await supabase
    .from('milestones')
    .select('*')
    .eq('project_id', projectId)
    .order('sort_order');

  const { data: student } = await supabase
    .from('user_profiles')
    .select('id, full_name, email, avatar_url, school_id')
    .eq('id', project.student_id)
    .single();

  let mentor = null;
  if (project.mentor_id) {
    const { data } = await supabase
      .from('user_profiles')
      .select('id, full_name, email')
      .eq('id', project.mentor_id)
      .single();
    mentor = data;
  }

  return {
    ...project,
    milestones: milestones ?? [],
    student,
    mentor,
  };
}

/** Fetch all projects for a student */
export async function getStudentProjects(studentId: string): Promise<Project[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from('projects')
    .select('*')
    .eq('student_id', studentId)
    .order('created_at', { ascending: false });

  return data ?? [];
}

/** Fetch projects pending teacher verification for a specific teacher */
export async function getProjectsPendingVerification(teacherId: string): Promise<ProjectWithDetails[]> {
  const supabase = await createClient();

  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .eq('mentor_id', teacherId)
    .eq('status', 'pending_verification')
    .order('created_at', { ascending: false });

  if (!projects || projects.length === 0) return [];

  const results: ProjectWithDetails[] = [];
  for (const project of projects) {
    const full = await getProjectById(project.id);
    if (full) results.push(full);
  }

  return results;
}

/** Fetch projects pending parental consent for a parent */
export async function getProjectsPendingConsent(parentId: string): Promise<ProjectWithDetails[]> {
  const supabase = await createClient();

  // Find consent records for this parent that are pending
  const { data: consents } = await supabase
    .from('parental_consents')
    .select('project_id')
    .eq('parent_id', parentId)
    .eq('status', 'pending');

  if (!consents || consents.length === 0) return [];

  const projectIds = consents.map((c) => c.project_id);

  const results: ProjectWithDetails[] = [];
  for (const pid of projectIds) {
    const full = await getProjectById(pid);
    if (full) results.push(full);
  }

  return results;
}

/** Fetch verified teachers at a specific school */
export async function getTeachersAtSchool(schoolId: string): Promise<Pick<UserProfile, 'id' | 'full_name' | 'email'>[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from('user_profiles')
    .select('id, full_name, email')
    .eq('role', 'teacher')
    .eq('school_id', schoolId)
    .eq('is_active', true)
    .order('full_name');

  return data ?? [];
}

/** Fetch all projects a teacher mentors (any status) */
export async function getTeacherMentoredProjects(teacherId: string): Promise<Project[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from('projects')
    .select('*')
    .eq('mentor_id', teacherId)
    .order('created_at', { ascending: false });

  return data ?? [];
}
