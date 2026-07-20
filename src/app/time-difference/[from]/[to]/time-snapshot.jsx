import 'server-only';

// ─── Timezone helpers ─────────────────────────────────────────────────────────

export function getOffsetMinutes(tz, dateInfo = null) {
  try {
    if (!dateInfo) return 0;
    const now = dateInfo;
    const local = new Date(now.toLocaleString('en-US', { timeZone: tz }));
    const utc = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }));
    return Math.round((local - utc) / 60000);
  } catch { return 0; }
}

function isDSTActive(tz, dateInfo) {
  try {
    if (!dateInfo) return false;
    const now = dateInfo;
    const jan = new Date(now.getFullYear(), 0, 15);
    const jul = new Date(now.getFullYear(), 6, 15);
    const offNow = getOffsetMinutes(tz, now);
    const offJan = Math.round((new Date(jan.toLocaleString('en-US', { timeZone: tz })) - new Date(jan.toLocaleString('en-US', { timeZone: 'UTC' }))) / 60000);
    const offJul = Math.round((new Date(jul.toLocaleString('en-US', { timeZone: tz })) - new Date(jul.toLocaleString('en-US', { timeZone: 'UTC' }))) / 60000);
    if (offJan === offJul) return false;
    return offNow !== Math.min(offJan, offJul);
  } catch { return false; }
}

export function observesDST(tz, dateInfo = null) {
  try {
    if (!dateInfo) return false;
    const now = dateInfo;
    const jan = new Date(now.getFullYear(), 0, 15);
    const jul = new Date(now.getFullYear(), 6, 15);
    const offJan = Math.round((new Date(jan.toLocaleString('en-US', { timeZone: tz })) - new Date(jan.toLocaleString('en-US', { timeZone: 'UTC' }))) / 60000);
    const offJul = Math.round((new Date(jul.toLocaleString('en-US', { timeZone: tz })) - new Date(jul.toLocaleString('en-US', { timeZone: 'UTC' }))) / 60000);
    return offJan !== offJul;
  } catch { return false; }
}

export function formatUTCOffset(minutes) {
  const sign = minutes >= 0 ? '+' : '-';
  const abs = Math.abs(minutes);
  const h = String(Math.floor(abs / 60));
  const m = abs % 60;
  return `UTC${sign}${h}${m > 0 ? ':' + String(m).padStart(2, '0') : ''}`;
}

/**
 * Server-computed clock parts for a timezone, used to seed the live clock's
 * first paint (client ticks from here — no hydration flash, no CLS).
 */
export function getInitialClockParts(tz, dateInfo) {
  try {
    if (!dateInfo) return { h: 0, m: 0, s: 0 };
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: tz, hour: 'numeric', minute: 'numeric', second: 'numeric',
      hour12: false,
    }).formatToParts(dateInfo);
    const g = (t) => {
      const v = parseInt(parts.find(p => p.type === t)?.value ?? '0', 10);
      return t === 'hour' && v === 24 ? 0 : v;
    };
    return { h: g('hour'), m: g('minute'), s: g('second') };
  } catch { return { h: 0, m: 0, s: 0 }; }
}

export function getLocalDateLabel(tz, dateInfo) {
  try {
    if (!dateInfo) return '';
    return dateInfo.toLocaleDateString('ar-EG-u-nu-latn', {
      timeZone: tz, weekday: 'long', day: 'numeric', month: 'long',
    });
  } catch { return ''; }
}
