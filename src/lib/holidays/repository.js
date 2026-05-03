/**
 * Central runtime repository for holiday/event data.
 *
 * Why this exists:
 * - authored event packages already live in one place:
 *   `src/data/holidays/events/<slug>/`
 * - runtime previously consumed separate generated "events" and "content"
 *   layers, which makes a future CDN/VPS/Postgres move harder
 * - this repository exposes one normalized read boundary now, while keeping
 *   the existing compatibility helpers alive for current callers
 *
 * Current storage mode:
 * - local generated JSON bundle in `src/data/holidays/generated/`
 *
 * Planned future modes:
 * - CDN/VPS-hosted JSON
 * - PostgreSQL-backed delivery
 */

import generatedAliases from '@/data/holidays/generated/aliases.json';
import generatedAliasMeta from '@/data/holidays/generated/alias-meta.json';
import generatedCanonicalToAliases from '@/data/holidays/generated/canonical-to-aliases.json';
import generatedContentBySlug from '@/data/holidays/generated/content-by-slug.json';
import generatedEventMetaBySlug from '@/data/holidays/generated/event-meta-by-slug.json';
import generatedEventsBySlug from '@/data/holidays/generated/events-by-slug.json';
import generatedManifest from '@/data/holidays/generated/manifest.json';
import generatedPublishedEventsBySlug from '@/data/holidays/generated/published-events-by-slug.json';
import generatedRuntimeRecordsBySlug from '@/data/holidays/generated/runtime-records-by-slug.json';
import { parseRichContent } from '@/lib/event-content/schema';
import { featureFlags } from '@/lib/feature-flags';
import { getHolidayCountryByCode } from '@/lib/holidays/taxonomy';

const PROTECTED_FIELDS = new Set([
  'category',
  '_countryCode',
  'type',
  'slug',
  'id',
  'hijriMonth',
  'hijriDay',
  'month',
  'day',
  'date',
  '__enriched',
]);

const OVERLAY_FIELDS = new Set([
  'seoTitle',
  'description',
  'keywords',
  'quickFacts',
  'countryDates',
  'sources',
  'seoMeta',
]);

function normalizeObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
}

function hasOwnKeys(value) {
  return Object.keys(normalizeObject(value)).length > 0;
}

function mergeKeywords(baseKeywords, overlayKeywords) {
  const merged = [
    ...(Array.isArray(baseKeywords) ? baseKeywords : []),
    ...(Array.isArray(overlayKeywords) ? overlayKeywords : []),
  ]
    .map((value) => String(value || '').trim())
    .filter(Boolean);

  return Array.from(new Set(merged));
}

function applyCountryOverlay(content, countryCode) {
  if (!countryCode) return content;

  const variant = content?.countrySeoVariants?.[countryCode];
  const overlay = content?.countryOverrides?.[countryCode];
  if (!variant && (!overlay || typeof overlay !== 'object')) return content;

  const merged = { ...content };

  if (variant && typeof variant === 'object') {
    if (variant.seoTitle) merged.seoTitle = variant.seoTitle;
    if (variant.description) merged.description = variant.description;
    if (variant.keywords) merged.keywords = mergeKeywords(merged.keywords, variant.keywords);
    if (variant.seoMeta && typeof variant.seoMeta === 'object') {
      merged.seoMeta = {
        ...(merged.seoMeta || {}),
        ...variant.seoMeta,
      };
    }
    if (variant.quickFacts && !overlay?.quickFacts) {
      merged.quickFacts = variant.quickFacts;
    }
  }

  if (overlay && typeof overlay === 'object') {
    for (const key of Object.keys(overlay)) {
      if (!OVERLAY_FIELDS.has(key)) continue;

      if (key === 'keywords') {
        merged.keywords = mergeKeywords(merged.keywords, overlay[key]);
        continue;
      }

      if (key === 'seoMeta' && overlay[key] && typeof overlay[key] === 'object') {
        merged.seoMeta = {
          ...(merged.seoMeta || {}),
          ...overlay[key],
        };
        continue;
      }

      merged[key] = overlay[key];
    }
  }

  return merged;
}

const MANIFEST_EVENTS = Array.isArray(generatedManifest?.events)
  ? generatedManifest.events
  : [];

const MANIFEST_BY_SLUG = new Map(
  MANIFEST_EVENTS
    .filter((row) => row?.slug)
    .map((row) => [row.slug, row]),
);

