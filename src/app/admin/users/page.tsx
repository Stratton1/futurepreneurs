import Link from 'next/link';
import { createAdminClient } from '@/lib/supabase/server';

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
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

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Users</h1>

      <form className="mb-6" method="get" action="/admin/users">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Search by email or name"
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm w-full max-w-md"
        />
        <button
          type="submit"
          className="mt-2 sm:mt-0 sm:ml-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
        >
          Search
        </button>
      </form>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
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
                <tr key={u.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-3 font-medium text-gray-900">{u.email}</td>
                  <td className="p-3 text-gray-700">{u.full_name}</td>
                  <td className="p-3 text-gray-600">{u.role}</td>
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
    </div>
  );
}
