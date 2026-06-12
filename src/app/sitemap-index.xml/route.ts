import { getSiteUrl } from '@/lib/site-config';
import { getSitemapIndexUrls } from '@/lib/seo/site-architecture';

export async function GET() {
  const BASE = getSiteUrl();
  const sitemaps = getSitemapIndexUrls(BASE);

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
