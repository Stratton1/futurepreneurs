import Link from "next/link";
import { Rocket, Shield, GraduationCap, Heart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/features/project-card";
import { getFeaturedProjects, getRecentProjects } from "@/lib/queries/public-projects";

export default async function Home() {
  const [featured, recent] = await Promise.all([
    getFeaturedProjects(3),
    getRecentProjects(6),
  ]);

  // Combine for display — featured first, then recent (deduplicated)
  const featuredIds = new Set(featured.map((p: Record<string, unknown>) => p.id));
  const recentOnly = recent.filter((p: Record<string, unknown>) => !featuredIds.has(p.id));

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-50 via-white to-amber-50 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <Rocket className="h-4 w-4" />
              For young entrepreneurs under 18
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Got a business idea?{" "}
              <span className="text-emerald-500">Let&apos;s fund it.</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed">
              Futurepreneurs is the safe, supported crowdfunding platform where
              young people can raise money to start their business ideas.
              Backed by teachers, supported by parents, funded by the public.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" variant="primary">
                  Start Your Project
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/projects">
                <Button size="lg" variant="outline">
                  Browse Projects
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      {featured.length > 0 && (
        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Featured Projects</h2>
                <p className="text-gray-600">Hand-picked ideas worth supporting</p>
              </div>
              <Link href="/projects" className="text-emerald-600 font-medium text-sm hover:text-emerald-700 hidden sm:block">
                View all &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((project: Record<string, unknown>) => {
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
          </div>
        </section>
      )}

      {/* Recently Launched */}
      {recentOnly.length > 0 && (
        <section className={`py-16 sm:py-20 ${featured.length > 0 ? 'bg-gray-50' : 'bg-white'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Recently Launched</h2>
                <p className="text-gray-600">The newest ideas from young entrepreneurs</p>
              </div>
              <Link href="/projects?sort=newest" className="text-emerald-600 font-medium text-sm hover:text-emerald-700 hidden sm:block">
                See more &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentOnly.slice(0, 6).map((project: Record<string, unknown>) => {
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
          </div>
        </section>
      )}

      {/* How It Works */}
      <section className={`py-16 sm:py-20 ${(featured.length > 0 || recentOnly.length > 0) ? 'bg-white' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How does it work?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From idea to funded in four simple steps. Your teacher and
              parents are with you every step of the way.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Create your project", description: "Tell the world about your business idea. Set a funding goal and plan your milestones.", color: "bg-emerald-100 text-emerald-700" },
              { step: "2", title: "Get verified", description: "Your teacher checks your project and your parent gives the green light.", color: "bg-blue-100 text-blue-700" },
              { step: "3", title: "Get funded", description: "Share your project and watch the support roll in from backers who believe in you.", color: "bg-amber-100 text-amber-700" },
              { step: "4", title: "Build your business", description: "Hit your milestones and draw down funds with your teacher's approval. You're an entrepreneur!", color: "bg-purple-100 text-purple-700" },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className={`${item.color} w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold mx-auto mb-4`}>
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/how-it-works" className="text-emerald-600 font-medium hover:text-emerald-700">
              Learn more about how it works &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Safe and supported</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We&apos;ve built safety into every step, so young people can focus on their ideas while adults have peace of mind.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="bg-blue-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">School-verified</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Students sign up with their school email. Every project is verified by a teacher before going live.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="bg-emerald-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <GraduationCap className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Teacher-mentored</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Every student picks a teacher as their mentor. The teacher approves how funds are spent, step by step.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="bg-amber-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <Heart className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Parent-approved</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Parents give consent and can see everything — funding progress, milestones, and how money is being spent.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 bg-emerald-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to start your business journey?
          </h2>
          <p className="text-lg text-emerald-100 mb-8 max-w-2xl mx-auto">
            Whether you want to bake cakes, build apps, or wash cars — your
            idea deserves a chance. Sign up and get started today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="bg-white text-emerald-600 hover:bg-emerald-50 font-bold">
                Create Your Project
              </Button>
            </Link>
            <Link href="/projects">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-emerald-600">
                Back a Project
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
