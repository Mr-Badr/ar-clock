/**
 * Turns the flat query×page dataset into the three views `gsc:opportunities`
 * reports: important query→page rows, per-page opportunity summaries, and
 * query-cannibalization candidates. All thresholds are named constants,
 * exported, and printed in the report itself — nothing here is a hidden
 * magic number.
 */

import type { QueryPageRow } from './query-page-data';
import { aggregateTotals, groupByPage, groupByQuery, isEnglishPage, lexicalRelevance } from './query-page-data';
import { scoreOpportunity, type ScoreBreakdown } from './opportunity-scoring';
import {
  HIGH_IMPRESSIONS_LOW_CTR_MIN_IMPRESSIONS,
  HIGH_IMPRESSIONS_LOW_CTR_MAX_CTR_PERCENT,
  RANKING_OPPORTUNITY_MIN_POSITION,
  RANKING_OPPORTUNITY_MAX_POSITION,
  ZERO_CLICKS_MIN_IMPRESSIONS,
} from './opportunities';

// Gate for even considering a query×page row "important" enough to include
// in the row-level report at all — well below the (500) high-impressions
// threshold, this just filters out one-off noise.
export const MIN_IMPORTANT_ROW_IMPRESSIONS = 50;

// A query counts toward a page's "meaningful query count" (and toward
// cannibalization detection) once it clears this many impressions for that
// specific page.
export const MIN_MEANINGFUL_QUERY_IMPRESSIONS = 10;

// Flag C "near-zero clicks despite high impressions" — defined as this many
// clicks or fewer, stated explicitly rather than as a fuzzy ratio.
export const NEAR_ZERO_CLICKS_MAX = 2;

// Flag D: needs at least this many meaningful queries before "weak average
// position" is worth flagging (one bad query isn't a pattern).
export const WEAK_POSITION_MIN_QUERY_COUNT = 5;
export const WEAK_POSITION_THRESHOLD = 15;

// Flag E: heuristic-only "possibly mixed search intent" — distinct
// meaningful-query count at or above this is flagged for a human look, not
// asserted as actually mixed intent.
export const MANY_QUERIES_POSSIBLE_MIXED_INTENT_MIN = 15;

// Cannibalization: a page only counts as "competing" for a query once it
// clears this many impressions for that query (filters out incidental
// long-tail overlap that isn't a real competing signal).
export const MIN_CANNIBALIZATION_IMPRESSIONS_PER_PAGE = 20;

export type QueryPageOpportunity = QueryPageRow & {
  flags: {
    highImpressionsLowCtr: boolean;
    rankingOpportunity: boolean;
    impressionsZeroClicks: boolean;
  };
  isEnglish: boolean;
  score: number;
  scoreBreakdown: ScoreBreakdown;
};

export function buildQueryPageOpportunities(rows: QueryPageRow[]): QueryPageOpportunity[] {
  return rows
    .filter((row) => row.impressions >= MIN_IMPORTANT_ROW_IMPRESSIONS)
    .map((row) => {
      const relevance = lexicalRelevance(row.query, row.page);
      const scoreBreakdown = scoreOpportunity({
        impressions: row.impressions,
        position: row.position,
        ctr: row.ctr,
        clicks: row.clicks,
        relevance,
      });
      return {
        ...row,
        isEnglish: isEnglishPage(row.page),
        flags: {
          highImpressionsLowCtr:
            row.impressions >= HIGH_IMPRESSIONS_LOW_CTR_MIN_IMPRESSIONS && row.ctr * 100 < HIGH_IMPRESSIONS_LOW_CTR_MAX_CTR_PERCENT,
          rankingOpportunity: row.position >= RANKING_OPPORTUNITY_MIN_POSITION && row.position <= RANKING_OPPORTUNITY_MAX_POSITION,
          impressionsZeroClicks: row.clicks === 0 && row.impressions >= ZERO_CLICKS_MIN_IMPRESSIONS,
        },
        score: scoreBreakdown.total,
        scoreBreakdown,
      };
    })
    .sort((a, b) => b.score - a.score);
}

