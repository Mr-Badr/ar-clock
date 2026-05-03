/**
 * Runtime resolver for event core data.
 *
 * Authoring lives in:
 *   src/data/holidays/events/<slug>/
 *
 * Runtime compatibility helpers in this module now delegate to the centralized
 * holidays repository so the future storage backend can change in one place.
 */

import {
  ACTIVE_CANONICAL_HOLIDAY_EVENTS,
  ALL_ALIAS_HOLIDAY_SLUGS,
  ALL_CANONICAL_HOLIDAY_EVENTS,
  ALL_CANONICAL_HOLIDAY_SLUGS,
  ALL_ROUTE_HOLIDAY_SLUGS,
  getAliasesForCanonicalHoliday,
  getHolidayAliasMeta,
  getHolidayCoreEventBySlug,
  getHolidayMeta,
  getListableHolidayEvents,
  resolveHolidaySlug,
} from '@/lib/holidays/repository';

const GENERATED_SOURCE_ALL_EVENTS = Array.isArray(ALL_CANONICAL_HOLIDAY_EVENTS)
  ? ALL_CANONICAL_HOLIDAY_EVENTS
  : [];
const hasGeneratedEvents = GENERATED_SOURCE_ALL_EVENTS.length > 0;

if (!hasGeneratedEvents && process.env.NODE_ENV !== 'test') {
  console.warn(
    '[events/index] Generated event indexes are empty. Run "npm run dev", "npm run build", or "npm run events:build" to compile src/data/holidays/events.',
  );
}

export const SOURCE_RAW_EVENTS = GENERATED_SOURCE_ALL_EVENTS;
export const ALL_RAW_EVENTS = ACTIVE_CANONICAL_HOLIDAY_EVENTS;
export const ALL_EVENT_SLUGS = ACTIVE_CANONICAL_HOLIDAY_EVENTS.map((event) => event.slug);
export const ALL_CANONICAL_EVENT_SLUGS = ALL_CANONICAL_HOLIDAY_SLUGS;
export const ALL_ALIAS_SLUGS = ALL_ALIAS_HOLIDAY_SLUGS;
export const ALL_ROUTE_EVENT_SLUGS = ALL_ROUTE_HOLIDAY_SLUGS;

export function getAliasMeta(slug) {
  return getHolidayAliasMeta(slug);
}

export function getEventMeta(slug) {
  return getHolidayMeta(slug);
}

export function getAliasesForCanonical(slug) {
  return getAliasesForCanonicalHoliday(slug);
}

export function resolveEventSlug(slug) {
  return resolveHolidaySlug(slug);
}

export function getEventBySlug(slug) {
  return getHolidayCoreEventBySlug(slug);
}

export function getListableEvents(options = {}) {
  return getListableHolidayEvents(options);
}
