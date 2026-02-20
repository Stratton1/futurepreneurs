import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/supabase/auth-helpers';
import { getBackingsForUser } from '@/lib/queries/backings';
import { CURRENCY_SYMBOL } from '@/lib/constants';
import { Wallet } from 'lucide-react';

export default async function BackedPage() {
  const user = await getCurrentUser();

  if (!user) redirect('/login');
  if (user.role !== 'investor') redirect('/dashboard');

  const backings = await getBackingsForUser(user.id);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Projects I&apos;ve backed</h1>
        <p className="text-gray-600 mt-1">Your support for young entrepreneurs.</p>
      </div>

      {backings.length === 0 ? (
        <div className="bg-gray-50 rounded-2xl p-12 text-center">
          <Wallet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-700 mb-2">No backings yet</h2>
          <p className="text-gray-500 mb-4">When you back a project, it will appear here.</p>
          <Link
            href="/projects"
            className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
          >
            Browse projects
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {backings.map((b) => (
            <li key={b.id}>
              <Link
                href={`/projects/${b.project_id}`}
                className="block bg-white rounded-xl border border-gray-200 p-5 hover:border-emerald-200 hover:bg-emerald-50/30 transition-colors"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{b.project_title}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {CURRENCY_SYMBOL}{b.amount.toFixed(2)} · {new Date(b.created_at).toLocaleDateString('en-GB', { dateStyle: 'medium' })}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                      b.status === 'succeeded'
                        ? 'bg-emerald-100 text-emerald-800'
                        : b.status === 'pending'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {b.status}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-2">Project status: {b.project_status}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
