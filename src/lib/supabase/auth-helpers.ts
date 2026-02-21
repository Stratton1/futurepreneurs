import { createClient } from './server';
import { redirect } from 'next/navigation';
import type { UserProfile, UserRole } from '@/types/database';

/**
 * Get the current authenticated user's profile
 */
export async function getCurrentUser(): Promise<UserProfile | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return profile;
}

/**
 * Check if the current user has a specific role
 */
export async function hasRole(role: UserRole): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.role === role;
}

/**
 * Check if an email domain belongs to a registered school
 */
export async function isRegisteredSchoolEmail(email: string): Promise<{
  isValid: boolean;
  schoolId: string | null;
  schoolName: string | null;
}> {
  const supabase = await createClient();
  const domain = email.split('@')[1]?.toLowerCase();

  if (!domain) {
    return { isValid: false, schoolId: null, schoolName: null };
  }

  const { data: school } = await supabase
    .from('schools')
    .select('id, name')
    .eq('email_domain', domain)
    .eq('is_active', true)
    .single();

  if (school) {
    return { isValid: true, schoolId: school.id, schoolName: school.name };
  }

  return { isValid: false, schoolId: null, schoolName: null };
}

/**
 * Require the current user to be an admin. Redirects to /dashboard if not.
 * Defence-in-depth: use in admin page server components alongside the layout check.
 */
export async function requireAdmin(): Promise<UserProfile> {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    redirect('/dashboard');
  }
  return user;
}

/**
 * Get all schools for display in forms
 */
export async function getSchools() {
  const supabase = await createClient();

  const { data: schools } = await supabase
    .from('schools')
    .select('id, name, email_domain, city')
    .eq('is_active', true)
    .order('name');

  return schools ?? [];
}
