function toReferenceDate(referenceDateOrIso) {
  if (!referenceDateOrIso) return new Date();
  if (referenceDateOrIso instanceof Date) return referenceDateOrIso;

  const parsed = new Date(referenceDateOrIso);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}

export function getOffsetLabelForTimezone(timezone, referenceDateOrIso) {
  if (!timezone) return '';

  try {
    const referenceDate = toReferenceDate(referenceDateOrIso);
    return new Intl.DateTimeFormat('en', {
      timeZone: timezone,
      timeZoneName: 'shortOffset',
    }).formatToParts(referenceDate).find((part) => part.type === 'timeZoneName')?.value ?? '';
  } catch {
    return '';
  }
}

function parseOffsetLabel(offsetLabel) {
  if (!offsetLabel || offsetLabel === 'GMT' || offsetLabel === 'UTC') {
    return { sign: 0, normalizedLabel: 'GMT+0' };
  }

  const match = /^GMT([+-])(\d{1,2})(?::?(\d{2}))?$/.exec(offsetLabel);
  if (!match) {
    return { sign: 0, normalizedLabel: offsetLabel };
  }

  const sign = match[1] === '+' ? 1 : -1;
  return { sign, normalizedLabel: offsetLabel };
}

export function buildUtcRelationSentence(placeAr, offsetLabel) {
  const { sign, normalizedLabel } = parseOffsetLabel(offsetLabel);

  if (sign === 0) {
    return `${placeAr} تعمل على توقيت غرينتش نفسه حالياً (${normalizedLabel}).`;
  }

  if (sign > 0) {
    return `${placeAr} تسبق توقيت غرينتش وفق الإزاحة الحالية ${normalizedLabel}.`;
  }

  return `${placeAr} تتأخر عن توقيت غرينتش وفق الإزاحة الحالية ${normalizedLabel}.`;
}

export function buildDstObservationSentence(placeAr, januaryOffset, julyOffset, fallbackOffsetLabel) {
  const jan = januaryOffset || fallbackOffsetLabel || 'GMT+0';
  const jul = julyOffset || fallbackOffsetLabel || 'GMT+0';

  if (jan && jul && jan !== jul) {
    return `${placeAr} لا تبقى على إزاحة واحدة طوال السنة؛ فعند مقارنة يناير بيوليو تتبدل الإزاحة بين ${jan} و${jul}.`;
  }

  return `${placeAr} لا يظهر لديها اختلاف بين إزاحة يناير (${jan}) ويوليو (${jul})، لذلك يبقى التوقيت ثابتاً خلال السنة في أغلب الحالات.`;
}

