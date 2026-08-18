/**
 * Google Search Console performance report — read-only, diagnostic only.
 *
 * Run:   npm run gsc:report
 *   or:  npm run gsc:report -- --json       (machine-readable output)
 *   or:  npm run gsc:report -- --refresh    (bypass the local cache)
 *   or:  npm run gsc:report -- --site=sc-domain:example.com  (only needed if
 *        the authorized account has more than one Search Console property)
 *
 * Uses the same `webmasters.readonly` OAuth authorization already set up in
 * `lib/auth.ts` (npm run gsc:list-sites) — no new auth flow, no new
 * credentials. This script only calls `searchanalytics.query` (read) via the
 * official `googleapis` client; the OAuth scope itself has no write access.
 *
 * Does NOT modify any website content, route, metadata, sitemap, robots.txt,
 * or production code. Does NOT act on any of the opportunity classifications
 * below — they're printed for a human to review, nothing more.
 */

import { getAuthorizedClient } from './lib/auth';
import {
  fetchRawReportData,
  isEnglishPageRow,
  sortByClicksDesc,
  sortByImpressionsDesc,
  listSites,
  type RawReportData,
} from './lib/report-data';
import { classifyOpportunities } from './lib/opportunities';
import { readFromCache, writeToCache, CACHE_TTL_MS } from './lib/cache';
import { printSectionHeader, printRows, formatInt, formatCtr, formatPosition } from './lib/format';
import { SEARCH_CONSOLE_LIMITATIONS as LIMITATIONS } from './lib/limitations';

const TOP_PAGES_LIMIT = 20;
const TOP_QUERIES_LIMIT = 50;
const TOP_COUNTRIES_LIMIT = 25;
const TOP_ENGLISH_PAGES_LIMIT = 20;
const TOP_ENGLISH_QUERIES_LIMIT = 50;
const REPORT_DAYS = 28;

function parseArgs(argv: string[]) {
  return {
    json: argv.includes('--json'),
    refresh: argv.includes('--refresh'),
    site: argv.find((a) => a.startsWith('--site='))?.slice('--site='.length),
  };
}

async function resolveSiteUrl(auth: Awaited<ReturnType<typeof getAuthorizedClient>>, requestedSite?: string): Promise<string> {
  const sites = await listSites(auth);
  if (sites.length === 0) {
    throw new Error('This Google account has no Search Console properties. Run `npm run gsc:list-sites` first.');
  }
  if (requestedSite) {
    const match = sites.find((s) => s.siteUrl === requestedSite);
    if (!match?.siteUrl) {
      throw new Error(
        `--site=${requestedSite} is not among this account's properties:\n` +
          sites.map((s) => `  - ${s.siteUrl}`).join('\n'),
      );
    }
    return match.siteUrl;
  }
  if (sites.length > 1) {
    throw new Error(
      'This account has more than one Search Console property — pass --site=<one of these>:\n' +
        sites.map((s) => `  - ${s.siteUrl}`).join('\n'),
    );
  }
  const siteUrl = sites[0]?.siteUrl;
  if (!siteUrl) {
    throw new Error('Search Console returned a property entry with no siteUrl.');
  }
  return siteUrl;
}

async function getReportData(
  auth: Awaited<ReturnType<typeof getAuthorizedClient>>,
  siteUrl: string,
  refresh: boolean,
): Promise<{ data: RawReportData; fromCache: boolean; cachedAt: string | null }> {
  const cacheKey = `search-console-report__${siteUrl}__last-${REPORT_DAYS}d`;

  if (!refresh) {
    const cached = await readFromCache<RawReportData>(cacheKey);
    if (cached && cached.ageMs < CACHE_TTL_MS) {
      return { data: cached.data, fromCache: true, cachedAt: cached.cachedAt };
    }
  }

  const data = await fetchRawReportData(auth, siteUrl, REPORT_DAYS);
  await writeToCache(cacheKey, data);
  return { data, fromCache: false, cachedAt: null };
}

function buildViews(data: RawReportData) {
  const topPagesByClicks = sortByClicksDesc(data.allPages).slice(0, TOP_PAGES_LIMIT);
  const topPagesByImpressions = sortByImpressionsDesc(data.allPages).slice(0, TOP_PAGES_LIMIT);
  const topQueries = sortByClicksDesc(data.allQueries).slice(0, TOP_QUERIES_LIMIT);
  const topCountries = sortByClicksDesc(data.countries).slice(0, TOP_COUNTRIES_LIMIT);

  const englishPages = data.allPages.filter(isEnglishPageRow);
  const englishPagesByClicks = sortByClicksDesc(englishPages).slice(0, TOP_ENGLISH_PAGES_LIMIT);
  const englishPagesByImpressions = sortByImpressionsDesc(englishPages).slice(0, TOP_ENGLISH_PAGES_LIMIT);
  const englishQueries = sortByImpressionsDesc(data.englishQueries).slice(0, TOP_ENGLISH_QUERIES_LIMIT);

  const opportunities = classifyOpportunities(data.allQueries, data.allPages);

  return {
    topPagesByClicks,
    topPagesByImpressions,
    topQueries,
    topCountries,
    englishPagesByClicks,
    englishPagesByImpressions,
    englishQueries,
    englishPagesTotalCount: englishPages.length,
    opportunities,
  };
}

