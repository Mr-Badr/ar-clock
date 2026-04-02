import {
  formatGregorianAr,
  getEventBySlug,
  getEventState,
  getNextEventDate,
  getTimeRemaining,
  resolveEventMeta,
} from '@/lib/holidays-engine';
import { resolveAllHijriEvents } from '@/lib/hijri-resolver';
import { getCachedNowIso } from '@/lib/date-utils';
import { getRichContent } from '@/lib/event-content';

export function buildHolidayTokenContext({ event, seo, remaining, gregStr, hijriStr }) {
  return {
    ...event,
    ...seo,
    daysRemaining: remaining.days,
    eventName: event.name,
    formattedDate: gregStr,
    hijriDate: hijriStr || '',
  };
}

export async function resolveHolidayRuntimeData(slug, options = {}) {
  const baseEvent = getEventBySlug(slug);
  if (!baseEvent) return null;

  const requestedSlug = slug;
  const canonicalSlug = baseEvent.__canonicalSlug || baseEvent.slug;
  const isAlias = Boolean(baseEvent.__isAlias);
  const aliasCountryCode = baseEvent.__aliasCountryCode || null;
  const redirectTo = null;

  const richContent = getRichContent(requestedSlug);
  const event = {
    ...baseEvent,
    slug: requestedSlug,
    ...richContent,
    _countryCode: aliasCountryCode || baseEvent._countryCode || null,
  };

  const nowIso = options.nowIso || await getCachedNowIso();
  const now = new Date(nowIso);
  const nowMs = now.getTime();

  const resolved = await resolveAllHijriEvents([event]);
  const calInfo = resolved[event.slug] || null;
  const targetDate = getNextEventDate(event, resolved, nowMs);
  const remaining = getTimeRemaining(targetDate, nowMs);
  const eventState = getEventState(targetDate, nowMs);
  const seo = resolveEventMeta(event, targetDate);

  const gregStr = formatGregorianAr(targetDate);
  const hijriStr = event.type === 'hijri' && calInfo?.hijriLabel ? calInfo.hijriLabel : null;
  const hijriYearNum = event.type === 'hijri' && calInfo?.hijriYear
    ? calInfo.hijriYear
    : targetDate.getFullYear();

  const tokenContext = buildHolidayTokenContext({
    event,
    seo,
    remaining,
    gregStr,
    hijriStr,
  });

  return {
    requestedSlug,
    canonicalSlug,
    isAlias,
    aliasCountryCode,
    redirectTo,
    event,
    nowIso,
    now,
    nowMs,
    currentYear: now.getFullYear(),
    resolved,
    calInfo,
    targetDate,
    remaining,
    eventState,
    seo,
    gregStr,
    hijriStr,
    hijriYearNum,
    tokenContext,
  };
}
