import { convertDate } from '@/lib/date-adapter';
import {
  AGE_GENERATIONS,
  AGE_MILESTONE_DEFS,
  PLANET_YEAR_DAYS,
  RETIREMENT_RULES,
} from '@/lib/calculators/age-data';

const ARABIC_LATIN_LOCALE = 'ar-SA-u-nu-latn';
const DAY_MS = 24 * 60 * 60 * 1000;
const SECOND_MS = 1000;
const AVG_HIJRI_YEAR_DAYS = 354.367;
const AVG_HIJRI_MONTH_DAYS = AVG_HIJRI_YEAR_DAYS / 12;

function round(value, digits = 2) {
  const factor = 10 ** digits;
  return Math.round((Number(value) + Number.EPSILON) * factor) / factor;
}

function pad(value) {
  return String(value).padStart(2, '0');
}

export function formatAgeNumber(value, options = {}) {
  return new Intl.NumberFormat(ARABIC_LATIN_LOCALE, {
    maximumFractionDigits: 2,
    ...options,
  }).format(Number.isFinite(Number(value)) ? Number(value) : 0);
}

export function formatAgeDate(value) {
  const date = parseIsoDate(value);
  if (!date) return '';

  return new Intl.DateTimeFormat(ARABIC_LATIN_LOCALE, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

export function getTodayIso() {
  return isoFromDate(new Date());
}

export function isoFromParts(year, month, day) {
  return `${year}-${pad(month)}-${pad(day)}`;
}

export function parseIsoDate(value) {
  if (!value) return null;
  const [year, month, day] = String(value).split('-').map(Number);
  if (!year || !month || !day) return null;
  const date = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }

  return date;
}

function isoFromDate(date) {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 12, 0, 0),
  ).toISOString().slice(0, 10);
}

function daysBetween(startIso, endIso) {
  const start = parseIsoDate(startIso);
  const end = parseIsoDate(endIso);
  if (!start || !end) return 0;
  return Math.floor((end.getTime() - start.getTime()) / DAY_MS);
}

function daysInMonthUTC(year, monthIndex) {
  return new Date(Date.UTC(year, monthIndex + 1, 0, 12, 0, 0)).getUTCDate();
}

export function addDaysIso(isoValue, days) {
  const date = parseIsoDate(isoValue);
  if (!date) return '';
  const next = new Date(date.getTime() + days * DAY_MS);
  return isoFromDate(next);
}

export function addMonthsIso(isoValue, monthsToAdd) {
  const date = parseIsoDate(isoValue);
  if (!date) return '';

  const result = new Date(date.getTime());
  const originalDay = result.getUTCDate();
  result.setUTCDate(1);
  result.setUTCMonth(result.getUTCMonth() + monthsToAdd);
  const maxDay = daysInMonthUTC(result.getUTCFullYear(), result.getUTCMonth());
  result.setUTCDate(Math.min(originalDay, maxDay));

  return isoFromDate(result);
}

function addYearsIso(isoValue, yearsToAdd) {
  return addMonthsIso(isoValue, yearsToAdd * 12);
}

export function diffDatesDetailed(startIso, endIso) {
  const start = parseIsoDate(startIso);
  const end = parseIsoDate(endIso);

  if (!start || !end || end < start) {
    return {
      isValid: false,
      years: 0,
      months: 0,
      days: 0,
      totalDays: 0,
      decimalYears: 0,
    };
  }

  let years = end.getUTCFullYear() - start.getUTCFullYear();
  let months = end.getUTCMonth() - start.getUTCMonth();
  let days = end.getUTCDate() - start.getUTCDate();

  if (days < 0) {
    months -= 1;
    const previousMonth = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), 0, 12, 0, 0));
    days += previousMonth.getUTCDate();
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const totalDays = daysBetween(startIso, endIso);

  return {
    isValid: true,
    years,
    months,
    days,
    totalDays,
    decimalYears: totalDays / 365.2425,
  };
}

export function formatDurationParts({ years, months, days }) {
  const parts = [];
  if (Number.isFinite(years)) parts.push(`${formatAgeNumber(years, { maximumFractionDigits: 0 })} سنة`);
  if (Number.isFinite(months)) parts.push(`${formatAgeNumber(months, { maximumFractionDigits: 0 })} شهر`);
  if (Number.isFinite(days)) parts.push(`${formatAgeNumber(days, { maximumFractionDigits: 0 })} يوم`);
  return parts.filter(Boolean).join(' و');
}

