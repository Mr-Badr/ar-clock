import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

import {
  COUNTRY_CODES,
  getCountryAliasToken,
  getCountryByCode,
} from '../src/lib/events/country-dictionary.js';
import { buildCompiledFaqContent } from '../src/lib/holidays/faq-normalizer.js';
import {
  describeHolidayDistribution,
  shouldAutoExpandHolidayCountries,
} from '../src/lib/holidays/distribution.js';
import { normalizeIslamicRichContentYears } from '../src/lib/islamic-year-format.js';
import { inferSourceAuthority, parseEventPackage } from '../src/lib/events/package-schema.js';

type EventPackage = ReturnType<typeof parseEventPackage>;

type EventFolderEntry = {
  slug: string;
  dir: string;
  packagePath: string;
  researchPath: string;
  qaPath: string;
};

const ROOT = process.cwd();
const EVENTS_SOURCE_DIR = join(ROOT, 'src/data/holidays/events');
const GENERATED_DATA_DIR = join(ROOT, 'src/data/holidays/generated');

const GENERATED_MANIFEST_PATH = join(GENERATED_DATA_DIR, 'manifest.json');
const GENERATED_ALL_EVENTS_LIST_PATH = join(GENERATED_DATA_DIR, 'all-events-list.json');
const GENERATED_PUBLISHED_EVENTS_LIST_PATH = join(GENERATED_DATA_DIR, 'published-events-list.json');
const GENERATED_EVENTS_BY_SLUG_PATH = join(GENERATED_DATA_DIR, 'events-by-slug.json');
const GENERATED_PUBLISHED_EVENTS_BY_SLUG_PATH = join(GENERATED_DATA_DIR, 'published-events-by-slug.json');
const GENERATED_CONTENT_BY_SLUG_PATH = join(GENERATED_DATA_DIR, 'content-by-slug.json');
const GENERATED_EVENT_META_BY_SLUG_PATH = join(GENERATED_DATA_DIR, 'event-meta-by-slug.json');
const GENERATED_RUNTIME_RECORDS_BY_SLUG_PATH = join(GENERATED_DATA_DIR, 'runtime-records-by-slug.json');
const GENERATED_ALIASES_PATH = join(GENERATED_DATA_DIR, 'aliases.json');
const GENERATED_ALIAS_META_PATH = join(GENERATED_DATA_DIR, 'alias-meta.json');
const GENERATED_CANONICAL_TO_ALIASES_PATH = join(GENERATED_DATA_DIR, 'canonical-to-aliases.json');

function ensureDir(path: string) {
  mkdirSync(path, { recursive: true });
}

function writeJson(path: string, value: unknown) {
  ensureDir(dirname(path));
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function safeRead(path: string): any {
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch {
    return null;
  }
}

function template(input: string, context: Record<string, string | number>) {
  return String(input || '').replace(/\{\{\s*([\w.]+)\s*\}\}/g, (full, key) => {
    if (!(key in context)) return full;
    return String(context[key]);
  });
}

function dedupeStrings(values: unknown[]) {
  return Array.from(
    new Set(
      values
        .map((value) => String(value || '').trim())
        .filter(Boolean),
    ),
  );
}

function getEventFolderEntries(): EventFolderEntry[] {
  if (!existsSync(EVENTS_SOURCE_DIR)) {
    throw new Error(
      `[generate-events-index] Missing events source directory: ${EVENTS_SOURCE_DIR}.`,
    );
  }

  const entries = readdirSync(EVENTS_SOURCE_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const slug = entry.name;
      const dir = join(EVENTS_SOURCE_DIR, slug);
      return {
        slug,
        dir,
        packagePath: join(dir, 'package.json'),
        researchPath: join(dir, 'research.json'),
        qaPath: join(dir, 'qa.json'),
      };
    })
    .filter((entry) => existsSync(entry.packagePath))
    .sort((a, b) => a.slug.localeCompare(b.slug));

  if (entries.length === 0) {
    throw new Error(
      `[generate-events-index] No event folders with package.json found in ${EVENTS_SOURCE_DIR}.`,
    );
  }

  return entries;
}

function shouldAutoExpandCountries(pkg: EventPackage) {
  return shouldAutoExpandHolidayCountries(pkg);
}

