/**
 * Fetches the joint query×page Search Analytics dataset that everything in
 * `gsc:opportunities` is derived from, plus the aggregation helpers that
 * turn those flat rows into per-page and per-query views.
 *
 * Why one joint pull instead of reusing `gsc:report`'s separate
 * page-only/query-only pulls: page- and query-level totals here are DERIVED
 * by aggregating these joint rows (see limitations.ts for the accuracy
 * caveat this implies), which is what lets §1-3 of the opportunities report
 * work from a single dataset instead of three.
 */

import { google } from 'googleapis';
import type { DateRange } from './report-data';

type OAuth2Client = InstanceType<typeof google.auth.OAuth2>;

export type QueryPageRow = {
  query: string;
  page: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
};

const MAX_ROW_LIMIT = 25000; // Search Analytics API's hard per-request cap
// Bounds total pagination: at most this many sequential 25,000-row pages
// (i.e. at most 100,000 rows, 4 API calls) before we stop and report the
// dataset as (still) truncated rather than paginating indefinitely. A
// high-traffic property's true query×page cardinality can exceed even this
// — see the `truncated` flag this returns and lib/limitations.ts.
const MAX_PAGES = 4;

export type QueryPageFetchResult = {
  rows: QueryPageRow[];
  /** True if the last page fetched was still full — i.e. more rows almost certainly exist beyond MAX_PAGES * MAX_ROW_LIMIT. */
  truncated: boolean;
  pagesFetched: number;
  rowLimitPerPage: number;
};

export async function fetchQueryPageRows(auth: OAuth2Client, siteUrl: string, dateRange: DateRange): Promise<QueryPageFetchResult> {
  const searchConsole = google.webmasters({ version: 'v3', auth });
  const rows: QueryPageRow[] = [];
  let pagesFetched = 0;
  let truncated = false;

  for (let page = 0; page < MAX_PAGES; page += 1) {
    const response = await searchConsole.searchanalytics.query({
      siteUrl,
      requestBody: {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        dimensions: ['query', 'page'],
        rowLimit: MAX_ROW_LIMIT,
        startRow: page * MAX_ROW_LIMIT,
      },
    });
    const pageRows = response.data.rows ?? [];
    pagesFetched += 1;
    rows.push(
      ...pageRows.map((row) => ({
        query: row.keys?.[0] ?? '',
        page: row.keys?.[1] ?? '',
        clicks: row.clicks ?? 0,
        impressions: row.impressions ?? 0,
        ctr: row.ctr ?? 0,
        position: row.position ?? 0,
      })),
    );

    if (pageRows.length < MAX_ROW_LIMIT) {
      // Fewer than a full page came back — we reached the actual end.
      truncated = false;
      break;
    }
    if (page === MAX_PAGES - 1) {
      // Still a full page at our pagination ceiling: real data almost
      // certainly continues beyond what we fetched.
      truncated = true;
    }
  }

  return { rows, truncated, pagesFetched, rowLimitPerPage: MAX_ROW_LIMIT };
}

export function isEnglishPage(page: string): boolean {
  try {
    return new URL(page).pathname.startsWith('/en/');
  } catch {
    return page.includes('/en/');
  }
}

/** Impression-weighted average — the same method Google's own aggregates use. */
function weightedAveragePosition(rows: QueryPageRow[]): number {
  const totalImpressions = rows.reduce((sum, r) => sum + r.impressions, 0);
  if (totalImpressions === 0) return 0;
  const weighted = rows.reduce((sum, r) => sum + r.position * r.impressions, 0);
  return weighted / totalImpressions;
}

export type AggregatedTotals = {
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
};

export function aggregateTotals(rows: QueryPageRow[]): AggregatedTotals {
  const clicks = rows.reduce((sum, r) => sum + r.clicks, 0);
  const impressions = rows.reduce((sum, r) => sum + r.impressions, 0);
  return {
    clicks,
    impressions,
    ctr: impressions > 0 ? clicks / impressions : 0,
    position: weightedAveragePosition(rows),
  };
}

export function groupByPage(rows: QueryPageRow[]): Map<string, QueryPageRow[]> {
  const map = new Map<string, QueryPageRow[]>();
  for (const row of rows) {
    const existing = map.get(row.page);
    if (existing) existing.push(row);
    else map.set(row.page, [row]);
  }
  return map;
}

export function groupByQuery(rows: QueryPageRow[]): Map<string, QueryPageRow[]> {
  const map = new Map<string, QueryPageRow[]>();
  for (const row of rows) {
    const existing = map.get(row.query);
    if (existing) existing.push(row);
    else map.set(row.query, [row]);
  }
  return map;
}

const TOKEN_RE = /[^a-z0-9؀-ۿ]+/i;

function tokenize(value: string): Set<string> {
  return new Set(
    value
      .toLowerCase()
      .split(TOKEN_RE)
      .map((token) => token.trim())
      .filter((token) => token.length >= 2),
  );
}

function slugTokens(page: string): Set<string> {
  try {
    const { pathname } = new URL(page);
    return tokenize(pathname.replace(/[/-]/g, ' '));
  } catch {
    return tokenize(page.replace(/[/-]/g, ' '));
  }
}

/**
 * Crude lexical overlap between a query's words and the page URL's slug
 * words. Returns 0-1. This is NOT a semantic relevance model — see
 * limitations.ts for why it reads low on this site by design (Arabic
 * queries vs. mostly-English slugs).
 */
export function lexicalRelevance(query: string, page: string): number {
  const queryTokens = tokenize(query);
  if (queryTokens.size === 0) return 0;
  const pageTokens = slugTokens(page);
  if (pageTokens.size === 0) return 0;
  let overlap = 0;
  for (const token of queryTokens) {
    if (pageTokens.has(token)) overlap += 1;
  }
  return overlap / queryTokens.size;
}
