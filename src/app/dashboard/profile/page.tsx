import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/supabase/auth-helpers';
import { USER_ROLE_LABELS } from '@/lib/constants';
import { User, School, Users, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { RelationshipSection } from './relationship-section';

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const supabase = await createClient();

  // Get school info
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
    const { data: parent } = await supabase
      .from('user_profiles')
      .select('id, full_name, email')
      .eq('id', user.parent_id)
      .single();
    parentInfo = parent;
  }

  // Get children info (for parents)
  let children: { id: string; full_name: string; email: string }[] = [];
  if (user.role === 'parent') {
    const { data } = await supabase
      .from('user_profiles')
      .select('id, full_name, email')
      .eq('parent_id', user.id)
      .eq('role', 'student');
    children = data ?? [];
  }

  // Get mentored students (for teachers)
  let mentoredProjects: { id: string; title: string; student_name: string }[] = [];
  if (user.role === 'teacher') {
    const { data: projects } = await supabase
      .from('projects')
      .select('id, title, student_id')
      .eq('mentor_id', user.id);
    if (projects) {
      for (const p of projects) {
        const { data: student } = await supabase
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

      {/* Basic Info */}
      <section className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <User className="h-5 w-5 text-emerald-500" /> About You
        </h2>
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

      {/* Relationships */}
      <section className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Users className="h-5 w-5 text-emerald-500" /> Family & Connections
        </h2>

        <RelationshipSection
          role={user.role}
          parentInfo={parentInfo}
          children={children}
          mentoredProjects={mentoredProjects}
        />
      </section>
    </div>
  );
}