export function getWeekdayAr(isoValue) {
  const date = parseIsoDate(isoValue);
  if (!date) return '';
  return new Intl.DateTimeFormat(ARABIC_LATIN_LOCALE, {
    weekday: 'long',
    timeZone: 'UTC',
  }).format(date);
}

export function getGeneration(year) {
  return AGE_GENERATIONS.find((item) => year >= item.from && year <= item.to) || {
    key: 'custom',
    label: 'جيل غير مصنف',
    note: 'هذا التاريخ خارج نطاق تصنيفات الأجيال الشائعة في الصفحة.',
  };
}

export function getSeason(month) {
  if ([12, 1, 2].includes(month)) return 'الشتاء';
  if ([3, 4, 5].includes(month)) return 'الربيع';
  if ([6, 7, 8].includes(month)) return 'الصيف';
  return 'الخريف';
}

function getBirthAnniversaryIso(birthIso, year) {
  const birth = parseIsoDate(birthIso);
  if (!birth) return '';
  const month = birth.getUTCMonth();
  const day = Math.min(birth.getUTCDate(), daysInMonthUTC(year, month));
  return isoFromParts(year, month + 1, day);
}

function getNextBirthdayIso(birthIso, targetIso) {
  const target = parseIsoDate(targetIso);
  if (!target) return '';
  const candidate = getBirthAnniversaryIso(birthIso, target.getUTCFullYear());
  return daysBetween(targetIso, candidate) >= 0
    ? candidate
    : getBirthAnniversaryIso(birthIso, target.getUTCFullYear() + 1);
}

function getLastBirthdayIso(birthIso, targetIso) {
  const target = parseIsoDate(targetIso);
  if (!target) return '';
  const candidate = getBirthAnniversaryIso(birthIso, target.getUTCFullYear());
  return daysBetween(candidate, targetIso) >= 0
    ? candidate
    : getBirthAnniversaryIso(birthIso, target.getUTCFullYear() - 1);
}

export function normalizeBirthInput(input) {
  if (!input) return { isValid: false, iso: '', error: 'أدخل تاريخ الميلاد أولاً.' };

  if (input.calendar === 'hijri') {
    const year = Number(input.year);
    const month = Number(input.month);
    const day = Number(input.day);

    if (!year || !month || !day) {
      return { isValid: false, iso: '', error: 'أكمل اليوم والشهر والسنة الهجرية.' };
    }

    try {
      const converted = convertDate({
        date: isoFromParts(year, month, day),
        toCalendar: 'gregorian',
      });
      return { isValid: true, iso: converted.formatted.iso, calendar: 'hijri' };
    } catch (error) {
      return {
        isValid: false,
        iso: '',
        error: error instanceof Error ? error.message : 'تعذر قراءة التاريخ الهجري.',
      };
    }
  }

  const iso = input.iso || '';
  if (!parseIsoDate(iso)) {
    return { isValid: false, iso: '', error: 'أدخل تاريخاً ميلادياً صحيحاً.' };
  }

  return { isValid: true, iso, calendar: 'gregorian' };
}

export function buildAgeMilestones(birthIso, targetIso = getTodayIso()) {
  const birth = parseIsoDate(birthIso);
  const target = parseIsoDate(targetIso);

  if (!birth || !target || target < birth) return [];

  return AGE_MILESTONE_DEFS.map((item) => {
    const milestoneIso =
      item.unit === 'days'
        ? addDaysIso(birthIso, item.value)
        : new Date(birth.getTime() + item.value * SECOND_MS).toISOString().slice(0, 10);
    const isReached = daysBetween(milestoneIso, targetIso) >= 0;
    const ageAtMilestone = diffDatesDetailed(birthIso, milestoneIso);
    const totalDaysFromBirth = Math.max(daysBetween(birthIso, milestoneIso), 1);
    const progressPercent = round(
      Math.min(100, Math.max(0, (daysBetween(birthIso, targetIso) / totalDaysFromBirth) * 100)),
      1,
    );

    return {
      ...item,
      dateIso: milestoneIso,
      dateLabel: formatAgeDate(milestoneIso),
      weekday: getWeekdayAr(milestoneIso),
      isReached,
      daysRemaining: Math.max(0, daysBetween(targetIso, milestoneIso)),
      progressPercent,
      ageLabel: formatDurationParts(ageAtMilestone),
    };
  });
}

