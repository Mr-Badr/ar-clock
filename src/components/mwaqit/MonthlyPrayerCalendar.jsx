import { CalendarDays, Moon, Star, Sun, Sunrise, Sunset } from 'lucide-react';
import { calculatePrayerTimes } from '@/lib/prayerEngine';
import {
  formatGregorianLabel,
  getDaysInCurrentMonth,
  getHijriMonthSpan,
  getHijriParts,
} from '@/lib/hijri-utils';
import MonthlyPrayerCalendarDownload from './MonthlyPrayerCalendarDownload.client';
import styles from './MonthlyPrayerCalendar.module.css';

const PRAYER_KEYS = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'];

const PRAYER_META = {
  fajr: { ar: 'الفجر', Icon: Moon },
  sunrise: { ar: 'الشروق', Icon: Sunrise },
  dhuhr: { ar: 'الظهر', Icon: Sun },
  asr: { ar: 'العصر', Icon: Sun },
  maghrib: { ar: 'المغرب', Icon: Sunset },
  isha: { ar: 'العشاء', Icon: Star },
};

function isFiniteCoordinate(value) {
  return typeof value === 'number' && Number.isFinite(value);
}

function getTimeFormatter(timezone) {
  return new Intl.DateTimeFormat('en', {
    timeZone: timezone,
    hour: 'numeric',
    minute: '2-digit',
    hour12: false,
  });
}

function formatPrayerTime(isoString, formatter) {
  if (!isoString) {
    return '--:--';
  }

  try {
    return formatter.format(new Date(isoString));
  } catch {
    return '--:--';
  }
}

function buildMonthlySchedule({ lat, lon, timezone, countryCode }) {
  if (!isFiniteCoordinate(lat) || !isFiniteCoordinate(lon) || typeof timezone !== 'string') {
    return [];
  }

  const days = getDaysInCurrentMonth();
  const timeFormatter = getTimeFormatter(timezone);
  const dayFormatter = new Intl.DateTimeFormat('ar-EG', { weekday: 'long' });

  return days
    .map((date, index) => {
      const midDay = new Date(date);
      midDay.setHours(12, 0, 0, 0);

      const times = calculatePrayerTimes({
        lat,
        lon,
        timezone,
        date: midDay,
        countryCode,
        cacheKey: null,
      });

      if (!times) {
        return null;
      }

      const hijri = getHijriParts(date);
      const previousHijri = index > 0 ? getHijriParts(days[index - 1]) : null;

      return {
        dayNumber: date.getDate(),
        dayName: dayFormatter.format(date),
        isFriday: date.getDay() === 5,
        hijriDay: hijri.hijriDay,
        hijriYear: hijri.hijriYear,
        hijriMonthName: hijri.hijriMonthName,
        isNewHijriMonth: !previousHijri || hijri.hijriMonthNum !== previousHijri.hijriMonthNum,
        fajr: formatPrayerTime(times.fajr, timeFormatter),
        sunrise: formatPrayerTime(times.sunrise, timeFormatter),
        dhuhr: formatPrayerTime(times.dhuhr, timeFormatter),
        asr: formatPrayerTime(times.asr, timeFormatter),
        maghrib: formatPrayerTime(times.maghrib, timeFormatter),
        isha: formatPrayerTime(times.isha, timeFormatter),
      };
    })
    .filter(Boolean);
}

function buildRowClassName(row, currentDay) {
  if (row.dayNumber === currentDay) {
    return `${styles.row} ${styles.todayRow}`;
  }

  if (row.isFriday) {
    return `${styles.row} ${styles.fridayRow}`;
  }

  return styles.row;
}

