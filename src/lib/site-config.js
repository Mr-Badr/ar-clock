import { getEnv } from '@/lib/env.server';

export const SITE_BRAND = 'ميقات';
export const SITE_HOME_TITLE = 'الوقت الآن ومواقيت الصلاة وفرق التوقيت والتاريخ الهجري';
export const SITE_TITLE = `${SITE_HOME_TITLE} | ${SITE_BRAND}`;
export const SITE_DESCRIPTION =
  'منصة عربية شاملة لمعرفة الوقت الآن في أي مدينة، مواقيت الصلاة، فرق التوقيت، التاريخ الهجري والميلادي، تحويل التاريخ، والتقويم وعدادات المناسبات بدقة عالية.';

export const SITE_KEYWORDS = Array.from(new Set([
  SITE_BRAND,
  'Miqat',
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

export function getSiteUrl() {
  const env = getEnv();
  return (
    normalizeSiteUrl(env.NEXT_PUBLIC_BASE_URL) ||
    normalizeSiteUrl(env.NEXT_PUBLIC_SITE_URL) ||
    normalizeSiteUrl(env.VERCEL_PROJECT_PRODUCTION_URL) ||
    (env.NODE_ENV === 'production' ? normalizeSiteUrl(env.VERCEL_URL) : null) ||
    'https://miqatime.com'
  );
}

export function getMetadataBase() {
  return new URL(getSiteUrl());
}
