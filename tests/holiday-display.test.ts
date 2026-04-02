import test from 'node:test';
import assert from 'node:assert/strict';

import {
  ensureCountryContextSentence,
  localizeEventLabel,
} from '@/lib/holidays/display';

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