function buildCountryKeywordVariants(pkg: EventPackage, includeCountryTemplates = true) {
  const baseKeywords = Array.isArray(pkg.richContent?.keywords)
    ? [...pkg.richContent.keywords]
    : [];
  const baseTemplates = pkg.keywordTemplateSet?.base || [];
  const countryTemplates = pkg.keywordTemplateSet?.country || [];

  const eventName = pkg.core.name;
  const merged = [...baseKeywords];

  for (const templateText of baseTemplates) {
    const rendered = template(templateText, {
      eventName,
      slug: pkg.core.slug,
    }).trim();
    if (rendered) merged.push(rendered);
  }

  if (includeCountryTemplates) {
    for (const code of COUNTRY_CODES) {
      const country = getCountryByCode(code);
      if (!country) continue;
      for (const templateText of countryTemplates) {
        const rendered = template(templateText, {
          eventName,
          slug: pkg.core.slug,
          countryCode: code,
          countryName: country.nameAr,
        }).trim();
        if (rendered) merged.push(rendered);
      }
    }
  }

  return dedupeStrings(merged);
}

function buildCountrySeoVariants(pkg: EventPackage, expandedKeywords: string[]) {
  const variants: Record<string, any> = {};
  const baseSeoMeta: Record<string, any> =
    pkg.richContent?.seoMeta && typeof pkg.richContent.seoMeta === 'object'
      ? (pkg.richContent.seoMeta as Record<string, any>)
      : {};
  const countryTemplates = pkg.keywordTemplateSet?.country || [];
  const baseSecondaryKeywords = Array.isArray(baseSeoMeta?.secondaryKeywords)
    ? baseSeoMeta.secondaryKeywords
    : [];
  const baseLongTailKeywords = Array.isArray(baseSeoMeta?.longTailKeywords)
    ? baseSeoMeta.longTailKeywords
    : [];

  for (const code of COUNTRY_CODES) {
    const country = getCountryByCode(code);
    if (!country) continue;
    const overlay = pkg.countryOverrides?.[code] || {};
    const overlaySeoMeta =
      overlay?.seoMeta && typeof overlay.seoMeta === 'object' ? overlay.seoMeta : {};

    const context = {
      eventName: pkg.core.name,
      slug: pkg.core.slug,
      countryCode: code,
      countryName: country.nameAr,
      authority: country.authority,
      dateVarianceLabel: country.dateVarianceLabel,
      year: '{{year}}',
      hijriYear: '{{hijriYear}}',
      nextYear: '{{nextYear}}',
      daysRemaining: '{{daysRemaining}}',
      formattedDate: '{{formattedDate}}',
    };

    const generatedCountryKeywords = dedupeStrings(
      countryTemplates.map((templateText) => template(templateText, context)),
    );
    const autoCountryKeywords = dedupeStrings([
      ...generatedCountryKeywords,
      `متى ${pkg.core.name} في ${country.nameAr} {{year}}`,
      `${pkg.core.name} ${country.nameAr} {{year}}`,
      `كم باقي على ${pkg.core.name} في ${country.nameAr}`,
      `${pkg.core.name} {{year}} ${country.authority}`,
    ]);

    const mergedKeywords = dedupeStrings([
      ...(Array.isArray(overlay.keywords) ? overlay.keywords : []),
      ...autoCountryKeywords,
      ...expandedKeywords.filter((keyword) => keyword.includes(country.nameAr)),
    ]);

    const defaultSeoTitle = template('متى {{eventName}} {{year}} في {{countryName}}؟', context);
    const defaultDescription = template(
      '{{eventName}} {{year}} في {{countryName}} وفق {{authority}}. قد يختلف الموعد حسب {{dateVarianceLabel}}.',
      context,
    );

    const variantContent = {
      seoTitle: overlay.seoTitle || defaultSeoTitle,
      description: overlay.description || defaultDescription,
      seoMeta: {
        ...baseSeoMeta,
        ...overlaySeoMeta,
        titleTag:
          overlaySeoMeta?.titleTag ||
          template('{{eventName}} {{year}} في {{countryName}} | كم باقي؟ - ميقاتنا', context),
        metaDescription: overlaySeoMeta?.metaDescription || defaultDescription,
        h1: overlaySeoMeta?.h1 || template('{{eventName}} {{year}} في {{countryName}}', context),
        canonicalPath: `/holidays/${pkg.core.slug}`,
        primaryKeyword:
          overlaySeoMeta?.primaryKeyword ||
          template('متى {{eventName}} في {{countryName}} {{year}}', context),
        secondaryKeywords: dedupeStrings([
          ...baseSecondaryKeywords,
          ...mergedKeywords,
        ]).slice(0, 10),
        longTailKeywords: dedupeStrings([
          ...baseLongTailKeywords,
          template('كم باقي على {{eventName}} في {{countryName}} {{year}}', context),
          template('موعد {{eventName}} في {{countryName}} {{year}}', context),
          template('{{eventName}} في {{countryName}} حسب {{authority}}', context),
        ]).slice(0, 12),
        inLanguage: 'ar',
        eventCategory: pkg.core.category,
      },
    };

    const normalizedVariantContent =
      pkg.core.category === 'islamic'
        ? normalizeIslamicRichContentYears(variantContent, { eventName: pkg.core.name })
        : variantContent;

    variants[code] = {
      countryCode: code,
      countryName: country.nameAr,
      authority: country.authority,
      dateVarianceLabel: country.dateVarianceLabel,
      seoTitle: normalizedVariantContent.seoTitle,
      description: normalizedVariantContent.description,
      keywords: mergedKeywords,
      seoMeta: normalizedVariantContent.seoMeta,
    };

    if (overlay.quickFacts !== undefined) {
      variants[code].quickFacts = overlay.quickFacts;
    }
  }
  return variants;
}

