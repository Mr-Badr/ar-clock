import { ALL_EVENTS } from '@/lib/holidays-engine';
import { TIER_1_SLUGS, TIER_2_SLUGS } from '@/lib/event-content';

export default async function sitemap() {
  const BASE = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://miqatime.com';
  const fixedDate = new Date('2025-01-01').toISOString();

  return ALL_EVENTS.map(ev => {
    // Tier-based priority for SEO
    const priority = TIER_1_SLUGS.includes(ev.slug) ? 1.0 
      : TIER_2_SLUGS.includes(ev.slug) ? 0.8 
      : 0.5;
    
    return {
      url: `${BASE}/holidays/${ev.slug}`,
      lastModified: fixedDate,
      changeFrequency: 'daily',
      priority,
    };
  });
}
