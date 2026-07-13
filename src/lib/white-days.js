import {
  convertGregorianDayForCalendar,
  convertHijriDayForCalendar,
  ISLAMIC_MONTH_NAMES_AR,
} from './date-adapter';

const WHITE_DAYS = [13, 14, 15];

/**
 * أيام البيض — the 13th/14th/15th of every Hijri month, a monthly-recurring
 * fasting recommendation. The event engine has no "monthly-hijri" type, so this
 * walks the Hijri calendar directly via @internationalized/date instead of
 * modeling it as a holiday event.
 */
export function getNextWhiteDays(date = new Date()) {
  const hijriToday = convertGregorianDayForCalendar(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
  );

  let targetYear = hijriToday.year;
  let targetMonth = hijriToday.month;
  const isCurrentlyWhiteDays = WHITE_DAYS.includes(hijriToday.day);

  if (!isCurrentlyWhiteDays && hijriToday.day > WHITE_DAYS[WHITE_DAYS.length - 1]) {
    targetMonth += 1;
    if (targetMonth > 12) {
      targetMonth = 1;
      targetYear += 1;
    }
  }

  const startGregorian = convertHijriDayForCalendar(targetYear, targetMonth, WHITE_DAYS[0]);
  const endGregorian = convertHijriDayForCalendar(targetYear, targetMonth, WHITE_DAYS[WHITE_DAYS.length - 1]);

  const startDate = new Date(startGregorian.year, startGregorian.month - 1, startGregorian.day);
  const endDate = new Date(endGregorian.year, endGregorian.month - 1, endGregorian.day);
  const todayMidnight = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const msPerDay = 86_400_000;
  const daysRemaining = isCurrentlyWhiteDays
    ? 0
    : Math.round((startDate.getTime() - todayMidnight.getTime()) / msPerDay);

  return {
    isCurrentlyWhiteDays,
    currentHijriDay: hijriToday.day,
    hijriMonthName: ISLAMIC_MONTH_NAMES_AR[targetMonth - 1],
    hijriYear: targetYear,
    hijriMonth: targetMonth,
    startDate,
    endDate,
    daysRemaining,
  };
}
