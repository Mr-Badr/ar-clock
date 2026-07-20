import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

import { CALCULATOR_HUBS, CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { ALL_CALCULATOR_SEO_ROUTES } from '@/lib/seo/calculator-route-manifest';
import { getFinancePageContent } from '@/lib/calculators/finance-page-content';
import { POPULAR_PAIRS } from '@/components/time-diff/data/popularPairs';
import { buildGregorianYearCalendar, buildHijriYearCalendar } from '@/lib/date-calendar';
import { convertDate } from '@/lib/date-adapter';
import { ALL_RAW_EVENTS } from '@/lib/events';
import { ALL_GUIDES } from '@/lib/guides/data';
import { SITE_DESCRIPTION, SITE_HOME_TITLE, SITE_TITLE } from '@/lib/site-config';
import { INTENT_PATHWAYS } from '@/lib/site/intent-pathways';
import {
  GREGORIAN_CALENDAR_INDEXABLE_RANGE,
  HIJRI_CALENDAR_INDEXABLE_RANGE,
  getGregorianYearSitemapDays,
  getHijriYearSitemapDays,
} from '@/lib/seo/date-indexing';
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
const MAX_SITEMAP_INDEX_ENTRIES = 50000;
const APP_PAGE_EXTENSIONS = new Set(['.js', '.jsx', '.ts', '.tsx']);
const INTENTIONALLY_NON_INDEXABLE_PAGE_ROUTES = new Map([
  ['/offline', 'src/app/offline/page.tsx'],
  ['/search', 'src/app/search/page.jsx'],
  ['/embed/prayer-times/[country]/[city]', 'src/app/embed/prayer-times/[country]/[city]/page.jsx'],
  ['/embed/calculators/[slug]', 'src/app/embed/calculators/[slug]/page.jsx'],
  ['/embed/countdown/[slug]', 'src/app/embed/countdown/[slug]/page.jsx'],
]);

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

const DATE_INDEXATION_PAGE_RULES = [
  {
    filePath: 'src/app/date/[year]/[month]/[day]/page.tsx',
    helper: 'isSeoIndexableGregorianDate',
  },
  {
    filePath: 'src/app/date/hijri/[year]/[month]/[day]/page.tsx',
    helper: 'isSeoIndexableHijriDate',
  },
  {
    filePath: 'src/app/date/calendar/[year]/page.tsx',
    helper: 'isSeoIndexableGregorianCalendarYear',
  },
  {
    filePath: 'src/app/date/calendar/hijri/[year]/page.tsx',
    helper: 'isSeoIndexableHijriCalendarYear',
  },
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

function routeOrAncestorFileExists(routeDir: string, filenames: readonly string[]) {
  const appRoot = path.resolve(process.cwd(), 'src/app');
  let currentDir = path.resolve(process.cwd(), routeDir);

  while (currentDir === appRoot || currentDir.startsWith(`${appRoot}${path.sep}`)) {
    if (filenames.some((filename) => existsSync(path.join(currentDir, filename)))) {
      return true;
    }

    if (currentDir === appRoot) break;
    currentDir = path.dirname(currentDir);
  }

  return false;
}

function collectAppPageFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      return collectAppPageFiles(entryPath);
    }

    const extension = path.extname(entry.name);
    return entry.name.startsWith('page.') && APP_PAGE_EXTENSIONS.has(extension)
      ? [entryPath]
      : [];
  });
}

function getRoutePatternFromPageFile(filePath: string) {
  const appRoot = path.join(process.cwd(), 'src/app');
  const relativePath = path.relative(appRoot, filePath);
  const routeDirectory = path.dirname(relativePath);
  const segments = routeDirectory === '.'
    ? []
    : routeDirectory
        .split(path.sep)
        .filter((segment) => !segment.startsWith('(') && !segment.startsWith('@'));

  return segments.length > 0 ? `/${segments.join('/')}` : '/';
}

