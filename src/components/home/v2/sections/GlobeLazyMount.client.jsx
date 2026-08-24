'use client';

// home/v2/sections/GlobeLazyMount.client.jsx
// Restored 2026-08-23 per explicit owner preference ("the globe was better" than the CSS orbit
// that replaced it) — see TimeOrbitSection.jsx for the full history: this WebGL globe (Magic
// UI's Globe, backed by `cobe`) repeatedly failed to render in THIS session's own headless
// Puppeteer checks (flat black sphere, zero canvas, one outright browser crash on WebGL init),
// which is why it was swapped for a CSS-only orbit. The owner's real browser is the actual
// source of truth here, not a sandboxed headless check, so it's back — with the same
// IntersectionObserver-gated dynamic import as before (real perf win: this was measurably
// delaying the hero's NumberTicker start when it loaded unconditionally).
import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

const Globe = dynamic(() => import('@/components/ui/globe').then((m) => m.Globe), { ssr: false });

export default function GlobeLazyMount({ config, className }) {
  const ref = useRef(null);
  const [shouldMount, setShouldMount] = useState(false);

  useEffect(() => {
    if (shouldMount || !ref.current) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShouldMount(true);
          observer.disconnect();
        }
      },
      { rootMargin: '500px' },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [shouldMount]);

  return (
    <div ref={ref} className={className}>
      {shouldMount ? <Globe config={config} /> : null}
    </div>
  );
}
