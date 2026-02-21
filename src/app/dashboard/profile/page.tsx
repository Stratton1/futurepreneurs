import { redirect } from 'next/navigation';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/supabase/auth-helpers';
import { USER_ROLE_LABELS } from '@/lib/constants';
import { User, School, Users, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { RelationshipSection } from './relationship-section';
import { AvatarDisplay } from '@/components/features/avatar-display';
import { AvatarBuilder } from '@/components/features/avatar-builder';
import { DisplayHandleSection } from './display-handle-section';
import { generateDisplayHandle } from '@/lib/safe-username';

export default async function ProfilePage() {
  let user = await getCurrentUser();
  if (!user) redirect('/login');

  // Auto-assign display handle for students who don't have one yet (best-effort; don't block page)
  if (user.role === 'student' && !user.display_handle) {
    try {
      const adminClient = createAdminClient();
      const handle = await generateDisplayHandle();
      await adminClient.from('user_profiles').update({ display_handle: handle }).eq('id', user.id);
      user = (await getCurrentUser()) ?? user;
    } catch {
      // Migrations may not be applied; page still shows avatar and rest of profile
    }
  }

  // Use admin client for cross-user profile lookups (RLS only allows viewing own profile)
  const adminClient = createAdminClient();
  const supabase = await createClient();

  // Get school info (schools are readable by everyone via RLS)
  let schoolName = null;
  if (user.school_id) {
    const { data: school } = await supabase
      .from('schools')
      .select('name')
      .eq('id', user.school_id)
      .single();
    schoolName = school?.name;
  }

  // Get parent info (for students)
  let parentInfo = null;
  if (user.role === 'student' && user.parent_id) {
    const { data: parent } = await adminClient
      .from('user_profiles')
      .select('id, full_name, email')
      .eq('id', user.parent_id)
      .single();
    parentInfo = parent;
  }

  // Get children info (for parents)
  let children: { id: string; full_name: string; email: string }[] = [];
  if (user.role === 'parent') {
    const { data } = await adminClient
      .from('user_profiles')
      .select('id, full_name, email')
      .eq('parent_id', user.id)
      .eq('role', 'student');
    children = data ?? [];
  }

  // Get mentored students (for teachers)
  const mentoredProjects: { id: string; title: string; student_name: string }[] = [];
  if (user.role === 'teacher') {
    const { data: projects } = await supabase
      .from('projects')
      .select('id, title, student_id')
      .eq('mentor_id', user.id);
    if (projects) {
      for (const p of projects) {
        const { data: student } = await adminClient
          .from('user_profiles')
          .select('full_name')
          .eq('id', p.student_id)
          .single();
        mentoredProjects.push({
          id: p.id,
          title: p.title,
          student_name: student?.full_name || 'Unknown',
        });
      }
    }
  }

  const roleLabel = USER_ROLE_LABELS[user.role] || user.role;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <Link href="/dashboard" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-6">
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to Dashboard
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h1>

      {/* Avatar (students: zero-PII builder; others: optional display) */}
      {(user.role === 'student' || user.avatar_config) && (
        <section className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">Your avatar</h2>
          <p className="text-sm text-gray-500 mb-4">
            Personalise how you appear on your projects. No photos — just choose your style.
          </p>
          <AvatarBuilder
            initialConfig={user.avatar_config ?? null}
            onSaved={() => {}}
          />
        </section>
      )}

      {/* Basic Info */}
      <section className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <User className="h-5 w-5 text-emerald-500" /> About You
        </h2>
        <div className="flex items-center gap-4 mb-4">
          <AvatarDisplay
            avatarConfig={user.avatar_config ?? undefined}
            avatarUrl={user.avatar_url}
            name={user.full_name}
            size="lg"
          />
          <div className="text-sm text-gray-500">Preview</div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-gray-50 rounded-xl p-4">
            <span className="text-gray-500">Name</span>
            <p className="font-medium text-gray-900 mt-1">{user.full_name}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <span className="text-gray-500">Email</span>
            <p className="font-medium text-gray-900 mt-1">{user.email}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <span className="text-gray-500">Role</span>
            <p className="font-medium text-gray-900 mt-1">{roleLabel}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <span className="text-gray-500">Member since</span>
            <p className="font-medium text-gray-900 mt-1">
              {new Date(user.created_at).toLocaleDateString('en-GB', {
                day: 'numeric', month: 'short', year: 'numeric',
              })}
            </p>
          </div>
        </div>
        {schoolName && (
          <div className="mt-4 bg-gray-50 rounded-xl p-4 text-sm flex items-center gap-2">
            <School className="h-4 w-4 text-gray-400" />
            <span className="text-gray-500">School:</span>
            <span className="font-medium text-gray-900">{schoolName}</span>
          </div>
        )}
      </section>

      {/* Display handle (students only) — public name on projects */}
      {user.role === 'student' && (
        <section className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
          <h2 className="font-semibold text-gray-900 mb-2">Your public name</h2>
          <p className="text-sm text-gray-500 mb-4">
            This is how you appear on project pages (e.g. &quot;by BrightSpark42&quot;). No real name is shown.
          </p>
          <DisplayHandleSection initialHandle={user.display_handle ?? null} />
        </section>
      )}

      {/* Relationships */}
      <section className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Users className="h-5 w-5 text-emerald-500" /> Family & Connections
        </h2>

        <RelationshipSection
          role={user.role}
          parentInfo={parentInfo}
          linkedChildren={children}
          mentoredProjects={mentoredProjects}
        />
      </section>
    </div>
  );
}
