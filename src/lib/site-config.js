import { getSiteEnv } from '@/lib/env.server';
import publishedEventsList from '@/data/holidays/generated/published-events-list.json';

export const SITE_BRAND = 'ميقاتنا';
export const SITE_BRAND_EN = 'Miqatona';
export const SITE_CONTACT_EMAIL = 'contact@miqatona.com';
export const SITE_LEGACY_BRANDS = ['ميقاتنا', 'Miqatona'];
export const SITE_PRIMARY_DOMAIN = 'https://miqatona.com';
export const SITE_APP_NAME = `${SITE_BRAND} | دليلك الشامل للوقت والمواعيد`;
export const SITE_HOME_TITLE = 'كم الساعة الآن في مدينتك؟ | الوقت الآن ومواقيت الصلاة والتاريخ';
export const SITE_TITLE = `${SITE_HOME_TITLE} | ${SITE_BRAND}`;
export const SITE_DESCRIPTION =
  'اعرف فوراً كم الساعة الآن في مدينتك، ومواقيت الصلاة اليوم، وفرق التوقيت بين الدول، وتاريخ اليوم الهجري والميلادي، مع حاسبة العمر والضريبة والقسط الشهري وأدوات الاقتصاد الحي للذهب والفوركس والأسواق.';

const CURRENT_GREGORIAN_YEAR = new Date().getFullYear();
const NEXT_GREGORIAN_YEAR = CURRENT_GREGORIAN_YEAR + 1;

function normalizeKeyword(value) {
  return String(value || '').trim().replace(/\s+/g, ' ');
}

function uniqKeywords(values) {
  return Array.from(new Set(values.map(normalizeKeyword).filter(Boolean)));
}

function buildEventKeywordVariants(events) {
  if (!Array.isArray(events)) return [];

  return events.flatMap((event) => {
    const name = normalizeKeyword(event?.name);
    if (!name) return [];

    return [
      name,
      `كم باقي على ${name}`,
      `متى ${name}`,
      `موعد ${name}`,
      `${name} ${CURRENT_GREGORIAN_YEAR}`,
      `${name} ${NEXT_GREGORIAN_YEAR}`,
      `كم باقي على ${name} ${CURRENT_GREGORIAN_YEAR}`,
      `متى ${name} ${CURRENT_GREGORIAN_YEAR}`,
      `موعد ${name} ${CURRENT_GREGORIAN_YEAR}`,
    ];
  });
}

export const SITE_ECONOMY_KEYWORDS = uniqKeywords([
  'اقتصاد',
  'اقتصاديات',
  'الاقتصاد الحي',
  'أسواق المال',
  'الأسواق العالمية',
  'البورصة العالمية',
  'بورصة',
  'تداول',
  'فوركس',
  'جلسات الفوركس',
  'جلسة لندن',
  'جلسة نيويورك',
  'جلسة طوكيو',
  'جلسة سيدني',
  'الذهب',
  'تداول الذهب',
  'سوق الذهب',
  'هل الذهب مفتوح الآن',
  'متى يفتح الذهب',
  'متى يفتح السوق الأمريكي',
  'السوق الأمريكي اليوم',
  'الأسهم الأمريكية',
  'البورصة الأمريكية',
  'أوقات الأسواق العالمية',
  'أوقات التداول العالمية',
  'ساعات التداول',
  'ساعة السوق',
  'ساعة التداول',
  'مواعيد البورصات العالمية',
  'متى تفتح البورصة الأمريكية اليوم',
  'هل السوق الأمريكي مفتوح الآن',
  'متى يفتح الفوركس',
  'أفضل وقت للتداول',
  'أفضل وقت لتداول الفوركس',
  'خريطة سيولة السوق',
  'متى تغلق البورصات العالمية',
  'مؤشرات الأسواق العالمية',
  'توقيت افتتاح السوق الأمريكي',
  'توقيت إغلاق السوق الأمريكي',
  'مواعيد الذهب والفوركس والبورصات',
  'تقويم اقتصادي بالعربي',
  'أحداث اقتصادية اليوم',
  'موعد NFP بتوقيت السعودية',
  'موعد CPI الأمريكي بتوقيت الرياض',
  'جلسات الفوركس بتوقيت الرياض',
  'جلسات الفوركس بتوقيت الكويت',
  'هل الذهب مفتوح الآن بتوقيت دبي',
  'هل الذهب مفتوح الآن بتوقيت السعودية',
  'متى يفتح السوق الأمريكي بتوقيت الكويت',
  'متى يفتح السوق الأمريكي بتوقيت المغرب',
  'أفضل وقت لتداول الذهب في رمضان',
  'هل تداول السعودية مفتوح الآن',
  'عطل بورصة نيويورك',
  'عطل السوق الأمريكي اليوم',
  'ما قبل السوق الأمريكي',
  'ما بعد إغلاق السوق الأمريكي',
  'بورصة دبي اليوم',
  'بورصة أبوظبي اليوم',
  'بورصة الكويت اليوم',
  'بورصة قطر اليوم',
  'البورصة المصرية اليوم',
  'ساعة سيولة الفوركس',
  'أفضل وقت لتداول EURUSD',
  'أفضل وقت لتداول XAUUSD',
  'خريطة نشاط الذهب اليوم',
]);

