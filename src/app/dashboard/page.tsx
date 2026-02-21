import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { signOut } from '@/app/(auth)/actions';
import { USER_ROLE_LABELS } from '@/lib/constants';
import { getPendingInvitations } from '@/lib/queries/collaborators';
import { PendingInvitations } from '@/components/features/pending-invitations';
import Link from 'next/link';
import { FolderPlus, ClipboardCheck, ShieldCheck, Heart, User, Banknote, Eye, Bell, Wallet, Trophy, BookOpen } from 'lucide-react';

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
      { label: 'Learning Hub', href: '/dashboard/learning', icon: BookOpen, description: 'Learn business skills with free guides and quizzes' },
      { label: 'Drawdowns', href: '/dashboard/projects', icon: Banknote, description: 'Request drawdowns for your funded projects' },
      { label: 'Trophy Room', href: '/dashboard/trophy-room', icon: Trophy, description: 'Your badges and achievements' },
    ],
    teacher: [
      { label: 'Verify Projects', href: '/dashboard/verify', icon: ClipboardCheck, description: 'Review and approve student projects' },
      { label: 'Drawdown Requests', href: '/dashboard/drawdowns', icon: Banknote, description: 'Approve or reject funding requests' },
    ],
    parent: [
      { label: 'Consent Requests', href: '/dashboard/consent', icon: ShieldCheck, description: 'Review and consent to your child\'s projects' },
      { label: 'Drawdown Activity', href: '/dashboard/drawdowns', icon: Eye, description: 'View your child\'s funding requests and approvals' },
    ],
    investor: [
      { label: 'Browse Projects', href: '/dashboard/browse', icon: Heart, description: 'Find projects to support' },
      { label: 'Backed Projects', href: '/dashboard/backed', icon: Wallet, description: 'Projects you\'ve supported' },
    ],
  };

  // Fetch pending team invitations for students
  const pendingInvitations = profile.role === 'student'
    ? await getPendingInvitations(user.id)
    : [];

  const actions = quickActions[profile.role] || [];
  // Notifications for all roles
  actions.push({ label: 'Notifications', href: '/dashboard/notifications', icon: Bell, description: 'View your notifications' });
  // Profile for all roles
  actions.push({ label: 'My Profile', href: '/dashboard/profile', icon: User, description: 'Manage your profile and family connections' });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
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

        {/* Pending Team Invitations */}
        {pendingInvitations.length > 0 && (
          <PendingInvitations
            invitations={pendingInvitations.map((inv) => ({
              id: inv.id,
              project_id: inv.project_id,
              project_title: inv.project_title,
            }))}
          />
        )}

        {/* Quick Actions */}
        {actions.length > 0 && (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-6">
            {actions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="block min-h-[88px] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 rounded-xl"
              >
                <div className="bg-emerald-50 hover:bg-emerald-100 rounded-xl p-5 transition-colors cursor-pointer h-full">
                  <action.icon className="h-6 w-6 text-emerald-600 mb-2" aria-hidden />
                  <h3 className="font-semibold text-gray-900">{action.label}</h3>
                  <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div className="bg-gray-50 rounded-xl p-4">
            <span className="text-gray-500">Email</span>
            <p className="font-medium text-gray-900 mt-1 truncate" title={profile.email}>{profile.email}</p>
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
