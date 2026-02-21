import Link from 'next/link';
import { BookOpen, ArrowRight, Lightbulb, Megaphone, PiggyBank, Presentation, Lock, Sparkles, Users, Heart, Zap, CheckCircle2 } from 'lucide-react';
import { AnimateIn } from '@/components/ui/animate-in';
import { LEARNING_MODULES } from '@/lib/learning-modules';
import { getCurrentUser } from '@/lib/supabase/auth-helpers';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Learning Hub — Futurepreneurs',
  description: 'Free bite-sized guides to help young entrepreneurs plan, pitch, market, and manage their business. Learn at your own pace.',
};

const ICON_MAP: Record<string, typeof BookOpen> = {
  Lightbulb,
  Presentation,
  Megaphone,
  PiggyBank,
};

const COLOUR_MAP: Record<string, { bg: string; text: string; lightBg: string }> = {
  amber: { bg: 'bg-amber-500', text: 'text-amber-600', lightBg: 'bg-amber-50' },
  blue: { bg: 'bg-blue-500', text: 'text-blue-600', lightBg: 'bg-blue-50' },
  pink: { bg: 'bg-pink-500', text: 'text-pink-600', lightBg: 'bg-pink-50' },
  emerald: { bg: 'bg-emerald-500', text: 'text-emerald-600', lightBg: 'bg-emerald-50' },
};

