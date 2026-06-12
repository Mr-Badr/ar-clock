/**
 * /date/sitemaps/calendars/route.ts
 * Yearly calendars (Gregorian and Hijri).
 */
import {
  getCurrentHijriSeoYear,
  getGregorianCalendarSeoBoundsForYear,
  getHijriCalendarSeoBoundsForYear,
} from '@/lib/seo/date-indexing';
import { getSiteUrl } from '@/lib/site-config';

export async function GET() {
  const base = getSiteUrl();
  const now = new Date();
  const { minYear: gregorianMinYear, maxYear: gregorianMaxYear } =
    getGregorianCalendarSeoBoundsForYear(now.getUTCFullYear());
  const { minYear: hijriMinYear, maxYear: hijriMaxYear } =
    getHijriCalendarSeoBoundsForYear(getCurrentHijriSeoYear(now));

  const entries: string[] = [];

  for (let y = gregorianMinYear; y <= gregorianMaxYear; y++) {
    entries.push(`
  <url>
    <loc>${base}/date/calendar/${y}</loc>
  </url>`);
  }

  for (let y = hijriMinYear; y <= hijriMaxYear; y++) {
    entries.push(`
  <url>
    <loc>${base}/date/calendar/hijri/${y}</loc>
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