export type PageOpportunity = {
  page: string;
  isEnglish: boolean;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  meaningfulQueryCount: number;
  totalQueryCount: number;
  topQueries: Array<{ query: string; clicks: number; impressions: number; ctr: number; position: number }>;
  flags: {
    A_highImpressionsRankingOpportunity: boolean;
    B_highImpressionsLowCtr: boolean;
    C_highImpressionsNearZeroClicks: boolean;
    D_manyQueriesWeakPosition: boolean;
    E_manyDistinctQueriesPossibleMixedIntent: boolean;
  };
  score: number;
  scoreBreakdown: ScoreBreakdown;
};

export function buildPageOpportunities(rows: QueryPageRow[]): PageOpportunity[] {
  const byPage = groupByPage(rows);
  const results: PageOpportunity[] = [];

  for (const [page, pageRows] of byPage) {
    const totals = aggregateTotals(pageRows);
    const meaningfulQueries = pageRows.filter((r) => r.impressions >= MIN_MEANINGFUL_QUERY_IMPRESSIONS);
    const topQueries = [...pageRows]
      .sort((a, b) => b.impressions - a.impressions)
      .slice(0, 5)
      .map((r) => ({ query: r.query, clicks: r.clicks, impressions: r.impressions, ctr: r.ctr, position: r.position }));

    // Page-level relevance: average lexical overlap across the page's
    // meaningful queries (falls back to all rows if none clear the bar).
    const relevanceSample = meaningfulQueries.length > 0 ? meaningfulQueries : pageRows;
    const avgRelevance =
      relevanceSample.reduce((sum, r) => sum + lexicalRelevance(r.query, page), 0) / Math.max(1, relevanceSample.length);

    const scoreBreakdown = scoreOpportunity({
      impressions: totals.impressions,
      position: totals.position,
      ctr: totals.ctr,
      clicks: totals.clicks,
      relevance: avgRelevance,
    });

    const highImpressions = totals.impressions >= HIGH_IMPRESSIONS_LOW_CTR_MIN_IMPRESSIONS;

    results.push({
      page,
      isEnglish: isEnglishPage(page),
      clicks: totals.clicks,
      impressions: totals.impressions,
      ctr: totals.ctr,
      position: totals.position,
      meaningfulQueryCount: meaningfulQueries.length,
      totalQueryCount: pageRows.length,
      topQueries,
      flags: {
        A_highImpressionsRankingOpportunity:
          highImpressions && totals.position >= RANKING_OPPORTUNITY_MIN_POSITION && totals.position <= RANKING_OPPORTUNITY_MAX_POSITION,
        B_highImpressionsLowCtr: highImpressions && totals.ctr * 100 < HIGH_IMPRESSIONS_LOW_CTR_MAX_CTR_PERCENT,
        C_highImpressionsNearZeroClicks: highImpressions && totals.clicks <= NEAR_ZERO_CLICKS_MAX,
        D_manyQueriesWeakPosition: meaningfulQueries.length >= WEAK_POSITION_MIN_QUERY_COUNT && totals.position > WEAK_POSITION_THRESHOLD,
        E_manyDistinctQueriesPossibleMixedIntent: meaningfulQueries.length >= MANY_QUERIES_POSSIBLE_MIXED_INTENT_MIN,
      },
      score: scoreBreakdown.total,
      scoreBreakdown,
    });
  }

  return results.sort((a, b) => b.score - a.score);
}

export type CannibalizationCase = {
  query: string;
  totalImpressions: number;
  pages: Array<{ page: string; clicks: number; impressions: number; ctr: number; position: number }>;
};

export function detectCannibalization(rows: QueryPageRow[]): CannibalizationCase[] {
  const byQuery = groupByQuery(rows);
  const cases: CannibalizationCase[] = [];

  for (const [query, queryRows] of byQuery) {
    const competingPages = queryRows.filter((r) => r.impressions >= MIN_CANNIBALIZATION_IMPRESSIONS_PER_PAGE);
    if (competingPages.length < 2) continue;
    cases.push({
      query,
      totalImpressions: competingPages.reduce((sum, r) => sum + r.impressions, 0),
      pages: competingPages
        .sort((a, b) => b.impressions - a.impressions)
        .map((r) => ({ page: r.page, clicks: r.clicks, impressions: r.impressions, ctr: r.ctr, position: r.position })),
    });
  }

  return cases.sort((a, b) => b.totalImpressions - a.totalImpressions);
}
