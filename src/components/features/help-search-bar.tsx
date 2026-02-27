'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { searchArticles } from '@/lib/help/search';
import type { HelpArticle } from '@/lib/help/articles';

export function HelpSearchBar({ large = false }: { large?: boolean }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<HelpArticle[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const router = useRouter();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = (value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!value.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    debounceRef.current = setTimeout(() => {
      const results = searchArticles(value).slice(0, 5);
      setSuggestions(results);
      setShowSuggestions(results.length > 0);
    }, 300);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setShowSuggestions(false);
      router.push(`/help/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Search className={`absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 ${large ? 'h-5 w-5' : 'h-4 w-4'}`} />
          <input
            type="search"
            value={query}
            onChange={(e) => handleChange(e.target.value)}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            placeholder="Search for help..."
            className={`w-full border border-gray-300 bg-white outline-none transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-100 ${
              large ? 'pl-12 pr-4 py-4 text-lg rounded-2xl' : 'pl-10 pr-4 py-2.5 text-sm rounded-xl'
            }`}
          />
        </div>
      </form>

      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-gray-200 shadow-lg z-50 overflow-hidden animate-fade-in-up">
          {suggestions.map((article) => (
            <Link
              key={article.id}
              href={`/help/${article.category}/${article.slug}`}
              onClick={() => setShowSuggestions(false)}
              className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{article.title}</p>
                <p className="text-xs text-gray-500 truncate">{article.summary}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400 shrink-0 ml-3" />
            </Link>
          ))}
          <Link
            href={`/help/search?q=${encodeURIComponent(query.trim())}`}
            onClick={() => setShowSuggestions(false)}
            className="block px-4 py-3 text-sm text-blue-600 font-medium hover:bg-blue-50 transition-colors text-center"
          >
            See all results for &ldquo;{query.trim()}&rdquo;
          </Link>
        </div>
      )}
    </div>
  );
}
