import Link from "next/link";
import { Shield, GraduationCap, Heart, ArrowRight, Sparkles, TrendingUp, Users, CheckCircle2, Zap, Rocket } from "lucide-react";
import { ProjectCard } from "@/components/features/project-card";
import { getFeaturedProjects, getRecentProjects } from "@/lib/queries/public-projects";
import { AnimateIn } from "@/components/ui/animate-in";
import { HeroSection } from "@/components/features/hero-section";
import { FlipCard } from "@/components/features/flip-card";
import { SafetyCard } from "@/components/features/safety-card";

export default async function Home() {
  const [featured, recent] = await Promise.all([
    getFeaturedProjects(3),
    getRecentProjects(6),
  ]);

  const featuredIds = new Set(featured.map((p: Record<string, unknown>) => p.id));
  const recentOnly = recent.filter((p: Record<string, unknown>) => !featuredIds.has(p.id));

  return (
    <div className="overflow-hidden">
      {/* ═══ HERO ═══ */}
      <HeroSection />

      {/* ═══ FEATURED PROJECTS ═══ */}
      {featured.length > 0 && (
        <section className="py-20 sm:py-28 bg-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
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
                      logoConfig={project.logo_config as import('@/lib/logo-templates').LogoConfig | null}
                      projectType={project.project_type as string}
                      groupName={project.group_name as string | null}
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

      {/* ═══ RECENTLY LAUNCHED ═══ */}
      {recentOnly.length > 0 && (
        <section className="py-20 sm:py-28 bg-gradient-to-b from-gray-50 via-blue-50/20 to-gray-50">
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
                      logoConfig={project.logo_config as import('@/lib/logo-templates').LogoConfig | null}
                      projectType={project.project_type as string}
                      groupName={project.group_name as string | null}
                    />
                  </AnimateIn>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ═══ HOW IT WORKS ═══ */}
      <section className="py-24 sm:py-32 bg-gradient-to-b from-white via-emerald-50/30 to-white relative overflow-hidden">
        <div className="absolute inset-0 subtle-dots" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

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
                Your teacher and parents/guardians are with you every step of the way. No experience needed.
              </p>
            </div>
          </AnimateIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            <AnimateIn delay={0} animation="fade-up">
              <FlipCard
                step="01"
                title="Create your project"
                description="Tell the world about your idea. Set your funding goal, plan milestones, and pick your teacher mentor."
                icon={Sparkles}
                color="bg-emerald-500"
                lightColor="bg-emerald-50"
                iconColor="text-emerald-600"
                backContent={
                  <div>
                    <p className="font-bold text-lg mb-3">Example: Maya&apos;s Candle Co</p>
                    <div className="bg-white/15 rounded-xl p-3 mb-3">
                      <p className="text-sm text-white/80 mb-1">Funding goal</p>
                      <p className="text-2xl font-bold">£200</p>
                    </div>
                    <p className="text-sm text-white/70">Hand-poured soy candles made with love. Maya needs equipment and ingredients to take her candle hobby to the next level.</p>
                  </div>
                }
              />
            </AnimateIn>
            <AnimateIn delay={150} animation="fade-up">
              <FlipCard
                step="02"
                title="Get verified"
                description="Your teacher reviews your plan and gives the thumbs up. Then your parent/guardian gives consent — you are good to go."
                icon={CheckCircle2}
                color="bg-blue-500"
                lightColor="bg-blue-50"
                iconColor="text-blue-600"
                backContent={
                  <div className="space-y-3">
                    <p className="font-bold text-lg mb-3">Your checklist</p>
                    {['Teacher reviewed your project', 'Parent/guardian gave consent', "You're live!"].map((item, i) => (
                      <div key={i} className="flex items-center gap-2.5 bg-white/15 rounded-lg px-3 py-2">
                        <span className="text-lg">✓</span>
                        <span className="text-sm font-medium">{item}</span>
                      </div>
                    ))}
                  </div>
                }
              />
            </AnimateIn>
            <AnimateIn delay={300} animation="fade-up">
              <FlipCard
                step="03"
                title="Get funded"
                description="Share your project with the world. Watch the support roll in as backers believe in your vision."
                icon={Heart}
                color="bg-amber-500"
                lightColor="bg-amber-50"
                iconColor="text-amber-600"
                backContent={
                  <div>
                    <p className="font-bold text-lg mb-3">Watch it grow</p>
                    <div className="bg-white/15 rounded-xl p-3 mb-3">
                      <div className="flex justify-between text-sm mb-2">
                        <span>£156 raised</span>
                        <span>£200 goal</span>
                      </div>
                      <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
                        <div className="h-full bg-white rounded-full" style={{ width: '78%' }} />
                      </div>
                    </div>
                    <p className="text-sm text-white/70">12 backers so far — share with family, friends, and your school community!</p>
                  </div>
                }
              />
            </AnimateIn>
            <AnimateIn delay={450} animation="fade-up">
              <FlipCard
                step="04"
                title="Build it"
                description="Hit your milestones, draw down funds with teacher approval, and turn your idea into a real business."
                icon={Rocket}
                color="bg-purple-500"
                lightColor="bg-purple-50"
                iconColor="text-purple-600"
                backContent={
                  <div className="space-y-2.5">
                    <p className="font-bold text-lg mb-3">Milestone by milestone</p>
                    {[
                      { name: 'Ingredients', amount: '£50', status: 'APPROVED' },
                      { name: 'Equipment', amount: '£80', status: 'APPROVED' },
                      { name: 'Packaging', amount: '£70', status: 'PENDING' },
                    ].map((m) => (
                      <div key={m.name} className="flex items-center justify-between bg-white/15 rounded-lg px-3 py-2">
                        <span className="text-sm font-medium">{m.name} — {m.amount}</span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${m.status === 'APPROVED' ? 'bg-white/30' : 'bg-white/10'}`}>{m.status}</span>
                      </div>
                    ))}
                  </div>
                }
              />
            </AnimateIn>
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

      {/* Section transition */}
      <div className="h-20 bg-gradient-to-b from-white to-gray-50/80" />

      {/* ═══ TRUST & SAFETY ═══ */}
      <section className="py-24 sm:py-32 bg-gradient-to-b from-gray-50/80 via-white to-white relative overflow-hidden">
        <div className="absolute inset-0 subtle-grid" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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
            <AnimateIn delay={0} animation="fade-up">
              <SafetyCard
                icon={Shield}
                title="School-verified"
                description="Students sign up with their school email. Every project is checked and approved by a real teacher at their school before it goes live."
                color="from-blue-500 to-blue-600"
                lightBg="bg-blue-50"
                iconColor="text-blue-600"
                details={[
                  "Students sign up with their school email only",
                  "Every school on our verified list",
                  "A real teacher checks your project before it goes live",
                  "No personal information is shown publicly",
                ]}
              />
            </AnimateIn>
            <AnimateIn delay={150} animation="fade-up">
              <SafetyCard
                icon={GraduationCap}
                title="Teacher-mentored"
                description="Every student picks a teacher as their mentor. The teacher guides the project and approves every fund withdrawal, step by step."
                color="from-emerald-500 to-emerald-600"
                lightBg="bg-emerald-50"
                iconColor="text-emerald-600"
                details={[
                  "They review your project before it goes live",
                  "They approve every withdrawal request",
                  "Not sure how to ask a teacher? We'll help you prepare",
                  "Your mentor is there to guide you, not judge you",
                ]}
              />
            </AnimateIn>
            <AnimateIn delay={300} animation="fade-up">
              <SafetyCard
                icon={Heart}
                title="Parent/Guardian-approved"
                description="Parents and guardians give consent before any project goes live. They can see everything — funding progress, milestones, and how money is being spent."
                color="from-amber-500 to-amber-600"
                lightBg="bg-amber-50"
                iconColor="text-amber-600"
                details={[
                  "Nothing goes live without their consent",
                  "They see all funding activity in real time",
                  "They can view every drawdown request",
                  "Takes just 2 minutes to give consent",
                ]}
              />
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* Section transition */}
      <div className="h-20 bg-gradient-to-b from-white to-gray-50/30" />

      {/* ═══ WHO IT'S FOR ═══ */}
      <section className="py-24 sm:py-32 bg-gradient-to-b from-gray-50/30 to-white relative overflow-hidden">
        <div className="absolute inset-0 subtle-diagonal" />
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
                Young entrepreneurs, teachers, parents/guardians, and backers — everyone has a role to play.
              </p>
            </div>
          </AnimateIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { emoji: "🎓", role: "Students", tagline: "Turn your idea into reality", description: "Create a project, set milestones, and raise funds for your business idea. Your teacher will guide you every step of the way.", cta: "Start a project", href: "/signup", bg: "bg-gradient-to-br from-emerald-50 to-emerald-100/50", border: "border-emerald-200/50" },
              { emoji: "👩‍🏫", role: "Teachers", tagline: "Mentor the next generation", description: "Verify projects, approve fund withdrawals, and help your students learn real-world business skills.", cta: "Join as teacher", href: "/signup", bg: "bg-gradient-to-br from-blue-50 to-blue-100/50", border: "border-blue-200/50" },
              { emoji: "👨‍👩‍👧", role: "Parents/Guardians", tagline: "Support with confidence", description: "Give consent, track progress, and watch your child develop real entrepreneurial skills in a safe environment.", cta: "Join as parent/guardian", href: "/signup", bg: "bg-gradient-to-br from-amber-50 to-amber-100/50", border: "border-amber-200/50" },
              { emoji: "💰", role: "Backers", tagline: "Fund the future", description: "Back young entrepreneurs and help them launch their first business. Every pound makes a difference.", cta: "Browse projects", href: "/projects", bg: "bg-gradient-to-br from-purple-50 to-purple-100/50", border: "border-purple-200/50" },
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

      {/* ═══ CTA SECTION ═══ */}
      <section className="relative py-24 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700" />
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
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 bg-white text-emerald-600 hover:bg-emerald-50 font-bold text-lg px-8 py-4 rounded-2xl shadow-xl hover:-translate-y-0.5 transition-all duration-300"
              >
                Create Your Project
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/projects"
                className="inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white hover:bg-white/10 font-bold text-lg px-8 py-4 rounded-2xl hover:-translate-y-0.5 transition-all duration-300"
              >
                Back a Project
              </Link>
            </div>
          </AnimateIn>
        </div>
      </section>
    </div>
  );
}
