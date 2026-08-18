/**
 * Targeted country/device breakdowns for a specific (query, page) pair.
 *
 * Deliberately NOT a site-wide query×page×country×device pull (that cross
 * product would be enormous and mostly irrelevant) — these are only called
 * for the small number of highest-scoring opportunities, to keep API usage
 * bounded. See lib/limitations.ts.
 */

import { google } from 'googleapis';
import type { DateRange } from './report-data';

type OAuth2Client = InstanceType<typeof google.auth.OAuth2>;

export type DimensionRow = {
  key: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
};

async function queryWithFilters(
  auth: OAuth2Client,
  siteUrl: string,
  dateRange: DateRange,
  dimension: 'country' | 'device',
  query: string,
  page: string,
): Promise<DimensionRow[]> {
  const searchConsole = google.webmasters({ version: 'v3', auth });
  const response = await searchConsole.searchanalytics.query({
    siteUrl,
    requestBody: {
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      dimensions: [dimension],
      rowLimit: 25,
      dimensionFilterGroups: [
        {
          filters: [
            { dimension: 'query', operator: 'equals', expression: query },
            { dimension: 'page', operator: 'equals', expression: page },
          ],
        },
      ],
    },
  });
  const rows = response.data.rows ?? [];
  return rows
    .map((row) => ({
      key: row.keys?.[0] ?? '',
      clicks: row.clicks ?? 0,
      impressions: row.impressions ?? 0,
      ctr: row.ctr ?? 0,
      position: row.position ?? 0,
    }))
    .sort((a, b) => b.clicks - a.clicks);
}

export function fetchCountryBreakdown(auth: OAuth2Client, siteUrl: string, dateRange: DateRange, query: string, page: string) {
  return queryWithFilters(auth, siteUrl, dateRange, 'country', query, page);
}

export function fetchDeviceBreakdown(auth: OAuth2Client, siteUrl: string, dateRange: DateRange, query: string, page: string) {
  return queryWithFilters(auth, siteUrl, dateRange, 'device', query, page);
}
