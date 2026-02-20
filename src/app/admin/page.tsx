import Link from 'next/link';
import { createAdminClient } from '@/lib/supabase/server';
import { Users, FolderKanban, Flag, Wallet } from 'lucide-react';

export default async function AdminOverviewPage() {
  const supabase = createAdminClient();

  const [
    { count: usersCount },
    { count: projectsCount },
    { count: liveCount },
    { count: fundedCount },
    { count: backingsCount },
    { count: reportsPendingCount },
  ] = await Promise.all([
    supabase.from('user_profiles').select('*', { count: 'exact', head: true }),
    supabase.from('projects').select('*', { count: 'exact', head: true }),
    supabase.from('projects').select('*', { count: 'exact', head: true }).eq('status', 'live'),
    supabase.from('projects').select('*', { count: 'exact', head: true }).eq('status', 'funded'),
    supabase.from('backings').select('*', { count: 'exact', head: true }),
    supabase.from('reports').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
  ]);

  const cards = [
    { label: 'Users', value: usersCount ?? 0, href: '/admin/users', icon: Users },
    { label: 'Projects', value: projectsCount ?? 0, href: '/admin/projects', icon: FolderKanban },
    { label: 'Live projects', value: liveCount ?? 0, href: '/admin/projects?status=live', icon: FolderKanban },
    { label: 'Funded projects', value: fundedCount ?? 0, href: '/admin/projects?status=funded', icon: Wallet },
    { label: 'Backings', value: backingsCount ?? 0, href: '/admin/projects', icon: Wallet },
    { label: 'Reports (pending)', value: reportsPendingCount ?? 0, href: '/admin/reports', icon: Flag },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin overview</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Link key={c.href + c.label} href={c.href}>
            <div className="bg-white rounded-xl border border-gray-200 p-5 hover:border-emerald-200 hover:bg-emerald-50/30 transition-colors">
              <div className="flex items-center gap-3">
                <c.icon className="h-8 w-8 text-emerald-600" />
                <div>
                  <p className="text-sm font-medium text-gray-500">{c.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{c.value}</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
