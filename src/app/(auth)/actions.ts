'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { isValidEmail, isStrongPassword, isValidFullName } from '@/lib/validations';
import type { UserRole } from '@/types/database';

interface SignUpData {
  email: string;
  password: string;
  fullName: string;
  role: UserRole;
}

export async function signUp(formData: SignUpData) {
  const supabase = await createClient();
  const { email, password, fullName, role } = formData;

  // Validate inputs
  if (!isValidEmail(email)) {
    return { error: 'Please enter a valid email address' };
  }

  const passwordCheck = isStrongPassword(password);
  if (!passwordCheck.valid) {
    return { error: passwordCheck.message };
  }

  if (!isValidFullName(fullName)) {
    return { error: 'Please enter your full name (first and last name)' };
  }

  // For students, validate school email domain against registered schools
  if (role === 'student') {
    const domain = email.split('@')[1]?.toLowerCase();
    if (!domain) {
      return { error: 'Invalid email address' };
    }

    const { data: school } = await supabase
      .from('schools')
      .select('id')
      .eq('email_domain', domain)
      .eq('is_active', true)
      .single();

    if (!school) {
      return {
        error: 'Students must sign up with a school email address. If your school isn\'t registered yet, ask a teacher to contact us.',
      };
    }
  }

  // Create the auth user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  });

  if (authError) {
    return { error: authError.message };
  }

  if (!authData.user) {
    return { error: 'Something went wrong. Please try again.' };
  }

  // Create the user profile
  // For students and teachers, look up their school from the email domain
  let schoolId = null;
  if (role === 'student' || role === 'teacher') {
    const domain = email.split('@')[1]?.toLowerCase();
    const { data: school } = await supabase
      .from('schools')
      .select('id')
      .eq('email_domain', domain)
      .single();
    schoolId = school?.id ?? null;
  }

  const { error: profileError } = await supabase.from('user_profiles').insert({
    id: authData.user.id,
    email,
    full_name: fullName,
    role,
    school_id: schoolId,
  });

  if (profileError) {
    console.error('Profile creation error:', profileError);
    return { error: 'Account created but profile setup failed. Please contact support.' };
  }

  return {
    success: true,
    message: 'Check your email to verify your account! We\'ve sent you a confirmation link.',
  };
}

export async function signIn(formData: { email: string; password: string }) {
  const supabase = await createClient();
  const { email, password } = formData;

  if (!isValidEmail(email)) {
    return { error: 'Please enter a valid email address' };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: 'Invalid email or password. Please try again.' };
  }

  redirect('/dashboard');
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/');
}
