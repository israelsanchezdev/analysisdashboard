import { useState, useCallback } from 'react';

export interface NewsItem {
  id: string;
  title: string;
  url: string;
  source: string;
  publishedAt: string;
}

const GOOGLE_NEWS_RSS = (q: string) =>
  `https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=en-US&gl=US&ceid=US:en`;

function getText(item: Element, tag: string) {
  return item.getElementsByTagName(tag)[0]?.textContent?.trim() ?? '';
}

function parseRSS(xmlStr: string): NewsItem[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlStr, 'text/xml');
  const items = Array.from(doc.getElementsByTagName('item'));
  return items.slice(0, 8).map((item) => ({
    id: getText(item, 'guid') || getText(item, 'link') || Math.random().toString(),
    title: getText(item, 'title'),
    url: getText(item, 'link'),
    source: item.getElementsByTagName('source')[0]?.textContent?.trim() ?? 'Google News',
    publishedAt: getText(item, 'pubDate'),
  })).filter((i) => i.title);
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
      const rssUrl = GOOGLE_NEWS_RSS(companyName);
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(rssUrl)}`;
      const res = await globalThis.fetch(proxyUrl);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (!json.contents) throw new Error('Empty response');
      const parsed = parseRSS(json.contents);
      setItems(parsed);
      setFetched(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load news');
    } finally {
      setLoading(false);
    }
  }, [companyName]);

  return { items, loading, error, fetched, fetch };
}
