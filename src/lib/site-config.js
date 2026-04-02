import { getEnv } from '@/lib/env.server';

export const SITE_BRAND = 'ميقات';
export const SITE_TITLE = 'ميقات | دليلك الشامل للوقت والمواعيد والمناسبات';
export const SITE_DESCRIPTION =
  'احصل على مواقيت الصلاة الدقيقة، فرق التوقيت، وعداد المناسبات مع تحديثات يومية وبيانات عربية موثوقة.';

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
