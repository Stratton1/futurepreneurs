'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  BookOpen, ArrowRight, Lightbulb, Megaphone, PiggyBank, Presentation, Wallet, Lock,
  Sparkles, Users, Heart, Zap, CheckCircle2, ChevronDown, Star, GraduationCap, Rocket,
  Trophy, Target, Brain,
} from 'lucide-react';
import { AnimateIn } from '@/components/ui/animate-in';
import { LEARNING_MODULES } from '@/lib/learning-modules';

const ICON_MAP: Record<string, typeof BookOpen> = {
  Lightbulb,
  Presentation,
  Megaphone,
  PiggyBank,
  Wallet,
  BookOpen,
};

const COLOUR_MAP: Record<string, { bg: string; text: string; lightBg: string; border: string }> = {
  amber: { bg: 'bg-amber-500', text: 'text-amber-600', lightBg: 'bg-amber-50', border: 'border-amber-200' },
  blue: { bg: 'bg-blue-500', text: 'text-blue-600', lightBg: 'bg-blue-50', border: 'border-blue-200' },
  purple: { bg: 'bg-purple-500', text: 'text-purple-600', lightBg: 'bg-purple-50', border: 'border-purple-200' },
  emerald: { bg: 'bg-emerald-500', text: 'text-emerald-600', lightBg: 'bg-emerald-50', border: 'border-emerald-200' },
  pink: { bg: 'bg-pink-500', text: 'text-pink-600', lightBg: 'bg-pink-50', border: 'border-pink-200' },
  indigo: { bg: 'bg-indigo-500', text: 'text-indigo-600', lightBg: 'bg-indigo-50', border: 'border-indigo-200' },
  slate: { bg: 'bg-slate-500', text: 'text-slate-600', lightBg: 'bg-slate-50', border: 'border-slate-200' },
};

/* ───── Belief Flip Card ───── */
function BeliefCard({
  icon: Icon,
  title,
  desc,
  quote,
  color,
  iconColor,
  delay,
}: {
  icon: typeof Sparkles;
  title: string;
  desc: string;
  quote: string;
  color: string;
  iconColor: string;
  delay: number;
}) {
  const [flipped, setFlipped] = useState(false);

  return (
    <AnimateIn delay={delay} animation="fade-up">
      <div
        className="flip-card-container cursor-pointer"
        onClick={() => setFlipped(!flipped)}
        onMouseEnter={() => setFlipped(true)}
        onMouseLeave={() => setFlipped(false)}
      >
        <div className={`flip-card-inner ${flipped ? 'flip-card-flipped' : ''}`}>
          {/* Front */}
          <div className={`flip-card-face flip-card-front ${color} rounded-2xl p-6 border border-gray-100/50`}>
            <Icon className={`h-8 w-8 ${iconColor} mb-4`} />
            <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
            <p className="text-xs text-gray-400 mt-4 font-medium">Tap to see more →</p>
          </div>
          {/* Back */}
          <div className="flip-card-face flip-card-back rounded-2xl p-7 bg-gradient-to-br from-gray-800 to-gray-900 text-white border border-gray-700">
            <div className="flex items-center gap-2 mb-4">
              <Icon className="h-5 w-5 text-white/60" />
              <span className="text-sm font-semibold text-white/70">{title}</span>
            </div>
            <blockquote className="text-lg font-medium italic leading-relaxed text-white/90 mb-4">
              &ldquo;{quote}&rdquo;
            </blockquote>
            <div className="flex items-center gap-2 mt-auto">
              <Star className="h-4 w-4 text-amber-400" />
              <span className="text-xs text-white/50">Core belief</span>
            </div>
          </div>
        </div>
      </div>
    </AnimateIn>
  );
}

