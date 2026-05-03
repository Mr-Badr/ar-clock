import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import manifest from '@/data/holidays/generated/manifest.json';
import generatedAllEventsList from '@/data/holidays/generated/all-events-list.json';
import generatedPublishedEventsList from '@/data/holidays/generated/published-events-list.json';
import generatedContentBySlug from '@/data/holidays/generated/content-by-slug.json';
import generatedRuntimeRecordsBySlug from '@/data/holidays/generated/runtime-records-by-slug.json';
import {
  ALL_EVENT_SLUGS,
  getEventBySlug,
  getListableEvents,
  resolveEventSlug,
} from '@/lib/events';
import { getRichContent } from '@/lib/event-content';
import {
  getHolidayRuntimeRecord,
  getHolidaySource,
} from '@/lib/holidays/repository';
import { buildCountryDateRows } from '@/lib/holidays/country-dates';
import { COUNTRY_CODES } from '@/lib/events/country-dictionary';

const EVENTS_SOURCE_DIR = join(process.cwd(), 'src/data/holidays/events');

test('manifest and generated event indexes are consistent', () => {
  assert.ok(Array.isArray(manifest.events));
  assert.equal(manifest.totalEvents, manifest.events.length);
  assert.equal(generatedAllEventsList.length, manifest.totalEvents);
  assert.equal(
    generatedPublishedEventsList.length,
    manifest.events.filter((event: any) => event.publishStatus === 'published').length,
  );
});

test('generated event slugs are unique and mapped in content index', () => {
  const slugs = generatedPublishedEventsList.map((event: any) => event.slug);
  const unique = new Set(slugs);
  assert.equal(unique.size, slugs.length);

  for (const slug of slugs) {
    assert.ok(slug in generatedContentBySlug);
  }
});

test('runtime records bundle exists for every canonical event', () => {
  const runtimeRecords = generatedRuntimeRecordsBySlug as Record<string, any>;
  for (const slug of generatedAllEventsList.map((event: any) => event.slug)) {
    const record = runtimeRecords[slug];
    assert.ok(record, `expected runtime record for "${slug}"`);
    assert.equal(record?.slug, slug);
    assert.equal(record?.core?.slug, slug);
    assert.ok(record?.meta);
    assert.ok(record?.source);
  }
});

test('slug index and direct lookup stay in sync', () => {
  assert.equal(ALL_EVENT_SLUGS.length, generatedPublishedEventsList.length);
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

test('repository returns route-aware runtime records with source metadata', () => {
  const record = getHolidayRuntimeRecord('ramadan-in-egypt');
  assert.ok(record);
  assert.equal(record?.requestedSlug, 'ramadan-in-egypt');
  assert.equal(record?.canonicalSlug, 'ramadan');
  assert.equal(record?.isAlias, true);
  assert.equal(record?.countryCode, 'eg');
  assert.equal(record?.core?.slug, 'ramadan');
  assert.ok(record?.content);

  const source = getHolidaySource('ramadan-in-egypt');
  assert.ok(source);
  assert.equal(source?.authoring?.packageFile, 'src/data/holidays/events/ramadan/package.json');
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

  const fitrCanada = resolveEventSlug('eid-al-fitr-in-canada');
  assert.ok(fitrCanada);
  assert.equal(fitrCanada?.canonicalSlug, 'eid-al-fitr');
  assert.equal(fitrCanada?.countryCode, 'ca');
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

  const franceEvents = getListableEvents({ countryCode: 'fr' });
  const franceSlugs = franceEvents.map((event) => event.slug);
  assert.ok(franceSlugs.includes('ramadan-in-france'));
  assert.ok(franceSlugs.includes('eid-al-fitr-in-france'));
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
  assert.ok(rows.some((row: any) => row.code === 'ca'));
  assert.ok(rows.some((row: any) => row.code === 'ps'));
});

test('holiday source packages and qa files stay tier-free', () => {
  const eventDirs = readdirSync(EVENTS_SOURCE_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  for (const slug of eventDirs) {
    const packagePath = join(EVENTS_SOURCE_DIR, slug, 'package.json');
    const qaPath = join(EVENTS_SOURCE_DIR, slug, 'qa.json');
    if (existsSync(packagePath)) {
      const pkg = JSON.parse(readFileSync(packagePath, 'utf8'));
      assert.equal(Object.prototype.hasOwnProperty.call(pkg, 'tier'), false, `${slug} package.json should not contain tier`);
    }
    if (existsSync(qaPath)) {
      const qa = JSON.parse(readFileSync(qaPath, 'utf8'));
      assert.equal(Object.prototype.hasOwnProperty.call(qa, 'tier'), false, `${slug} qa.json should not contain tier`);
    }
  }
});

test('shared holiday packages are country-ready by contract', () => {
  const eventDirs = readdirSync(EVENTS_SOURCE_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  for (const slug of eventDirs) {
    const packagePath = join(EVENTS_SOURCE_DIR, slug, 'package.json');
    if (!existsSync(packagePath)) continue;
    const pkg = JSON.parse(readFileSync(packagePath, 'utf8'));
    if (pkg.countryScope !== 'all') continue;

    assert.equal(pkg.core?._countryCode ?? null, null, `${slug} should stay canonical, not country-specific`);
    assert.ok(
      Array.isArray(pkg.keywordTemplateSet?.country) && pkg.keywordTemplateSet.country.length > 0,
      `${slug} should define keywordTemplateSet.country for generated country SEO`,
    );
  }
});
