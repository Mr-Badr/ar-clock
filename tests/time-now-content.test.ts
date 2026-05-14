import test from 'node:test';
import assert from 'node:assert/strict';

import {
  buildCityTimeNowFaqItems,
  buildCountryTimeNowFaqItems,
  getCountriesSharingCurrentOffset,
  getTimeNowSeoFacts,
} from '@/lib/time-now-content';

const REFERENCE_ISO = '2026-06-15T12:00:00.000Z';

test('time-now seo facts expose concrete UTC relation and local dates', () => {
  const facts = getTimeNowSeoFacts({
    timezone: 'Asia/Riyadh',
    utcOffset: 'GMT+3',
    referenceDateOrIso: REFERENCE_ISO,
    placeAr: 'الرياض',
  });

  assert.equal(facts.offsetLabel, 'GMT+3');
  assert.match(facts.utcRelationSentence, /تسبق توقيت غرينتش/);
  assert.ok(facts.gregorianDateAr.length > 0);
});

test('same-offset countries are derived from current offset and exclude the active country', () => {
  const countries = [
    { country_slug: 'saudi-arabia', country_code: 'SA', name_ar: 'السعودية', name_en: 'Saudi Arabia', timezone: 'Asia/Riyadh' },
    { country_slug: 'russia', country_code: 'RU', name_ar: 'روسيا', name_en: 'Russia', timezone: 'Europe/Moscow' },
    { country_slug: 'kenya', country_code: 'KE', name_ar: 'كينيا', name_en: 'Kenya', timezone: 'Africa/Nairobi' },
    { country_slug: 'uae', country_code: 'AE', name_ar: 'الإمارات', name_en: 'UAE', timezone: 'Asia/Dubai' },
  ];

  const matches = getCountriesSharingCurrentOffset(countries, {
    referenceTimezone: 'Asia/Riyadh',
    referenceDateOrIso: REFERENCE_ISO,
    excludeCountrySlug: 'saudi-arabia',
  });

  assert.deepEqual(
    [...matches.map((item) => item.country_slug)].sort(),
    ['kenya', 'russia'],
  );
});

test('city time-now faq items use concrete timezone wording instead of placeholder phrasing', () => {
  const items = buildCityTimeNowFaqItems({
    countryAr: 'السعودية',
    cityAr: 'الرياض',
    timezone: 'Asia/Riyadh',
    utcOffset: 'GMT+3',
    referenceDateOrIso: REFERENCE_ISO,
  });

  assert.equal(items.length, 5);
  assert.match(items[1].a, /تسبق توقيت غرينتش/);
  assert.doesNotMatch(items[1].a, /تسبق \/ تتأخر/);
  assert.doesNotMatch(items[0].a, /يُعرض في أعلى هذه الصفحة/);
});

test('country time-now faq items mention capital coverage and city inventory', () => {
  const items = buildCountryTimeNowFaqItems({
    countryAr: 'السعودية',
    capitalAr: 'الرياض',
    timezone: 'Asia/Riyadh',
    utcOffset: 'GMT+3',
    referenceDateOrIso: REFERENCE_ISO,
    cityCount: 12,
  });

  assert.equal(items.length, 5);
  assert.match(items[1].a, /الرياض/);
  assert.match(items[1].a, /12 من المدن المهمة/);
});
