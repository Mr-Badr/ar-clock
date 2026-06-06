import Link from 'next/link';
import { cacheLife, cacheTag } from 'next/cache';
import { convertDate } from '@/lib/date-adapter';
import { getIslamicEventsForHijriDate } from '@/lib/islamic-holidays';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

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

function getHijriMonthDays(hYear: number, hMonth: number): number {
  try {
    convertDate({
      date: `${hYear}-${String(hMonth).padStart(2, '0')}-30`,
      toCalendar: 'gregorian',
      method: 'umalqura',
    });
    return 30;
  } catch { return 29; }
}

function getHijriFirstWeekday(hYear: number, hMonth: number): number {
  try {
    const g = convertDate({
      date: `${hYear}-${String(hMonth).padStart(2, '0')}-01`,
      toCalendar: 'gregorian',
      method: 'umalqura',
    });
    return new Date(g.formatted.iso).getUTCDay();
  } catch { return 0; }
}

interface HijriDayData {
  gregDay: number;
  gregMonth: number;
  hasEvent: boolean;
  eventName?: string;
}

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

function getDayLinkClass(data: HijriDayData | undefined, special: SpecialMonth | undefined): string {
  return [
    'date-day-link',
    data?.hasEvent ? 'date-day-link--event' : '',
    data?.hasEvent && special ? `date-day-link--event-${special.tone}` : '',
  ].filter(Boolean).join(' ');
}

async function getHijriCalendarDayLookup(year: number): Promise<Record<string, HijriDayData>> {
  'use cache';
  cacheTag('date-calendar-hijri', `date-calendar-hijri-${year}`);
  cacheLife('days');

  const dayLookup: Record<string, HijriDayData> = {};

  for (let month = 1; month <= 12; month++) {
    const days = getHijriMonthDays(year, month);
    for (let day = 1; day <= days; day++) {
      const isoH = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      try {
        const g = convertDate({ date: isoH, toCalendar: 'gregorian', method: 'umalqura' });
        const events = getIslamicEventsForHijriDate(year, month, day);
        dayLookup[isoH] = {
          gregDay: g.day,
          gregMonth: g.month,
          hasEvent: events.length > 0,
          eventName: events[0]?.nameAr,
        };
      } catch {
        // Keep unsupported dates empty.
      }
    }
  }

  return dayLookup;
}

export async function HijriYearlyCalendar({ year }: { year: number }) {
  const dayLookup = await getHijriCalendarDayLookup(year);

  return (
    <TooltipProvider>
      <div className="date-calendar-grid">
        {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => {
          const days = getHijriMonthDays(year, month);
          const firstDay = getHijriFirstWeekday(year, month);
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
                {Array.from({ length: firstDay }).map((_, i) => (
                  <div key={`b-${i}`} className="date-day-spacer" />
                ))}

                {Array.from({ length: days }, (_, i) => i + 1).map((day) => {
                  const isoH = `${year}-${monthStr}-${String(day).padStart(2, '0')}`;
                  const data = dayLookup[isoH];
                  const className = getDayLinkClass(data, special);

                  const linkNode = (
                    <Link
                      key={day}
                      href={`/date/hijri/${year}/${monthStr}/${String(day).padStart(2, '0')}`}
                      className={className}
                    >
                      <span className="date-day-main">
                        {day}
                      </span>
                      {data && (
                        <span className="date-day-sub">
                          {data.gregDay}/{data.gregMonth}
                        </span>
                      )}
                    </Link>
                  );

                  if (data?.hasEvent && data.eventName) {
                    return (
                      <Tooltip key={day}>
                        <TooltipTrigger asChild>
                          {linkNode}
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                          <p>{data.eventName}</p>
                        </TooltipContent>
                      </Tooltip>
                    );
                  }

                  return linkNode;
                })}
              </div>
            </div>
          );
        })}
      </div>
    </TooltipProvider>
  );
}
