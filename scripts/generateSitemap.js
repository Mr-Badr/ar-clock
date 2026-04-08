/**
 * Scripts to generate standard XML sitemaps for the prayer directory.
 * Used defensively to ensure Google knows about every city in the Supabase DB
 * rather than waiting for slow organic crawling.
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
const BATCH_LIMIT = 40000; // max usually 50k per sitemap XML

async function generate() {
  const { data, error } = await supabase
    .from('cities')
    .select('country_slug, city_slug')
    .order('population', { ascending: false })
    .limit(BATCH_LIMIT);

  if (error || !data) return;

  const xmlUrls = data.map(city => `
    <url>
      <loc>https://miqatona.com/mwaqit-al-salat/${city.country_slug}/${city.city_slug}</loc>
      <changefreq>daily</changefreq>
      <priority>0.8</priority>
    </url>
  `).join('\n');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlUrls}
</urlset>
`;

  fs.writeFileSync('./public/sitemap-prayers-1.xml', sitemap);
  console.log(`Generated XML map with ${data.length} city routes.`);
}

// generate();
