import {
  NAP_DURATION_OPTIONS,
  QUICK_BED_TIMES,
  QUICK_WAKE_TIMES,
  SLEEP_CYCLE_OPTIONS,
  SLEEP_LATENCY_OPTIONS,
  SLEEP_NEED_RANGES,
} from './constants';

const DAY_MINUTES = 24 * 60;

function toNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function pad(value) {
  return String(value).padStart(2, '0');
}

export function parseClockTime(value) {
  if (!value || !String(value).includes(':')) return null;
  const [hours, minutes] = String(value).split(':').map(Number);
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return null;
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;
  return (hours * 60) + minutes;
}

export function formatClockArabic(minutes) {
  const safeMinutes = ((Math.round(minutes) % DAY_MINUTES) + DAY_MINUTES) % DAY_MINUTES;
  const hours24 = Math.floor(safeMinutes / 60);
  const mins = safeMinutes % 60;
  const suffix = hours24 >= 12 ? 'م' : 'ص';
  let hours12 = hours24 % 12;
  if (hours12 === 0) hours12 = 12;
  return `${hours12}:${pad(mins)} ${suffix}`;
}

export function formatHoursLabel(hours, digits = 1) {
  return `${Number(hours).toFixed(digits)} ساعة`;
}

export function formatMinutesAsHours(minutes, digits = 1) {
  return formatHoursLabel(minutes / 60, digits);
}

export function getSleepNeedByAge(age) {
  const numericAge = clamp(toNumber(age, 25), 3, 120);
  return SLEEP_NEED_RANGES.find((range) => numericAge >= range.minAge && numericAge <= range.maxAge) || SLEEP_NEED_RANGES[3];
}

function getAverageRecommendedHours(range) {
  return (range.recommendedMin + range.recommendedMax) / 2;
}

function getDurationStatus(hours, range) {
  if (hours >= range.recommendedMin && hours <= range.recommendedMax) {
    return {
      label: 'مناسب',
      tone: 'good',
      note: `هذا الخيار يقع داخل النطاق الموصى به لعمر ${range.label}.`,
    };
  }

  if (hours >= range.recommendedMin - 1) {
    return {
      label: 'مقبول',
      tone: 'warn',
      note: `هذا الخيار قريب من الحد الأدنى لعمر ${range.label} لكنه ليس مريحاً للجميع يومياً.`,
    };
  }

  return {
    label: 'أقل من الموصى به',
    tone: 'bad',
    note: `هذا الخيار أقل من الحد الموصى به لعمر ${range.label}، وقد يرفع احتمال الاستيقاظ متعباً.`,
  };
}

export function buildSleepOptionLabel({ cycles, totalSleepMinutes, range }) {
  const hours = totalSleepMinutes / 60;
  const status = getDurationStatus(hours, range);
  return {
    cycles,
    totalSleepMinutes,
    hours,
    status,
    summary:
      cycles === 1
        ? 'دورة واحدة فقط'
        : `هذا الخيار يمنحك ${cycles} دورات نوم تقريبية`,
  };
}

export function calculateBedtimes({
  wakeTime = '06:00',
  age = 25,
  latencyMinutes = 15,
  cycleMinutes = 90,
  cycleCounts = [6, 5, 4, 3],
}) {
  const wakeMinutes = parseClockTime(wakeTime);
  const range = getSleepNeedByAge(age);
  if (wakeMinutes === null) {
    return { isValid: false, options: [], range };
  }

  const options = cycleCounts.map((cycles) => {
    const totalSleepMinutes = cycles * cycleMinutes;
    const bedtimeMinutes = wakeMinutes - totalSleepMinutes - latencyMinutes;
    const meta = buildSleepOptionLabel({ cycles, totalSleepMinutes, range });
    return {
      ...meta,
      bedtimeMinutes,
      bedtimeLabel: formatClockArabic(bedtimeMinutes),
      durationLabel: formatMinutesAsHours(totalSleepMinutes, 1),
      latencyMinutes,
    };
  });

  return {
    isValid: true,
    range,
    wakeLabel: formatClockArabic(wakeMinutes),
    options,
    bestOption: options.find((item) => item.status.label === 'مناسب') || options[0],
    honestNote: 'هذه الأداة تقدير يساعدك على التخطيط، وليست قياساً طبياً دقيقاً لكل شخص.',
  };
}

export function calculateWakeTimes({
  bedTime = '22:30',
  age = 25,
  latencyMinutes = 15,
  cycleMinutes = 90,
  cycleCounts = [3, 4, 5, 6],
}) {
  const bedMinutes = parseClockTime(bedTime);
  const range = getSleepNeedByAge(age);
  if (bedMinutes === null) {
    return { isValid: false, options: [], range };
  }

  const options = cycleCounts.map((cycles) => {
    const totalSleepMinutes = cycles * cycleMinutes;
    const wakeMinutes = bedMinutes + latencyMinutes + totalSleepMinutes;
    const meta = buildSleepOptionLabel({ cycles, totalSleepMinutes, range });
    return {
      ...meta,
      wakeMinutes,
      wakeLabel: formatClockArabic(wakeMinutes),
      durationLabel: formatMinutesAsHours(totalSleepMinutes, 1),
      latencyMinutes,
    };
  });

  return {
    isValid: true,
    range,
    bedtimeLabel: formatClockArabic(bedMinutes),
    options,
    bestOption: options.find((item) => item.status.label === 'مناسب') || options[Math.min(2, options.length - 1)],
    honestNote: 'هذه الأداة تقدير مبني على دورات نوم تقريبية ووقت غفو افتراضي، لا على قياس فردي دقيق.',
  };
}

