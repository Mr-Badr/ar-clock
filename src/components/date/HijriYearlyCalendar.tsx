import Link from 'next/link';
import {
  buildHijriYearCalendar,
  type HijriCalendarDay,
  type HijriYearCalendar,
} from '@/lib/date-calendar';
import { logger, serializeError } from '@/lib/logger';
import { DateCalendarUnavailable } from './DateCalendarUnavailable';
import { EventDayLink } from './EventDayLink';

const HIJRI_MONTHS = [
  'محرم', 'صفر', 'ربيع الأول', 'ربيع الثاني',
  'جمادى الأولى', 'جمادى الثانية', 'رجب', 'شعبان',
  'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة',
];

type CalendarTone = 'danger' | 'info' | 'warning' | 'success' | 'accent';

interface SpecialMonth {
  badge: string;
  tone: CalendarTone;
}

const SPECIAL_MONTHS: Record<number, SpecialMonth> = {
  1: { badge: 'حرام', tone: 'danger' },
  7: { badge: 'حرام', tone: 'info' },
  9: { badge: 'رمضان', tone: 'warning' },
  10: { badge: 'عيد', tone: 'success' },
  11: { badge: 'حرام', tone: 'accent' },
  12: { badge: 'الحج', tone: 'success' },
};

const WEEKDAYS_AR = ['أح', 'إث', 'ثل', 'أر', 'خم', 'جم', 'سب'];

function getMonthPanelClass(special: SpecialMonth | undefined): string {
  return ['date-month-panel', special ? `date-month-panel--${special.tone}` : ''].filter(Boolean).join(' ');
}

function getMonthHeaderClass(special: SpecialMonth | undefined): string {
  return [
    'date-month-header',
    special ? `date-month-header--${special.tone}` : 'date-month-header--neutral',
  ].join(' ');
}

function getMonthTitleClass(special: SpecialMonth | undefined): string {
  return ['date-month-title', special ? `date-month-title--${special.tone}` : ''].filter(Boolean).join(' ');
}

function getDayLinkClass(data: HijriCalendarDay, special: SpecialMonth | undefined): string {
  return [
    'date-day-link',
    data.hasEvent ? 'date-day-link--event' : '',
    data.hasEvent && special ? `date-day-link--event-${special.tone}` : '',
  ].filter(Boolean).join(' ');
}

export function HijriYearlyCalendar({ year }: { year: number }) {
  let calendar: HijriYearCalendar;
  try {
    calendar = buildHijriYearCalendar(year);
  } catch (error) {
    logger.error('date-hijri-calendar-section-failed', {
      surface: 'date-calendar',
      calendar: 'hijri',
      year,
      error: serializeError(error),
    });
    return <DateCalendarUnavailable calendarType="hijri" year={year} />;
  }

  return (
    <div className="date-calendar-grid">
      {calendar.months.map((monthData) => {
        const month = monthData.month;
        const monthStr = String(month).padStart(2, '0');
        const special = SPECIAL_MONTHS[month];

        return (
          <div
            key={month}
            className={getMonthPanelClass(special)}
          >
            <div className={getMonthHeaderClass(special)}>
              <h3 className={getMonthTitleClass(special)}>
                {HIJRI_MONTHS[month - 1]}
              </h3>
              {special && (
                <span className={`date-month-badge date-month-badge--${special.tone}`}>
                  {special.badge}
                </span>
              )}
            </div>

            <div className="date-weekday-row">
              {WEEKDAYS_AR.map((d, i) => (
                <div
                  key={d}
                  className={i === 5 ? 'date-weekday date-weekday--friday' : 'date-weekday'}
                >
                  {d}
                </div>
              ))}
            </div>

            <div className="date-day-grid">
              {Array.from({ length: monthData.firstWeekday }).map((_, i) => (
                <div key={`b-${i}`} className="date-day-spacer" />
              ))}

              {monthData.days.map((data) => {
                const day = data.day;
                const className = getDayLinkClass(data, special);
                const href = `/date/hijri/${year}/${monthStr}/${String(day).padStart(2, '0')}`;
                const gregorianLabel = `${data.gregorianDay}/${data.gregorianMonth}`;

                if (data.hasEvent) {
                  return (
                    <EventDayLink
                      key={day}
                      href={href}
                      eventName={data.eventName}
                      hijriLabel={gregorianLabel}
                      day={day}
                      className={className}
                    />
                  );
                }

                return (
                  <Link
                    key={day}
                    href={href}
                    className={className}
                    title={`${data.gregorianDay}/${data.gregorianMonth}/${data.gregorianYear}`}
                  >
                    <span className="date-day-main">
                      {day}
                    </span>
                    <span className="date-day-sub">
                      {gregorianLabel}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
