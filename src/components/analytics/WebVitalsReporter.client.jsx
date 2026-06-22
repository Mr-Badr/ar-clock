'use client';

import { useReportWebVitals } from 'next/web-vitals';
import { usePathname } from 'next/navigation';
import { useAnalyticsRuntimeConfig } from '@/lib/client/public-runtime';

function getRouteFamily(pathname) {
  if (!pathname) return 'other';
  if (pathname.startsWith('/mwaqit-al-salat')) return 'prayer';
  if (pathname.startsWith('/holidays')) return 'holiday';
  if (pathname.startsWith('/calculators')) return 'calculator';
  if (pathname.startsWith('/time-now')) return 'time-now';
  if (pathname.startsWith('/time-difference')) return 'time-difference';
  if (pathname.startsWith('/blog')) return 'blog';
  if (pathname.startsWith('/date')) return 'date';
  if (pathname === '/') return 'home';
  return 'other';
}

export default function WebVitalsReporter() {
  const pathname = usePathname();
  const { enabled, gaMeasurementId, gtmId, mode } = useAnalyticsRuntimeConfig();

  useReportWebVitals((metric) => {
    if (!enabled) return;

    const routeFamily = getRouteFamily(pathname);
    const { name, value, rating, id } = metric;

    if (mode === 'ga4' && typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', name, {
        send_to: gaMeasurementId,
        value: Math.round(name === 'CLS' ? value * 1000 : value),
        metric_id: id,
        metric_value: value,
        metric_delta: metric.delta,
        metric_rating: rating,
        route_family: routeFamily,
        non_interaction: true,
      });
      return;
    }

    if (mode === 'gtm' && typeof window !== 'undefined') {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'web_vitals',
        webVitalName: name,
        webVitalValue: Math.round(name === 'CLS' ? value * 1000 : value),
        webVitalRating: rating,
        webVitalId: id,
        routeFamily,
      });
    }
  });

  return null;
}