export const SITE_CALCULATOR_KEYWORDS = uniqKeywords([
  'الحاسبات',
  'حاسبة',
  'قسم الحاسبات',
  'حاسبة العمر',
  'احسب عمرك',
  'كم عمري',
  'حاسبات العمر',
  'حاسبة العمر بالهجري والميلادي',
  'كم باقي على عيد ميلادي',
  'حاسبة مكافأة نهاية الخدمة',
  'حساب نهاية الخدمة',
  'حاسبة القسط الشهري',
  'كم قسط قرض 100 ألف',
  'حاسبة القروض',
  'حاسبة ضريبة القيمة المضافة',
  'حساب الضريبة 15%',
  'VAT calculator',
  'حاسبة النسبة المئوية',
  'حساب الخصم',
  'percentage calculator',
  'حساب النسبة المئوية',
  'حاسبة تكلفة البناء',
]);

const SITE_STATIC_KEYWORDS = [
  SITE_BRAND,
  SITE_BRAND_EN,
  ...SITE_LEGACY_BRANDS,
  'الوقت',
  'الساعة',
  'الوقت الان',
  'الساعة الان',
  'كم الساعة',
  'توقيت',
  'التاريخ',
  'هجري',
  'ميلادي',
  'التقويم',
  'تحويل التاريخ',
  'محول التاريخ',
  'تاريخ اليوم',
  'تاريخ اليوم هجري',
  'تاريخ اليوم ميلادي',
  'مواقيت',
  'مواقيت الصلاة',
  'مواقيت الصلاة اليوم',
  'أوقات الصلاة',
  'أوقات الأذان',
  'الأذان',
  'اتجاه القبلة',
  'دليل اتجاه القبلة',
  'فرق التوقيت',
  'حاسبة فرق التوقيت',
  'تحويل الوقت',
  'العد التنازلي',
  'المناسبات',
  'الأعياد',
  'الإجازات الرسمية',
  'الأحداث القادمة',
  'الوقت الان في مدينتي',
  'معرفة فرق التوقيت بين الدول',
  'تاريخ اليوم بالهجري والميلادي',
  'أداة تحويل التاريخ من هجري إلى ميلادي والعكس',
  'العد التنازلي لأهم المناسبات والأعياد والإجازات الرسمية',
  'مواقيت الصلاة الدقيقة واتجاه القبلة لجميع المدن',
  'دليل شامل للوقت والمواعيد في الوطن العربي والعالم',
];

export const SITE_EVENT_KEYWORDS = uniqKeywords(
  buildEventKeywordVariants(publishedEventsList),
);

export const SITE_KEYWORDS = uniqKeywords([
  ...SITE_STATIC_KEYWORDS,
  ...SITE_ECONOMY_KEYWORDS,
  ...SITE_CALCULATOR_KEYWORDS,
  ...SITE_EVENT_KEYWORDS,
]);

export const SITE_SCHEMA_TOPICS = [
  'الوقت الآن',
  'مواقيت الصلاة',
  'أوقات الصلاة',
  'فرق التوقيت',
  'التاريخ الهجري',
  'التاريخ الميلادي',
  'محول التاريخ',
  'تحويل التاريخ',
  'التقويم الهجري',
  'التقويم الميلادي',
  'حاسبة العمر',
  'الحاسبات المالية',
  'القسط الشهري',
  'مكافأة نهاية الخدمة',
  'ضريبة القيمة المضافة',
  'النسبة المئوية',
  'الأسواق العالمية',
  'السوق الأمريكي',
  'جلسات الفوركس',
  'الذهب',
  'عداد المناسبات',
  'العد التنازلي للمناسبات',
  'اتجاه القبلة',
];

export const SITE_DEFAULT_LOCALE = 'ar-SA';
export const SITE_SUPPORTED_LOCALES = ['ar-SA', 'ar-EG', 'ar-MA', 'ar-AE'];
const SITE_CANONICAL_ALIAS_HOSTS = new Set([
  'www.miqatona.com',
  'miqatona.com',
]);

function normalizeSiteUrl(value) {
  if (!value || typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed) return null;

  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  try {
    return new URL(withProtocol).origin;
  } catch {
    return null;
  }
}

function canonicalizeSiteUrl(value) {
  const normalized = normalizeSiteUrl(value);
  if (!normalized) return null;

  try {
    const url = new URL(normalized);
    const hostname = url.hostname.toLowerCase();

    if (hostname === 'miqatona.com' || SITE_CANONICAL_ALIAS_HOSTS.has(hostname)) {
      return SITE_PRIMARY_DOMAIN;
    }

    return normalized;
  } catch {
    return null;
  }
}

export function getSiteUrl() {
  const env = getSiteEnv();
  const explicitSiteUrl =
    canonicalizeSiteUrl(env.NEXT_PUBLIC_BASE_URL) ||
    canonicalizeSiteUrl(env.NEXT_PUBLIC_SITE_URL);

  if (explicitSiteUrl) return explicitSiteUrl;
  if (env.NODE_ENV === 'production') return SITE_PRIMARY_DOMAIN;

  return (
    canonicalizeSiteUrl(env.VERCEL_URL) ||
    canonicalizeSiteUrl(env.VERCEL_PROJECT_PRODUCTION_URL) ||
    SITE_PRIMARY_DOMAIN
  );
}

export function getMetadataBase() {
  return new URL(getSiteUrl());
}
