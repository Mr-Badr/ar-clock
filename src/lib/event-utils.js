// src/lib/event-utils.js
import { getEventYear, approxHijriYear, replaceTokens, getNextEventDate, formatGregorianAr } from './holidays-engine.js';

export function buildDynamicCountryDates(ev, resolvedMap, nowMs, countryMeta, getCalConfig) {
  if (ev.type !== 'hijri') {
    // For fixed events, tokens in the date string are enough
    return (ev.countryDates || []).map(cd => ({
      ...cd,
      date: replaceTokens(cd.date || '', getEventYear(new Date(nowMs)), approxHijriYear(getEventYear(new Date(nowMs)))),
    }));
  }

  const suffix = ev.countrySlugSuffix || 'in';
  return Object.entries(countryMeta).map(([code, meta]) => {
    // Look for a country-specific slug (e.g., 'ramadan-in-sa') in resolvedMap
    const lookupSlug = `${ev.slug}-${suffix}-${code}`;
    const specificSlug = resolvedMap[lookupSlug] ? lookupSlug : ev.slug;
    const r = resolvedMap[specificSlug];
    const targetDate = r?.isoString
      ? (() => { const d = new Date(r.isoString); d.setHours(0,0,0,0); return d; })()
      : getNextEventDate({ ...ev, _countryCode: code }, resolvedMap, nowMs);

    const cfg = getCalConfig(code);
    const formatted = formatGregorianAr(targetDate);
    const variance = cfg.variance > 0 ? ` ±${cfg.variance}` : '';
    return {
      code,
      country: meta.name,
      flag:    meta.flag,
      date:    formatted + variance,
      note:    cfg.labelShort,
    };
  });
}
