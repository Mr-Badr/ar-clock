import { getRichContent } from '@/lib/event-content';
import { ALL_EVENT_SLUGS, getEventMeta } from '@/lib/events';
import { GENERATED_ALIAS_META_BY_SLUG } from '@/lib/events/generated-aliases';
import { getSiteUrl } from '@/lib/site-config';
import { getSitemapLastModified } from '@/lib/sitemap';

export default async function sitemap() {
  const BASE = getSiteUrl();
  const fallbackLastModified = getSitemapLastModified();
  const rows = ALL_EVENT_SLUGS
    .map((slug) => ({ slug, ...(getEventMeta(slug) || {}) }))
    .filter((row) => row?.slug && ['published', 'monitored'].includes(row.publishStatus));
  const metaBySlug = new Map(rows.map((row) => [row.slug, row]));
  const aliasRows = Object.entries(GENERATED_ALIAS_META_BY_SLUG || {})
    .filter(([, meta]) => meta?.canonicalSlug && metaBySlug.has(meta.canonicalSlug))
    .map(([slug, meta]) => ({
      slug,
      canonicalSlug: meta.canonicalSlug,
      tier: metaBySlug.get(meta.canonicalSlug)?.tier || 'tier3',
    }))
    .sort((a, b) => String(a.slug).localeCompare(String(b.slug)));

  const resolveLastModified = (slug) => {
    const richDate = getRichContent(slug)?.seoMeta?.dateModified;
    if (typeof richDate === 'string' && !Number.isNaN(Date.parse(richDate))) {
      return richDate;
    }
    const canonicalSlug = GENERATED_ALIAS_META_BY_SLUG?.[slug]?.canonicalSlug;
    const canonicalRichDate = canonicalSlug ? getRichContent(canonicalSlug)?.seoMeta?.dateModified : null;
    if (typeof canonicalRichDate === 'string' && !Number.isNaN(Date.parse(canonicalRichDate))) {
      return canonicalRichDate;
    }
    return fallbackLastModified;
  };

  const canonicalEntries = rows.map((row) => {
    const slug = row.slug;
    const tier = metaBySlug.get(slug)?.tier || 'tier3';
    const priority = tier === 'tier1' ? 1.0
      : tier === 'tier2' ? 0.8
      : 0.5;

    return {
      url: `${BASE}/holidays/${slug}`,
      lastModified: resolveLastModified(slug),
      changeFrequency: 'daily',
      priority,
    };
  });

  const aliasEntries = aliasRows.map((row) => {
    const priority = row.tier === 'tier1' ? 0.9
      : row.tier === 'tier2' ? 0.7
      : 0.4;
    return {
      url: `${BASE}/holidays/${row.slug}`,
      lastModified: resolveLastModified(row.slug),
      changeFrequency: 'daily',
      priority,
    };
  });

  return [...canonicalEntries, ...aliasEntries];
}
