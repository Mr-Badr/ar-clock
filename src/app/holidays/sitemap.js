import { ALL_EVENTS } from '@/lib/holidays-engine';

export default async function sitemap() {
  const BASE = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://miqatime.com';
  const fixedDate = new Date('2025-01-01').toISOString();

  return ALL_EVENTS.map(ev => ({
    url: `${BASE}/holidays/${ev.slug}`,
    lastModified: fixedDate,
  }));
}
