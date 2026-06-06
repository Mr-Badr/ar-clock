import test from 'node:test';
import assert from 'node:assert/strict';

import {
  ensureCountryContextSentence,
  localizeEventLabel,
} from '@/lib/holidays/display';
import { buildHolidayPageModel } from '@/lib/holidays/page-model';
import { getHolidayDisplayTitle } from '@/lib/holidays/search-intent';

test('localizeEventLabel appends country name for alias-like events when missing', () => {
  const event = { _countryCode: 'eg' };
  assert.equal(localizeEventLabel('رأس السنة 2027', event), 'رأس السنة 2027 في مصر');
});

test('localizeEventLabel avoids duplicating country names', () => {
  const event = { _countryCode: 'ma' };
  assert.equal(localizeEventLabel('رمضان 2027 في المغرب', event), 'رمضان 2027 في المغرب');
});

test('localizeEventLabel preserves trailing punctuation naturally', () => {
  const event = { _countryCode: 'eg' };
  assert.equal(localizeEventLabel('متى رأس السنة 2027؟', event), 'متى رأس السنة 2027 في مصر؟');
});

test('ensureCountryContextSentence adds a localized fallback sentence once', () => {
  const event = { _countryCode: 'qa' };
  const text = ensureCountryContextSentence('عد تنازلي دقيق للحدث.', event);
  assert.match(text, /قطر/);
  assert.match(text, /الموعد والمعلومات/);
});

test('holiday page model uses a clean event label instead of question-style SEO h1', () => {
  const model = buildHolidayPageModel({
    event: { name: 'رمضان', category: 'islamic', type: 'hijri' },
    seo: {
      seoMeta: { h1: 'متى رمضان 2027؟' },
      answerSummary: '',
    },
    quickFacts: [],
    faqItems: [],
    tokenContext: { eventName: 'رمضان', year: 2027, hijriYear: 1448 },
    calInfo: null,
    nowIso: '2026-06-03T00:00:00.000Z',
  });

  assert.equal(model.meta.displayTitle, 'رمضان');
  assert.equal(model.hero.title, 'رمضان');
});

test('holiday search display title does not inherit question-style SEO h1', () => {
  const title = getHolidayDisplayTitle({
    event: { name: 'رمضان', category: 'islamic', type: 'hijri' },
    seo: {
      seoMeta: { h1: 'متى رمضان 2027؟' },
      seoTitle: 'متى رمضان 2027؟',
    },
    tokenContext: { eventName: 'رمضان', year: 2027, hijriYear: 1448 },
  });

  assert.equal(title, 'رمضان');
});
