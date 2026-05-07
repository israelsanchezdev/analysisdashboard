import { useState, useCallback } from 'react';

export interface NewsItem {
  id: string;
  title: string;
  url: string;
  source: string;
  publishedAt: string;
}

const GOOGLE_NEWS_RSS = (q: string) =>
  `https://news.google.com/rss/search?q=${encodeURIComponent(
    q
  )}&hl=en-US&gl=US&ceid=US:en`;

export function useCompanyNews(companyName: string) {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fetched, setFetched] = useState(false);

  const fetchNews = useCallback(async () => {
    if (!companyName.trim()) return;

    setLoading(true);
    setError('');

    try {
      const rssUrl = GOOGLE_NEWS_RSS(companyName);

      // ✅ Working CORS-safe RSS proxy
      const proxyUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(
        rssUrl
      )}`;

      const res = await fetch(proxyUrl);

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const json = await res.json();

      if (!json.items || !Array.isArray(json.items)) {
        throw new Error('No news items returned');
      }

      const parsed: NewsItem[] = json.items.slice(0, 8).map((item: any) => ({
        id: item.guid || item.link || Math.random().toString(),
        title: item.title,
        url: item.link,
        source: item.author || 'Google News',
        publishedAt: item.pubDate,
      }));

      setItems(parsed);
      setFetched(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load news');
    } finally {
      setLoading(false);
    }
  }, [companyName]);

  return { items, loading, error, fetched, fetch: fetchNews };
}
