/**
 * /date/sitemap.xml: Date feature sitemap index
 * Kept as a feature-local diagnostic index, while the root sitemap index lists
 * the date leaf sitemaps directly for simpler Search Console visibility.
 */
import { getSiteUrl } from '@/lib/site-config';
import { getSitemapLastModifiedDate } from '@/lib/sitemap';
import {
  GREGORIAN_CALENDAR_INDEXABLE_RANGE,
  HIJRI_CALENDAR_INDEXABLE_RANGE,
} from '@/lib/seo/date-indexing';

export async function GET() {
  const base = getSiteUrl();
  const lastmod = getSitemapLastModifiedDate();

  const baseSitemaps = [
    '/date/sitemaps/static',
    '/date/sitemaps/countries',
    '/date/sitemaps/calendars',
    '/date/gregorian/sitemap.xml',
    '/date/hijri/sitemap.xml',
  ];
  const gregorianYearSitemaps = Array.from(
    { length: GREGORIAN_CALENDAR_INDEXABLE_RANGE.maxYear - GREGORIAN_CALENDAR_INDEXABLE_RANGE.minYear + 1 },
    (_, index) => `/date/gregorian/sitemap/${GREGORIAN_CALENDAR_INDEXABLE_RANGE.minYear + index}`,
  );
  const hijriYearSitemaps = Array.from(
    { length: HIJRI_CALENDAR_INDEXABLE_RANGE.maxYear - HIJRI_CALENDAR_INDEXABLE_RANGE.minYear + 1 },
    (_, index) => `/date/hijri/sitemap/${HIJRI_CALENDAR_INDEXABLE_RANGE.minYear + index}`,
  );
  const sitemaps = [
    ...baseSitemaps,
    ...gregorianYearSitemaps,
    ...hijriYearSitemaps,
  ];

  const entries = sitemaps.map(
    url => `
  <sitemap>
    <loc>${base}${url}</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>`
  ).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</sitemapindex>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 's-maxage=86400, stale-while-revalidate=86400',
    },
  });
}
