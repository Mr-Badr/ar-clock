// src/components/date/YearlyCalendar.tsx
import Link from 'next/link';
import {
  buildGregorianYearCalendar,
  type GregorianCalendarDay,
  type GregorianYearCalendar,
} from '@/lib/date-calendar';
import { logger, serializeError } from '@/lib/logger';
import { DateCalendarUnavailable } from './DateCalendarUnavailable';
import { EventDayLink } from './EventDayLink';

const MONTHS_AR = [
  'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر',
];
const WEEKDAYS_AR = ['أح', 'إث', 'ثل', 'أر', 'خم', 'جم', 'سب'];

interface Props {
  year: number;
  serverTodayIso?: string;
}

function getGregorianDayLinkClass(data: GregorianCalendarDay, isToday: boolean, isFriday: boolean): string {
  return [
    'date-day-link',
    isToday ? 'date-day-link--today' : '',
    !isToday && data.hasEvent ? 'date-day-link--event' : '',
    !isToday && !data.hasEvent && data.isRamadan ? 'date-day-link--ramadan' : '',
    !isToday && isFriday ? 'date-day-link--friday' : '',
  ].filter(Boolean).join(' ');
}

export function YearlyCalendar({ year, serverTodayIso }: Props) {
  let calendar: GregorianYearCalendar;
  try {
    calendar = buildGregorianYearCalendar(year);
  } catch (error) {
    logger.error('date-gregorian-calendar-section-failed', {
      surface: 'date-calendar',
      calendar: 'gregorian',
      year,
      error: serializeError(error),
    });
    return <DateCalendarUnavailable calendarType="gregorian" year={year} />;
  }
  const todayIso = serverTodayIso ?? '';

  return (
    <div className="date-calendar-grid">
      {calendar.months.map((monthData) => {
        const month = monthData.month;
        const monthStr = String(month).padStart(2, '0');
        return (
          <div key={month} className="date-month-panel">
            <div className="date-month-header date-month-header--gregorian">
              <h3 className="date-month-title">
                {MONTHS_AR[month - 1]}
              </h3>
              <Link
                href={`/date/${year}/${monthStr}/01`}
                className="date-month-link"
              >
                {month}/{year}
              </Link>
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
                <div key={`blank-${i}`} className="date-day-spacer" />
              ))}

              {monthData.days.map((data) => {
                const day = data.day;
                const isToday = data.isoDate === todayIso;
                const dayOfWeek = new Date(Date.UTC(year, month - 1, day)).getUTCDay();
                const isFriday = dayOfWeek === 5;
                const href = `/date/${year}/${monthStr}/${String(day).padStart(2, '0')}`;
                const hijriLabel = String(data.hijriDay);
                const className = getGregorianDayLinkClass(data, isToday, isFriday);

                if (data.hasEvent && !isToday) {
                  return (
                    <EventDayLink
                      key={day}
                      href={href}
                      eventName={data.eventName}
                      hijriLabel={hijriLabel}
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
                    title={`${data.hijriDay}/${data.hijriMonth}/${data.hijriYear} هـ`}
                  >
                    <span className="date-day-main">
                      {day}
                    </span>
                    <span className="date-day-sub">
                      {data.hijriDay}
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
