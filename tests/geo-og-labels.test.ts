import test from 'node:test';
import assert from 'node:assert/strict';

import {
  getOgCityLabels,
  getOgCountryCapitalLabels,
  getOgCountryLabels,
} from '@/lib/geo-og-labels';

test('country OG labels resolve Arabic country names from snapshot data', () => {
  const labels = getOgCountryLabels('egypt');

  assert.ok(labels.countryLabel.length > 0);
  assert.notEqual(labels.countryLabel, 'egypt');
});

test('city OG labels resolve city and country labels from snapshot data', () => {
  const labels = getOgCityLabels('egypt', 'suez');

  assert.ok(labels.cityLabel.length > 0);
  assert.ok(labels.countryLabel.length > 0);
  assert.notEqual(labels.cityLabel, 'suez');
});

test('country capital OG labels expose a capital-like label for known countries', () => {
  const labels = getOgCountryCapitalLabels('morocco');

  assert.ok(labels.countryLabel.length > 0);
  assert.ok(labels.capitalLabel.length > 0);
});
