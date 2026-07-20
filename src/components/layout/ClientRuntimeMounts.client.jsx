'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

const AdSenseProvider = dynamic(() => import('@/components/ads/AdSenseProvider'), { ssr: false });
const AdBlockDetector = dynamic(() => import('@/components/ads/AdBlockDetector.client'), { ssr: false });
const AdStickyAnchor = dynamic(() => import('@/components/ads/AdStickyAnchor'), { ssr: false });
const AnalyticsProvider = dynamic(() => import('@/components/analytics/AnalyticsProvider'), { ssr: false });
const ConsentBanner = dynamic(() => import('@/components/consent/ConsentBanner'), { ssr: false });
const ScrollToTopOnNav = dynamic(() => import('@/components/layout/ScrollToTopOnNav.client'), { ssr: false });
const ScrollToTopButton = dynamic(() => import('@/components/layout/ScrollToTopButton'), { ssr: false });
const ServiceWorkerRegistration = dynamic(() => import('@/components/ServiceWorkerRegistration'), { ssr: false });
const SiteVisitTracker = dynamic(() => import('@/components/site/SiteVisitTracker.client'), { ssr: false });
const WebVitalsReporter = dynamic(() => import('@/components/analytics/WebVitalsReporter.client'), { ssr: false });
const Toaster = dynamic(() => import('sonner').then((module) => module.Toaster), { ssr: false });

function scheduleIdle(callback) {
  if (typeof window === "undefined") return () => {};

  let didRun = false;
  const runOnce = () => {
    if (didRun) return;
    didRun = true;
    callback();
  };
  const timeoutId = window.setTimeout(runOnce, 2400);
  let idleId = null;

  if ('requestIdleCallback' in window) {
    idleId = window.requestIdleCallback(runOnce, { timeout: 1800 });
  }

  return () => {
    window.clearTimeout(timeoutId);
    if (idleId !== null && 'cancelIdleCallback' in window) {
      window.cancelIdleCallback(idleId);
    }
  };
}

export default function ClientRuntimeMounts() {
  const [hydrated, setHydrated] = useState(false);
  const [idle, setIdle] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setHydrated(true);
    return scheduleIdle(() => {
      setIdle(true);
    });
  }, []);

  // Mark homepage so ads.css can hide Auto Ads side rail panels at laptop widths
  // where the wide hero layout leaves < 100px gutter (side rails would overlap content).
  // All other pages use narrower containers and Google's own space-detection handles it.
  useEffect(() => {
    if (pathname === '/') {
      document.body.classList.add('home-hero-wide');
    } else {
      document.body.classList.remove('home-hero-wide');
    }
  }, [pathname]);

  // Embed widgets (/embed/*) are meant to be iframed into a third-party page —
  // hide this site's own chrome (nav, footer, ads, consent banner) so only the
  // widget content shows. See embed-mode rules in globals.css.
  const isEmbed = pathname?.startsWith('/embed/');
  useEffect(() => {
    document.documentElement.classList.toggle('embed-mode', Boolean(isEmbed));
  }, [isEmbed]);

  return (
    <>
      {hydrated && !isEmbed ? <><ConsentBanner /><ScrollToTopOnNav /></> : null}
      {idle && !isEmbed ? (
        <>
          <AdStickyAnchor />
          <SiteVisitTracker />
          <ScrollToTopButton />
          <AnalyticsProvider />
          <WebVitalsReporter />
          <AdSenseProvider />
          <AdBlockDetector />
          <ServiceWorkerRegistration />
          <Toaster
            dir="rtl"
            position="top-center"
            richColors
            expand={false}
            toastOptions={{
              style: {
                fontFamily: 'var(--font-base)',
                fontSize: 'var(--text-sm)',
                borderRadius: 'var(--radius-lg)',
              },
            }}
          />
        </>
      ) : null}
    </>
  );
}
