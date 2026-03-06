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
import { resolveAllHijriEvents } from '@/lib/hijri-resolver';


import { PAGE_SIZE } from './constants';

/* ── Annotate one event with computed runtime data ──────────────────────── */
function annotate(raw, resolvedMap) {
  const ev     = enrichEvent(raw);
  const target = getNextEventDate(ev, resolvedMap);
  const rem    = getTimeRemaining(target);
  const cal    = resolvedMap[ev.slug] || null;
  // resolveEventMeta patches stale years in title/description/keywords
  const meta   = resolveEventMeta(ev, target);
  return {
    slug:           ev.slug,
    name:           ev.name,
    type:           ev.type,
    category:       ev.category || 'islamic',
    seoTitle:       meta.seoTitle,
    description:    meta.description,
    keywords:       meta.keywords,
    _countryCode:   ev._countryCode    || null,
    _targetISO:     target.toISOString(),
    _daysLeft:      rem.days,
    _formatted:     formatGregorianAr(target),
    _calMethod:     cal?.labelShort    || null,
    _calVariance:   cal?.variance      ?? 0,
    _calAccuracy:   cal?.accuracy      || 'high',
    _localSighting: cal?.localSighting || false,
  };
}

/* ── Paginated loader with optional filtering ───────────────────────────── */
export async function loadMoreEvents(cursor = 0, filter = {}) {
  let pool = ALL_EVENTS.map(enrichEvent);

  if (filter.category && filter.category !== 'all')
    pool = pool.filter(e => e.category === filter.category);
  if (filter.countryCode && filter.countryCode !== 'all')
    pool = pool.filter(e => e._countryCode === filter.countryCode);
  if (filter.search?.trim()) {
    const q = filter.search.trim().toLowerCase();
    pool = pool.filter(e =>
      e.name.includes(q) || e.description?.toLowerCase().includes(q)
    );
  }

  const total    = pool.length;
  const slice    = pool.slice(cursor, cursor + PAGE_SIZE);
  const resolved = await resolveAllHijriEvents(slice);
  const events   = slice.map(ev => annotate(ev, resolved));
  return {
    events,
    nextCursor: cursor + PAGE_SIZE < total ? cursor + PAGE_SIZE : null,
    total,
  };
}

export async function getInitialEvents(filter = {}) {
  return loadMoreEvents(0, filter);
}