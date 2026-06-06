import { getSiteEnv } from '@/lib/env.server';
import publishedEventsList from '@/data/holidays/generated/published-events-list.json';

export const SITE_BRAND = 'ميقاتنا';
export const SITE_BRAND_EN = 'Miqatona';
export const SITE_CONTACT_EMAIL = 'contact@miqatona.com';
export const SITE_LEGACY_BRANDS = ['ميقاتنا', 'Miqatona'];
export const SITE_PRIMARY_DOMAIN = 'https://miqatona.com';
export const SITE_APP_NAME = `${SITE_BRAND} | منصة عربية للوقت والصلاة والتاريخ والحاسبات`;
export const SITE_HOME_TITLE = 'ميقاتنا | الوقت الان والصلاة والتاريخ والحاسبات العربية';
export const SITE_TITLE = SITE_HOME_TITLE;
export const SITE_DESCRIPTION =
  'اعرف الوقت الان ومواقيت الصلاة والتاريخ الهجري والميلادي، وافتح الحاسبات اليومية من مسارات عربية واضحة وسريعة داخل ميقاتنا.';

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
  'الوقت الآن',
  'الساعة الآن',
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
  'الوقت الآن في مدينتي',
  'معرفة فرق التوقيت بين الدول',
  'تاريخ اليوم بالهجري والميلادي',
  'أداة تحويل التاريخ من هجري إلى ميلادي والعكس',
  'العد التنازلي لأهم المناسبات والأعياد والإجازات الرسمية',
  'مواقيت الصلاة الدقيقة واتجاه القبلة لجميع المدن',
  'مرجع عربي عملي للوقت والمواعيد في الوطن العربي والعالم',
];

export const SITE_EVENT_KEYWORDS = uniqKeywords(
  buildEventKeywordVariants(publishedEventsList),
);

export const SITE_KEYWORDS = uniqKeywords([
  ...SITE_STATIC_KEYWORDS,
  ...SITE_CALCULATOR_KEYWORDS,
  ...SITE_EVENT_KEYWORDS,
]);

export const SITE_SCHEMA_TOPICS = [
  'الوقت الان',
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
  'الحاسبات اليومية',
  'الأدوات المالية',
  'المناسبات والإجازات',
  'عداد المناسبات',
  'العد التنازلي للمناسبات',
  'المدونة العربية',
  'فهرس الأدوات',
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
