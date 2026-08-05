/**
 * Saudi school calendar 1448-1449 AH (2026-2027 CE) — dates sourced from the Ministry of
 * Education's published academic calendar. Eid al-Fitr and Eid al-Adha dates are estimated
 * (moon-sighting dependent, `estimated: true`) — everything else is confirmed.
 *
 * NOTE ON THE HARDCODED YEAR: unlike other content on this site, a specific Hijri academic year
 * (1448) is a factual identifier here, not a "current year" placeholder — the whole page is
 * inherently year-specific and needs a real content refresh once the Ministry publishes the next
 * academic year's calendar. This matches the pre-existing pattern on this page (not introduced
 * by this redesign).
 */

export const SCHOOL_CALENDAR_EVENTS = [
  {
    slug: 'school-start-saudi',
    type: 'بداية العام الدراسي',
    icon: 'backpack',
    startIso: '2026-08-23',
    endIso: '2026-08-23',
    dateLabel: 'الأحد 23 أغسطس 2026',
    rule: 'عودة المعلمين والمعلمات قبلها بأسبوع (16 أغسطس 2026)',
    countdownLabel: 'عد تنازلي لبداية الدراسة',
    estimated: false,
  },
  {
    slug: 'saudi-national-day',
    type: 'إجازة اليوم الوطني',
    icon: 'flag',
    startIso: '2026-09-23',
    endIso: '2026-09-26',
    dateLabel: '23–26 سبتمبر 2026',
    rule: 'الأربعاء إلى السبت — أربعة أيام',
    countdownLabel: 'عد تنازلي لليوم الوطني',
    estimated: false,
  },
  {
    slug: 'autumn-season',
    type: 'إجازة الخريف',
    icon: 'leaf',
    startIso: '2026-11-20',
    endIso: '2026-11-28',
    dateLabel: '20–28 نوفمبر 2026',
    rule: 'الجمعة إلى السبت — تسعة أيام',
    countdownLabel: 'عد تنازلي لإجازة الخريف',
    estimated: false,
  },
  {
    slug: 'winter-season',
    type: 'إجازة منتصف العام',
    icon: 'book',
    startIso: '2027-01-08',
    endIso: '2027-01-16',
    dateLabel: '8–16 يناير 2027',
    rule: 'الجمعة إلى السبت — تفصل بين الفصلين الأول والثاني',
    countdownLabel: 'عد تنازلي لإجازة منتصف العام',
    estimated: false,
  },
  {
    slug: 'saudi-founding-day',
    type: 'إجازة يوم التأسيس',
    icon: 'landmark',
    startIso: '2027-02-19',
    endIso: '2027-02-22',
    dateLabel: '19–22 فبراير 2027',
    rule: 'الخميس إلى الأحد — أربعة أيام',
    countdownLabel: 'عد تنازلي ليوم التأسيس',
    estimated: false,
  },
  {
    slug: 'eid-al-fitr',
    type: 'إجازة عيد الفطر',
    icon: 'moon',
    startIso: '2027-02-26',
    endIso: '2027-03-13',
    dateLabel: '26 فبراير – 13 مارس 2027 (تقديري)',
    rule: 'مرتبطة برؤية الهلال — قد تتغير بفارق يوم واحد',
    countdownLabel: 'عد تنازلي لعيد الفطر',
    estimated: true,
  },
  {
    slug: 'eid-al-adha',
    type: 'إجازة عيد الأضحى',
    icon: 'kaaba',
    startIso: '2027-05-07',
    endIso: '2027-05-22',
    dateLabel: '7–22 مايو 2027 (تقديري)',
    rule: 'مرتبطة برؤية الهلال — قد تتغير بفارق يوم واحد',
    countdownLabel: 'عد تنازلي لعيد الأضحى',
    estimated: true,
  },
  {
    slug: 'summer-vacation',
    type: 'نهاية العام الدراسي',
    icon: 'sun',
    startIso: '2027-06-24',
    endIso: '2027-06-24',
    dateLabel: 'الخميس 24 يونيو 2027',
    rule: 'بداية الإجازة الصيفية',
    countdownLabel: 'عد تنازلي لنهاية العام',
    estimated: false,
  },
];

const SCHOOL_YEAR_START = SCHOOL_CALENDAR_EVENTS[0].startIso;
const SCHOOL_YEAR_END = SCHOOL_CALENDAR_EVENTS[SCHOOL_CALENDAR_EVENTS.length - 1].endIso;

/**
 * @param {Date} today
 * @returns {{ nextEvent: object|null, daysToNext: number, yearProgressPercent: number, hasStarted: boolean, hasEnded: boolean }}
 */
export function computeSchoolCalendarStatus(today = new Date()) {
  const ref = new Date(today);
  ref.setHours(0, 0, 0, 0);

  const yearStart = new Date(SCHOOL_YEAR_START);
  const yearEnd = new Date(SCHOOL_YEAR_END);
  const totalDays = Math.round((yearEnd - yearStart) / 86400000);
  const elapsedDays = Math.round((ref - yearStart) / 86400000);

  const hasStarted = elapsedDays >= 0;
  const hasEnded = ref > yearEnd;
  const yearProgressPercent = Math.min(100, Math.max(0, Math.round((elapsedDays / totalDays) * 100)));

  // Next event: the first one whose start date hasn't passed yet.
  const nextEvent = SCHOOL_CALENDAR_EVENTS.find((event) => new Date(event.startIso) >= ref) || null;
  const daysToNext = nextEvent ? Math.round((new Date(nextEvent.startIso) - ref) / 86400000) : 0;

  return { nextEvent, daysToNext, yearProgressPercent, hasStarted, hasEnded };
}
