import 'server-only';
import { Suspense } from 'react';
import { getCachedNowIso } from '@/lib/date-utils';

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

/** SSR current time – Western numerals via -u-nu-latn */
function getCurrentTime(tz, dateInfo) {
  try {
    if (!dateInfo) return '—';
    return new Intl.DateTimeFormat('ar-SA-u-nu-latn', {
      timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: true,
    }).format(dateInfo);
  } catch { return '—'; }
}

export async function TimeSnapshot({ fromCity, toCity }) {
  const currentDate = new Date(await getCachedNowIso());
  const fromOffMin = getOffsetMinutes(fromCity.timezone, currentDate);
  const toOffMin = getOffsetMinutes(toCity.timezone, currentDate);
  const diffMinutes = toOffMin - fromOffMin;
  const diffHours = diffMinutes / 60;
  const fromDST = isDSTActive(fromCity.timezone, currentDate);
  const toDST = isDSTActive(toCity.timezone, currentDate);
  const fromOffStr = formatUTCOffset(fromOffMin);
  const toOffStr = formatUTCOffset(toOffMin);

  const absDiffH = Math.floor(Math.abs(diffHours));
  const absDiffM = Math.abs(diffMinutes) % 60;

  const fromTime = getCurrentTime(fromCity.timezone, currentDate);
  const toTime = getCurrentTime(toCity.timezone, currentDate);

  return (
    <div className="grid grid-cols-3 items-center gap-2">
      <div className="text-center">
        <p className="text-xs text-muted mb-1">{fromCity.city_name_ar}</p>
        <p className="text-2xl font-extrabold tabular-nums text-clock leading-none" dir="ltr">
          {fromTime}
        </p>
        <p className="text-xs text-muted mt-1 tabular-nums" dir="ltr">{fromOffStr}</p>
        {fromDST && <span className="badge badge-warning mt-2">صيفي</span>}
      </div>

      <div className="text-center border-x border-[var(--border-subtle)] py-1">
        <p className="text-xs text-muted">الفارق</p>
        <p className="text-xl font-black tabular-nums text-accent-alt leading-tight" dir="ltr">
          {diffMinutes === 0
            ? '0'
            : `${diffMinutes > 0 ? '+' : ''}${absDiffH}${absDiffM > 0 ? `:${String(absDiffM).padStart(2, '0')}` : ''}`}
        </p>
        <p className="text-xs text-muted">{diffMinutes === 0 ? 'متطابق' : 'ساعة'}</p>
      </div>

      <div className="text-center">
        <p className="text-xs text-muted mb-1">{toCity.city_name_ar}</p>
        <p className="text-2xl font-extrabold tabular-nums text-clock leading-none" dir="ltr">
          {toTime}
        </p>
        <p className="text-xs text-muted mt-1 tabular-nums" dir="ltr">{toOffStr}</p>
        {toDST && <span className="badge badge-warning mt-2">صيفي</span>}
      </div>
    </div>
  );
}

export function SuspendedTimeSnapshot({ fromCity, toCity }) {
  return (
    <Suspense fallback={<div className="h-24 animate-pulse bg-[var(--bg-surface-2)] rounded-2xl" />}>
      <TimeSnapshot fromCity={fromCity} toCity={toCity} />
    </Suspense>
  );
}
