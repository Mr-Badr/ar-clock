import test from 'node:test';
import assert from 'node:assert/strict';

import { POPULAR_PAIRS } from '@/components/time-diff/data/popularPairs';
import countries from '@/lib/db/fallback/countries.json';
import cities from '@/lib/db/fallback/cities-index.json';
import { buildTimeDifferenceHref } from '@/lib/time-difference-links';
import { getTimeDifferenceCitySlugCandidates } from '@/lib/time-difference-slugs';

test('popular time-difference pairs point to canonical city slugs', () => {
  for (const pair of POPULAR_PAIRS) {
    for (const side of [pair.from, pair.to]) {
      const match = countries
        .map((country) => country.country_slug)
        .filter(Boolean)
        .filter((countrySlug) => side.slug === countrySlug || side.slug.startsWith(`${countrySlug}-`))
        .sort((a, b) => b.length - a.length)[0];

      assert.ok(match, `expected country match for segment "${side.slug}"`);

      const citySlug = side.slug.slice(match.length).replace(/^-/, '');
      const country = countries.find((entry) => entry.country_slug === match);
      const city = cities.find((entry) => entry.country_code === country?.country_code && entry.city_slug === citySlug);

      assert.ok(city, `expected city record for segment "${side.slug}"`);
    }

    const href = buildTimeDifferenceHref(pair.from.slug, pair.to.slug);
    assert.match(href, /^\/time-difference\/[^/]+\/[^/]+$/);
  }
});

test('legacy time-difference city aliases include canonical slugs', () => {
  assert.deepEqual(getTimeDifferenceCitySlugCandidates('united-states', 'new-york'), [
    'new-york',
    'new-york-city',
  ]);
});
