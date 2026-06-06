/**
 * /date/sitemaps/calendars/route.ts
 * Yearly calendars (Gregorian and Hijri).
 */
import {
  getGregorianCalendarSeoBounds,
  getHijriCalendarSeoBounds,
} from '@/lib/seo/date-indexing';
import { getSiteUrl } from '@/lib/site-config';
import { getSitemapLastModifiedDate } from '@/lib/sitemap';

export async function GET() {
  const base = getSiteUrl();
  const { minYear: gregorianMinYear, maxYear: gregorianMaxYear } = getGregorianCalendarSeoBounds();
  const { minYear: hijriMinYear, maxYear: hijriMaxYear } = getHijriCalendarSeoBounds();

  const entries: string[] = [];
  const lastmod = getSitemapLastModifiedDate();

  // Gregorian calendars within the approved indexable range.
  for (let y = gregorianMinYear; y <= gregorianMaxYear; y++) {
    entries.push(`
  <url>
    <loc>${base}/date/calendar/${y}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`);
  }

  // Hijri calendars within the approved indexable range.
  for (let y = hijriMinYear; y <= hijriMaxYear; y++) {
    entries.push(`
  <url>
    <loc>${base}/date/calendar/hijri/${y}</loc>
    <lastmod>${lastmod}</lastmod>
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
