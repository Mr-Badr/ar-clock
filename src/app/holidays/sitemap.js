import { getRichContent } from '@/lib/event-content';
import { ALL_EVENT_SLUGS, getEventMeta } from '@/lib/events';
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

  return canonicalEntries;
}
