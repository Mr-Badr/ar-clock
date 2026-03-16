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
 * WHY NOT IN <head>:
 *   AdSense script in <head> blocks HTML parsing → slower LCP.
 *   `strategy="afterInteractive"` defers it until after React hydration.
 *   All ad slots are lazy-loaded via IntersectionObserver anyway, so there's
 *   no race condition — slots request creatives only when near viewport.
 */

import Script from "next/script";

export default function AdSenseProvider() {
  // ─────────────────────────────────────────────────────────────────────────
  // TODO: Replace XXXXXXXXXXXXXXXX with your real AdSense publisher ID
  // Find it in AdSense dashboard → Account → Account information → Publisher ID
  // Format: ca-pub-XXXXXXXXXXXXXXXX
  // ─────────────────────────────────────────────────────────────────────────
  const publisherId = "ca-pub-XXXXXXXXXXXXXXXX";

  return (
    <Script
      id="adsense-script"
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
      // onError: don't let AdSense script errors crash the page
      onError={(e) => {
        console.warn("AdSense script failed to load:", e);
      }}
    />
  );
}