import test from 'node:test';
import assert from 'node:assert/strict';
import manifest from '@/lib/events/manifest.json';
import {
  GENERATED_ALL_EVENTS_LIST,
  GENERATED_EVENTS_LIST,
} from '@/lib/events/generated-index';
import { GENERATED_CONTENT_BY_SLUG } from '@/lib/event-content/generated-index';
import {
  ALL_EVENT_SLUGS,
  getEventBySlug,
  getListableEvents,
  resolveEventSlug,
} from '@/lib/events';
import { getRichContent } from '@/lib/event-content';
import { buildCountryDateRows } from '@/lib/holidays/country-dates';
import { COUNTRY_CODES } from '@/lib/events/country-dictionary';

test('manifest and generated event indexes are consistent', () => {
  assert.ok(Array.isArray(manifest.events));
  assert.equal(manifest.totalEvents, manifest.events.length);
  assert.equal(GENERATED_ALL_EVENTS_LIST.length, manifest.totalEvents);
  assert.equal(
    GENERATED_EVENTS_LIST.length,
    manifest.events.filter((event: any) => event.publishStatus === 'published').length,
  );
});

test('generated event slugs are unique and mapped in content index', () => {
  const slugs = GENERATED_EVENTS_LIST.map((event: any) => event.slug);
  const unique = new Set(slugs);
  assert.equal(unique.size, slugs.length);

  for (const slug of slugs) {
    assert.ok(slug in GENERATED_CONTENT_BY_SLUG);
  }
});

test('slug index and direct lookup stay in sync', () => {
  assert.equal(ALL_EVENT_SLUGS.length, GENERATED_EVENTS_LIST.length);
  for (const slug of ALL_EVENT_SLUGS) {
    const event = getEventBySlug(slug);
    assert.ok(event, `expected event for slug "${slug}"`);
    assert.equal(event?.slug, slug);
  }
});

test('legacy alias slug resolves to canonical event', () => {
  const resolved = resolveEventSlug('ramadan-in-egypt');
  assert.ok(resolved);
  assert.equal(resolved?.canonicalSlug, 'ramadan');
  assert.equal(resolved?.isAlias, true);

  const event = getEventBySlug('ramadan-in-egypt');
  assert.ok(event);
  assert.equal(event?.slug, 'ramadan');
  assert.equal(event?.__canonicalSlug, 'ramadan');
  assert.equal(event?.__isAlias, true);
});

test('eid aliases resolve for all supported countries', () => {
  const fitrEgypt = resolveEventSlug('eid-al-fitr-in-egypt');
  assert.ok(fitrEgypt);
  assert.equal(fitrEgypt?.canonicalSlug, 'eid-al-fitr');
  assert.equal(fitrEgypt?.countryCode, 'eg');

  const adhaQatar = resolveEventSlug('eid-al-adha-in-qatar');
  assert.ok(adhaQatar);
  assert.equal(adhaQatar?.canonicalSlug, 'eid-al-adha');
  assert.equal(adhaQatar?.countryCode, 'qa');
});

test('global hijri islamic events auto-expand aliases by country', () => {
  const arafaEgypt = resolveEventSlug('day-of-arafa-in-egypt');
  assert.ok(arafaEgypt);
  assert.equal(arafaEgypt?.canonicalSlug, 'day-of-arafa');
  assert.equal(arafaEgypt?.countryCode, 'eg');
});

test('country directory listing expands shared events into localized route slugs', () => {
  const egyptEvents = getListableEvents({ countryCode: 'eg' });
  const egyptSlugs = egyptEvents.map((event) => event.slug);

  assert.ok(egyptSlugs.includes('ramadan-in-egypt'));
  assert.ok(egyptSlugs.includes('eid-al-fitr-in-egypt'));
  assert.ok(egyptSlugs.includes('eid-al-adha-in-egypt'));
  assert.equal(egyptSlugs.includes('ramadan'), false);
});

test('countryScope all events build country rows for every supported country', async () => {
  const base = getEventBySlug('eid-al-fitr');
  assert.ok(base);
  const event = { ...base, ...getRichContent('eid-al-fitr') };

  const rows = await buildCountryDateRows({
    event,
    targetDate: new Date('2026-01-01T00:00:00.000Z'),
    tokenContext: { year: 2026, hijriYear: 1447, eventName: event.name },
    resolveHijriEvents: async (events: any[]) => Object.fromEntries(
      events.map((entry) => [
        entry.slug,
        { isoString: '2026-03-10' },
      ]),
    ),
  });

  assert.equal(rows.length, COUNTRY_CODES.length);
  assert.ok(rows.some((row: any) => row.code === 'qa'));
  assert.ok(rows.some((row: any) => row.code === 'tn'));
});
