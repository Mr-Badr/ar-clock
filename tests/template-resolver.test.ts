import test from 'node:test';
import assert from 'node:assert/strict';
import { buildTemplateContext, resolveTemplate } from '@/lib/template-resolver';
import { replaceTokens, getNextEventDate } from '@/lib/holidays-engine';

test('resolveTemplate replaces known keys and keeps unknown tokens', () => {
  const out = resolveTemplate('موعد {{eventName}} بعد {{daysRemaining}} يوم {{unknown}}', {
    eventName: 'رمضان',
    daysRemaining: 12,
  });
  assert.equal(out, 'موعد رمضان بعد 12 يوم {{unknown}}');
});

test('buildTemplateContext injects nextYear automatically', () => {
  const ctx = buildTemplateContext({ year: 2026, hijriYear: 1448 });
  assert.equal(ctx.nextYear, 2027);
  assert.equal(ctx.hijriYear, 1448);
});

test('replaceTokens supports object context', () => {
  const out = replaceTokens('{{eventName}} {{year}} {{daysRemaining}}', {
    eventName: 'عيد الفطر',
    year: 2026,
    daysRemaining: 5,
  });
  assert.equal(out, 'عيد الفطر 2026 5');
});

test('getNextEventDate resolves tokenized estimated dates', () => {
  const now = new Date('2026-04-01T00:00:00.000Z').getTime();
  const date = getNextEventDate(
    { slug: 'x', name: 'x', type: 'estimated', date: '{{year}}-06-11' },
    {},
    now,
  );
  assert.equal(date.getFullYear(), 2026);
  assert.equal(date.getMonth(), 5);
  assert.equal(date.getDate(), 11);
});
