/**
 * src/lib/events/index.js
 * Runtime resolver for event core data.
 *
 * Source-of-truth authoring lives in:
 *   src/data/holidays/events/<slug>/package.json
 * and is compiled into generated JSON indexes via scripts/generate-events-index.ts.
 *
 * Important:
 *   Runtime no longer reads legacy hand-authored JS event lists. Generated JSON
 *   is the only active data source, which keeps authoring and runtime aligned.
 */

import {
  GENERATED_ALL_EVENTS_BY_SLUG,
  GENERATED_ALL_EVENTS_LIST,
  GENERATED_EVENT_META_BY_SLUG,
  GENERATED_EVENTS_BY_SLUG,
  GENERATED_EVENTS_LIST,
} from './generated-index.js';
import {
  GENERATED_ALIAS_META_BY_SLUG,
  GENERATED_ALIAS_TO_CANONICAL,
  GENERATED_CANONICAL_TO_ALIASES,
} from './generated-aliases.js';
import { featureFlags } from '@/lib/feature-flags';
import { getHolidayCountryByCode } from '@/lib/holidays/taxonomy';

const GENERATED_SOURCE_ALL_EVENTS = Array.isArray(GENERATED_ALL_EVENTS_LIST)
  ? GENERATED_ALL_EVENTS_LIST
  : [];
const hasGeneratedEvents = GENERATED_SOURCE_ALL_EVENTS.length > 0;

if (!hasGeneratedEvents && process.env.NODE_ENV !== 'test') {
  console.warn(
    '[events/index] Generated event indexes are empty. Run "npm run events:build" to compile src/data/holidays/events.',
  );
}

export const SOURCE_RAW_EVENTS = GENERATED_SOURCE_ALL_EVENTS;

const GENERATED_ACTIVE_EVENTS_LIST = featureFlags.eventsPublishedOnly
  ? GENERATED_EVENTS_LIST
  : GENERATED_SOURCE_ALL_EVENTS;
const GENERATED_ACTIVE_EVENTS_BY_SLUG = featureFlags.eventsPublishedOnly
  ? GENERATED_EVENTS_BY_SLUG
  : GENERATED_ALL_EVENTS_BY_SLUG;

export const ALL_RAW_EVENTS = GENERATED_ACTIVE_EVENTS_LIST;

const ACTIVE_EVENTS_BY_SLUG =
  GENERATED_ACTIVE_EVENTS_BY_SLUG ||
  Object.fromEntries(ALL_RAW_EVENTS.map((event) => [event.slug, event]));

const ALL_EVENTS_BY_SLUG =
  GENERATED_ALL_EVENTS_BY_SLUG ||
  ACTIVE_EVENTS_BY_SLUG;

export const ALL_EVENT_SLUGS = ALL_RAW_EVENTS.map((event) => event.slug);
export const ALL_CANONICAL_EVENT_SLUGS = GENERATED_SOURCE_ALL_EVENTS.map((event) => event.slug);
export const ALL_ALIAS_SLUGS = Object.keys(GENERATED_ALIAS_TO_CANONICAL || {}).filter((slug) => {
  const canonicalSlug = GENERATED_ALIAS_TO_CANONICAL?.[slug];
  return Boolean(canonicalSlug && ACTIVE_EVENTS_BY_SLUG[canonicalSlug]);
});
export const ALL_ROUTE_EVENT_SLUGS = [...ALL_EVENT_SLUGS, ...ALL_ALIAS_SLUGS];

export function getAliasMeta(slug) {
  return GENERATED_ALIAS_META_BY_SLUG?.[slug] || null;
}

export function getEventMeta(slug) {
  const resolved = resolveEventSlug(slug);
  const canonicalSlug = resolved?.canonicalSlug || slug;
  return GENERATED_EVENT_META_BY_SLUG?.[canonicalSlug] || null;
}

export function getAliasesForCanonical(slug) {
  return GENERATED_CANONICAL_TO_ALIASES?.[slug] || [];
}

export function resolveEventSlug(slug) {
  if (!slug) return null;
  if (ACTIVE_EVENTS_BY_SLUG[slug]) {
    return {
      requestedSlug: slug,
      canonicalSlug: slug,
      isAlias: false,
      countryCode: null,
    };
  }

  const canonicalSlug = GENERATED_ALIAS_TO_CANONICAL?.[slug];
  if (!canonicalSlug) return null;

  const aliasMeta = getAliasMeta(slug);
  const canonicalAvailable =
    ACTIVE_EVENTS_BY_SLUG[canonicalSlug] ||
    ALL_EVENTS_BY_SLUG[canonicalSlug] ||
    null;
  if (!canonicalAvailable) return null;

  return {
    requestedSlug: slug,
    canonicalSlug,
    isAlias: true,
    countryCode: aliasMeta?.countryCode || null,
  };
}

export function getEventBySlug(slug) {
  const resolved = resolveEventSlug(slug);
  if (!resolved) return null;
  const base =
    ACTIVE_EVENTS_BY_SLUG[resolved.canonicalSlug] ||
    ALL_EVENTS_BY_SLUG[resolved.canonicalSlug] ||
    null;
  if (!base) return null;
  return {
    ...base,
    __requestedSlug: resolved.requestedSlug,
    __canonicalSlug: resolved.canonicalSlug,
    __isAlias: resolved.isAlias,
    __aliasCountryCode: resolved.countryCode,
  };
}

function buildRouteEvent(baseEvent, routeSlug, countryCode = null) {
  return {
    ...baseEvent,
    slug: routeSlug,
    __requestedSlug: routeSlug,
    __canonicalSlug: baseEvent.slug,
    __isAlias: routeSlug !== baseEvent.slug,
    __aliasCountryCode: routeSlug !== baseEvent.slug ? countryCode : null,
    _countryCode: routeSlug !== baseEvent.slug
      ? countryCode
      : (baseEvent._countryCode || null),
  };
}

/**
 * Returns the route-aware event pool used by the /holidays directory.
 *
 * Behavior:
 * - no country filter => canonical events only (clean listing, no duplicates)
 * - country filter    => country-specific events for that country
 *   - single-country canonicals stay as-is
 *   - shared canonicals with aliases expand into the matching country route
 *   - global non-country events remain visible as canonical pages
 *
 * This makes `countryScope: "all"` effectively automatic for listing/filtering,
 * while keeping authoring inside the canonical event package only.
 */
export function getListableEvents(options = {}) {
  const requestedCountryCode = String(options.countryCode || '').trim().toLowerCase();
  if (!requestedCountryCode || requestedCountryCode === 'all') {
    return ALL_RAW_EVENTS.map((event) => buildRouteEvent(event, event.slug, event._countryCode || null));
  }

  const validCountryCode = getHolidayCountryByCode(requestedCountryCode)?.code || requestedCountryCode;
  const results = [];
  const seen = new Set();

  const pushUnique = (event) => {
    if (!event?.slug || seen.has(event.slug)) return;
    seen.add(event.slug);
    results.push(event);
  };

  for (const event of ALL_RAW_EVENTS) {
    if (event._countryCode) {
      if (event._countryCode === validCountryCode) {
        pushUnique(buildRouteEvent(event, event.slug, event._countryCode));
      }
      continue;
    }

    const aliasSlug = getAliasesForCanonical(event.slug).find(
      (slug) => getAliasMeta(slug)?.countryCode === validCountryCode,
    );

    if (aliasSlug) {
      pushUnique(buildRouteEvent(event, aliasSlug, validCountryCode));
      continue;
    }

    pushUnique(buildRouteEvent(event, event.slug, null));
  }

  return results;
}
