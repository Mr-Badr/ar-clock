import test from 'node:test';
import assert from 'node:assert/strict';

import { buildHolidayFailureContext } from '@/lib/holidays/observability';

test('buildHolidayFailureContext includes route, section, degraded state, and serialized error', () => {
  const context = buildHolidayFailureContext({
    slug: 'hajj-season',
    canonicalSlug: 'hajj-season',
    section: 'country-dates',
    degraded: true,
    error: new Error('country dates fetch failed'),
    extraContext: {
      relatedSlugs: ['eid-al-adha'],
    },
  });

  assert.deepEqual(context, {
    slug: 'hajj-season',
    canonicalSlug: 'hajj-season',
    routePath: '/holidays/hajj-season',
    section: 'country-dates',
    degraded: true,
    error: {
      name: 'Error',
      message: 'country dates fetch failed',
    },
    relatedSlugs: ['eid-al-adha'],
  });
});