function assertPageRouteIndexabilityDecisions(errors: string[]) {
  const appRoot = path.join(process.cwd(), 'src/app');
  const pageFiles = collectAppPageFiles(appRoot);
  const discoveredRoutes = new Set<string>();

  for (const filePath of pageFiles) {
    const route = getRoutePatternFromPageFile(filePath);
    discoveredRoutes.add(route);
    const expectedNonIndexableFile = INTENTIONALLY_NON_INDEXABLE_PAGE_ROUTES.get(route);

    if (expectedNonIndexableFile) {
      const relativeFilePath = path.relative(process.cwd(), filePath);
      if (relativeFilePath !== expectedNonIndexableFile) {
        errors.push(
          `Non-indexable route ${route} moved from ${expectedNonIndexableFile} to ${relativeFilePath}; update its explicit policy.`,
        );
        continue;
      }

      const source = readFileSync(filePath, 'utf8');
      if (!source.includes('index: false')) {
        errors.push(`Intentionally non-indexable route is missing robots index:false: ${route}`);
      }
      continue;
    }

    if (!isPathCoveredBySeoArchitecture(route)) {
      errors.push(
        `Page route has no sitemap/indexability decision: ${route} (${path.relative(process.cwd(), filePath)})`,
      );
    }
  }

  for (const [route, expectedFile] of INTENTIONALLY_NON_INDEXABLE_PAGE_ROUTES) {
    if (!discoveredRoutes.has(route)) {
      errors.push(`Declared non-indexable page route is missing: ${route} (${expectedFile})`);
    }
  }

  return {
    pageFiles: pageFiles.length,
    explicitlyNonIndexableRoutes: INTENTIONALLY_NON_INDEXABLE_PAGE_ROUTES.size,
  };
}

