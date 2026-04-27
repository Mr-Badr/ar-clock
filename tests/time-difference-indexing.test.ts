import test from 'node:test';
import assert from 'node:assert/strict';

import { POPULAR_PAIRS } from '../src/components/time-diff/data/popularPairs';
import {
  getSeoIndexableTimeDifferencePairs,
  isSeoIndexableTimeDifferencePair,
} from '../src/lib/seo/time-difference-indexing.js';

test('time-difference SEO indexing only allows curated popular pairs', () => {
  const firstPair = POPULAR_PAIRS[0];
  assert.equal(
    isSeoIndexableTimeDifferencePair(firstPair.from.slug, firstPair.to.slug),
    true,
  );

  assert.equal(
    isSeoIndexableTimeDifferencePair(firstPair.to.slug, firstPair.from.slug),
    false,
  );

  assert.equal(
    isSeoIndexableTimeDifferencePair('cocos-islands-direction-island', 'morocco-rabat'),
    false,
  );
});

test('time-difference SEO indexing set matches popular pair inventory', () => {
  const indexedPairs = getSeoIndexableTimeDifferencePairs();

  assert.equal(indexedPairs.length, POPULAR_PAIRS.length);
  assert.equal(new Set(indexedPairs).size, indexedPairs.length);
});
