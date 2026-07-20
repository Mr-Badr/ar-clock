import {
  convertGregorianDayForCalendar,
  convertHijriDayForCalendar,
  getHijriMonthDays,
  ISLAMIC_MONTH_NAMES_AR,
} from '@/lib/date-adapter';

const GREGORIAN_MIN_YEAR = 1924;
const GREGORIAN_MAX_YEAR = 2077;

// Average length of a menstrual-cycle-based iddah (3 cycles), used only as an
// approximate range since it depends on the woman's actual cycle and cannot
// be computed from the calendar alone — unlike the widow's and the
// non-menstruating divorcée's iddah, which are precise Hijri-month counts.
const DIVORCED_MENSTRUATING_ESTIMATE_MIN_DAYS = 65;
const DIVORCED_MENSTRUATING_ESTIMATE_MAX_DAYS = 100;

export function isSupportedStartDate(dateObj) {
  if (!(dateObj instanceof Date) || Number.isNaN(dateObj.getTime())) return false;
  const year = dateObj.getFullYear();
  return year >= GREGORIAN_MIN_YEAR && year <= GREGORIAN_MAX_YEAR;
}

export function getHijriMonthName(month) {
  return ISLAMIC_MONTH_NAMES_AR[month - 1] || '';
}

function clampHijriDay(year, month, day) {
  return Math.min(day, getHijriMonthDays(year, month));
}

function addHijriMonths(year, month, day, monthsToAdd) {
  const totalMonthIndex = (month - 1) + monthsToAdd;
  const newYear = year + Math.floor(totalMonthIndex / 12);
  const newMonth = (((totalMonthIndex % 12) + 12) % 12) + 1;
  const newDay = clampHijriDay(newYear, newMonth, day);
  return { year: newYear, month: newMonth, day: newDay };
}

function addHijriDays(year, month, day, daysToAdd) {
  let y = year;
  let m = month;
  let d = day + daysToAdd;
  while (d > getHijriMonthDays(y, m)) {
    d -= getHijriMonthDays(y, m);
    m += 1;
    if (m > 12) {
      m = 1;
      y += 1;
    }
  }
  return { year: y, month: m, day: d };
}

function hijriToGregorianDate(hijri) {
  const greg = convertHijriDayForCalendar(hijri.year, hijri.month, hijri.day);
  return new Date(greg.year, greg.month - 1, greg.day);
}

/**
 * Computes the Iddah (Islamic waiting period) end date for the three
 * calendar-computable cases. Situation types:
 *  - 'widow': 4 Hijri months + 10 days from the date of death (Quran 2:234).
 *  - 'divorced-non-menstruating': 3 Hijri months from the date of divorce —
 *     applies to women past menopause or who have not yet menstruated
 *     (Quran 65:4).
 *  - 'divorced-menstruating': NOT precisely calendar-computable (depends on
 *     her actual 3 menstrual cycles) — returns an approximate day range only.
 *  - 'pregnant': ends at delivery regardless of widow/divorced status
 *     (Quran 65:4) — if an expected due date is supplied it is echoed back
 *     as the (non-final) estimated end.
 *
 * @param {string} situationType
 * @param {string} startDateIso - "YYYY-MM-DD"
 * @param {string} [expectedDueDateIso] - only used for situationType 'pregnant'
 */
export function computeIddahSnapshot(situationType, startDateIso, expectedDueDateIso) {
  const [sy, sm, sd] = String(startDateIso || '').split('-').map(Number);
  if (!sy || !sm || !sd) return null;

  const startDate = new Date(sy, sm - 1, sd);
  if (!isSupportedStartDate(startDate)) return null;

  const startHijri = convertGregorianDayForCalendar(sy, sm, sd);

  if (situationType === 'pregnant') {
    let dueDate = null;
    if (expectedDueDateIso) {
      const [dy, dm, dd] = String(expectedDueDateIso).split('-').map(Number);
      if (dy && dm && dd) dueDate = new Date(dy, dm - 1, dd);
    }
    return {
      situationType,
      startDate,
      startHijri,
      isPrecise: false,
      endsAtDelivery: true,
      estimatedDueDate: dueDate,
    };
  }

  if (situationType === 'divorced-menstruating') {
    const minEndDate = new Date(startDate.getTime() + DIVORCED_MENSTRUATING_ESTIMATE_MIN_DAYS * 86400000);
    const maxEndDate = new Date(startDate.getTime() + DIVORCED_MENSTRUATING_ESTIMATE_MAX_DAYS * 86400000);
    return {
      situationType,
      startDate,
      startHijri,
      isPrecise: false,
      minEndDate,
      maxEndDate,
    };
  }

  const monthsToAdd = situationType === 'widow' ? 4 : 3;
  const extraDays = situationType === 'widow' ? 10 : 0;

  let endHijri = addHijriMonths(startHijri.year, startHijri.month, startHijri.day, monthsToAdd);
  if (extraDays > 0) {
    endHijri = addHijriDays(endHijri.year, endHijri.month, endHijri.day, extraDays);
  }
  const endDate = hijriToGregorianDate(endHijri);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const endMidnight = new Date(endDate);
  endMidnight.setHours(0, 0, 0, 0);
  const daysRemaining = Math.round((endMidnight.getTime() - today.getTime()) / 86400000);

  return {
    situationType,
    startDate,
    startHijri,
    isPrecise: true,
    endHijri,
    endDate,
    daysRemaining,
    isOngoing: daysRemaining > 0,
  };
}
