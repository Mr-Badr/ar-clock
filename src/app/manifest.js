/**
 * app/manifest.js — PWA Web App Manifest
 * Served at /manifest.webmanifest
 * Enables "Add to Home Screen" on mobile — key for Arabic mobile users
 */

export default function manifest() {
  return {
    name: 'مواقيت الصلاة — Waqt',
    short_name: 'مواقيت',
    description: 'مواقيت الصلاة الدقيقة في أي مدينة حول العالم',
    start_url: '/',
    display: 'standalone',
    background_color: '#181C2A',
    theme_color: '#4ECDC4',
    orientation: 'portrait',
    lang: 'ar',
    dir: 'rtl',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
    categories: ['lifestyle', 'utilities'],
    shortcuts: [
      {
        name: 'بحث عن مدينة',
        url: '/?search=1',
        description: 'ابحث عن مواقيت الصلاة في مدينتك',
      },
    ],
  };
}
