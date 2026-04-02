import { resolveAllHijriEvents } from '@/lib/hijri-resolver';
import { COUNTRY_META, getCountryCalendarConfig } from '@/lib/calendar-config';
import {
  COUNTRY_CODES,
  getCountryByCode,
} from '@/lib/events/country-dictionary';
import {
  formatGregorianAr,
  replaceTokens,
} from '@/lib/holidays-engine';
import { getEventMeta } from '@/lib/events';

function formatWeekdayAr(date) {
  try {
    return new Intl.DateTimeFormat('ar-SA-u-nu-latn', { weekday: 'long' }).format(date);
  } catch {
    return '';
  }
}

function resolveAuthorRow(row, tokenContext) {
  if (!row || typeof row !== 'object') return null;
  return {
    ...row,
    country: replaceTokens(row.country || '', tokenContext),
    date: replaceTokens(row.date || '', tokenContext),
    note: replaceTokens(row.note || '', tokenContext),
    method: replaceTokens(row.method || '', tokenContext),
  };
}

function buildBaseNote(eventType, countryCode) {
  const cfg = getCountryCalendarConfig(countryCode);
  if (eventType === 'hijri') {
    return cfg.localSighting
      ? `${cfg.labelShort} — قد يختلف بيوم حسب إعلان الرؤية المحلية`
      : `${cfg.labelShort} — تاريخ تقويمي معتمد`;
  }
  if (eventType === 'estimated') return 'تاريخ تقديري قابل للتحديث حسب الإعلان الرسمي';
  if (eventType === 'monthly') return 'موعد شهري متكرر وفق الجهة المعتمدة';
  return 'موعد موحد على جميع الدول المدعومة';
}

function buildBaseRow(event, countryCode, targetDate) {
  const country = getCountryByCode(countryCode);
  if (!country) return null;
  const weekday = formatWeekdayAr(targetDate);
  const dateLabel = formatGregorianAr(targetDate);
  return {
    country: country.nameAr,
    flag: COUNTRY_META[countryCode]?.flag || '',
    code: countryCode,
    date: `${weekday}، ${dateLabel}`,
    note: buildBaseNote(event.type, countryCode),
    method: getCountryCalendarConfig(countryCode).labelShort,
  };
}

async function buildHijriRow(event, countryCode, resolveHijriEvents) {
  const country = getCountryByCode(countryCode);
  if (!country) return null;

  const eventForCountry = {
    ...event,
    _countryCode: countryCode,
    slug: `${event.__canonicalSlug || event.slug}__${countryCode}`,
  };
  const resolved = await resolveHijriEvents([eventForCountry]);
  const calInfo = resolved[eventForCountry.slug];
  const targetIso = calInfo?.isoString || null;
  if (!targetIso) return null;
  const targetDate = new Date(targetIso);
  const weekday = formatWeekdayAr(targetDate);
  const dateLabel = formatGregorianAr(targetDate);
  const cfg = getCountryCalendarConfig(countryCode);

  return {
    country: country.nameAr,
    flag: COUNTRY_META[countryCode]?.flag || '',
    code: countryCode,
    date: `${weekday}، ${dateLabel}`,
    note: cfg.localSighting
      ? `${cfg.labelShort} — قد يختلف بيوم حسب إعلان الرؤية المحلية`
      : `${cfg.labelShort} — تاريخ تقويمي معتمد`,
    method: cfg.labelShort,
  };
}

export async function buildCountryDateRows({
  event,
  targetDate,
  tokenContext = {},
  resolveHijriEvents = resolveAllHijriEvents,
}) {
  const eventMeta = getEventMeta(event.__canonicalSlug || event.slug);
  const countryScope = eventMeta?.countryScope || 'custom';
  const authoredRows = (Array.isArray(event.countryDates) ? event.countryDates : [])
    .map((row) => resolveAuthorRow(row, tokenContext))
    .filter(Boolean);
  const authoredByCode = new Map(
    authoredRows
      .filter((row) => row.code)
      .map((row) => [row.code, row]),
  );

  if (countryScope !== 'all') {
    if (event.type !== 'hijri') return authoredRows;
    if (authoredRows.length > 0) return authoredRows;
    return [];
  }

  const generatedRows = await Promise.all(
    COUNTRY_CODES.map(async (countryCode) => {
      const computed = event.type === 'hijri'
        ? await buildHijriRow(event, countryCode, resolveHijriEvents)
        : buildBaseRow(event, countryCode, targetDate);
      if (!computed) return null;

      const authored = authoredByCode.get(countryCode);
      return authored
        ? {
            ...computed,
            ...authored,
            country: authored.country || computed.country,
            flag: authored.flag || computed.flag,
            code: authored.code || computed.code,
          }
        : computed;
    }),
  );

  return generatedRows.filter(Boolean);
}
