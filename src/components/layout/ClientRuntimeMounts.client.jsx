'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const AdSenseProvider = dynamic(() => import('@/components/ads/AdSenseProvider'), { ssr: false });
const AdStickyAnchor = dynamic(() => import('@/components/ads/AdStickyAnchor'), { ssr: false });
const AnalyticsProvider = dynamic(() => import('@/components/analytics/AnalyticsProvider'), { ssr: false });
const ConsentBanner = dynamic(() => import('@/components/consent/ConsentBanner'), { ssr: false });
const ScrollToTopButton = dynamic(() => import('@/components/layout/ScrollToTopButton'), { ssr: false });
const ServiceWorkerRegistration = dynamic(() => import('@/components/ServiceWorkerRegistration'), { ssr: false });
const SiteVisitTracker = dynamic(() => import('@/components/site/SiteVisitTracker.client'), { ssr: false });
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

  useEffect(() => {
    setHydrated(true);
    return scheduleIdle(() => {
      setIdle(true);
    });
  }, []);

  return (
    <>
      {hydrated ? <ConsentBanner /> : null}
      {idle ? (
        <>
          <AdStickyAnchor />
          <SiteVisitTracker />
          <ScrollToTopButton />
          <AnalyticsProvider />
          <AdSenseProvider />
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
