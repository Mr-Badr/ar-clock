import test from 'node:test';
import assert from 'node:assert/strict';

import { POPULAR_PAIRS } from '../src/components/time-diff/data/popularPairs';
import { isSeoIndexableTimeDifferencePair } from '../src/lib/seo/time-difference-indexing.js';

// Historically this only allowed a hardcoded allowlist of ~60 curated pairs,
// noindexing every other real city-pair combination in the geo DB regardless
// of content quality (see .claude memory: project-seo-discoverability-audit).
// Any two distinct, real cities produce genuinely unique content (the page
// only calls this after both segments already resolved via the geo DB), so
// the only remaining reason to withhold indexing is a trivial self-pair.
test('time-difference SEO indexing allows any distinct city pair, not just curated ones', () => {
  const firstPair = POPULAR_PAIRS[0];

  assert.equal(
    isSeoIndexableTimeDifferencePair(firstPair.from.slug, firstPair.to.slug),
    true,
  );

  // The reverse direction of a curated pair is a different, equally real page.
  assert.equal(
    isSeoIndexableTimeDifferencePair(firstPair.to.slug, firstPair.from.slug),
    true,
  );

  // A pair with no curation history at all is still indexable.
  assert.equal(
    isSeoIndexableTimeDifferencePair('cocos-islands-direction-island', 'morocco-rabat'),
    true,
  );
});

test('time-difference SEO indexing rejects self-pairs and empty segments', () => {
  assert.equal(isSeoIndexableTimeDifferencePair('egypt-cairo', 'egypt-cairo'), false);
  assert.equal(isSeoIndexableTimeDifferencePair('', 'egypt-cairo'), false);
  assert.equal(isSeoIndexableTimeDifferencePair('egypt-cairo', ''), false);
  assert.equal(isSeoIndexableTimeDifferencePair(undefined, undefined), false);
});
