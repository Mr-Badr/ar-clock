/**
 * SEO opportunity diagnostics derived from existing Search Console data —
 * read-only, diagnostic only, nothing here changes any page.
 *
 * Run:   npm run gsc:opportunities
 *   or:  npm run --silent gsc:opportunities -- --json
 *   or:  npm run gsc:opportunities -- --refresh
 *   or:  npm run gsc:opportunities -- --site=sc-domain:example.com
 *
 * Reuses the exact same `webmasters.readonly` OAuth authorization as
 * `gsc:list-sites`/`gsc:report` (lib/auth.ts) — no new auth flow, no new
 * credential. Only calls `searchanalytics.query` (read).
 *
 * Everything below is phrased as an "investigation opportunity," never a
 * confirmed problem — see lib/limitations.ts and lib/opportunity-scoring.ts
 * for exactly what is and isn't being claimed.
 */

import { getAuthorizedClient } from './lib/auth';
import { computeDateRange, listSites, type DateRange } from './lib/report-data';
import { fetchQueryPageRows, isEnglishPage, type QueryPageRow } from './lib/query-page-data';
import { fetchCountryBreakdown, fetchDeviceBreakdown, type DimensionRow } from './lib/drilldowns';
import {
  buildQueryPageOpportunities,
  buildPageOpportunities,
  detectCannibalization,
  MIN_IMPORTANT_ROW_IMPRESSIONS,
  MIN_MEANINGFUL_QUERY_IMPRESSIONS,
  MIN_CANNIBALIZATION_IMPRESSIONS_PER_PAGE,
  type QueryPageOpportunity,
  type PageOpportunity,
  type CannibalizationCase,
} from './lib/opportunity-aggregation';
import { SCORING_EXPLANATION, SCORE_WEIGHTS, CTR_REFERENCE_FLOOR_PERCENT } from './lib/opportunity-scoring';
import { SEARCH_CONSOLE_LIMITATIONS, OPPORTUNITY_ENGINE_LIMITATIONS } from './lib/limitations';
import { readFromCache, writeToCache, CACHE_TTL_MS } from './lib/cache';
import { formatInt, formatCtr, formatPosition } from './lib/format';

const REPORT_DAYS = 28;
const DRILLDOWN_TOP_N = 8; // how many top-scoring opportunities get country/device breakdowns

// Terminal display caps (kept small for readability); JSON output uses the
// larger *_JSON caps so downstream tooling gets a fuller dataset.
const TERM_QUERY_PAGE_LIMIT = 30;
const TERM_PAGE_LIMIT = 20;
const TERM_CANNIBALIZATION_LIMIT = 15;
const JSON_QUERY_PAGE_LIMIT = 200;
const JSON_PAGE_LIMIT = 100;
const JSON_CANNIBALIZATION_LIMIT = 100;

type CachedBundle = {
  dateRange: DateRange;
  rows: QueryPageRow[];
  truncated: boolean;
  pagesFetched: number;
  rowLimitPerPage: number;
  drilldowns: {
    country: Record<string, DimensionRow[]>;
    device: Record<string, DimensionRow[]>;
  };
};

function pairKey(query: string, page: string): string {
  return `${query}||${page}`;
}

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
      throw new Error(`--site=${requestedSite} is not among this account's properties:\n` + sites.map((s) => `  - ${s.siteUrl}`).join('\n'));
    }
    return match.siteUrl;
  }
  if (sites.length > 1) {
    throw new Error('This account has more than one Search Console property — pass --site=<one of these>:\n' + sites.map((s) => `  - ${s.siteUrl}`).join('\n'));
  }
  const siteUrl = sites[0]?.siteUrl;
  if (!siteUrl) throw new Error('Search Console returned a property entry with no siteUrl.');
  return siteUrl;
}

