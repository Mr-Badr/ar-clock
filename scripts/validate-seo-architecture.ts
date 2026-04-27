import { CALCULATOR_HUBS, CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { POPULAR_PAIRS } from '@/components/time-diff/data/popularPairs';
import { ALL_RAW_EVENTS } from '@/lib/events';
import { ALL_GUIDES } from '@/lib/guides/data';
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
  '/economie',
  '/economie/market-hours',
  '/guides',
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
  '/economie/us-market-open',
  '/economie/gold-market-hours',
  '/economie/forex-sessions',
  '/economie/stock-markets',
  '/economie/market-clock',
  '/economie/best-trading-time',
]);

function assertUnique(label: string, values: readonly string[], errors: string[]) {
  const duplicates = values.filter((value, index) => values.indexOf(value) !== index);
  const uniqueDuplicates = uniqueValues(duplicates);

  if (uniqueDuplicates.length > 0) {
    errors.push(`${label} contains duplicates: ${uniqueDuplicates.join(', ')}`);
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

  if (!rootPaths.includes('/guides')) {
    errors.push('ROOT_SITEMAP_ROUTES must include /guides');
  }

  for (const path of WEBSITE_ARCHITECTURE_PATHS) {
    if (!ROOT_SITEMAP_PATHS.includes(path)) {
      errors.push(`WEBSITE_ARCHITECTURE_PATHS entry is missing from ROOT_SITEMAP_ROUTES: ${path}`);
    }
  }

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
