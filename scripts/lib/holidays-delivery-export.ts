import {
  mkdirSync,
  readdirSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join } from 'node:path';

import aliasMetaBySlug from '../../src/data/holidays/generated/alias-meta.json';
import aliasToCanonical from '../../src/data/holidays/generated/aliases.json';
import allEventsList from '../../src/data/holidays/generated/all-events-list.json';
import canonicalToAliases from '../../src/data/holidays/generated/canonical-to-aliases.json';
import eventMetaBySlug from '../../src/data/holidays/generated/event-meta-by-slug.json';
import manifest from '../../src/data/holidays/generated/manifest.json';
import publishedEventsList from '../../src/data/holidays/generated/published-events-list.json';
import runtimeRecordsBySlug from '../../src/data/holidays/generated/runtime-records-by-slug.json';

type JsonObject = Record<string, any>;

function ensureDir(path: string) {
  mkdirSync(path, { recursive: true });
}

function writeJson(path: string, value: unknown) {
  ensureDir(dirname(path));
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function removeStaleJsonFiles(dir: string, keepFileNames: Set<string>) {
  try {
    const files = readdirSync(dir)
      .filter((file) => file.endsWith('.json'))
      .filter((file) => !keepFileNames.has(file));

    for (const file of files) {
      unlinkSync(join(dir, file));
    }
  } catch {
    // Directory may not exist yet on first export.
  }
}

function normalizeObject(value: unknown): JsonObject {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as JsonObject)
    : {};
}

function sortObjectByKeys<T extends JsonObject>(input: T): T {
  return Object.fromEntries(
    Object.entries(input).sort(([a], [b]) => a.localeCompare(b)),
  ) as T;
}

export function buildHolidaysDeliveryExport() {
  const sourceManifest = normalizeObject(manifest);
  const canonicalRecords = normalizeObject(runtimeRecordsBySlug);
  const aliasMap = sortObjectByKeys(normalizeObject(aliasToCanonical));
  const aliasMetaMap = sortObjectByKeys(normalizeObject(aliasMetaBySlug));
  const canonicalAliasMap = sortObjectByKeys(normalizeObject(canonicalToAliases));
  const metaMap = sortObjectByKeys(normalizeObject(eventMetaBySlug));

  const canonicalSlugs = Object.keys(canonicalRecords).sort();
  const publishedCanonicalSlugSet = new Set(
    Array.isArray(publishedEventsList)
      ? publishedEventsList.map((event: any) => event?.slug).filter(Boolean)
      : [],
  );
  const publishedCanonicalSlugs = canonicalSlugs.filter((slug) => publishedCanonicalSlugSet.has(slug));
  const routeResolutionBySlug: Record<string, any> = {};

  for (const slug of canonicalSlugs) {
    const meta = metaMap[slug] || {};
    routeResolutionBySlug[slug] = {
      canonicalSlug: slug,
      isAlias: false,
      countryCode: null,
      publishStatus: meta.publishStatus || 'unknown',
      canonicalPath: meta.canonicalPath || `/holidays/${slug}`,
    };
  }

  for (const [slug, meta] of Object.entries(aliasMetaMap)) {
    const canonicalSlug = String(meta?.canonicalSlug || '').trim();
    if (!canonicalSlug) continue;
    const canonicalMeta = metaMap[canonicalSlug] || {};
    routeResolutionBySlug[slug] = {
      canonicalSlug,
      isAlias: true,
      countryCode: meta?.countryCode || null,
      publishStatus: canonicalMeta.publishStatus || 'unknown',
      canonicalPath: canonicalMeta.canonicalPath || `/holidays/${canonicalSlug}`,
    };
  }

  const sortedRouteResolution = sortObjectByKeys(routeResolutionBySlug);
  const routeSlugs = Object.keys(sortedRouteResolution).sort();

  const publishedRuntimeRecordsBySlug = sortObjectByKeys(
    Object.fromEntries(
      Object.entries(canonicalRecords).filter(([slug]) => publishedCanonicalSlugSet.has(slug)),
    ),
  );

  const deliveryManifest = {
    schemaVersion: 1,
    generatedAt: sourceManifest.generatedAt || new Date().toISOString(),
    sourceManifestSchemaVersion: sourceManifest.schemaVersion || null,
    sourceBundle: 'src/data/holidays/generated/runtime-records-by-slug.json',
    runtimeBoundary: 'src/lib/holidays/repository.js',
    deliveryMode: 'static-json',
    recordShape: 'canonical-runtime-record',
    counts: {
      canonicalEvents: canonicalSlugs.length,
      publishedCanonicalEvents: publishedCanonicalSlugs.length,
      aliases: Object.keys(aliasMap).length,
      routableSlugs: routeSlugs.length,
    },
    paths: {
      indexes: {
        canonicalSlugs: 'indexes/canonical-slugs.json',
        publishedCanonicalSlugs: 'indexes/published-canonical-slugs.json',
        routeSlugs: 'indexes/route-slugs.json',
        routeResolutionBySlug: 'indexes/route-resolution-by-slug.json',
        aliasToCanonical: 'indexes/alias-to-canonical.json',
        aliasMetaBySlug: 'indexes/alias-meta-by-slug.json',
        canonicalToAliases: 'indexes/canonical-to-aliases.json',
        eventMetaBySlug: 'indexes/event-meta-by-slug.json',
      },
      bundles: {
        allEventsList: 'bundles/all-events-list.json',
        publishedEventsList: 'bundles/published-events-list.json',
        runtimeRecordsBySlug: 'bundles/runtime-records-by-slug.json',
        publishedRuntimeRecordsBySlug: 'bundles/published-runtime-records-by-slug.json',
      },
      recordsDir: 'records',
    },
  };

  return {
    manifest: deliveryManifest,
    indexes: {
      canonicalSlugs,
      publishedCanonicalSlugs,
      routeSlugs,
      routeResolutionBySlug: sortedRouteResolution,
      aliasToCanonical: aliasMap,
      aliasMetaBySlug: aliasMetaMap,
      canonicalToAliases: canonicalAliasMap,
      eventMetaBySlug: metaMap,
    },
    bundles: {
      allEventsList,
      publishedEventsList,
      runtimeRecordsBySlug: sortObjectByKeys(canonicalRecords),
      publishedRuntimeRecordsBySlug,
    },
    recordsBySlug: sortObjectByKeys(canonicalRecords),
  };
}

