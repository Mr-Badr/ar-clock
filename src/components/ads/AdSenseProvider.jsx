"use client";

/**
 * AdSenseProvider — Global AdSense script loader
 * ─────────────────────────────────────────────────────────────────────────────
 * ADD TO: app/layout.tsx — once, in the root layout.
 *
 * Uses Next.js <Script> with strategy="afterInteractive" — this means:
 *   - Script loads AFTER the page becomes interactive (not render-blocking)
 *   - LCP is not affected by the AdSense script
 *   - AdSense initializes correctly for all ad slots on the page
 *
 * Also adds DNS preconnect hints for faster ad loading.
 *
 * USAGE in app/layout.tsx:
 *
 *   import AdSenseProvider from "@/components/ads/AdSenseProvider";
 *
 *   export default function RootLayout({ children }) {
 *     return (
 *       <html lang="ar" dir="rtl">
 *         <head>
 *           // AdSense preconnect — speeds up ad creative loading
 *           <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
 *           <link rel="preconnect" href="https://googleads.g.doubleclick.net" />
 *           <link rel="dns-prefetch" href="https://googleads.g.doubleclick.net" />
 *         </head>
 *         <body>
 *           <Navbar />
 *           {children}
 *           <div className="sticky-anchor-spacer" aria-hidden="true" />
 *           <AdStickyAnchor />
 *           <AdSenseProvider />   ← load script last — non-blocking
 *         </body>
 *       </html>
 *     );
 *   }
 *
 * WHY 'use client':
 *   Next.js <Script> with onError cannot be passed through Server Component
 *   boundaries because event handlers are not serializable.
 *   'use client' keeps it out of the SSR stream — the script still defers via
 *   strategy="afterInteractive" so there is zero LCP impact.
 *
 * WHY NOT IN <head>:
 *   AdSense script in <head> blocks HTML parsing → slower LCP.
 *   `strategy="afterInteractive"` defers it until after React hydration.
 *   All ad slots are lazy-loaded via IntersectionObserver anyway, so there's
 *   no race condition — slots request creatives only when near viewport.
 */

import Script from "next/script";
import { useMarketingPermission } from "@/lib/client/marketing";
import { useAdsRuntimeConfig } from "@/lib/client/public-runtime";
import { logger, serializeError } from "@/lib/logger";

export default function AdSenseProvider() {
  const { autoAdsEnabled, clientId } = useAdsRuntimeConfig();
  const shouldLoadAds = Boolean(clientId);
  const canLoad = useMarketingPermission(shouldLoadAds);

  if (!shouldLoadAds || !canLoad) return null;

  return (
    <>
      <Script
        id="adsense-script"
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`}
        crossOrigin="anonymous"
        strategy="afterInteractive"
        onError={(e) => {
          logger.warn("adsense-script-load-failed", {
            component: "AdSenseProvider",
            error: serializeError(e),
          });
        }}
      />
      {autoAdsEnabled ? (
        <Script id="adsense-auto-ads" strategy="afterInteractive">
          {`
            try {
              (window.adsbygoogle = window.adsbygoogle || []).push({
                google_ad_client: '${clientId}',
                enable_page_level_ads: true
              });
            } catch (_) {}
          `}
        </Script>
      ) : null}
    </>
  );
}
