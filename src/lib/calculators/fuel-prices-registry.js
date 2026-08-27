/**
 * fuel-prices-registry.js — generates the CALCULATOR_ROUTES entries and FINANCE_PAGE_CONTENT
 * entries for every fuel-price country FROM `FUEL_PRICE_DATA` (fuel-prices-data.js), instead of
 * hand-authoring 9 nearly-identical blocks across data.js/finance-page-content.js. Both of those
 * files import from here and spread the result into their existing literal arrays/objects — their
 * own lookup contracts (`CALCULATOR_ROUTES.find(...)`, `getFinancePageContent(slug)`) are
 * untouched, this only changes how those entries get populated for the fuel-price slugs.
 *
 * Real per-country facts (authority, mechanism, sources, currency) come from FUEL_PRICE_DATA,
 * which was individually researched/verified per country — this generator only templates the
 * REPEATED shape (hero highlights, FAQ question wording, page title/description structure)
 * around those real facts, it doesn't invent anything country-specific.
 */

import { FUEL_PRICE_DATA } from '@/lib/calculators/fuel-prices-data';

// Country code -> { slug segment, Arabic name already in FUEL_PRICE_DATA, English name for
// natural keyword variety (Arabic searches often mix in the English country/brand name).
const COUNTRY_META = {
  sa: { slug: 'saudi', nameEn: 'السعودية' },
  ae: { slug: 'uae', nameEn: 'الامارات' },
  kw: { slug: 'kuwait', nameEn: 'الكويت' },
  qa: { slug: 'qatar', nameEn: 'قطر' },
  bh: { slug: 'bahrain', nameEn: 'البحرين' },
  om: { slug: 'oman', nameEn: 'عمان' },
  eg: { slug: 'egypt', nameEn: 'مصر' },
  ma: { slug: 'morocco', nameEn: 'المغرب' },
  jo: { slug: 'jordan', nameEn: 'الاردن' },
  dz: { slug: 'algeria', nameEn: 'الجزائر' },
  tn: { slug: 'tunisia', nameEn: 'تونس' },
  iq: { slug: 'iraq', nameEn: 'العراق' },
  lb: { slug: 'lebanon', nameEn: 'لبنان' },
};

// slug segment (e.g. "kuwait") -> country code (e.g. "kw") — used by the dynamic
// [country]/page.jsx route to resolve `saudi-fuel-prices` etc. back to a FUEL_PRICE_DATA key.
export const FUEL_PRICE_SLUG_TO_CODE = Object.fromEntries(
  Object.entries(COUNTRY_META).map(([cc, meta]) => [meta.slug, cc]),
);

// country code (e.g. "kw") -> full route href ("/tools/fuel-prices/kuwait-fuel-prices") — used
// by fuel-prices/compare/page.jsx to link each comparison card to its own country page, and by any
// other page that needs to link to a specific country without hand-duplicating this list (a
// hand-duplicated copy of this exact mapping caused a real duplicate-route-entry bug once
// already, 2026-08-25 — see data.js/finance-page-content.js history).
export const FUEL_PRICE_CODE_TO_HREF = Object.fromEntries(
  Object.entries(COUNTRY_META).map(([cc, meta]) => [cc, `/tools/fuel-prices/${meta.slug}-fuel-prices`]),
);

// Ordered list of every country code this feature covers — single source of truth for "loop over
// every fuel-price country" (the comparison hub, discovery.js registration, etc.).
export const FUEL_PRICE_COUNTRY_CODES = Object.keys(COUNTRY_META);

function gradeList(data) {
  return data.grades.map((g) => g.label).join('، ');
}

export const FUEL_PRICE_ROUTE_ENTRIES = Object.entries(COUNTRY_META).map(([cc, meta]) => {
  const data = FUEL_PRICE_DATA[cc];
  const slug = `${meta.slug}-fuel-prices`;
  return {
    slug,
    href: `/tools/fuel-prices/${slug}`,
    cluster: 'fuel-prices',
    shortLabel: `سعر البنزين في ${data.countryName}`,
    title: `سعر البنزين في ${data.countryName} اليوم — ${gradeList(data)}`,
    heroTitle: `سعر البنزين في ${data.countryName} اليوم | ${gradeList(data)}`,
    description: `سعر لتر البنزين في ${data.countryName} هذا الشهر لكل الأنواع (${gradeList(data)})، مع مقارنة بالقراءة السابقة، محدث تلقائياً من مصدر مباشر.`,
    accent: 'var(--green)',
    accentSoft: 'var(--green-subtle)',
    badge: 'أسعار الوقود',
    keywords: [
      `سعر البنزين اليوم في ${data.countryName}`,
      `سعر البنزين في ${data.countryName}`,
      `سعر البنزين في ${meta.nameEn}`,
      `اسعار الوقود ${data.countryName} هذا الشهر`,
      `كم سعر لتر البنزين في ${data.countryName}`,
      `سعر الديزل في ${data.countryName}`,
      `متى يتغير سعر البنزين في ${data.countryName}`,
      `من يحدد سعر البنزين في ${data.countryName}`,
      `جدول اسعار الوقود ${data.countryName}`,
    ],
  };
});

