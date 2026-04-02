'use server';
/**
 * app/holidays/actions.js
 * Server Action for paginated event loading.
 * First PAGE_SIZE events are SSR'd (Googlebot sees them as HTML).
 * Subsequent pages come here via useTransition.
 *
 * dynamicSeoMeta() ensures every event card title/description
 * shows the correct upcoming year — never a stale "2026" in 2027+.
 */
import {
  ALL_EVENTS, enrichEvent,
  getNextEventDate, getTimeRemaining, formatGregorianAr,
  resolveEventMeta,
} from '@/lib/holidays-engine';
import { getCountryByCode } from '@/lib/events/country-dictionary';
import { getListableEvents } from '@/lib/events';
import { resolveAllHijriEvents } from '@/lib/hijri-resolver';
import { getCachedNowIso } from '@/lib/date-utils';
import { getRichContent } from '@/lib/event-content';

import { PAGE_SIZE } from './constants';

/* ── Annotate one event with computed runtime data ──────────────────────── */
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
  const rem = getTimeRemaining(target, nowMs);
  const cal = resolvedMap[routeSlug] || null;
  // resolveEventMeta patches stale years in title/description/keywords
  const meta = resolveEventMeta(ev, target);
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
    _daysLeft: rem.days,
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

/* ── Paginated loader with optional filtering ───────────────────────────── */
export async function loadMoreEvents(cursor = 0, filter = {}) {
  let pool = filter.countryCode && filter.countryCode !== 'all'
    ? getListableEvents({ countryCode: filter.countryCode }).map(enrichEvent)
    : ALL_EVENTS.map(enrichEvent);

  if (filter.category && filter.category !== 'all')
    pool = pool.filter(e => e.category === filter.category);
  if (filter.search?.trim()) {
    pool = pool.filter((event) => matchesSearch(event, filter.search));
  }

  const nowMs = new Date(await getCachedNowIso()).getTime();
  const today = new Date(nowMs);
  today.setHours(0, 0, 0, 0);

  if (filter.timeRange && filter.timeRange !== 'all') {
    const resolvedAll = await resolveAllHijriEvents(pool);
    pool = pool.filter(e => {
      const target = getNextEventDate(e, resolvedAll, nowMs);
      const diffDays = Math.ceil((target.getTime() - today.getTime()) / 86_400_000);
      if (filter.timeRange === 'week') return diffDays <= 7;
      if (filter.timeRange === 'month') return diffDays <= 30;
      if (filter.timeRange === '3months') return diffDays <= 90;
      return true;
    });
  }

  const total = pool.length;
  const slice = pool.slice(cursor, cursor + PAGE_SIZE);
  const resolved = await resolveAllHijriEvents(slice);
  const events = slice.map(ev => annotate(ev, resolved, nowMs));
  return {
    events,
    nextCursor: cursor + PAGE_SIZE < total ? cursor + PAGE_SIZE : null,
    total,
  };
}

export async function getInitialEvents(filter = {}) {
  return loadMoreEvents(0, filter);
}
