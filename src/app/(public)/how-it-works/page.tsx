import { Rocket, ClipboardCheck, ShieldCheck, Heart, Banknote, GraduationCap, Users, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How It Works — Futurepreneurs',
  description: 'Learn how Futurepreneurs helps young entrepreneurs under 18 create, fund, and launch their business ideas safely.',
};

export default function HowItWorksPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-emerald-50 via-white to-blue-50 py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            How Futurepreneurs Works
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            From your first idea to a funded business — here is exactly how it works, for everyone involved.
          </p>
        </div>
      </section>

      {/* For Students */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-emerald-100 p-2.5 rounded-xl">
              <Rocket className="h-6 w-6 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">For Students</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { step: '1', title: 'Sign up with your school email', desc: 'Create your account using your school email address. This is how we verify you are a real student at a real school.' },
              { step: '2', title: 'Create your project', desc: 'Tell everyone about your business idea. Add a title, description, images, your funding goal, and plan your spending milestones.' },
              { step: '3', title: 'Choose a teacher mentor', desc: 'Pick a teacher at your school to be your mentor. They will review your project and help guide you.' },
              { step: '4', title: 'Get verified and go live', desc: 'Your teacher approves your project, then your parent gives consent. Once both say yes, your project goes live for the public to see.' },
              { step: '5', title: 'Get funded by the public', desc: 'Share your project with family, friends, and the wider community. Watch the funding come in as people back your idea.' },
              { step: '6', title: 'Draw down funds as you hit milestones', desc: 'When your project is funded, request money against your milestones. Your teacher approves each drawdown. Build your business, step by step.' },
            ].map((item) => (
              <div key={item.step} className="bg-gray-50 rounded-xl p-5">
                <div className="bg-emerald-100 text-emerald-700 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold mb-3">
                  {item.step}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Teachers */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-blue-100 p-2.5 rounded-xl">
              <GraduationCap className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">For Teachers</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: ClipboardCheck, title: 'Verify projects', desc: 'Students choose you as their mentor. Review their project, check it is appropriate, and approve it to go live.' },
              { icon: Banknote, title: 'Approve spending', desc: 'When a project is funded, students request drawdowns against their milestones. You approve each request before funds are released.' },
              { icon: Users, title: 'Guide and support', desc: 'Be the trusted adult behind every project. Help students learn real business skills in a safe, structured environment.' },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-xl p-5 border border-gray-100">
                <item.icon className="h-6 w-6 text-blue-500 mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Parents */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-amber-100 p-2.5 rounded-xl">
              <ShieldCheck className="h-6 w-6 text-amber-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">For Parents</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { title: 'Give consent', desc: 'No project goes live without your approval. You review the full project before it is shown to the public.' },
              { title: 'Full visibility', desc: 'See everything — the funding progress, each milestone, and every drawdown request. Nothing is hidden.' },
              { title: 'Peace of mind', desc: 'A teacher verifies every project. Funds are released in stages, not as a lump sum. Your child learns safely.' },
            ].map((item) => (
              <div key={item.title} className="bg-amber-50 rounded-xl p-5 border border-amber-100">
                <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Backers */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-purple-100 p-2.5 rounded-xl">
              <Heart className="h-6 w-6 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">For Backers</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { title: 'Browse ideas', desc: 'Explore projects by young entrepreneurs across the UK. Filter by category, school, or search for something specific.' },
              { title: 'Back with confidence', desc: 'Every project is teacher-verified and parent-approved. All-or-nothing funding means the student only gets the money if the full goal is reached.' },
              { title: 'See the impact', desc: 'Follow the projects you back. Get updates from the student and see how your contribution is making a difference.' },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-xl p-5 border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-emerald-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to get started?</h2>
          <p className="text-emerald-100 mb-8 max-w-xl mx-auto">
            Whether you are a student with an idea, a teacher who wants to help, or someone who wants to support young entrepreneurs — there is a place for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="bg-white text-emerald-600 hover:bg-emerald-50 font-bold">
                Sign Up Now <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/projects">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-emerald-600">
                Browse Projects
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
