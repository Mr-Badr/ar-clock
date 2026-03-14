import './new.css';
import './waqt-ui.css';
import { Suspense } from 'react';
import type { Metadata } from 'next';
import { Noto_Kufi_Arabic } from 'next/font/google';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/components/theme-provider';
import Header from '@/components/layout/header';
// Load every weight the design system uses.
// --font-extrabold (800) is required for clock digits.
// --font-black (900) is required for fullscreen clock.
const notoKufi = Noto_Kufi_Arabic({
  subsets: ['arabic'],
  // Weights actually used by the design system:
  // 400 = body, 600 = semi-bold labels, 700 = headings, 900 = clock digits/hero
  // Removed 300 (unused) and 800 (superseded by 900 in all clock/hero usage)
  weight: ['400', '600', '700', '900'],
  variable: '--font-noto-kufi',
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  // ── Core ──────────────────────────────────────────────────────────────────
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com'),
  title: {
    default: 'مواقيت الصلاة — دقيقة في جميع أنحاء العالم',
    template: '%s | مواقيت الصلاة',
  },
  description: 'احصل على مواقيت الصلاة الدقيقة (الفجر، الشروق، الظهر، العصر، المغرب، العشاء) لأي مدينة حول العالم. محسوبة بدقة فلكية وتُحدَّث يومياً.',
  keywords: [
    'مواقيت الصلاة', 'أوقات الصلاة', 'موعد الأذان', 'وقت الصلاة اليوم',
    'الفجر', 'الظهر', 'العصر', 'المغرب', 'العشاء',
    'prayer times', 'salah times', 'اتجاه القبلة', 'قبلة',
    'فرق التوقيت', 'تحويل الوقت', 'الساعة الآن', 'المناسبات الإسلامية',
  ],
  authors: [{ name: 'Waqt — مواقيت الصلاة' }],
  category: 'utilities',
  classification: 'Public',

  applicationName: 'مواقيت الصلاة',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'مواقيت' },

  // ── Robots ────────────────────────────────────────────────────────────────
  robots: {
    index: true, follow: true,
    googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large', 'max-video-preview': -1 },
  },

  // ── Open Graph ────────────────────────────────────────────────────────────
  openGraph: {
    title: 'مواقيت الصلاة الدقيقة وخدمات الوقت',
    description: 'احصل على مواقيت الصلاة، فرق التوقيت، وعداد المناسبات في مكان واحد — تحديث يومي بدقة فلكية.',
    siteName: 'مواقيت الصلاة',
    locale: 'ar_SA',
    alternateLocale: ['ar_EG', 'ar_MA', 'ar_AE', 'ar_IQ', 'ar_JO'],
    type: 'website',
  },

  // ── Twitter / X ───────────────────────────────────────────────────────────
  twitter: {
    card: 'summary_large_image',
    title: 'مواقيت الصلاة وخدمات الوقت الدقيقة',
    description: 'مواقيت الصلاة، فرق التوقيت، واتجاه القبلة — تحديث يومي',
  },
  verification: {
    google: 'verification_token', // Placeholder for user to fill later
  },
};

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#181C2A' },
    { media: '(prefers-color-scheme: light)', color: '#F2F4FF' },
  ],
  colorScheme: 'dark light',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  console.log(`[DEBUG - SSR] RootLayout started`);
  return (
    // suppressHydrationWarning is required because next-themes writes
    // class="dark|light|contrast" on <html> after hydration.
    //
    // theme-transition: defined in the CSS (section 30) — enables smooth
    // bg/color/border animations on every element when the theme class changes.
    // It MUST be on <html> (not <body>) to cover the full document tree.
    //
    // The font variable is passed so any component can reference
    // var(--font-noto-kufi) directly if needed alongside the body rule.
    <html
      lang="ar"
      dir="rtl"
      suppressHydrationWarning
      className={`${notoKufi.variable}`}
    >
      {/* The CSS @layer base already sets body styles:
            background-color: var(--bg-base)
            color:            var(--text-primary)
            font-family:      'Noto Kufi Arabic', system-ui, sans-serif
            min-height:       100dvh
            direction:        rtl
          So no colour or layout classes are needed here — they would
          duplicate or fight the design system's base rules.
          notoKufi.className activates the loaded font family. */}
      <body className={notoKufi.className}>
        <ThemeProvider>
          <Suspense fallback={<div className="h-16" />}>
            <Header />
          </Suspense>
          {children}
          {/* Sonner Toaster — dir and position match RTL layout */}
          <Toaster
            dir="rtl"
            position="top-center"
            richColors
            expand={false}
            toastOptions={{
              style: {
                fontFamily: 'var(--font-base)',
                fontSize: 'var(--text-sm)',
                borderRadius: 'var(--radius-xl)',
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}