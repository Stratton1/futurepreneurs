'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { PROJECT_CATEGORIES } from '@/lib/constants';

interface ProjectFiltersProps {
  categoryCounts?: Record<string, number>;
}

export function ProjectFilters({ categoryCounts }: ProjectFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get('category') || 'all';
  const activeSort = searchParams.get('sort') || 'newest';

  const setParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'all' || value === 'newest') {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    params.delete('page');
    router.push(`/projects?${params.toString()}`);
  };

  return (
    <div className="space-y-4">
      {/* Category pills */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setParam('category', 'all')}
          className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ${
            activeCategory === 'all'
              ? 'bg-emerald-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          All projects
        </button>
        {PROJECT_CATEGORIES.map((cat) => {
          const count = categoryCounts?.[cat] || 0;
          return (
            <button
              key={cat}
              onClick={() => setParam('category', cat)}
              className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Sort dropdown */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">Sort by:</span>
        <select
          value={activeSort}
          onChange={(e) => setParam('sort', e.target.value)}
          className="text-sm bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="newest">Newest first</option>
          <option value="most_funded">Most funded</option>
          <option value="closest_to_goal">Closest to goal</option>
        </select>
      </div>
    </div>
  );
}
