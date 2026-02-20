import { notFound } from 'next/navigation';
import { Shield, GraduationCap, Heart, ExternalLink, Target } from 'lucide-react';
import { getPublicProjectById } from '@/lib/queries/public-projects';
import { FundingProgressBar } from '@/components/features/funding-progress-bar';
import { ImageGallery } from '@/components/features/image-gallery';
import { MilestoneList } from '@/components/features/milestone-list';
import { StudentProfileCard } from '@/components/features/student-profile-card';
import { ShareButtons } from '@/components/features/share-buttons';
import { CURRENCY_SYMBOL } from '@/lib/constants';
import Link from 'next/link';
import type { Metadata } from 'next';

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { id } = await params;
  const project = await getPublicProjectById(id);
  if (!project) return { title: 'Project Not Found — Futurepreneurs' };

  return {
    title: `${project.title} — Futurepreneurs`,
    description: project.short_description || project.description.slice(0, 160),
    openGraph: {
      title: project.title,
      description: project.short_description || project.description.slice(0, 160),
      images: project.images?.[0] ? [project.images[0]] : [],
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;
  const project = await getPublicProjectById(id);

  if (!project) {
    notFound();
  }

  const isFunded = project.status === 'funded' || project.status === 'completed';
  const percentage = project.goal_amount > 0
    ? Math.round((project.total_raised / project.goal_amount) * 100)
    : 0;

  const projectUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://futurepreneurs-sigma.vercel.app'}/projects/${project.id}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <Link href="/projects" className="text-gray-500 hover:text-gray-700 transition-colors">
            Browse Projects
          </Link>
          <span className="mx-2 text-gray-300">/</span>
          <span className="text-gray-500">{project.category}</span>
          <span className="mx-2 text-gray-300">/</span>
          <span className="text-gray-900 font-medium">{project.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content — left column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Images */}
            {project.images && project.images.length > 0 ? (
              <ImageGallery images={project.images} title={project.title} />
            ) : (
              <div className="aspect-[16/9] bg-gradient-to-br from-emerald-50 to-blue-50 rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <div className="bg-emerald-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <GraduationCap className="h-10 w-10 text-emerald-500" />
                  </div>
                  <span className="text-gray-400">{project.category}</span>
                </div>
              </div>
            )}

            {/* Title and share */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                    {project.category}
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-3">
                    {project.title}
                  </h1>
                </div>
              </div>

              {project.short_description && (
                <p className="text-lg text-gray-600 mb-4">{project.short_description}</p>
              )}

              <ShareButtons title={project.title} url={projectUrl} />
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">About this project</h2>
              <div className="prose prose-sm prose-gray max-w-none">
                {project.description.split('\n').map((paragraph, i) => (
                  <p key={i} className="text-gray-600 leading-relaxed mb-3">
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Video */}
              {project.video_url && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <a
                    href={project.video_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium text-sm"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Watch project video
                  </a>
                </div>
              )}
            </div>

            {/* Milestones */}
            {project.milestones && project.milestones.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="h-5 w-5 text-gray-400" />
                  <h2 className="text-lg font-semibold text-gray-900">Milestones</h2>
                </div>
                <p className="text-sm text-gray-500 mb-4">
                  This is how the funds will be spent, step by step. Each milestone is approved by the student&apos;s teacher.
                </p>
                <MilestoneList milestones={project.milestones} />
              </div>
            )}
          </div>

          {/* Sidebar — right column */}
          <div className="space-y-6">
            {/* Funding card */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24">
              {isFunded && (
                <div className="bg-emerald-50 text-emerald-700 rounded-xl px-4 py-2.5 text-sm font-medium mb-4 text-center">
                  This project has been fully funded!
                </div>
              )}

              <div className="mb-1">
                <span className="text-3xl font-bold text-gray-900">
                  {CURRENCY_SYMBOL}{project.total_raised.toLocaleString('en-GB')}
                </span>
                <span className="text-gray-500 ml-2">
                  raised of {CURRENCY_SYMBOL}{project.goal_amount.toLocaleString('en-GB')} goal
                </span>
              </div>

              <FundingProgressBar
                raised={project.total_raised}
                goal={project.goal_amount}
                backerCount={project.backer_count}
                size="lg"
              />

              {!isFunded && (
                <div className="mt-6">
                  <button
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors text-lg flex items-center justify-center gap-2"
                  >
                    <Heart className="h-5 w-5" />
                    Back This Project
                  </button>
                  <p className="text-xs text-gray-400 text-center mt-2">
                    Payments coming soon. All-or-nothing funding.
                  </p>
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 mt-6 pt-6 border-t border-gray-100">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{project.backer_count}</div>
                  <div className="text-xs text-gray-500">backers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{percentage}%</div>
                  <div className="text-xs text-gray-500">funded</div>
                </div>
              </div>
            </div>

            {/* Student card */}
            <StudentProfileCard
              name={project.student.full_name}
              avatarUrl={project.student.avatar_url}
              bio={project.student.bio}
              schoolName={project.student.school?.name}
              schoolCity={project.student.school?.city}
            />

            {/* Trust badge */}
            {project.mentor && (
              <div className="bg-blue-50 rounded-2xl border border-blue-100 p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-5 w-5 text-blue-500" />
                  <span className="text-sm font-semibold text-blue-900">Verified project</span>
                </div>
                <p className="text-sm text-blue-700">
                  This project has been reviewed and approved by{' '}
                  <strong>{project.mentor.full_name}</strong>
                  {project.student.school?.name && (
                    <span> at {project.student.school.name}</span>
                  )}
                  .
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
