import './globals.css';
import './waqt-ui.css';
import './styles/economy.css';
import { Suspense } from 'react';
import type { Metadata } from 'next';
import { IBM_Plex_Sans_Arabic, Noto_Sans_Arabic } from 'next/font/google';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/components/theme-provider';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/Footer';
import AdSenseProvider from '@/components/ads/AdSenseProvider';
import AdStickyAnchor from '@/components/ads/AdStickyAnchor';
import AnalyticsProvider from '@/components/analytics/AnalyticsProvider';
import ConsentBanner from '@/components/consent/ConsentBanner';
import ServiceWorkerRegistration from '@/components/ServiceWorkerRegistration';
import { Analytics } from '@vercel/analytics/next';
import { getEnv } from '@/lib/env.server';
import {
  SITE_BRAND,
  SITE_BRAND_EN,
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_TITLE,
  getMetadataBase,
} from '@/lib/site-config';

const env = getEnv();
const adsFeatureEnabled = process.env.NEXT_PUBLIC_ENABLE_ADS === 'true';
// Body copy uses Noto Sans Arabic across the app.
// The heavier weights are still needed by the design system for clocks/heroes.
const notoSansArabic = Noto_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-noto-sans-arabic',
  display: 'swap',
  preload: true,
});

// Headings use IBM Plex Sans Arabic for a clearer visual hierarchy.
const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-ibm-plex-sans-arabic',
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  // ── Core ──────────────────────────────────────────────────────────────────
  metadataBase: getMetadataBase(),
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_BRAND}`,
  },
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  authors: [{ name: `${SITE_BRAND} (${SITE_BRAND_EN}) — منصة عربية للوقت والتاريخ والمواقيت` }],
  category: 'utilities',
  classification: 'Public',

  applicationName: SITE_BRAND,
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: SITE_BRAND },

  // ── Robots ────────────────────────────────────────────────────────────────
  robots: {
    index: true, follow: true,
    googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large', 'max-video-preview': -1 },
  },

  // ── Open Graph ────────────────────────────────────────────────────────────
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    siteName: SITE_BRAND,
    locale: 'ar_SA',
    alternateLocale: ['ar_EG', 'ar_MA', 'ar_AE', 'ar_IQ', 'ar_JO'],
    type: 'website',
  },

  // ── Twitter / X ───────────────────────────────────────────────────────────
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  verification: env.GOOGLE_SITE_VERIFICATION
    ? {
      google: env.GOOGLE_SITE_VERIFICATION,
    }
    : undefined,
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
  return (
    // suppressHydrationWarning is required because next-themes writes
    // class="dark|light|contrast" on <html> after hydration.
    //
    // theme-transition: defined in the CSS (section 30) — enables smooth
    // bg/color/border animations on every element when the theme class changes.
    // It MUST be on <html> (not <body>) to cover the full document tree.
    //
    // Font variables are passed on <html> so the design system can map
    // body copy and headings to different families.
    <html
      lang="ar"
      dir="rtl"
      suppressHydrationWarning
      className={`dark ${notoSansArabic.variable} ${ibmPlexSansArabic.variable}`}
    >
      {/* The CSS @layer base already sets body styles:
            background-color: var(--bg-base)
            color:            var(--text-primary)
            font-family:      var(--font-base)
            min-height:       100dvh
            direction:        rtl
          So no colour or layout classes are needed here — they would
          duplicate or fight the design system's base rules.
          notoSansArabic.className activates the body font family. */}
      <body className={notoSansArabic.className}>
        <ThemeProvider>
          <Suspense fallback={<div className="h-16" />}>
            <Header />
          </Suspense>
          {children}
          <Analytics />
          <Suspense fallback={<div className="h-24" />}>
            <Footer />
          </Suspense>
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

          {adsFeatureEnabled && <div className="sticky-anchor-spacer" aria-hidden="true" />}
          <AdStickyAnchor />
          <ConsentBanner />
          <AnalyticsProvider />
          <AdSenseProvider />
          <ServiceWorkerRegistration />
        </ThemeProvider>
      </body>
    </html>
  );
}