export function buildAgeSnapshot({ birthDateIso, targetDateIso = getTodayIso() }) {
  const birth = parseIsoDate(birthDateIso);
  const target = parseIsoDate(targetDateIso);

  if (!birth || !target || target < birth) {
    return {
      isValid: false,
      error: 'تحقق من تاريخ الميلاد وتاريخ المقارنة.',
    };
  }

  const diff = diffDatesDetailed(birthDateIso, targetDateIso);
  const nextBirthdayIso = getNextBirthdayIso(birthDateIso, targetDateIso);
  const lastBirthdayIso = getLastBirthdayIso(birthDateIso, targetDateIso);
  const birthdayWindowDays = Math.max(1, daysBetween(lastBirthdayIso, nextBirthdayIso));
  const daysSinceBirthday = Math.max(0, daysBetween(lastBirthdayIso, targetDateIso));
  const daysUntilBirthday = Math.max(0, daysBetween(targetDateIso, nextBirthdayIso));
  const totalDays = diff.totalDays;
  const totalHours = totalDays * 24;
  const totalMinutes = totalHours * 60;
  const totalSeconds = totalMinutes * 60;
  const generation = getGeneration(birth.getUTCFullYear());
  const halfBirthdayIso = addMonthsIso(nextBirthdayIso, -6);
  const nextHalfBirthdayIso = daysBetween(targetDateIso, halfBirthdayIso) >= 0
    ? halfBirthdayIso
    : addMonthsIso(nextBirthdayIso, 6);
  let hijriBirth = null;
  let hijriTarget = null;

  try {
    hijriBirth = convertDate({ date: birthDateIso, toCalendar: 'hijri' });
    hijriTarget = convertDate({ date: targetDateIso, toCalendar: 'hijri' });
  } catch {
    hijriBirth = null;
    hijriTarget = null;
  }

  return {
    isValid: true,
    birthDateIso,
    birthDateLabel: formatAgeDate(birthDateIso),
    birthWeekday: getWeekdayAr(birthDateIso),
    targetDateIso,
    targetDateLabel: formatAgeDate(targetDateIso),
    years: diff.years,
    months: diff.months,
    days: diff.days,
    ageLabel: formatDurationParts(diff),
    totals: {
      days: totalDays,
      weeks: round(totalDays / 7, 2),
      months: round(totalDays / 30.436875, 2),
      hours: totalHours,
      minutes: totalMinutes,
      seconds: totalSeconds,
    },
    hijri: {
      birth: hijriBirth,
      target: hijriTarget,
      yearsApprox: round(totalDays / AVG_HIJRI_YEAR_DAYS, 2),
      monthsApprox: round(totalDays / AVG_HIJRI_MONTH_DAYS, 1),
    },
    nextBirthday: {
      iso: nextBirthdayIso,
      label: formatAgeDate(nextBirthdayIso),
      weekday: getWeekdayAr(nextBirthdayIso),
      daysUntil: daysUntilBirthday,
      nextAge: diffDatesDetailed(birthDateIso, nextBirthdayIso).years,
    },
    birthdayProgress: {
      lastBirthdayIso,
      nextBirthdayIso,
      elapsedDays: daysSinceBirthday,
      totalDays: birthdayWindowDays,
      progressPercent: round((daysSinceBirthday / birthdayWindowDays) * 100, 1),
    },
    personal: {
      generation,
      season: getSeason(birth.getUTCMonth() + 1),
      dayOfYear: diffDatesDetailed(
        isoFromParts(birth.getUTCFullYear(), 1, 1),
        birthDateIso,
      ).totalDays + 1,
      halfBirthdayIso: nextHalfBirthdayIso,
      halfBirthdayLabel: formatAgeDate(nextHalfBirthdayIso),
      halfBirthdayWeekday: getWeekdayAr(nextHalfBirthdayIso),
    },
    lifeStats: {
      heartbeats: Math.round(totalMinutes * 72),
      steps: Math.round(totalDays * 7000),
      sleepHours: Math.round(totalDays * 8),
      waterLiters: round(totalDays * 1.5, 0),
      blinks: Math.round(totalMinutes * 15),
    },
    milestones: buildAgeMilestones(birthDateIso, targetDateIso),
  };
}

