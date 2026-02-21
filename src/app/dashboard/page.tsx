import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { signOut } from '@/app/(auth)/actions';
import { USER_ROLE_LABELS } from '@/lib/constants';
import { getPendingInvitations } from '@/lib/queries/collaborators';
import { PendingInvitations } from '@/components/features/pending-invitations';
import { AvatarDisplay } from '@/components/features/avatar-display';
import { AnimateIn } from '@/components/ui/animate-in';
import { getModuleCompletionCounts } from '@/lib/queries/learning';
import { LEARNING_MODULES, getTotalLessonCount } from '@/lib/learning-modules';
import Link from 'next/link';
import {
  FolderPlus, ClipboardCheck, ShieldCheck, Heart, User, Banknote,
  Eye, Bell, Wallet, Trophy, BookOpen, ArrowRight, GraduationCap,
  Sparkles, Rocket, TrendingUp, Award,
} from 'lucide-react';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

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
  const isStudent = profile.role === 'student';

  // ── Student stats (fetched in parallel) ──────────────────────
  let projectCount = 0;
  let totalRaised = 0;
  let badgeCount = 0;
  let learningPct = 0;
  let completedLessonCount = 0;
  let nextLessonLabel: string | null = null;
  let nextLessonHref: string | null = null;

  if (isStudent) {
    const admin = createAdminClient();

    const [projectRes, badgeRes, completionCounts] = await Promise.all([
      admin
        .from('projects')
        .select('id, total_raised')
        .eq('student_id', user.id),
      admin
        .from('user_badges')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id),
      getModuleCompletionCounts(user.id),
    ]);

    projectCount = projectRes.data?.length ?? 0;
    totalRaised = (projectRes.data ?? []).reduce(
      (sum, p) => sum + (Number(p.total_raised) || 0),
      0,
    );
    badgeCount = badgeRes.count ?? 0;

    // Learning progress
    const totalLessons = getTotalLessonCount();
    completedLessonCount = Object.values(completionCounts).reduce((s, c) => s + c, 0);
    learningPct = totalLessons > 0 ? Math.round((completedLessonCount / totalLessons) * 100) : 0;

    // Find next incomplete lesson
    for (const mod of LEARNING_MODULES) {
      const done = completionCounts[mod.id] ?? 0;
      if (done < mod.lessons.length) {
        const nextLesson = mod.lessons[done]; // lessons are in order
        if (nextLesson) {
          nextLessonLabel = nextLesson.title;
          nextLessonHref = `/dashboard/learning/${mod.id}/${nextLesson.id}`;
        }
        break;
      }
    }
  }

  // ── Pending invitations ──────────────────────
  const pendingInvitations = isStudent
    ? await getPendingInvitations(user.id)
    : [];

  // ── Non-student quick actions ──────────────────────
  const otherRoleActions: Record<string, { label: string; href: string; icon: typeof FolderPlus; description: string }[]> = {
    teacher: [
      { label: 'Verify Projects', href: '/dashboard/verify', icon: ClipboardCheck, description: 'Review and approve student projects' },
      { label: 'Drawdown Requests', href: '/dashboard/drawdowns', icon: Banknote, description: 'Approve or reject funding requests' },
      { label: 'Student Spending', href: '/dashboard/wallet/mentor', icon: Wallet, description: 'Review and approve student purchases' },
    ],
    parent: [
      { label: 'Consent Requests', href: '/dashboard/consent', icon: ShieldCheck, description: 'Review and consent to your child\'s projects' },
      { label: 'Drawdown Activity', href: '/dashboard/drawdowns', icon: Eye, description: 'View your child\'s funding requests and approvals' },
      { label: 'Wallet Management', href: '/dashboard/wallet/parent', icon: Wallet, description: 'Manage wallets and approve purchases' },
    ],
    investor: [
      { label: 'Browse Projects', href: '/dashboard/browse', icon: Heart, description: 'Find projects to support' },
      { label: 'Supported Projects', href: '/dashboard/backed', icon: Wallet, description: 'Projects you\'ve supported' },
    ],
  };

  // ─────────────────────────────────────────────────────────
  //  STUDENT DASHBOARD — polished, animated, colorful
  // ─────────────────────────────────────────────────────────
  if (isStudent) {
    const displayName = profile.display_handle || profile.full_name || 'Entrepreneur';

    return (
      <div className="min-h-[80vh]">
        {/* ═══ HERO BANNER ═══ */}
        <section className="relative bg-gradient-to-br from-emerald-500 via-emerald-600 to-blue-600 overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-4 right-8 w-48 h-48 bg-white/5 rounded-full blur-2xl animate-float-slow" />
            <div className="absolute bottom-4 left-12 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-float-slower" />
          </div>

          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
            <div className="flex items-center justify-between">
              <AnimateIn animation="fade-right">
                <div className="flex items-center gap-4">
                  <div className="ring-4 ring-white/20 rounded-full">
                    <AvatarDisplay
                      avatarConfig={profile.avatar_config}
                      name={profile.full_name}
                      size="lg"
                    />
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                      {getGreeting()}, {displayName}!
                    </h1>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="inline-flex items-center gap-1 bg-white/15 text-white/90 rounded-full px-3 py-0.5 text-xs font-medium backdrop-blur-sm">
                        <Rocket className="h-3 w-3" />
                        {roleLabel}
                      </span>
                      {badgeCount > 0 && (
                        <span className="inline-flex items-center gap-1 bg-amber-400/20 text-amber-100 rounded-full px-3 py-0.5 text-xs font-medium">
                          <Award className="h-3 w-3" />
                          {badgeCount} badge{badgeCount !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </AnimateIn>

              <AnimateIn animation="fade-left" delay={100}>
                <form action={signOut}>
                  <Button
                    type="submit"
                    variant="outline"
                    size="sm"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
                  >
                    Log out
                  </Button>
                </form>
              </AnimateIn>
            </div>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* ═══ STATS ROW ═══ */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 -mt-14 relative z-20">
            {[
              {
                label: 'Projects',
                value: projectCount,
                icon: FolderPlus,
                gradient: 'from-emerald-50 to-emerald-100/50',
                iconBg: 'bg-emerald-100',
                iconColor: 'text-emerald-600',
                borderColor: 'border-emerald-200/60',
              },
              {
                label: 'Learning',
                value: `${learningPct}%`,
                icon: BookOpen,
                gradient: 'from-blue-50 to-blue-100/50',
                iconBg: 'bg-blue-100',
                iconColor: 'text-blue-600',
                borderColor: 'border-blue-200/60',
              },
              {
                label: 'Badges',
                value: `${badgeCount}/6`,
                icon: Trophy,
                gradient: 'from-amber-50 to-amber-100/50',
                iconBg: 'bg-amber-100',
                iconColor: 'text-amber-600',
                borderColor: 'border-amber-200/60',
              },
              {
                label: 'Total Raised',
                value: `£${totalRaised.toLocaleString()}`,
                icon: TrendingUp,
                gradient: 'from-purple-50 to-purple-100/50',
                iconBg: 'bg-purple-100',
                iconColor: 'text-purple-600',
                borderColor: 'border-purple-200/60',
              },
            ].map((stat, i) => (
              <AnimateIn key={stat.label} delay={i * 100} animation="fade-up">
                <div className={`bg-gradient-to-br ${stat.gradient} rounded-2xl p-5 border ${stat.borderColor} shadow-sm`}>
                  <div className={`w-10 h-10 ${stat.iconBg} rounded-xl flex items-center justify-center mb-3`}>
                    <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-500 mt-0.5">{stat.label}</p>
                </div>
              </AnimateIn>
            ))}
          </div>

          {/* ═══ LEARNING PROGRESS WIDGET ═══ */}
          {learningPct < 100 && nextLessonHref && (
            <AnimateIn animation="fade-up" delay={200}>
              <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-6 border border-blue-100/60">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <GraduationCap className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-gray-900">Continue Learning</h3>
                      <p className="text-sm text-gray-500 truncate">
                        Next: {nextLessonLabel}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="hidden sm:block w-40">
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                        <span>{completedLessonCount} of {getTotalLessonCount()}</span>
                        <span>{learningPct}%</span>
                      </div>
                      <div className="w-full h-2 bg-white rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-blue-500 transition-all duration-500"
                          style={{ width: `${learningPct}%` }}
                        />
                      </div>
                    </div>
                    <Link
                      href={nextLessonHref}
                      className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5 shadow-md shadow-blue-600/20"
                    >
                      Continue
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </AnimateIn>
          )}
          {learningPct >= 100 && (
            <AnimateIn animation="fade-up" delay={200}>
              <div className="bg-gradient-to-r from-emerald-50 via-emerald-50 to-amber-50 rounded-2xl p-6 border border-emerald-100/60">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Sparkles className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">All lessons complete!</h3>
                    <p className="text-sm text-gray-500">
                      You&apos;ve finished every module in the Learning Hub. Amazing work!
                    </p>
                  </div>
                </div>
              </div>
            </AnimateIn>
          )}

          {/* ═══ PENDING INVITATIONS ═══ */}
          {pendingInvitations.length > 0 && (
            <AnimateIn animation="fade-up" delay={250}>
              <PendingInvitations
                invitations={pendingInvitations.map((inv) => ({
                  id: inv.id,
                  project_id: inv.project_id,
                  project_title: inv.project_title,
                }))}
              />
            </AnimateIn>
          )}

          {/* ═══ QUICK ACTIONS ═══ */}
          <div>
            <AnimateIn animation="fade-in">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
            </AnimateIn>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  label: 'My Projects',
                  href: '/dashboard/projects',
                  icon: FolderPlus,
                  description: 'Create and manage your projects',
                  gradient: 'from-emerald-50 to-emerald-100/30',
                  hoverGradient: 'hover:from-emerald-100 hover:to-emerald-100/50',
                  iconBg: 'bg-emerald-100',
                  iconColor: 'text-emerald-600',
                },
                {
                  label: 'Learning Hub',
                  href: '/dashboard/learning',
                  icon: BookOpen,
                  description: 'Learn business skills with free guides',
                  gradient: 'from-blue-50 to-blue-100/30',
                  hoverGradient: 'hover:from-blue-100 hover:to-blue-100/50',
                  iconBg: 'bg-blue-100',
                  iconColor: 'text-blue-600',
                },
                {
                  label: 'Trophy Room',
                  href: '/dashboard/trophy-room',
                  icon: Trophy,
                  description: 'Your badges and achievements',
                  gradient: 'from-amber-50 to-amber-100/30',
                  hoverGradient: 'hover:from-amber-100 hover:to-amber-100/50',
                  iconBg: 'bg-amber-100',
                  iconColor: 'text-amber-600',
                },
                {
                  label: 'My Wallet',
                  href: '/dashboard/wallet',
                  icon: Wallet,
                  description: 'View balances and request purchases',
                  gradient: 'from-purple-50 to-purple-100/30',
                  hoverGradient: 'hover:from-purple-100 hover:to-purple-100/50',
                  iconBg: 'bg-purple-100',
                  iconColor: 'text-purple-600',
                },
                {
                  label: 'Notifications',
                  href: '/dashboard/notifications',
                  icon: Bell,
                  description: 'View your notifications',
                  gradient: 'from-pink-50 to-pink-100/30',
                  hoverGradient: 'hover:from-pink-100 hover:to-pink-100/50',
                  iconBg: 'bg-pink-100',
                  iconColor: 'text-pink-600',
                },
                {
                  label: 'My Profile',
                  href: '/dashboard/profile',
                  icon: User,
                  description: 'Manage your profile and avatar',
                  gradient: 'from-slate-50 to-slate-100/30',
                  hoverGradient: 'hover:from-slate-100 hover:to-slate-100/50',
                  iconBg: 'bg-slate-100',
                  iconColor: 'text-slate-600',
                },
              ].map((action, i) => (
                <AnimateIn key={action.href + action.label} delay={300 + i * 80} animation="fade-up">
                  <Link
                    href={action.href}
                    className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 rounded-2xl group"
                  >
                    <div className={`bg-gradient-to-br ${action.gradient} ${action.hoverGradient} rounded-2xl p-5 border border-gray-100/50 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 h-full`}>
                      <div className="flex items-start justify-between">
                        <div className={`w-11 h-11 ${action.iconBg} rounded-xl flex items-center justify-center mb-3`}>
                          <action.icon className={`h-5 w-5 ${action.iconColor}`} />
                        </div>
                        <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-gray-500 group-hover:translate-x-0.5 transition-all duration-200" />
                      </div>
                      <h3 className="font-semibold text-gray-900">{action.label}</h3>
                      <p className="text-sm text-gray-500 mt-1">{action.description}</p>
                    </div>
                  </Link>
                </AnimateIn>
              ))}
            </div>
          </div>

          {/* ═══ ACCOUNT INFO ═══ */}
          <AnimateIn animation="fade-in" delay={400}>
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
          </AnimateIn>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────
  //  NON-STUDENT DASHBOARD — keep existing layout
  // ─────────────────────────────────────────────────────────
  const actions = otherRoleActions[profile.role] || [];
  actions.push({ label: 'Notifications', href: '/dashboard/notifications', icon: Bell, description: 'View your notifications' });
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
