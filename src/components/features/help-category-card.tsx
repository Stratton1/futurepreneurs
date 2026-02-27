import Link from 'next/link';
import type { HelpCategory } from '@/lib/help/categories';
import { getArticlesByCategory } from '@/lib/help/articles';

const colorMap: Record<string, { bg: string; text: string; border: string }> = {
  emerald: { bg: 'bg-emerald-100', text: 'text-emerald-600', border: 'hover:border-emerald-200' },
  blue: { bg: 'bg-blue-100', text: 'text-blue-600', border: 'hover:border-blue-200' },
  purple: { bg: 'bg-purple-100', text: 'text-purple-600', border: 'hover:border-purple-200' },
  amber: { bg: 'bg-amber-100', text: 'text-amber-600', border: 'hover:border-amber-200' },
  indigo: { bg: 'bg-indigo-100', text: 'text-indigo-600', border: 'hover:border-indigo-200' },
  rose: { bg: 'bg-rose-100', text: 'text-rose-600', border: 'hover:border-rose-200' },
  red: { bg: 'bg-red-100', text: 'text-red-600', border: 'hover:border-red-200' },
  teal: { bg: 'bg-teal-100', text: 'text-teal-600', border: 'hover:border-teal-200' },
  orange: { bg: 'bg-orange-100', text: 'text-orange-600', border: 'hover:border-orange-200' },
  pink: { bg: 'bg-pink-100', text: 'text-pink-600', border: 'hover:border-pink-200' },
  gray: { bg: 'bg-gray-100', text: 'text-gray-600', border: 'hover:border-gray-300' },
};

export function HelpCategoryCard({ category }: { category: HelpCategory }) {
  const colors = colorMap[category.color] || colorMap.blue;
  const Icon = category.icon;
  const articleCount = getArticlesByCategory(category.slug).length;

  return (
    <Link href={`/help/${category.slug}`}>
      <div className={`bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 ${colors.border} h-full`}>
        <div className={`inline-flex items-center justify-center w-12 h-12 ${colors.bg} rounded-xl mb-4`}>
          <Icon className={`h-6 w-6 ${colors.text}`} />
        </div>
        <h3 className="text-base font-bold text-gray-900 mb-1">{category.title}</h3>
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">{category.description}</p>
        <p className="text-xs text-gray-400">{articleCount} article{articleCount !== 1 ? 's' : ''}</p>
      </div>
    </Link>
  );
}
