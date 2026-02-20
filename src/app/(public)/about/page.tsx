import { Rocket, Shield, GraduationCap, Heart, Lightbulb, Target, ArrowRight, Zap, Globe, Users } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AnimateIn } from '@/components/ui/animate-in';
import { AnimatedCounter } from '@/components/ui/animated-counter';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About — Futurepreneurs',
  description: 'Futurepreneurs is a crowdfunding platform built specifically for young entrepreneurs under 18. Safe, teacher-verified, parent-approved.',
};

export default function AboutPage() {
  return (
    <div className="overflow-hidden">
      {/* ═══ HERO ═══ */}
      <section className="relative bg-gradient-to-br from-emerald-50 via-white to-amber-50 py-20 sm:py-28 overflow-hidden">
        <div className="absolute top-10 left-10 w-72 h-72 bg-emerald-200/20 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-10 right-20 w-80 h-80 bg-amber-200/20 rounded-full blur-3xl animate-float-slower" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimateIn animation="fade-in">
            <div className="inline-flex items-center gap-2 bg-emerald-100/80 text-emerald-700 rounded-full px-5 py-2 text-sm font-semibold mb-6">
              <Rocket className="h-4 w-4" />
              Our story
            </div>
          </AnimateIn>
          <AnimateIn animation="fade-up" delay={100}>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 leading-tight tracking-tight">
              Every young person deserves
              <br />
              <span className="text-gradient">a chance to build</span>
            </h1>
          </AnimateIn>
          <AnimateIn animation="fade-up" delay={200}>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed font-light">
              Futurepreneurs exists because we believe the next generation of business leaders should not have to wait until they are 18 to get started.
            </p>
          </AnimateIn>
        </div>
      </section>

      {/* ═══ MISSION ═══ */}
      <section className="py-24 sm:py-32 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <AnimateIn animation="fade-right">
              <div>
                <div className="inline-flex items-center gap-2 text-emerald-600 text-sm font-semibold mb-4">
                  <Target className="h-4 w-4" />
                  OUR MISSION
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                  Building the platform young entrepreneurs deserve
                </h2>
                <div className="space-y-4 text-gray-500 leading-relaxed text-lg">
                  <p>
                    We are building the first crowdfunding platform designed specifically for young people under 18. Existing platforms were not built for minors — they lack the safety features, oversight, and trust that parents and teachers need.
                  </p>
                  <p>
                    Futurepreneurs changes that. Every project on our platform is verified by a teacher, approved by a parent, and funded by the public. When the money comes in, it is released in stages through a milestone system — so young entrepreneurs learn financial responsibility from day one.
                  </p>
                  <p className="font-medium text-gray-700">
                    We want every school in the UK to have students who are not just learning about business — they are doing it.
                  </p>
                </div>
              </div>
            </AnimateIn>

            <AnimateIn animation="fade-left" delay={200}>
              <div className="grid grid-cols-2 gap-5">
                {[
                  { icon: Shield, label: 'Safety first', description: 'Built for under-18s from day one', color: 'from-blue-500 to-blue-600', lightBg: 'bg-blue-50' },
                  { icon: GraduationCap, label: 'School-verified', description: 'Teacher approval on everything', color: 'from-emerald-500 to-emerald-600', lightBg: 'bg-emerald-50' },
                  { icon: Heart, label: 'Parent-approved', description: 'Full visibility and consent', color: 'from-amber-500 to-amber-600', lightBg: 'bg-amber-50' },
                  { icon: Target, label: 'Milestone-based', description: 'Structured fund releases', color: 'from-purple-500 to-purple-600', lightBg: 'bg-purple-50' },
                  { icon: Lightbulb, label: 'Real learning', description: 'Business skills by doing', color: 'from-orange-500 to-orange-600', lightBg: 'bg-orange-50' },
                  { icon: Rocket, label: 'Big dreams', description: 'No idea is too ambitious', color: 'from-pink-500 to-pink-600', lightBg: 'bg-pink-50' },
                ].map((item, i) => (
                  <div key={item.label} className={`${item.lightBg} rounded-2xl p-5 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group`}>
                    <div className={`bg-gradient-to-br ${item.color} w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <item.icon className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-sm font-bold text-gray-900 block">{item.label}</span>
                    <span className="text-xs text-gray-500 mt-1 block">{item.description}</span>
                  </div>
                ))}
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* ═══ STATS ═══ */}
      <section className="py-16 bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
            {[
              { value: 10, prefix: '£', suffix: 'k', label: 'Max per project' },
              { value: 100, prefix: '', suffix: '%', label: 'Teacher verified' },
              { value: 0, prefix: '', suffix: '', label: 'Upfront cost' },
              { value: 2.5, prefix: '', suffix: '%', label: 'Platform fee' },
            ].map((stat, i) => (
              <AnimateIn key={stat.label} delay={i * 100} animation="fade-up">
                <div>
                  <div className="text-3xl sm:text-4xl font-extrabold text-white">
                    {stat.prefix}<AnimatedCounter end={stat.value} suffix={stat.suffix} className="text-white" />
                  </div>
                  <p className="text-emerald-100 text-sm mt-1">{stat.label}</p>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ WHAT MAKES US DIFFERENT ═══ */}
      <section className="py-24 sm:py-32 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateIn>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 text-blue-600 text-sm font-semibold mb-4">
                <Zap className="h-4 w-4" />
                WHY FUTUREPRENEURS
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-5">What makes us different</h2>
              <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                This is not just another crowdfunding site. Every feature has been designed with young people in mind.
              </p>
            </div>
          </AnimateIn>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              {
                title: 'Built for under-18s',
                description: 'This is not a regular crowdfunding site. Every feature has been designed with young people in mind — from school email sign-up to parent consent flows.',
                gradient: 'from-emerald-500 to-teal-500',
              },
              {
                title: 'Teacher as trust anchor',
                description: 'A real teacher at the student\'s school verifies every project and approves every fund release. This is not just moderation — it is mentorship.',
                gradient: 'from-blue-500 to-indigo-500',
              },
              {
                title: 'Milestone-based spending',
                description: 'Funds are not handed over in a lump sum. Students plan milestones upfront and draw down funds step by step, building real financial discipline.',
                gradient: 'from-purple-500 to-violet-500',
              },
            ].map((item, i) => (
              <AnimateIn key={item.title} delay={i * 150} animation="fade-up">
                <div className="relative rounded-2xl p-8 bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 h-full group overflow-hidden">
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-500 leading-relaxed">{item.description}</p>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ UK FOCUSED ═══ */}
      <section className="py-24 sm:py-32 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimateIn>
            <div className="inline-flex items-center gap-2 text-emerald-600 text-sm font-semibold mb-4">
              <Globe className="h-4 w-4" />
              LAUNCHING IN THE UK
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">UK-focused, for now</h2>
          </AnimateIn>
          <AnimateIn delay={100}>
            <p className="text-lg text-gray-500 mb-4 leading-relaxed max-w-2xl mx-auto">
              We are launching in the UK with schools across England, Scotland, Wales, and Northern Ireland. Our platform supports GBP and is designed around the UK education system. International expansion is on our roadmap for the future.
            </p>
          </AnimateIn>
          <AnimateIn delay={200}>
            <p className="text-lg text-gray-500 leading-relaxed max-w-2xl mx-auto mb-10">
              If you are a school, teacher, or organisation interested in partnering with us, we would love to hear from you.
            </p>
          </AnimateIn>
          <AnimateIn delay={300}>
            <Link href="/contact">
              <Button variant="outline" size="lg" className="hover:-translate-y-0.5 transition-all duration-300" asChild>
                Get in touch
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </AnimateIn>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="relative py-24 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700" />
        <div className="absolute top-10 left-10 w-64 h-64 bg-white/5 rounded-full blur-2xl" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-white/5 rounded-full blur-2xl" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimateIn>
            <div className="inline-flex items-center gap-2 text-white/80 text-sm font-semibold mb-6">
              <Users className="h-4 w-4" />
              JOIN THE MOVEMENT
            </div>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-6 leading-tight">
              Help young people turn their ideas into reality
            </h2>
          </AnimateIn>
          <AnimateIn delay={100}>
            <p className="text-xl text-emerald-100 mb-10 font-light">
              Sign up as a student, teacher, parent, or backer today.
            </p>
          </AnimateIn>
          <AnimateIn delay={200}>
            <Link href="/signup">
              <Button size="lg" className="bg-white text-emerald-600 hover:bg-emerald-50 font-bold text-lg px-8 py-4 shadow-xl hover:-translate-y-0.5 transition-all duration-300" asChild>
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </AnimateIn>
        </div>
      </section>
    </div>
  );
}
