import { getSupabaseServer } from '@/lib/supabase-server';

export async function GET() {
  const BASE = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com';

  let countries: { country_slug: string }[] = [];
  try {
    const supabase = getSupabaseServer();
    const { data, error } = await supabase
      .from('countries')
      .select('country_slug');

    if (!error && data) {
      countries = data;
    } else {
      console.error('[Sitemap Index] DB Error:', error);
    }
  } catch (err) {
    console.error('[Sitemap Index] Request Error:', err);
  }

  const sitemaps = [
    `${BASE}/sitemap.xml`,
    `${BASE}/holidays/sitemap.xml`
  ];

  // Add per-country sitemaps for time-now and mwaqit-al-salat
  for (const c of countries) {
    if (c.country_slug) {
      sitemaps.push(`${BASE}/time-now/sitemap/${c.country_slug}.xml`);
      sitemaps.push(`${BASE}/mwaqit-al-salat/sitemap/${c.country_slug}.xml`);
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
