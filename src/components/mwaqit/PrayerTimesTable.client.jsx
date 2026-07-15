'use client';

/**
 * PrayerTimesTable — the "مواقيت الصلاة اليوم" table.
 *
 * Highlights the next prayer with a live-ticking value (via useLiveNextPrayer)
 * instead of a server-rendered snapshot, so it always agrees with the
 * countdown ring above it — the two were previously computed independently
 * (this one frozen at render time, the ring live), which could show two
 * different prayers as "next" once real time crossed a prayer boundary.
 */

import { memo } from 'react';
import { Clock3, Moon, Sun, Sunrise, Sunset } from 'lucide-react';
import { useLiveNextPrayer } from '@/lib/client/useLiveNextPrayer';
import { formatTime } from '@/lib/prayerEngine';

const PRAYER_KEYS = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'];

const PRAYER_AR = {
  fajr: 'الفجر', sunrise: 'الشروق', dhuhr: 'الظهر',
  asr: 'العصر', maghrib: 'المغرب', isha: 'العشاء',
};

const PRAYER_ICON = {
  fajr: Moon,
  sunrise: Sunrise,
  dhuhr: Sun,
  asr: Sun,
  maghrib: Sunset,
  isha: Moon,
};

function PrayerTimesTable({
  times,
  timezone,
  lat,
  lon,
  countryCode,
  method,
  cacheKey,
  nextPrayerKey: fallbackNextPrayerKey,
  styles,
}) {
  const { nextKey: liveNextPrayerKey } = useLiveNextPrayer({
    lat, lon, timezone, countryCode, method, cacheKey,
    fallbackNextPrayerKey,
  });
  const nextKey = liveNextPrayerKey ?? fallbackNextPrayerKey;

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr className={styles.tableHeadRow}>
            <th className={styles.tableHeader}>الصلاة</th>
            <th className={styles.tableHeader}>الوقت</th>
          </tr>
        </thead>
        <tbody>
          {PRAYER_KEYS.map((key) => {
            const isoStr = times[key];
            if (!isoStr) return null;

            const isNext = key === nextKey;
            const timeStr = formatTime(isoStr, timezone, false);
            const PrayerIcon = PRAYER_ICON[key] ?? Clock3;

            return (
              <tr key={key} className={styles.tableRow}>
                <td className={`${styles.tableCell} ${styles.prayerNameCell}`}>
                  <span className="me-2 inline-flex text-accent-alt" aria-hidden="true">
                    <PrayerIcon size={16} strokeWidth={1.75} />
                  </span>
                  {PRAYER_AR[key] ?? key}
                  {isNext ? <span className={styles.nextBadge}>القادمة</span> : null}
                </td>
                <td className={`${styles.tableCell} ${styles.prayerTimeCell}`}>
                  <time dateTime={isoStr}>{timeStr}</time>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default memo(PrayerTimesTable, (prev, next) =>
  prev.timezone     === next.timezone &&
  prev.nextPrayerKey === next.nextPrayerKey &&
  prev.lat          === next.lat &&
  prev.lon          === next.lon &&
  prev.countryCode  === next.countryCode &&
  prev.method       === next.method &&
  prev.times?.fajr  === next.times?.fajr &&
  prev.times?.isha  === next.times?.isha
);