export function writeHolidaysDeliveryExport(outDir: string) {
  const payload = buildHolidaysDeliveryExport();
  const indexesDir = join(outDir, 'indexes');
  const bundlesDir = join(outDir, 'bundles');
  const recordsDir = join(outDir, 'records');

  ensureDir(indexesDir);
  ensureDir(bundlesDir);
  ensureDir(recordsDir);

  writeJson(join(outDir, 'manifest.json'), payload.manifest);

  writeJson(join(indexesDir, 'canonical-slugs.json'), payload.indexes.canonicalSlugs);
  writeJson(join(indexesDir, 'published-canonical-slugs.json'), payload.indexes.publishedCanonicalSlugs);
  writeJson(join(indexesDir, 'route-slugs.json'), payload.indexes.routeSlugs);
  writeJson(join(indexesDir, 'route-resolution-by-slug.json'), payload.indexes.routeResolutionBySlug);
  writeJson(join(indexesDir, 'alias-to-canonical.json'), payload.indexes.aliasToCanonical);
  writeJson(join(indexesDir, 'alias-meta-by-slug.json'), payload.indexes.aliasMetaBySlug);
  writeJson(join(indexesDir, 'canonical-to-aliases.json'), payload.indexes.canonicalToAliases);
  writeJson(join(indexesDir, 'event-meta-by-slug.json'), payload.indexes.eventMetaBySlug);

  writeJson(join(bundlesDir, 'all-events-list.json'), payload.bundles.allEventsList);
  writeJson(join(bundlesDir, 'published-events-list.json'), payload.bundles.publishedEventsList);
  writeJson(join(bundlesDir, 'runtime-records-by-slug.json'), payload.bundles.runtimeRecordsBySlug);
  writeJson(join(bundlesDir, 'published-runtime-records-by-slug.json'), payload.bundles.publishedRuntimeRecordsBySlug);

  const keepFileNames = new Set(
    Object.keys(payload.recordsBySlug).map((slug) => `${slug}.json`),
  );
  removeStaleJsonFiles(recordsDir, keepFileNames);

  for (const [slug, record] of Object.entries(payload.recordsBySlug)) {
    writeJson(join(recordsDir, `${slug}.json`), record);
  }

  return payload;
}
