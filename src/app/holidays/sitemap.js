import manifest from '@/data/holidays/generated/manifest.json';
import { GENERATED_CONTENT_BY_SLUG } from '@/lib/event-content/generated-index';
import { GENERATED_ALIAS_META_BY_SLUG } from '@/lib/events/generated-aliases';
import { getSiteUrl } from '@/lib/site-config';

export default async function sitemap() {
  const BASE = getSiteUrl();
  const now = new Date().toISOString();
  const rows = (manifest.events || [])
    .filter((row) => row?.slug && ['published', 'monitored'].includes(row.publishStatus))
    .sort((a, b) => {
      const queueA = Number.isFinite(a.queueOrder) ? a.queueOrder : Number.MAX_SAFE_INTEGER;
      const queueB = Number.isFinite(b.queueOrder) ? b.queueOrder : Number.MAX_SAFE_INTEGER;
      if (queueA !== queueB) return queueA - queueB;
      return String(a.slug).localeCompare(String(b.slug));
    });
  const manifestBySlug = new Map(rows.map((row) => [row.slug, row]));
  const aliasRows = Object.entries(GENERATED_ALIAS_META_BY_SLUG || {})
    .filter(([, meta]) => meta?.canonicalSlug && manifestBySlug.has(meta.canonicalSlug))
    .map(([slug, meta]) => ({
      slug,
      canonicalSlug: meta.canonicalSlug,
      tier: manifestBySlug.get(meta.canonicalSlug)?.tier || 'tier3',
    }))
    .sort((a, b) => String(a.slug).localeCompare(String(b.slug)));

  const resolveLastModified = (slug) => {
    const richDate = GENERATED_CONTENT_BY_SLUG?.[slug]?.seoMeta?.dateModified;
    if (typeof richDate === 'string' && !Number.isNaN(Date.parse(richDate))) {
      return richDate;
    }
    const manifestDate = manifestBySlug.get(slug)?.lastModified;
    if (typeof manifestDate === 'string' && !Number.isNaN(Date.parse(manifestDate))) {
      return manifestDate;
    }
    const canonicalSlug = GENERATED_ALIAS_META_BY_SLUG?.[slug]?.canonicalSlug;
    const canonicalRichDate = canonicalSlug ? GENERATED_CONTENT_BY_SLUG?.[canonicalSlug]?.seoMeta?.dateModified : null;
    if (typeof canonicalRichDate === 'string' && !Number.isNaN(Date.parse(canonicalRichDate))) {
      return canonicalRichDate;
    }
    const canonicalManifestDate = canonicalSlug ? manifestBySlug.get(canonicalSlug)?.lastModified : null;
    if (typeof canonicalManifestDate === 'string' && !Number.isNaN(Date.parse(canonicalManifestDate))) {
      return canonicalManifestDate;
    }
    return now;
  };

  const canonicalEntries = rows.map((row) => {
    const slug = row.slug;
    const tier = manifestBySlug.get(slug)?.tier || 'tier3';
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
