/**
 * lib/holidays-engine.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Event definitions · 7 categories · dynamic year resolution · schema helpers
 *
 * KEY DESIGN: zero hardcoded years in titles/descriptions.
 * replaceYears() + resolveEventMeta() inject the actual target year at runtime
 * so pages always show "رمضان 2027" after 2026 passes, automatically.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const HIJRI_MONTHS_AR = [
  '', 'محرم', 'صفر', 'ربيع الأول', 'ربيع الآخر', 'جمادى الأولى', 'جمادى الآخرة',
  'رجب', 'شعبان', 'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة',
];
const GREG_MONTHS_AR = [
  '', 'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر',
];

/* ══════════════════════════════════════════════════════════════════════════
 * YEAR UTILITIES — the core of the dynamic year system
 * ══════════════════════════════════════════════════════════════════════════ */

/** Gregorian year from a Date or ISO string. */
export function getEventYear(d) {
  return (d instanceof Date ? d : new Date(d)).getFullYear();
}

/**
 * Approximate Hijri year for a given Gregorian year.
 * Formula: H ≈ floor((G − 622) × 365.25 / 354.37) + 1
 * Accurate to ±1 year, sufficient for display labels.
 */
export function approxHijriYear(gregorianYear) {
  return Math.floor((gregorianYear - 622) * 365.25 / 354.37) + 1;
}

/**
 * Replace Gregorian years (2025–2030) and Hijri years (1446–1455) in a string.
 * Leaves the string unchanged if it already contains the target year.
 */
export function replaceYears(str, gregorianYear, hijriYear) {
  if (!str) return str;
  let out = str;
  // Gregorian pass
  for (let y = 2024; y <= 2030; y++) {
    if (y !== gregorianYear)
      out = out.replace(new RegExp(`\\b${y}\\b`, 'g'), String(gregorianYear));
  }
  // Hijri pass
  if (hijriYear) {
    for (let h = 1445; h <= 1455; h++) {
      if (h !== hijriYear)
        out = out.replace(new RegExp(`\\b${h}\\b`, 'g'), String(hijriYear));
    }
  }
  return out;
}

/**
 * Generate fresh, year-accurate SEO meta for any event.
 * Call this at annotation time with the resolved target date.
 * Returns: { seoTitle, description, keywords, year, hijriYear }
 */
export function resolveEventMeta(ev, targetDate, overrideHijriYear = null) {
  const gr = getEventYear(targetDate);
  const hi = overrideHijriYear || approxHijriYear(gr);
  const greg = formatGregorianAr(targetDate);

  // Update stored rich strings — replaces old years with actual ones
  const seoTitle = replaceYears(ev.seoTitle || `متى ${ev.name} ${gr} — عد تنازلي دقيق`, gr, hi);
  const description = replaceYears(ev.description || `عد تنازلي دقيق لـ ${ev.name} — ${greg}.`, gr, hi);
  const keywords = (ev.keywords || [])
    .map(k => replaceYears(k, gr, hi))
    .concat([
      `${ev.name} ${gr}`,
      `متى ${ev.name} ${gr}`,
      `عد تنازلي ${ev.name}`,
    ])
    .filter((v, i, a) => a.indexOf(v) === i); // dedupe

  // Patch faqItems so FAQ schema + UI always show the correct year
  const faqItems = (ev.faqItems || []).map(({ q, a }) => ({
    q: replaceYears(q, gr, hi),
    a: replaceYears(a, gr, hi),
  }));

  return { seoTitle, description, keywords, faqItems, year: gr, hijriYear: hi };
}

/**
 * Build a dynamic historical-dates table for any event.
 * Shows 2 past years, current year (highlighted), 1 future year.
 */
export function buildHistoricalDates(ev, targetDate) {
  const gr = getEventYear(targetDate);
  const hi = approxHijriYear(gr);

  if (ev.type === 'hijri') {
    return [
      { gregorian: `${gr - 2}م`, hijri: `${hi - 2} هـ`, note: 'ماضي' },
      { gregorian: `${gr - 1}م`, hijri: `${hi - 1} هـ`, note: 'ماضي' },
      { gregorian: `${gr}م`, hijri: `${hi} هـ`, note: 'السنة الحالية', current: true },
      { gregorian: `${gr + 1}م`, hijri: `${hi + 1} هـ`, note: 'تقديري — يتقدم ~11 يوماً' },
    ];
  }
  // Fixed / estimated events
  return [
    { gregorian: `${gr - 2}م`, note: 'ماضي' },
    { gregorian: `${gr - 1}م`, note: 'ماضي' },
    { gregorian: `${gr}م`, note: 'السنة الحالية', current: true },
    { gregorian: `${gr + 1}م`, note: ev.type === 'estimated' ? 'تقديري' : 'ثابت' },
  ];
}

/* ══════════════════════════════════════════════════════════════════════════
 * CATEGORIES
 * ══════════════════════════════════════════════════════════════════════════ */
export const CATEGORIES = [
  { id: 'all', label: 'الكل', icon: '🗓', color: 'badge-default' },
  { id: 'islamic', label: 'المناسبات الإسلامية', icon: '🌙', color: 'badge-accent' },
  { id: 'national', label: 'الأعياد الوطنية', icon: '🏳', color: 'badge-info' },
  { id: 'school', label: 'المناسبات المدرسية', icon: '📚', color: 'badge-warning' },
  { id: 'holidays', label: 'الإجازات الرسمية', icon: '🏖', color: 'badge-success' },
  { id: 'astronomy', label: 'فلكية وطبيعية', icon: '🌍', color: 'badge-info' },
  { id: 'business', label: 'مناسبات الأعمال', icon: '💼', color: 'badge-default' },
];

/* ══════════════════════════════════════════════════════════════════════════
 * DATE HELPERS
 * ══════════════════════════════════════════════════════════════════════════ */

/** Enrich raw event object with defaults — no hardcoded years in defaults. */
export const enrichEvent = (raw) => {
  if (raw?.__enriched) return raw;
  const e = { ...raw, __enriched: true };
  if (!e.type) e.type = e.hijriMonth != null ? 'hijri' : e.date ? 'estimated' : 'fixed';
  if (e.type === 'hijri') {
    if (!('hijriMonth' in e) && 'month' in e) e.hijriMonth = e.month;
    if (!('hijriDay' in e) && 'day' in e) e.hijriDay = e.day;
  }
  ['hijriMonth', 'hijriDay', 'month', 'day'].forEach(k => { if (e[k] != null) e[k] = Number(e[k]); });
  if (!e.category) e.category = 'islamic';
  // NO hardcoded years in defaults — resolveEventMeta injects them at render time
  e.seoTitle ??= `متى ${e.name} — عد تنازلي دقيق بالأيام والساعات`;
  e.description ??= `عد تنازلي حي ودقيق لموعد ${e.name} بالأيام والساعات والدقائق والثواني.`;
  e.details ??= e.description;
  e.keywords ??= [
    `متى ${e.name}`, `موعد ${e.name}`,
    `كم باقي على ${e.name}`, `عد تنازلي ${e.name}`,
  ];
  e.faqItems ??= [
    { q: `متى موعد ${e.name}؟`, a: e.description },
    { q: `كم يوماً تبقى على ${e.name}؟`, a: 'تابع العد التنازلي الدقيق على هذه الصفحة.' },
    { q: `هل يتغير موعد ${e.name} كل عام؟`, a: e.type === 'hijri' ? 'نعم، يتقدم ~11 يوماً سنوياً في التقويم الهجري.' : `موعد ${e.name} ثابت كل عام.` },
  ];
  return e;
};

