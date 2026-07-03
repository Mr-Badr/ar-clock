/**
 * Pregnancy due date calculation — Naegele's rule with cycle-length adjustment.
 *
 * Formula: EDD = LMP + 280 + (cycleLength − 28) days
 * Week = floor(daysPregnant / 7), extraDays = daysPregnant % 7
 *
 * All functions are pure (no Date() side-effects) so they are testable
 * and safe in both server and client contexts.
 */

export const PREGNANCY_MILESTONES = [
  { week: 4,  label: 'غياب الدورة', detail: 'أول علامة ظاهرة — اختبري الحمل المنزلي' },
  { week: 8,  label: 'أول زيارة للطبيب', detail: 'تأكيد الحمل وبدء حمض الفوليك والمكملات' },
  { week: 10, label: 'بداية الأمان النسبي', detail: 'معظم الأعضاء مكتملة — خطر التشوهات الكبرى ينخفض' },
  { week: 12, label: 'نهاية الثلث الأول', detail: 'فحص النوكال — نسبة الإجهاض تنخفض بشكل ملحوظ' },
  { week: 16, label: 'بدء الإحساس بالحركة', detail: 'قد تشعرين بأولى حركات الجنين (يتأخر للأمهات الأولى)' },
  { week: 18, label: 'الفحص التشريحي المفصّل', detail: 'فحص شامل للأعضاء بالموجات فوق الصوتية' },
  { week: 20, label: 'منتصف الحمل', detail: 'تحديد الجنس ممكن عادةً من هذا الأسبوع' },
  { week: 24, label: 'قابلية الحياة', detail: 'الجنين قادر على البقاء خارج الرحم بدعم طبي' },
  { week: 28, label: 'بداية الثلث الثالث', detail: 'الرئتان تبدآن إنتاج الـ surfactant' },
  { week: 32, label: 'فحوصات ما قبل الولادة', detail: 'مراقبة وضع الجنين ومستوى السائل الأمنيوسي' },
  { week: 36, label: 'الحمل شبه الكامل', detail: 'الجنين في وضع الولادة الطبيعي عادةً' },
  { week: 38, label: 'حمل كامل', detail: 'الجنين مكتمل النمو — الولادة متوقعة قريباً' },
  { week: 40, label: 'موعد الولادة المتوقع', detail: 'EDD — هدف الحساب وليس وعداً بالتوقيت الدقيق' },
];

export const TRIMESTER_INFO = {
  1: { label: 'الثلث الأول',   range: 'الأسبوع 1–12',   color: '#e11d48', level: 'first'  },
  2: { label: 'الثلث الثاني',  range: 'الأسبوع 13–27',  color: '#d97706', level: 'second' },
  3: { label: 'الثلث الثالث', range: 'الأسبوع 28–40',  color: '#16a34a', level: 'third'  },
};

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const MAX_BACK_DAYS = 294; // 42 weeks — post-term limit

/**
 * Calculate pregnancy details from LMP and optional cycle length.
 *
 * @param {object} opts
 * @param {string|Date} opts.lmpDate     — first day of last menstrual period
 * @param {number}      [opts.cycleLength=28] — menstrual cycle length in days
 * @param {Date}        [opts.today]     — reference "today" (defaults to new Date())
 * @returns {object|null}
 */
