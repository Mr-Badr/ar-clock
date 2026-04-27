/**
 * /date/sitemaps/calendars/route.ts
 * Yearly calendars (Gregorian and Hijri).
 */
import { convertDate } from '@/lib/date-adapter';
import { getSiteUrl } from '@/lib/site-config';
import { getSitemapLastModifiedDate } from '@/lib/sitemap';

const BASE = getSiteUrl();

function getCurrentHijriYear() {
  const now = new Date();
  const isoDate = [
    String(now.getUTCFullYear()),
    String(now.getUTCMonth() + 1).padStart(2, '0'),
    String(now.getUTCDate()).padStart(2, '0'),
  ].join('-');

  try {
    return convertDate({ date: isoDate, toCalendar: 'hijri', method: 'umalqura' }).year;
  } catch {
    return 1447;
  }
}

export async function GET() {
  const currentYear = new Date().getUTCFullYear();
  const currentHijriYear = getCurrentHijriYear();

  const entries: string[] = [];
  const lastmod = getSitemapLastModifiedDate();

  // Gregorian calendars (±10 years)
  for (let y = currentYear - 10; y <= currentYear + 10; y++) {
    entries.push(`
  <url>
    <loc>${BASE}/date/calendar/${y}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`);
  }

  // Hijri calendars (±10 years)
  for (let y = currentHijriYear - 10; y <= currentHijriYear + 10; y++) {
    entries.push(`
  <url>
    <loc>${BASE}/date/calendar/hijri/${y}</loc>
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
