import test from 'node:test';
import assert from 'node:assert/strict';

import {
  ensureIslamicYearPair,
  normalizeIslamicRichContentYears,
} from '@/lib/islamic-year-format';

test('ensureIslamicYearPair upgrades a Gregorian-only template to Gregorian-Hijri pair', () => {
  assert.equal(
    ensureIslamicYearPair('رمضان {{year}}', { eventName: 'رمضان' }),
    'رمضان {{year}} - {{hijriYear}} هـ',
  );
});

test('normalizeIslamicRichContentYears updates title and description fields together', () => {
  const content = normalizeIslamicRichContentYears({
    seoTitle: 'متى رمضان {{year}} — عد تنازلي دقيق',
    description: 'تعرف على موعد رمضان {{year}} مع عداد تنازلي دقيق.',
    seoMeta: {
      titleTag: 'رمضان {{year}} | العد التنازلي',
      metaDescription: 'تعرف على موعد رمضان {{year}} مع عداد تنازلي دقيق.',
    },
    schemaData: {
      eventName: 'رمضان {{year}}',
      eventDescription: 'رمضان صفحة عربية تشرح الموعد.',
      articleHeadline: 'رمضان {{year}} — العد التنازلي والمعلومات الكاملة',
    },
  }, {
    eventName: 'رمضان',
  });

  assert.match(content.seoTitle || '', /\{\{year\}\} - \{\{hijriYear\}\} هـ/);
  assert.match(content.description || '', /\{\{year\}\} - \{\{hijriYear\}\} هـ/);
  assert.match(content.seoMeta?.titleTag || '', /\{\{year\}\} - \{\{hijriYear\}\} هـ/);
  assert.match(content.schemaData?.eventDescription || '', /\{\{year\}\} - \{\{hijriYear\}\} هـ/);
});
