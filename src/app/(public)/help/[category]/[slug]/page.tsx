import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { AnimateIn } from '@/components/ui/animate-in';
import { HelpArticleCard } from '@/components/features/help-article-card';
import { HelpFeedback } from '@/components/features/help-feedback';
import { HelpContactCta } from '@/components/features/help-contact-cta';
import { getCategoryBySlug } from '@/lib/help/categories';
import { getArticleBySlug, getRelatedArticles } from '@/lib/help/articles';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ category: string; slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return { title: 'Help Centre — Futurepreneurs' };
  return {
    title: `${article.title} — Help Centre — Futurepreneurs`,
    description: article.summary,
  };
}

function renderMarkdown(content: string) {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let currentList: string[] = [];
  let currentTable: string[][] = [];
  let inTable = false;

  const flushList = () => {
    if (currentList.length > 0) {
      elements.push(
        <ul key={`list-${elements.length}`} className="space-y-1.5 my-3">
          {currentList.map((item, i) => (
            <li key={i} className="text-gray-600 text-sm leading-relaxed flex items-start gap-2">
              <span className="text-gray-300 mt-1.5 shrink-0">&bull;</span>
              <span dangerouslySetInnerHTML={{ __html: inlineMd(item) }} />
            </li>
          ))}
        </ul>
      );
      currentList = [];
    }
  };

  const flushTable = () => {
    if (currentTable.length > 1) {
      const [header, ...rows] = currentTable;
      elements.push(
        <div key={`table-${elements.length}`} className="my-4 bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                {header.map((cell, i) => (
                  <th key={i} className="p-3 text-left text-gray-600 font-medium">{cell.trim()}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="border-b border-gray-100 last:border-0">
                  {row.map((cell, j) => (
                    <td key={j} className="p-3 text-gray-700">{cell.trim()}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      currentTable = [];
      inTable = false;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Table row
    if (line.startsWith('|') && line.endsWith('|')) {
      flushList();
      // Skip separator rows like |---|---|
      if (/^\|[\s-|]+\|$/.test(line)) continue;
      const cells = line.split('|').filter(Boolean);
      currentTable.push(cells);
      inTable = true;
      continue;
    } else if (inTable) {
      flushTable();
    }

    // List item
    if (line.startsWith('- ')) {
      currentList.push(line.slice(2));
      continue;
    } else {
      flushList();
    }

    // Numbered list
    if (/^\d+\.\s/.test(line)) {
      const text = line.replace(/^\d+\.\s/, '');
      elements.push(
        <div key={`ol-${i}`} className="flex items-start gap-3 my-1.5">
          <span className="bg-gray-100 text-gray-500 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
            {line.match(/^\d+/)?.[0]}
          </span>
          <span className="text-gray-600 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: inlineMd(text) }} />
        </div>
      );
      continue;
    }

    // Heading
    if (line.startsWith('**') && line.endsWith('**')) {
      elements.push(
        <h3 key={`h-${i}`} className="text-base font-bold text-gray-900 mt-6 mb-2">
          {line.replace(/\*\*/g, '')}
        </h3>
      );
      continue;
    }

    // Empty line
    if (!line.trim()) {
      continue;
    }

    // Regular paragraph
    elements.push(
      <p key={`p-${i}`} className="text-gray-600 text-sm leading-relaxed my-2" dangerouslySetInnerHTML={{ __html: inlineMd(line) }} />
    );
  }

  flushList();
  flushTable();

  return elements;
}

function inlineMd(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-gray-900 font-semibold">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>');
}

export default async function HelpArticlePage({ params }: { params: Promise<{ category: string; slug: string }> }) {
  const { category: categorySlug, slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article || article.category !== categorySlug) notFound();

  const category = getCategoryBySlug(categorySlug);
  if (!category) notFound();

  const related = getRelatedArticles(article);

  return (
    <div className="overflow-hidden">
      {/* ═══ HEADER ═══ */}
      <section className="bg-gradient-to-br from-gray-50 to-white py-10 sm:py-14 border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateIn animation="fade-up">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4 flex-wrap">
              <Link href="/help" className="hover:text-blue-600 transition-colors">Help Centre</Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <Link href={`/help/${category.slug}`} className="hover:text-blue-600 transition-colors">{category.title}</Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <span className="text-gray-900 font-medium">{article.title}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{article.title}</h1>
            <p className="text-gray-600">{article.summary}</p>
          </AnimateIn>
        </div>
      </section>

      {/* ═══ CONTENT ═══ */}
      <section className="py-10 sm:py-14 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateIn animation="fade-up" delay={100}>
            <div className="prose-sm max-w-none">
              {renderMarkdown(article.content)}
            </div>
          </AnimateIn>

          {/* ═══ FEEDBACK ═══ */}
          <AnimateIn animation="fade-up" delay={200}>
            <div className="mt-10">
              <HelpFeedback articleId={article.id} />
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* ═══ RELATED ═══ */}
      {related.length > 0 && (
        <section className="py-10 bg-gray-50 border-t border-gray-100">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimateIn animation="fade-up">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Related Articles</h2>
            </AnimateIn>
            <div className="space-y-3">
              {related.map((a, i) => (
                <AnimateIn key={a.id} animation="fade-up" delay={50 + i * 40}>
                  <HelpArticleCard article={a} />
                </AnimateIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ CTA ═══ */}
      <section className="py-12 bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <HelpContactCta />
        </div>
      </section>
    </div>
  );
}
