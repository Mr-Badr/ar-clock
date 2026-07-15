import { cacheLife, cacheTag } from 'next/cache';

import {
  ALL_EVENTS,
  CATEGORIES,
  enrichEvent,
  getNextEventDate,
  formatGregorianAr,
  resolveEventMeta,
} from '@/lib/holidays-engine';
import { getCountryByCode } from '@/lib/events/country-dictionary';
import { COUNTRY_META } from '@/lib/calendar-config';
import {
  getHolidayRuntimeRecord,
  getListableHolidayEvents,
} from '@/lib/holidays/repository';
import { resolveAllHijriEvents } from '@/lib/hijri-resolver';
import { getCachedNowIso } from '@/lib/date-utils';

import { PAGE_SIZE } from './constants';
import { normalizeHolidayFilter } from './holidays-filter-utils';
import {
  compareHolidayEventsByTargetDate,
  scoreHolidaySearchMatch,
} from './search-utils';

function annotate(raw, resolvedMap, nowMs) {
  const base = enrichEvent(raw);
  const routeSlug = base.__requestedSlug || base.slug;
  const countryCode = base.__aliasCountryCode || base._countryCode || null;
  const country = getCountryByCode(countryCode);
  const runtimeRecord = getHolidayRuntimeRecord(routeSlug);
  const ev = {
    ...base,
    slug: routeSlug,
    ...(runtimeRecord?.content || {}),
    _countryCode: countryCode,
  };
  const target = getNextEventDate(ev, resolvedMap, nowMs);
  const cal = resolvedMap[routeSlug] || null;
  const meta = resolveEventMeta(
    ev,
    target,
    ev.type === 'hijri' && cal?.hijriYear ? cal.hijriYear : null,
  );
  const displayName = base.__isAlias && country?.nameAr
    ? `${base.name} في ${country.nameAr}`
    : ev.name;

  return {
    slug: routeSlug,
    name: displayName,
    type: ev.type,
    category: ev.category || 'islamic',
    seoTitle: meta.seoTitle,
    description: meta.description,
    keywords: meta.keywords,
    _countryCode: ev._countryCode || null,
    _targetISO: target.toISOString(),
    _daysLeft: Math.max(0, Math.ceil((target.getTime() - nowMs) / 86_400_000)),
    _formatted: formatGregorianAr(target),
    _calMethod: cal?.labelShort || null,
    _calVariance: cal?.variance ?? 0,
    _calAccuracy: cal?.accuracy || 'high',
    _localSighting: cal?.localSighting || false,
    __canonicalSlug: base.__canonicalSlug || base.slug,
    __isAlias: Boolean(base.__isAlias),
  };
}

