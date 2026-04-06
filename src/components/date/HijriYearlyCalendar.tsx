// src/components/date/HijriYearlyCalendar.tsx
// ─────────────────────────────────────────────────────────────────────────────
// COMPLETE REWRITE — pre-computes ALL gregorian crossovers in one pass
//
// DESIGN:
//   • Special months (Ramadan, Eid, Hajj, Sacred) get colored headers
//   • Each day shows: Hijri day (large) + Gregorian day/month (tiny sub-label)
//   • Islamic event days get a 1px solid colored border + shadcn Tooltip
//   • Uses .card CSS class + new.css tokens
// ─────────────────────────────────────────────────────────────────────────────

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

// Special months: accent color + badge
const SPECIAL_MONTHS: Record<number, { badge: string; color: string; softBg: string; border: string }> = {
  1: { badge: 'حرام', color: 'var(--danger)', softBg: 'var(--danger-soft)', border: 'var(--danger-border)' },
  7: { badge: 'حرام', color: 'var(--info)', softBg: 'var(--info-soft)', border: 'var(--info-border)' },
  9: { badge: 'رمضان', color: 'var(--warning)', softBg: 'var(--warning-soft)', border: 'var(--warning-border)' },
  10: { badge: 'عيد', color: 'var(--success)', softBg: 'var(--success-soft)', border: 'var(--success-border)' },
  11: { badge: 'حرام', color: 'var(--accent-alt)', softBg: 'var(--accent-soft)', border: 'var(--border-accent)' },
  12: { badge: 'الحج', color: 'var(--success)', softBg: 'var(--success-soft)', border: 'var(--success-border)' },
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

async function getHijriCalendarDayLookup(year: number) {
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

  // ── RENDER ────────────────────────────────────────────────────────────────
  return (
    <TooltipProvider>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3" style={{ gap: '20px' }}>
        {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => {
          const days = getHijriMonthDays(year, month);
          const firstDay = getHijriFirstWeekday(year, month);
          const monthStr = String(month).padStart(2, '0');
          const special = SPECIAL_MONTHS[month];
          const headerBg = special
            ? `linear-gradient(135deg, ${special.color}22, ${special.color}10)`
            : 'var(--bg-surface-2)';

          return (
            <div
              key={month}
              className="card"
              style={{
                padding: 0,
                overflow: 'hidden',
                border: special
                  ? `1px solid ${special.border}`
                  : '1px solid var(--border-default)',
              }}
            >
              {/* Month header */}
              <div
                className="flex items-center justify-between px-4 py-3"
                style={{
                  background: headerBg,
                  borderBottom: `1px solid ${special ? special.border : 'var(--border-subtle)'}`,
                }}
              >
                <h3
                  className="text-sm font-bold"
                  style={{ color: special ? special.color : 'var(--text-primary)', margin: 0 }}
                >
                  {HIJRI_MONTHS[month - 1]}
                </h3>
                {special && (
                  <span
                    className="text-2xs font-bold rounded-full"
                    style={{
                      background: special.softBg,
                      color: special.color,
                      padding: '2px 8px',
                    }}
                  >
                    {special.badge}
                  </span>
                )}
              </div>

              {/* Weekday headers */}
              <div
                className="grid"
                style={{
                  gridTemplateColumns: 'repeat(7, 1fr)',
                  borderBottom: '1px solid var(--border-subtle)',
                }}
              >
                {WEEKDAYS_AR.map((d, i) => (
                  <div
                    key={d}
                    className="text-center text-2xs font-bold py-2"
                    style={{ color: i === 5 ? 'var(--success)' : 'var(--text-muted)' }}
                  >
                    {d}
                  </div>
                ))}
              </div>

              {/* Day grid */}
              <div
                className="grid p-2"
                style={{ gridTemplateColumns: 'repeat(7, 1fr)', gap: '3px' }}
              >
                {Array.from({ length: firstDay }).map((_, i) => (
                  <div key={`b-${i}`} style={{ minHeight: '34px' }} />
                ))}

                {Array.from({ length: days }, (_, i) => i + 1).map((day) => {
                  const isoH = `${year}-${monthStr}-${String(day).padStart(2, '0')}`;
                  const data = dayLookup[isoH];

                  const eventBorderColor = special?.color ?? 'var(--success)';
                  const eventSoftBg = special?.softBg ?? 'var(--success-soft)';

                  const linkNode = (
                    <Link
                      key={day}
                      href={`/date/hijri/${year}/${monthStr}/${String(day).padStart(2, '0')}`}
                      className="relative flex flex-col items-center justify-center rounded-md transition-colors"
                      style={{
                        minHeight: '40px',
                        background: data?.hasEvent ? eventSoftBg : 'transparent',
                        border: data?.hasEvent
                          ? `1px solid ${eventBorderColor}`
                          : '1px solid transparent',
                      }}
                    >
                      {/* Hijri day */}
                      <span
                        className="text-sm font-bold leading-none tabular-nums"
                        style={{
                          color: data?.hasEvent
                            ? (special?.color ?? 'var(--success)')
                            : 'var(--text-primary)',
                        }}
                      >
                        {day}
                      </span>

                      {/* Gregorian crossover sub-label */}
                      {data && (
                        <span
                          className="text-2xs leading-none tabular-nums"
                          style={{ color: 'var(--text-muted)', marginTop: '1px' }}
                        >
                          {data.gregDay}/{data.gregMonth}
                        </span>
                      )}
                    </Link>
                  );

                  // Wrap event days with a Tooltip, plain Link otherwise
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
