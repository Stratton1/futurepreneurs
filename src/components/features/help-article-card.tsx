import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { HelpArticle } from '@/lib/help/articles';

export function HelpArticleCard({ article }: { article: HelpArticle }) {
  return (
    <Link href={`/help/${article.category}/${article.slug}`}>
      <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-sm hover:border-blue-200 hover:-translate-y-0.5 transition-all duration-300 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">{article.title}</h3>
          <p className="text-xs text-gray-500 line-clamp-2">{article.summary}</p>
          <span className="inline-flex mt-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
            {article.category.replace(/-/g, ' ')}
          </span>
        </div>
        <ArrowRight className="h-4 w-4 text-gray-400 shrink-0 mt-1" />
      </div>
    </Link>
  );
}
