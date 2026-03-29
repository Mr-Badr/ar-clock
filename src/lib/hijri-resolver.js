/**
 * lib/hijri-resolver.js
 * AlAdhan-backed hijri date resolver with per-country calendar method.
 * Parallel fetching, Next.js Data Cache (24h), auto-rollover, graceful fallback.
 */

import { getCountryCalendarConfig } from './calendar-config.js';
import { cacheTag, cacheLife } from 'next/cache';
import { HIJRI_MONTHS_AR } from './holidays-engine.js';

const ALADHAN = 'https://api.aladhan.com/v1';
const _cache = new Map(); // `${method}-${year}-${month}` → Map<day,iso> | null
const _pendingRequests = new Map(); // For request deduplication

function getSafeNow() { return new Date(); }
function getSafeNowMs() { return Date.now(); }

async function fetchMonth(year, month, method = 1) {
  const key = `${method}-${year}-${month}`;
  if (_cache.has(key)) return _cache.get(key);

  // Request deduplication: if there's already a pending request for this key, wait for it
  if (_pendingRequests.has(key)) {
    return _pendingRequests.get(key);
  }

  const url = `${ALADHAN}/hToGCalendar/${month}/${year}?calendarMethod=${method}`;
  let retries = 0;
  const maxRetries = 3;

  // Create a promise for this request and add it to pending requests
  const requestPromise = (async () => {
    while (retries < maxRetries) {
      try {
        const r = await fetch(url, {
          next: { revalidate: 86_400, tags: ['hijri', `hijri-${year}-${month}`] },
        });

        if (r.status === 429) {
          retries++;
          console.warn(`[hijri-resolver] 429 (retry ${retries}/3) for ${key}`);
          await new Promise((res) => setTimeout(res, 1000 * retries + Math.random() * 500));
          continue;
        }

        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const j = await r.json();
        if (j.code !== 200 || !Array.isArray(j.data)) throw new Error('bad shape');

        const map = new Map();
        for (const e of j.data) {
          const d = parseInt(e.hijri?.day, 10);
          const p = e.gregorian?.date?.split('-');
          if (!d || !p) continue;
          map.set(d, `${p[2]}-${p[1].padStart(2, '0')}-${p[0].padStart(2, '0')}`);
        }
        _cache.set(key, map);
        return map;
      } catch (err) {
        if (retries >= maxRetries - 1) {
          console.warn('[hijri-resolver] Fatal:', key, err.message);
          _cache.set(key, null);
          return null;
        }
        retries++;
        await new Promise((res) => setTimeout(res, 500));
      }
    }
    return null;
  })();

  // Store the promise in pending requests
  _pendingRequests.set(key, requestPromise);

  try {
    // Wait for the request to complete
    const result = await requestPromise;
    return result;
  } finally {
    // Remove from pending requests when done
    _pendingRequests.delete(key);
  }
}

let _yr = 0, _yrAt = 0;
async function todayHijriYear() {
  'use cache';
  cacheTag('hijri-today');
  cacheLife('hours');
  if (_yr && getSafeNowMs() - _yrAt < 86_400_000) return _yr;

  const d = getSafeNow();
  // 1. Try API
  const str = `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`;
  try {
    const r = await fetch(`${ALADHAN}/gToH?date=${str}`, { next: { revalidate: 86_400, tags: ['hijri-today'] } });
    const j = await r.json();
    const y = parseInt(j?.data?.hijri?.year, 10);
    if (y) { _yr = y; _yrAt = getSafeNowMs(); return y; }
  } catch { }

  // 2. Robust fallback using Intl (available in Node 14+ / modern browsers)
  try {
    const formatter = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', { year: 'numeric' });
    const parts = formatter.formatToParts(d);
    const yPart = parts.find(p => p.type === 'year');
    if (yPart) {
      const y = parseInt(yPart.value, 10);
      _yr = y; _yrAt = getSafeNowMs();
      return y;
    }
  } catch (e) { }

  // 3. Last resort (rough math)
  return Math.floor((d.getTime() - new Date('0622-07-19').getTime()) / (354.37 * 86_400_000));
}

function roughFallback(hMonth, hDay) {
  const now = getSafeNow(), EP = new Date('0622-07-19').getTime(), MSY = 354.37 * 86_400_000;
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
export async function resolveAllHijriEvents(events) {
  'use cache';
  cacheTag('hijri-events');
  cacheLife('hours');
  const hijri = events.filter(e => e.type === 'hijri');
  if (!hijri.length) return {};

  const baseYear = await todayHijriYear();
  const now = getSafeNow(); now.setHours(0, 0, 0, 0);

  // Collect unique (method, year, month) pairs — base, +1, +2
  const needed = new Set();
  for (const ev of hijri) {
    const cfg = getCountryCalendarConfig(ev._countryCode);
    for (let o = 0; o <= 2; o++) needed.add(`${cfg.method}|${baseYear + o}|${ev.hijriMonth}`);
  }
  await Promise.all([...needed].map(k => {
    const [m, y, mo] = k.split('|').map(Number);
    return fetchMonth(y, mo, m);
  }));

  const out = {};
  for (const ev of hijri) {
    const cfg = getCountryCalendarConfig(ev._countryCode);
    let resolved = null;

    // Check baseYear, +1, +2 in order. Must be > now.
    for (let o = 0; o <= 2; o++) {
      const year = baseYear + o;
      const map = _cache.get(`${cfg.method}-${year}-${ev.hijriMonth}`);
      const iso = map?.get(ev.hijriDay);
      if (iso) {
        const d = new Date(iso); d.setHours(0, 0, 0, 0);
        if (d > now) {
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
        note: 'تعذّر الاتصال بـ API — التاريخ تقديري.',
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