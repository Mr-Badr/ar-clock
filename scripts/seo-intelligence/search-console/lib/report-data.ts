/**
 * Fetches and shapes Google Search Console Search Analytics data for the
 * miqatona.com property. Read-only (webmasters.readonly scope) — this module
 * has no ability to write to Search Console.
 *
 * Design notes:
 * - We pull each dimension's FULL row set once (up to the API's max
 *   rowLimit) rather than asking the API to pre-sort/limit, then sort and
 *   slice client-side for every "top N by X" view. The Search Analytics API
 *   does not document a guaranteed default sort order, so relying on it
 *   would risk silently-wrong "top" lists.
 * - The "English pages" view is derived by filtering the already-fetched
 *   full page list client-side (path starts with `/en/`) rather than firing
 *   a second, separate API request — one fewer network call, and guarantees
 *   the general and English page views are drawn from the same pull.
 * - "English queries" genuinely needs its own filtered request (dimension
 *   filter on the `page` dimension, grouped by `query`) since that's a
 *   different aggregation than either of the above.
 */

import { google } from 'googleapis';

type OAuth2Client = InstanceType<typeof google.auth.OAuth2>;

export type SearchConsoleRow = {
  keys: string[];
  clicks: number;
  impressions: number;
  ctr: number; // fraction, e.g. 0.023 = 2.3%
  position: number;
};

export type DateRange = {
  startDate: string;
  endDate: string;
  requestedDays: number;
  dataLagDaysApplied: number;
};

export type RawReportData = {
  siteUrl: string;
  dateRange: DateRange;
  overall: SearchConsoleRow | null;
  allPages: SearchConsoleRow[];
  allQueries: SearchConsoleRow[];
  countries: SearchConsoleRow[];
  englishQueries: SearchConsoleRow[];
};

const MAX_ROW_LIMIT = 25000; // Search Analytics API hard cap per request
// Google's own documentation: Search Console performance data typically has
// a 2-3 day processing lag. We shift the requested window back by 3 days so
// we're not asking for (and silently under-reporting) days Google hasn't
// finished processing yet.
const DATA_LAG_DAYS = 3;

function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function computeDateRange(days = 28, lagDays = DATA_LAG_DAYS): DateRange {
  const end = new Date();
  end.setUTCDate(end.getUTCDate() - lagDays);
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - (days - 1));
  return {
    startDate: isoDate(start),
    endDate: isoDate(end),
    requestedDays: days,
    dataLagDaysApplied: lagDays,
  };
}

function toRow(raw: { keys?: string[] | null; clicks?: number | null; impressions?: number | null; ctr?: number | null; position?: number | null }): SearchConsoleRow {
  return {
    keys: raw.keys ?? [],
    clicks: raw.clicks ?? 0,
    impressions: raw.impressions ?? 0,
    ctr: raw.ctr ?? 0,
    position: raw.position ?? 0,
  };
}

type QueryOptions = {
  dimensions?: string[];
  rowLimit?: number;
  filterPageContains?: string;
};

async function runSearchAnalyticsQuery(
  auth: OAuth2Client,
  siteUrl: string,
  dateRange: DateRange,
  options: QueryOptions,
): Promise<SearchConsoleRow[]> {
  const searchConsole = google.webmasters({ version: 'v3', auth });

  const requestBody: Record<string, unknown> = {
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
    dimensions: options.dimensions ?? [],
    rowLimit: options.rowLimit ?? MAX_ROW_LIMIT,
  };

  if (options.filterPageContains) {
    requestBody.dimensionFilterGroups = [
      {
        filters: [{ dimension: 'page', operator: 'contains', expression: options.filterPageContains }],
      },
    ];
  }

  const response = await searchConsole.searchanalytics.query({ siteUrl, requestBody });
  const rows = response.data.rows ?? [];
  return rows.map(toRow);
}

/** Lists the Search Console properties this authorized account can access. */
export async function listSites(auth: OAuth2Client) {
  const searchConsole = google.webmasters({ version: 'v3', auth });
  const response = await searchConsole.sites.list();
  return response.data.siteEntry ?? [];
}

/** Pulls every dataset the report needs in a small, fixed number of API calls. */
export async function fetchRawReportData(auth: OAuth2Client, siteUrl: string, days = 28): Promise<RawReportData> {
  const dateRange = computeDateRange(days);

  const [overallRows, allPages, allQueries, countries, englishQueries] = await Promise.all([
    runSearchAnalyticsQuery(auth, siteUrl, dateRange, { dimensions: [] }),
    runSearchAnalyticsQuery(auth, siteUrl, dateRange, { dimensions: ['page'] }),
    runSearchAnalyticsQuery(auth, siteUrl, dateRange, { dimensions: ['query'] }),
    runSearchAnalyticsQuery(auth, siteUrl, dateRange, { dimensions: ['country'] }),
    runSearchAnalyticsQuery(auth, siteUrl, dateRange, { dimensions: ['query'], rowLimit: 1000, filterPageContains: '/en/' }),
  ]);

  return {
    siteUrl,
    dateRange,
    overall: overallRows[0] ?? null,
    allPages,
    allQueries,
    countries,
    englishQueries,
  };
}

/** Strictly enforces "path starts with /en/" (the API filter above only supports substring "contains"). */
export function isEnglishPageRow(row: SearchConsoleRow): boolean {
  const url = row.keys[0];
  if (!url) return false;
  try {
    return new URL(url).pathname.startsWith('/en/');
  } catch {
    return url.includes('/en/');
  }
}

export function sortByClicksDesc(rows: SearchConsoleRow[]): SearchConsoleRow[] {
  return [...rows].sort((a, b) => b.clicks - a.clicks);
}

export function sortByImpressionsDesc(rows: SearchConsoleRow[]): SearchConsoleRow[] {
  return [...rows].sort((a, b) => b.impressions - a.impressions);
}
