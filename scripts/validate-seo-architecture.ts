import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

import { CALCULATOR_HUBS, CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { POPULAR_PAIRS } from '@/components/time-diff/data/popularPairs';
import { ALL_RAW_EVENTS } from '@/lib/events';
import { ALL_GUIDES } from '@/lib/guides/data';
import { SITE_DESCRIPTION, SITE_HOME_TITLE, SITE_TITLE } from '@/lib/site-config';
import { INTENT_PATHWAYS } from '@/lib/site/intent-pathways';
import {
  ROOT_SITEMAP_PATHS,
  ROOT_SITEMAP_ROUTES,
  SITEMAP_INDEX_PATHS,
  WEBSITE_ARCHITECTURE_PATHS,
  findSeoRouteFamily,
  isPathCoveredBySeoArchitecture,
} from '@/lib/seo/site-architecture';

function uniqueValues(values: readonly string[]) {
  return Array.from(new Set(values));
}

const REQUIRED_ROOT_SITEMAP_PATHS = [
  '/date/calendar',
  '/date/calendar/hijri',
  '/date/country',
] as const;

const REQUIRED_SEGMENT_GUARDS = [
  { route: '/blog', dir: 'src/app/blog' },
  { route: '/blog/[slug]', dir: 'src/app/blog/[slug]' },
  { route: '/holidays', dir: 'src/app/holidays' },
  { route: '/holidays/[slug]', dir: 'src/app/holidays/[slug]' },
  { route: '/calculators', dir: 'src/app/calculators' },
  { route: '/date', dir: 'src/app/date' },
  { route: '/date/[year]/[month]/[day]', dir: 'src/app/date/[year]/[month]/[day]' },
  { route: '/date/hijri/[year]/[month]/[day]', dir: 'src/app/date/hijri/[year]/[month]/[day]' },
  { route: '/date/calendar', dir: 'src/app/date/calendar' },
  { route: '/date/calendar/[year]', dir: 'src/app/date/calendar/[year]' },
  { route: '/date/calendar/hijri', dir: 'src/app/date/calendar/hijri' },
  { route: '/date/calendar/hijri/[year]', dir: 'src/app/date/calendar/hijri/[year]' },
  { route: '/date/country', dir: 'src/app/date/country' },
  { route: '/date/country/[countrySlug]', dir: 'src/app/date/country/[countrySlug]' },
  { route: '/time-now', dir: 'src/app/time-now' },
  { route: '/time-now/[country]', dir: 'src/app/time-now/[country]' },
  { route: '/time-now/[country]/[city]', dir: 'src/app/time-now/[country]/[city]' },
  { route: '/mwaqit-al-salat', dir: 'src/app/mwaqit-al-salat' },
  { route: '/mwaqit-al-salat/[country]', dir: 'src/app/mwaqit-al-salat/[country]' },
  { route: '/mwaqit-al-salat/[country]/[city]', dir: 'src/app/mwaqit-al-salat/[country]/[city]' },
  { route: '/time-difference', dir: 'src/app/time-difference' },
  { route: '/time-difference/[from]/[to]', dir: 'src/app/time-difference/[from]/[to]' },
  { route: '/calculators/building/[country]', dir: 'src/app/calculators/building/[country]' },
  { route: '/calculators/sleep/[tool]', dir: 'src/app/calculators/sleep/[tool]' },
  { route: '/calculators/personal-finance/[tool]', dir: 'src/app/calculators/personal-finance/[tool]' },
] as const;

const INDEXABLE_ROOT_PAGE_RULES = [
  { route: '/date/calendar', filePath: 'src/app/date/calendar/page.tsx' },
  { route: '/date/calendar/hijri', filePath: 'src/app/date/calendar/hijri/page.tsx' },
  { route: '/date/country', filePath: 'src/app/date/country/page.tsx' },
] as const;

const LEGACY_ROUTE_FILES = [
  'src/app/guides/page.jsx',
  'src/app/guides/[slug]/page.jsx',
  'src/app/guides/sitemap.js',
] as const;
const LEGACY_BLOG_FEATURE_FILES = [
  'src/components/guides/BlogHubClient.jsx',
  'src/components/guides/BlogHubClient.module.css',
  'src/components/guides/GuidePage.jsx',
  'src/components/guides/GuidePage.module.css',
  'src/components/guides/GuidePageLoading.jsx',
  'src/lib/guides/read-time.js',
  'src/lib/guides/observability.js',
] as const;
const LEGACY_ARTICLE_PATH_PREFIXES = ['/guide', '/guides'] as const;
const CANONICAL_BLOG_SOURCE_FILES = [
  'src/lib/site/discovery.js',
  'src/lib/site/intent-pathways.ts',
  'src/lib/seo/discovery-links.js',
  'src/app/blog/loading.jsx',
  'src/app/blog/[slug]/loading.jsx',
  'src/components/blog/BlogHubPage.jsx',
  'src/components/blog/BlogHubClient.jsx',
  'src/components/blog/BlogArticlePage.jsx',
  'src/components/blog/BlogArticleView.jsx',
  'src/components/blog/BlogArticleLoading.jsx',
] as const;

function routeFileExists(routeDir: string, filename: string) {
  return existsSync(path.join(process.cwd(), routeDir, filename));
}

function assertRequiredSegmentGuardFiles(errors: string[]) {
  for (const segment of REQUIRED_SEGMENT_GUARDS) {
    const hasLoadingFile = (
      routeFileExists(segment.dir, 'loading.tsx') ||
      routeFileExists(segment.dir, 'loading.jsx')
    );
    const hasErrorFile = (
      routeFileExists(segment.dir, 'error.tsx') ||
      routeFileExists(segment.dir, 'error.jsx')
    );

    if (!hasLoadingFile) {
      errors.push(`Route segment is missing loading.tsx/loading.jsx: ${segment.route}`);
    }

    if (!hasErrorFile) {
      errors.push(`Route segment is missing error.tsx/error.jsx: ${segment.route}`);
    }
  }
}

function assertIndexableRootPages(errors: string[]) {
  for (const pageRule of INDEXABLE_ROOT_PAGE_RULES) {
    const fullPath = path.join(process.cwd(), pageRule.filePath);

    if (!existsSync(fullPath)) {
      errors.push(`Indexable root page file is missing: ${pageRule.filePath}`);
      continue;
    }

    const source = readFileSync(fullPath, 'utf8');

    if (source.includes('index: false')) {
      errors.push(`Indexable root page still contains noindex logic: ${pageRule.route}`);
    }

    if (source.includes('redirect(')) {
      errors.push(`Indexable root page still performs a redirect instead of rendering content: ${pageRule.route}`);
    }
  }
}

function assertLegacyRouteFilesRemoved(errors: string[]) {
  for (const filePath of LEGACY_ROUTE_FILES) {
    const fullPath = path.join(process.cwd(), filePath);

    if (existsSync(fullPath)) {
      errors.push(`Legacy route file must be removed so /blog stays canonical: ${filePath}`);
    }
  }
}

function assertLegacyBlogFeatureFilesRemoved(errors: string[]) {
  for (const filePath of LEGACY_BLOG_FEATURE_FILES) {
    const fullPath = path.join(process.cwd(), filePath);

    if (existsSync(fullPath)) {
      errors.push(`Legacy blog feature file must be removed so article UI stays canonical: ${filePath}`);
    }
  }
}

function isLegacyArticlePath(value: string) {
  const normalized = String(value || '').trim();

  return LEGACY_ARTICLE_PATH_PREFIXES.some((prefix) => (
    normalized === prefix || normalized.startsWith(`${prefix}/`)
  ));
}

function assertCanonicalBlogPaths(errors: string[]) {
  for (const guide of ALL_GUIDES) {
    if (!String(guide?.href || '').startsWith('/blog/')) {
      errors.push(`Guide href must stay on the canonical /blog path: ${guide?.href || '(missing href)'}`);
    }
  }

  const canonicalCollections = [
    { label: 'ROOT_SITEMAP_PATHS', values: ROOT_SITEMAP_PATHS },
    { label: 'WEBSITE_ARCHITECTURE_PATHS', values: WEBSITE_ARCHITECTURE_PATHS },
    {
      label: 'INTENT_PATHWAYS',
      values: INTENT_PATHWAYS.flatMap((pathway) => [pathway.ctaHref, ...pathway.links.map((link) => link.href)]),
    },
  ] as const;

  for (const collection of canonicalCollections) {
    const legacyPaths = collection.values.filter((value) => isLegacyArticlePath(value));

    if (legacyPaths.length > 0) {
      errors.push(`${collection.label} must not publish legacy article paths: ${legacyPaths.join(', ')}`);
    }
  }

  const legacyPathPatterns = [
    /['"`]\/guide['"`]/,
    /['"`]\/guide\//,
    /['"`]\/guides['"`]/,
    /['"`]\/guides\//,
    /id:\s*['"`]guides['"`]/,
    /@\/components\/guides\//,
    /@\/lib\/guides\/read-time/,
    /@\/lib\/guides\/observability/,
    /GuidePage\.module\.css/,
    /GuidePageLoading/,
  ];

  for (const filePath of CANONICAL_BLOG_SOURCE_FILES) {
    const fullPath = path.join(process.cwd(), filePath);

    if (!existsSync(fullPath)) {
      errors.push(`Canonical blog source file is missing: ${filePath}`);
      continue;
    }

    const source = readFileSync(fullPath, 'utf8');
    const hasLegacyPattern = legacyPathPatterns.some((pattern) => pattern.test(source));

    if (hasLegacyPattern) {
      errors.push(`Canonical blog source file still contains legacy guide path or taxonomy references: ${filePath}`);
    }
  }
}

const COVERAGE_SAMPLE_PATHS = uniqueValues([
  '/',
  '/fahras',
  '/time-now',
  '/time-now/saudi-arabia',
  '/time-now/saudi-arabia/riyadh',
  '/mwaqit-al-salat',
  '/mwaqit-al-salat/saudi-arabia',
  '/mwaqit-al-salat/saudi-arabia/riyadh',
  '/holidays',
  '/time-difference',
  `/time-difference/${POPULAR_PAIRS[0].from.slug}/${POPULAR_PAIRS[0].to.slug}`,
  '/date',
  '/date/today',
  '/date/converter',
  '/date/gregorian-to-hijri',
  '/date/hijri-to-gregorian',
  '/date/calendar',
  '/date/calendar/hijri',
  '/date/country',
  '/date/country/saudi-arabia',
  '/calculators',
  '/blog',
  '/about',
  '/editorial-policy',
  '/contact',
  '/privacy',
  '/terms',
  '/disclaimer',
  ...CALCULATOR_HUBS.map((hub) => hub.href),
  ...CALCULATOR_ROUTES.map((route) => route.href),
  ...ALL_GUIDES.map((guide) => guide.href),
  ...ALL_RAW_EVENTS.map((event) => `/holidays/${event.slug}`),
]);

function assertUnique(label: string, values: readonly string[], errors: string[]) {
  const duplicates = values.filter((value, index) => values.indexOf(value) !== index);
  const uniqueDuplicates = uniqueValues(duplicates);

  if (uniqueDuplicates.length > 0) {
    errors.push(`${label} contains duplicates: ${uniqueDuplicates.join(', ')}`);
  }
}

function assertTextLength(label: string, value: string, min: number, max: number, errors: string[]) {
  const normalized = String(value || '').trim();

  if (normalized.length < min || normalized.length > max) {
    errors.push(`${label} must be between ${min} and ${max} characters: "${normalized}"`);
  }
}

function assertCalculatorRegistryQuality(errors: string[]) {
  const calculatorHubTitles = CALCULATOR_HUBS.map((hub) => hub.title);
  const calculatorHubHrefs = CALCULATOR_HUBS.map((hub) => hub.href);
  const calculatorRouteHrefs = CALCULATOR_ROUTES.map((route) => route.href);

  assertUnique('CALCULATOR_HUBS titles', calculatorHubTitles, errors);
  assertUnique('CALCULATOR_HUBS hrefs', calculatorHubHrefs, errors);
  assertUnique('CALCULATOR_ROUTES hrefs', calculatorRouteHrefs, errors);

  for (const hub of CALCULATOR_HUBS) {
    assertTextLength(`Calculator hub title ${hub.href}`, hub.title, 20, 60, errors);
    assertTextLength(`Calculator hub description ${hub.href}`, hub.description, 80, 200, errors);
  }

  for (const route of CALCULATOR_ROUTES) {
    assertTextLength(`Calculator route description ${route.href}`, route.description, 60, 220, errors);
  }
}

function assertRootMetadataQuality(errors: string[]) {
  if (SITE_TITLE !== SITE_HOME_TITLE) {
    errors.push('SITE_TITLE must match SITE_HOME_TITLE to avoid duplicating the brand in default page titles');
  }

  assertTextLength('SITE_HOME_TITLE', SITE_HOME_TITLE, 30, 60, errors);
  assertTextLength('SITE_DESCRIPTION', SITE_DESCRIPTION, 110, 180, errors);
}

function assertIntentPathwaysQuality(errors: string[]) {
  const pathwayIds = INTENT_PATHWAYS.map((pathway) => pathway.id);
  const pathwayCtaHrefs = INTENT_PATHWAYS.map((pathway) => pathway.ctaHref);
  const pathwayLinkHrefs = INTENT_PATHWAYS.flatMap((pathway) => pathway.links.map((link) => link.href));

  assertUnique('INTENT_PATHWAYS ids', pathwayIds, errors);
  assertUnique('INTENT_PATHWAYS CTA hrefs', pathwayCtaHrefs, errors);
  assertUnique('INTENT_PATHWAYS link hrefs', pathwayLinkHrefs, errors);

  for (const pathway of INTENT_PATHWAYS) {
    if (pathway.links.length < 3) {
      errors.push(`Intent pathway ${pathway.id} must contain at least 3 links`);
    }

    assertTextLength(`Intent pathway title ${pathway.id}`, pathway.title, 24, 80, errors);
    assertTextLength(`Intent pathway description ${pathway.id}`, pathway.description, 70, 220, errors);
  }
}

function main() {
  const errors: string[] = [];
  const rootPaths = ROOT_SITEMAP_ROUTES.map((route: { path: string }) => route.path);

  assertUnique('ROOT_SITEMAP_ROUTES', rootPaths, errors);
  assertUnique('WEBSITE_ARCHITECTURE_PATHS', WEBSITE_ARCHITECTURE_PATHS, errors);
  assertUnique('SITEMAP_INDEX_PATHS', SITEMAP_INDEX_PATHS, errors);
  assertUnique('COVERAGE_SAMPLE_PATHS', COVERAGE_SAMPLE_PATHS, errors);

  if (!SITEMAP_INDEX_PATHS.includes('/sitemap.xml')) {
    errors.push('SITEMAP_INDEX_PATHS must include /sitemap.xml');
  }

  if (!rootPaths.includes('/blog')) {
    errors.push('ROOT_SITEMAP_ROUTES must include /blog');
  }

  for (const requiredPath of REQUIRED_ROOT_SITEMAP_PATHS) {
    if (!rootPaths.includes(requiredPath)) {
      errors.push(`ROOT_SITEMAP_ROUTES must include ${requiredPath}`);
    }
  }

  for (const path of WEBSITE_ARCHITECTURE_PATHS) {
    if (!ROOT_SITEMAP_PATHS.includes(path)) {
      errors.push(`WEBSITE_ARCHITECTURE_PATHS entry is missing from ROOT_SITEMAP_ROUTES: ${path}`);
    }
  }

  assertRequiredSegmentGuardFiles(errors);
  assertIndexableRootPages(errors);
  assertLegacyRouteFilesRemoved(errors);
  assertLegacyBlogFeatureFilesRemoved(errors);
  assertCanonicalBlogPaths(errors);
  assertCalculatorRegistryQuality(errors);
  assertRootMetadataQuality(errors);
  assertIntentPathwaysQuality(errors);

  const uncoveredPaths = COVERAGE_SAMPLE_PATHS.filter((path) => !isPathCoveredBySeoArchitecture(path));
  for (const path of uncoveredPaths) {
    errors.push(`Important route is not covered by the SEO route architecture: ${path}`);
  }

  const coverageCounts = new Map<string, number>();
  for (const path of COVERAGE_SAMPLE_PATHS) {
    const family = findSeoRouteFamily(path);
    const key = family?.id || 'uncovered';
    coverageCounts.set(key, (coverageCounts.get(key) || 0) + 1);
  }

  if (errors.length > 0) {
    console.error('[seo:validate] failed');
    for (const error of errors) {
      console.error(`- ${error}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log('[seo:validate] ok');
  console.log(
    JSON.stringify(
      {
        rootPaths: rootPaths.length,
        websiteParts: WEBSITE_ARCHITECTURE_PATHS.length,
        sitemapEndpoints: SITEMAP_INDEX_PATHS.length,
        sampledPaths: COVERAGE_SAMPLE_PATHS.length,
        coverageByFamily: Object.fromEntries(coverageCounts),
      },
      null,
      2,
    ),
  );
}

main();
