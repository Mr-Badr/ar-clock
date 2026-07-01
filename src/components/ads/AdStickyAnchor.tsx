"use client";

/**
 * AdStickyAnchor — Fixed bottom banner (mobile only, < 960px)
 * ─────────────────────────────────────────────────────────────────────────────
 * Slides up from the bottom after the user has scrolled 20% of the page.
 * Dismissible via × button — remembers dismiss for the session.
 *
 * IMPORTANT: `stickyAnchor` slot in manual-config.js must use a dedicated
 * Anchor/Bottom banner ad unit from AdSense — NOT the same slot ID as
 * topBanner. Using a Display slot ID here causes impression conflicts on pages
 * where both the top banner and sticky anchor coexist.
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

export default function AdStickyAnchor({ className }: AdStickyAnchorProps) {
  const resolvedClassName = className ?? "";
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
  const loaded = useRef(false);

  // Slide up after user scrolls 20% of page height
  useEffect(() => {
    if (dismissed) return;

    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total > 0 && window.scrollY / total > 0.20) {
        setVisible(true);
      }
    };

    // Check on mount in case the page is already scrolled
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [dismissed]);

  // Load the ad once the banner becomes visible (only once per mount)
  useEffect(() => {
    if (!canLoadAds) return;
    if (!routePolicy.enableFullscreenCompanion) return;
    if (!visible || loaded.current || dismissed) return;
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
  }, [canLoadAds, dismissed, routePolicy.enableFullscreenCompanion, visible]);

  const handleDismiss = () => {
    setVisible(false);
    setDismissed(true);
    sessionStorage.setItem("waqt-fullscreen-companion-dismissed", "1");
  };

  if (!shouldRenderAds || !canLoadAds || dismissed || !routePolicy.enableFullscreenCompanion) {
    return null;
  }

  return (
    <div
      className={[
        "ad-slot ad-slot--sticky-anchor",
        !visible ? "is-hidden" : "",
        resolvedClassName,
      ]
        .filter(Boolean)
        .join(" ")}
      role="complementary"
      aria-label="إعلان"
      aria-hidden={!visible}
    >
      <span className="ad-slot__label">إعلان</span>

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