async function getBundle(
  auth: Awaited<ReturnType<typeof getAuthorizedClient>>,
  siteUrl: string,
  refresh: boolean,
): Promise<{ bundle: CachedBundle; fromCache: boolean; cachedAt: string | null }> {
  const cacheKey = `search-console-opportunities__${siteUrl}__last-${REPORT_DAYS}d`;

  if (!refresh) {
    const cached = await readFromCache<CachedBundle>(cacheKey);
    if (cached && cached.ageMs < CACHE_TTL_MS) {
      return { bundle: cached.data, fromCache: true, cachedAt: cached.cachedAt };
    }
  }

  const dateRange = computeDateRange(REPORT_DAYS);
  const { rows, truncated, pagesFetched, rowLimitPerPage } = await fetchQueryPageRows(auth, siteUrl, dateRange);

  // Score first so we know which pairs are worth spending drill-down calls on.
  const scored = buildQueryPageOpportunities(rows);
  const topForDrilldown = scored.slice(0, DRILLDOWN_TOP_N);

  const country: Record<string, DimensionRow[]> = {};
  const device: Record<string, DimensionRow[]> = {};
  for (const opp of topForDrilldown) {
    const key = pairKey(opp.query, opp.page);
    const [countryRows, deviceRows] = await Promise.all([
      fetchCountryBreakdown(auth, siteUrl, dateRange, opp.query, opp.page),
      fetchDeviceBreakdown(auth, siteUrl, dateRange, opp.query, opp.page),
    ]);
    country[key] = countryRows;
    device[key] = deviceRows;
  }

  const bundle: CachedBundle = { dateRange, rows, truncated, pagesFetched, rowLimitPerPage, drilldowns: { country, device } };
  await writeToCache(cacheKey, bundle);
  return { bundle, fromCache: false, cachedAt: null };
}

/** Best-effort, read-only cross-check against a cached `gsc:report` pull for the same window — no new API call. */
async function crossCheckAgainstReportCache(siteUrl: string, dateRange: DateRange, derivedClicks: number, derivedImpressions: number) {
  const reportCacheKey = `search-console-report__${siteUrl}__last-${REPORT_DAYS}d`;
  const cached = await readFromCache<{ dateRange: DateRange; overall: { clicks: number; impressions: number } | null }>(reportCacheKey);
  if (!cached?.data.overall) return null;
  if (cached.data.dateRange.startDate !== dateRange.startDate || cached.data.dateRange.endDate !== dateRange.endDate) return null;
  const officialClicks = cached.data.overall.clicks;
  const officialImpressions = cached.data.overall.impressions;
  const clicksDelta = officialClicks - derivedClicks;
  const impressionsDelta = officialImpressions - derivedImpressions;
  return {
    officialClicks,
    officialImpressions,
    derivedClicks,
    derivedImpressions,
    clicksDelta,
    impressionsDelta,
    clicksDeltaPercent: officialClicks > 0 ? Math.round((clicksDelta / officialClicks) * 1000) / 10 : 0,
    impressionsDeltaPercent: officialImpressions > 0 ? Math.round((impressionsDelta / officialImpressions) * 1000) / 10 : 0,
  };
}

function printQueryPageRow(o: QueryPageOpportunity) {
  const flags = [
    o.flags.highImpressionsLowCtr ? 'CTR-opportunity' : null,
    o.flags.rankingOpportunity ? 'ranking-opportunity' : null,
    o.flags.impressionsZeroClicks ? 'zero-clicks' : null,
  ]
    .filter(Boolean)
    .join(', ');
  console.log(
    `  score=${o.score.toFixed(1).padStart(5)} clicks=${formatInt(o.clicks).padEnd(6)} impr=${formatInt(o.impressions).padEnd(8)} ` +
      `ctr=${formatCtr(o.ctr).padEnd(7)} pos=${formatPosition(o.position).padEnd(5)} ${flags ? `[${flags}] ` : ''}` +
      `\n      query: ${o.query}\n      page:  ${o.page}`,
  );
}

