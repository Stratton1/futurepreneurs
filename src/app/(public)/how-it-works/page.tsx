'use client';

import { useState } from 'react';
import { Rocket, ClipboardCheck, ShieldCheck, Heart, Banknote, GraduationCap, Users, ArrowRight, Sparkles, Eye, CheckCircle2, Zap, PiggyBank, Share2, ChevronDown, Star, Shield, Lightbulb } from 'lucide-react';
import Link from 'next/link';
import { AnimateIn } from '@/components/ui/animate-in';

/* ───── Expandable Card ───── */
function ExpandableCard({
  icon,
  title,
  description,
  details,
  lightBg,
  iconColor,
  borderColor,
  delay,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  details: string[];
  lightBg: string;
  iconColor: string;
  borderColor: string;
  delay: number;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <AnimateIn delay={delay} animation="fade-up">
      <div
        className={`bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 h-full group cursor-pointer overflow-hidden ${expanded ? 'ring-2 ' + borderColor : ''}`}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="p-8">
          <div className={`${lightBg} w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
            {icon}
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
          <p className="text-gray-500 leading-relaxed">{description}</p>
          <div className="flex items-center gap-1 mt-4 text-xs text-gray-400 font-medium">
            <span>{expanded ? 'Tap to collapse' : 'Tap to learn more'}</span>
            <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`} />
          </div>
        </div>
        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${expanded ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'}`}
        >
          <div className={`px-8 pb-8 pt-2 ${lightBg} border-t border-gray-50`}>
            <ul className="space-y-2.5">
              {details.map((d, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <CheckCircle2 className={`h-4 w-4 mt-0.5 shrink-0 ${iconColor}`} />
                  <span className="text-sm text-gray-600">{d}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </AnimateIn>
  );
}

/* ───── Animated Step Card ───── */
function StepCard({
  step,
  icon: Icon,
  title,
  desc,
  color,
  delay,
}: {
  step: string;
  icon: typeof Rocket;
  title: string;
  desc: string;
  color: string;
  delay: number;
}) {
  return (
    <AnimateIn delay={delay} animation="fade-up">
      <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full relative overflow-hidden">
        {/* Colored top accent */}
        <div className={`absolute top-0 left-0 right-0 h-1 ${color} transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500`} />

        <div className="flex items-start gap-4">
          <div className="relative flex-shrink-0">
            <div className={`${color} text-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
              <Icon className="h-6 w-6" />
            </div>
            <div className="absolute -top-1.5 -right-1.5 bg-white text-gray-800 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-sm border border-gray-100">
              {step}
            </div>
          </div>
          <div className="pt-1">
            <h3 className="text-base font-bold text-gray-900 mb-1.5">{title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
          </div>
        </div>
      </div>
    </AnimateIn>
  );
}

export default function HowItWorksPage() {
  return (
    <div className="overflow-hidden">
      {/* ═══ HERO — Dark animated style ═══ */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden bg-[#0a0f1e]">
        {/* Gradient orbs */}
        <div className="absolute inset-0">
          <div className="absolute top-[-15%] left-[-5%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-br from-emerald-500/25 to-teal-400/10 blur-[100px] hero-orb-1" />
          <div className="absolute bottom-[-15%] right-[-5%] w-[45vw] h-[45vw] rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/10 blur-[100px] hero-orb-2" />
          <div className="absolute top-[40%] right-[15%] w-[25vw] h-[25vw] rounded-full bg-gradient-to-br from-amber-400/15 to-pink-400/5 blur-[80px] hero-orb-3" />

          {/* Grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: '60px 60px',
            }}
          />
        </div>

        {/* Floating icons */}
        <div className="absolute top-[15%] right-[12%] hero-float-icon hidden md:block" style={{ animationDelay: '0s' }}>
          <div className="bg-emerald-500/20 backdrop-blur-xl border border-emerald-500/20 rounded-2xl p-3 shadow-lg shadow-emerald-500/10">
            <Rocket className="h-6 w-6 text-emerald-400" />
          </div>
        </div>
        <div className="absolute bottom-[20%] left-[8%] hero-float-icon hidden md:block" style={{ animationDelay: '1s' }}>
          <div className="bg-blue-500/20 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-3 shadow-lg shadow-blue-500/10">
            <GraduationCap className="h-6 w-6 text-blue-400" />
          </div>
        </div>
        <div className="absolute top-[50%] left-[5%] hero-float-icon hidden lg:block" style={{ animationDelay: '2s' }}>
          <div className="bg-pink-500/20 backdrop-blur-xl border border-pink-500/20 rounded-2xl p-3 shadow-lg shadow-pink-500/10">
            <Heart className="h-5 w-5 text-pink-400" />
          </div>
        </div>
        <div className="absolute top-[12%] left-[20%] hero-float-icon hidden lg:block" style={{ animationDelay: '0.5s' }}>
          <div className="bg-amber-500/20 backdrop-blur-xl border border-amber-500/20 rounded-2xl p-3 shadow-lg shadow-amber-500/10">
            <Lightbulb className="h-5 w-5 text-amber-400" />
          </div>
        </div>
        <div className="absolute bottom-[25%] right-[8%] hero-float-icon hidden md:block" style={{ animationDelay: '1.5s' }}>
          <div className="bg-purple-500/20 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-3 shadow-lg shadow-purple-500/10">
            <ShieldCheck className="h-5 w-5 text-purple-400" />
          </div>
        </div>

        {/* Main content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
          <div className="hero-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="inline-flex items-center gap-2.5 bg-white/10 backdrop-blur-md text-emerald-300 rounded-full px-6 py-3 text-base font-semibold mb-8 border border-emerald-400/30 badge-glow">
              <Zap className="h-5 w-5 animate-pulse-soft" />
              Simple, safe, supported
            </div>
          </div>

          <div className="hero-fade-in" style={{ animationDelay: '0.3s' }}>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-[1.05] tracking-tight mb-6">
              <span className="text-white">From idea to</span>
              <br />
              <span className="text-gradient-light">funded business</span>
            </h1>
          </div>

          <div className="hero-fade-in" style={{ animationDelay: '0.5s' }}>
            <p className="text-xl sm:text-2xl text-white/50 mb-10 leading-relaxed max-w-2xl mx-auto font-light">
              Everything you need to know about how Futurepreneurs works — for students, teachers, parents, and supporters.
            </p>
          </div>

          {/* Animated stats */}
          <div className="hero-fade-in grid grid-cols-3 gap-4 max-w-lg mx-auto mb-10" style={{ animationDelay: '0.7s' }}>
            {[
              { value: '6', label: 'Simple steps', color: 'text-emerald-400' },
              { value: '3', label: 'Safeguards', color: 'text-blue-400' },
              { value: '1', label: 'Goal', color: 'text-amber-400' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className={`text-3xl sm:text-4xl font-extrabold ${stat.color}`}>{stat.value}</div>
                <div className="text-xs sm:text-sm text-white/40 mt-1 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Trust badges */}
          <div className="hero-fade-in flex flex-wrap justify-center gap-4 sm:gap-6" style={{ animationDelay: '0.9s' }}>
            {[
              { icon: Shield, label: 'School verified', color: 'text-emerald-400' },
              { icon: GraduationCap, label: 'Teacher mentored', color: 'text-blue-400' },
              { icon: Heart, label: 'Parent approved', color: 'text-amber-400' },
            ].map((b) => (
              <div key={b.label} className="flex items-center gap-2 text-white/60 text-sm font-medium">
                <b.icon className={`h-4 w-4 ${b.color}`} />
                <span>{b.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* ═══ THE JOURNEY (Students) ═══ */}
      <section className="py-20 sm:py-28 bg-gradient-to-b from-white via-emerald-50/20 to-white relative overflow-hidden">
        <div className="absolute inset-0 doodle-bg" />
        <div className="absolute top-0 left-0 w-80 h-80 bg-emerald-50 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateIn>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-emerald-100 p-2.5 rounded-xl">
                <Rocket className="h-6 w-6 text-emerald-600" />
              </div>
              <span className="text-emerald-600 font-semibold text-sm uppercase tracking-wide">For Students</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Your journey from idea to business</h2>
            <p className="text-lg text-gray-500 mb-10 max-w-2xl">Six steps. That&apos;s all it takes to go from an idea in your head to a real, funded business.</p>
          </AnimateIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { step: '1', icon: Sparkles, title: 'Sign up with your school email', desc: 'Create your account using your school email address. This is how we verify you are a real student at a real school.', color: 'bg-emerald-500' },
              { step: '2', icon: ClipboardCheck, title: 'Create your project', desc: 'Tell everyone about your business idea. Add a title, description, images, your funding goal, and plan your milestones.', color: 'bg-emerald-500' },
              { step: '3', icon: GraduationCap, title: 'Choose a teacher mentor', desc: 'Pick a teacher at your school to mentor you. They review your project and guide you through the process.', color: 'bg-blue-500' },
              { step: '4', icon: CheckCircle2, title: 'Get verified and go live', desc: 'Your teacher approves your project, then your parent/guardian gives consent. Once both say yes — you are live!', color: 'bg-blue-500' },
              { step: '5', icon: Share2, title: 'Get funded by supporters', desc: 'Share your project with family, friends, and the wider community. Watch the support roll in as people believe in your idea.', color: 'bg-amber-500' },
              { step: '6', icon: PiggyBank, title: 'Draw down funds and build', desc: 'Request money against your milestones. Your teacher approves each drawdown. Build your business, step by step.', color: 'bg-purple-500' },
            ].map((item, i) => (
              <StepCard key={item.step} {...item} delay={i * 80} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FOR TEACHERS ═══ */}
      <section className="py-20 sm:py-28 bg-gradient-to-b from-gray-50/80 via-blue-50/20 to-white relative overflow-hidden">
        <div className="absolute inset-0 doodle-bg-alt" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-blue-50 rounded-full blur-3xl translate-x-1/2" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateIn>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-100 p-2.5 rounded-xl">
                <GraduationCap className="h-6 w-6 text-blue-600" />
              </div>
              <span className="text-blue-600 font-semibold text-sm uppercase tracking-wide">For Teachers</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">The trust anchor behind every project</h2>
            <p className="text-lg text-gray-500 mb-10 max-w-2xl">You are the key to making this work. Verify, guide, and approve — helping students learn real-world skills.</p>
          </AnimateIn>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <ExpandableCard
              icon={<ClipboardCheck className="h-7 w-7 text-blue-600" />}
              title="Verify projects"
              description="Students choose you as their mentor. Review their project, check it is appropriate, and approve it to go live."
              details={[
                'Students select you from a list of teachers at their school',
                'You receive a notification when a student needs verification',
                'Review the full project: description, goals, milestones',
                'Approve with one click — or send feedback for improvements',
              ]}
              lightBg="bg-blue-50"
              iconColor="text-blue-600"
              borderColor="ring-blue-200"
              delay={0}
            />
            <ExpandableCard
              icon={<Banknote className="h-7 w-7 text-indigo-600" />}
              title="Approve spending"
              description="When a project is funded, students request drawdowns against their milestones. You approve each request before funds are released."
              details={[
                'Students submit drawdown requests with descriptions',
                'You review each request against the original milestone plan',
                'Approve or ask for more information before releasing funds',
                'Full audit trail keeps everyone accountable',
              ]}
              lightBg="bg-indigo-50"
              iconColor="text-indigo-600"
              borderColor="ring-indigo-200"
              delay={150}
            />
            <ExpandableCard
              icon={<Users className="h-7 w-7 text-violet-600" />}
              title="Guide and support"
              description="Be the trusted adult behind every project. Help students learn real business skills in a safe, structured environment."
              details={[
                'Mentor students through the entire funding journey',
                'Help them develop real-world entrepreneurial skills',
                'Integrates with curriculum: business studies, PSHE, enterprise',
                'Our Learning Hub provides structured lessons to support you',
              ]}
              lightBg="bg-violet-50"
              iconColor="text-violet-600"
              borderColor="ring-violet-200"
              delay={300}
            />
          </div>
        </div>
      </section>

      {/* ═══ FOR PARENTS/GUARDIANS ═══ */}
      <section className="py-20 sm:py-28 bg-gradient-to-b from-amber-50/30 via-white to-white relative overflow-hidden">
        <div className="absolute inset-0 doodle-bg-grow" />
        <div className="absolute bottom-20 left-0 w-80 h-80 bg-amber-50 rounded-full blur-3xl -translate-x-1/2" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateIn>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-amber-100 p-2.5 rounded-xl">
                <ShieldCheck className="h-6 w-6 text-amber-600" />
              </div>
              <span className="text-amber-600 font-semibold text-sm uppercase tracking-wide">For Parents/Guardians</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Full visibility, total peace of mind</h2>
            <p className="text-lg text-gray-500 mb-10 max-w-2xl">Nothing happens without your approval. See everything, stay informed, and watch your child grow.</p>
          </AnimateIn>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <ExpandableCard
              icon={<CheckCircle2 className="h-7 w-7 text-amber-600" />}
              title="Give consent"
              description="No project goes live without your approval. You review the full project before it is shown to the public."
              details={[
                'You receive a clear notification when consent is needed',
                'Review the full project description and milestones',
                'Approve or ask questions before anything goes live',
                'Takes just 2 minutes to review and consent',
              ]}
              lightBg="bg-amber-50"
              iconColor="text-amber-600"
              borderColor="ring-amber-200"
              delay={0}
            />
            <ExpandableCard
              icon={<Eye className="h-7 w-7 text-amber-600" />}
              title="Full visibility"
              description="See everything — the funding progress, each milestone, and every drawdown request. Nothing is hidden."
              details={[
                'Real-time funding progress on your dashboard',
                'Every milestone and spending plan visible',
                'Notification when drawdown requests are made',
                'Full audit trail of all money movements',
              ]}
              lightBg="bg-amber-50"
              iconColor="text-amber-600"
              borderColor="ring-amber-200"
              delay={150}
            />
            <ExpandableCard
              icon={<ShieldCheck className="h-7 w-7 text-orange-600" />}
              title="Peace of mind"
              description="A teacher verifies every project. Funds are released in stages, not as a lump sum. Your child learns safely."
              details={[
                'Teacher verification before anything goes public',
                'Milestone-based drawdowns, not lump sums',
                'All-or-nothing funding protects your child',
                'Built specifically with minor safety in mind',
              ]}
              lightBg="bg-orange-50"
              iconColor="text-orange-600"
              borderColor="ring-orange-200"
              delay={300}
            />
          </div>
        </div>
      </section>

      {/* ═══ FOR SUPPORTERS ═══ */}
      <section className="py-20 sm:py-28 bg-gradient-to-b from-gray-50/80 via-purple-50/15 to-white relative overflow-hidden">
        <div className="absolute inset-0 doodle-bg" />
        <div className="absolute top-10 right-10 w-72 h-72 bg-purple-50 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateIn>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-purple-100 p-2.5 rounded-xl">
                <Heart className="h-6 w-6 text-purple-600" />
              </div>
              <span className="text-purple-600 font-semibold text-sm uppercase tracking-wide">For Supporters</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Believe in the next generation</h2>
            <p className="text-lg text-gray-500 mb-10 max-w-2xl">Every pound you give helps a young person take their first step as an entrepreneur. Here&apos;s how it works.</p>
          </AnimateIn>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <ExpandableCard
              icon={<Sparkles className="h-7 w-7 text-purple-600" />}
              title="Browse ideas"
              description="Explore projects by young entrepreneurs across the UK. Filter by category, school, or search for something specific."
              details={[
                'Every project has been reviewed by a real teacher',
                'Browse by category: tech, food, fashion, services, and more',
                'See funding progress, milestones, and student stories',
                'Projects are all-or-nothing — students only get funds if the goal is met',
              ]}
              lightBg="bg-purple-50"
              iconColor="text-purple-600"
              borderColor="ring-purple-200"
              delay={0}
            />
            <ExpandableCard
              icon={<ShieldCheck className="h-7 w-7 text-purple-600" />}
              title="Support with confidence"
              description="Every project is teacher-verified and parent-approved. All-or-nothing funding means students only get the money if the full goal is reached."
              details={[
                'Guest checkout — no account required to support a project',
                'Pay securely with card, Apple Pay, or Google Pay',
                'Just 2.5% platform fee on successful projects',
                'You can support anonymously if you prefer',
              ]}
              lightBg="bg-purple-50"
              iconColor="text-purple-600"
              borderColor="ring-purple-200"
              delay={150}
            />
            <ExpandableCard
              icon={<Eye className="h-7 w-7 text-purple-600" />}
              title="See the impact"
              description="Follow the projects you support. Get updates from the student and see how your contribution makes a difference."
              details={[
                'Receive updates when the student posts progress',
                'See milestones completed and funds used responsibly',
                'Your dashboard tracks every project you have supported',
                'Know that a teacher approved every drawdown',
              ]}
              lightBg="bg-purple-50"
              iconColor="text-purple-600"
              borderColor="ring-purple-200"
              delay={300}
            />
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="relative py-20 sm:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700" />
        {/* Floating decorative elements */}
        <div className="absolute top-10 left-10 w-64 h-64 bg-white/5 rounded-full blur-2xl animate-float-slow" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-white/5 rounded-full blur-2xl animate-float-slower" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl" />

        {/* Floating icons */}
        <div className="absolute top-[15%] left-[10%] hero-float-icon hidden md:block opacity-20" style={{ animationDelay: '0s' }}>
          <Star className="h-8 w-8 text-white" />
        </div>
        <div className="absolute bottom-[20%] right-[12%] hero-float-icon hidden md:block opacity-20" style={{ animationDelay: '1s' }}>
          <Heart className="h-6 w-6 text-white" />
        </div>
        <div className="absolute top-[60%] left-[20%] hero-float-icon hidden lg:block opacity-15" style={{ animationDelay: '2s' }}>
          <Sparkles className="h-7 w-7 text-white" />
        </div>

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
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 bg-white text-emerald-600 hover:bg-emerald-50 font-bold text-lg px-8 py-4 rounded-2xl shadow-xl hover:-translate-y-0.5 transition-all duration-300"
              >
                Sign Up Now
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/projects"
                className="inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white hover:bg-white/10 font-bold text-lg px-8 py-4 rounded-2xl hover:-translate-y-0.5 transition-all duration-300"
              >
                Browse Projects
              </Link>
            </div>
          </AnimateIn>
        </div>
      </section>
    </div>
  );
}
