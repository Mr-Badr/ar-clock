/**
 * lib/hijri-resolver.js
 * AlAdhan-backed hijri date resolver with per-country calendar method.
 * Parallel fetching, Next.js Data Cache (24h), auto-rollover, graceful fallback.
 */

import { getCountryCalendarConfig } from './calendar-config.js';
import { cacheTag, cacheLife } from 'next/cache';

const ALADHAN = 'https://api.aladhan.com/v1';
const _cache  = new Map(); // `${method}-${year}-${month}` → Map<day,iso> | null

function getSafeNow() { return new Date(); }
function getSafeNowMs() { return Date.now(); }

async function fetchMonth(year, month, method = 1) {
  const key = `${method}-${year}-${month}`;
  if (_cache.has(key)) return _cache.get(key);
  try {
    const r = await fetch(`${ALADHAN}/hToGCalendar/${month}/${year}?calendarMethod=${method}`, {
      next: { revalidate: 86_400, tags: ['hijri', `hijri-${year}-${month}`] },
    });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const j = await r.json();
    if (j.code !== 200 || !Array.isArray(j.data)) throw new Error('bad shape');
    const map = new Map();
    for (const e of j.data) {
      const d = parseInt(e.hijri?.day, 10);
      const p = e.gregorian?.date?.split('-');
      if (!d || !p) continue;
      map.set(d, `${p[2]}-${p[1].padStart(2,'0')}-${p[0].padStart(2,'0')}`);
    }
    _cache.set(key, map);
    return map;
  } catch (err) {
    console.warn('[hijri-resolver]', key, err.message);
    _cache.set(key, null);
    return null;
  }
}

let _yr = 0, _yrAt = 0;
async function todayHijriYear() {
  'use cache';
  cacheTag('hijri-today');
  cacheLife('hours');
  if (_yr && getSafeNowMs() - _yrAt < 86_400_000) return _yr;
  const d   = getSafeNow();
  const str = `${String(d.getDate()).padStart(2,'0')}-${String(d.getMonth()+1).padStart(2,'0')}-${d.getFullYear()}`;
  try {
    const r = await fetch(`${ALADHAN}/gToH?date=${str}`, { next: { revalidate: 86_400, tags: ['hijri-today'] } });
    const j = await r.json();
    const y = parseInt(j?.data?.hijri?.year, 10);
    if (y) { _yr = y; _yrAt = getSafeNowMs(); return y; }
  } catch {}
  return Math.floor((d.getTime() - new Date('0622-07-19').getTime()) / (354.37 * 86_400_000));
}

function roughFallback(hMonth, hDay) {
  const now = getSafeNow(), EP = new Date('0622-07-19').getTime(), MSY = 354.37 * 86_400_000;
  const yr  = Math.floor((now.getTime() - EP) / MSY);
  const t   = new Date(EP + yr * MSY + (hMonth - 1) * 29.53 * 86_400_000 + (hDay - 1) * 86_400_000);
  return t <= now ? new Date(t.getTime() + MSY) : t;
}

/**
 * resolveAllHijriEvents(events)
 * Returns plain object: { [slug]: { isoString, label, labelShort, variance, localSighting, note, accuracy } }
 */
export async function resolveAllHijriEvents(events) {
  'use cache';
  cacheTag('hijri-events');
  cacheLife('hours');
  const hijri = events.filter(e => e.type === 'hijri');
  if (!hijri.length) return {};

  const baseYear = await todayHijriYear();
  const now      = getSafeNow(); now.setHours(0, 0, 0, 0);

  // Collect unique (method, year, month) pairs — year and year+1
  const needed = new Set();
  for (const ev of hijri) {
    const cfg = getCountryCalendarConfig(ev._countryCode);
    for (let o = 0; o <= 1; o++) needed.add(`${cfg.method}|${baseYear + o}|${ev.hijriMonth}`);
  }
  await Promise.all([...needed].map(k => {
    const [m, y, mo] = k.split('|').map(Number);
    return fetchMonth(y, mo, m);
  }));

  const out = {};
  for (const ev of hijri) {
    const cfg = getCountryCalendarConfig(ev._countryCode);
    let resolved = null;
    for (let o = 0; o <= 2 && !resolved; o++) {
      const map = _cache.get(`${cfg.method}-${baseYear + o}-${ev.hijriMonth}`);
      if (!map) continue;
      const iso = map.get(ev.hijriDay);
      if (!iso) continue;
      const d = new Date(iso); d.setHours(0, 0, 0, 0);
      if (d > now) resolved = { isoString: iso, ...cfg };
    }
    if (!resolved) {
      const map2 = await fetchMonth(baseYear + 2, ev.hijriMonth, cfg.method);
      const iso  = map2?.get(ev.hijriDay);
      if (iso) resolved = { isoString: iso, ...cfg };
    }
    if (!resolved) {
      const fb = roughFallback(ev.hijriMonth, ev.hijriDay);
      resolved = { isoString: fb.toISOString().split('T')[0], ...cfg, accuracy: 'low', note: 'تعذّر الاتصال بـ API — التاريخ تقديري.' };
    }
    out[ev.slug] = resolved;
  }
  return out;
}