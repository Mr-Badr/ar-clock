import test from 'node:test';
import assert from 'node:assert/strict';

import manifest from '@/data/holidays/generated/manifest.json';
import { buildHolidaysDeliveryExport } from '../scripts/lib/holidays-delivery-export';

test('holidays delivery export matches generated manifest counts', () => {
  const delivery = buildHolidaysDeliveryExport();

  assert.equal(delivery.manifest.counts.canonicalEvents, manifest.totalEvents);
  assert.equal(delivery.manifest.counts.publishedCanonicalEvents, manifest.totalPublished);
  assert.equal(delivery.manifest.counts.aliases, manifest.totalAliases);
  assert.equal(
    delivery.manifest.counts.routableSlugs,
    delivery.manifest.counts.canonicalEvents + delivery.manifest.counts.aliases,
  );
});

test('holidays delivery export includes canonical and alias route resolution', () => {
  const delivery = buildHolidaysDeliveryExport();

  assert.deepEqual(delivery.indexes.routeResolutionBySlug.ramadan, {
    canonicalSlug: 'ramadan',
    isAlias: false,
    countryCode: null,
    publishStatus: 'published',
    canonicalPath: '/holidays/ramadan',
  });

  assert.deepEqual(delivery.indexes.routeResolutionBySlug['ramadan-in-egypt'], {
    canonicalSlug: 'ramadan',
    isAlias: true,
    countryCode: 'eg',
    publishStatus: 'published',
    canonicalPath: '/holidays/ramadan',
  });
});

test('holidays delivery export keeps per-slug records and published bundle in sync', () => {
  const delivery = buildHolidaysDeliveryExport();

  assert.ok(delivery.recordsBySlug.ramadan);
  assert.equal(delivery.recordsBySlug.ramadan.core.slug, 'ramadan');
  assert.equal(delivery.bundles.publishedRuntimeRecordsBySlug.ramadan.core.slug, 'ramadan');
  assert.equal(
    Object.keys(delivery.bundles.publishedRuntimeRecordsBySlug).length,
    delivery.indexes.publishedCanonicalSlugs.length,
  );
});