export function calculateSleepDuration({
  sleepTime = '23:00',
  wakeTime = '07:00',
  awakeMinutes = 0,
  age = 25,
}) {
  const startMinutes = parseClockTime(sleepTime);
  const endMinutes = parseClockTime(wakeTime);
  const range = getSleepNeedByAge(age);

  if (startMinutes === null || endMinutes === null) {
    return { isValid: false, range };
  }

  const totalInBedMinutes = endMinutes >= startMinutes
    ? endMinutes - startMinutes
    : (DAY_MINUTES - startMinutes) + endMinutes;

  const awake = Math.max(0, toNumber(awakeMinutes));
  const netSleepMinutes = Math.max(totalInBedMinutes - awake, 0);
  const netHours = netSleepMinutes / 60;
  const status = getDurationStatus(netHours, range);

  let fatigueHint = 'المدة جيدة مبدئياً، فإذا استيقظت متعباً فربما تكون المشكلة في الانتظام أو جودة النوم لا في العدد فقط.';
  if (awake >= 45) fatigueHint = 'الاستيقاظات الليلية الطويلة تقلل صافي النوم وقد تفسر شعور التعب حتى لو بدا وقتك في السرير جيداً.';
  else if (status.label === 'أقل من الموصى به') fatigueHint = 'قلة النوم الصافية هنا كافية لتفسير التعب الصباحي عند كثير من الناس.';

  return {
    isValid: true,
    range,
    totalInBedMinutes,
    netSleepMinutes,
    awakeMinutes: awake,
    estimatedCycles: Math.max(1, Math.round(netSleepMinutes / 90)),
    totalInBedLabel: formatMinutesAsHours(totalInBedMinutes, 1),
    netSleepLabel: formatMinutesAsHours(netSleepMinutes, 1),
    awakeLabel: awake ? `${awake} دقيقة` : 'دون استيقاظات طويلة',
    status,
    fatigueHint,
  };
}

export function calculateNap({
  startTime = '14:00',
  napMinutes = 20,
  latencyMinutes = 10,
  bedtime = '23:00',
}) {
  const startMinutes = parseClockTime(startTime);
  const bedMinutes = parseClockTime(bedtime);
  if (startMinutes === null || bedMinutes === null) {
    return { isValid: false };
  }

  const selectedNap = NAP_DURATION_OPTIONS.find((item) => item.value === toNumber(napMinutes)) || NAP_DURATION_OPTIONS[0];
  const wakeMinutes = startMinutes + selectedNap.value + Math.max(0, toNumber(latencyMinutes));
  const isLate = startMinutes >= 17 * 60 || (bedMinutes - startMinutes + DAY_MINUTES) % DAY_MINUTES < 6 * 60;
  const inertiaRisk = selectedNap.value >= 30 && selectedNap.value < 90 ? 'متوسط' : selectedNap.value >= 90 ? 'منخفض بعد الاستيقاظ الكامل' : 'منخفض';

  return {
    isValid: true,
    wakeTimeLabel: formatClockArabic(wakeMinutes),
    napLabel: selectedNap.label,
    napDescription: selectedNap.description,
    inertiaRisk,
    isLate,
    timingNote: isLate
      ? 'هذه القيلولة متأخرة نسبياً وقد تؤثر على نوم الليل إذا كنت تنام باكراً.'
      : 'هذه القيلولة تقع في وقت مقبول غالباً ولن تضغط نوم الليل عند كثير من الناس.',
  };
}

export function calculateSleepDebt({
  age = 25,
  actualByDay = [7, 7, 7, 7, 7, 8, 8],
}) {
  const range = getSleepNeedByAge(age);
  const recommendedDaily = getAverageRecommendedHours(range);
  const normalizedHours = actualByDay.map((value) => Math.max(0, toNumber(value)));
  const weeklyNeed = recommendedDaily * 7;
  const weeklyActual = normalizedHours.reduce((sum, item) => sum + item, 0);
  const debtHours = Math.max(weeklyNeed - weeklyActual, 0);
  const averageSleep = weeklyActual / 7;

  let status = 'لا يوجد عجز واضح';
  let recoveryPlan = 'استمر على نفس النمط وحافظ على وقت نوم واستيقاظ أكثر ثباتاً.';
  if (debtHours > 2 && debtHours <= 6) {
    status = 'عجز خفيف';
    recoveryPlan = 'أضف 20–30 دقيقة نوم إضافية في عدة ليالٍ متتالية بدل محاولة تعويض كل شيء في ليلة واحدة.';
  } else if (debtHours > 6) {
    status = 'عجز ملحوظ';
    recoveryPlan = 'ابدأ بتثبيت وقت الاستيقاظ أولاً، ثم زد النوم تدريجياً، وقلل القيلولات المتأخرة حتى لا تدخل في حلقة تعب مزمن.';
  }

  return {
    isValid: true,
    range,
    recommendedDaily: Number(recommendedDaily.toFixed(1)),
    weeklyNeed: Number(weeklyNeed.toFixed(1)),
    weeklyActual: Number(weeklyActual.toFixed(1)),
    debtHours: Number(debtHours.toFixed(1)),
    averageSleep: Number(averageSleep.toFixed(1)),
    status,
    recoveryPlan,
    dayBreakdown: normalizedHours,
  };
}

export function getNowClockValue() {
  const now = new Date();
  return `${pad(now.getHours())}:${pad(now.getMinutes())}`;
}

export {
  NAP_DURATION_OPTIONS,
  QUICK_BED_TIMES,
  QUICK_WAKE_TIMES,
  SLEEP_CYCLE_OPTIONS,
  SLEEP_LATENCY_OPTIONS,
  SLEEP_NEED_RANGES,
};
