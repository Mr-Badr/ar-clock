"use client";

/**
 * AdTopBanner — Horizontal leaderboard  (v2 — placement corrected)
 * ─────────────────────────────────────────────────────────────────────────────
 * SIZE:    320×50 mobile  |  728×90 tablet  |  970×90 desktop
 * CLS:     Reserved via aspect-ratio + min-height in CSS
 *
 * ⚠️  v1 vs v2 PLACEMENT CHANGE:
 *   v1: Banner placed BEFORE <h1> (between breadcrumb and title)
 *   v2: Banner placed AFTER <h1> (between title and first content block)
 *
 *   WHY: Google's viewability research shows ads just BELOW the first content
 *   element (the H1 title) have HIGHER viewability AND CTR than ads above it.
 *   Also: Googlebot needs to see your H1 BEFORE any ad markup for correct
 *   topic classification and SEO ranking.
 *
 * CORRECT JSX ORDER:
 *
 *   <nav aria-label="مسار التنقل">... breadcrumb ...</nav>
 *   <h1 className="...">عنوان الصفحة</h1>           ← SEO first
 *   <AdTopBanner slotId="top-country" />             ← THEN banner
 *   <PrayerTimesTable />                             ← then content
 *
 * USE ON:
 *   ✅ Country pages (/mwaqit-al-salat/[country])
 *   ✅ City pages    (/mwaqit-al-salat/[country]/[city])
 *   ✅ Article / info pages
 *   ✅ Listing pages (countries list, cities list)
 *   ❌ Homepage hero (the hero IS the above-fold — skip banner)
 *   ❌ Settings / forms pages (short pages with no content revenue)
 */

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { getRouteManualAdSlotKey, resolveManualAdSlot } from "@/lib/ads/slot-resolution";
import { watchAdFill } from "@/lib/ads/unfilled";
import { useMarketingPermission } from "@/lib/client/marketing";
import { useAdsRuntimeConfig } from "@/lib/client/public-runtime";
import { logger, serializeError } from "@/lib/logger";

interface AdTopBannerProps {
  /** Unique ID per page to prevent AdSense slot conflicts */
  slotId?: string;
  /** Optional family-specific slot key, falls back to topBanner. */
  slotKey?: string;
  className?: string;
}

export default function AdTopBanner({
  slotId = "top-banner",
  slotKey,
  className = "",
}: AdTopBannerProps) {
  const { clientId, manualSlots } = useAdsRuntimeConfig();
  const pathname = usePathname();
  const preferredSlotKey = slotKey || getRouteManualAdSlotKey(pathname || "/", "topBanner");
  const adSlot = resolveManualAdSlot(manualSlots, preferredSlotKey, "topBanner");
  const shouldRenderAds = Boolean(clientId && adSlot);
  const canLoadAds = useMarketingPermission(shouldRenderAds);
  const ref = useRef<HTMLDivElement>(null);
  const insRef = useRef<HTMLModElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUnfilled, setIsUnfilled] = useState(false);
  const loaded = useRef(false);

  useEffect(() => {
    if (!canLoadAds) return;
    if (!ref.current || loaded.current) return;

    let stopWatch: (() => void) | undefined;

    // Load when the slot is just about to enter the viewport. Kept tight
    // (50px, was 200px) because AdSense counts the impression at render time:
    // a generous pre-load margin logs unviewable impressions on quick-bounce
    // pages, which is what the 2026-07 unit report showed (Active View 0.34 on
    // the events top banner, 0.00 on the date banner). Space is reserved via
    // CSS, so the tighter margin costs at most a brief fill-in, not CLS.
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !loaded.current) {
            loaded.current = true;
            setIsLoading(false);
            try {
              const adsWindow = window as Window & { adsbygoogle?: unknown[] };
              (adsWindow.adsbygoogle = adsWindow.adsbygoogle || []).push({});
            } catch (error) {
              logger.warn("adsense-top-banner-init-failed", {
                component: "AdTopBanner",
                slotId,
                error: serializeError(error),
              });
            }

            // Collapse the reserved space if Google returns no ad (unfilled).
            stopWatch = watchAdFill(insRef.current, () => setIsUnfilled(true));

            observer.disconnect();
          }
        });
      },
      { rootMargin: "50px 0px" }
    );

    observer.observe(ref.current);
    return () => {
      observer.disconnect();
      stopWatch?.();
    };
  }, [canLoadAds]);

  if (!shouldRenderAds || !canLoadAds || isUnfilled) return null;

  return (
    <div
      id={slotId}
      ref={ref}
      className={`ad-slot ad-slot--top-banner ${isLoading ? "is-loading" : ""} ${className}`}
      role="complementary"
      aria-label="إعلان"
    >
      {/* Label — required by Google AdSense policy to be visible */}
      <span className="ad-slot__label">إعلان</span>
      {/* format="horizontal" (not "auto"): the slot reserves a 50–100px banner
          box with overflow:hidden, and "auto" lets Google return 250px+ tall
          rectangles that get clipped mid-creative — broken-looking ads and a
          policy risk. Horizontal shapes always fit the reserved space. */}
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={clientId || undefined}
        data-ad-slot={adSlot}
        data-ad-format="horizontal"
        data-full-width-responsive="false"
      />
    </div>
  );
}