export default async function LearnPage() {
  const user = await getCurrentUser();

  return (
    <div className="overflow-hidden">
      {/* ═══ HERO ═══ */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-emerald-50 py-20 sm:py-28 overflow-hidden">
        <div className="absolute inset-0 subtle-dots" />
        <div className="absolute top-10 right-10 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-10 left-10 w-64 h-64 bg-emerald-200/20 rounded-full blur-3xl animate-float-slower" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimateIn animation="fade-in">
            <div className="inline-flex items-center gap-2 bg-blue-100/80 text-blue-700 rounded-full px-5 py-2 text-sm font-semibold mb-6">
              <BookOpen className="h-4 w-4" />
              Free for all students
            </div>
          </AnimateIn>
          <AnimateIn animation="fade-up" delay={100}>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 leading-tight tracking-tight">
              Learning <span className="text-gradient">Hub</span>
            </h1>
          </AnimateIn>
          <AnimateIn animation="fade-up" delay={200}>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto font-light leading-relaxed">
              Everything you need to become a young entrepreneur. Bite-sized lessons, real-world examples, and quizzes to test your knowledge.
            </p>
          </AnimateIn>
          <AnimateIn animation="fade-up" delay={300}>
            <div className="mt-8">
              <Link
                href={user ? '/dashboard/learning' : '/signup'}
                className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-lg px-8 py-4 rounded-2xl transition-all duration-300 shadow-lg shadow-emerald-500/20 hover:-translate-y-0.5"
              >
                {user ? 'Go to Learning Hub' : 'Sign Up to Start Learning'}
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* Transition */}
      <div className="h-16 bg-gradient-to-b from-emerald-50/30 to-white" />

      {/* ═══ OUR PHILOSOPHY ═══ */}
      <section className="py-20 sm:py-28 bg-white relative overflow-hidden">
        <div className="absolute inset-0 subtle-diagonal" />
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateIn>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 text-purple-600 text-sm font-semibold mb-4">
                <Heart className="h-4 w-4" />
                OUR PHILOSOPHY
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-5">
                What we believe
              </h2>
            </div>
          </AnimateIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Sparkles, title: 'Everyone can be an entrepreneur', desc: 'You do not need to be a genius or have lots of money. With guidance, dedication, and the right skills, anyone can start a business.', color: 'bg-emerald-50', iconColor: 'text-emerald-600' },
              { icon: Users, title: 'Inclusive by design', desc: 'Our lessons are written for all abilities and backgrounds. No jargon, no assumptions — just clear, friendly guidance.', color: 'bg-blue-50', iconColor: 'text-blue-600' },
              { icon: Zap, title: 'Practical, not theoretical', desc: 'Every lesson connects to your real project. You will learn by doing — not by reading textbooks.', color: 'bg-amber-50', iconColor: 'text-amber-600' },
              { icon: CheckCircle2, title: 'Methodical and structured', desc: 'Our modules build on each other in a logical order. Complete them at your own pace, and track your progress as you go.', color: 'bg-purple-50', iconColor: 'text-purple-600' },
            ].map((item, i) => (
              <AnimateIn key={item.title} delay={i * 100} animation="fade-up">
                <div className={`${item.color} rounded-2xl p-6 border border-gray-100/50 h-full`}>
                  <item.icon className={`h-7 w-7 ${item.iconColor} mb-4`} />
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* Transition */}
      <div className="h-16 bg-gradient-to-b from-white to-gray-50/80" />

      {/* ═══ WHAT YOU'LL LEARN ═══ */}
      <section className="py-20 sm:py-28 bg-gradient-to-b from-gray-50/80 to-white relative overflow-hidden">
        <div className="absolute inset-0 subtle-grid" />
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateIn>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 text-emerald-600 text-sm font-semibold mb-4">
                <BookOpen className="h-4 w-4" />
                MODULES
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-5">
                What you&apos;ll learn
              </h2>
              <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                Four modules covering everything from writing your business plan to managing your money after you get funded.
              </p>
            </div>
          </AnimateIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {LEARNING_MODULES.map((mod, i) => {
              const IconComponent = ICON_MAP[mod.icon] || BookOpen;
              const colours = COLOUR_MAP[mod.colour] || COLOUR_MAP.emerald;
              return (
                <AnimateIn key={mod.id} delay={i * 100} animation="fade-up">
                  <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 h-full">
                    <div className="flex items-start gap-4">
                      <div className={`${colours.lightBg} w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0`}>
                        <IconComponent className={`h-6 w-6 ${colours.text}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">{mod.title}</h3>
                        <p className="text-gray-500 text-sm leading-relaxed mb-3">{mod.description}</p>
                        <div className="flex items-center gap-3 text-xs text-gray-400">
                          <span>{mod.lessons.length} lessons</span>
                          <span className="flex items-center gap-1">
                            <Lock className="h-3 w-3" />
                            {user ? 'Available' : 'Sign up to access'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </AnimateIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section className="py-20 sm:py-28 bg-white relative overflow-hidden">
        <div className="absolute inset-0 subtle-dots" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateIn>
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-5">
                How the Learning Hub works
              </h2>
            </div>
          </AnimateIn>

          <div className="space-y-6">
            {[
              { step: '1', title: 'Bite-sized lessons', desc: 'Each lesson takes 3-5 minutes to read. Short, focused, and full of real examples.', emoji: '📖' },
              { step: '2', title: 'Quizzes to test yourself', desc: 'Quick quizzes at the end of most lessons help you check your understanding.', emoji: '✅' },
              { step: '3', title: 'Track your progress', desc: 'See which lessons you have completed and how far through each module you are.', emoji: '📊' },
              { step: '4', title: 'Earn the Scholar badge', desc: 'Complete all modules and earn the Scholar badge on your profile — show backers you mean business.', emoji: '🏆' },
            ].map((item, i) => (
              <AnimateIn key={item.step} delay={i * 100} animation="fade-left">
                <div className="flex items-start gap-5 bg-gray-50 rounded-xl p-5">
                  <div className="text-3xl">{item.emoji}</div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="relative py-24 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700" />
        <div className="absolute top-10 left-10 w-64 h-64 bg-white/5 rounded-full blur-2xl" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-white/5 rounded-full blur-2xl" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimateIn>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-6 leading-tight">
              Ready to start learning?
            </h2>
          </AnimateIn>
          <AnimateIn delay={100}>
            <p className="text-xl text-blue-100 mb-10 max-w-xl mx-auto font-light">
              Sign up for free and start building the skills you need to launch your business idea.
            </p>
          </AnimateIn>
          <AnimateIn delay={200}>
            <Link
              href={user ? '/dashboard/learning' : '/signup'}
              className="inline-flex items-center gap-2 bg-white text-blue-600 hover:bg-blue-50 font-bold text-lg px-8 py-4 rounded-2xl shadow-xl hover:-translate-y-0.5 transition-all duration-300"
            >
              {user ? 'Go to Learning Hub' : 'Sign Up — It\u0027s Free'}
              <ArrowRight className="h-5 w-5" />
            </Link>
          </AnimateIn>
        </div>
      </section>
    </div>
  );
}
