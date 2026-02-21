import { Rocket, ClipboardCheck, ShieldCheck, Heart, Banknote, GraduationCap, Users, ArrowRight, Sparkles, Eye, CheckCircle2, Zap, PiggyBank, Share2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AnimateIn } from '@/components/ui/animate-in';
import { SafetyCard } from '@/components/features/safety-card';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How It Works — Futurepreneurs',
  description: 'Learn how Futurepreneurs helps young entrepreneurs under 18 create, fund, and launch their business ideas safely.',
};

export default function HowItWorksPage() {
  return (
    <div className="overflow-hidden">
      {/* ═══ HERO ═══ */}
      <section className="relative bg-gradient-to-br from-emerald-50 via-white to-blue-50 py-20 sm:py-28 overflow-hidden">
        <div className="absolute inset-0 subtle-dots" />
        <div className="absolute top-10 right-10 w-72 h-72 bg-emerald-200/20 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-10 left-10 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl animate-float-slower" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimateIn animation="fade-in">
            <div className="inline-flex items-center gap-2 bg-emerald-100/80 text-emerald-700 rounded-full px-5 py-2 text-sm font-semibold mb-6">
              <Zap className="h-4 w-4" />
              Simple, safe, supported
            </div>
          </AnimateIn>
          <AnimateIn animation="fade-up" delay={100}>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 leading-tight tracking-tight">
              How <span className="text-gradient">Futurepreneurs</span> works
            </h1>
          </AnimateIn>
          <AnimateIn animation="fade-up" delay={200}>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto font-light leading-relaxed">
              From your first idea to a funded business — here is exactly how it works, for everyone involved.
            </p>
          </AnimateIn>
        </div>
      </section>

      {/* Transition */}
      <div className="h-16 bg-gradient-to-b from-blue-50/30 to-white" />

      {/* ═══ THE JOURNEY (Students) ═══ */}
      <section className="py-24 sm:py-32 bg-gradient-to-b from-white via-emerald-50/20 to-white relative overflow-hidden">
        <div className="absolute inset-0 subtle-grid" />
        <div className="absolute top-0 left-0 w-80 h-80 bg-emerald-50 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateIn>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-emerald-100 p-2.5 rounded-xl">
                <Rocket className="h-6 w-6 text-emerald-600" />
              </div>
              <span className="text-emerald-600 font-semibold text-sm uppercase tracking-wide">For Students</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Your journey from idea to business</h2>
            <p className="text-lg text-gray-500 mb-12 max-w-2xl">Six steps. That is all it takes to go from an idea in your head to a real, funded business.</p>
          </AnimateIn>

          <div className="relative">
            {/* Vertical timeline line */}
            <div className="hidden md:block absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-emerald-200 via-emerald-300 to-emerald-100" />

            <div className="space-y-8">
              {[
                { step: '1', icon: Sparkles, title: 'Sign up with your school email', desc: 'Create your account using your school email address. This is how we verify you are a real student at a real school.' },
                { step: '2', icon: ClipboardCheck, title: 'Create your project', desc: 'Tell everyone about your business idea. Add a title, description, images, your funding goal, and plan your spending milestones.' },
                { step: '3', icon: GraduationCap, title: 'Choose a teacher mentor', desc: 'Pick a teacher at your school to be your mentor. They will review your project and help guide you.' },
                { step: '4', icon: CheckCircle2, title: 'Get verified and go live', desc: 'Your teacher approves your project, then your parent/guardian gives consent. Once both say yes, your project goes live for the public.' },
                { step: '5', icon: Share2, title: 'Get funded by the public', desc: 'Share your project with family, friends, and the wider community. Watch the funding come in as people back your idea.' },
                { step: '6', icon: PiggyBank, title: 'Draw down funds and build', desc: 'When your project is funded, request money against your milestones. Your teacher approves each drawdown. Build your business, step by step.' },
              ].map((item, i) => (
                <AnimateIn key={item.step} delay={i * 100} animation="fade-left">
                  <div className="flex gap-6 md:gap-8 items-start">
                    <div className="relative flex-shrink-0">
                      <div className="bg-emerald-500 text-white w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                        <item.icon className="h-7 w-7" />
                      </div>
                      <div className="absolute -top-2 -right-2 bg-white text-emerald-600 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-sm border border-emerald-100">
                        {item.step}
                      </div>
                    </div>
                    <div className="pt-2">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{item.title}</h3>
                      <p className="text-gray-500 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </AnimateIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Transition */}
      <div className="h-16 bg-gradient-to-b from-white to-gray-50/80" />

      {/* ═══ FOR TEACHERS ═══ */}
      <section className="py-24 sm:py-32 bg-gradient-to-b from-gray-50/80 via-blue-50/20 to-white relative overflow-hidden">
        <div className="absolute inset-0 subtle-diagonal" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-blue-50 rounded-full blur-3xl translate-x-1/2" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateIn>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-100 p-2.5 rounded-xl">
                <GraduationCap className="h-6 w-6 text-blue-600" />
              </div>
              <span className="text-blue-600 font-semibold text-sm uppercase tracking-wide">For Teachers</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">The trust anchor behind every project</h2>
            <p className="text-lg text-gray-500 mb-12 max-w-2xl">You are the key to making this work. Verify, guide, and approve — helping students learn real-world skills.</p>
          </AnimateIn>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { icon: ClipboardCheck, title: 'Verify projects', desc: 'Students choose you as their mentor. Review their project, check it is appropriate, and approve it to go live.', color: 'bg-blue-500', lightBg: 'bg-blue-50' },
              { icon: Banknote, title: 'Approve spending', desc: 'When a project is funded, students request drawdowns against their milestones. You approve each request before funds are released.', color: 'bg-indigo-500', lightBg: 'bg-indigo-50' },
              { icon: Users, title: 'Guide and support', desc: 'Be the trusted adult behind every project. Help students learn real business skills in a safe, structured environment.', color: 'bg-violet-500', lightBg: 'bg-violet-50' },
            ].map((item, i) => (
              <AnimateIn key={item.title} delay={i * 150} animation="fade-up">
                <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full group">
                  <div className={`${item.lightBg} w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <item.icon className="h-7 w-7 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* Transition */}
      <div className="h-16 bg-gradient-to-b from-white to-amber-50/30" />

      {/* ═══ FOR PARENTS/GUARDIANS ═══ */}
      <section className="py-24 sm:py-32 bg-gradient-to-b from-amber-50/30 via-white to-white relative overflow-hidden">
        <div className="absolute inset-0 subtle-dots" />
        <div className="absolute bottom-20 left-0 w-80 h-80 bg-amber-50 rounded-full blur-3xl -translate-x-1/2" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateIn>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-amber-100 p-2.5 rounded-xl">
                <ShieldCheck className="h-6 w-6 text-amber-600" />
              </div>
              <span className="text-amber-600 font-semibold text-sm uppercase tracking-wide">For Parents/Guardians</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Full visibility, total peace of mind</h2>
            <p className="text-lg text-gray-500 mb-12 max-w-2xl">Nothing happens without your approval. See everything, stay informed, and watch your child grow.</p>
          </AnimateIn>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <AnimateIn delay={0} animation="fade-up">
              <SafetyCard
                icon={CheckCircle2}
                title="Give consent"
                description="No project goes live without your approval. You review the full project before it is shown to the public."
                color="from-amber-400 to-orange-400"
                lightBg="bg-amber-50"
                iconColor="text-amber-600"
                details={[
                  "You receive a clear notification when consent is needed",
                  "Review the full project description and milestones",
                  "Approve or ask questions before anything goes live",
                  "Takes just 2 minutes to review and consent",
                ]}
              />
            </AnimateIn>
            <AnimateIn delay={150} animation="fade-up">
              <SafetyCard
                icon={Eye}
                title="Full visibility"
                description="See everything — the funding progress, each milestone, and every drawdown request. Nothing is hidden."
                color="from-amber-500 to-amber-600"
                lightBg="bg-amber-50"
                iconColor="text-amber-600"
                details={[
                  "Real-time funding progress on your dashboard",
                  "Every milestone and spending plan visible",
                  "Notification when drawdown requests are made",
                  "Full audit trail of all money movements",
                ]}
              />
            </AnimateIn>
            <AnimateIn delay={300} animation="fade-up">
              <SafetyCard
                icon={ShieldCheck}
                title="Peace of mind"
                description="A teacher verifies every project. Funds are released in stages, not as a lump sum. Your child learns safely."
                color="from-orange-400 to-red-400"
                lightBg="bg-orange-50"
                iconColor="text-orange-600"
                details={[
                  "Teacher verification before anything goes public",
                  "Milestone-based drawdowns, not lump sums",
                  "All-or-nothing funding protects your child",
                  "Built specifically with minor safety in mind",
                ]}
              />
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* Transition */}
      <div className="h-16 bg-gradient-to-b from-white to-gray-50/80" />

      {/* ═══ FOR BACKERS ═══ */}
      <section className="py-24 sm:py-32 bg-gradient-to-b from-gray-50/80 via-purple-50/15 to-white relative overflow-hidden">
        <div className="absolute inset-0 subtle-grid" />
        <div className="absolute top-10 right-10 w-72 h-72 bg-purple-50 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateIn>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-purple-100 p-2.5 rounded-xl">
                <Heart className="h-6 w-6 text-purple-600" />
              </div>
              <span className="text-purple-600 font-semibold text-sm uppercase tracking-wide">For Backers</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Fund the next generation</h2>
            <p className="text-lg text-gray-500 mb-12 max-w-2xl">Every pound you give helps a young person take their first step as an entrepreneur. Here is how it works.</p>
          </AnimateIn>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { icon: Sparkles, title: 'Browse ideas', desc: 'Explore projects by young entrepreneurs across the UK. Filter by category, school, or search for something specific.' },
              { icon: ShieldCheck, title: 'Back with confidence', desc: 'Every project is teacher-verified and parent/guardian-approved. All-or-nothing funding means the student only gets the money if the full goal is reached.' },
              { icon: Eye, title: 'See the impact', desc: 'Follow the projects you back. Get updates from the student and see how your contribution is making a difference.' },
            ].map((item, i) => (
              <AnimateIn key={item.title} delay={i * 150} animation="fade-up">
                <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full group">
                  <div className="bg-purple-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <item.icon className="h-7 w-7 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="relative py-24 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700" />
        <div className="absolute top-10 left-10 w-64 h-64 bg-white/5 rounded-full blur-2xl" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-white/5 rounded-full blur-2xl" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimateIn>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-6 leading-tight">
              Ready to get started?
            </h2>
          </AnimateIn>
          <AnimateIn delay={100}>
            <p className="text-xl text-emerald-100 mb-10 max-w-xl mx-auto font-light">
              Whether you are a student with an idea, a teacher who wants to help, or someone who wants to support young entrepreneurs — there is a place for you.
            </p>
          </AnimateIn>
          <AnimateIn delay={200}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" className="bg-white text-emerald-600 hover:bg-emerald-50 font-bold text-lg px-8 py-4 shadow-xl hover:-translate-y-0.5 transition-all duration-300" asChild>
                  Sign Up Now <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/projects">
                <Button size="lg" variant="outline" className="border-2 border-white/30 text-white hover:bg-white/10 font-bold text-lg px-8 py-4 hover:-translate-y-0.5 transition-all duration-300" asChild>
                  Browse Projects
                </Button>
              </Link>
            </div>
          </AnimateIn>
        </div>
      </section>
    </div>
  );
}
