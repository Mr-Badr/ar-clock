"use client";

/**
 * AdSenseProvider — Global AdSense script loader
 * ─────────────────────────────────────────────────────────────────────────────
 * ADD TO: app/layout.tsx — once, in the root layout.
 *
 * Uses Next.js <Script> with strategy="lazyOnload" — this means:
 *   - Script loads after the window load event and idle time
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
 *   strategy="lazyOnload" so it does not compete with LCP.
 *
 * WHY NOT IN <head>:
 *   AdSense script in <head> blocks HTML parsing → slower LCP.
 *   `strategy="lazyOnload"` defers it until after the page has loaded.
 *   All ad slots are lazy-loaded via IntersectionObserver anyway, so there's
 *   no race condition — slots request creatives only when near viewport.
 */

import Script from "next/script";
import { usePathname } from "next/navigation";
import { getAdRoutePolicy } from "@/lib/ads/route-policy";
import { useMarketingPermission } from "@/lib/client/marketing";
import { useAdsRuntimeConfig } from "@/lib/client/public-runtime";
import { logger, serializeError } from "@/lib/logger";

export default function AdSenseProvider() {
  const { autoAdsEnabled, clientId } = useAdsRuntimeConfig();
  const pathname = usePathname();
  const routePolicy = getAdRoutePolicy(pathname || "/");
  const shouldLoadAds = Boolean(clientId) && routePolicy.allowAdDelivery;
  const canLoad = useMarketingPermission(shouldLoadAds);

  if (!shouldLoadAds || !canLoad) return null;

  return (
    <>
      <Script
        id="adsense-script"
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`}
        crossOrigin="anonymous"
        strategy="lazyOnload"
        onError={(e) => {
          logger.warn("adsense-script-load-failed", {
            component: "AdSenseProvider",
            error: serializeError(e),
          });
          try {
            window.dispatchEvent(new CustomEvent("miqat-adsense-blocked"));
          } catch (_) {
            // best-effort signal for AdBlockDetector — ignore if unavailable
          }
        }}
      />
      {autoAdsEnabled && routePolicy.enableAutoAds ? (
        <Script id="adsense-auto-ads" strategy="lazyOnload">
          {`
            try {
              (window.adsbygoogle = window.adsbygoogle || []).push({
                google_ad_client: '${clientId}',
                enable_page_level_ads: true,
                overlays: { bottom: false }
              });
            } catch (_) {}
          `}
        </Script>
      ) : null}
    </>
  );
}