function buildFallbackRuntimeRecords() {
  return Object.fromEntries(
    Object.entries(normalizeObject(generatedEventsBySlug)).map(([slug, core]) => {
      const manifestEntry = MANIFEST_BY_SLUG.get(slug) || null;
      return [
        slug,
        {
          slug,
          core,
          content: normalizeObject(generatedContentBySlug?.[slug]),
          meta: normalizeObject(generatedEventMetaBySlug?.[slug]),
          source: manifestEntry
            ? {
                canonicalPath: manifestEntry.canonicalPath || `/holidays/${slug}`,
                canonicalSource: manifestEntry.canonicalSource || 'internal',
                sourceAuthority: manifestEntry.sourceAuthority || null,
                queueOrder: manifestEntry.queueOrder || null,
                authoring: {
                  eventDir: manifestEntry.eventDir || null,
                  packageFile: manifestEntry.packageFile || null,
                  researchFile: manifestEntry.researchFile || null,
                  qaFile: manifestEntry.qaFile || null,
                },
                generated: {
                  coreBundle: manifestEntry.generatedCoreBundle || null,
                  contentBundle: manifestEntry.generatedContentBundle || null,
                  runtimeBundle: manifestEntry.generatedRuntimeBundle || null,
                },
                hasResearch: Boolean(manifestEntry.hasResearch),
                hasQa: Boolean(manifestEntry.hasQa),
                lastModified: manifestEntry.lastModified || generatedManifest?.generatedAt || null,
              }
            : {
                canonicalPath: `/holidays/${slug}`,
                canonicalSource: 'internal',
                sourceAuthority: null,
                queueOrder: null,
                authoring: {
                  eventDir: null,
                  packageFile: null,
                  researchFile: null,
                  qaFile: null,
                },
                generated: {
                  coreBundle: null,
                  contentBundle: null,
                  runtimeBundle: null,
                },
                hasResearch: false,
                hasQa: false,
                lastModified: generatedManifest?.generatedAt || null,
              },
        },
      ];
    }),
  );
}

const RAW_RUNTIME_RECORDS_BY_SLUG = normalizeObject(generatedRuntimeRecordsBySlug);
const HAS_GENERATED_RUNTIME_RECORDS = Object.keys(RAW_RUNTIME_RECORDS_BY_SLUG).length > 0;

function normalizeRuntimeRecord(slug, value) {
  const record = normalizeObject(value);
  const manifestEntry = MANIFEST_BY_SLUG.get(slug) || null;

  return {
    slug,
    core: record.core || normalizeObject(generatedEventsBySlug?.[slug]),
    content: normalizeObject(record.content || generatedContentBySlug?.[slug]),
    meta: normalizeObject(record.meta || generatedEventMetaBySlug?.[slug]),
    source: hasOwnKeys(record.source)
      ? record.source
      : manifestEntry
        ? {
            canonicalPath: manifestEntry.canonicalPath || `/holidays/${slug}`,
            canonicalSource: manifestEntry.canonicalSource || 'internal',
            sourceAuthority: manifestEntry.sourceAuthority || null,
            queueOrder: manifestEntry.queueOrder || null,
            authoring: {
              eventDir: manifestEntry.eventDir || null,
              packageFile: manifestEntry.packageFile || null,
              researchFile: manifestEntry.researchFile || null,
              qaFile: manifestEntry.qaFile || null,
            },
            generated: {
              coreBundle: manifestEntry.generatedCoreBundle || null,
              contentBundle: manifestEntry.generatedContentBundle || null,
              runtimeBundle: manifestEntry.generatedRuntimeBundle || null,
            },
            hasResearch: Boolean(manifestEntry.hasResearch),
            hasQa: Boolean(manifestEntry.hasQa),
            lastModified: manifestEntry.lastModified || generatedManifest?.generatedAt || null,
          }
        : {
            canonicalPath: `/holidays/${slug}`,
            canonicalSource: 'internal',
            sourceAuthority: null,
            queueOrder: null,
            authoring: {
              eventDir: null,
              packageFile: null,
              researchFile: null,
              qaFile: null,
            },
            generated: {
              coreBundle: null,
              contentBundle: null,
              runtimeBundle: null,
            },
            hasResearch: false,
            hasQa: false,
            lastModified: generatedManifest?.generatedAt || null,
          },
  };
}

const NORMALIZED_RUNTIME_RECORDS_BY_SLUG = Object.fromEntries(
  Object.entries(
    HAS_GENERATED_RUNTIME_RECORDS
      ? RAW_RUNTIME_RECORDS_BY_SLUG
      : buildFallbackRuntimeRecords(),
  ).map(([slug, value]) => [slug, normalizeRuntimeRecord(slug, value)]),
);