function printPageBlock(p: PageOpportunity) {
  const flags = [
    p.flags.A_highImpressionsRankingOpportunity ? 'A:ranking-opportunity' : null,
    p.flags.B_highImpressionsLowCtr ? 'B:CTR-opportunity' : null,
    p.flags.C_highImpressionsNearZeroClicks ? 'C:near-zero-clicks' : null,
    p.flags.D_manyQueriesWeakPosition ? 'D:weak-position-many-queries' : null,
    p.flags.E_manyDistinctQueriesPossibleMixedIntent ? 'E:possible-mixed-intent(heuristic)' : null,
  ]
    .filter(Boolean)
    .join(', ');
  console.log(
    `\n  score=${p.score.toFixed(1)}  ${p.page}\n` +
      `    clicks=${formatInt(p.clicks)} impressions=${formatInt(p.impressions)} ctr=${formatCtr(p.ctr)} avg.position=${formatPosition(p.position)}\n` +
      `    meaningful queries: ${p.meaningfulQueryCount} (of ${p.totalQueryCount} total)` +
      (flags ? `\n    flags: ${flags}` : ''),
  );
  if (p.topQueries.length > 0) {
    console.log('    top queries:');
    p.topQueries.forEach((q) => {
      console.log(
        `      - "${q.query}" — clicks=${formatInt(q.clicks)} impr=${formatInt(q.impressions)} ctr=${formatCtr(q.ctr)} pos=${formatPosition(q.position)}`,
      );
    });
  }
}

function printCannibalizationCase(c: CannibalizationCase) {
  console.log(`\n  "${c.query}" — combined impressions across ${c.pages.length} pages: ${formatInt(c.totalImpressions)}`);
  c.pages.forEach((p) => {
    console.log(`      → ${p.page}  clicks=${formatInt(p.clicks)} impr=${formatInt(p.impressions)} ctr=${formatCtr(p.ctr)} pos=${formatPosition(p.position)}`);
  });
}

