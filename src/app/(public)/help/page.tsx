import { HelpCircle, Sparkles } from 'lucide-react';
import { AnimateIn } from '@/components/ui/animate-in';
import { HelpSearchBar } from '@/components/features/help-search-bar';
import { HelpCategoryCard } from '@/components/features/help-category-card';
import { HelpArticleCard } from '@/components/features/help-article-card';
import { HelpContactCta } from '@/components/features/help-contact-cta';
import { helpCategories } from '@/lib/help/categories';
import { getPopularArticles } from '@/lib/help/search';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Help Centre — Futurepreneurs',
  description: 'Find answers to your questions about using Futurepreneurs. Guides for students, teachers, parents, and supporters.',
};

export default function HelpCentrePage() {
  const popularArticles = getPopularArticles();

  return (
    <div className="overflow-hidden">
      {/* ═══ HERO ═══ */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-emerald-50 py-20 sm:py-28 overflow-hidden">
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-10 right-20 w-80 h-80 bg-emerald-200/20 rounded-full blur-3xl animate-float-slower" />

        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimateIn animation="fade-in">
            <div className="inline-flex items-center gap-2 bg-blue-100/80 text-blue-700 rounded-full px-5 py-2 text-sm font-semibold mb-6">
              <HelpCircle className="h-4 w-4" />
              Help Centre
            </div>
          </AnimateIn>
          <AnimateIn animation="fade-up" delay={100}>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6 leading-tight tracking-tight">
              How can we help?
            </h1>
          </AnimateIn>
          <AnimateIn animation="fade-up" delay={200}>
            <p className="text-lg text-gray-600 mb-8">
              Search for answers or browse our help topics below.
            </p>
          </AnimateIn>
          <AnimateIn animation="fade-up" delay={300}>
            <div className="max-w-xl mx-auto">
              <HelpSearchBar large />
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* ═══ POPULAR ARTICLES ═══ */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateIn animation="fade-up">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-500" />
              Popular Topics
            </h2>
          </AnimateIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {popularArticles.map((article, i) => (
              <AnimateIn key={article.id} animation="fade-up" delay={50 + i * 50}>
                <HelpArticleCard article={article} />
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ ALL CATEGORIES ═══ */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateIn animation="fade-up">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Browse by Topic</h2>
            <p className="text-gray-500 text-center mb-10">Find answers organised by category.</p>
          </AnimateIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {helpCategories.map((category, i) => (
              <AnimateIn key={category.id} animation="fade-up" delay={50 + i * 40}>
                <HelpCategoryCard category={category} />
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CONTACT CTA ═══ */}
      <section className="py-16 bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateIn animation="fade-up">
            <HelpContactCta />
          </AnimateIn>
        </div>
      </section>
    </div>
  );
}
