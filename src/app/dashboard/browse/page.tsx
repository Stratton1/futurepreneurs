import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { CURRENCY_SYMBOL } from '@/lib/constants';
import Link from 'next/link';
import { ArrowLeft, Search } from 'lucide-react';

export default async function BrowseProjectsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch live/funded projects
  const { data: projects } = await supabase
    .from('projects')
    .select('id, title, short_description, category, goal_amount, total_raised, backer_count, status')
    .in('status', ['live', 'funded', 'completed'])
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard" className="text-gray-400 hover:text-gray-600">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Browse Projects</h1>
          <p className="text-gray-600 text-sm">Discover young entrepreneurs and support their ideas</p>
        </div>
      </div>

      {projects && projects.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {projects.map((project) => {
            const progress = project.goal_amount > 0
              ? Math.min((project.total_raised / project.goal_amount) * 100, 100)
              : 0;

            return (
              <div
                key={project.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{project.title}</h3>
                  <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full whitespace-nowrap ml-2">
                    {project.status === 'live' ? 'Live' : project.status === 'funded' ? 'Funded' : 'Completed'}
                  </span>
                </div>
                {project.short_description && (
                  <p className="text-sm text-gray-600 mb-3">{project.short_description}</p>
                )}
                <div className="text-xs text-gray-500 mb-3">{project.category}</div>

                {/* Funding progress */}
                <div className="mb-2">
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-900">
                    {CURRENCY_SYMBOL}{Number(project.total_raised).toFixed(0)} raised
                  </span>
                  <span className="text-gray-500">
                    of {CURRENCY_SYMBOL}{Number(project.goal_amount).toFixed(0)} goal
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {project.backer_count} {project.backer_count === 1 ? 'backer' : 'backers'}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">No Live Projects Yet</h2>
          <p className="text-gray-600 text-sm max-w-sm mx-auto">
            Projects will appear here once students have created them and they&apos;ve been verified by teachers and approved by parents. Check back soon!
          </p>
        </div>
      )}
    </div>
  );
}
