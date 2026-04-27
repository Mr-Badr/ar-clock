import { POPULAR_PAIRS } from '@/components/time-diff/data/popularPairs';

const SEO_INDEXABLE_TIME_DIFFERENCE_PAIRS = new Set(
  POPULAR_PAIRS.map((pair) => `${pair.from.slug}::${pair.to.slug}`),
);

export function isSeoIndexableTimeDifferencePair(fromSegment, toSegment) {
  const from = String(fromSegment || '').trim().toLowerCase();
  const to = String(toSegment || '').trim().toLowerCase();
  return Boolean(from && to) && SEO_INDEXABLE_TIME_DIFFERENCE_PAIRS.has(`${from}::${to}`);
}

export function getSeoIndexableTimeDifferencePairs() {
  return Array.from(SEO_INDEXABLE_TIME_DIFFERENCE_PAIRS);
}