function nextFixed(m, d, now) {
  const n = new Date(now); n.setHours(0, 0, 0, 0);
  let t = new Date(n.getFullYear(), m - 1, d); t.setHours(0, 0, 0, 0);
  if (t < n) t = new Date(n.getFullYear() + 1, m - 1, d);
  return t;
}
function nextEstimated(iso, now) {
  const n = new Date(now); n.setHours(0, 0, 0, 0);
  const d = new Date(iso); d.setHours(0, 0, 0, 0);
  if (isNaN(d.getTime()) || d < n) d.setFullYear(d.getFullYear() + 1);
  return d;
}
function nextMonthly(day, now) {
  const n = new Date(now); n.setHours(0, 0, 0, 0);
  let d = new Date(n.getFullYear(), n.getMonth(), day); d.setHours(0, 0, 0, 0);
  if (d < n) d = new Date(n.getFullYear(), n.getMonth() + 1, day);
  if (d.getDate() !== day) d = new Date(d.getFullYear(), d.getMonth() + 1, 0);
  return d;
}
function easterSunday(yr) {
  const a = yr % 19, b = Math.floor(yr / 100), c = yr % 100, d = Math.floor(b / 4), e = b % 4;
  const f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451);
  const mo = Math.floor((h + l - 7 * m + 114) / 31), dy = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(yr, mo - 1, dy);
}
function nextEasterOffset(offset = 0, now) {
  const n = new Date(now); n.setHours(0, 0, 0, 0);
  let e = easterSunday(n.getFullYear());
  let t = new Date(e); t.setDate(t.getDate() + offset); t.setHours(0, 0, 0, 0);
  if (t < n) { e = easterSunday(n.getFullYear() + 1); t = new Date(e); t.setDate(t.getDate() + offset); }
  return t;
}
function roughHijri(hMonth, hDay, now) {
  const n = new Date(now);
  const EP = new Date('0622-07-19').getTime(), MSY = 354.37 * 86_400_000;
  let yr = Math.floor((n.getTime() - EP) / MSY);
  let t = new Date(EP + yr * MSY + (hMonth - 1) * 29.53 * 86_400_000 + (hDay - 1) * 86_400_000);

  // Guarantee a future date
  while (t <= n) {
    yr++;
    t = new Date(EP + yr * MSY + (hMonth - 1) * 29.53 * 86_400_000 + (hDay - 1) * 86_400_000);
  }
  return t;
}

export function getNextEventDate(rawEvent, resolvedMap = {}, nowMs = Date.now()) {
  const now = new Date(nowMs);
  const ev = enrichEvent(rawEvent);
  if (ev.type === 'hijri') {
    const r = resolvedMap[ev.slug];
    if (r?.isoString) { const d = new Date(r.isoString); d.setHours(0, 0, 0, 0); return d; }
    return roughHijri(ev.hijriMonth, ev.hijriDay, now);
  }
  if (ev.type === 'fixed') return nextFixed(ev.month, ev.day, now);
  if (ev.type === 'estimated') return nextEstimated(ev.date, now);
  if (ev.type === 'monthly') return nextMonthly(ev.day, now);
  if (ev.type === 'easter') return nextEasterOffset(ev.easterOffset || 0, now);
  return now;
}

export function getTimeRemaining(target, nowMs) {
  if (nowMs === undefined) nowMs = 0; // never called without nowMs in prerenderable pages
  const total = (target instanceof Date ? target.getTime() : new Date(target).getTime()) - nowMs;
  if (total <= 0) return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    total,
    days: Math.floor(total / 86_400_000),
    hours: Math.floor((total % 86_400_000) / 3_600_000),
    minutes: Math.floor((total % 3_600_000) / 60_000),
    seconds: Math.floor((total % 60_000) / 1_000),
  };
}

export function formatGregorianAr(date) {
  const d = date instanceof Date ? date : new Date(date);
  try { return new Intl.DateTimeFormat('ar-SA-u-nu-latn', { day: 'numeric', month: 'long', year: 'numeric' }).format(d); }
  catch { return `${d.getDate()} ${GREG_MONTHS_AR[d.getMonth() + 1]} ${d.getFullYear()}`; }
}
export function formatHijriDisplayAr(hd) {
  if (!hd?.day || !hd?.month || !hd?.year) return null;
  return `${hd.day} ${HIJRI_MONTHS_AR[hd.month] || ''} ${hd.year} هـ`;
}
export function getRelatedEvents(slug, all, n = 4) {
  const ev = all.find(e => e.slug === slug);
  if (!ev) return all.slice(0, n);
  const rest = all.filter(e => e.slug !== slug);
  const sameC = rest.filter(e => e._countryCode === ev._countryCode && e._countryCode);
  const sameCat = rest.filter(e => e.category === ev.category && !sameC.includes(e));
  return [...sameC, ...sameCat, ...rest.filter(e => !sameC.includes(e) && !sameCat.includes(e))].slice(0, n);
}

/* ══════════════════════════════════════════════════════════════════════════
 * SCHEMA HELPERS
 * ══════════════════════════════════════════════════════════════════════════ */
const COUNTRY_NAMES = {
  sa: 'المملكة العربية السعودية', eg: 'مصر', ma: 'المغرب', dz: 'الجزائر',
  ae: 'الإمارات العربية المتحدة', tn: 'تونس', kw: 'الكويت', qa: 'قطر',
};


export function buildEventSchema(ev, date, siteUrl) {
  const d = date instanceof Date ? date : new Date(date);
  const end = new Date(d.getTime() + 86_400_000);
  // OG image URL — used by Google for Event rich card thumbnail
  const imgBase = `${siteUrl}/holidays/${ev.slug}/opengraph-image`;
  return {
    '@context': 'https://schema.org', '@type': 'Event',
    name: ev.seoTitle || ev.name,
    description: ev.description,
    startDate: d.toISOString().split('T')[0],
    endDate: end.toISOString().split('T')[0],
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    isAccessibleForFree: true,
    inLanguage: 'ar',
    url: `${siteUrl}/holidays/${ev.slug}`,
    // Three aspect ratios — Google picks the best fit for its carousel
    image: [
      `${imgBase}?w=1200&h=1200`,
      `${imgBase}?w=1200&h=900`,
      `${imgBase}?w=1200&h=675`,
    ],
    location: {
      '@type': 'Place',
      name: ev._countryCode ? (COUNTRY_NAMES[ev._countryCode] || 'العالم الإسلامي') : 'العالم الإسلامي',
      address: { '@type': 'PostalAddress', addressCountry: (ev._countryCode || 'SA').toUpperCase() },
    },
    organizer: {
      '@type': 'Organization',
      name: 'وقت — عداد المواعيد',
      url: siteUrl,
      logo: `${siteUrl}/logo.png`,
    },
    audience: { '@type': 'Audience', audienceType: 'Muslims', geographicArea: { '@type': 'AdministrativeArea', name: 'MENA' } },
  };
}

/** WebPage schema — critical for E-E-A-T freshness signal (dateModified). */
export function buildWebPageSchema(ev, date, siteUrl, nowIso) {
  const d = date instanceof Date ? date : new Date(date);
  return {
    '@context': 'https://schema.org', '@type': 'WebPage',
    name: ev.seoTitle || ev.name,
    description: ev.description,
    url: `${siteUrl}/holidays/${ev.slug}`,
    inLanguage: 'ar',
    dateModified: nowIso || '2026-01-01T00:00:00Z',
    datePublished: '2025-01-01T00:00:00Z',
    isPartOf: { '@type': 'WebSite', url: siteUrl, name: 'وقت — عداد المواعيد' },
    about: { '@type': 'Event', name: ev.name, startDate: d.toISOString() },
    author: { '@type': 'Organization', name: 'وقت — عداد المواعيد', url: siteUrl },
  };
}
export function buildFAQSchema(ev) {
  if (!ev.faqItems?.length) return null;
  return {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: ev.faqItems.map(({ q, a }) => ({
      '@type': 'Question', name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };
}
export function buildBreadcrumbSchema(crumbs) {
  return {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: c.url })),
  };
}

/* ══════════════════════════════════════════════════════════════════════════
 * EVENT DATA
 * Titles/descriptions contain example years as editorial context, but
 * replaceYears() will update them to the actual resolved year at render time.
 * ══════════════════════════════════════════════════════════════════════════ */

