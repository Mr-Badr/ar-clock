import { SITE_APP_NAME, SITE_BRAND } from '@/lib/site-config';

/**
 * app/manifest.js — PWA Web App Manifest
 * Served at /manifest.webmanifest
 * Enables "Add to Home Screen" on mobile — key for Arabic mobile users
 */

export default function manifest() {
  return {
    name: SITE_APP_NAME,
    short_name: SITE_BRAND,
    description: `دليلك الشامل للوقت، المواعيد، والمناسبات الإسلامية والعالمية في تطبيق ${SITE_BRAND} العصري`,
    start_url: '/',
    display: 'standalone',
    background_color: '#181C2A',
    theme_color: '#4ECDC4',
    orientation: 'portrait',
    lang: 'ar',
    dir: 'rtl',
    icons: [
      { src: '/icons/icon-192.svg', sizes: '192x192', type: 'image/svg+xml' },
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.svg', sizes: '512x512', type: 'image/svg+xml', purpose: 'any' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
    categories: ['lifestyle', 'utilities', 'education'],
    shortcuts: [
      {
        name: 'مواقيت الصلاة',
        url: '/mwaqit-al-salat',
        description: 'تحقق من أوقات الصلاة الدقيقة',
      },
      {
        name: 'فرق التوقيت',
        url: '/time-difference',
        description: 'قارن الوقت بين المدن العالمية',
      },
      {
        name: 'عداد المناسبات',
        url: '/holidays',
        description: 'متى يبدأ رمضان والمناسبات القادمة؟',
      },
    ],
  };
}
