import { Suspense } from 'react';
import { Compass } from 'lucide-react';
import { ProjectCard } from '@/components/features/project-card';
import { SearchBar } from '@/components/features/search-bar';
import { ProjectFilters } from '@/components/features/project-filters';
import { getPublicProjects, getProjectCountsByCategory } from '@/lib/queries/public-projects';
import Link from 'next/link';

interface BrowsePageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    sort?: string;
    page?: string;
  }>;
}

const PROJECTS_PER_PAGE = 12;

export const metadata = {
  title: 'Browse Projects — Futurepreneurs',
  description: 'Discover and support young entrepreneurs. Browse projects by category, search for ideas, and back the ones you believe in.',
};

export default async function BrowseProjectsPage({ searchParams }: BrowsePageProps) {
  const params = await searchParams;
  const category = params.category || undefined;
  const search = params.search || undefined;
  const sort = (params.sort as 'newest' | 'most_funded' | 'closest_to_goal') || 'newest';
  const page = parseInt(params.page || '1', 10);
  const offset = (page - 1) * PROJECTS_PER_PAGE;

  const [{ projects, total }, categoryCounts] = await Promise.all([
    getPublicProjects({ category, search, sort, limit: PROJECTS_PER_PAGE, offset }),
    getProjectCountsByCategory(),
  ]);

  const totalPages = Math.ceil(total / PROJECTS_PER_PAGE);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-emerald-100 p-2 rounded-xl">
              <Compass className="h-6 w-6 text-emerald-600" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Browse Projects</h1>
          </div>
          <p className="text-gray-600 mb-6">
            Discover young entrepreneurs and support the ideas you believe in.
          </p>

          {/* Search */}
          <div className="max-w-md mb-6">
            <Suspense fallback={null}>
              <SearchBar />
            </Suspense>
          </div>

          {/* Filters */}
          <Suspense fallback={null}>
            <ProjectFilters categoryCounts={categoryCounts} />
          </Suspense>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {search && (
          <p className="text-sm text-gray-500 mb-4">
            Showing results for &ldquo;{search}&rdquo;
            {total > 0 && <span> &mdash; {total} {total === 1 ? 'project' : 'projects'} found</span>}
          </p>
        )}

        {projects.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project: Record<string, unknown>) => {
                const student = project.student as Record<string, unknown> | null;
                const school = student?.school as Record<string, unknown> | null;
                return (
                  <ProjectCard
                    key={project.id as string}
                    id={project.id as string}
                    title={project.title as string}
                    shortDescription={project.short_description as string | null}
                    category={project.category as string}
                    goalAmount={project.goal_amount as number}
                    totalRaised={project.total_raised as number}
                    backerCount={project.backer_count as number}
                    images={project.images as string[]}
                    studentName={student?.full_name as string || 'Student'}
                    schoolName={school?.name as string | null}
                  />
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-10">
                {page > 1 && (
                  <PaginationLink page={page - 1} params={params} label="Previous" />
                )}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <PaginationLink
                    key={p}
                    page={p}
                    params={params}
                    label={String(p)}
                    isActive={p === page}
                  />
                ))}
                {page < totalPages && (
                  <PaginationLink page={page + 1} params={params} label="Next" />
                )}
              </div>
            )}
          </>
        ) : (
          /* Empty state */
          <div className="text-center py-16">
            <div className="bg-gray-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Compass className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {search ? 'No projects found' : 'No projects yet'}
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              {search
                ? `We couldn't find any projects matching "${search}". Try a different search or browse all projects.`
                : "There aren't any live projects right now. Check back soon or start your own!"}
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center px-4 py-2 bg-emerald-500 text-white rounded-xl text-sm font-medium hover:bg-emerald-600 transition-colors"
            >
              Start a Project
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function PaginationLink({
  page,
  params,
  label,
  isActive,
}: {
  page: number;
  params: Record<string, string | undefined>;
  label: string;
  isActive?: boolean;
}) {
  const urlParams = new URLSearchParams();
  if (params.category) urlParams.set('category', params.category);
  if (params.search) urlParams.set('search', params.search);
  if (params.sort) urlParams.set('sort', params.sort);
  if (page > 1) urlParams.set('page', String(page));
  const href = `/projects?${urlParams.toString()}`;

  return (
    <Link
      href={href}
      className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
        isActive
          ? 'bg-emerald-500 text-white'
          : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
      }`}
    >
      {label}
    </Link>
  );
}