/* ───── Expandable Module Card ───── */
function ModuleCard({
  mod,
  index,
}: {
  mod: (typeof LEARNING_MODULES)[number];
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const IconComponent = ICON_MAP[mod.icon] || BookOpen;
  const colours = COLOUR_MAP[mod.colour] || COLOUR_MAP.emerald;

  return (
    <AnimateIn delay={index * 80} animation="fade-up">
      <div
        className={`bg-white rounded-2xl border shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden group ${expanded ? `${colours.border} border-2` : 'border-gray-100'}`}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className={`${colours.lightBg} w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
              <IconComponent className={`h-6 w-6 ${colours.text}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-lg font-bold text-gray-900">{mod.title}</h3>
                <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-300 shrink-0 ml-2 ${expanded ? 'rotate-180' : ''}`} />
              </div>
              <p className="text-gray-500 text-sm leading-relaxed mb-3">{mod.description}</p>
              <div className="flex items-center gap-3 text-xs text-gray-400 font-medium">
                <span className={`${colours.lightBg} ${colours.text} px-2 py-0.5 rounded-full font-semibold`}>
                  {mod.lessons.length} lessons
                </span>
                <span>5+ quizzes</span>
                <span className="flex items-center gap-1">
                  <Target className="h-3 w-3" />
                  Tasks included
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Expanded lesson list */}
        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${expanded ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className={`px-6 pb-6 pt-2 ${colours.lightBg} border-t border-gray-50`}>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Lessons in this module</p>
            <div className="space-y-2">
              {mod.lessons.map((lesson, li) => (
                <div key={lesson.id} className="flex items-center gap-3 text-sm">
                  <span className={`${colours.bg} text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0`}>
                    {li + 1}
                  </span>
                  <span className="text-gray-700">{lesson.title}</span>
                  {lesson.quiz && lesson.quiz.length > 0 && (
                    <span className="text-xs text-gray-400 ml-auto">Quiz</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AnimateIn>
  );
}

export default function LearnPage() {
  return (
    <div className="overflow-hidden">
      {/* ═══ HERO — Dark animated style ═══ */}
      <section className="relative min-h-[65vh] flex items-center overflow-hidden bg-[#0a0f1e]">
        {/* Gradient orbs */}
        <div className="absolute inset-0">
          <div className="absolute top-[-15%] right-[-5%] w-[45vw] h-[45vw] rounded-full bg-gradient-to-br from-blue-500/25 to-indigo-400/10 blur-[100px] hero-orb-1" />
          <div className="absolute bottom-[-15%] left-[-5%] w-[40vw] h-[40vw] rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/10 blur-[100px] hero-orb-2" />
          <div className="absolute top-[35%] left-[20%] w-[25vw] h-[25vw] rounded-full bg-gradient-to-br from-purple-400/15 to-pink-400/5 blur-[80px] hero-orb-3" />

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
        <div className="absolute top-[15%] right-[15%] hero-float-icon hidden md:block" style={{ animationDelay: '0s' }}>
          <div className="bg-blue-500/20 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-3 shadow-lg shadow-blue-500/10">
            <BookOpen className="h-6 w-6 text-blue-400" />
          </div>
        </div>
        <div className="absolute bottom-[25%] left-[8%] hero-float-icon hidden md:block" style={{ animationDelay: '1s' }}>
          <div className="bg-emerald-500/20 backdrop-blur-xl border border-emerald-500/20 rounded-2xl p-3 shadow-lg shadow-emerald-500/10">
            <Brain className="h-6 w-6 text-emerald-400" />
          </div>
        </div>
        <div className="absolute top-[45%] right-[5%] hero-float-icon hidden lg:block" style={{ animationDelay: '2s' }}>
          <div className="bg-amber-500/20 backdrop-blur-xl border border-amber-500/20 rounded-2xl p-3 shadow-lg shadow-amber-500/10">
            <Trophy className="h-5 w-5 text-amber-400" />
          </div>
        </div>
        <div className="absolute top-[10%] left-[22%] hero-float-icon hidden lg:block" style={{ animationDelay: '0.5s' }}>
          <div className="bg-purple-500/20 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-3 shadow-lg shadow-purple-500/10">
            <Lightbulb className="h-5 w-5 text-purple-400" />
          </div>
        </div>

        {/* Main content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
          <div className="hero-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="inline-flex items-center gap-2.5 bg-white/10 backdrop-blur-md text-blue-300 rounded-full px-6 py-3 text-base font-semibold mb-8 border border-blue-400/30 badge-glow">
              <GraduationCap className="h-5 w-5 animate-pulse-soft" />
              Free for all students
            </div>
          </div>

          <div className="hero-fade-in" style={{ animationDelay: '0.3s' }}>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-[1.05] tracking-tight mb-6">
              <span className="text-white">Your Founder&apos;s</span>
              <br />
              <span className="text-gradient-light">Bootcamp</span>
            </h1>
          </div>

          <div className="hero-fade-in" style={{ animationDelay: '0.5s' }}>
            <p className="text-xl sm:text-2xl text-white/50 mb-10 leading-relaxed max-w-2xl mx-auto font-light">
              Everything you need to become a young entrepreneur. Bite-sized lessons, real-world examples, quizzes, and hands-on tasks.
            </p>
          </div>

          {/* Stats */}
          <div className="hero-fade-in grid grid-cols-3 gap-4 max-w-md mx-auto mb-10" style={{ animationDelay: '0.7s' }}>
            {[
              { value: '7', label: 'Modules', color: 'text-blue-400' },
              { value: '29', label: 'Lessons', color: 'text-emerald-400' },
              { value: '145+', label: 'Quiz questions', color: 'text-amber-400' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className={`text-3xl sm:text-4xl font-extrabold ${stat.color}`}>{stat.value}</div>
                <div className="text-xs sm:text-sm text-white/40 mt-1 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="hero-fade-in" style={{ animationDelay: '0.9s' }}>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-lg px-8 py-4 rounded-2xl transition-all duration-300 shadow-xl shadow-emerald-500/30 hover:shadow-emerald-400/40 hover:-translate-y-0.5"
            >
              Start Learning — It&apos;s Free
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* ═══ WHAT WE BELIEVE — Flip Cards ═══ */}
      <section className="py-16 sm:py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 doodle-bg-alt" />
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateIn>
            <div className="text-center mb-4">
              <div className="inline-flex items-center gap-2 text-purple-600 text-sm font-semibold mb-4">
                <Heart className="h-4 w-4" />
                WE BELIEVE IN YOU
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
                What drives us
              </h2>
              <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-12">
                We are proud to support aspiring entrepreneurs. These are the principles behind everything we build.
              </p>
            </div>
          </AnimateIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <BeliefCard
              icon={Sparkles}
              title="Everyone can be an entrepreneur"
              desc="You do not need to be a genius or have lots of money. With guidance and dedication, anyone can start a business."
              quote="The best time to start is now. The best person to start is you."
              color="bg-emerald-50"
              iconColor="text-emerald-600"
              delay={0}
            />
            <BeliefCard
              icon={Users}
              title="Inclusive by design"
              desc="Our lessons are written for all abilities and backgrounds. No jargon, no assumptions — just clear, friendly guidance."
              quote="Great ideas do not care about your age, background, or postcode."
              color="bg-blue-50"
              iconColor="text-blue-600"
              delay={100}
            />
            <BeliefCard
              icon={Zap}
              title="Practical, not theoretical"
              desc="Every lesson connects to your real project. You will learn by doing — not by reading textbooks."
              quote="Tell me and I forget. Teach me and I remember. Involve me and I learn."
              color="bg-amber-50"
              iconColor="text-amber-600"
              delay={200}
            />
            <BeliefCard
              icon={CheckCircle2}
              title="Structured for success"
              desc="Our modules build on each other in a logical order. Complete them at your own pace and track your progress."
              quote="A journey of a thousand miles begins with a single lesson."
              color="bg-purple-50"
              iconColor="text-purple-600"
              delay={300}
            />
          </div>
        </div>
      </section>

      {/* ═══ WHAT YOU'LL LEARN — Expandable Module Cards ═══ */}
      <section className="py-16 sm:py-24 bg-gradient-to-b from-gray-50/80 to-white relative overflow-hidden">
        <div className="absolute inset-0 doodle-bg-grow" />
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateIn>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 text-emerald-600 text-sm font-semibold mb-4">
                <BookOpen className="h-4 w-4" />
                YOUR CURRICULUM
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
                What you&apos;ll learn
              </h2>
              <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                Seven modules covering everything from entrepreneurial mindset to post-funding management. Tap any module to see its lessons.
              </p>
            </div>
          </AnimateIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {LEARNING_MODULES.map((mod, i) => (
              <ModuleCard key={mod.id} mod={mod} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS — Journey Steps ═══ */}
      <section className="py-16 sm:py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 doodle-bg" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateIn>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 text-blue-600 text-sm font-semibold mb-4">
                <Rocket className="h-4 w-4" />
                YOUR LEARNING JOURNEY
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
                How the Learning Hub works
              </h2>
            </div>
          </AnimateIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: '1', title: 'Bite-sized lessons', desc: 'Each lesson takes 3-5 minutes. Short, focused, and full of real examples.', icon: BookOpen, color: 'bg-blue-500', lightBg: 'bg-blue-50', iconColor: 'text-blue-600' },
              { step: '2', title: 'Quizzes and tasks', desc: 'Test your knowledge with 5+ question quizzes and hands-on practical tasks.', icon: CheckCircle2, color: 'bg-emerald-500', lightBg: 'bg-emerald-50', iconColor: 'text-emerald-600' },
              { step: '3', title: 'Track progress', desc: 'See what you have completed, your quiz scores, and how far through each module you are.', icon: Target, color: 'bg-amber-500', lightBg: 'bg-amber-50', iconColor: 'text-amber-600' },
              { step: '4', title: 'Earn the Scholar badge', desc: 'Complete all modules and earn the Scholar badge on your profile — show the world you mean business.', icon: Trophy, color: 'bg-purple-500', lightBg: 'bg-purple-50', iconColor: 'text-purple-600' },
            ].map((item, i) => (
              <AnimateIn key={item.step} delay={i * 100} animation="fade-up">
                <div className="text-center group">
                  <div className="relative inline-block mb-4">
                    <div className={`${item.color} text-white w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg mx-auto group-hover:scale-110 transition-transform duration-300`}>
                      <item.icon className="h-7 w-7" />
                    </div>
                    <div className="absolute -top-1.5 -right-1.5 bg-white text-gray-800 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-sm border border-gray-100">
                      {item.step}
                    </div>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="relative py-20 sm:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700" />
        <div className="absolute top-10 left-10 w-64 h-64 bg-white/5 rounded-full blur-2xl animate-float-slow" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-white/5 rounded-full blur-2xl animate-float-slower" />

        {/* Floating icons */}
        <div className="absolute top-[20%] right-[15%] hero-float-icon hidden md:block opacity-20" style={{ animationDelay: '0s' }}>
          <BookOpen className="h-8 w-8 text-white" />
        </div>
        <div className="absolute bottom-[25%] left-[10%] hero-float-icon hidden md:block opacity-20" style={{ animationDelay: '1.5s' }}>
          <Lightbulb className="h-7 w-7 text-white" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimateIn>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-6 leading-tight">
              Ready to start learning?
            </h2>
          </AnimateIn>
          <AnimateIn delay={100}>
            <p className="text-xl text-blue-100 mb-10 max-w-xl mx-auto font-light">
              Sign up for free and start building the skills you need to launch your business idea. Your Founder&apos;s Bootcamp awaits.
            </p>
          </AnimateIn>
          <AnimateIn delay={200}>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 bg-white text-blue-600 hover:bg-blue-50 font-bold text-lg px-8 py-4 rounded-2xl shadow-xl hover:-translate-y-0.5 transition-all duration-300"
            >
              Sign Up — It&apos;s Free
              <ArrowRight className="h-5 w-5" />
            </Link>
          </AnimateIn>
        </div>
      </section>
    </div>
  );
}
