/**
 * Simple, transparent opportunity classifications over already-fetched
 * Search Console rows. Diagnostic only — nothing here writes anywhere or
 * changes any page. See docs/english-market-expansion-plan.md §5 (SEO
 * Opportunity Record) for how these signals feed into an actual per-page
 * decision — this module only surfaces the raw signal.
 *
 * Thresholds mirror `scripts/search-console-ctr-triage.ts`'s existing
 * constants where this task didn't specify its own numbers, so the two
 * tools agree with each other rather than using arbitrary different cutoffs.
 */

import type { SearchConsoleRow } from './report-data';
import { isEnglishPageRow, sortByImpressionsDesc } from './report-data';

// Matches scripts/search-console-ctr-triage.ts's DEFAULT_MIN_IMPRESSIONS / DEFAULT_MAX_CTR.
export const HIGH_IMPRESSIONS_LOW_CTR_MIN_IMPRESSIONS = 500;
export const HIGH_IMPRESSIONS_LOW_CTR_MAX_CTR_PERCENT = 1.2;

// Explicitly requested range for this report (differs from the CTR-triage
// script's 3-20 — this task's instruction said 4-20, so that wins here).
export const RANKING_OPPORTUNITY_MIN_POSITION = 4;
export const RANKING_OPPORTUNITY_MAX_POSITION = 20;

// Judgment call, stated plainly: below this, "zero clicks" is just normal
// noise from one-off impressions, not a real signal worth surfacing.
export const ZERO_CLICKS_MIN_IMPRESSIONS = 10;

export type OpportunityReport = {
  highImpressionsLowCtr: SearchConsoleRow[];
  rankingOpportunity: SearchConsoleRow[];
  impressionsZeroClicks: SearchConsoleRow[];
  englishPagesWithImpressions: SearchConsoleRow[];
};

/**
 * Classifies A/B/C over a query-level (or page-level) row set, and D over
 * the full page-level row set. All four lists are sorted by impressions
 * descending (the signal each classification is fundamentally about) and
 * are diagnostic-only — see the report's own printed disclaimer.
 */
export function classifyOpportunities(queryRows: SearchConsoleRow[], allPageRows: SearchConsoleRow[]): OpportunityReport {
  const highImpressionsLowCtr = queryRows.filter(
    (row) => row.impressions >= HIGH_IMPRESSIONS_LOW_CTR_MIN_IMPRESSIONS && row.ctr * 100 < HIGH_IMPRESSIONS_LOW_CTR_MAX_CTR_PERCENT,
  );

  const rankingOpportunity = queryRows.filter(
    (row) => row.position >= RANKING_OPPORTUNITY_MIN_POSITION && row.position <= RANKING_OPPORTUNITY_MAX_POSITION,
  );

  const impressionsZeroClicks = queryRows.filter(
    (row) => row.clicks === 0 && row.impressions >= ZERO_CLICKS_MIN_IMPRESSIONS,
  );

  const englishPagesWithImpressions = allPageRows.filter((row) => isEnglishPageRow(row) && row.impressions > 0);

  return {
    highImpressionsLowCtr: sortByImpressionsDesc(highImpressionsLowCtr),
    rankingOpportunity: sortByImpressionsDesc(rankingOpportunity),
    impressionsZeroClicks: sortByImpressionsDesc(impressionsZeroClicks),
    englishPagesWithImpressions: sortByImpressionsDesc(englishPagesWithImpressions),
  };
}
