/**
 * /date/gregorian/sitemap.xml — Gregorian daily date pages
 * Publish a rolling SEO window of canonical day pages so Google receives a
 * stronger crawl signal for real date-detail URLs without exploding sitemap size.
 */
import { getGregorianCalendarSeoBounds } from '@/lib/seo/date-indexing';
import { getSiteUrl } from '@/lib/site-config';
import { getSitemapLastModifiedDate } from '@/lib/sitemap';

const BASE = getSiteUrl();

function daysInMonth(year: number, month: number) {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

export async function GET() {
  const { minYear, maxYear } = getGregorianCalendarSeoBounds();
  const lastmod = getSitemapLastModifiedDate();
  const entries: string[] = [];

  for (let year = minYear; year <= maxYear; year++) {
    for (let month = 1; month <= 12; month++) {
      const days = daysInMonth(year, month);
      for (let day = 1; day <= days; day++) {
        const monthStr = String(month).padStart(2, '0');
        const dayStr = String(day).padStart(2, '0');
        entries.push(`
  <url>
    <loc>${BASE}/date/${year}/${monthStr}/${dayStr}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.55</priority>
  </url>`);
      }
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 's-maxage=86400, stale-while-revalidate=86400',
    },
  });
}