function printHumanReport(data: RawReportData, views: ReturnType<typeof buildViews>, fromCache: boolean, cachedAt: string | null) {
  console.log(`\nGoogle Search Console report — ${data.siteUrl}`);
  console.log(`Window: ${data.dateRange.startDate} to ${data.dateRange.endDate} (${data.dateRange.requestedDays} days, ` +
    `shifted back ${data.dateRange.dataLagDaysApplied}d for Google's processing lag)`);
  console.log(
    fromCache
      ? `Source: local cache (fetched ${cachedAt}). Use --refresh to force a fresh pull.`
      : 'Source: live Search Console API pull (fresh).',
  );

  printSectionHeader('1. Overall performance');
  if (data.overall) {
    console.log(`  clicks=${formatInt(data.overall.clicks)}  impressions=${formatInt(data.overall.impressions)}  ` +
      `ctr=${formatCtr(data.overall.ctr)}  avg. position=${formatPosition(data.overall.position)}`);
  } else {
    console.log('  No data returned for this window (property may have too little traffic, or the window is entirely unprocessed).');
  }

  printSectionHeader(`2. Top pages by clicks (top ${TOP_PAGES_LIMIT})`);
  printRows(views.topPagesByClicks, 'No page-level rows returned for this window.');
  printSectionHeader(`2b. Top pages by impressions (top ${TOP_PAGES_LIMIT})`);
  printRows(views.topPagesByImpressions, 'No page-level rows returned for this window.');

  printSectionHeader(`3. Top queries by clicks (top ${TOP_QUERIES_LIMIT})`);
  printRows(views.topQueries, 'No query-level rows returned for this window.');

  printSectionHeader(`4. Top countries by clicks (top ${TOP_COUNTRIES_LIMIT})`);
  printRows(views.topCountries, 'No country-level rows returned for this window.');

  printSectionHeader(`5. English (/en/*) pages — by clicks (top ${TOP_ENGLISH_PAGES_LIMIT})`);
  printRows(
    views.englishPagesByClicks,
    'No /en/* pages have any recorded clicks or impressions in this window (expected — no English pages have shipped yet).',
  );
  printSectionHeader(`5b. English (/en/*) pages — by impressions (top ${TOP_ENGLISH_PAGES_LIMIT})`);
  printRows(
    views.englishPagesByImpressions,
    'No /en/* pages have any recorded impressions in this window (expected — no English pages have shipped yet).',
  );
  console.log(`  (${views.englishPagesTotalCount} distinct /en/* page${views.englishPagesTotalCount === 1 ? '' : 's'} total in this window)`);

  printSectionHeader(`6. English (/en/*) queries — sorted by impressions (top ${TOP_ENGLISH_QUERIES_LIMIT})`);
  printRows(
    views.englishQueries,
    'No queries are attributed to /en/* pages in this window (expected — no English pages have shipped yet).',
  );

  printSectionHeader('7. Investigation opportunities (diagnostic only — nothing here is acted on automatically)');
  console.log(`\n  A. High impressions + low CTR (impressions >= 500, ctr < 1.2%) — CTR optimization opportunity;`);
  console.log(`     investigate the actual SERP and search intent before changing any title/meta:`);
  printRows(views.opportunities.highImpressionsLowCtr.slice(0, 15), '  none found in this window.');
  console.log(`\n  B. Ranking opportunity (avg. position 4-20) — worth investigating for a push toward page 1:`);
  printRows(views.opportunities.rankingOpportunity.slice(0, 15), '  none found in this window.');
  console.log(`\n  C. Impressions but zero clicks (impressions >= 10) — investigation opportunity (SERP display,`);
  console.log(`     intent match, and title/meta are all plausible causes — don't assume which one without checking):`);
  printRows(views.opportunities.impressionsZeroClicks.slice(0, 15), '  none found in this window.');
  console.log(`\n  D. English pages with any impressions — evidence Google has discovered/is testing the page:`);
  printRows(views.opportunities.englishPagesWithImpressions.slice(0, 15), 'none — no /en/* pages have been published yet, so this is expected.');

  printSectionHeader('8. Data & API limitations (read before drawing conclusions)');
  LIMITATIONS.forEach((line) => console.log(`  - ${line}`));
  console.log('');
}

function toJson(data: RawReportData, views: ReturnType<typeof buildViews>, fromCache: boolean, cachedAt: string | null) {
  return {
    generatedAt: new Date().toISOString(),
    siteUrl: data.siteUrl,
    dateRange: data.dateRange,
    source: fromCache ? { fromCache: true, cachedAt } : { fromCache: false, cachedAt: null },
    overall: data.overall,
    topPages: { byClicks: views.topPagesByClicks, byImpressions: views.topPagesByImpressions },
    topQueries: views.topQueries,
    topCountries: views.topCountries,
    englishPages: {
      byClicks: views.englishPagesByClicks,
      byImpressions: views.englishPagesByImpressions,
      totalDistinctPages: views.englishPagesTotalCount,
    },
    englishQueries: views.englishQueries,
    opportunities: views.opportunities,
    limitations: LIMITATIONS,
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const auth = await getAuthorizedClient();
  const siteUrl = await resolveSiteUrl(auth, args.site);
  const { data, fromCache, cachedAt } = await getReportData(auth, siteUrl, args.refresh);
  const views = buildViews(data);

  if (args.json) {
    console.log(JSON.stringify(toJson(data, views, fromCache, cachedAt), null, 2));
    return;
  }
  printHumanReport(data, views, fromCache, cachedAt);
}

main().catch((error) => {
  console.error('\nGoogle Search Console report failed:');
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
