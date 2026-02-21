import Link from 'next/link';
import { BookOpen, ArrowRight } from 'lucide-react';
import { LEARNING_MODULES } from '@/lib/learning-modules';
import { LearningModuleCard } from '@/components/features/learning-module-card';
import { getCurrentUser } from '@/lib/supabase/auth-helpers';
import { getModuleCompletionCounts } from '@/lib/queries/learning';

export const metadata = {
  title: 'Learn — Futurepreneurs',
  description: 'Free guides and tutorials to help young entrepreneurs build business skills.',
};

export default async function LearnPage() {
  const user = await getCurrentUser();
  let completionCounts: Record<string, number> = {};

  if (user) {
    completionCounts = await getModuleCompletionCounts(user.id);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-4">
          <BookOpen className="h-8 w-8 text-emerald-700" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Learning Hub</h1>
        <p className="text-gray-600 mt-2 max-w-xl mx-auto">
          Free bite-sized guides to help you plan, pitch, market, and manage your business project. Learn at your own pace!
        </p>
        {!user && (
          <p className="text-sm text-gray-500 mt-3">
            <Link href="/signup" className="text-emerald-600 hover:text-emerald-700 font-medium">
              Sign up
            </Link>
            {' '}to track your progress and earn the Scholar badge.
          </p>
        )}
      </div>

      {/* Module grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {LEARNING_MODULES.map((mod) => (
          <LearningModuleCard
            key={mod.id}
            module={mod}
            completedCount={completionCounts[mod.id] ?? 0}
          />
        ))}
      </div>

      {/* CTA */}
      <div className="mt-10 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-2xl p-8 text-center">
        <h2 className="text-xl font-bold text-gray-900">Ready to start your project?</h2>
        <p className="text-gray-600 mt-2">
          Put your knowledge into practice — create your first campaign on Futurepreneurs.
        </p>
        <Link
          href={user ? '/dashboard/projects/new' : '/signup'}
          className="inline-flex items-center gap-2 mt-4 bg-emerald-600 text-white font-medium px-6 py-2.5 rounded-xl hover:bg-emerald-700 transition-colors"
        >
          {user ? 'Create a Project' : 'Get Started'}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