export function buildAgeDifference({
  firstBirthDateIso,
  secondBirthDateIso,
  targetDateIso = getTodayIso(),
  firstName = 'الشخص الأول',
  secondName = 'الشخص الثاني',
}) {
  const first = parseIsoDate(firstBirthDateIso);
  const second = parseIsoDate(secondBirthDateIso);
  const target = parseIsoDate(targetDateIso);

  if (!first || !second || !target) {
    return { isValid: false, error: 'أدخل تاريخين صحيحين للمقارنة.' };
  }

  const older = first <= second
    ? { name: firstName, birthIso: firstBirthDateIso }
    : { name: secondName, birthIso: secondBirthDateIso };
  const younger = older.birthIso === firstBirthDateIso
    ? { name: secondName, birthIso: secondBirthDateIso }
    : { name: firstName, birthIso: firstBirthDateIso };
  const gap = diffDatesDetailed(older.birthIso, younger.birthIso);
  const firstAge = buildAgeSnapshot({ birthDateIso: firstBirthDateIso, targetDateIso });
  const secondAge = buildAgeSnapshot({ birthDateIso: secondBirthDateIso, targetDateIso });

  if (!firstAge.isValid || !secondAge.isValid) {
    return { isValid: false, error: 'لا يمكن حساب أعمار الأشخاص عند هذا التاريخ.' };
  }

  return {
    isValid: true,
    older,
    younger,
    gap,
    gapLabel: formatDurationParts(gap),
    totalDays: gap.totalDays,
    firstAge,
    secondAge,
    sameGeneration:
      firstAge.personal.generation.label === secondAge.personal.generation.label,
    sharedGenerationLabel:
      firstAge.personal.generation.label === secondAge.personal.generation.label
        ? firstAge.personal.generation.label
        : 'لكل شخص جيل مختلف',
  };
}

export function buildBirthdayProfile({ birthDateIso, targetDateIso = getTodayIso() }) {
  const snapshot = buildAgeSnapshot({ birthDateIso, targetDateIso });
  if (!snapshot.isValid) return snapshot;

  const birth = parseIsoDate(birthDateIso);
  const birthYear = birth ? birth.getUTCFullYear() : 0;

  return {
    ...snapshot,
    bornInLeapYear:
      (birthYear % 4 === 0 && birthYear % 100 !== 0) || birthYear % 400 === 0,
    isWeekend: ['الجمعة', 'السبت'].includes(snapshot.birthWeekday),
    sameWeekdayNextBirthday:
      snapshot.birthWeekday === snapshot.nextBirthday.weekday,
  };
}

export function buildPlanetaryAges({ birthDateIso, targetDateIso = getTodayIso() }) {
  const snapshot = buildAgeSnapshot({ birthDateIso, targetDateIso });
  if (!snapshot.isValid) return snapshot;

  const totalDays = snapshot.totals.days;
  const birth = parseIsoDate(birthDateIso);

  return {
    isValid: true,
    birthDateIso,
    targetDateIso,
    planets: PLANET_YEAR_DAYS.map((planet) => {
      const age = totalDays / planet.orbitDays;
      const nextWhole = Math.ceil(age);
      const nextDate = new Date(birth.getTime() + nextWhole * planet.orbitDays * DAY_MS);
      const nextIso = nextDate.toISOString().slice(0, 10);

      return {
        ...planet,
        age: round(age, planet.key === 'earth' ? 2 : 3),
        nextBirthdayIso: nextIso,
        nextBirthdayLabel: formatAgeDate(nextIso),
        nextBirthdayInDays: Math.max(0, daysBetween(targetDateIso, nextIso)),
      };
    }),
  };
}

export function getRetirementRule(code = 'sa') {
  return RETIREMENT_RULES.find((item) => item.code === code) || RETIREMENT_RULES[0];
}

export function calculateRetirement({
  birthDateIso,
  countryCode = 'sa',
  sector = 'government',
  gender = 'male',
  targetDateIso = getTodayIso(),
}) {
  const birth = parseIsoDate(birthDateIso);
  const target = parseIsoDate(targetDateIso);
  const rule = getRetirementRule(countryCode);
  const sectorRule = rule?.sectors?.[sector];
  const retirementAge = sectorRule?.[gender] ?? sectorRule?.male;

  if (!birth || !target || !retirementAge) {
    return { isValid: false, error: 'أكمل البيانات المطلوبة لحساب التقاعد.' };
  }

  const retirementDateIso = addYearsIso(birthDateIso, retirementAge);
  const currentAge = buildAgeSnapshot({ birthDateIso, targetDateIso });
  const remaining = diffDatesDetailed(targetDateIso, retirementDateIso);

  return {
    isValid: true,
    rule,
    sector,
    gender,
    currentAge,
    retirementAge,
    retirementDateIso,
    retirementDateLabel: formatAgeDate(retirementDateIso),
    daysRemaining: Math.max(0, daysBetween(targetDateIso, retirementDateIso)),
    remainingLabel: remaining.isValid ? formatDurationParts(remaining) : 'وصلت إلى سن التقاعد أو تجاوزته',
    isRetired: daysBetween(retirementDateIso, targetDateIso) >= 0,
  };
}