const PUBLISHED_CANONICAL_SLUG_SET = new Set(
  Object.keys(normalizeObject(generatedPublishedEventsBySlug)),
);

export const ALL_CANONICAL_HOLIDAY_RECORDS = Object.values(NORMALIZED_RUNTIME_RECORDS_BY_SLUG);
export const ACTIVE_CANONICAL_HOLIDAY_RECORDS = featureFlags.eventsPublishedOnly
  ? ALL_CANONICAL_HOLIDAY_RECORDS.filter((record) => PUBLISHED_CANONICAL_SLUG_SET.has(record.slug))
  : ALL_CANONICAL_HOLIDAY_RECORDS;

const ACTIVE_CANONICAL_RECORDS_BY_SLUG = Object.fromEntries(
  ACTIVE_CANONICAL_HOLIDAY_RECORDS.map((record) => [record.slug, record]),
);

export const ALL_CANONICAL_HOLIDAY_EVENTS = ALL_CANONICAL_HOLIDAY_RECORDS
  .map((record) => record.core)
  .filter((value) => value?.slug);

export const ACTIVE_CANONICAL_HOLIDAY_EVENTS = ACTIVE_CANONICAL_HOLIDAY_RECORDS
  .map((record) => record.core)
  .filter((value) => value?.slug);

export const ALL_CANONICAL_HOLIDAY_SLUGS = ALL_CANONICAL_HOLIDAY_EVENTS.map((event) => event.slug);
export const ACTIVE_CANONICAL_HOLIDAY_SLUGS = ACTIVE_CANONICAL_HOLIDAY_EVENTS.map((event) => event.slug);

const ALIAS_TO_CANONICAL = normalizeObject(generatedAliases);
const ALIAS_META_BY_SLUG = normalizeObject(generatedAliasMeta);
const CANONICAL_TO_ALIASES = normalizeObject(generatedCanonicalToAliases);

export const ALL_ALIAS_HOLIDAY_SLUGS = Object.keys(ALIAS_TO_CANONICAL).filter((slug) => {
  const canonicalSlug = ALIAS_TO_CANONICAL?.[slug];
  return Boolean(canonicalSlug && ACTIVE_CANONICAL_RECORDS_BY_SLUG[canonicalSlug]);
});

export const ALL_ROUTE_HOLIDAY_SLUGS = [
  ...ACTIVE_CANONICAL_HOLIDAY_SLUGS,
  ...ALL_ALIAS_HOLIDAY_SLUGS,
];

export function getHolidayAliasMeta(slug) {
  return ALIAS_META_BY_SLUG?.[slug] || null;
}

export function getAliasesForCanonicalHoliday(slug) {
  return CANONICAL_TO_ALIASES?.[slug] || [];
}

export function resolveHolidaySlug(slug) {
  if (!slug) return null;

  if (ACTIVE_CANONICAL_RECORDS_BY_SLUG[slug]) {
    return {
      requestedSlug: slug,
      canonicalSlug: slug,
      isAlias: false,
      countryCode: null,
    };
  }

  const canonicalSlug = ALIAS_TO_CANONICAL?.[slug];
  if (!canonicalSlug) return null;

  const aliasMeta = getHolidayAliasMeta(slug);
  const canonicalAvailable =
    ACTIVE_CANONICAL_RECORDS_BY_SLUG[canonicalSlug] ||
    NORMALIZED_RUNTIME_RECORDS_BY_SLUG[canonicalSlug] ||
    null;
  if (!canonicalAvailable) return null;

  return {
    requestedSlug: slug,
    canonicalSlug,
    isAlias: true,
    countryCode: aliasMeta?.countryCode || null,
  };
}

export function getHolidayMeta(slug) {
  const resolved = resolveHolidaySlug(slug);
  const canonicalSlug = resolved?.canonicalSlug || slug;
  return NORMALIZED_RUNTIME_RECORDS_BY_SLUG?.[canonicalSlug]?.meta || null;
}

export function getCanonicalHolidayRecord(slug) {
  return NORMALIZED_RUNTIME_RECORDS_BY_SLUG?.[slug] || null;
}

export function getHolidaySource(slug) {
  const resolved = resolveHolidaySlug(slug);
  const canonicalSlug = resolved?.canonicalSlug || slug;
  return NORMALIZED_RUNTIME_RECORDS_BY_SLUG?.[canonicalSlug]?.source || null;
}

