import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/supabase/auth-helpers';
import { getBackingsForUser } from '@/lib/queries/backings';
import { CURRENCY_SYMBOL } from '@/lib/constants';
import { Heart, Search } from 'lucide-react';
import { AnimateIn } from '@/components/ui/animate-in';

export default async function BackedPage() {
  const user = await getCurrentUser();

  if (!user) redirect('/login');
  if (user.role !== 'investor') redirect('/dashboard');

  const backings = await getBackingsForUser(user.id);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <AnimateIn animation="fade-up">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Projects I&apos;ve Supported</h1>
          <p className="text-gray-600 mt-1">Your support for young entrepreneurs.</p>
        </div>
      </AnimateIn>

      {backings.length === 0 ? (
        <AnimateIn animation="scale-in" delay={100}>
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-12 text-center border border-purple-100/50">
            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Heart className="h-8 w-8 text-purple-500" />
            </div>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">No contributions yet</h2>
            <p className="text-gray-500 mb-4">When you support a project, it will appear here.</p>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 justify-center rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-purple-700 hover:-translate-y-0.5 transition-all duration-300 shadow-md shadow-purple-600/20"
            >
              <Search className="h-4 w-4" />
              Browse projects
            </Link>
          </div>
        </AnimateIn>
      ) : (
        <ul className="space-y-3">
          {backings.map((b, i) => (
            <AnimateIn key={b.id} animation="fade-up" delay={i * 60} as="li">
              <Link
                href={`/projects/${b.project_id}`}
                className="block bg-white rounded-xl border border-gray-200 p-5 hover:border-emerald-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
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
            </AnimateIn>
          ))}
        </ul>
      )}
    </div>
  );
}
