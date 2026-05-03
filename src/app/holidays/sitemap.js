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
      publishStatus: metaBySlug.get(meta.canonicalSlug)?.publishStatus || 'published',
    }))
    .sort((a, b) => String(a.slug).localeCompare(String(b.slug)));

  const getPriority = (publishStatus, { isAlias = false } = {}) => {
    if (publishStatus === 'monitored') {
      return isAlias ? 0.7 : 0.9;
    }
    return isAlias ? 0.6 : 0.8;
  };

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

    return {
      url: `${BASE}/holidays/${slug}`,
      lastModified: resolveLastModified(slug),
      changeFrequency: 'daily',
      priority: getPriority(row.publishStatus),
    };
  });

  const aliasEntries = aliasRows.map((row) => {
    return {
      url: `${BASE}/holidays/${row.slug}`,
      lastModified: resolveLastModified(row.slug),
      changeFrequency: 'daily',
      priority: getPriority(row.publishStatus, { isAlias: true }),
    };
  });

  return [...canonicalEntries, ...aliasEntries];
}
