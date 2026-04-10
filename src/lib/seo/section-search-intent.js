import { SITE_BRAND, SITE_BRAND_EN } from '@/lib/site-config';

const CURRENT_GREGORIAN_YEAR = new Date().getFullYear();
const NEXT_GREGORIAN_YEAR = CURRENT_GREGORIAN_YEAR + 1;

const COUNTRY_SEO_ALIASES = {
  'united-states': ['أمريكا', 'الولايات المتحدة'],
  'united-kingdom': ['بريطانيا', 'المملكة المتحدة'],
  'united-arab-emirates': ['الإمارات', 'الإمارات العربية المتحدة'],
};

function normalizeKeyword(value) {
  return String(value || '').trim().replace(/\s+/g, ' ');
}

export function uniqueKeywords(values) {
  return Array.from(new Set(values.map(normalizeKeyword).filter(Boolean)));
}

export function getCountrySeoNames(countrySlug, countryNameAr) {
  const aliases = COUNTRY_SEO_ALIASES[countrySlug] || [];
  return uniqueKeywords([aliases[0], countryNameAr, ...aliases]);
}

/**
 * @param {Object} options
 * @param {string} [options.countryAr]
 * @param {string} [options.countryEn]
 * @param {string} [options.cityAr]
 * @param {string} [options.cityEn]
 * @param {string} [options.timezone]
 * @param {string} [options.utcOffset]
 */
export function buildTimeNowKeywords({
  countryAr,
  countryEn,
  cityAr,
  cityEn,
  timezone,
  utcOffset,
} = {}) {
  const locationNames = uniqueKeywords([
    cityAr,
    countryAr,
    cityAr && countryAr ? `${cityAr} ${countryAr}` : '',
  ]);
  const englishNames = uniqueKeywords([
    cityEn,
    countryEn,
    cityEn && countryEn ? `${cityEn} ${countryEn}` : '',
  ]);

  const keywords = [
    SITE_BRAND,
    SITE_BRAND_EN,
    'الوقت الآن',
    'الساعة الآن',
    'الوقت الان',
    'الساعة الان',
    'الوقت الحالي',
    'كم الساعة الآن',
    'كم الساعة الان',
    'التاريخ اليوم',
    'المنطقة الزمنية',
    'التوقيت المحلي',
    'توقيت غرينتش',
    'الوقت العالمي',
    ...locationNames.flatMap((name) => [
      `الوقت الآن في ${name}`,
      `الوقت الان في ${name}`,
      `الساعة الآن في ${name}`,
      `الساعة الان في ${name}`,
      `كم الساعة في ${name}`,
      `الوقت الحالي في ${name}`,
      `التاريخ اليوم في ${name}`,
      `المنطقة الزمنية في ${name}`,
      `توقيت ${name}`,
      `معرفة الوقت في ${name}`,
    ]),
    ...englishNames.flatMap((name) => [
      `time in ${name}`,
      `current time ${name}`,
      `${name} time now`,
    ]),
  ];

  if (timezone) {
    keywords.push(`المنطقة الزمنية ${timezone}`, `timezone ${timezone}`);
  }

  if (utcOffset) {
    keywords.push(`UTC ${utcOffset}`, `GMT ${utcOffset}`);
  }

  return uniqueKeywords(keywords);
}

/**
 * @param {Object} options
 * @param {string} [options.countryAr]
 * @param {string} [options.countryEn]
 * @param {string} [options.cityAr]
 * @param {string} [options.cityEn]
 * @param {string} [options.methodLabel]
 */
export function buildPrayerKeywords({
  countryAr,
  countryEn,
  cityAr,
  cityEn,
  methodLabel,
} = {}) {
  const locationNames = uniqueKeywords([
    cityAr,
    countryAr,
    cityAr && countryAr ? `${cityAr} ${countryAr}` : '',
  ]);
  const englishNames = uniqueKeywords([
    cityEn,
    countryEn,
    cityEn && countryEn ? `${cityEn} ${countryEn}` : '',
  ]);

  const keywords = [
    SITE_BRAND,
    SITE_BRAND_EN,
    'مواقيت الصلاة',
    'مواقيت الصلاة اليوم',
    'أوقات الصلاة',
    'أوقات الصلاة اليوم',
    'أوقات الأذان',
    'أذان الفجر',
    'أذان المغرب',
    'وقت الصلاة الآن',
    'إمساكية الصلاة',
    'الصلوات الخمس',
    'الفجر والظهر والعصر والمغرب والعشاء',
    'وقت العصر الشافعي',
    'وقت العصر الحنفي',
    ...locationNames.flatMap((name) => [
      `مواقيت الصلاة في ${name}`,
      `مواقيت الصلاة ${name}`,
      `أوقات الصلاة في ${name} اليوم`,
      `أوقات الأذان في ${name}`,
      `أذان الفجر ${name}`,
      `أذان المغرب ${name}`,
      `صلاة الفجر في ${name}`,
      `صلاة المغرب في ${name}`,
      `صلاة العشاء في ${name}`,
      `إمساكية ${name}`,
      `جدول الصلاة في ${name}`,
    ]),
    ...englishNames.flatMap((name) => [
      `prayer times ${name}`,
      `${name} prayer times`,
      `adhan time ${name}`,
    ]),
  ];

  if (methodLabel) {
    keywords.push(
      `طريقة ${methodLabel}`,
      `حساب مواقيت الصلاة ${methodLabel}`,
      `مواقيت الصلاة حسب ${methodLabel}`,
    );
  }

  return uniqueKeywords(keywords);
}

