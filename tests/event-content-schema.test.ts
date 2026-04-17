import test from 'node:test';
import assert from 'node:assert/strict';
import { parseRichContent } from '@/lib/event-content/schema';

test('normalizes faq format to faq and faqItems', () => {
  const { content } = parseRichContent('slug', {
    faq: [{ question: 'س', answer: 'ج' }],
  });
  assert.equal(content.faq.length, 1);
  assert.equal(content.faqItems.length, 1);
  assert.equal(content.faqItems[0].q, 'س');
  assert.equal(content.schemaData.faqSchemaItems.length, 1);
  assert.equal(content.schemaData.faqSchemaItems[0].question, 'س');
});

test('normalizes schemaData faqSchemaItems into faq and faqItems', () => {
  const { content } = parseRichContent('slug', {
    schemaData: {
      faqSchemaItems: [{ question: 'س', answer: 'ج' }],
    },
  });
  assert.equal(content.faq.length, 1);
  assert.equal(content.faq[0].question, 'س');
  assert.equal(content.faqItems.length, 1);
  assert.equal(content.faqItems[0].a, 'ج');
});

test('detects hardcoded years for strict cleanup', () => {
  const { flags } = parseRichContent('slug', {
    answerSummary: 'رمضان 2027 يبدأ قريباً',
  });
  assert.equal(flags.hasHardcodedYear, true);
});
