import {
  convertGregorianDayForCalendar,
  convertHijriDayForCalendar,
  getHijriMonthDays,
} from '@/lib/date-adapter';
import { getIslamicEventsForHijriDate } from '@/lib/islamic-holidays';

export interface GregorianCalendarDay {
  day: number;
  isoDate: string;
  hijriDay: number;
  hijriMonth: number;
  hijriYear: number;
  hasEvent: boolean;
  isRamadan: boolean;
  eventName?: string;
}

export interface GregorianCalendarMonth {
  month: number;
  daysInMonth: number;
  firstWeekday: number;
  days: GregorianCalendarDay[];
}

export interface GregorianYearCalendar {
  year: number;
  totalDays: number;
  months: GregorianCalendarMonth[];
}

export interface HijriCalendarDay {
  day: number;
  isoDate: string;
  gregorianDay: number;
  gregorianMonth: number;
  gregorianYear: number;
  hasEvent: boolean;
  eventName?: string;
}

export interface HijriCalendarMonth {
  month: number;
  daysInMonth: number;
  firstWeekday: number;
  days: HijriCalendarDay[];
}

export interface HijriYearCalendar {
  year: number;
  totalDays: number;
  months: HijriCalendarMonth[];
}

function padDatePart(value: number): string {
  return String(value).padStart(2, '0');
}

function getGregorianMonthDays(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

function getGregorianFirstWeekday(year: number, month: number): number {
  return new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
}

export function buildGregorianYearCalendar(year: number): GregorianYearCalendar {
  const months = Array.from({ length: 12 }, (_, monthIndex): GregorianCalendarMonth => {
    const month = monthIndex + 1;
    const daysInMonth = getGregorianMonthDays(year, month);
    const days = Array.from({ length: daysInMonth }, (_, dayIndex): GregorianCalendarDay => {
      const day = dayIndex + 1;
      const hijriDate = convertGregorianDayForCalendar(year, month, day);
      const events = getIslamicEventsForHijriDate(hijriDate.year, hijriDate.month, hijriDate.day);

      return {
        day,
        isoDate: `${year}-${padDatePart(month)}-${padDatePart(day)}`,
        hijriDay: hijriDate.day,
        hijriMonth: hijriDate.month,
        hijriYear: hijriDate.year,
        hasEvent: events.length > 0,
        isRamadan: hijriDate.month === 9,
        eventName: events[0]?.nameAr,
      };
    });

    return {
      month,
      daysInMonth,
      firstWeekday: getGregorianFirstWeekday(year, month),
      days,
    };
  });

  return {
    year,
    totalDays: months.reduce((total, month) => total + month.daysInMonth, 0),
    months,
  };
}

export function buildHijriYearCalendar(year: number): HijriYearCalendar {
  const months = Array.from({ length: 12 }, (_, monthIndex): HijriCalendarMonth => {
    const month = monthIndex + 1;
    const daysInMonth = getHijriMonthDays(year, month);
    const firstGregorianDate = convertHijriDayForCalendar(year, month, 1);
    const days = Array.from({ length: daysInMonth }, (_, dayIndex): HijriCalendarDay => {
      const day = dayIndex + 1;
      const gregorianDate = convertHijriDayForCalendar(year, month, day);
      const events = getIslamicEventsForHijriDate(year, month, day);

      return {
        day,
        isoDate: `${year}-${padDatePart(month)}-${padDatePart(day)}`,
        gregorianDay: gregorianDate.day,
        gregorianMonth: gregorianDate.month,
        gregorianYear: gregorianDate.year,
        hasEvent: events.length > 0,
        eventName: events[0]?.nameAr,
      };
    });

    return {
      month,
      daysInMonth,
      firstWeekday: firstGregorianDate.weekday,
      days,
    };
  });

  return {
    year,
    totalDays: months.reduce((total, month) => total + month.daysInMonth, 0),
    months,
  };
}