function assertRequiredSegmentGuardFiles(errors: string[]) {
  for (const segment of REQUIRED_SEGMENT_GUARDS) {
    const hasLoadingFile = routeOrAncestorFileExists(
      segment.dir,
      ['loading.tsx', 'loading.jsx'],
    );
    const hasErrorFile = (
      routeFileExists(segment.dir, 'error.tsx') ||
      routeFileExists(segment.dir, 'error.jsx')
    );

    if (!hasLoadingFile) {
      errors.push(`Route segment and its ancestors are missing loading.tsx/loading.jsx: ${segment.route}`);
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

function assertDateIndexationPolicies(errors: string[]) {
  for (const rule of DATE_INDEXATION_PAGE_RULES) {
    const fullPath = path.join(process.cwd(), rule.filePath);
    if (!existsSync(fullPath)) {
      errors.push(`Date page file is missing: ${rule.filePath}`);
      continue;
    }

    const source = readFileSync(fullPath, 'utf8');
    if (!source.includes(rule.helper)) {
      errors.push(`Date page does not use ${rule.helper} for robots metadata: ${rule.filePath}`);
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
  '/time-difference/converter',
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

function assertPublishedHolidayQuality(errors: string[]) {
  const MIN_RELATED_SLUGS = 3;
  const MIN_FAQ_ITEMS = 3;

  const published = ALL_RAW_EVENTS.filter(
    (event) => (event as Record<string, unknown>)?.publishStatus === 'published',
  );

  for (const event of published) {
    const e = event as Record<string, unknown>;
    const relatedSlugs = Array.isArray(e.relatedSlugs) ? e.relatedSlugs : [];
    const faq = Array.isArray(e.faq) ? e.faq : Array.isArray(e.faqItems) ? e.faqItems : [];

    if (relatedSlugs.length < MIN_RELATED_SLUGS) {
      errors.push(
        `[F2] Holiday /holidays/${e.slug} has only ${relatedSlugs.length} relatedSlugs (min ${MIN_RELATED_SLUGS}). Add internal links to meet the quality gate.`,
      );
    }

    if (faq.length < MIN_FAQ_ITEMS) {
      errors.push(
        `[F2] Holiday /holidays/${e.slug} has only ${faq.length} FAQ items (min ${MIN_FAQ_ITEMS}). Add more FAQ entries to meet the quality gate.`,
      );
    }
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

function assertCalculatorSitemapCompleteness(errors: string[]) {
  // Family-pattern coverage (isPathCoveredBySeoArchitecture) is NOT enough: a
  // calculator page can match the /calculators/* family yet never be enumerated
  // in the sitemap manifest, so Google receives no crawl signal for it. This guard
  // asserts every page-backed calculator route/hub href is explicitly present in
  // ALL_CALCULATOR_SEO_ROUTES, preventing a new calculator from silently shipping
  // un-indexed (the root cause of the calculator section's zero organic traffic).
  const manifestPaths = new Set(ALL_CALCULATOR_SEO_ROUTES.map((route) => route.path));
  const indexableHrefs = [
    ...CALCULATOR_HUBS.map((hub) => hub.href),
    ...CALCULATOR_ROUTES.map((route) => route.href),
  ];

  for (const href of indexableHrefs) {
    // Dynamic per-country building pages are covered by BUILDING_COUNTRY_CALCULATOR_SEO_ROUTES.
    if (/^\/calculators\/building\/[^/]+$/.test(href) && !manifestPaths.has(href)) {
      const isStaticBuildingChild = ['cement', 'rebar', 'tiles', 'paint'].some(
        (slug) => href === `/calculators/building/${slug}`,
      );
      if (!isStaticBuildingChild) continue;
    }

    if (!manifestPaths.has(href)) {
      errors.push(
        `Calculator route ${href} is missing from ALL_CALCULATOR_SEO_ROUTES (src/lib/seo/calculator-route-manifest.js); it would ship un-indexed. Add it to STATIC_CALCULATOR_SEO_ROUTES.`,
      );
    }
  }
}

function assertCalculatorContentCompleteness(errors: string[]) {
  // Every entry in finance-page-content.js must have faqItems (≥6) and a searchProfile
  // so it can build FAQPage schema and keyword coverage. An empty entry silently ships
  // a calculator with no FAQ schema and no keyword targeting.
  const CONTENT_SLUGS = [
    'monthly-installment', 'end-of-service-benefits', 'annual-leave', 'gpa-to-percent',
    'pregnancy-weeks', 'net-salary', 'iqama', 'electricity-bill', 'inheritance',
    'saudi-pay-dates', 'vat', 'zakat', 'percentage', 'gpa', 'investment', 'fasting',
    'pregnancy', 'bmi', 'salary', 'ovulation',
  ];

  for (const slug of CONTENT_SLUGS) {
    const content = getFinancePageContent(slug);
    if (!content) continue;
    const faqCount = Array.isArray(content.faqItems) ? content.faqItems.length : 0;
    if (faqCount < 6) {
      errors.push(
        `Calculator ${slug} in finance-page-content.js has ${faqCount} FAQ items (minimum 6). Add faqItems[] so FAQPage schema and search coverage work.`,
      );
    }
    if (!content.searchProfile) {
      errors.push(
        `Calculator ${slug} in finance-page-content.js is missing searchProfile. Add searchProfile{} for keyword coverage and internal search discovery.`,
      );
    }
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

function assertDateCalendarModels(errors: string[]) {
  for (
    let year = GREGORIAN_CALENDAR_INDEXABLE_RANGE.minYear;
    year <= GREGORIAN_CALENDAR_INDEXABLE_RANGE.maxYear;
    year += 1
  ) {
    try {
      const calendar = buildGregorianYearCalendar(year);
      const expectedDays = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0) ? 366 : 365;

      if (calendar.months.length !== 12 || calendar.totalDays !== expectedDays) {
        errors.push(
          `Gregorian calendar model ${year} is incomplete: months=${calendar.months.length}, days=${calendar.totalDays}.`,
        );
      }

      if (calendar.months.some((month) => month.days.length !== month.daysInMonth)) {
        errors.push(`Gregorian calendar model ${year} contains an incomplete month.`);
      }

      const sitemapDays = getGregorianYearSitemapDays(year);
      if (sitemapDays.length !== expectedDays) {
        errors.push(`Gregorian daily sitemap ${year} contains ${sitemapDays.length} URLs instead of ${expectedDays}.`);
      }

      for (const date of [`${year}-01-01`, `${year}-06-15`, `${year}-12-31`]) {
        for (const method of ['umalqura', 'astronomical', 'civil'] as const) {
          convertDate({ date, toCalendar: 'hijri', method });
        }
      }
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error);
      errors.push(`Gregorian calendar model ${year} failed: ${reason}`);
    }
  }

  for (
    let year = HIJRI_CALENDAR_INDEXABLE_RANGE.minYear;
    year <= HIJRI_CALENDAR_INDEXABLE_RANGE.maxYear;
    year += 1
  ) {
    try {
      const calendar = buildHijriYearCalendar(year);

      if (
        calendar.months.length !== 12
        || calendar.totalDays < 354
        || calendar.totalDays > 355
      ) {
        errors.push(
          `Hijri calendar model ${year} is incomplete: months=${calendar.months.length}, days=${calendar.totalDays}.`,
        );
      }

      if (calendar.months.some((month) => month.days.length !== month.daysInMonth)) {
        errors.push(`Hijri calendar model ${year} contains an incomplete month.`);
      }

      const sitemapDays = getHijriYearSitemapDays(year);
      if (sitemapDays.length !== calendar.totalDays) {
        errors.push(
          `Hijri daily sitemap ${year} contains ${sitemapDays.length} URLs instead of ${calendar.totalDays}.`,
        );
      }
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error);
      errors.push(`Hijri calendar model ${year} failed: ${reason}`);
    }
  }
}

function main() {
  const errors: string[] = [];
  const rootPaths = ROOT_SITEMAP_ROUTES.map((route: { path: string }) => route.path);
  const pageRouteAudit = assertPageRouteIndexabilityDecisions(errors);

  assertUnique('ROOT_SITEMAP_ROUTES', rootPaths, errors);
  assertUnique('WEBSITE_ARCHITECTURE_PATHS', WEBSITE_ARCHITECTURE_PATHS, errors);
  assertUnique('SITEMAP_INDEX_PATHS', SITEMAP_INDEX_PATHS, errors);
  assertUnique('COVERAGE_SAMPLE_PATHS', COVERAGE_SAMPLE_PATHS, errors);

  if (!SITEMAP_INDEX_PATHS.includes('/sitemap.xml')) {
    errors.push('SITEMAP_INDEX_PATHS must include /sitemap.xml');
  }

  if (SITEMAP_INDEX_PATHS.length > MAX_SITEMAP_INDEX_ENTRIES) {
    errors.push(
      `SITEMAP_INDEX_PATHS contains ${SITEMAP_INDEX_PATHS.length} entries; sitemap indexes must stay at or below ${MAX_SITEMAP_INDEX_ENTRIES}.`,
    );
  }

  for (const sitemapPath of ['/date/gregorian/sitemap.xml', '/date/hijri/sitemap.xml']) {
    if (!SITEMAP_INDEX_PATHS.includes(sitemapPath)) {
      errors.push(`SITEMAP_INDEX_PATHS is missing rolling date sitemap: ${sitemapPath}`);
    }
  }

  if (SITEMAP_INDEX_PATHS.some((pathValue) => /^\/date\/(?:gregorian|hijri)\/sitemap\/\d{4}$/.test(pathValue))) {
    errors.push('SITEMAP_INDEX_PATHS must not expose full-range daily date year sitemaps.');
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
  assertDateIndexationPolicies(errors);
  assertLegacyRouteFilesRemoved(errors);
  assertLegacyBlogFeatureFilesRemoved(errors);
  assertCanonicalBlogPaths(errors);
  assertPublishedHolidayQuality(errors);
  assertCalculatorRegistryQuality(errors);
  assertCalculatorSitemapCompleteness(errors);
  assertCalculatorContentCompleteness(errors);
  assertRootMetadataQuality(errors);
  assertIntentPathwaysQuality(errors);
  assertDateCalendarModels(errors);

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
        pageRoutes: pageRouteAudit.pageFiles,
        explicitlyNonIndexablePageRoutes: pageRouteAudit.explicitlyNonIndexableRoutes,
        coverageByFamily: Object.fromEntries(coverageCounts),
      },
      null,
      2,
    ),
  );
}

main();
