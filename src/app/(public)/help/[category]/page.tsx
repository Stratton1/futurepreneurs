import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { AnimateIn } from '@/components/ui/animate-in';
import { HelpArticleCard } from '@/components/features/help-article-card';
import { HelpContactCta } from '@/components/features/help-contact-cta';
import { HelpSearchBar } from '@/components/features/help-search-bar';
import { getCategoryBySlug, helpCategories } from '@/lib/help/categories';
import { getArticlesByCategory } from '@/lib/help/articles';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) return { title: 'Help Centre — Futurepreneurs' };
  return {
    title: `${category.title} — Help Centre — Futurepreneurs`,
    description: category.description,
  };
}

export default async function HelpCategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const articles = getArticlesByCategory(slug);
  const Icon = category.icon;

  return (
    <div className="overflow-hidden">
      {/* ═══ HEADER ═══ */}
      <section className="bg-gradient-to-br from-gray-50 to-white py-12 sm:py-16 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateIn animation="fade-up">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
              <Link href="/help" className="hover:text-blue-600 transition-colors">Help Centre</Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <span className="text-gray-900 font-medium">{category.title}</span>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-100 rounded-xl p-2.5">
                <Icon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{category.title}</h1>
                <p className="text-gray-600 text-sm mt-1">{category.description}</p>
              </div>
            </div>
          </AnimateIn>
          <AnimateIn animation="fade-up" delay={100}>
            <div className="max-w-md mt-4">
              <HelpSearchBar />
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* ═══ ARTICLES ═══ */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_240px]">
            <div className="space-y-3">
              <p className="text-sm text-gray-500 mb-2">{articles.length} article{articles.length !== 1 ? 's' : ''}</p>
              {articles.map((article, i) => (
                <AnimateIn key={article.id} animation="fade-up" delay={50 + i * 40}>
                  <HelpArticleCard article={article} />
                </AnimateIn>
              ))}
              {articles.length === 0 && (
                <div className="bg-gray-50 rounded-xl p-8 text-center text-gray-500">
                  No articles in this category yet. Check back soon!
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="hidden lg:block">
              <div className="sticky top-24 space-y-2">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">All Topics</p>
                {helpCategories.map((c) => (
                  <Link
                    key={c.id}
                    href={`/help/${c.slug}`}
                    className={`block text-sm rounded-lg px-3 py-2 transition-colors ${
                      c.slug === slug
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    {c.title}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <HelpContactCta />
        </div>
      </section>
    </div>
  );
}