export const RELIGIOUS_HOLIDAYS = [
  {
    id: 'ramadan', slug: 'ramadan', name: 'رمضان', type: 'hijri', hijriMonth: 9, hijriDay: 1, category: 'islamic',
    seoTitle: 'متى رمضان 2026 / 1447 — عد تنازلي دقيق لشهر رمضان المبارك',
    description: 'عد تنازلي حي لبداية شهر رمضان 1447. يبدأ رمضان 2026م في 18 فبراير وفق تقويم أم القرى.',
    details: 'رمضان الشهر التاسع في التقويم الهجري، يصوم فيه المسلمون من طلوع الفجر حتى المغرب. نزل فيه القرآن الكريم، تُفتح فيه أبواب الجنة، وتُغلق أبواب النار.',
    history: 'فُرض الصيام في السنة الثانية للهجرة. شهدت فيه غزوة بدر الكبرى 2 هـ / 624م.',
    significance: 'آخر عشر لياليه تتضمن ليلة القدر الخيرة من ألف شهر. تُغفر فيه الذنوب ويتضاعف الأجر.',
    quickFacts: [
      { label: 'التاريخ الهجري', value: '1 رمضان 1447 هـ' },
      { label: 'التاريخ الميلادي', value: '18 فبراير 2026م' },
      { label: 'المدة', value: '29–30 يوماً' },
      { label: 'إجازة رسمية', value: 'نعم (في معظم الدول)' },
      { label: 'طريقة الحساب', value: 'أم القرى + رؤية هلال' },
    ],
    countryDates: [
      { country: 'السعودية', flag: '🇸🇦', code: 'sa', date: '18 فبراير 2026', note: 'أم القرى' },
      { country: 'مصر', flag: '🇪🇬', code: 'eg', date: '18–19 فبراير 2026', note: 'دار الإفتاء' },
      { country: 'المغرب', flag: '🇲🇦', code: 'ma', date: '18–19 فبراير 2026', note: 'رؤية محلية' },
      { country: 'الجزائر', flag: '🇩🇿', code: 'dz', date: '18–19 فبراير 2026', note: 'رؤية محلية' },
      { country: 'الإمارات', flag: '🇦🇪', code: 'ae', date: '18–19 فبراير 2026', note: 'أم القرى' },
      { country: 'تونس', flag: '🇹🇳', code: 'tn', date: '18–19 فبراير 2026', note: 'رؤية محلية' },
      { country: 'الكويت', flag: '🇰🇼', code: 'kw', date: '18–19 فبراير 2026', note: 'أم القرى' },
      { country: 'قطر', flag: '🇶🇦', code: 'qa', date: '18–19 فبراير 2026', note: 'أم القرى' },
    ],
    keywords: [
      'متى رمضان 2026', 'كم باقي على رمضان 2026', 'موعد رمضان 1447',
      'عد تنازلي رمضان', 'بداية رمضان 2026', 'رمضان 2026 موعد',
      'متى رمضان المغرب 2026', 'متى رمضان مصر 2026', 'متى رمضان السعودية 2026',
      'متى رمضان الجزائر 2026', 'متى رمضان الإمارات 2026', 'متى رمضان تونس 2026',
      'متى رمضان الكويت 2026', 'متى رمضان قطر 2026',
      'كم يوم تبقى على رمضان', 'أول رمضان 2026', 'موعد أذان المغرب رمضان 2026',
      'جدول رمضان 2026', 'رمضان 1447 موعد بداية', 'ساعات الصيام رمضان 2026',
      'متى يبدأ رمضان المبارك 2026', 'عداد رمضان 2026',
    ],
    faqItems: [
      { q: 'متى يبدأ رمضان 2026؟', a: 'يبدأ رمضان 1447 في 18 فبراير 2026 وفق أم القرى. قد يختلف بيوم في الدول ذات رؤية الهلال المحلية.' },
      { q: 'كم يوم رمضان 2026؟', a: 'شهر رمضان إما 29 أو 30 يوماً بحسب رؤية هلال شوال.' },
      { q: 'متى ليلة القدر في رمضان 2026؟', a: 'أرجح لياليها ليلة 27 رمضان الموافقة تقريباً 17 مارس 2026.' },
      { q: 'هل يتغير موعد رمضان كل عام؟', a: 'نعم، يتقدم ~11 يوماً سنوياً لأن التقويم الهجري قمري خالص.' },
      { q: 'هل رمضان 2026 في الشتاء أم الربيع؟', a: 'يقع في فبراير 2026 — أواخر الشتاء وبداية الربيع في معظم الدول العربية.' },
      { q: 'كم عدد ساعات الصيام في رمضان 2026؟', a: 'تتراوح بين 12–14 ساعة في الدول العربية خلال فبراير.' },
      { q: 'هل يختلف موعد رمضان بين المغرب والسعودية؟', a: 'نعم، المغرب يعتمد رؤية الهلال المحلية وقد يختلف بيوم كامل.' },
      { q: 'متى أول يوم رمضان 2026 في مصر؟', a: '18 أو 19 فبراير 2026 بحسب رؤية دار الإفتاء المصرية.' },
    ],
  },
  {
    id: 'eid-al-fitr', slug: 'eid-al-fitr', name: 'عيد الفطر المبارك', type: 'hijri', hijriMonth: 10, hijriDay: 1, category: 'islamic',
    seoTitle: 'متى عيد الفطر 2026 / 1447 — عد تنازلي دقيق',
    description: 'عيد الفطر المبارك 1 شوال 1447 الموافق 20 مارس 2026م.',
    details: 'عيد الفطر هو أول أيام شوال، يحتفل فيه المسلمون بانقضاء رمضان المبارك بصلاة العيد وإخراج زكاة الفطر والتزاور.',
    history: 'شُرع عيد الفطر في السنة الأولى بعد الهجرة.',
    significance: 'يُخرج فيه المسلمون زكاة الفطر طهرةً للصائم وإغناءً للفقراء.',
    quickFacts: [
      { label: 'التاريخ الهجري', value: '1 شوال 1447 هـ' },
      { label: 'التاريخ الميلادي', value: '20 مارس 2026م' },
      { label: 'المدة', value: '3–10 أيام حسب الدولة' },
      { label: 'إجازة رسمية', value: 'نعم' },
    ],
    countryDates: [
      { country: 'السعودية', flag: '🇸🇦', code: 'sa', date: '20 مارس 2026', note: 'أم القرى' },
      { country: 'مصر', flag: '🇪🇬', code: 'eg', date: '20–21 مارس 2026', note: 'دار الإفتاء' },
      { country: 'المغرب', flag: '🇲🇦', code: 'ma', date: '20–21 مارس 2026', note: 'رؤية محلية' },
      { country: 'الإمارات', flag: '🇦🇪', code: 'ae', date: '20–21 مارس 2026', note: 'أم القرى' },
    ],
    keywords: [
      'متى عيد الفطر 2026', 'موعد عيد الفطر 1447', 'كم باقي على عيد الفطر 2026',
      'عيد الفطر 2026 السعودية', 'عيد الفطر 2026 مصر', 'عيد الفطر 2026 المغرب',
      'صلاة عيد الفطر 2026', 'زكاة الفطر 2026', 'عيد الفطر 2026 الجزائر',
      'إجازة عيد الفطر 2026', 'كم باقي على العيد', 'عد تنازلي عيد الفطر',
      'متى أول يوم عيد 2026', 'تهنئة عيد الفطر 2026',
    ],
    faqItems: [
      { q: 'متى عيد الفطر 2026؟', a: '20 مارس 2026 وفق أم القرى — قد يختلف بيوم في دول الرؤية المحلية.' },
      { q: 'كم يوم إجازة عيد الفطر 2026؟', a: 'بين 3 و10 أيام حسب الدولة والقطاع.' },
      { q: 'متى تُخرج زكاة الفطر؟', a: 'قبل صلاة عيد الفطر. يجوز إخراجها قبل يوم أو يومين.' },
      { q: 'متى صلاة عيد الفطر 2026؟', a: 'بعد شروق الشمس بنحو 15–20 دقيقة صباح يوم العيد.' },
    ],
  },
  {
    id: 'eid-al-adha', slug: 'eid-al-adha', name: 'عيد الأضحى المبارك', type: 'hijri', hijriMonth: 12, hijriDay: 10, category: 'islamic',
    seoTitle: 'متى عيد الأضحى 2026 / 1447 — عد تنازلي دقيق',
    description: 'عيد الأضحى 10 ذو الحجة 1447 الموافق 27 مايو 2026م.',
    details: 'يُحيي فيه المسلمون ذكرى استعداد سيدنا إبراهيم ﷺ للذبح. يتزامن مع موسم الحج ويذبح فيه المقتدرون الأضاحي.',
    history: 'شُرع في السنة الثانية للهجرة. يُقام صباح العاشر من ذي الحجة عقب يوم عرفة.',
    significance: 'تزامنه مع الحج يجعله أعظم العيدين. أيامه "أيام التشريق" أيام أكل وشرب وذكر.',
    quickFacts: [
      { label: 'التاريخ الهجري', value: '10 ذو الحجة 1447 هـ' },
      { label: 'التاريخ الميلادي', value: '27 مايو 2026م' },
      { label: 'المدة', value: '4–9 أيام حسب الدولة' },
      { label: 'إجازة رسمية', value: 'نعم' },
    ],
    countryDates: [
      { country: 'السعودية', flag: '🇸🇦', code: 'sa', date: '27 مايو 2026', note: 'أم القرى' },
      { country: 'مصر', flag: '🇪🇬', code: 'eg', date: '27–28 مايو 2026', note: 'دار الإفتاء' },
      { country: 'المغرب', flag: '🇲🇦', code: 'ma', date: '27–28 مايو 2026', note: 'رؤية محلية' },
      { country: 'الإمارات', flag: '🇦🇪', code: 'ae', date: '27–28 مايو 2026', note: 'أم القرى' },
    ],
    keywords: [
      'متى عيد الأضحى 2026', 'موعد عيد الأضحى 1447', 'كم باقي على عيد الأضحى 2026',
      'عيد الأضحى 2026 السعودية', 'عيد الأضحى 2026 مصر', 'موعد الأضحى المغرب 2026',
      'يوم عرفة 2026', 'إجازة عيد الأضحى 2026', 'الأضحية 2026',
      'عد تنازلي عيد الأضحى', 'عيد الأضحى المبارك 2026', 'تكبيرات عيد الأضحى',
      'عيد الأضحى الجزائر 2026', 'ذبيحة العيد 2026', 'الحج 2026',
    ],
    faqItems: [
      { q: 'متى عيد الأضحى 2026؟', a: '27 مايو 2026 وفق أم القرى.' },
      { q: 'متى يوم عرفة 2026؟', a: '26 مايو 2026 — اليوم التاسع من ذي الحجة.' },
      { q: 'كم يوم إجازة عيد الأضحى 2026؟', a: 'بين 4 و9 أيام حسب الدولة.' },
      { q: 'هل يوم الأضحى نفسه في كل الدول العربية؟', a: 'لا، قد يختلف بيوم في الدول التي تعتمد رؤية الهلال المحلية.' },
    ],
  },
  {
    id: 'day-of-arafa', slug: 'day-of-arafa', name: 'يوم عرفة', type: 'hijri', hijriMonth: 12, hijriDay: 9, category: 'islamic',
    seoTitle: 'متى يوم عرفة 2026 / 1447 — عد تنازلي دقيق',
    description: 'يوم عرفة 9 ذو الحجة 1447 الموافق 26 مايو 2026م — أفضل أيام العام وصيامه يكفّر ذنوب سنتين.',
    details: 'يقف فيه الحجاج على جبل عرفة. لغير الحاج يُستحب الصيام.',
    keywords: [
      'متى يوم عرفة 2026', 'صيام يوم عرفة 2026', 'يوم عرفة 1447',
      'فضل صيام يوم عرفة', '26 مايو 2026',
    ],
    faqItems: [
      { q: 'متى يوم عرفة 2026؟', a: '26 مايو 2026 — اليوم التاسع من ذي الحجة 1447.' },
      { q: 'هل يجوز الصيام يوم عرفة؟', a: 'يُستحب لغير الحاج — يكفّر ذنوب السنة الماضية والقادمة.' },
      { q: 'لماذا سُمي يوم عرفة؟', a: 'لأن الحجاج يقفون فيه على جبل عرفة خارج مكة.' },
    ],
  },
  {
    id: 'hajj-start', slug: 'hajj-season', name: 'بداية موسم الحج', type: 'hijri', hijriMonth: 12, hijriDay: 8, category: 'islamic',
    seoTitle: 'موعد الحج 2026 / 1447 — كم باقي على موسم الحج؟',
    description: 'موسم الحج 1447 — يبدأ يوم 8 ذو الحجة الموافق 25 مايو 2026م.',
    details: 'الحج الركن الخامس من أركان الإسلام، فُرض السنة التاسعة للهجرة. يجمع ملايين المسلمين في مكة المكرمة.',
    keywords: [
      'موعد الحج 2026', 'كم باقي على الحج 2026', 'بداية الحج 1447',
      'مناسك الحج 2026', 'إجازة الحج 2026', 'موسم الحج 2026',
    ],
    faqItems: [
      { q: 'متى موسم الحج 2026؟', a: 'يبدأ يوم 8 ذو الحجة 1447 الموافق 25 مايو 2026.' },
      { q: 'كم عدد الحجاج؟', a: 'يتجاوز مليوني حاج من مختلف دول العالم.' },
      { q: 'متى إجازة الحج في السعودية 2026؟', a: 'تمتد حوالي 4 أيام تزامناً مع أيام التشريق.' },
    ],
  },
  {
    id: 'islamic-new-year', slug: 'islamic-new-year', name: 'رأس السنة الهجرية', type: 'hijri', hijriMonth: 1, hijriDay: 1, category: 'islamic',
    seoTitle: 'متى رأس السنة الهجرية 1448 — عد تنازلي',
    description: '1 محرم 1448 هـ الموافق 16 يونيو 2026م — بداية العام الهجري الجديد.',
    details: 'يبدأ العام الهجري بأول محرم. التقويم قمري خالص — 354 يوماً — يتقدم ~11 يوماً سنوياً في التقويم الميلادي.',
    history: 'أسّسه عمر بن الخطاب ﵁ عام 638م جاعلاً الهجرة النبوية نقطة بداية التأريخ الإسلامي.',
    keywords: [
      'رأس السنة الهجرية 1448', 'السنة الهجرية 2026', 'متى 1448 هجري',
      'أول محرم 2026', 'رأس السنة الهجرية 2026',
    ],
    faqItems: [
      { q: 'متى رأس السنة الهجرية 1448؟', a: '16 يونيو 2026م.' },
      { q: 'كم عدد أيام السنة الهجرية؟', a: '354 أو 355 يوماً — 11 يوماً أقصر من السنة الشمسية.' },
      { q: 'لماذا يتغير موعد السنة الهجرية كل عام؟', a: 'لأن التقويم الهجري قمري يعتمد على دورة القمر، لا الشمس.' },
    ],
  },
  {
    id: 'ashura', slug: 'ashura', name: 'يوم عاشوراء', type: 'hijri', hijriMonth: 1, hijriDay: 10, category: 'islamic',
    seoTitle: 'موعد عاشوراء 1448 / 2026 — عد تنازلي',
    description: 'يوم عاشوراء 10 محرم 1448 — 25 يونيو 2026م — صيامه يكفّر ذنوب السنة الماضية.',
    details: 'صامه النبي ﷺ شكراً لله على نجاة سيدنا موسى من فرعون. يُستحب صيام يوم قبله أو بعده.',
    keywords: [
      'متى عاشوراء 2026', 'صيام عاشوراء 2026', 'يوم عاشوراء 1448',
      'فضل عاشوراء', '10 محرم 2026',
    ],
    faqItems: [
      { q: 'متى عاشوراء 2026؟', a: '25 يونيو 2026م — 10 محرم 1448 هـ.' },
      { q: 'حكم صيام عاشوراء؟', a: 'سنة مؤكدة — يكفّر ذنوب السنة الماضية.' },
      { q: 'هل يصام يوم واحد أم يومان؟', a: 'يُستحب صيام يوم عاشوراء مع يوم قبله (تاسوعاء) مخالفةً لليهود.' },
    ],
  },
  {
    id: 'mawlid', slug: 'mawlid', name: 'المولد النبوي الشريف', type: 'hijri', hijriMonth: 3, hijriDay: 12, category: 'islamic',
    seoTitle: 'موعد المولد النبوي 1448 / 2026 — عد تنازلي',
    description: '12 ربيع الأول 1448 هـ — 24 أغسطس 2026م — ذكرى مولد النبي ﷺ.',
    details: 'ذكرى مولد النبي محمد ﷺ في مكة المكرمة عام 570م. يحتفل فيه كثير من المسلمين بالصلاة على النبي وقراءة سيرته وإقامة مجالس الذكر.',
    keywords: [
      'موعد المولد النبوي 2026', 'المولد النبوي 1448', 'متى المولد النبوي 2026',
      'ذكرى المولد النبوي', '12 ربيع الأول 2026',
    ],
    faqItems: [
      { q: 'متى المولد النبوي 2026؟', a: '24 أغسطس 2026م — 12 ربيع الأول 1448 هـ.' },
      { q: 'هل المولد إجازة رسمية؟', a: 'نعم في معظم الدول العربية — السعودية لا تعتبره إجازة رسمية.' },
    ],
  },
  {
    id: 'laylat-al-qadr', slug: 'laylat-al-qadr', name: 'ليلة القدر', type: 'hijri', hijriMonth: 9, hijriDay: 27, category: 'islamic',
    seoTitle: 'موعد ليلة القدر 2026 / 1447 — 27 رمضان',
    description: '27 رمضان 1447 — خير من ألف شهر — الموافقة تقريباً 17 مارس 2026م.',
    details: 'قال تعالى: "لَيْلَةُ الْقَدْرِ خَيْرٌ مِنْ أَلْفِ شَهْرٍ." نزل فيها القرآن. العبادة فيها تعادل 83 سنة كاملة.',
    keywords: [
      'ليلة القدر 2026', 'متى ليلة القدر رمضان 2026', '27 رمضان 2026',
      'ليلة القدر 1447', 'فضل ليلة القدر',
    ],
    faqItems: [
      { q: 'متى ليلة القدر 2026؟', a: 'أرجحها ليلة 27 رمضان الموافقة تقريباً 17 مارس 2026.' },
      { q: 'في أي ليالي رمضان تكون ليلة القدر؟', a: 'في الأوتار من آخر عشر ليالٍ — أرجحها ليلة 27.' },
      { q: 'ما فضل ليلة القدر؟', a: 'خير من ألف شهر — نزل فيها القرآن، وتنزل فيها الملائكة.' },
    ],
  },
  {
    id: 'isra-miraj', slug: 'isra-miraj', name: 'ليلة الإسراء والمعراج', type: 'hijri', hijriMonth: 7, hijriDay: 27, category: 'islamic',
    seoTitle: 'موعد الإسراء والمعراج 2026 / 1447 — 27 رجب',
    description: '27 رجب 1447 — ذكرى رحلة الإسراء والمعراج الكريمة.',
    details: 'أُسري بالنبي ﷺ من المسجد الحرام إلى الأقصى، ثم عُرج به إلى السماوات. فُرضت فيها الصلوات الخمس.',
    keywords: ['الإسراء والمعراج 2026', 'موعد الإسراء والمعراج', '27 رجب 2026', '1447 إسراء'],
    faqItems: [
      { q: 'متى الإسراء والمعراج 2026؟', a: 'يُحسب تلقائياً من 27 رجب 1447.' },
      { q: 'هل الإسراء والمعراج إجازة رسمية؟', a: 'نعم في كثير من الدول العربية.' },
    ],
  },
  {
    id: 'nisf-shaban', slug: 'nisf-shaban', name: 'ليلة النصف من شعبان', type: 'hijri', hijriMonth: 8, hijriDay: 15, category: 'islamic',
    seoTitle: 'موعد ليلة النصف من شعبان 2026 / 1447',
    description: '15 شعبان 1447 — ليلة البراءة المباركة.',
    details: 'تُعظَّم هذه الليلة في كثير من الدول العربية، خاصةً مصر والمغرب ولبنان. يصومها كثير من المسلمين.',
    keywords: ['ليلة النصف من شعبان 2026', '15 شعبان 1447', 'ليلة البراءة 2026'],
    faqItems: [{ q: 'متى النصف من شعبان 2026؟', a: 'يُحسب تلقائياً من 15 شعبان 1447.' }],
  },
  {
    id: 'first-dhul-hijjah', slug: 'first-dhul-hijjah', name: 'أول ذو الحجة', type: 'hijri', hijriMonth: 12, hijriDay: 1, category: 'islamic',
    seoTitle: 'متى أول ذو الحجة 2026 / 1447 — بداية أيام الحج',
    description: 'أول ذو الحجة 1447 — بداية أفضل أيام السنة العشر.',
    details: 'قال ﷺ: "ما من أيام العمل الصالح فيها أحب إلى الله من هذه الأيام العشر." يبدأ فيها موسم الحج.',
    keywords: ['أول ذو الحجة 2026', 'العشر من ذي الحجة 2026', 'بداية ذو الحجة 1447'],
    faqItems: [{ q: 'متى أول ذو الحجة 2026؟', a: 'يُحسب تلقائياً من AlAdhan API.' }],
  },
];

