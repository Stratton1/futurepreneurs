import Link from "next/link";
import { Rocket, Shield, GraduationCap, Heart, ArrowRight, Sparkles, Star, TrendingUp, Users, CheckCircle2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/features/project-card";
import { getFeaturedProjects, getRecentProjects } from "@/lib/queries/public-projects";
import { AnimateIn } from "@/components/ui/animate-in";
import { AnimatedCounter } from "@/components/ui/animated-counter";

export default async function Home() {
  const [featured, recent] = await Promise.all([
    getFeaturedProjects(3),
    getRecentProjects(6),
  ]);

  const featuredIds = new Set(featured.map((p: Record<string, unknown>) => p.id));
  const recentOnly = recent.filter((p: Record<string, unknown>) => !featuredIds.has(p.id));

  return (
    <div className="overflow-hidden">
      {/* ════════════════════════════════════════════════════════════
          HERO SECTION
          ════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-emerald-50 via-white to-amber-50 overflow-hidden">
        {/* Floating decorative blobs */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-emerald-200/30 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl animate-float-slower" />
        <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-blue-200/20 rounded-full blur-2xl animate-float" />

        {/* Floating icons */}
        <div className="absolute top-20 right-[15%] animate-float-slow hidden lg:block">
          <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl p-3">
            <Rocket className="h-6 w-6 text-emerald-500" />
          </div>
        </div>
        <div className="absolute bottom-32 left-[12%] animate-float hidden lg:block">
          <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl p-3">
            <Sparkles className="h-6 w-6 text-amber-500" />
          </div>
        </div>
        <div className="absolute top-40 left-[20%] animate-float-slower hidden lg:block">
          <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl p-3">
            <Star className="h-6 w-6 text-blue-500" />
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center max-w-4xl mx-auto">
            <AnimateIn animation="fade-in">
              <div className="inline-flex items-center gap-2 bg-emerald-100/80 backdrop-blur-sm text-emerald-700 rounded-full px-5 py-2 text-sm font-semibold mb-8 shadow-sm">
                <Rocket className="h-4 w-4" />
                The UK&apos;s crowdfunding platform for under-18s
              </div>
            </AnimateIn>

            <AnimateIn animation="fade-up" delay={100}>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-[1.1] mb-8 tracking-tight">
                Your big idea
                <br />
                <span className="text-gradient">deserves a chance</span>
              </h1>
            </AnimateIn>

            <AnimateIn animation="fade-up" delay={200}>
              <p className="text-xl sm:text-2xl text-gray-500 mb-10 leading-relaxed max-w-2xl mx-auto font-light">
                Create your project, get verified by your teacher, and raise real
                money to launch your business — all before you turn 18.
              </p>
            </AnimateIn>

            <AnimateIn animation="fade-up" delay={300}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                <Link href="/signup">
                  <Button size="lg" variant="primary" className="text-lg px-8 py-4 shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5 transition-all duration-300" asChild>
                    Start Your Project
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/projects">
                  <Button size="lg" variant="outline" className="text-lg px-8 py-4 hover:-translate-y-0.5 transition-all duration-300" asChild>
                    Browse Projects
                  </Button>
                </Link>
              </div>
            </AnimateIn>

            {/* Stats row */}
            <AnimateIn animation="fade-up" delay={400}>
              <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-lg mx-auto">
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-gray-900">
                    <AnimatedCounter end={100} suffix="%" />
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">Safe &amp; verified</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-gray-900">
                    £<AnimatedCounter end={10} suffix="k" />
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">Max per project</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-gray-900">
                    <AnimatedCounter end={0} suffix="" prefix="" />
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">Upfront cost</p>
                </div>
              </div>
            </AnimateIn>
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 40L48 35C96 30 192 20 288 25C384 30 480 50 576 55C672 60 768 50 864 40C960 30 1056 20 1152 25C1248 30 1344 50 1392 60L1440 70V80H1392C1344 80 1248 80 1152 80C1056 80 960 80 864 80C768 80 672 80 576 80C480 80 384 80 288 80C192 80 96 80 48 80H0V40Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          FEATURED PROJECTS
          ════════════════════════════════════════════════════════════ */}
      {featured.length > 0 && (
        <section className="py-20 sm:py-28 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimateIn>
              <div className="flex items-end justify-between mb-12">
                <div>
                  <div className="inline-flex items-center gap-2 text-emerald-600 text-sm font-semibold mb-3">
                    <Sparkles className="h-4 w-4" />
                    FEATURED
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                    Projects worth backing
                  </h2>
                </div>
                <Link href="/projects" className="text-emerald-600 font-semibold text-sm hover:text-emerald-700 hidden sm:flex items-center gap-1 group">
                  View all
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </AnimateIn>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featured.map((project: Record<string, unknown>, i: number) => {
                const student = project.student as Record<string, unknown> | null;
                const school = student?.school as Record<string, unknown> | null;
                return (
                  <AnimateIn key={project.id as string} delay={i * 100} animation="fade-up">
                    <ProjectCard
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
                  </AnimateIn>
                );
              })}
            </div>
            <div className="sm:hidden mt-8 text-center">
              <Link href="/projects" className="text-emerald-600 font-semibold hover:text-emerald-700">
                View all projects &rarr;
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ════════════════════════════════════════════════════════════
          RECENTLY LAUNCHED
          ════════════════════════════════════════════════════════════ */}
      {recentOnly.length > 0 && (
        <section className="py-20 sm:py-28 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimateIn>
              <div className="flex items-end justify-between mb-12">
                <div>
                  <div className="inline-flex items-center gap-2 text-blue-600 text-sm font-semibold mb-3">
                    <TrendingUp className="h-4 w-4" />
                    JUST LAUNCHED
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                    Fresh ideas from young minds
                  </h2>
                </div>
                <Link href="/projects?sort=newest" className="text-emerald-600 font-semibold text-sm hover:text-emerald-700 hidden sm:flex items-center gap-1 group">
                  See more
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </AnimateIn>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentOnly.slice(0, 6).map((project: Record<string, unknown>, i: number) => {
                const student = project.student as Record<string, unknown> | null;
                const school = student?.school as Record<string, unknown> | null;
                return (
                  <AnimateIn key={project.id as string} delay={i * 100} animation="fade-up">
                    <ProjectCard
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
                  </AnimateIn>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ════════════════════════════════════════════════════════════
          HOW IT WORKS
          ════════════════════════════════════════════════════════════ */}
      <section className="py-24 sm:py-32 bg-white relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateIn>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 text-emerald-600 text-sm font-semibold mb-4">
                <Zap className="h-4 w-4" />
                SIMPLE STEPS
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-5">
                From idea to funded in four steps
              </h2>
              <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                Your teacher and parents are with you every step of the way. No experience needed.
              </p>
            </div>
          </AnimateIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {[
              {
                step: "01",
                title: "Create your project",
                description: "Tell the world about your idea. Set your funding goal, plan milestones, and pick your teacher mentor.",
                icon: Sparkles,
                color: "bg-emerald-500",
                lightColor: "bg-emerald-50",
                iconColor: "text-emerald-600",
              },
              {
                step: "02",
                title: "Get verified",
                description: "Your teacher reviews your plan and gives the thumbs up. Then your parent gives consent — you are good to go.",
                icon: CheckCircle2,
                color: "bg-blue-500",
                lightColor: "bg-blue-50",
                iconColor: "text-blue-600",
              },
              {
                step: "03",
                title: "Get funded",
                description: "Share your project with the world. Watch the support roll in as backers believe in your vision.",
                icon: Heart,
                color: "bg-amber-500",
                lightColor: "bg-amber-50",
                iconColor: "text-amber-600",
              },
              {
                step: "04",
                title: "Build it",
                description: "Hit your milestones, draw down funds with teacher approval, and turn your idea into a real business.",
                icon: Rocket,
                color: "bg-purple-500",
                lightColor: "bg-purple-50",
                iconColor: "text-purple-600",
              },
            ].map((item, i) => (
              <AnimateIn key={item.step} delay={i * 150} animation="fade-up">
                <div className="relative group">
                  {/* Connector line (hidden on mobile, shown on lg) */}
                  {i < 3 && (
                    <div className="hidden lg:block absolute top-10 left-[calc(50%+2rem)] w-[calc(100%-2rem)] h-[2px] bg-gradient-to-r from-gray-200 to-gray-100" />
                  )}

                  <div className="relative bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`${item.lightColor} w-12 h-12 rounded-xl flex items-center justify-center`}>
                        <item.icon className={`h-6 w-6 ${item.iconColor}`} />
                      </div>
                      <span className={`${item.color} text-white text-xs font-bold rounded-full w-7 h-7 flex items-center justify-center`}>
                        {item.step}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </AnimateIn>
            ))}
          </div>

          <AnimateIn delay={600}>
            <div className="text-center mt-12">
              <Link href="/how-it-works" className="inline-flex items-center gap-2 text-emerald-600 font-semibold hover:text-emerald-700 group">
                Learn more about how it works
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          TRUST & SAFETY
          ════════════════════════════════════════════════════════════ */}
      <section className="py-24 sm:py-32 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateIn>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 text-blue-600 text-sm font-semibold mb-4">
                <Shield className="h-4 w-4" />
                BUILT FOR SAFETY
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-5">
                Safety at every step
              </h2>
              <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                We built this platform specifically for young people. Every feature is designed with their protection in mind.
              </p>
            </div>
          </AnimateIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "School-verified",
                description: "Students sign up with their school email. Every project is checked and approved by a real teacher at their school before it goes live.",
                color: "from-blue-500 to-blue-600",
                lightBg: "bg-blue-50",
                iconColor: "text-blue-600",
              },
              {
                icon: GraduationCap,
                title: "Teacher-mentored",
                description: "Every student picks a teacher as their mentor. The teacher guides the project and approves every fund withdrawal, step by step.",
                color: "from-emerald-500 to-emerald-600",
                lightBg: "bg-emerald-50",
                iconColor: "text-emerald-600",
              },
              {
                icon: Heart,
                title: "Parent-approved",
                description: "Parents give consent before any project goes live. They can see everything — funding progress, milestones, and how money is being spent.",
                color: "from-amber-500 to-amber-600",
                lightBg: "bg-amber-50",
                iconColor: "text-amber-600",
              },
            ].map((item, i) => (
              <AnimateIn key={item.title} delay={i * 150} animation="fade-up">
                <div className="relative bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group overflow-hidden">
                  {/* Subtle gradient top border */}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                  <div className={`${item.lightBg} w-14 h-14 rounded-2xl flex items-center justify-center mb-6`}>
                    <item.icon className={`h-7 w-7 ${item.iconColor}`} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-500 leading-relaxed">{item.description}</p>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          SOCIAL PROOF / WHO IT'S FOR
          ════════════════════════════════════════════════════════════ */}
      <section className="py-24 sm:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateIn>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 text-purple-600 text-sm font-semibold mb-4">
                <Users className="h-4 w-4" />
                FOR EVERYONE
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-5">
                Built for the whole team
              </h2>
              <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                Young entrepreneurs, teachers, parents, and backers — everyone has a role to play.
              </p>
            </div>
          </AnimateIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                emoji: "🎓",
                role: "Students",
                tagline: "Turn your idea into reality",
                description: "Create a project, set milestones, and raise funds for your business idea. Your teacher will guide you every step of the way.",
                cta: "Start a project",
                href: "/signup",
                bg: "bg-gradient-to-br from-emerald-50 to-emerald-100/50",
                border: "border-emerald-200/50",
              },
              {
                emoji: "👩‍🏫",
                role: "Teachers",
                tagline: "Mentor the next generation",
                description: "Verify projects, approve fund withdrawals, and help your students learn real-world business skills.",
                cta: "Join as teacher",
                href: "/signup",
                bg: "bg-gradient-to-br from-blue-50 to-blue-100/50",
                border: "border-blue-200/50",
              },
              {
                emoji: "👨‍👩‍👧",
                role: "Parents",
                tagline: "Support with confidence",
                description: "Give consent, track progress, and watch your child develop real entrepreneurial skills in a safe environment.",
                cta: "Join as parent",
                href: "/signup",
                bg: "bg-gradient-to-br from-amber-50 to-amber-100/50",
                border: "border-amber-200/50",
              },
              {
                emoji: "💰",
                role: "Backers",
                tagline: "Fund the future",
                description: "Back young entrepreneurs and help them launch their first business. Every pound makes a difference.",
                cta: "Browse projects",
                href: "/projects",
                bg: "bg-gradient-to-br from-purple-50 to-purple-100/50",
                border: "border-purple-200/50",
              },
            ].map((item, i) => (
              <AnimateIn key={item.role} delay={i * 100} animation="fade-up">
                <div className={`${item.bg} rounded-2xl p-6 border ${item.border} h-full flex flex-col hover:shadow-lg hover:-translate-y-1 transition-all duration-300`}>
                  <div className="text-4xl mb-4">{item.emoji}</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{item.role}</h3>
                  <p className="text-sm font-medium text-gray-600 mb-3">{item.tagline}</p>
                  <p className="text-sm text-gray-500 leading-relaxed mb-4 flex-grow">{item.description}</p>
                  <Link href={item.href} className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1 group">
                    {item.cta}
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          CTA SECTION
          ════════════════════════════════════════════════════════════ */}
      <section className="relative py-24 sm:py-32 overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700" />
        {/* Decorative circles */}
        <div className="absolute top-10 left-10 w-64 h-64 bg-white/5 rounded-full blur-2xl" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-white/5 rounded-full blur-2xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimateIn>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-6 leading-tight">
              Ready to start your
              <br />
              business journey?
            </h2>
          </AnimateIn>
          <AnimateIn delay={100}>
            <p className="text-xl text-emerald-100 mb-10 max-w-2xl mx-auto font-light">
              Whether you want to bake cakes, build apps, or wash cars — your
              idea deserves a chance. Sign up and get started today.
            </p>
          </AnimateIn>
          <AnimateIn delay={200}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" className="bg-white text-emerald-600 hover:bg-emerald-50 font-bold text-lg px-8 py-4 shadow-xl hover:-translate-y-0.5 transition-all duration-300" asChild>
                  Create Your Project
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/projects">
                <Button size="lg" variant="outline" className="border-2 border-white/30 text-white hover:bg-white/10 font-bold text-lg px-8 py-4 hover:-translate-y-0.5 transition-all duration-300" asChild>
                  Back a Project
                </Button>
              </Link>
            </div>
          </AnimateIn>
        </div>
      </section>
    </div>
  );
}
