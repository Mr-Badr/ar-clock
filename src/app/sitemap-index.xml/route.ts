import { getSiteUrl } from '@/lib/site-config';

export async function GET() {
  const BASE = getSiteUrl();
  let countrySlugs: string[] = [];

  try {
    const countriesModule = await import('@/lib/db/queries/countries');
    countrySlugs = await countriesModule.getAllCountrySlugs();
  } catch {
    // Keep the sitemap index crawlable even if the country-query layer is unavailable.
  }

  const sitemaps = [
    `${BASE}/sitemap.xml`,
    `${BASE}/economie/sitemap.xml`,
    `${BASE}/holidays/sitemap.xml`,
    `${BASE}/time-difference/sitemap.xml`,
    // Date feature sitemaps
    `${BASE}/date/sitemap.xml`,
    `${BASE}/date/hijri/sitemap.xml`,
  ];

  // Add per-country sitemaps for time-now and mwaqit-al-salat
  for (const countrySlug of countrySlugs) {
    if (countrySlug) {
      sitemaps.push(`${BASE}/time-now/sitemap/${countrySlug}.xml`);
      sitemaps.push(`${BASE}/mwaqit-al-salat/sitemap/${countrySlug}.xml`);
    }
  }

  // Build the XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${sitemaps
      .map(url => `
  <sitemap>
    <loc>${url}</loc>
  </sitemap>`)
      .join('')}
</sitemapindex>
`;

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 's-maxage=21600, stale-while-revalidate=86400',
    },
  });
}
