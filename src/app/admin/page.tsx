import Link from 'next/link';
import { createAdminClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/supabase/auth-helpers';
import { Users, FolderKanban, Flag, Wallet, Handshake, Shield } from 'lucide-react';
import { AnimateIn } from '@/components/ui/animate-in';

export default async function AdminOverviewPage() {
  await requireAdmin();
  const supabase = createAdminClient();

  const [
    { count: usersCount },
    { count: projectsCount },
    { count: liveCount },
    { count: fundedCount },
    { count: backingsCount },
    { count: reportsPendingCount },
    { count: sponsorsCount },
  ] = await Promise.all([
    supabase.from('user_profiles').select('*', { count: 'exact', head: true }),
    supabase.from('projects').select('*', { count: 'exact', head: true }),
    supabase.from('projects').select('*', { count: 'exact', head: true }).eq('status', 'live'),
    supabase.from('projects').select('*', { count: 'exact', head: true }).eq('status', 'funded'),
    supabase.from('backings').select('*', { count: 'exact', head: true }),
    supabase.from('reports').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('matching_sponsors').select('*', { count: 'exact', head: true }).eq('is_active', true),
  ]);

  const cards = [
    { label: 'Users', value: usersCount ?? 0, href: '/admin/users', icon: Users, color: 'text-blue-600 bg-blue-50' },
    { label: 'Projects', value: projectsCount ?? 0, href: '/admin/projects', icon: FolderKanban, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Live projects', value: liveCount ?? 0, href: '/admin/projects?status=live', icon: FolderKanban, color: 'text-green-600 bg-green-50' },
    { label: 'Funded projects', value: fundedCount ?? 0, href: '/admin/projects?status=funded', icon: Wallet, color: 'text-purple-600 bg-purple-50' },
    { label: 'Backings', value: backingsCount ?? 0, href: '/admin/projects', icon: Wallet, color: 'text-indigo-600 bg-indigo-50' },
    { label: 'Reports (pending)', value: reportsPendingCount ?? 0, href: '/admin/reports', icon: Flag, color: 'text-amber-600 bg-amber-50' },
    { label: 'Matching Sponsors', value: sponsorsCount ?? 0, href: '/admin/matching', icon: Handshake, color: 'text-rose-600 bg-rose-50' },
  ];

  return (
    <div>
      <AnimateIn animation="fade-up">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-gray-900 rounded-xl p-2.5">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Overview</h1>
            <p className="text-sm text-gray-500">Platform management at a glance</p>
          </div>
        </div>
      </AnimateIn>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c, i) => (
          <AnimateIn key={c.href + c.label} animation="fade-up" delay={80 + i * 60}>
            <Link href={c.href}>
              <div className="bg-white rounded-xl border border-gray-200 p-5 hover:border-emerald-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className={`rounded-lg p-2 ${c.color}`}>
                    <c.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">{c.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{c.value}</p>
                  </div>
                </div>
              </div>
            </Link>
          </AnimateIn>
        ))}
      </div>
    </div>
  );
}