/**
 * @param {Object} options
 * @param {string} [options.fromCityAr]
 * @param {string} [options.toCityAr]
 * @param {string[]} [options.fromCountryNames]
 * @param {string[]} [options.toCountryNames]
 */
export function buildTimeDifferenceKeywords({
  fromCityAr,
  toCityAr,
  fromCountryNames = [],
  toCountryNames = [],
} = {}) {
  const keywords = [
    SITE_BRAND,
    SITE_BRAND_EN,
    'فرق التوقيت',
    'حاسبة فرق التوقيت',
    'تحويل الوقت',
    'تحويل التوقيت',
    'الساعة الآن',
    'أفضل وقت للاجتماعات',
    'ساعات العمل المشتركة',
    'التوقيت الصيفي',
  ];

  if (fromCityAr && toCityAr) {
    keywords.push(
      `فرق التوقيت بين ${fromCityAr} و${toCityAr}`,
      `كم فرق التوقيت بين ${fromCityAr} و${toCityAr}`,
      `كم ساعة بين ${fromCityAr} و${toCityAr}`,
      `تحويل الوقت من ${fromCityAr} إلى ${toCityAr}`,
      `الساعة الآن في ${toCityAr} مقارنة بـ ${fromCityAr}`,
      `أفضل وقت للاجتماع بين ${fromCityAr} و${toCityAr}`,
      `التوقيت الصيفي بين ${fromCityAr} و${toCityAr}`,
    );
  }

  for (const fromCountryName of fromCountryNames) {
    for (const toCountryName of toCountryNames) {
      keywords.push(
        `فرق التوقيت بين ${fromCountryName} و${toCountryName}`,
        `كم فرق التوقيت بين ${fromCountryName} و${toCountryName}`,
        `كم ساعة بين ${fromCountryName} و${toCountryName}`,
        `تحويل الوقت بين ${fromCountryName} و${toCountryName}`,
        `الوقت الآن بين ${fromCountryName} و${toCountryName}`,
        `أفضل وقت للاجتماعات بين ${fromCountryName} و${toCountryName}`,
      );
    }
  }

  return uniqueKeywords(keywords);
}

/**
 * @param {Array<{from: {nameAr: string}, to: {nameAr: string}}>} popularPairs
 */
export function buildTimeDifferenceHubKeywords(popularPairs = []) {
  const keywords = [
    SITE_BRAND,
    SITE_BRAND_EN,
    'فرق التوقيت',
    'حاسبة فرق التوقيت',
    'فرق التوقيت بين الدول',
    'فرق التوقيت بين المدن',
    'تحويل الوقت بين المدن',
    'تحويل الوقت بين الدول',
    'كم فرق التوقيت الآن',
    'أفضل وقت للاجتماعات',
    'ساعات العمل المشتركة',
    'حاسبة الوقت العالمية',
    'التوقيت الصيفي والشتوي',
  ];

  for (const pair of popularPairs) {
    const fromName = pair?.from?.nameAr;
    const toName = pair?.to?.nameAr;
    if (!fromName || !toName) continue;

    keywords.push(
      `فرق التوقيت بين ${fromName} و${toName}`,
      `كم فرق التوقيت بين ${fromName} و${toName}`,
      `تحويل الوقت بين ${fromName} و${toName}`,
      `أفضل وقت للاجتماعات بين ${fromName} و${toName}`,
    );
  }

  return uniqueKeywords(keywords);
}

/**
 * @param {Object} options
 * @param {number} [options.gregorianYear]
 * @param {number} [options.hijriYear]
 * @param {string} [options.countryNameAr]
 */
export function buildDateKeywords({
  gregorianYear = CURRENT_GREGORIAN_YEAR,
  hijriYear,
  countryNameAr,
} = {}) {
  const keywords = [
    SITE_BRAND,
    SITE_BRAND_EN,
    'تاريخ اليوم',
    'التاريخ الهجري اليوم',
    'التاريخ الميلادي اليوم',
    'تاريخ اليوم بالهجري والميلادي',
    'كم التاريخ اليوم',
    'التقويم الهجري',
    'التقويم الميلادي',
    'محول التاريخ',
    'تحويل التاريخ',
    'ميلادي إلى هجري',
    'هجري إلى ميلادي',
    'تقويم أم القرى',
    'الحساب الفلكي',
    `تقويم ${gregorianYear}`,
    `${gregorianYear} ميلادي`,
    `التاريخ ${gregorianYear}`,
    `تقويم ${NEXT_GREGORIAN_YEAR}`,
    `${NEXT_GREGORIAN_YEAR} ميلادي`,
  ];

  if (hijriYear) {
    keywords.push(
      `تقويم ${hijriYear} هجري`,
      `التاريخ الهجري ${hijriYear}`,
      `تقويم أم القرى ${hijriYear}`,
    );
  }

  if (countryNameAr) {
    keywords.push(
      `التاريخ اليوم في ${countryNameAr}`,
      `التاريخ الهجري في ${countryNameAr}`,
      `التاريخ الميلادي في ${countryNameAr}`,
      `تاريخ اليوم في ${countryNameAr}`,
    );
  }

  return uniqueKeywords(keywords);
}
