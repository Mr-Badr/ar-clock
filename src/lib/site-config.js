import { getEnv } from '@/lib/env.server';

export const SITE_BRAND = 'ميقاتنا';
export const SITE_BRAND_EN = 'Miqatona';
export const SITE_CONTACT_EMAIL = 'contact@miqatona.com';
export const SITE_LEGACY_BRANDS = ['ميقاتنا', 'Miqatona'];
export const SITE_PRIMARY_DOMAIN = 'https://miqatona.com';
export const SITE_APP_NAME = `${SITE_BRAND} | دليلك الشامل للوقت والمواعيد`;
export const SITE_HOME_TITLE = 'الوقت الان ومواقيت الصلاة وفرق التوقيت والتاريخ اليوم';
export const SITE_TITLE = `${SITE_HOME_TITLE} | ${SITE_BRAND}`;
export const SITE_DESCRIPTION =
  'منصة عربية شاملة للوقت الآن في المدن والدول، مواقيت الصلاة، فرق التوقيت، التاريخ الهجري والميلادي، تحويل التاريخ، التقويم، والمناسبات مع صفحات داخلية مهيأة لمحركات البحث.';

export const SITE_KEYWORDS = Array.from(new Set([
  SITE_BRAND,
  SITE_BRAND_EN,
  ...SITE_LEGACY_BRANDS,
  'الوقت الآن',
  'الوقت الان',
  'الساعة الآن',
  'الساعة الان',
  'كم الساعة الآن',
  'كم الساعة الان',
  'الوقت الحالي',
  'الوقت الآن في المدن',
  'الوقت الآن في العالم',
  'مواقيت الصلاة',
  'أوقات الصلاة',
  'موعد الأذان',
  'وقت الأذان',
  'أذان اليوم',
  'أذان الفجر',
  'أذان المغرب',
  'اتجاه القبلة',
  'فرق التوقيت',
  'فارق التوقيت',
  'حاسبة فرق التوقيت',
  'تحويل الوقت',
  'التاريخ الهجري اليوم',
  'التاريخ الميلادي اليوم',
  'تاريخ اليوم',
  'تاريخ اليوم هجري',
  'تاريخ اليوم ميلادي',
  'محول التاريخ',
  'تحويل التاريخ',
  'هجري إلى ميلادي',
  'ميلادي إلى هجري',
  'التقويم الهجري',
  'التقويم الميلادي',
  'التاريخ الهجري',
  'التاريخ الميلادي',
  'عداد المناسبات',
  'العد التنازلي للمناسبات',
  'كم باقي على رمضان',
  'كم باقي على العيد',
  'متى رمضان',
  'متى العيد',
  'current time',
  'prayer times',
  'time difference',
  'Hijri date',
  'date converter',
]));

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
  const env = getEnv();
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