function buildAutoAliasMap(pkg: EventPackage) {
  const out = new Map<string, string>();
  if (!shouldAutoExpandCountries(pkg)) return out;
  const aliasTemplate = pkg.countryAliasTemplate || '{{slug}}-in-{{countrySlug}}';
  for (const code of COUNTRY_CODES) {
    const country = getCountryByCode(code);
    if (!country) continue;
    const aliasSlug = template(aliasTemplate, {
      slug: pkg.core.slug,
      countryCode: code,
      countryName: country.nameAr,
      countrySlug: getCountryAliasToken(code),
    })
      .trim()
      .toLowerCase();
    if (!aliasSlug) continue;
    out.set(aliasSlug, code);
  }
  return out;
}

function collectAliases(pkg: EventPackage) {
  const aliases = new Map<string, string | null>();
  const autoAliases = buildAutoAliasMap(pkg);
  for (const [aliasSlug, countryCode] of Array.from(autoAliases.entries())) {
    aliases.set(aliasSlug, countryCode);
  }

  for (const aliasSlug of pkg.aliasSlugs || []) {
    if (!aliases.has(aliasSlug)) aliases.set(aliasSlug, null);
  }

  for (const [countryCode, override] of Object.entries(pkg.countryOverrides || {})) {
    for (const aliasSlug of override.aliasSlugs || []) {
      aliases.set(aliasSlug, countryCode);
    }
  }

  return aliases;
}

function buildAliasMeta(pkg: EventPackage, aliases: Map<string, string | null>) {
  const out: Record<string, { canonicalSlug: string; countryCode: string | null }> = {};
  for (const [aliasSlug, countryCode] of Array.from(aliases.entries())) {
    out[aliasSlug] = {
      canonicalSlug: pkg.core.slug,
      countryCode: countryCode || null,
    };
  }
  return out;
}

function loadPackages() {
  return getEventFolderEntries().map((entry) => {
    const raw = safeRead(entry.packagePath);
    const pkg = parseEventPackage(entry.slug, raw);
    return { entry, pkg };
  });
}

