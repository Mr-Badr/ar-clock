import {
  HIJRI_CALENDAR_INDEXABLE_RANGE,
  getHijriYearSitemapDays,
  isSeoIndexableHijriDate,
} from '@/lib/seo/date-indexing';
import { getSiteUrl } from '@/lib/site-config';

const BASE = getSiteUrl();

export async function GET(
  _request: Request,
  context: { params: Promise<{ year: string }> },
) {
  const { year } = await context.params;

  if (!/^\d{4}$/.test(year)) {
    return new Response('Not Found', { status: 404 });
  }

  const numericYear = Number.parseInt(year, 10);
  if (
    numericYear < HIJRI_CALENDAR_INDEXABLE_RANGE.minYear
    || numericYear > HIJRI_CALENDAR_INDEXABLE_RANGE.maxYear
  ) {
    return new Response('Not Found', { status: 404 });
  }

  const now = new Date();
  const entries = getHijriYearSitemapDays(numericYear)
    .filter((date) => isSeoIndexableHijriDate(date, now))
    .map(({ year: rowYear, month, day }) => {
      const monthStr = String(month).padStart(2, '0');
      const dayStr = String(day).padStart(2, '0');

      return `
  <url>
    <loc>${BASE}/date/hijri/${rowYear}/${monthStr}/${dayStr}</loc>
  </url>`;
    });

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