function printDrilldownTable(rows: DimensionRow[], label: string) {
  if (rows.length === 0) {
    console.log(`      ${label}: no rows returned.`);
    return;
  }
  const parts = rows
    .slice(0, 6)
    .map((r) => `${r.key || '(unknown)'}=${formatInt(r.clicks)}clicks/${formatInt(r.impressions)}impr`)
    .join(', ');
  console.log(`      ${label}: ${parts}`);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const auth = await getAuthorizedClient();
  const siteUrl = await resolveSiteUrl(auth, args.site);
  const { bundle, fromCache, cachedAt } = await getBundle(auth, siteUrl, args.refresh);

  const nonEnglishRows = bundle.rows.filter((r) => !isEnglishPage(r.page));
  const englishRows = bundle.rows.filter((r) => isEnglishPage(r.page));

  const queryPageOpportunities = buildQueryPageOpportunities(nonEnglishRows);
  const pageOpportunities = buildPageOpportunities(nonEnglishRows);
  const cannibalization = detectCannibalization(nonEnglishRows);

  const englishQueryPageOpportunities = buildQueryPageOpportunities(englishRows);
  const englishPageOpportunities = buildPageOpportunities(englishRows);
  const englishCannibalization = detectCannibalization(englishRows);

  const derivedTotals = nonEnglishRows.reduce(
    (acc, r) => ({ clicks: acc.clicks + r.clicks, impressions: acc.impressions + r.impressions }),
    { clicks: 0, impressions: 0 },
  );
  const crossCheck = await crossCheckAgainstReportCache(siteUrl, bundle.dateRange, derivedTotals.clicks, derivedTotals.impressions);

  if (args.json) {
    console.log(
      JSON.stringify(
        {
          generatedAt: new Date().toISOString(),
          siteUrl,
          dateRange: bundle.dateRange,
          source: fromCache ? { fromCache: true, cachedAt } : { fromCache: false, cachedAt: null },
          datasetCompleteness: {
            rowsFetched: bundle.rows.length,
            pagesFetched: bundle.pagesFetched,
            rowLimitPerPage: bundle.rowLimitPerPage,
            truncated: bundle.truncated,
            note: bundle.truncated
              ? `Hit the pagination ceiling (${bundle.pagesFetched} pages × ${bundle.rowLimitPerPage} rows = ${bundle.rows.length} rows) while still receiving full pages — the true query×page dataset almost certainly continues beyond this. Treat everything below as a large, likely-biased-toward-higher-volume sample, not a complete dataset. See crossCheckAgainstReportCache for the measured gap.`
              : `Fetched ${bundle.rows.length} rows across ${bundle.pagesFetched} page(s); the last page was not full, meaning this is the complete query×page dataset for this window (modulo Google's own per-row anonymization, which is separate — see limitations).`,
          },
          crossCheckAgainstReportCache: crossCheck,
          scoring: { weights: SCORE_WEIGHTS, ctrReferenceFloorPercent: CTR_REFERENCE_FLOOR_PERCENT, explanation: SCORING_EXPLANATION },
          thresholds: {
            minImportantRowImpressions: MIN_IMPORTANT_ROW_IMPRESSIONS,
            minMeaningfulQueryImpressions: MIN_MEANINGFUL_QUERY_IMPRESSIONS,
            minCannibalizationImpressionsPerPage: MIN_CANNIBALIZATION_IMPRESSIONS_PER_PAGE,
          },
          queryPageOpportunities: queryPageOpportunities.slice(0, JSON_QUERY_PAGE_LIMIT),
          pageOpportunities: pageOpportunities.slice(0, JSON_PAGE_LIMIT),
          cannibalization: cannibalization.slice(0, JSON_CANNIBALIZATION_LIMIT),
          drilldowns: bundle.drilldowns,
          english: {
            note:
              englishRows.length === 0
                ? 'No /en/* pages have shipped yet — this is expected, not an error. See docs/english-market-expansion-plan.md.'
                : `${englishRows.length} /en/* query×page rows found.`,
            queryPageOpportunities: englishQueryPageOpportunities.slice(0, JSON_QUERY_PAGE_LIMIT),
            pageOpportunities: englishPageOpportunities.slice(0, JSON_PAGE_LIMIT),
            cannibalization: englishCannibalization.slice(0, JSON_CANNIBALIZATION_LIMIT),
          },
          limitations: [...SEARCH_CONSOLE_LIMITATIONS, ...OPPORTUNITY_ENGINE_LIMITATIONS],
        },
        null,
        2,
      ),
    );
    return;
  }

  console.log(`\nSearch Console opportunity diagnostics — ${siteUrl}`);
  console.log(`Window: ${bundle.dateRange.startDate} to ${bundle.dateRange.endDate} (${bundle.dateRange.requestedDays} days)`);
  console.log(fromCache ? `Source: local cache (fetched ${cachedAt}). Use --refresh to force a fresh pull.` : 'Source: live Search Console API pull (fresh).');

  if (bundle.truncated) {
    console.log(
      `\n⚠ DATASET TRUNCATED: fetched ${formatInt(bundle.rows.length)} query×page rows across ${bundle.pagesFetched} page(s) of ` +
        `${formatInt(bundle.rowLimitPerPage)} each, and the last page was still full — the real dataset almost certainly continues ` +
        `beyond this. Everything below is a large SAMPLE, not the complete query×page picture for this property. See the cross-check ` +
        `line below and §8 for the measured size of the gap.`,
    );
  } else {
    console.log(`\nDataset complete: ${formatInt(bundle.rows.length)} query×page rows across ${bundle.pagesFetched} page(s) — the last page was not full.`);
  }

  if (crossCheck) {
    console.log(
      `Cross-check vs. gsc:report cache: derived clicks=${formatInt(crossCheck.derivedClicks)} vs official=${formatInt(crossCheck.officialClicks)} ` +
        `(delta ${formatInt(crossCheck.clicksDelta)}, ${crossCheck.clicksDeltaPercent}%); derived impressions=${formatInt(crossCheck.derivedImpressions)} vs official=${formatInt(crossCheck.officialImpressions)} ` +
        `(delta ${formatInt(crossCheck.impressionsDelta)}, ${crossCheck.impressionsDeltaPercent}%)` +
        `${bundle.truncated
          ? ' — this gap is consistent with the truncation warned about above, not just normal low-volume anonymization.'
          : ' — dataset was NOT truncated (see above), so this gap reflects Google\'s own per-combination anonymization at query×page granularity, which can be substantial even when the single-dimension totals are complete. Do not treat the query×page numbers below as the full picture.'}`,
    );
  } else {
    console.log('Cross-check vs. gsc:report cache: not available (run `npm run gsc:report` first for this window to enable it).');
  }

  console.log(`\n1. Query → page relationships (top ${TERM_QUERY_PAGE_LIMIT} of ${queryPageOpportunities.length} rows with >= ${MIN_IMPORTANT_ROW_IMPRESSIONS} impressions, by score)`);
  console.log('-'.repeat(80));
  if (queryPageOpportunities.length === 0) console.log('  none found in this window.');
  queryPageOpportunities.slice(0, TERM_QUERY_PAGE_LIMIT).forEach(printQueryPageRow);

  console.log(`\n2. Page opportunity report (top ${TERM_PAGE_LIMIT} of ${pageOpportunities.length} pages, by score)`);
  console.log('-'.repeat(80));
  if (pageOpportunities.length === 0) console.log('  none found in this window.');
  pageOpportunities.slice(0, TERM_PAGE_LIMIT).forEach(printPageBlock);

  console.log(`\n\n3. Query cannibalization candidates (top ${TERM_CANNIBALIZATION_LIMIT} of ${cannibalization.length}, each page needs >= ${MIN_CANNIBALIZATION_IMPRESSIONS_PER_PAGE} impressions for that query to count)`);
  console.log('-'.repeat(80));
  if (cannibalization.length === 0) console.log('  none found in this window.');
  cannibalization.slice(0, TERM_CANNIBALIZATION_LIMIT).forEach(printCannibalizationCase);

  console.log(`\n\n4-5. Country & device breakdowns for the top ${DRILLDOWN_TOP_N} highest-scoring opportunities`);
  console.log('-'.repeat(80));
  const topForDrilldown = queryPageOpportunities.slice(0, DRILLDOWN_TOP_N);
  if (topForDrilldown.length === 0) console.log('  none found in this window.');
  topForDrilldown.forEach((o) => {
    const key = pairKey(o.query, o.page);
    console.log(`\n  "${o.query}" → ${o.page}`);
    printDrilldownTable(bundle.drilldowns.country[key] ?? [], 'countries');
    printDrilldownTable(bundle.drilldowns.device[key] ?? [], 'devices');
  });

  console.log('\n\n6. How the score works');
  console.log('-'.repeat(80));
  SCORING_EXPLANATION.forEach((line) => console.log(`  ${line}`));

  console.log('\n\n7. English (/en/*)');
  console.log('-'.repeat(80));
  if (englishRows.length === 0) {
    console.log('  No /en/* pages have shipped yet, so there is no /en/* query or page data to analyze.');
    console.log('  This is expected, not an error — see docs/english-market-expansion-plan.md.');
  } else {
    console.log(`  ${englishRows.length} /en/* query×page rows found — ${englishQueryPageOpportunities.length} clear the importance threshold.`);
    englishQueryPageOpportunities.slice(0, TERM_QUERY_PAGE_LIMIT).forEach(printQueryPageRow);
  }

  console.log('\n\n8. Data & methodology limitations (read before drawing conclusions)');
  console.log('-'.repeat(80));
  [...SEARCH_CONSOLE_LIMITATIONS, ...OPPORTUNITY_ENGINE_LIMITATIONS].forEach((line) => console.log(`  - ${line}`));
  console.log('');
}

main().catch((error) => {
  console.error('\nGoogle Search Console opportunity report failed:');
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