export function calculatePregnancy({ lmpDate, cycleLength = 28, today = new Date() }) {
  if (!lmpDate) return null;

  const lmp = new Date(lmpDate);
  lmp.setHours(0, 0, 0, 0);
  if (isNaN(lmp.getTime())) return null;

  const ref = new Date(today);
  ref.setHours(0, 0, 0, 0);

  const adjustedDueDays = 280 + Math.round(cycleLength - 28);
  const edd = new Date(lmp.getTime() + adjustedDueDays * MS_PER_DAY);

  const daysPregnant = Math.round((ref - lmp) / MS_PER_DAY);
  if (daysPregnant < 0) return null; // LMP in the future

  const weeksPregnant = Math.floor(daysPregnant / 7);
  const extraDays = daysPregnant % 7;
  const daysToEdd = Math.round((edd - ref) / MS_PER_DAY);
  const progressPercent = Math.min(100, Math.max(0, Math.round((daysPregnant / adjustedDueDays) * 100)));

  const trimester = weeksPregnant < 13 ? 1 : weeksPregnant < 28 ? 2 : 3;

  const milestones = PREGNANCY_MILESTONES.map((m) => ({
    ...m,
    date: new Date(lmp.getTime() + m.week * 7 * MS_PER_DAY),
    reached: weeksPregnant > m.week,
    current: weeksPregnant === m.week,
  }));

  const isPastEdd = daysPregnant > adjustedDueDays;
  const isInRange = daysPregnant <= MAX_BACK_DAYS;

  return {
    lmp,
    edd,
    daysPregnant,
    weeksPregnant,
    extraDays,
    daysToEdd,
    progressPercent,
    trimester,
    milestones,
    isPastEdd,
    isValid: isInRange,
    adjustedDueDays,
    cycleLength,
  };
}

/** "الأسبوع 12" or "الأسبوع 12+3" */
export function formatPregnancyWeek(weeks, extraDays) {
  if (extraDays === 0) return `الأسبوع ${weeks}`;
  return `الأسبوع ${weeks}+${extraDays}`;
}

/** Ovulation window from LMP and cycle length. */
export function calculateOvulation({ lmpDate, cycleLength = 28, today = new Date() }) {
  if (!lmpDate) return null;

  const lmp = new Date(lmpDate);
  lmp.setHours(0, 0, 0, 0);
  if (isNaN(lmp.getTime())) return null;

  const ref = new Date(today);
  ref.setHours(0, 0, 0, 0);

  // Ovulation occurs ~14 days before next period (luteal phase)
  const ovulationDay = Math.round(cycleLength - 14);
  const ovulationDate = new Date(lmp.getTime() + ovulationDay * MS_PER_DAY);

  // Fertile window = 5 days before + ovulation day
  const fertileStart = new Date(ovulationDate.getTime() - 5 * MS_PER_DAY);
  const fertileEnd = new Date(ovulationDate.getTime() + 1 * MS_PER_DAY);

  // Next period
  const nextPeriod = new Date(lmp.getTime() + cycleLength * MS_PER_DAY);

  const daysToOvulation = Math.round((ovulationDate - ref) / MS_PER_DAY);
  const daysToNextPeriod = Math.round((nextPeriod - ref) / MS_PER_DAY);

  const isInFertileWindow = ref >= fertileStart && ref <= fertileEnd;
  const ovulationPassed = daysToOvulation < 0;

  // Generate 3 upcoming ovulation + fertile windows (from next cycle onwards)
  const nextCycles = Array.from({ length: 3 }, (_, i) => {
    const cycleLmpOffset = (i + 1) * cycleLength;
    const cLmp = new Date(lmp.getTime() + cycleLmpOffset * MS_PER_DAY);
    const cOvulation = new Date(cLmp.getTime() + ovulationDay * MS_PER_DAY);
    const cFertileStart = new Date(cOvulation.getTime() - 5 * MS_PER_DAY);
    const cFertileEnd = new Date(cOvulation.getTime() + 1 * MS_PER_DAY);
    const cNextPeriod = new Date(cLmp.getTime() + cycleLength * MS_PER_DAY);
    return { ovulationDate: cOvulation, fertileStart: cFertileStart, fertileEnd: cFertileEnd, nextPeriod: cNextPeriod };
  });

  return {
    ovulationDate,
    fertileStart,
    fertileEnd,
    nextPeriod,
    daysToOvulation,
    daysToNextPeriod,
    isInFertileWindow,
    ovulationPassed,
    nextCycles,
    isValid: true,
  };
}
