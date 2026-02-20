import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { signOut } from '@/app/(auth)/actions';
import { USER_ROLE_LABELS } from '@/lib/constants';
import Link from 'next/link';
import { FolderPlus, ClipboardCheck, ShieldCheck, Heart, User } from 'lucide-react';

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile) {
    redirect('/login');
  }

  const roleLabel = USER_ROLE_LABELS[profile.role] || profile.role;

  // Role-specific quick actions
  const quickActions: Record<string, { label: string; href: string; icon: typeof FolderPlus; description: string }[]> = {
    student: [
      { label: 'My Projects', href: '/dashboard/projects', icon: FolderPlus, description: 'Create and manage your projects' },
    ],
    teacher: [
      { label: 'Verify Projects', href: '/dashboard/verify', icon: ClipboardCheck, description: 'Review and approve student projects' },
    ],
    parent: [
      { label: 'Consent Requests', href: '/dashboard/consent', icon: ShieldCheck, description: 'Review and consent to your child\'s projects' },
    ],
    investor: [
      { label: 'Browse Projects', href: '/dashboard/browse', icon: Heart, description: 'Find projects to support' },
    ],
  };

  const actions = quickActions[profile.role] || [];
  // Add profile link for all roles
  actions.push({ label: 'My Profile', href: '/dashboard/profile', icon: User, description: 'Manage your profile and family connections' });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome, {profile.full_name}!
            </h1>
            <p className="text-gray-600 mt-1">
              You&apos;re logged in as a <strong>{roleLabel}</strong>
            </p>
          </div>
          <form action={signOut}>
            <Button type="submit" variant="outline" size="sm">
              Log out
            </Button>
          </form>
        </div>

        {/* Quick Actions */}
        {actions.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 mb-6">
            {actions.map((action) => (
              <Link key={action.href} href={action.href}>
                <div className="bg-emerald-50 hover:bg-emerald-100 rounded-xl p-5 transition-colors cursor-pointer">
                  <action.icon className="h-6 w-6 text-emerald-600 mb-2" />
                  <h3 className="font-semibold text-gray-900">{action.label}</h3>
                  <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-gray-50 rounded-xl p-4">
            <span className="text-gray-500">Email</span>
            <p className="font-medium text-gray-900 mt-1">{profile.email}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <span className="text-gray-500">Role</span>
            <p className="font-medium text-gray-900 mt-1">{roleLabel}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <span className="text-gray-500">Verified</span>
            <p className="font-medium text-gray-900 mt-1">{profile.is_verified ? 'Yes' : 'Pending'}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <span className="text-gray-500">Member since</span>
            <p className="font-medium text-gray-900 mt-1">
              {new Date(profile.created_at).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
