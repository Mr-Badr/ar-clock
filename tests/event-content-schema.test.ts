import test from 'node:test';
import assert from 'node:assert/strict';
import { parseRichContent } from '@/lib/event-content/schema';

test('normalizes faq format to faq and faqItems', () => {
  const { content } = parseRichContent('slug', {
    faq: [{ question: 'س', answer: 'ج' }],
  });
  const normalizedContent = content as {
    faq: Array<{ question: string }>;
    faqItems: Array<{ q: string }>;
    schemaData: { faqSchemaItems: Array<{ question: string }> };
  };
  assert.equal(normalizedContent.faq.length, 1);
  assert.equal(normalizedContent.faqItems.length, 1);
  assert.equal(normalizedContent.faqItems[0].q, 'س');
  assert.equal(normalizedContent.schemaData.faqSchemaItems.length, 1);
  assert.equal(normalizedContent.schemaData.faqSchemaItems[0].question, 'س');
});

test('normalizes schemaData faqSchemaItems into faq and faqItems', () => {
  const { content } = parseRichContent('slug', {
    schemaData: {
      faqSchemaItems: [{ question: 'س', answer: 'ج' }],
    },
  });
  const normalizedContent = content as {
    faq: Array<{ question: string }>;
    faqItems: Array<{ a: string }>;
  };
  assert.equal(normalizedContent.faq.length, 1);
  assert.equal(normalizedContent.faq[0].question, 'س');
  assert.equal(normalizedContent.faqItems.length, 1);
  assert.equal(normalizedContent.faqItems[0].a, 'ج');
});

test('detects hardcoded years for strict cleanup', () => {
  const { flags } = parseRichContent('slug', {
    answerSummary: 'رمضان 2027 يبدأ قريباً',
  });
  assert.equal(flags.hasHardcodedYear, true);
});
