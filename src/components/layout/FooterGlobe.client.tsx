'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';

const Globe = dynamic(
  () => import('@/components/ui/globe').then((module) => module.Globe),
  {
    ssr: false,
    loading: () => <div className="footer-globe-placeholder" aria-hidden="true" />,
  },
);

function canRenderAnimatedGlobe() {
  if (typeof window === 'undefined') return false;

  const media = window.matchMedia?.('(prefers-reduced-motion: reduce)');
  if (media?.matches) return false;

  const navigatorWithConnection = navigator as Navigator & {
    connection?: { saveData?: boolean; effectiveType?: string };
    mozConnection?: { saveData?: boolean; effectiveType?: string };
    webkitConnection?: { saveData?: boolean; effectiveType?: string };
  };
  const connection =
    navigatorWithConnection.connection ||
    navigatorWithConnection.mozConnection ||
    navigatorWithConnection.webkitConnection;

  if (connection?.saveData) return false;
  if (connection?.effectiveType === 'slow-2g' || connection?.effectiveType === '2g') {
    return false;
  }

  return true;
}

export default function FooterGlobe() {
  const shellRef = useRef<HTMLDivElement | null>(null);
  const [shouldRenderGlobe, setShouldRenderGlobe] = useState(false);

  useEffect(() => {
    if (shouldRenderGlobe || !canRenderAnimatedGlobe()) return undefined;

    const shell = shellRef.current;
    if (!shell) return undefined;

    if (!('IntersectionObserver' in window)) {
      setShouldRenderGlobe(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldRenderGlobe(true);
          observer.disconnect();
        }
      },
      { rootMargin: '600px 0px' },
    );

    observer.observe(shell);

    return () => observer.disconnect();
  }, [shouldRenderGlobe]);

  return (
    <div ref={shellRef} className="footer-globe-shell" aria-hidden="true">
      <div className="footer-globe-inner">
        {shouldRenderGlobe ? (
          <Globe className="footer-globe-canvas" />
        ) : (
          <div className="footer-globe-placeholder" />
        )}
      </div>
    </div>
  );
}
