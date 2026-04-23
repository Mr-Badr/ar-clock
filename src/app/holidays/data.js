import { cacheLife, cacheTag } from 'next/cache';

import {
  ALL_EVENTS,
  enrichEvent,
  getNextEventDate,
  formatGregorianAr,
  resolveEventMeta,
} from '@/lib/holidays-engine';
import { getCountryByCode } from '@/lib/events/country-dictionary';
import { getListableEvents } from '@/lib/events';
import { resolveAllHijriEvents } from '@/lib/hijri-resolver';
import { getCachedNowIso } from '@/lib/date-utils';
import { getRichContent } from '@/lib/event-content';

import { PAGE_SIZE } from './constants';
import { normalizeHolidayFilter } from './holidays-filter-utils';

function annotate(raw, resolvedMap, nowMs) {
  const base = enrichEvent(raw);
  const routeSlug = base.__requestedSlug || base.slug;
  const countryCode = base.__aliasCountryCode || base._countryCode || null;
  const country = getCountryByCode(countryCode);
  const ev = {
    ...base,
    slug: routeSlug,
    ...getRichContent(routeSlug),
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

function matchesSearch(raw, query) {
  if (!query) return true;
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return true;

  const country = getCountryByCode(raw.__aliasCountryCode || raw._countryCode || null);
  const displayName = raw.__isAlias && country?.nameAr
    ? `${raw.name} في ${country.nameAr}`
    : raw.name;

  const haystack = [
    displayName,
    raw.name,
    country?.nameAr,
    raw.description,
    ...(Array.isArray(raw.keywords) ? raw.keywords : []),
  ]
    .map((value) => String(value || '').toLowerCase())
    .join(' ');

  return haystack.includes(normalizedQuery);
}

async function buildEventsPage(cursor = 0, filter = {}) {
  const normalizedFilter = normalizeHolidayFilter(filter);

  let pool = normalizedFilter.countryCode !== 'all'
    ? getListableEvents({ countryCode: normalizedFilter.countryCode }).map(enrichEvent)
    : ALL_EVENTS.map(enrichEvent);

  if (normalizedFilter.category !== 'all') {
    pool = pool.filter((event) => event.category === normalizedFilter.category);
  }

  if (normalizedFilter.search.trim()) {
    pool = pool.filter((event) => matchesSearch(event, normalizedFilter.search));
  }

  const nowMs = new Date(await getCachedNowIso()).getTime();
  const today = new Date(nowMs);
  today.setHours(0, 0, 0, 0);

  if (normalizedFilter.timeRange !== 'all') {
    const resolvedAll = await resolveAllHijriEvents(pool);
    pool = pool.filter((event) => {
      const target = getNextEventDate(event, resolvedAll, nowMs);
      const diffDays = Math.ceil((target.getTime() - today.getTime()) / 86_400_000);
      if (normalizedFilter.timeRange === 'week') return diffDays <= 7;
      if (normalizedFilter.timeRange === 'month') return diffDays <= 30;
      if (normalizedFilter.timeRange === '3months') return diffDays <= 90;
      return true;
    });
  }

  const total = pool.length;
  const slice = pool.slice(cursor, cursor + PAGE_SIZE);
  const resolved = await resolveAllHijriEvents(slice);
  const events = slice.map((event) => annotate(event, resolved, nowMs));

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
