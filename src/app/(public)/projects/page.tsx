import { Suspense } from 'react';
import { Compass, Sparkles, ArrowRight, Search } from 'lucide-react';
import { ProjectCard } from '@/components/features/project-card';
import { SearchBar } from '@/components/features/search-bar';
import { ProjectFilters } from '@/components/features/project-filters';
import { getPublicProjects, getProjectCountsByCategory } from '@/lib/queries/public-projects';
import { AnimateIn } from '@/components/ui/animate-in';
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
      <div className="relative bg-gradient-to-br from-emerald-50 via-white to-blue-50 border-b border-gray-100 overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-200/10 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <AnimateIn animation="fade-in">
            <div className="inline-flex items-center gap-2 text-emerald-600 text-sm font-semibold mb-3">
              <Sparkles className="h-4 w-4" />
              DISCOVER
            </div>
          </AnimateIn>
          <AnimateIn animation="fade-up" delay={50}>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">Browse Projects</h1>
          </AnimateIn>
          <AnimateIn animation="fade-up" delay={100}>
            <p className="text-lg text-gray-500 mb-8 font-light">
              Discover young entrepreneurs and support the ideas you believe in.
            </p>
          </AnimateIn>

          {/* Search */}
          <AnimateIn animation="fade-up" delay={150}>
            <div className="max-w-md mb-6">
              <Suspense fallback={null}>
                <SearchBar />
              </Suspense>
            </div>
          </AnimateIn>

          {/* Filters */}
          <AnimateIn animation="fade-up" delay={200}>
            <Suspense fallback={null}>
              <ProjectFilters categoryCounts={categoryCounts} />
            </Suspense>
          </AnimateIn>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {search && (
          <p className="text-sm text-gray-500 mb-6">
            Showing results for &ldquo;<span className="font-medium text-gray-700">{search}</span>&rdquo;
            {total > 0 && <span> &mdash; {total} {total === 1 ? 'project' : 'projects'} found</span>}
          </p>
        )}

        {projects.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project: Record<string, unknown>, i: number) => {
                const student = project.student as Record<string, unknown> | null;
                const school = student?.school as Record<string, unknown> | null;
                const mentor = project.mentor as Record<string, unknown> | null;
                return (
                  <AnimateIn key={project.id as string} delay={i * 50} animation="fade-up">
                    <ProjectCard
                      id={project.id as string}
                      title={project.title as string}
                      shortDescription={project.short_description as string | null}
                      category={project.category as string}
                      goalAmount={project.goal_amount as number}
                      totalRaised={project.total_raised as number}
                      backerCount={project.backer_count as number}
                      images={project.images as string[]}
                      studentName={(student?.full_name as string) || 'Student'}
                      schoolName={school?.name as string | null}
                      mentorName={mentor?.full_name as string | null}
                      logoConfig={project.logo_config as import('@/lib/logo-templates').LogoConfig | null}
                      projectType={project.project_type as string}
                      groupName={project.group_name as string | null}
                    />
                  </AnimateIn>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-12">
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
          <AnimateIn>
            <div className="text-center py-20">
              <div className="bg-gray-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                {search ? (
                  <Search className="h-10 w-10 text-gray-400" />
                ) : (
                  <Compass className="h-10 w-10 text-gray-400" />
                )}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {search ? 'No projects found' : 'No projects yet'}
              </h3>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                {search
                  ? `We could not find any projects matching "${search}". Try a different search or browse all projects.`
                  : "There are no live projects right now. Check back soon or start your own!"}
              </p>
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-xl font-semibold hover:bg-emerald-600 hover:-translate-y-0.5 transition-all duration-300 shadow-lg shadow-emerald-500/25"
              >
                Start a Project
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </AnimateIn>
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
      className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
        isActive
          ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/25'
          : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'
      }`}
    >
      {label}
    </Link>
  );
}