export default function MonthlyPrayerCalendar({
  lat,
  lon,
  timezone,
  cityNameAr,
  countryCode,
}) {
  const now = new Date();
  const currentDay = now.getDate();
  const days = getDaysInCurrentMonth();
  const gregorianLabel = formatGregorianLabel(now);
  const hijriLabel = getHijriMonthSpan(days);
  const schedule = buildMonthlySchedule({
    lat,
    lon,
    timezone,
    countryCode,
  });

  if (schedule.length === 0) {
    return (
      <div className={styles.emptyState}>
        تعذر إنشاء جدول الشهر لهذه المدينة الآن. جدول اليوم في أعلى الصفحة ما زال متاحاً، ويمكنك إعادة المحاولة لاحقاً.
      </div>
    );
  }

  return (
    <div className={styles.calendarCard}>
      <div className={styles.calendarHeader}>
        <div className={styles.headerInfo}>
          <h2 className={styles.title}>
            <CalendarDays size={18} className={styles.titleIcon} aria-hidden="true" />
            تقويم مواقيت الصلاة —
            <span className={styles.cityName}>{cityNameAr}</span>
          </h2>
          <p className={styles.subtitle}>
            جدول أوقات الصلاة الشهري · الفجر · الشروق · الظهر · العصر · المغرب · العشاء
          </p>
          <div className={styles.badges}>
            <span className={`${styles.badge} ${styles.badgePrimary}`} aria-label={`الشهر الميلادي: ${gregorianLabel}`}>
              <CalendarDays size={10} aria-hidden="true" />
              {gregorianLabel}
            </span>
            {hijriLabel ? (
              <span className={styles.badge} aria-label={`التقويم الهجري: ${hijriLabel}`}>
                <Moon size={10} aria-hidden="true" />
                {hijriLabel}
              </span>
            ) : null}
          </div>
        </div>

        <div className={styles.actions}>
          <MonthlyPrayerCalendarDownload
            schedule={schedule}
            cityNameAr={cityNameAr}
            gregorianLabel={gregorianLabel}
            hijriLabel={hijriLabel}
            countryCode={countryCode}
          />
        </div>
      </div>

      <div className={styles.scrollOuter}>
        <div className={styles.scroll} role="region" aria-label="جدول مواقيت الصلاة الشهري" tabIndex={0}>
          <table className={styles.table} dir="rtl" aria-label={`تقويم مواقيت الصلاة ${gregorianLabel} — ${cityNameAr}`}>
            <colgroup>
              <col className={styles.colDay} />
              <col className={styles.colHijri} />
              <col className={styles.colGreg} />
              {PRAYER_KEYS.map((key) => (
                <col key={key} className={styles.colPrayer} />
              ))}
            </colgroup>
            <thead className={styles.thead}>
              <tr>
                <th className={styles.th} scope="col">اليوم</th>
                <th className={styles.th} scope="col">الهجري</th>
                <th className={styles.th} scope="col">الميلادي</th>
                {PRAYER_KEYS.map((key) => {
                  const { ar, Icon } = PRAYER_META[key];
                  return (
                    <th key={key} className={styles.th} scope="col" aria-label={ar}>
                      <div className={styles.prayerHeader}>
                        <Icon size={12} className={styles.prayerIcon} aria-hidden="true" />
                        <span className={styles.prayerLabel}>{ar}</span>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {schedule.map((row) => {
                const isToday = row.dayNumber === currentDay;
                return (
                  <tr
                    key={row.dayNumber}
                    className={buildRowClassName(row, currentDay)}
                    aria-current={isToday ? 'date' : undefined}
                    data-day={row.dayNumber}
                  >
                    <td className={`${styles.td} ${styles.dayCell}`}>
                      <div className={styles.dayInner}>
                        {isToday ? <span className={styles.todayDot} aria-label="اليوم" /> : null}
                        {row.dayName}
                      </div>
                    </td>
                    <td className={`${styles.td} ${styles.hijriCell}`}>
                      <span className={styles.hijriDay}>{row.hijriDay}</span>
                      {row.isNewHijriMonth ? (
                        <span className={styles.hijriPill} aria-label={`بداية شهر ${row.hijriMonthName}`}>
                          {row.hijriMonthName}
                        </span>
                      ) : null}
                    </td>
                    <td className={`${styles.td} ${styles.gregCell}`} dir="ltr">
                      {row.dayNumber}
                    </td>
                    {PRAYER_KEYS.map((key) => (
                      <td key={key} className={`${styles.td} ${styles.timeCell}`} dir="ltr">
                        {row[key]}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className={styles.legend} aria-hidden="true">
        <div className={styles.legendItem}>
          <div className={`${styles.legendSwatch} ${styles.todaySwatch}`} />
          <span>اليوم الحالي</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendSwatch} ${styles.fridaySwatch}`} />
          <span>يوم الجمعة</span>
        </div>
      </div>
    </div>
  );
}
