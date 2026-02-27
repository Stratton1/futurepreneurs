'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
import { Search, ChevronRight, BookOpen } from 'lucide-react';
import { AnimateIn } from '@/components/ui/animate-in';
import { HelpSearchBar } from '@/components/features/help-search-bar';
import { HelpArticleCard } from '@/components/features/help-article-card';
import { HelpContactCta } from '@/components/features/help-contact-cta';
import { searchArticles, getPopularArticles } from '@/lib/help/search';

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const results = query ? searchArticles(query) : [];
  const popular = getPopularArticles();

  return (
    <div className="overflow-hidden">
      {/* ═══ HEADER ═══ */}
      <section className="bg-gradient-to-br from-gray-50 to-white py-10 sm:py-14 border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateIn animation="fade-up">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
              <Link href="/help" className="hover:text-blue-600 transition-colors">Help Centre</Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <span className="text-gray-900 font-medium">Search Results</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              {query ? (
                <>Results for &ldquo;{query}&rdquo;</>
              ) : (
                'Search Help Centre'
              )}
            </h1>
            <div className="max-w-xl">
              <HelpSearchBar />
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* ═══ RESULTS ═══ */}
      <section className="py-10 sm:py-14 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {query && results.length > 0 && (
            <>
              <AnimateIn animation="fade-up">
                <p className="text-sm text-gray-500 mb-6">
                  {results.length} {results.length === 1 ? 'article' : 'articles'} found
                </p>
              </AnimateIn>
              <div className="space-y-3">
                {results.map((article, i) => (
                  <AnimateIn key={article.id} animation="fade-up" delay={50 + i * 40}>
                    <HelpArticleCard article={article} />
                  </AnimateIn>
                ))}
              </div>
            </>
          )}

          {query && results.length === 0 && (
            <AnimateIn animation="fade-up">
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                  <Search className="h-7 w-7 text-gray-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">No results found</h2>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  We couldn&apos;t find any articles matching &ldquo;{query}&rdquo;. Try different keywords or browse our popular topics below.
                </p>
              </div>
            </AnimateIn>
          )}

          {/* ═══ POPULAR TOPICS (shown when no query or no results) ═══ */}
          {(!query || results.length === 0) && (
            <div className={query ? '' : 'mt-2'}>
              <AnimateIn animation="fade-up" delay={100}>
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  <h2 className="text-lg font-bold text-gray-900">Popular Articles</h2>
                </div>
              </AnimateIn>
              <div className="space-y-3">
                {popular.map((article, i) => (
                  <AnimateIn key={article.id} animation="fade-up" delay={150 + i * 40}>
                    <HelpArticleCard article={article} />
                  </AnimateIn>
                ))}
              </div>
            </div>
          )}
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

export default function HelpSearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    }>
      <SearchResults />
    </Suspense>
  );
}
