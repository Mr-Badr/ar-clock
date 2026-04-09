/**
 * /date/gregorian/sitemap.xml — Gregorian daily date pages
 * Lists the current Gregorian year ±1 for crawlable daily date pages.
 */
import { getSiteUrl } from '@/lib/site-config';

const BASE = getSiteUrl();

function daysInMonth(year: number, month: number) {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

export async function GET() {
  const currentYear = new Date().getUTCFullYear();
  const urls: string[] = [];

  for (let year = currentYear - 1; year <= currentYear + 1; year++) {
    for (let month = 1; month <= 12; month++) {
      const maxDay = daysInMonth(year, month);
      for (let day = 1; day <= maxDay; day++) {
        urls.push(
          `${BASE}/date/${year}/${String(month).padStart(2, '0')}/${String(day).padStart(2, '0')}`
        );
      }
    }
  }

  const entries = urls.map(
    (url) => `
  <url>
    <loc>${url}</loc>
    <changefreq>yearly</changefreq>
    <priority>0.5</priority>
  </url>`
  ).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 's-maxage=86400, stale-while-revalidate=86400',
    },
  });
}