function getCanonicalRawRichContent(slug) {
  const generatedContent = NORMALIZED_RUNTIME_RECORDS_BY_SLUG?.[slug]?.content || null;
  if (featureFlags.eventsShardIndex && generatedContent) return generatedContent;
  return generatedContent || {};
}

export function getHolidayRichContent(slug) {
  const resolved = resolveHolidaySlug(slug);
  const canonicalSlug = resolved?.canonicalSlug || slug;
  const raw = getCanonicalRawRichContent(canonicalSlug);
  if (!raw || typeof raw !== 'object') return {};

  const parsed = featureFlags.holidaysNewContentResolver
    ? parseRichContent(slug, raw)
    : { content: raw, flags: { hasHardcodedYear: false, isValid: true } };

  const withOverlay = applyCountryOverlay(parsed.content, resolved?.countryCode || null);
  const safe = { ...withOverlay, __contentFlags: parsed.flags };
  for (const field of PROTECTED_FIELDS) {
    delete safe[field];
  }
  delete safe.countryOverrides;
  delete safe.countrySeoVariants;
  return safe;
}

export function getHolidayCoreEventBySlug(slug) {
  const resolved = resolveHolidaySlug(slug);
  if (!resolved) return null;

  const base =
    ACTIVE_CANONICAL_RECORDS_BY_SLUG[resolved.canonicalSlug]?.core ||
    NORMALIZED_RUNTIME_RECORDS_BY_SLUG[resolved.canonicalSlug]?.core ||
    null;
  if (!base) return null;

  return {
    ...base,
    __requestedSlug: resolved.requestedSlug,
    __canonicalSlug: resolved.canonicalSlug,
    __isAlias: resolved.isAlias,
    __aliasCountryCode: resolved.countryCode,
  };
}

export function getHolidayRuntimeRecord(slug) {
  const resolved = resolveHolidaySlug(slug);
  if (!resolved) return null;

  const canonicalRecord =
    ACTIVE_CANONICAL_RECORDS_BY_SLUG[resolved.canonicalSlug] ||
    NORMALIZED_RUNTIME_RECORDS_BY_SLUG[resolved.canonicalSlug] ||
    null;
  if (!canonicalRecord?.core) return null;

  return {
    requestedSlug: resolved.requestedSlug,
    canonicalSlug: resolved.canonicalSlug,
    isAlias: resolved.isAlias,
    countryCode: resolved.countryCode,
    aliases: getAliasesForCanonicalHoliday(resolved.canonicalSlug),
    core: canonicalRecord.core,
    content: getHolidayRichContent(slug),
    meta: canonicalRecord.meta || null,
    source: canonicalRecord.source || null,
  };
}

function buildRouteEvent(baseEvent, routeSlug, countryCode = null) {
  return {
    ...baseEvent,
    slug: routeSlug,
    __requestedSlug: routeSlug,
    __canonicalSlug: baseEvent.slug,
    __isAlias: routeSlug !== baseEvent.slug,
    __aliasCountryCode: routeSlug !== baseEvent.slug ? countryCode : null,
    _countryCode: routeSlug !== baseEvent.slug
      ? countryCode
      : (baseEvent._countryCode || null),
  };
}

export function getListableHolidayEvents(options = {}) {
  const requestedCountryCode = String(options.countryCode || '').trim().toLowerCase();
  if (!requestedCountryCode || requestedCountryCode === 'all') {
    return ACTIVE_CANONICAL_HOLIDAY_EVENTS.map((event) => (
      buildRouteEvent(event, event.slug, event._countryCode || null)
    ));
  }

  const validCountryCode = getHolidayCountryByCode(requestedCountryCode)?.code || requestedCountryCode;
  const results = [];
  const seen = new Set();

  const pushUnique = (event) => {
    if (!event?.slug || seen.has(event.slug)) return;
    seen.add(event.slug);
    results.push(event);
  };

  for (const event of ACTIVE_CANONICAL_HOLIDAY_EVENTS) {
    if (event._countryCode) {
      if (event._countryCode === validCountryCode) {
        pushUnique(buildRouteEvent(event, event.slug, event._countryCode));
      }
      continue;
    }

    const aliasSlug = getAliasesForCanonicalHoliday(event.slug).find(
      (slug) => getHolidayAliasMeta(slug)?.countryCode === validCountryCode,
    );

    if (aliasSlug) {
      pushUnique(buildRouteEvent(event, aliasSlug, validCountryCode));
      continue;
    }

    pushUnique(buildRouteEvent(event, event.slug, null));
  }

  return results;
}
