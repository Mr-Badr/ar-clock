// src/components/date/YearlyCalendar.tsx
import Link from 'next/link';
import { cacheLife, cacheTag } from 'next/cache';
import { convertDate } from '@/lib/date-adapter';
import { getIslamicEventsForHijriDate } from '@/lib/islamic-holidays';
import { EventDayLink } from './EventDayLink';

const MONTHS_AR = [
  'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر',
];
const WEEKDAYS_AR = ['أح', 'إث', 'ثل', 'أر', 'خم', 'جم', 'سب'];

function getDaysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
}

interface DayData {
  hijriDay: number;
  hijriMonth: number;
  hijriYear: number;
  hasEvent: boolean;
  isRamadan: boolean;
  eventName?: string;
}

interface Props {
  year: number;
  serverTodayIso?: string;
}

function getGregorianDayLinkClass(data: DayData | undefined, isToday: boolean, isFriday: boolean): string {
  return [
    'date-day-link',
    isToday ? 'date-day-link--today' : '',
    !isToday && data?.hasEvent ? 'date-day-link--event' : '',
    !isToday && !data?.hasEvent && data?.isRamadan ? 'date-day-link--ramadan' : '',
    !isToday && isFriday ? 'date-day-link--friday' : '',
  ].filter(Boolean).join(' ');
}

async function getGregorianCalendarDayLookup(year: number): Promise<Record<string, DayData>> {
  'use cache';
  cacheTag('date-calendar-gregorian', `date-calendar-gregorian-${year}`);
  cacheLife('days');

  const dayLookup: Record<string, DayData> = {};

  for (let month = 1; month <= 12; month++) {
    const days = getDaysInMonth(year, month);
    for (let day = 1; day <= days; day++) {
      const iso = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      try {
        const h = convertDate({ date: iso, toCalendar: 'hijri', method: 'umalqura' });
        const events = getIslamicEventsForHijriDate(h.year, h.month, h.day);
        dayLookup[iso] = {
          hijriDay: h.day,
          hijriMonth: h.month,
          hijriYear: h.year,
          hasEvent: events.length > 0,
          isRamadan: h.month === 9,
          eventName: events[0]?.nameAr,
        };
      } catch {
        // Keep unsupported dates empty.
      }
    }
  }

  return dayLookup;
}

export async function YearlyCalendar({ year, serverTodayIso }: Props) {
  const todayIso = serverTodayIso ?? '';
  const dayLookup = await getGregorianCalendarDayLookup(year);

  return (
    <div className="date-calendar-grid">
      {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => {
        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month);
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
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`blank-${i}`} className="date-day-spacer" />
              ))}

              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                const iso = `${year}-${monthStr}-${String(day).padStart(2, '0')}`;
                const data = dayLookup[iso];
                const isToday = iso === todayIso;
                const dayOfWeek = new Date(Date.UTC(year, month - 1, day)).getUTCDay();
                const isFriday = dayOfWeek === 5;
                const href = `/date/${year}/${monthStr}/${String(day).padStart(2, '0')}`;
                const hijriLabel = data ? String(data.hijriDay) : undefined;
                const className = getGregorianDayLinkClass(data, isToday, isFriday);

                if (data?.hasEvent && !isToday) {
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
                    title={data ? `${data.hijriDay}/${data.hijriMonth}/${data.hijriYear} هـ` : ''}
                  >
                    <span className="date-day-main">
                      {day}
                    </span>
                    {data && (
                      <span className="date-day-sub">
                        {data.hijriDay}
                      </span>
                    )}
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
