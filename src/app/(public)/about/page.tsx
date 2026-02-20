import { Rocket, Shield, GraduationCap, Heart, Lightbulb, Target } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About — Futurepreneurs',
  description: 'Futurepreneurs is a crowdfunding platform built specifically for young entrepreneurs under 18. Safe, teacher-verified, parent-approved.',
};

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-emerald-50 via-white to-amber-50 py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <Rocket className="h-4 w-4" />
            Our story
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Every young person deserves a chance to build something
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Futurepreneurs exists because we believe the next generation of business leaders should not have to wait until they are 18 to get started. With the right support, young people can turn their ideas into reality — safely, responsibly, and with the guidance of the adults around them.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                We are building the first crowdfunding platform designed specifically for young people under 18. Existing platforms were not built for minors — they lack the safety features, oversight, and trust that parents and teachers need.
              </p>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Futurepreneurs changes that. Every project on our platform is verified by a teacher, approved by a parent, and funded by the public. When the money comes in, it is released in stages through a milestone system — so young entrepreneurs learn financial responsibility from day one.
              </p>
              <p className="text-gray-600 leading-relaxed">
                We want every school in the UK to have students who are not just learning about business — they are doing it.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Shield, label: 'Safety first', color: 'bg-blue-50 text-blue-600' },
                { icon: GraduationCap, label: 'School-verified', color: 'bg-emerald-50 text-emerald-600' },
                { icon: Heart, label: 'Parent-approved', color: 'bg-amber-50 text-amber-600' },
                { icon: Target, label: 'Milestone-based', color: 'bg-purple-50 text-purple-600' },
                { icon: Lightbulb, label: 'Real learning', color: 'bg-orange-50 text-orange-600' },
                { icon: Rocket, label: 'Big dreams', color: 'bg-pink-50 text-pink-600' },
              ].map((item) => (
                <div key={item.label} className="bg-gray-50 rounded-xl p-4 text-center">
                  <div className={`w-10 h-10 rounded-lg ${item.color} flex items-center justify-center mx-auto mb-2`}>
                    <item.icon className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How we are different */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">What makes us different</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-2">Built for under-18s</h3>
              <p className="text-sm text-gray-600">
                This is not a regular crowdfunding site. Every feature has been designed with young people in mind — from school email sign-up to parent consent flows.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-2">Teacher as trust anchor</h3>
              <p className="text-sm text-gray-600">
                A real teacher at the student&apos;s school verifies every project and approves every fund release. This is not just moderation — it is mentorship.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-2">Milestone-based spending</h3>
              <p className="text-sm text-gray-600">
                Funds are not handed over in a lump sum. Students plan milestones upfront and draw down funds step by step, building real financial discipline.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* UK focused */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">UK-focused, for now</h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            We are launching in the UK with schools across England, Scotland, Wales, and Northern Ireland. Our platform supports GBP and is designed around the UK education system. International expansion is on our roadmap for the future.
          </p>
          <p className="text-gray-600 leading-relaxed">
            If you are a school, teacher, or organisation interested in partnering with us, we would love to hear from you.
          </p>
          <div className="mt-8">
            <Link href="/contact">
              <Button variant="outline" size="lg">Get in touch</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-emerald-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Join the movement</h2>
          <p className="text-emerald-100 mb-8">
            Help young people turn their ideas into reality. Sign up as a student, teacher, parent, or backer today.
          </p>
          <Link href="/signup">
            <Button size="lg" className="bg-white text-emerald-600 hover:bg-emerald-50 font-bold">
              Get Started
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
