import { getRichContent } from '@/lib/event-content';
import { ALL_EVENT_SLUGS, getEventMeta } from '@/lib/events';
import { COUNTRY_HUB_SLUGS } from '@/lib/holidays/country-hub-data';
import { getSiteUrl } from '@/lib/site-config';

export default async function sitemap() {
  const BASE = getSiteUrl();
  const rows = ALL_EVENT_SLUGS
    .map((slug) => ({ slug, ...(getEventMeta(slug) || {}) }))
    .filter((row) => row?.slug && ['published', 'monitored'].includes(row.publishStatus));

  const getPriority = (publishStatus) => {
    if (publishStatus === 'monitored') {
      return 0.9;
    }
    return 0.8;
  };

  const resolveLastModified = (slug) => {
    const richDate = getRichContent(slug)?.seoMeta?.dateModified;
    if (typeof richDate === 'string' && !Number.isNaN(Date.parse(richDate))) {
      return richDate;
    }
    return null;
  };

  const canonicalEntries = rows.map((row) => {
    const slug = row.slug;
    const lastModified = resolveLastModified(slug);

    return {
      url: `${BASE}/holidays/${slug}`,
      ...(lastModified ? { lastModified } : {}),
      changeFrequency: 'daily',
      priority: getPriority(row.publishStatus),
    };
  });

  // `/holidays/country/[country]` hubs (src/app/holidays/country/[country]/page.jsx) — fully
  // built, prerendered, unique-metadata pages linked from /holidays, but never submitted in any
  // sitemap (found 2026-08-23 during a traffic-diagnosis audit). Countdown-driven content changes
  // daily, so they carry the same changeFrequency as the event canonicals above.
  const countryHubEntries = COUNTRY_HUB_SLUGS.map((slug) => ({
    url: `${BASE}/holidays/country/${slug}`,
    changeFrequency: 'daily',
    priority: 0.75,
  }));

  return [...canonicalEntries, ...countryHubEntries];
}
