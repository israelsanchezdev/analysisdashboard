import { useState, useCallback } from 'react';

export interface NewsItem {
  id: string;
  title: string;
  url: string;
  source: string;
  publishedAt: string;
}

function rss2jsonUrl(query: string) {
  const googleRss = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-US&gl=US&ceid=US:en`;
  return `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(googleRss)}&count=8`;
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
      const res = await globalThis.fetch(rss2jsonUrl(companyName));
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      if (data.status !== 'ok') throw new Error('Feed error');
      const mapped: NewsItem[] = (data.items ?? []).map((item: {
        guid?: string; title?: string; link?: string;
        author?: string; pubDate?: string;
      }) => ({
        id: item.guid ?? item.link ?? Math.random().toString(),
        title: item.title ?? '',
        url: item.link ?? '',
        source: item.author ?? 'Google News',
        publishedAt: item.pubDate ?? '',
      }));
      setItems(mapped);
      setFetched(true);
    } catch {
      setError('Could not load news');
    } finally {
      setLoading(false);
    }
  }, [companyName]);

  return { items, loading, error, fetched, fetch };
}
