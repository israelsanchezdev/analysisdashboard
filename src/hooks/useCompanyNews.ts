import { useState, useCallback } from 'react';

export interface NewsItem {
  objectID: string;
  title: string;
  url: string | null;
  author: string;
  points: number;
  created_at: string;
  num_comments: number;
}

export function useCompanyNews(companyName: string) {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fetched, setFetched] = useState(false);

  const fetch = useCallback(async () => {
    if (!companyName.trim()) return;
    setLoading(true);
    setError('');
    try {
      const thirtyDaysAgo = Math.floor((Date.now() - 30 * 24 * 60 * 60 * 1000) / 1000);
      const res = await globalThis.fetch(
        `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(companyName)}&tags=story&hitsPerPage=8&numericFilters=created_at_i>${thirtyDaysAgo}`
      );
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setItems(data.hits ?? []);
      setFetched(true);
    } catch {
      setError('Could not load news');
    } finally {
      setLoading(false);
    }
  }, [companyName]);

  return { items, loading, error, fetched, fetch };
}
