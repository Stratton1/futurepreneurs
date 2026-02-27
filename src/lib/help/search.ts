import { helpArticles, type HelpArticle } from './articles';

interface SearchResult {
  article: HelpArticle;
  score: number;
}

export function searchArticles(query: string, role?: string): HelpArticle[] {
  if (!query.trim()) return [];

  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);

  const results: SearchResult[] = helpArticles
    .filter((article) => {
      if (!role || role === 'all') return true;
      return article.roles.includes('all') || article.roles.includes(role as HelpArticle['roles'][number]);
    })
    .map((article) => {
      let score = 0;
      const titleLower = article.title.toLowerCase();
      const summaryLower = article.summary.toLowerCase();
      const tagsLower = article.tags.map((t) => t.toLowerCase());

      for (const term of terms) {
        // Title matches (highest weight)
        if (titleLower.includes(term)) score += 10;
        if (titleLower.startsWith(term)) score += 5;

        // Tag matches (high weight)
        if (tagsLower.some((t) => t.includes(term))) score += 8;
        if (tagsLower.some((t) => t === term)) score += 4;

        // Summary matches (medium weight)
        if (summaryLower.includes(term)) score += 4;

        // Content matches (lower weight)
        if (article.content.toLowerCase().includes(term)) score += 2;
      }

      return { article, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score);

  return results.map((r) => r.article);
}

export function getPopularArticles(): HelpArticle[] {
  const popularIds = ['gs-1', 'pj-1', 'fp-1', 'ds-1', 'wc-1', 'st-1'];
  return popularIds
    .map((id) => helpArticles.find((a) => a.id === id))
    .filter((a): a is HelpArticle => !!a);
}
