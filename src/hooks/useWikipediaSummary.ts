/** Try to get a Wikipedia summary for a company name. Returns null on failure. */
export async function fetchWikipediaSummary(
  companyName: string
): Promise<{ description: string } | null> {
  try {
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(companyName)}`
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (data.type === 'disambiguation') return null;
    const extract = data.extract ?? '';
    return { description: extract.split('.').slice(0, 2).join('.') + '.' };
  } catch {
    return null;
  }
}
