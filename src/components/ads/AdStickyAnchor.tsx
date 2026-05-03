"use client";

/**
 * AdStickyAnchor — Fixed bottom banner  (v2 — CLS & UX fixed)
 * ─────────────────────────────────────────────────────────────────────────────
 * SIZE:    100vw × 60px fixed height
 *          Respects iOS safe-area-inset-bottom (home bar)
 *          Hidden on ≥960px via CSS
 *
 * v2 FIXES vs v1:
 *   ✅ Anchor hidden via `translateY(100%)` transform, not opacity alone
 *      → slides in from bottom, no layout shift
 *   ✅ sessionStorage check happens synchronously in useState initializer
 *      → avoids flash/re-render on dismissed state
 *   ✅ Cleaner dismiss animation uses transform (not opacity which was clipping)
 *
 * WHERE TO USE in root layout.tsx — LAST elements in <body>:
 *
 *   export default function RootLayout({ children }) {
 *     return (
 *       <html lang="ar" dir="rtl">
 *         <body>
 *           <Navbar />
 *           {children}
 *
 *           ← These two always come last, in this order:
 *           <div className="sticky-anchor-spacer" aria-hidden="true" />
 *           <AdStickyAnchor />
 *         </body>
 *       </html>
 *     );
 *   }
 *
 * WHY THE SPACER MUST BE UNCONDITIONAL:
 *   The .sticky-anchor-spacer CSS always reserves 68px on mobile.
 *   This means the last content item is NEVER hidden behind the anchor,
 *   whether or not the anchor is currently visible.
 *   This is the correct CLS-free pattern: reserve space first, fill later.
 *
 * BEHAVIOR:
 *   - Hidden below screen (translateY: 100%) on page load
 *   - Slides up after user scrolls scrollThreshold (default 25%) down
 *   - Dismissible via × button — remembers dismiss for the session
 *   - Does not re-appear if user dismisses, even after navigation
 */

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useMarketingPermission } from "@/lib/client/marketing";
import { useAdsRuntimeConfig } from "@/lib/client/public-runtime";
import { getAdRoutePolicy } from "@/lib/ads/route-policy";
import { logger, serializeError } from "@/lib/logger";

interface AdStickyAnchorProps {
  className?: string;
}

export default function AdStickyAnchor({
  className = "",
}: AdStickyAnchorProps) {
  const { clientId, manualSlots } = useAdsRuntimeConfig();
  const adSlot = manualSlots.stickyAnchor || "";
  const shouldRenderAds = Boolean(clientId && adSlot);
  const canLoadAds = useMarketingPermission(shouldRenderAds);
  const pathname = usePathname();
  const routePolicy = getAdRoutePolicy(pathname || "/");
  const [dismissed, setDismissed] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem("waqt-fullscreen-companion-dismissed") === "1";
  });
  const [visible, setVisible] = useState(false);
  const [fullscreenActive, setFullscreenActive] = useState(false);
  const loaded = useRef(false);

  useEffect(() => {
    if (typeof document === "undefined") return undefined;

    const update = () => {
      const active = document.body.classList.contains("has-css-fullscreen");
      setFullscreenActive(active);
      if (!active) {
        setVisible(false);
      } else if (!dismissed) {
        setVisible(true);
      }
    };

    update();

    const observer = new MutationObserver(update);
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, [dismissed]);

  useEffect(() => {
    if (!canLoadAds) return;
    if (!routePolicy.enableFullscreenCompanion) return;
    if (!fullscreenActive || !visible || loaded.current || dismissed) return;
    loaded.current = true;
    try {
      const adsWindow = window as Window & { adsbygoogle?: unknown[] };
      (adsWindow.adsbygoogle = adsWindow.adsbygoogle || []).push({});
    } catch (error) {
      logger.warn("adsense-sticky-anchor-init-failed", {
        component: "AdStickyAnchor",
        slotId: "sticky-anchor",
        error: serializeError(error),
      });
    }
  }, [canLoadAds, dismissed, fullscreenActive, routePolicy.enableFullscreenCompanion, visible]);

  const handleDismiss = () => {
    setVisible(false);
    setDismissed(true);
    sessionStorage.setItem("waqt-fullscreen-companion-dismissed", "1");
  };

  if (
    !shouldRenderAds ||
    !canLoadAds ||
    dismissed ||
    !routePolicy.enableFullscreenCompanion
  ) {
    return null;
  }

  return (
    <div
      className={[
        "ad-slot ad-slot--sticky-anchor",
        !fullscreenActive || !visible ? "is-hidden" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      role="complementary"
      aria-label="إعلانات"
      aria-hidden={!fullscreenActive || !visible}
    >
      {/* Label — visible per Google AdSense policy */}
      <span className="ad-slot__label">إعلانات</span>

      {/* Dismiss button */}
      <button
        type="button"
        className="ad-slot__close"
        onClick={handleDismiss}
        aria-label="إغلاق الإعلان"
      >
        ×
      </button>

      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={clientId || undefined}
        data-ad-slot={adSlot}
        data-ad-format="horizontal"
        data-full-width-responsive="true"
      />
    </div>
  );
}
