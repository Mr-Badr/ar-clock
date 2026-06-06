import test from 'node:test';
import assert from 'node:assert/strict';

import { buildBlogArticleFailureContext } from '@/lib/blog/observability';
import { normalizeGuideRecord } from '@/lib/guides/page-model';

test('normalizeGuideRecord keeps valid content and drops invalid guide entries safely', () => {
  const guide = normalizeGuideRecord({
    slug: 'sample-guide',
    href: '/blog/sample-guide',
    title: 'مقال تجريبي',
    description: 'وصف مختصر',
    quickAnswers: [
      { question: 'سؤال صالح', answer: 'جواب صالح' },
      { question: 'ناقص' },
    ],
    steps: { title: 'ليست مصفوفة' },
    infoItems: [
      { title: 'معلومة', content: 'شرح طويل' },
      { title: '', content: 'عنصر مكسور' },
    ],
    sections: [
      { title: 'قسم', body: 'محتوى القسم' },
      'broken',
    ],
    checklist: {
      title: 'افتح هذا المقال عندما',
      description: 'حالات مناسبة للقراءة',
      items: ['عند المقارنة', '', null],
    },
    faqItems: [
      { q: 'هل يعمل؟', a: 'نعم' },
      { question: 'عنصر مكسور' },
    ],
    comparison: {
      title: 'مقارنة',
      description: 'وصف',
      columns: ['خيار أول', 'خيار ثان'],
      rows: [
        { label: 'نقطة', values: ['أ', 'ب'] },
        { label: 'صف مكسور', values: ['قيمة وحيدة'] },
      ],
    },
  });

  assert.equal(guide.quickAnswers.length, 1);
  assert.equal(guide.infoItems.length, 1);
  assert.equal(guide.sections.length, 1);
  assert.equal(guide.faqItems.length, 1);
  assert.equal(guide.checklist?.items.length, 1);
  assert.equal(guide.comparison?.rows.length, 1);
  assert.equal(guide.contentHealth.degraded, true);
  assert.deepEqual(guide.contentHealth.invalidSections, {
    quickAnswers: 1,
    steps: 1,
    infoItems: 1,
    sections: 1,
    faqItems: 1,
    comparisonRows: 1,
  });
});

test('buildBlogArticleFailureContext includes route path and content health summary', () => {
  const context = buildBlogArticleFailureContext({
    slug: 'sample-guide',
    section: 'content-model',
    degraded: true,
    contentHealth: {
      degraded: true,
      invalidSections: { faqItems: 2 },
      issueEntries: [{ section: 'faqItems', count: 2 }],
    },
  });

  assert.equal(context.slug, 'sample-guide');
  assert.equal(context.routePath, '/blog/sample-guide');
  assert.equal(context.section, 'content-model');
  assert.equal(context.degraded, true);
  assert.deepEqual(context.contentHealth, {
    degraded: true,
    invalidSections: { faqItems: 2 },
    issueEntries: [{ section: 'faqItems', count: 2 }],
  });
});
