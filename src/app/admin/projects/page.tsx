import Link from 'next/link';
import { createAdminClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/supabase/auth-helpers';
import { CURRENCY_SYMBOL } from '@/lib/constants';
import { FolderKanban } from 'lucide-react';
import { AnimateIn } from '@/components/ui/animate-in';

export default async function AdminProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  await requireAdmin();
  const supabase = createAdminClient();
  const { status } = await searchParams;

  let query = supabase
    .from('projects')
    .select(`
      id,
      title,
      status,
      goal_amount,
      total_raised,
      backer_count,
      created_at,
      user_profiles!projects_student_id_fkey(full_name)
    `)
    .order('created_at', { ascending: false })
    .limit(100);

  if (status) {
    query = query.eq('status', status);
  }

  const { data: rows } = await query;

  const projects = (rows ?? []).map((p: {
    id: string;
    title: string;
    status: string;
    goal_amount: number;
    total_raised: number;
    backer_count: number;
    created_at: string;
    user_profiles: { full_name: string }[] | { full_name: string } | null;
  }) => {
    const profile = Array.isArray(p.user_profiles) ? p.user_profiles[0] : p.user_profiles;
    return {
      id: p.id,
      title: p.title,
      status: p.status,
      goal_amount: Number(p.goal_amount),
      total_raised: Number(p.total_raised),
      backer_count: p.backer_count,
      created_at: p.created_at,
      student_name: profile?.full_name ?? '—',
    };
  });

  const statusBadge = (s: string) => {
    const colors: Record<string, string> = {
      draft: 'bg-gray-100 text-gray-700',
      pending_verification: 'bg-amber-100 text-amber-700',
      pending_consent: 'bg-orange-100 text-orange-700',
      live: 'bg-emerald-100 text-emerald-700',
      funded: 'bg-blue-100 text-blue-700',
      completed: 'bg-purple-100 text-purple-700',
    };
    return colors[s] ?? 'bg-gray-100 text-gray-700';
  };

  return (
    <div>
      <AnimateIn animation="fade-up">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-emerald-600 rounded-xl p-2.5">
            <FolderKanban className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
            <p className="text-sm text-gray-500">{projects.length} projects{status ? ` (${status})` : ''}</p>
          </div>
        </div>
      </AnimateIn>

      <AnimateIn animation="fade-up" delay={80}>
        <div className="flex gap-2 mb-6">
          {[
            { href: '/admin/projects', label: 'All', active: !status },
            { href: '/admin/projects?status=live', label: 'Live', active: status === 'live' },
            { href: '/admin/projects?status=funded', label: 'Funded', active: status === 'funded' },
          ].map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200 ${tab.active ? 'bg-emerald-600 text-white shadow-sm' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              {tab.label}
            </Link>
          ))}
        </div>
      </AnimateIn>

      <AnimateIn animation="fade-up" delay={160}>
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-sm transition-shadow duration-300">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 text-left text-gray-600 font-medium">
                  <th className="p-3">Project</th>
                  <th className="p-3">Student</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Goal</th>
                  <th className="p-3">Raised</th>
                  <th className="p-3">Supporters</th>
                  <th className="p-3">Created</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((p) => (
                  <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="p-3">
                      <Link href={`/projects/${p.id}`} className="font-medium text-emerald-600 hover:underline">
                        {p.title}
                      </Link>
                    </td>
                    <td className="p-3 text-gray-700">{p.student_name}</td>
                    <td className="p-3">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${statusBadge(p.status)}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="p-3 text-gray-700">{CURRENCY_SYMBOL}{p.goal_amount.toFixed(2)}</td>
                    <td className="p-3 font-medium text-emerald-600">{CURRENCY_SYMBOL}{p.total_raised.toFixed(2)}</td>
                    <td className="p-3 text-gray-600">{p.backer_count}</td>
                    <td className="p-3 text-gray-500">
                      {new Date(p.created_at).toLocaleDateString('en-GB', { dateStyle: 'medium' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {projects.length === 0 && (
            <p className="p-6 text-gray-500 text-center">No projects found.</p>
          )}
        </div>
      </AnimateIn>
    </div>
  );
}
