import { createAdminClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/supabase/auth-helpers';
import { AdminReportActions } from './report-actions';
import { Flag, ShieldCheck } from 'lucide-react';
import { AnimateIn } from '@/components/ui/animate-in';

export default async function AdminReportsPage() {
  await requireAdmin();
  const supabase = createAdminClient();

  const { data: reports } = await supabase
    .from('reports')
    .select(`
      id,
      project_id,
      reporter_id,
      reason,
      details,
      status,
      created_at,
      projects(title),
      user_profiles!reports_reporter_id_fkey(full_name, email)
    `)
    .order('status', { ascending: true }) // pending first (alphabetically)
    .order('created_at', { ascending: false });

  const list = (reports ?? []).map((r: {
    id: string;
    project_id: string;
    reason: string;
    details: string | null;
    status: string;
    created_at: string;
    projects: { title: string }[] | { title: string } | null;
    user_profiles: { full_name: string; email: string }[] | { full_name: string; email: string } | null;
  }) => {
    const project = Array.isArray(r.projects) ? r.projects[0] : r.projects;
    const profile = Array.isArray(r.user_profiles) ? r.user_profiles[0] : r.user_profiles;
    return {
      id: r.id,
      project_id: r.project_id,
      project_title: project?.title ?? '—',
      reporter_name: profile?.full_name ?? '—',
      reporter_email: profile?.email ?? '—',
      reason: r.reason,
      details: r.details,
      status: r.status,
      created_at: r.created_at,
    };
  });

  const pendingFirst = [...list].sort((a, b) =>
    a.status === 'pending' && b.status !== 'pending' ? -1 : a.status !== 'pending' && b.status === 'pending' ? 1 : 0
  );

  const pendingCount = list.filter((r) => r.status === 'pending').length;

  return (
    <div>
      <AnimateIn animation="fade-up">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-amber-500 rounded-xl p-2.5">
            <Flag className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
            <p className="text-sm text-gray-500">
              {pendingCount > 0 ? `${pendingCount} pending review` : 'All clear — no pending reports'}
            </p>
          </div>
        </div>
      </AnimateIn>

      <div className="space-y-4">
        {pendingFirst.length === 0 ? (
          <AnimateIn animation="fade-in" delay={80}>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 p-8 text-center">
              <ShieldCheck className="h-10 w-10 text-emerald-400 mx-auto mb-3" />
              <p className="text-gray-600 font-medium">No reports to review</p>
              <p className="text-sm text-gray-400 mt-1">The platform is running smoothly.</p>
            </div>
          </AnimateIn>
        ) : (
          pendingFirst.map((r, i) => (
            <AnimateIn key={r.id} animation="fade-up" delay={80 + i * 60}>
              <div
                className={`bg-white rounded-xl border p-5 flex flex-wrap items-start justify-between gap-4 hover:shadow-md transition-all duration-300 ${
                  r.status === 'pending' ? 'border-amber-200 hover:border-amber-300' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900">{r.project_title}</p>
                  <p className="text-sm text-gray-500 mt-0.5">
                    Reported by {r.reporter_name} ({r.reporter_email})
                  </p>
                  <p className="text-sm text-gray-700 mt-1">
                    <span className="font-medium">Reason:</span> {r.reason}
                  </p>
                  {r.details && (
                    <p className="text-sm text-gray-600 mt-1">{r.details}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(r.created_at).toLocaleDateString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}
                  </p>
                  <span
                    className={`inline-flex mt-2 rounded-full px-2 py-0.5 text-xs font-medium ${
                      r.status === 'pending' ? 'bg-amber-100 text-amber-800 animate-pulse' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {r.status}
                  </span>
                </div>
                {r.status === 'pending' && (
                  <AdminReportActions reportId={r.id} projectId={r.project_id} />
                )}
              </div>
            </AnimateIn>
          ))
        )}
      </div>
    </div>
  );
}
