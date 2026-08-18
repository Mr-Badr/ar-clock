/**
 * A transparent, documented 0-100 "investigation priority" score.
 *
 * What this score IS: a way to sort a large pile of query/page rows so a
 * human looks at the highest-leverage ones first.
 *
 * What this score is NOT: a traffic prediction. Nothing here estimates how
 * many additional clicks fixing anything would produce — that would require
 * data this API doesn't provide (true keyword volume, real CTR-by-position
 * benchmarks for Arabic MENA SERPs, etc.), and inventing it would violate
 * the whole point of this tool. See lib/limitations.ts.
 *
 * Five components, weights sum to 100:
 *
 *   1. Impressions   (max 35) — log10-scaled. More impressions = more
 *      reach at stake if this row is actually worth fixing.
 *        score = min(35, log10(impressions + 1) * 8.75)
 *        e.g. 10 impressions ≈ 8.8pts, 1,000 ≈ 26.3pts, 10,000+ = 35pts (cap)
 *
 *   2. Position       (max 25) — bucketed by how realistic near-term
 *      improvement is. Positions 4-10 (bottom of page 1) score highest
 *      because they're the closest to a top-3 result; very deep positions
 *      score low because a near-term win there is unlikely; positions 1-3
 *      score low too, but for the opposite reason — there's little ranking
 *      headroom left to gain (a low-CTR row at position 1-3 is still
 *      flagged separately by the CTR component below).
 *        position 1-3    → 5pts
 *        position 3-10   → 25pts (cap)
 *        position 10-20  → 18pts
 *        position 20-50  → 8pts
 *        position 50+    → 2pts
 *
 *   3. CTR gap         (max 20) — how far below the 1.2% reference CTR
 *      floor (same threshold used by `gsc:report`'s and
 *      `search-console-ctr-triage.ts`'s classifications, kept consistent
 *      on purpose) this row's actual CTR is. A CTR right at the floor
 *      scores 0 here; a CTR of 0% scores the full 20.
 *        score = min(20, ((1.2 - ctrPercent) / 1.2) * 20), floored at 0
 *
 *   4. Clicks          (max 10) — sqrt-scaled, reaching the cap at 25
 *      clicks. This is a CONFIDENCE signal, not a value signal: a row
 *      already getting some real clicks has proven real demand exists,
 *      which makes further investigation more likely to be worth the time
 *      than a row that's never converted a single impression into a click.
 *        score = min(10, sqrt(clicks) * 2)
 *
 *   5. Relevance       (max 10) — crude lexical overlap between the
 *      query's words and the page URL's slug words (0-1 fraction × 10).
 *      Documented weakness: on this Arabic-content/English-slug site this
 *      will read low for most rows almost by construction — it is not
 *      evidence the query and page are actually unrelated. Treat this
 *      component as the weakest of the five.
 *
 * Total = sum of the five components, 0-100. Sorting by this number is the
 * only thing this score is for.
 */

export const SCORE_WEIGHTS = {
  impressions: 35,
  position: 25,
  ctrGap: 20,
  clicks: 10,
  relevance: 10,
} as const;

export const CTR_REFERENCE_FLOOR_PERCENT = 1.2; // kept in sync with lib/opportunities.ts's HIGH_IMPRESSIONS_LOW_CTR_MAX_CTR_PERCENT

export const SCORING_EXPLANATION = [
  'Investigation-priority score, 0-100, five weighted components. This ranks WHERE TO LOOK ' +
    'FIRST — it does not predict traffic and should never be quoted as an expected-gain number.',
  `1. Impressions (max ${SCORE_WEIGHTS.impressions}): log10-scaled reach — more impressions ` +
    'means more is at stake if this row turns out to be worth acting on.',
  `2. Position (max ${SCORE_WEIGHTS.position}): bucketed by realistic near-term improvement — ` +
    'positions 4-10 score highest (closest to page-1 top spots); very deep positions and ' +
    'already-top-3 positions both score lower, for opposite reasons.',
  `3. CTR gap (max ${SCORE_WEIGHTS.ctrGap}): how far the actual CTR sits below a fixed ` +
    `${CTR_REFERENCE_FLOOR_PERCENT}% reference floor (same floor used elsewhere in this ` +
    'tooling, kept consistent on purpose).',
  `4. Clicks (max ${SCORE_WEIGHTS.clicks}): sqrt-scaled confidence signal — some real clicks ` +
    'already proves demand exists, distinct from raw impressions.',
  `5. Relevance (max ${SCORE_WEIGHTS.relevance}): crude lexical overlap between the query\'s ` +
    'words and the page URL\'s slug — a weak, honestly-labeled signal, not a semantic model.',
];

function impressionsScore(impressions: number): number {
  if (impressions <= 0) return 0;
  return Math.min(SCORE_WEIGHTS.impressions, Math.log10(impressions + 1) * 8.75);
}

function positionScore(position: number): number {
  if (position <= 0) return 0;
  if (position <= 3) return 5;
  if (position <= 10) return SCORE_WEIGHTS.position; // 25, cap
  if (position <= 20) return 18;
  if (position <= 50) return 8;
  return 2;
}

function ctrGapScore(ctrFraction: number): number {
  const ctrPercent = ctrFraction * 100;
  if (ctrPercent >= CTR_REFERENCE_FLOOR_PERCENT) return 0;
  const gap = (CTR_REFERENCE_FLOOR_PERCENT - ctrPercent) / CTR_REFERENCE_FLOOR_PERCENT;
  return Math.min(SCORE_WEIGHTS.ctrGap, gap * SCORE_WEIGHTS.ctrGap);
}

function clicksScore(clicks: number): number {
  if (clicks <= 0) return 0;
  return Math.min(SCORE_WEIGHTS.clicks, Math.sqrt(clicks) * 2);
}

function relevanceScore(relevanceFraction: number): number {
  return Math.min(SCORE_WEIGHTS.relevance, Math.max(0, relevanceFraction) * SCORE_WEIGHTS.relevance);
}

export type ScoreBreakdown = {
  impressionsScore: number;
  positionScore: number;
  ctrGapScore: number;
  clicksScore: number;
  relevanceScore: number;
  total: number;
};

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

export function scoreOpportunity(input: { impressions: number; position: number; ctr: number; clicks: number; relevance: number }): ScoreBreakdown {
  const parts = {
    impressionsScore: impressionsScore(input.impressions),
    positionScore: positionScore(input.position),
    ctrGapScore: ctrGapScore(input.ctr),
    clicksScore: clicksScore(input.clicks),
    relevanceScore: relevanceScore(input.relevance),
  };
  const total = parts.impressionsScore + parts.positionScore + parts.ctrGapScore + parts.clicksScore + parts.relevanceScore;
  return {
    impressionsScore: round1(parts.impressionsScore),
    positionScore: round1(parts.positionScore),
    ctrGapScore: round1(parts.ctrGapScore),
    clicksScore: round1(parts.clicksScore),
    relevanceScore: round1(parts.relevanceScore),
    total: round1(total),
  };
}