export const FUEL_PRICE_CONTENT_ENTRIES = Object.fromEntries(
  Object.entries(COUNTRY_META).map(([cc, meta]) => {
    const data = FUEL_PRICE_DATA[cc];
    const slug = `${meta.slug}-fuel-prices`;
    const whoSets = data.authority
      ? `${data.authority} هي الجهة التي ${data.mechanism}`
      : data.mechanism; // Morocco: no single authority, mechanism text already explains why.

    const faqItems = [
      {
        question: `كم سعر البنزين في ${data.countryName} اليوم؟`,
        answer: `سعر كل نوع (${gradeList(data)}) موضح في الجدول أعلى هذه الصفحة، مع سهم يوضح إن كان السعر ارتفع أو انخفض أو ثبت مقارنة بالقراءة السابقة — الجدول محدث تلقائياً من مصدر مباشر.`,
      },
      {
        question: data.authority
          ? `من يحدد سعر البنزين في ${data.countryName}؟`
          : `من يحدد سعر البنزين في ${data.countryName}؟`,
        answer: whoSets,
      },
      {
        question: `ما الفرق بين أنواع البنزين في ${data.countryName}؟`,
        answer: 'الرقم يشير إلى رقم الأوكتان — مقاومة الوقود للاشتعال المبكر داخل المحرك. كلما زاد الرقم زادت جودة الاحتراق للمحركات التي تتطلب أوكتان أعلى. راجع دليل سيارتك لمعرفة النوع الموصى به، فاستخدام أوكتان أقل من المطلوب قد يقلل كفاءة المحرك على المدى الطويل.',
      },
      {
        question: `هل سعر البنزين موحد في كل ${data.countryName}؟`,
        answer: data.authority
          ? `نعم، السعر الذي تعلنه ${data.authority} هو السعر الرسمي الموحد على مستوى الدولة.`
          : `لا بالضرورة — بما أن الأسعار محررة، قد يختلف السعر قليلاً بين محطة وأخرى حسب الشركة الموزعة، لكن الفروقات عادة صغيرة.`,
      },
      {
        question: `هل سيتغير سعر البنزين في ${data.countryName} قريباً؟`,
        answer: 'لا يمكن التنبؤ بدقة بأي تعديل قبل ظهوره في المصدر الرسمي — أقرب مؤشر حقيقي هو اتجاه السعر في القراءات الأخيرة الموضح في الجدول أعلاه.',
      },
    ];

    return [
      slug,
      {
        hero: {
          badge: 'أسعار الوقود',
          highlights: [
            'سعر كل نوع بنزين وديزل محدث تلقائياً',
            'مقارنة مباشرة مع القراءة السابقة',
            data.authority ? `من مصدر ${data.authority}` : 'من مصادر رصد أسعار موثوقة',
            'يُحدَّث تلقائياً بلا تدخل يدوي',
          ],
        },
        faqItems,
        sources: [
          { label: data.sourceLabel, href: data.sourceUrl, description: `المصدر الأساسي لأسعار الوقود في ${data.countryName}.` },
        ],
        searchProfile: {
          priorityQueries: [`سعر البنزين اليوم في ${data.countryName}`, `سعر البنزين في ${data.countryName}`],
          questionQueries: [`كم سعر البنزين في ${data.countryName} اليوم`, `من يحدد سعر البنزين في ${data.countryName}`],
          comparisonQueries: [`الفرق بين انواع البنزين في ${data.countryName}`],
          regionalQueries: data.grades.map((g) => `${g.label} ${data.countryName}`),
          temporalQueries: [`اسعار الوقود هذا الشهر ${data.countryName}`],
          schemaAbout: [`أسعار الوقود في ${data.countryName}`, ...data.grades.map((g) => g.label)],
        },
      },
    ];
  }),
);
