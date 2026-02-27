import { createAdminClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/supabase/auth-helpers';
import { Users } from 'lucide-react';
import { AnimateIn } from '@/components/ui/animate-in';

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  await requireAdmin();
  const supabase = createAdminClient();
  const { q } = await searchParams;

  let query = supabase
    .from('user_profiles')
    .select('id, email, full_name, role, created_at')
    .order('created_at', { ascending: false })
    .limit(100);

  if (q?.trim()) {
    const term = `%${q.trim()}%`;
    query = query.or(`email.ilike.${term},full_name.ilike.${term}`);
  }

  const { data: users } = await query;

  const roleBadge = (role: string) => {
    const colors: Record<string, string> = {
      student: 'bg-blue-100 text-blue-700',
      teacher: 'bg-emerald-100 text-emerald-700',
      parent: 'bg-amber-100 text-amber-700',
      investor: 'bg-purple-100 text-purple-700',
      admin: 'bg-gray-800 text-white',
    };
    return colors[role] ?? 'bg-gray-100 text-gray-700';
  };

  return (
    <div>
      <AnimateIn animation="fade-up">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-600 rounded-xl p-2.5">
            <Users className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Users</h1>
            <p className="text-sm text-gray-500">{users?.length ?? 0} users{q ? ` matching "${q}"` : ''}</p>
          </div>
        </div>
      </AnimateIn>

      <AnimateIn animation="fade-up" delay={80}>
        <form className="mb-6 flex flex-col sm:flex-row gap-2" method="get" action="/admin/users">
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Search by email or name"
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm w-full max-w-md focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
          />
          <button
            type="submit"
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
          >
            Search
          </button>
        </form>
      </AnimateIn>

      <AnimateIn animation="fade-up" delay={160}>
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-sm transition-shadow duration-300">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 text-left text-gray-600 font-medium">
                  <th className="p-3">Email</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Joined</th>
                </tr>
              </thead>
              <tbody>
                {(users ?? []).map((u) => (
                  <tr key={u.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="p-3 font-medium text-gray-900">{u.email}</td>
                    <td className="p-3 text-gray-700">{u.full_name}</td>
                    <td className="p-3">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${roleBadge(u.role)}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3 text-gray-500">
                      {new Date(u.created_at).toLocaleDateString('en-GB', { dateStyle: 'medium' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {(!users || users.length === 0) && (
            <p className="p-6 text-gray-500 text-center">No users found.</p>
          )}
        </div>
      </AnimateIn>
    </div>
  );
}
