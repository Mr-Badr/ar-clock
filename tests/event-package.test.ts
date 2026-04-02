import test from 'node:test';
import assert from 'node:assert/strict';
import { parseEventPackage } from '@/lib/events/package-schema';

test('parses a valid minimal event package', () => {
  const pkg = parseEventPackage('demo', {
    core: {
      id: 'demo',
      slug: 'demo',
      name: 'مناسبة تجريبية',
      type: 'fixed',
      category: 'holidays',
      month: 1,
      day: 1,
    },
    richContent: {
      faq: [{ question: 'س', answer: 'ج' }],
      relatedSlugs: [],
    },
    publishStatus: 'drafted',
    tier: 'tier3',
    canonicalPath: '/holidays/demo',
  });
  assert.equal(pkg.core.slug, 'demo');
  assert.equal(pkg.publishStatus, 'drafted');
});

test('rejects wrong canonical path', () => {
  assert.throws(() =>
    parseEventPackage('demo', {
      core: {
        id: 'demo',
        slug: 'demo',
        name: 'demo',
        type: 'fixed',
        category: 'holidays',
      },
      richContent: {},
      canonicalPath: '/holidays/other',
    }),
  );
});
