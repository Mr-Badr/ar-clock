import {
  formatGregorianAr,
  getEventState,
  getNextEventDate,
  getTimeRemaining,
  resolveEventMeta,
} from '@/lib/holidays-engine';
import { resolveAllHijriEvents } from '@/lib/hijri-resolver';
import { getCachedNowIso } from '@/lib/date-utils';
import { getHolidayRuntimeRecord } from '@/lib/holidays/repository';

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
  const runtimeRecord = getHolidayRuntimeRecord(slug);
  if (!runtimeRecord?.core) return null;

  const baseEvent = {
    ...runtimeRecord.core,
    __requestedSlug: runtimeRecord.requestedSlug,
    __canonicalSlug: runtimeRecord.canonicalSlug,
    __isAlias: runtimeRecord.isAlias,
    __aliasCountryCode: runtimeRecord.countryCode,
  };

  const requestedSlug = runtimeRecord.requestedSlug || slug;
  const canonicalSlug = runtimeRecord.canonicalSlug || baseEvent.slug;
  const isAlias = Boolean(runtimeRecord.isAlias);
  const aliasCountryCode = runtimeRecord.countryCode || null;
  const redirectTo = null;

  const event = {
    ...baseEvent,
    slug: requestedSlug,
    ...(runtimeRecord.content || {}),
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
  const seo = resolveEventMeta(
    event,
    targetDate,
    event.type === 'hijri' && calInfo?.hijriYear ? calInfo.hijriYear : null,
  );

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