async function buildEventsPage(cursor = 0, filter = {}) {
  const normalizedFilter = normalizeHolidayFilter(filter);

  const includeCountrySeoAliases = Boolean(
    normalizedFilter.search.trim() || normalizedFilter.category !== 'all',
  );

  let pool = normalizedFilter.countryCode !== 'all'
    ? getListableHolidayEvents({
        countryCode: normalizedFilter.countryCode,
        includeCountrySeoAliases,
      }).map(enrichEvent)
    : ALL_EVENTS.map(enrichEvent);

  if (normalizedFilter.category !== 'all') {
    pool = pool.filter((event) => event.category === normalizedFilter.category);
  }

  const nowIso = await getCachedNowIso();
  const nowMs = new Date(nowIso).getTime();
  const today = new Date(nowMs);
  today.setHours(0, 0, 0, 0);
  const resolvedAll = await resolveAllHijriEvents(pool, { nowIso });
  const targetTimeBySlug = new Map(
    pool.map((event) => [event.slug, getNextEventDate(event, resolvedAll, nowMs).getTime()]),
  );

  if (normalizedFilter.timeRange !== 'all') {
    pool = pool.filter((event) => {
      const targetTime = targetTimeBySlug.get(event.slug);
      if (!targetTime) return false;
      const diffDays = Math.ceil((targetTime - today.getTime()) / 86_400_000);
      if (normalizedFilter.timeRange === 'week') return diffDays <= 7;
      if (normalizedFilter.timeRange === 'month') return diffDays <= 30;
      if (normalizedFilter.timeRange === '3months') return diffDays <= 90;
      return true;
    });
  }

  if (normalizedFilter.search.trim()) {
    pool = pool
      .map((event) => ({
        event,
        score: scoreHolidaySearchMatch(event, normalizedFilter.search),
      }))
      .filter(({ score }) => score > 0)
      .sort((left, right) => {
        if (right.score !== left.score) return right.score - left.score;
        return compareHolidayEventsByTargetDate(left.event, right.event, targetTimeBySlug);
      })
      .map(({ event }) => event);
  } else {
    pool = pool
      .slice()
      .sort((left, right) => compareHolidayEventsByTargetDate(left, right, targetTimeBySlug));
  }

  const total = pool.length;
  const slice = pool.slice(cursor, cursor + PAGE_SIZE);
  const events = slice.map((event) => annotate(event, resolvedAll, nowMs));

  return {
    events,
    nextCursor: cursor + PAGE_SIZE < total ? cursor + PAGE_SIZE : null,
    total,
  };
}

export async function getInitialEvents(filter = {}) {
  'use cache';

  const normalizedFilter = normalizeHolidayFilter(filter);

  cacheTag('holidays-page');
  cacheTag('events:all');
  if (normalizedFilter.category !== 'all') {
    cacheTag(`events:${normalizedFilter.category}`);
  }
  cacheLife('hours');

  return buildEventsPage(0, normalizedFilter);
}

export async function loadEventsPage(cursor = 0, filter = {}) {
  return buildEventsPage(cursor, normalizeHolidayFilter(filter));
}

/**
 * Facet counts for the filter panel: "how many events would I get if I picked
 * this category / this country, given my other active filters?"
 *
 * Deliberately ignores `timeRange` (no Hijri/target-date resolution needed) so
 * this stays a cheap synchronous pass over already-enriched events — timeRange
 * rarely narrows a facet to zero the way category/country do, so the added
 * accuracy isn't worth the extra async resolution cost on every filter change.
 */
function poolForCountryFacet(countryCode) {
  return countryCode && countryCode !== 'all'
    ? getListableHolidayEvents({ countryCode, includeCountrySeoAliases: true }).map(enrichEvent)
    : ALL_EVENTS.map(enrichEvent);
}

function countMatching(pool, category, searchTerm) {
  let filtered = category && category !== 'all'
    ? pool.filter((event) => event.category === category)
    : pool;
  if (searchTerm) {
    filtered = filtered.filter((event) => scoreHolidaySearchMatch(event, searchTerm) > 0);
  }
  return filtered.length;
}

export async function getFacetCounts(filter = {}) {
  'use cache';

  const normalizedFilter = normalizeHolidayFilter(filter);
  cacheTag('holidays-page');
  cacheTag('events:all');
  cacheLife('hours');

  const searchTerm = normalizedFilter.search.trim();

  const countryFacetPool = poolForCountryFacet(normalizedFilter.countryCode);
  const categoryCounts = { all: countMatching(countryFacetPool, 'all', searchTerm) };
  for (const category of CATEGORIES) {
    categoryCounts[category.id] = countMatching(countryFacetPool, category.id, searchTerm);
  }

  const allEventsPool = ALL_EVENTS.map(enrichEvent);
  const countryCounts = { all: countMatching(allEventsPool, normalizedFilter.category, searchTerm) };
  for (const code of Object.keys(COUNTRY_META)) {
    countryCounts[code] = countMatching(poolForCountryFacet(code), normalizedFilter.category, searchTerm);
  }

  return { categoryCounts, countryCounts };
}
