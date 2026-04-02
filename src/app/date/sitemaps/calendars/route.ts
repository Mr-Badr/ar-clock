/**
 * /date/sitemaps/calendars/route.ts
 * Yearly calendars (Gregorian and Hijri).
 */
import { getSiteUrl } from '@/lib/site-config';

const BASE = getSiteUrl();

export async function GET() {
  const currentYear = new Date().getUTCFullYear();
  const currentHijriYear = 1446; // Base year for safety, can be dynamic but sitemap index doesn't need high precision

  const entries: string[] = [];
  const todayIso = new Date().toISOString().split('T')[0];

  // Gregorian calendars (±10 years)
  for (let y = currentYear - 10; y <= currentYear + 10; y++) {
    entries.push(`
  <url>
    <loc>${BASE}/date/calendar/${y}</loc>
    <lastmod>${todayIso}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`);
  }

  // Hijri calendars (±10 years)
  for (let y = currentHijriYear - 10; y <= currentHijriYear + 10; y++) {
    entries.push(`
  <url>
    <loc>${BASE}/date/calendar/hijri/${y}</loc>
    <lastmod>${todayIso}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`);
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