function main() {
  ensureDir(GENERATED_DATA_DIR);

  const generatedAt = new Date().toISOString();
  const packageEntries = loadPackages();

  const eventsBySlug: Record<string, any> = {};
  const contentBySlug: Record<string, any> = {};
  const eventMetaBySlug: Record<string, any> = {};
  const runtimeRecordsBySlug: Record<string, any> = {};
  const allEventsList: any[] = [];
  const publishedEventsList: any[] = [];
  const aliasToCanonical: Record<string, string> = {};
  const aliasMetaBySlug: Record<string, { canonicalSlug: string; countryCode: string | null }> = {};
  const canonicalToAliases: Record<string, string[]> = {};
  const globalAliasToCanonical: Record<string, string> = {};

  for (const { pkg } of packageEntries) {
    const aliases = collectAliases(pkg);
    for (const aliasSlug of Array.from(aliases.keys())) {
      globalAliasToCanonical[aliasSlug] = pkg.core.slug;
    }
  }

  const manifestEvents = packageEntries
    .slice()
    .sort((a, b) => (a.pkg.queueOrder || Number.MAX_SAFE_INTEGER) - (b.pkg.queueOrder || Number.MAX_SAFE_INTEGER))
    .map(({ entry, pkg }, index) => {
      const slug = pkg.core.slug;
      const aliases = collectAliases(pkg);
      const aliasSlugs = Array.from(aliases.keys());

      if (eventsBySlug[slug]) {
        throw new Error(`[generate-events-index] Duplicate canonical slug in event folders: "${slug}".`);
      }

      const coreRecord = { ...pkg.core };
      const relatedSlugs = Array.isArray(pkg.richContent?.relatedSlugs)
        ? Array.from(
            new Set(
              pkg.richContent.relatedSlugs
                .map((relatedSlug: string) => globalAliasToCanonical[relatedSlug] || relatedSlug)
                .filter((relatedSlug: string) => relatedSlug && relatedSlug !== slug),
            ),
          )
        : [];
      const distribution = describeHolidayDistribution(pkg);
      const autoExpandCountries = shouldAutoExpandCountries(pkg);
      const shouldGenerateCountryVariants =
        autoExpandCountries || aliasSlugs.length > 0 || Object.keys(pkg.countryOverrides || {}).length > 0;
      const expandedKeywords = buildCountryKeywordVariants(pkg, shouldGenerateCountryVariants);
      const contentRecord = buildCompiledFaqContent({
        ...pkg.richContent,
        keywords: expandedKeywords,
        countrySeoVariants: shouldGenerateCountryVariants
          ? buildCountrySeoVariants(pkg, expandedKeywords)
          : {},
        countryOverrides: pkg.countryOverrides || {},
        ...(relatedSlugs.length > 0 ? { relatedSlugs } : {}),
      });

      const metaRecord = {
        publishStatus: pkg.publishStatus,
        countryScope: pkg.countryScope,
        distribution: distribution.kind,
        countryCodes: distribution.countryCodes,
        autoExpandCountries: distribution.autoExpandCountries,
        canonicalPath: pkg.canonicalPath || `/holidays/${slug}`,
        aliases: aliasSlugs,
      };
      const sourceRecord = {
        canonicalPath: pkg.canonicalPath || `/holidays/${slug}`,
        canonicalSource: pkg.canonicalSource || 'internal',
        sourceAuthority: pkg.sourceAuthority || inferSourceAuthority(coreRecord),
        queueOrder: pkg.queueOrder || index + 1,
        authoring: {
          eventDir: `src/data/holidays/events/${slug}`,
          packageFile: `src/data/holidays/events/${slug}/package.json`,
          researchFile: `src/data/holidays/events/${slug}/research.json`,
          qaFile: `src/data/holidays/events/${slug}/qa.json`,
        },
        generated: {
          coreBundle: 'src/data/holidays/generated/events-by-slug.json',
          contentBundle: 'src/data/holidays/generated/content-by-slug.json',
          runtimeBundle: 'src/data/holidays/generated/runtime-records-by-slug.json',
        },
        hasResearch: existsSync(entry.researchPath),
        hasQa: existsSync(entry.qaPath),
        lastModified: generatedAt,
      };

      eventsBySlug[slug] = coreRecord;
      contentBySlug[slug] = contentRecord;
      eventMetaBySlug[slug] = metaRecord;
      runtimeRecordsBySlug[slug] = {
        slug,
        core: coreRecord,
        content: contentRecord,
        meta: metaRecord,
        source: sourceRecord,
      };

      allEventsList.push(coreRecord);
      if (pkg.publishStatus === 'published') publishedEventsList.push(coreRecord);

      canonicalToAliases[slug] = aliasSlugs;
      const aliasMeta = buildAliasMeta(pkg, aliases);
      for (const [aliasSlug, meta] of Object.entries(aliasMeta)) {
        if (eventsBySlug[aliasSlug]) {
          throw new Error(
            `[generate-events-index] Alias "${aliasSlug}" conflicts with an existing canonical slug.`,
          );
        }
        if (aliasToCanonical[aliasSlug] && aliasToCanonical[aliasSlug] !== slug) {
          throw new Error(
            `[generate-events-index] Alias "${aliasSlug}" mapped to multiple canonicals.`,
          );
        }
        aliasToCanonical[aliasSlug] = slug;
        aliasMetaBySlug[aliasSlug] = meta;
      }

      return {
        id: coreRecord.id,
        slug,
        category: coreRecord.category,
        publishStatus: metaRecord.publishStatus,
        countryScope: metaRecord.countryScope,
        distribution: metaRecord.distribution,
        countryCodes: metaRecord.countryCodes,
        autoExpandCountries: metaRecord.autoExpandCountries,
        canonicalPath: sourceRecord.canonicalPath,
        canonicalSource: sourceRecord.canonicalSource,
        sourceAuthority: sourceRecord.sourceAuthority,
        queueOrder: sourceRecord.queueOrder,
        eventDir: sourceRecord.authoring.eventDir,
        packageFile: sourceRecord.authoring.packageFile,
        researchFile: sourceRecord.authoring.researchFile,
        qaFile: sourceRecord.authoring.qaFile,
        generatedCoreBundle: sourceRecord.generated.coreBundle,
        generatedContentBundle: sourceRecord.generated.contentBundle,
        generatedRuntimeBundle: sourceRecord.generated.runtimeBundle,
        aliasSlugs,
        hasResearch: sourceRecord.hasResearch,
        hasQa: sourceRecord.hasQa,
        lastModified: sourceRecord.lastModified,
      };
    });

  const manifest = {
    schemaVersion: 6,
    generatedAt,
    totalEvents: manifestEvents.length,
    totalPublished: manifestEvents.filter((event) => event.publishStatus === 'published').length,
    totalAliases: Object.keys(aliasToCanonical).length,
    supportedCountryCount: COUNTRY_CODES.length,
    supportedCountryCodes: COUNTRY_CODES,
    generatedArtifacts: {
      allEventsList: 'src/data/holidays/generated/all-events-list.json',
      publishedEventsList: 'src/data/holidays/generated/published-events-list.json',
      eventsBySlug: 'src/data/holidays/generated/events-by-slug.json',
      publishedEventsBySlug: 'src/data/holidays/generated/published-events-by-slug.json',
      contentBySlug: 'src/data/holidays/generated/content-by-slug.json',
      eventMetaBySlug: 'src/data/holidays/generated/event-meta-by-slug.json',
      runtimeRecordsBySlug: 'src/data/holidays/generated/runtime-records-by-slug.json',
      aliases: 'src/data/holidays/generated/aliases.json',
      aliasMeta: 'src/data/holidays/generated/alias-meta.json',
      canonicalToAliases: 'src/data/holidays/generated/canonical-to-aliases.json',
    },
    events: manifestEvents,
  };

  const publishedEventsBySlug = Object.fromEntries(
    publishedEventsList.map((event) => [event.slug, event]),
  );

  writeJson(GENERATED_MANIFEST_PATH, manifest);
  writeJson(GENERATED_ALL_EVENTS_LIST_PATH, allEventsList);
  writeJson(GENERATED_PUBLISHED_EVENTS_LIST_PATH, publishedEventsList);
  writeJson(GENERATED_EVENTS_BY_SLUG_PATH, eventsBySlug);
  writeJson(GENERATED_PUBLISHED_EVENTS_BY_SLUG_PATH, publishedEventsBySlug);
  writeJson(GENERATED_CONTENT_BY_SLUG_PATH, contentBySlug);
  writeJson(GENERATED_EVENT_META_BY_SLUG_PATH, eventMetaBySlug);
  writeJson(GENERATED_RUNTIME_RECORDS_BY_SLUG_PATH, runtimeRecordsBySlug);
  writeJson(GENERATED_ALIASES_PATH, aliasToCanonical);
  writeJson(GENERATED_ALIAS_META_PATH, aliasMetaBySlug);
  writeJson(GENERATED_CANONICAL_TO_ALIASES_PATH, canonicalToAliases);

  console.log(
    `[generate-events-index] Built ${manifestEvents.length} canonical events (${manifest.totalAliases} aliases, ${manifest.totalPublished} live, data source: src/data/holidays/events).`,
  );
}

main();