export function getTimeNowSeoFacts({ timezone, utcOffset, referenceDateOrIso, placeAr }) {
  const referenceDate = toReferenceDate(referenceDateOrIso);
  const offsetLabel = utcOffset || getOffsetLabelForTimezone(timezone, referenceDate) || 'GMT+0';
  const januaryOffset = getOffsetLabelForTimezone(
    timezone,
    new Date(Date.UTC(referenceDate.getUTCFullYear(), 0, 15, 12, 0, 0)),
  );
  const julyOffset = getOffsetLabelForTimezone(
    timezone,
    new Date(Date.UTC(referenceDate.getUTCFullYear(), 6, 15, 12, 0, 0)),
  );

  let gregorianDateAr = '';
  let hijriDateAr = '';

  try {
    gregorianDateAr = new Intl.DateTimeFormat('ar-u-nu-latn', {
      timeZone: timezone,
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(referenceDate);
  } catch {}

  try {
    hijriDateAr = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura-nu-latn', {
      timeZone: timezone,
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(referenceDate);
  } catch {}

  return {
    offsetLabel,
    januaryOffset,
    julyOffset,
    hasDst: Boolean(januaryOffset && julyOffset && januaryOffset !== julyOffset),
    gregorianDateAr,
    hijriDateAr,
    utcRelationSentence: buildUtcRelationSentence(placeAr, offsetLabel),
    dstObservationSentence: buildDstObservationSentence(placeAr, januaryOffset, julyOffset, offsetLabel),
  };
}

function sortCountriesByName(a, b) {
  return String(a.country_name_ar || a.country_name_en || a.country_slug).localeCompare(
    String(b.country_name_ar || b.country_name_en || b.country_slug),
    'ar',
  );
}

export function getCountriesSharingCurrentOffset(countries, {
  referenceTimezone,
  referenceDateOrIso,
  excludeCountrySlug,
  limit = 8,
} = {}) {
  if (!Array.isArray(countries) || !referenceTimezone) return [];

  const referenceDate = toReferenceDate(referenceDateOrIso);
  const referenceOffset = getOffsetLabelForTimezone(referenceTimezone, referenceDate);
  if (!referenceOffset) return [];

  return countries
    .filter((country) => country?.country_slug && country.country_slug !== excludeCountrySlug && country.timezone)
    .map((country) => ({
      country_slug: country.country_slug,
      country_name_ar: country.name_ar,
      country_name_en: country.name_en,
      country_code: country.country_code,
      offsetLabel: getOffsetLabelForTimezone(country.timezone, referenceDate),
    }))
    .filter((country) => country.offsetLabel && country.offsetLabel === referenceOffset)
    .sort(sortCountriesByName)
    .slice(0, limit);
}

// ── Call-time helpers (diaspora use case: calling a foreign city) ─────────────

const DIASPORA_COUNTRY_SLUGS = new Set([
  'united-states', 'france', 'germany', 'united-kingdom', 'spain',
  'italy', 'canada', 'australia', 'netherlands', 'belgium', 'sweden',
  'denmark', 'norway', 'switzerland', 'austria', 'portugal', 'finland',
]);

const ARAB_CALL_REFERENCES = [
  { nameAr: 'القاهرة', timezone: 'Africa/Cairo' },
  { nameAr: 'الرياض', timezone: 'Asia/Riyadh' },
  { nameAr: 'الدار البيضاء', timezone: 'Africa/Casablanca' },
];

function getUtcOffsetHours(timezone, referenceDate) {
  try {
    const label = new Intl.DateTimeFormat('en', {
      timeZone: timezone,
      timeZoneName: 'shortOffset',
    }).formatToParts(referenceDate).find((p) => p.type === 'timeZoneName')?.value ?? '';

    const m = /^GMT([+-])(\d{1,2})(?::(\d{2}))?$/.exec(label);
    if (!m) return 0;
    return (m[1] === '+' ? 1 : -1) * (parseInt(m[2], 10) + (m[3] ? parseInt(m[3], 10) / 60 : 0));
  } catch {
    return 0;
  }
}

function formatHourAr(h) {
  const norm = ((Math.round(h) % 24) + 24) % 24;
  const period = norm >= 12 ? 'م' : 'ص';
  const display = norm === 0 ? 12 : norm > 12 ? norm - 12 : norm;
  return `${display}${period}`;
}

// Returns: for each Arab reference city, the window to call targetTimezone during 9AM-5PM
export function buildCallTimeWindows(targetTimezone, referenceDateOrIso) {
  const now = toReferenceDate(referenceDateOrIso);
  const targetOffset = getUtcOffsetHours(targetTimezone, now);

  return ARAB_CALL_REFERENCES.map((ref) => {
    const refOffset = getUtcOffsetHours(ref.timezone, now);
    const diff = refOffset - targetOffset; // hours ref is ahead of target
    const refStart = 9 + diff;  // when target opens (9AM), what time is it in ref city?
    const refEnd = 17 + diff;   // when target closes (5PM)
    return {
      cityAr: ref.nameAr,
      diffHours: Math.round(diff),
      windowStart: formatHourAr(refStart),
      windowEnd: formatHourAr(refEnd),
    };
  });
}

export function buildCityTimeNowFaqItems({
  countryAr,
  countrySlug,
  cityAr,
  timezone,
  utcOffset,
  referenceDateOrIso,
}) {
  const facts = getTimeNowSeoFacts({
    timezone,
    utcOffset,
    referenceDateOrIso,
    placeAr: cityAr,
  });

  const dateSummary = facts.gregorianDateAr
    ? `التاريخ المحلي اليوم في ${cityAr} هو ${facts.gregorianDateAr}${facts.hijriDateAr ? `، وبالهجري ${facts.hijriDateAr}` : ''}.`
    : `نعرض في الصفحة التاريخ المحلي في ${cityAr} بالتقويمين الميلادي والهجري حسب المنطقة الزمنية ${timezone}.`;

  return [
    {
      q: `ما هو الوقت الان في ${cityAr}؟`,
      a: `نعرض في هذه الصفحة الوقت المحلي المباشر في ${cityAr}، ${countryAr} مع تحديث مستمر حسب المنطقة الزمنية ${timezone} والإزاحة الحالية ${facts.offsetLabel}.`,
    },
    {
      q: `ما هي المنطقة الزمنية في ${cityAr}؟`,
      a: `${cityAr} تتبع المنطقة الزمنية ${timezone}، و${facts.utcRelationSentence}`,
    },
    {
      q: `ما هو التاريخ اليوم في ${cityAr}؟`,
      a: dateSummary,
    },
    {
      q: `هل ${countryAr} تطبق التوقيت الصيفي؟`,
      a: facts.dstObservationSentence.replace(cityAr, countryAr),
    },
    {
      q: `كيف أقارن توقيت ${cityAr} بمدينة أخرى؟`,
      a: `بعد معرفة الوقت المحلي في ${cityAr} يمكنك الانتقال إلى أداة فرق التوقيت أو إلى صفحات المدن داخل ${countryAr} لمعرفة الفارق الفعلي قبل السفر أو الاجتماعات أو المتابعة اليومية.`,
    },
    // Diaspora-specific: best call time from Arab world
    ...buildDiasporaFaqItems(countrySlug, cityAr, timezone, referenceDateOrIso),
  ];
}

function buildDiasporaFaqItems(countrySlug, cityAr, timezone, referenceDateOrIso) {
  if (!countrySlug || !DIASPORA_COUNTRY_SLUGS.has(countrySlug)) return [];

  try {
    const windows = buildCallTimeWindows(timezone, referenceDateOrIso);
    if (!windows.length) return [];

    const cairoWin = windows[0];
    const riyadhWin = windows[1];
    const casaWin = windows[2];

    const windowSummary = [
      `${cairoWin.cityAr}: ${cairoWin.windowStart} – ${cairoWin.windowEnd}`,
      `${riyadhWin.cityAr}: ${riyadhWin.windowStart} – ${riyadhWin.windowEnd}`,
      `${casaWin.cityAr}: ${casaWin.windowStart} – ${casaWin.windowEnd}`,
    ].join('، ');

    const diffLabel = cairoWin.diffHours > 0
      ? `القاهرة تسبق ${cityAr} بـ${cairoWin.diffHours} ساعات`
      : `${cityAr} تسبق القاهرة بـ${Math.abs(cairoWin.diffHours)} ساعات`;

    return [
      {
        q: `متى يُناسب الاتصال بـ${cityAr} من مصر أو السعودية أو المغرب؟`,
        a: `لتقع مكالمتك في وقت الدوام بـ${cityAr} (9ص–5م توقيتها)، اتصل خلال هذه النوافذ: ${windowSummary}. ${diffLabel} حالياً. إذا كانت ${cityAr} تطبق التوقيت الصيفي فقد تتغير النافذة بساعة في مارس وأكتوبر/نوفمبر.`,
      },
    ];
  } catch {
    return [];
  }
}

export function buildCountryTimeNowFaqItems({
  countryAr,
  capitalAr,
  timezone,
  utcOffset,
  referenceDateOrIso,
  cityCount = 0,
}) {
  const facts = getTimeNowSeoFacts({
    timezone,
    utcOffset,
    referenceDateOrIso,
    placeAr: countryAr,
  });

  const dateSummary = facts.gregorianDateAr
    ? `التاريخ المحلي اليوم في ${countryAr} هو ${facts.gregorianDateAr}${facts.hijriDateAr ? `، وبالهجري ${facts.hijriDateAr}` : ''}.`
    : `نعرض في الصفحة التاريخ المحلي في ${countryAr} بالتقويمين الميلادي والهجري بحسب المنطقة الزمنية ${timezone}.`;

  const cityCoverageSummary = cityCount > 1
    ? `تجد في الصفحة أيضاً مسارات مباشرة إلى ${cityCount} من المدن المهمة داخل ${countryAr} حتى لا تضطر للبحث من الصفر كل مرة.`
    : `إذا كنت تتابع مدينة محددة داخل ${countryAr} فستجد من هذه الصفحة الطريق الأسرع إلى صفحة المدينة نفسها.`;

  return [
    {
      q: `ما هو الوقت الان في ${countryAr}؟`,
      a: `نعرض في هذه الصفحة الوقت المحلي الحالي في ${countryAr} مع اعتماد التوقيت الرسمي ${timezone} والإزاحة الحالية ${facts.offsetLabel}.`,
    },
    {
      q: `هل وقت كل مدن ${countryAr} واحد؟`,
      a: capitalAr
        ? `المرجع الرئيسي هنا هو توقيت ${capitalAr} بصفته المدينة الأبرز في ${countryAr}. ${cityCoverageSummary}`
        : cityCoverageSummary,
    },
    {
      q: `ما هي المنطقة الزمنية في ${countryAr}؟`,
      a: `${countryAr} تتبع المنطقة الزمنية ${timezone}، و${facts.utcRelationSentence}`,
    },
    {
      q: `ما هو التاريخ اليوم في ${countryAr}؟`,
      a: dateSummary,
    },
    {
      q: `هل ${countryAr} تطبق التوقيت الصيفي؟`,
      a: facts.dstObservationSentence,
    },
  ];
}