export const SEASONAL_EVENTS = [
  {
    id: 'new-year', slug: 'new-year', name: 'رأس السنة الميلادية', type: 'fixed', month: 1, day: 1, category: 'holidays',
    seoTitle: 'كم باقي على رأس السنة الميلادية 2027 — عد تنازلي',
    description: 'بداية العام الميلادي الجديد 1 يناير 2027م.',
    keywords: ['كم باقي على 2027', 'عد تنازلي رأس السنة', '1 يناير 2027', 'رأس السنة 2027'],
    faqItems: [{ q: 'متى رأس السنة 2027؟', a: '1 يناير 2027.' }],
  },
  {
    id: 'summer', slug: 'summer-season', name: 'بداية فصل الصيف', type: 'fixed', month: 6, day: 21, category: 'astronomy',
    seoTitle: 'موعد بداية فصل الصيف 2026 — الانقلاب الصيفي',
    description: 'الانقلاب الصيفي 21 يونيو — بداية الصيف فلكياً.',
    keywords: ['بداية الصيف 2026', 'موعد الصيف فلكياً', 'الانقلاب الصيفي 2026'],
    faqItems: [{ q: 'متى يبدأ الصيف 2026؟', a: '21 يونيو 2026.' }],
  },
  {
    id: 'winter', slug: 'winter-season', name: 'بداية فصل الشتاء', type: 'fixed', month: 12, day: 21, category: 'astronomy',
    seoTitle: 'موعد بداية فصل الشتاء 2026 — الانقلاب الشتوي',
    description: 'الانقلاب الشتوي 21 ديسمبر — بداية الشتاء فلكياً.',
    keywords: ['بداية الشتاء 2026', 'الانقلاب الشتوي 2026', 'موعد الشتاء فلكياً'],
    faqItems: [{ q: 'متى يبدأ الشتاء 2026؟', a: '21 ديسمبر 2026.' }],
  },
  {
    id: 'spring', slug: 'spring-season', name: 'بداية فصل الربيع', type: 'fixed', month: 3, day: 20, category: 'astronomy',
    seoTitle: 'موعد بداية فصل الربيع 2026 — الاعتدال الربيعي',
    description: 'الاعتدال الربيعي 20 مارس — بداية الربيع فلكياً.',
    keywords: ['بداية الربيع 2026', 'الاعتدال الربيعي 2026'],
    faqItems: [{ q: 'متى يبدأ الربيع 2026؟', a: '20 مارس 2026.' }],
  },
  {
    id: 'autumn', slug: 'autumn-season', name: 'بداية فصل الخريف', type: 'fixed', month: 9, day: 22, category: 'astronomy',
    seoTitle: 'موعد بداية فصل الخريف 2026 — الاعتدال الخريفي',
    description: 'الاعتدال الخريفي 22 سبتمبر — بداية الخريف فلكياً.',
    keywords: ['بداية الخريف 2026', 'الاعتدال الخريفي 2026'],
    faqItems: [{ q: 'متى يبدأ الخريف 2026؟', a: '22 سبتمبر 2026.' }],
  },
  {
    id: 'spring-vac', slug: 'spring-vacation', name: 'عطلة الربيع المدرسية', type: 'estimated', date: '2026-03-29', category: 'school',
    seoTitle: 'موعد عطلة الربيع المدرسية 2026',
    description: 'إجازة الربيع المدرسية — تاريخ تقديري قد يتغير بقرار رسمي.',
    keywords: ['عطلة الربيع 2026', 'إجازة الربيع المدرسية 2026'],
    faqItems: [{ q: 'متى عطلة الربيع 2026؟', a: '~29 مارس 2026. قد يتغير بقرار رسمي.' }],
  },
  {
    id: 'summer-vac', slug: 'summer-vacation', name: 'بداية الإجازة الصيفية', type: 'estimated', date: '2026-06-11', category: 'school',
    seoTitle: 'متى الإجازة الصيفية 2026 — بداية إجازة الصيف',
    description: 'بداية الإجازة الصيفية للعام الدراسي 2025–2026.',
    keywords: ['الإجازة الصيفية 2026', 'بداية الإجازة الصيفية 2026', 'عطلة الصيف 2026'],
    faqItems: [{ q: 'متى الإجازة الصيفية 2026؟', a: '~يونيو 2026. التواريخ تقديرية حسب الدولة.' }],
  },
  {
    id: 'back-to-school', slug: 'back-to-school', name: 'الدخول المدرسي', type: 'estimated', date: '2026-09-20', category: 'school',
    seoTitle: 'موعد الدخول المدرسي 2026 — بداية الدراسة',
    description: 'الدخول المدرسي التقديري للعام الدراسي 2026–2027.',
    keywords: ['الدخول المدرسي 2026', 'بداية الدراسة 2026', 'موعد الدراسة 2026'],
    faqItems: [{ q: 'متى يبدأ الدراسة 2026؟', a: '~سبتمبر 2026. يتفاوت بحسب كل دولة.' }],
  },
];

