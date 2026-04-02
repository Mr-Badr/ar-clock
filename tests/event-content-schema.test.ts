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
});

test('detects hardcoded years for strict cleanup', () => {
  const { flags } = parseRichContent('slug', {
    answerSummary: 'رمضان 2027 يبدأ قريباً',
  });
  assert.equal(flags.hasHardcodedYear, true);
});

