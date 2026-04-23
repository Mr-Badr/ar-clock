import test from 'node:test';
import assert from 'node:assert/strict';

import {
  buildRichContentScaffold,
  suggestRelatedSlugs,
} from '../scripts/lib/event-scaffold';

test('buildRichContentScaffold creates baseline SEO and content sections', () => {
  const scaffold = buildRichContentScaffold(
    {
      slug: 'demo-event',
      name: 'مناسبة تجريبية',
      type: 'fixed',
      category: 'holidays',
    },
    '2026-03-31T00:00:00.000Z',
  );

  assert.ok(scaffold.answerSummary);
  assert.ok(scaffold.seoMeta?.titleTag);
  assert.ok(scaffold.seoMeta?.primaryKeyword);
  assert.equal(Array.isArray(scaffold.faq), true);
  assert.equal(scaffold.faq.length >= 6, true);
  assert.equal('faqItems' in scaffold, false);
  assert.equal('faqSchemaItems' in (scaffold.schemaData || {}), false);
  assert.equal(Array.isArray(scaffold.intentCards), true);
});

test('buildRichContentScaffold adds Gregorian-Hijri year pair for islamic events', () => {
  const scaffold = buildRichContentScaffold(
    {
      slug: 'ramadan',
      name: 'رمضان',
      type: 'hijri',
      category: 'islamic',
    },
    '2026-03-31T00:00:00.000Z',
  );

  assert.match(scaffold.seoTitle || '', /\{\{year\}\} - \{\{hijriYear\}\} هـ/);
  assert.match(scaffold.description || '', /\{\{year\}\} - \{\{hijriYear\}\} هـ/);
  assert.match(scaffold.seoMeta?.titleTag || '', /\{\{year\}\} - \{\{hijriYear\}\} هـ/);
  assert.match(scaffold.schemaData?.articleHeadline || '', /\{\{year\}\} - \{\{hijriYear\}\} هـ/);
});

test('suggestRelatedSlugs prioritizes same category first', () => {
  const result = suggestRelatedSlugs(
    { slug: 'a', category: 'islamic', queueOrder: 10 },
    [
      { slug: 'a', category: 'islamic', queueOrder: 10 },
      { slug: 'b', category: 'islamic', queueOrder: 11 },
      { slug: 'c', category: 'national', queueOrder: 9 },
      { slug: 'd', category: 'islamic', queueOrder: 20 },
      { slug: 'e', category: 'school', queueOrder: 12 },
      { slug: 'f', category: 'holidays', queueOrder: 13 },
    ],
  );

  assert.equal(result[0], 'b');
  assert.equal(result.includes('a'), false);
  assert.equal(result.length, 4);
});
