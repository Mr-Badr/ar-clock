/**
 * lib/hijri-resolver.js
 * Network-free Hijri holiday resolver.
 *
 * Why this matters:
 * - holiday pages must not depend on a live external calendar API during SSR
 * - local conversion removes request stalls that can leave browsers with only
 *   the streamed layout shell
 * - build/start output becomes deterministic and much closer to Next.js 16 best
 *   practices for cacheable server rendering
 */

import { cacheTag, cacheLife } from 'next/cache';
import { getCountryCalendarConfig } from './calendar-config.js';
import { convertDate } from './date-adapter.ts';
import { HIJRI_MONTHS_AR } from './holidays-engine.js';
import { logError } from '@/lib/observability';

function getCalendarMethodForCountry(countryCode) {
  const normalizedCode = String(countryCode || '').trim().toUpperCase();
  if (['SA', 'AE', 'KW', 'QA', 'BH', 'OM'].includes(normalizedCode)) return 'umalqura';
  if (['TR'].includes(normalizedCode)) return 'astronomical';
  return 'umalqura';
}

function startOfUtcDay(dateLike) {
  const date = dateLike instanceof Date ? new Date(dateLike) : new Date(dateLike);
  date.setUTCHours(0, 0, 0, 0);
  return date;
}

async function todayHijriYear(nowIso) {
  'use cache';
  cacheTag('hijri-today');
  cacheLife('hours');

  try {
    return convertDate({
      date: String(nowIso).slice(0, 10),
      toCalendar: 'hijri',
      method: 'umalqura',
    }).year;
  } catch {
    const now = new Date(nowIso);
    return Math.floor((now.getTime() - new Date('0622-07-19').getTime()) / (354.37 * 86_400_000));
  }
}

function roughFallback(hMonth, hDay) {
  const now = new Date();
  const EP = new Date('0622-07-19').getTime();
  const MSY = 354.37 * 86_400_000;
  let yr = Math.floor((now.getTime() - EP) / MSY);
  let t = new Date(EP + yr * MSY + (hMonth - 1) * 29.53 * 86_400_000 + (hDay - 1) * 86_400_000);

  // Ensure it is in the future
  while (t <= now) {
    yr++;
    t = new Date(EP + yr * MSY + (hMonth - 1) * 29.53 * 86_400_000 + (hDay - 1) * 86_400_000);
  }
  return t;
}

/**
 * resolveAllHijriEvents(events)
 * Returns plain object: { [slug]: { isoString, label, labelShort, variance, localSighting, note, accuracy } }
 */
export async function resolveAllHijriEvents(events, options = {}) {
  'use cache';
  cacheTag('hijri-events');
  cacheLife('hours');
  const hijri = events.filter(e => e.type === 'hijri');
  if (!hijri.length) return {};

  const nowIso = options.nowIso || new Date().toISOString();
  const baseYear = await todayHijriYear(nowIso);
  const now = startOfUtcDay(nowIso);

  const out = {};
  for (const ev of hijri) {
    const cfg = getCountryCalendarConfig(ev._countryCode);
    const method = getCalendarMethodForCountry(ev._countryCode);
    let resolved = null;

    // Check baseYear, +1, +2 in order. Must be >= today.
    for (let o = 0; o <= 2; o++) {
      const year = baseYear + o;
      try {
        const converted = convertDate({
          date: `${year}-${String(ev.hijriMonth).padStart(2, '0')}-${String(ev.hijriDay).padStart(2, '0')}`,
          toCalendar: 'gregorian',
          method,
        });
        const iso = converted.formatted.iso;
        const d = startOfUtcDay(`${iso}T00:00:00Z`);
        if (d >= now) {
          resolved = { 
            isoString: iso, 
            ...cfg,
            hijriYear: year,
            hijriMonth: ev.hijriMonth,
            hijriDay: ev.hijriDay,
            hijriLabel: `${ev.hijriDay} ${HIJRI_MONTHS_AR[ev.hijriMonth] || ''} ${year} هـ`
          };
          break;
        }
      } catch (err) {
        logError('hijri-resolver-convert-failed', {
          slug: ev.slug,
          method,
          year,
          hijriMonth: ev.hijriMonth,
          hijriDay: ev.hijriDay,
          message: err?.message || String(err),
        });
      }
    }

    // Last resort fallback
    if (!resolved) {
      const fb = roughFallback(ev.hijriMonth, ev.hijriDay);
      const year = baseYear + 1; // Approx
      resolved = { 
        isoString: fb.toISOString().split('T')[0], 
        ...cfg, 
        accuracy: 'low', 
        note: 'تعذّر تثبيت التاريخ بدقة كافية من التحويل المحلي — التاريخ تقديري.',
        hijriYear: year,
        hijriMonth: ev.hijriMonth,
        hijriDay: ev.hijriDay,
        hijriLabel: `${ev.hijriDay} ${HIJRI_MONTHS_AR[ev.hijriMonth] || ''} ${year} هـ`
      };
    }
    out[ev.slug] = resolved;
  }
  return out;
}