export const COUNTRIES_EVENTS = [
  {
    name: 'السعودية', flag: '🇸🇦', code: 'sa',
    calendarNote: 'تقويم أم القرى الرسمي — حساب فلكي دقيق.',
    events: [
      {
        id: 'national-day-sa', slug: 'saudi-national-day', name: 'اليوم الوطني السعودي', type: 'fixed', month: 9, day: 23, category: 'national',
        seoTitle: 'اليوم الوطني السعودي 2026 — 23 سبتمبر — عد تنازلي',
        description: 'اليوم الوطني للمملكة 23 سبتمبر — ذكرى توحيد المملكة 1932م.',
        details: 'يُحتفل فيه بتوحيد المملكة على يد الملك عبدالعزيز بن سعود. إجازة رسمية مع احتفالات وطنية في جميع أنحاء المملكة.',
        keywords: ['اليوم الوطني السعودي 2026', '23 سبتمبر 2026', 'اليوم الوطني 1444'],
        faqItems: [{ q: 'متى اليوم الوطني السعودي 2026؟', a: '23 سبتمبر 2026.' }]
      },
      {
        id: 'founding-day-sa', slug: 'saudi-founding-day', name: 'يوم التأسيس السعودي', type: 'fixed', month: 2, day: 22, category: 'national',
        seoTitle: 'يوم التأسيس السعودي 2026 — 22 فبراير — عد تنازلي',
        description: 'يوم التأسيس 22 فبراير — يُحتفل بتأسيس الدولة السعودية الأولى 1727م.',
        keywords: ['يوم التأسيس السعودي 2026', '22 فبراير السعودية', 'يوم التأسيس 1444'],
        faqItems: [{ q: 'متى يوم التأسيس السعودي 2026؟', a: '22 فبراير 2026.' }]
      },
      {
        id: 'school-start-sa', slug: 'school-start-saudi', name: 'بداية الدراسة في السعودية', type: 'fixed', month: 8, day: 30, category: 'school',
        seoTitle: 'موعد بداية الدراسة في السعودية 2026 — 30 أغسطس',
        description: 'انطلاق العام الدراسي 2026–2027 في المملكة العربية السعودية.',
        keywords: ['بداية الدراسة السعودية 2026', 'الدخول المدرسي السعودية 2026', 'موعد الدراسة السعودية'],
        faqItems: [{ q: 'متى بداية الدراسة السعودية 2026؟', a: '30 أغسطس 2026.' }]
      },
      {
        id: 'salary-sa', slug: 'salary-day-saudi', name: 'صرف الرواتب الحكومية (السعودية)', type: 'monthly', day: 27, category: 'business',
        seoTitle: 'كم باقي على صرف الراتب في السعودية؟',
        description: 'تُصرف رواتب موظفي الحكومة السعودية يوم 27 من كل شهر.',
        keywords: ['صرف الراتب السعودية', 'موعد الراتب 27', 'متى يصرف الراتب السعودية'],
        faqItems: [{ q: 'متى يصرف الراتب في السعودية؟', a: 'اليوم السابع والعشرون من كل شهر — يُقدَّم في رمضان.' }]
      },
      { id: 'ramadan-sa', slug: 'ramadan-in-saudi', name: 'رمضان في السعودية', type: 'hijri', hijriMonth: 9, hijriDay: 1, category: 'islamic', seoTitle: 'متى رمضان 2026 في السعودية — أم القرى', description: 'رمضان 1447 في السعودية — 18 فبراير 2026 وفق تقويم أم القرى.', keywords: ['رمضان السعودية 2026', 'متى رمضان السعودية 2026'] },
      { id: 'eid-fitr-sa', slug: 'eid-al-fitr-in-saudi', name: 'عيد الفطر في السعودية', type: 'hijri', hijriMonth: 10, hijriDay: 1, category: 'islamic', seoTitle: 'موعد عيد الفطر 2026 في السعودية', description: 'عيد الفطر 1 شوال 1447 — 20 مارس 2026.', keywords: ['عيد الفطر السعودية 2026'] },
      { id: 'eid-adha-sa', slug: 'eid-al-adha-in-saudi', name: 'عيد الأضحى في السعودية', type: 'hijri', hijriMonth: 12, hijriDay: 10, category: 'islamic', seoTitle: 'موعد عيد الأضحى 2026 في السعودية', description: 'عيد الأضحى 10 ذو الحجة 1447 — 27 مايو 2026.', keywords: ['عيد الأضحى السعودية 2026'] },
    ],
  },
  {
    name: 'مصر', flag: '🇪🇬', code: 'eg',
    calendarNote: 'رؤية الهلال الرسمية من دار الإفتاء — قد تختلف بيوم عن السعودية.',
    events: [
      {
        id: 'results-th-eg', slug: 'thanaweya-results', name: 'نتيجة الثانوية العامة (مصر)', type: 'fixed', month: 7, day: 31, category: 'school',
        seoTitle: 'موعد نتيجة الثانوية العامة 2026 مصر',
        description: 'إعلان نتيجة الثانوية العامة المصرية أواخر يوليو 2026.',
        details: 'تُعلن وزارة التربية والتعليم النتائج على البوابة الرسمية moe.gov.eg.',
        keywords: ['نتيجة الثانوية العامة 2026', 'نتيجة الثانوية مصر 2026', 'نتيجة البكالوريا مصر 2026'],
        faqItems: [{ q: 'متى نتيجة الثانوية العامة 2026؟', a: 'أواخر يوليو 2026.' }]
      },
      {
        id: 'exams-th-eg', slug: 'thanaweya-exams', name: 'امتحانات الثانوية العامة (مصر)', type: 'fixed', month: 6, day: 20, category: 'school',
        seoTitle: 'موعد امتحانات الثانوية العامة 2026 مصر',
        description: 'بداية امتحانات الثانوية العامة المصرية يونيو 2026.',
        keywords: ['امتحانات الثانوية مصر 2026', 'موعد الثانوية العامة 2026', 'امتحانات آخر العام 2026'],
        faqItems: [{ q: 'متى امتحانات الثانوية مصر 2026؟', a: '~20 يونيو 2026.' }]
      },
      {
        id: 'school-start-eg', slug: 'school-start-egypt', name: 'بدء الدراسة في مصر', type: 'fixed', month: 9, day: 20, category: 'school',
        seoTitle: 'موعد بداية الدراسة في مصر 2026',
        description: 'بداية العام الدراسي 2026–2027 في مصر 20 سبتمبر.',
        keywords: ['بداية الدراسة مصر 2026', 'الدخول المدرسي مصر 2026', 'موعد الدراسة مصر'],
        faqItems: [{ q: 'متى يبدأ الدراسة في مصر 2026؟', a: '~20 سبتمبر 2026.' }]
      },
      {
        id: 'salary-eg', slug: 'salary-day-egypt', name: 'صرف المرتبات الحكومية (مصر)', type: 'monthly', day: 24, category: 'business',
        seoTitle: 'كم باقي على صرف الراتب في مصر؟',
        description: 'تُصرف مرتبات موظفي الحكومة المصرية يوم 24 من كل شهر.',
        keywords: ['صرف الراتب مصر', 'موعد الراتب مصر 24', 'متى يصرف الراتب في مصر'],
        faqItems: [{ q: 'متى يصرف الراتب في مصر؟', a: 'يوم 24 من كل شهر.' }]
      },
      {
        id: 'sham-nessim', slug: 'sham-nessim', name: 'شم النسيم', type: 'easter', easterOffset: 1, category: 'holidays',
        seoTitle: 'موعد شم النسيم 2026 في مصر',
        description: 'عيد شم النسيم المصري القديم — الإثنين عقب عيد القيامة.',
        details: 'عيد مصري موروث من الحضارة الفرعونية. يخرج المصريون للمتنزهات احتفاءً بقدوم الربيع ويأكلون الفسيخ والبيض الملوّن.',
        keywords: ['شم النسيم 2026', 'متى شم النسيم 2026', 'شم النسيم مصر'],
        faqItems: [{ q: 'متى شم النسيم 2026؟', a: 'الإثنين التالي لعيد القيامة الغربي.' }]
      },
      {
        id: 'ramadan-eg', slug: 'ramadan-in-egypt', name: 'رمضان في مصر', type: 'hijri', hijriMonth: 9, hijriDay: 1, category: 'islamic',
        seoTitle: 'متى رمضان 2026 في مصر — دار الإفتاء',
        description: 'رمضان 1447 في مصر — 18 أو 19 فبراير 2026 بحسب رؤية دار الإفتاء.',
        keywords: ['رمضان مصر 2026', 'متى رمضان في مصر 2026']
      },
    ],
  },
  {
    name: 'الجزائر', flag: '🇩🇿', code: 'dz',
    calendarNote: 'رؤية الهلال المحلية — قد تختلف بيوم عن السعودية.',
    events: [
      {
        id: 'results-bac-dz', slug: 'bac-results-algeria', name: 'نتائج بكالوريا الجزائر', type: 'fixed', month: 7, day: 15, category: 'school',
        seoTitle: 'موعد نتائج الباك 2026 الجزائر',
        description: 'إعلان نتائج بكالوريا الجزائر على الموقع الرسمي bac.onec.dz منتصف يوليو.',
        keywords: ['نتائج الباك الجزائر 2026', 'بكالوريا الجزائر 2026', 'موعد الباك الجزائر'],
        faqItems: [{ q: 'متى نتائج الباك الجزائر 2026؟', a: '~15 يوليو 2026.' }]
      },
      {
        id: 'exams-bac-dz', slug: 'bac-exams-algeria', name: 'امتحانات الباك (الجزائر)', type: 'fixed', month: 6, day: 15, category: 'school',
        seoTitle: 'موعد امتحانات البكالوريا 2026 الجزائر',
        description: 'انطلاق امتحانات البكالوريا الجزائرية يونيو 2026.',
        keywords: ['امتحانات الباك الجزائر 2026', 'موعد الباك الجزائر 2026'],
        faqItems: [{ q: 'متى امتحانات الباك الجزائر 2026؟', a: '~15 يونيو 2026.' }]
      },
      {
        id: 'school-start-dz', slug: 'school-start-algeria', name: 'الدخول المدرسي في الجزائر', type: 'fixed', month: 9, day: 21, category: 'school',
        seoTitle: 'موعد الدخول المدرسي 2026 الجزائر — 21 سبتمبر',
        description: 'الدخول المدرسي في الجزائر 21 سبتمبر 2026 للعام الدراسي 2026–2027.',
        keywords: ['الدخول المدرسي الجزائر 2026', 'بداية الدراسة الجزائر 2026', 'موعد الدراسة جزائر'],
        faqItems: [{ q: 'متى يبدأ الدراسة في الجزائر 2026؟', a: '21 سبتمبر 2026.' }]
      },
      {
        id: 'independence-dz', slug: 'independence-day-algeria', name: 'عيد الاستقلال الجزائري', type: 'fixed', month: 7, day: 5, category: 'national',
        seoTitle: 'عيد استقلال الجزائر 2026 — 5 جويلية',
        description: 'استقلال الجزائر عن فرنسا 5 يوليو 1962م.',
        details: 'استقلت الجزائر بعد ثورة تحريرية مجيدة بدأت 1 نوفمبر 1954 ودامت 7 سنوات وأصابت فرنسا.',
        keywords: ['عيد استقلال الجزائر 2026', '5 جويلية 2026', 'استقلال الجزائر 1962'],
        faqItems: [{ q: 'متى عيد الاستقلال الجزائري 2026؟', a: '5 يوليو 2026.' }]
      },
      {
        id: 'revolution-dz', slug: 'revolution-day-algeria', name: 'يوم الثورة الجزائرية', type: 'fixed', month: 11, day: 1, category: 'national',
        seoTitle: 'ذكرى ثورة نوفمبر الجزائر 2026 — أول نوفمبر',
        description: 'ذكرى اندلاع الثورة التحريرية الكبرى 1 نوفمبر 1954م.',
        keywords: ['يوم الثورة الجزائرية 2026', 'أول نوفمبر الجزائر', 'ثورة نوفمبر 1954'],
        faqItems: [{ q: 'متى ذكرى الثورة الجزائرية؟', a: '1 نوفمبر — ذكرى 1954م.' }]
      },
      {
        id: 'ramadan-dz', slug: 'ramadan-in-algeria', name: 'رمضان في الجزائر', type: 'hijri', hijriMonth: 9, hijriDay: 1, category: 'islamic',
        seoTitle: 'متى رمضان 2026 في الجزائر',
        description: 'رمضان 1447 في الجزائر — 18 أو 19 فبراير 2026.',
        keywords: ['رمضان الجزائر 2026', 'متى رمضان في الجزائر 2026']
      },
    ],
  },
  {
    name: 'المغرب', flag: '🇲🇦', code: 'ma',
    calendarNote: 'رؤية الهلال المحلية من وزارة الأوقاف.',
    events: [
      {
        id: 'results-bac-ma', slug: 'bac-results-morocco', name: 'نتائج الباكالوريا (المغرب)', type: 'fixed', month: 6, day: 17, category: 'school',
        seoTitle: 'موعد نتائج الباكالوريا 2026 المغرب',
        description: 'إعلان نتائج الباكالوريا المغربية 2026.',
        keywords: ['نتائج الباكالوريا المغرب 2026', 'باك المغرب 2026', 'نتائج الباك المغرب'],
        faqItems: [{ q: 'متى نتائج الباك المغرب 2026؟', a: '~17 يونيو 2026.' }]
      },
      {
        id: 'national-exam-ma', slug: 'national-exams-morocco', name: 'الامتحان الوطني (المغرب)', type: 'fixed', month: 6, day: 10, category: 'school',
        seoTitle: 'موعد الامتحان الوطني 2026 المغرب',
        description: 'الامتحان الوطني الموحد للباكالوريا المغربية 2026.',
        keywords: ['الامتحان الوطني المغرب 2026', 'امتحانات الباك المغرب 2026'],
        faqItems: [{ q: 'متى الامتحان الوطني المغرب 2026؟', a: '~10 يونيو 2026.' }]
      },
      {
        id: 'school-start-ma', slug: 'school-start-morocco', name: 'الدخول المدرسي في المغرب', type: 'fixed', month: 9, day: 8, category: 'school',
        seoTitle: 'موعد الدخول المدرسي 2026 المغرب — 8 سبتمبر',
        description: 'الدخول المدرسي في المغرب 8 سبتمبر 2026.',
        keywords: ['الدخول المدرسي المغرب 2026', 'بداية الدراسة المغرب 2026'],
        faqItems: [{ q: 'متى الدخول المدرسي المغرب 2026؟', a: '8 سبتمبر 2026.' }]
      },
      {
        id: 'throne-day', slug: 'throne-day-morocco', name: 'عيد العرش المغربي', type: 'fixed', month: 7, day: 30, category: 'national',
        seoTitle: 'موعد عيد العرش المغربي 2026 — 30 يوليوز',
        description: 'عيد العرش المجيد 30 يوليو — يحتفل المغرب بتولي الملك عرش البلاد.',
        details: 'يُلقى فيه الخطاب الملكي السنوي ويخرج المغاربة في مسيرات وطنية.',
        keywords: ['عيد العرش 2026 المغرب', '30 يوليوز 2026', 'عيد العرش المجيد'],
        faqItems: [{ q: 'متى عيد العرش 2026؟', a: '30 يوليو 2026.' }]
      },
      {
        id: 'independence-ma', slug: 'independence-day-morocco', name: 'عيد الاستقلال المغربي', type: 'fixed', month: 11, day: 18, category: 'national',
        seoTitle: 'ذكرى استقلال المغرب 2026 — 18 نوفمبر',
        description: 'عيد الاستقلال المغربي 18 نوفمبر — ذكرى عودة الملك محمد الخامس من المنفى 1955م.',
        keywords: ['عيد الاستقلال المغربي 2026', '18 نوفمبر المغرب', 'استقلال المغرب 1956'],
        faqItems: [{ q: 'متى عيد الاستقلال المغربي 2026؟', a: '18 نوفمبر 2026.' }]
      },
      {
        id: 'ramadan-ma', slug: 'ramadan-in-morocco', name: 'رمضان في المغرب', type: 'hijri', hijriMonth: 9, hijriDay: 1, category: 'islamic',
        seoTitle: 'متى رمضان 2026 في المغرب — رؤية الهلال',
        description: 'رمضان 1447 في المغرب — 18 أو 19 فبراير 2026 بحسب رؤية الهلال.',
        keywords: ['رمضان المغرب 2026', 'متى رمضان في المغرب 2026']
      },
    ],
  },
  {
    name: 'الإمارات', flag: '🇦🇪', code: 'ae',
    calendarNote: 'أم القرى مع رؤية الهلال المحلية.',
    events: [
      {
        id: 'national-day-ae', slug: 'uae-national-day', name: 'اليوم الوطني الإماراتي', type: 'fixed', month: 12, day: 2, category: 'national',
        seoTitle: 'اليوم الوطني الإماراتي 2026 — 2 ديسمبر',
        description: 'ذكرى إعلان اتحاد الإمارات العربية المتحدة 2 ديسمبر 1971م.',
        keywords: ['اليوم الوطني الإماراتي 2026', '2 ديسمبر الإمارات', 'اليوم الوطني 54'],
        faqItems: [{ q: 'متى اليوم الوطني الإماراتي 2026؟', a: '2 ديسمبر 2026.' }]
      },
      {
        id: 'school-start-ae', slug: 'school-start-uae', name: 'بداية الدراسة في الإمارات', type: 'fixed', month: 8, day: 30, category: 'school',
        seoTitle: 'موعد بداية الدراسة في الإمارات 2026',
        description: 'بداية العام الدراسي 2026–2027 في الإمارات.',
        keywords: ['بداية الدراسة الإمارات 2026', 'الدخول المدرسي الإمارات 2026'],
        faqItems: [{ q: 'متى الدراسة في الإمارات 2026؟', a: '30 أغسطس 2026.' }]
      },
      {
        id: 'ramadan-ae', slug: 'ramadan-in-uae', name: 'رمضان في الإمارات', type: 'hijri', hijriMonth: 9, hijriDay: 1, category: 'islamic',
        seoTitle: 'متى رمضان 2026 في الإمارات',
        description: 'رمضان 1447 في الإمارات — ~18–19 فبراير 2026.',
        keywords: ['رمضان الإمارات 2026', 'متى رمضان الإمارات 2026']
      },
    ],
  },
  {
    name: 'تونس', flag: '🇹🇳', code: 'tn',
    calendarNote: 'رؤية الهلال المحلية من دار الإفتاء التونسية.',
    events: [
      {
        id: 'results-bac-tn', slug: 'bac-results-tunisia', name: 'نتائج بكالوريا تونس', type: 'fixed', month: 6, day: 23, category: 'school',
        seoTitle: 'موعد نتائج الباك 2026 تونس',
        description: 'إعلان نتائج بكالوريا تونس 2026.',
        keywords: ['نتائج الباك تونس 2026', 'بكالوريا تونس 2026', 'نتائج الباك التونسي'],
        faqItems: [{ q: 'متى نتائج الباك تونس 2026؟', a: '~23 يونيو 2026.' }]
      },
      {
        id: 'school-start-tn', slug: 'school-start-tunisia', name: 'الدخول المدرسي في تونس', type: 'fixed', month: 9, day: 15, category: 'school',
        seoTitle: 'موعد الدخول المدرسي 2026 تونس — 15 سبتمبر',
        description: 'الدخول المدرسي في تونس 15 سبتمبر 2026.',
        keywords: ['الدخول المدرسي تونس 2026', 'بداية الدراسة تونس 2026'],
        faqItems: [{ q: 'متى الدراسة تونس 2026؟', a: '15 سبتمبر 2026.' }]
      },
      {
        id: 'independence-tn', slug: 'independence-day-tunisia', name: 'عيد الاستقلال التونسي', type: 'fixed', month: 3, day: 20, category: 'national',
        seoTitle: 'عيد استقلال تونس 2026 — 20 مارس',
        description: 'ذكرى استقلال تونس عن الحماية الفرنسية 20 مارس 1956م.',
        keywords: ['عيد الاستقلال التونسي 2026', '20 مارس تونس', 'استقلال تونس 1956'],
        faqItems: [{ q: 'متى عيد الاستقلال التونسي 2026؟', a: '20 مارس 2026.' }]
      },
      {
        id: 'ramadan-tn', slug: 'ramadan-in-tunisia', name: 'رمضان في تونس', type: 'hijri', hijriMonth: 9, hijriDay: 1, category: 'islamic',
        seoTitle: 'متى رمضان 2026 في تونس',
        description: 'رمضان 1447 في تونس — ~18–19 فبراير 2026.',
        keywords: ['رمضان تونس 2026', 'متى رمضان في تونس 2026']
      },
    ],
  },
  {
    name: 'الكويت', flag: '🇰🇼', code: 'kw',
    calendarNote: 'أم القرى مع رؤية الهلال المحلية.',
    events: [
      {
        id: 'national-day-kw', slug: 'kuwait-national-day', name: 'اليوم الوطني الكويتي', type: 'fixed', month: 2, day: 25, category: 'national',
        seoTitle: 'اليوم الوطني الكويتي 2026 — 25 فبراير',
        description: 'ذكرى استقلال الكويت عن بريطانيا 25 فبراير 1961م.',
        keywords: ['اليوم الوطني الكويتي 2026', '25 فبراير الكويت', 'استقلال الكويت'],
        faqItems: [{ q: 'متى اليوم الوطني الكويتي 2026؟', a: '25 فبراير 2026.' }]
      },
      {
        id: 'school-start-kw', slug: 'school-start-kuwait', name: 'بدء الدراسة في الكويت', type: 'fixed', month: 9, day: 15, category: 'school',
        seoTitle: 'موعد بداية الدراسة في الكويت 2026',
        description: 'بداية العام الدراسي 2026–2027 في الكويت.',
        keywords: ['بداية الدراسة الكويت 2026', 'الدخول المدرسي الكويت 2026'],
        faqItems: [{ q: 'متى الدراسة كويت 2026؟', a: '15 سبتمبر 2026.' }]
      },
      {
        id: 'ramadan-kw', slug: 'ramadan-in-kuwait', name: 'رمضان في الكويت', type: 'hijri', hijriMonth: 9, hijriDay: 1, category: 'islamic',
        seoTitle: 'متى رمضان 2026 في الكويت',
        description: 'رمضان 1447 في الكويت — ~18–19 فبراير 2026.',
        keywords: ['رمضان الكويت 2026', 'متى رمضان الكويت 2026']
      },
    ],
  },
  {
    name: 'قطر', flag: '🇶🇦', code: 'qa',
    calendarNote: 'أم القرى مع رؤية الهلال المحلية.',
    events: [
      {
        id: 'national-day-qa', slug: 'qatar-national-day', name: 'اليوم الوطني القطري', type: 'fixed', month: 12, day: 18, category: 'national',
        seoTitle: 'اليوم الوطني القطري 2026 — 18 ديسمبر',
        description: 'اليوم الوطني لدولة قطر 18 ديسمبر.',
        keywords: ['اليوم الوطني القطري 2026', '18 ديسمبر قطر'],
        faqItems: [{ q: 'متى اليوم الوطني القطري 2026؟', a: '18 ديسمبر 2026.' }]
      },
      {
        id: 'school-start-qa', slug: 'school-start-qatar', name: 'بدء الدراسة في قطر', type: 'fixed', month: 8, day: 30, category: 'school',
        seoTitle: 'موعد بداية الدراسة في قطر 2026',
        description: 'بداية العام الدراسي 2026–2027 في قطر.',
        keywords: ['بداية الدراسة قطر 2026', 'الدخول المدرسي قطر 2026'],
        faqItems: [{ q: 'متى الدراسة قطر 2026؟', a: '30 أغسطس 2026.' }]
      },
      {
        id: 'ramadan-qa', slug: 'ramadan-in-qatar', name: 'رمضان في قطر', type: 'hijri', hijriMonth: 9, hijriDay: 1, category: 'islamic',
        seoTitle: 'متى رمضان 2026 في قطر',
        description: 'رمضان 1447 في قطر — ~18–19 فبراير 2026.',
        keywords: ['رمضان قطر 2026', 'متى رمضان قطر 2026']
      },
    ],
  },
];

/* ══════════════════════════════════════════════════════════════════════════
 * ALL_EVENTS — flat, deduplicated
 * ══════════════════════════════════════════════════════════════════════════ */
const _seen = new Set();
function dedup(arr, countryCode = null) {
  return arr
    .map(e => enrichEvent(countryCode ? { ...e, _countryCode: countryCode } : e))
    .filter(e => { if (_seen.has(e.slug)) return false; _seen.add(e.slug); return true; });
}
export const ALL_EVENTS = [
  ...dedup(RELIGIOUS_HOLIDAYS),
  ...dedup(SEASONAL_EVENTS),
  ...COUNTRIES_EVENTS.flatMap(c => dedup(c.events, c.code)),
];