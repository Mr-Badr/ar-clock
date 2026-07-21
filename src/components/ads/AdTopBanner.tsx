"use client";

/**
 * AdTopBanner — Horizontal leaderboard  (v3 — moved above the H1)
 * ─────────────────────────────────────────────────────────────────────────────
 * SIZE:    320×50 mobile  |  728×90 tablet  |  970×90 desktop
 * CLS:     Reserved via aspect-ratio + min-height in CSS
 *
 * ⚠️  PLACEMENT HISTORY:
 *   v1: Banner placed BEFORE <h1> (between breadcrumb and title)
 *   v2 (2026-06/07): moved AFTER <h1> — reasoned that Google's viewability
 *     research favors ads just below the first content element, and that
 *     Googlebot benefits from seeing the H1 before any ad markup.
 *   v3 (2026-07-21): moved back to BEFORE the H1 — first element inside
 *     <main>, right below the fixed navbar. Reason: a 2026-07-16 revenue
 *     audit found this site's traffic is overwhelmingly quick-glance
 *     (single-lookup prayer/time/countdown pages, ~96% mobile) and most
 *     sessions generate at most ONE viewable ad impression before leaving —
 *     usually whichever ad is highest on the page. A tall hero (interactive
 *     tool, multi-line intro, nav grid) can push an after-H1 banner well
 *     past what a fast-bouncing visitor ever sees. Putting the ad first
 *     guarantees it renders in the same viewport as the navbar on every
 *     page, independent of hero height — this matters more for a CPM/RPM-
 *     driven revenue model than the CTR argument v2 was optimized for.
 *     Kept small and clean: single unit, reserved-height slot (no CLS),
 *     IntersectionObserver lazy-load so an impression is only logged if it
 *     actually enters the viewport, and it never renders on ad-free routes.
 *
 * CORRECT JSX ORDER:
 *
 *   <main>
 *     <AdTopBanner slotId="top-country" />             ← first thing, before breadcrumb/H1
 *     <nav aria-label="مسار التنقل">... breadcrumb ...</nav>
 *     <h1 className="...">عنوان الصفحة</h1>
 *     <PrayerTimesTable />                              ← then content
 *
 * USE ON:
 *   ✅ Every indexable content page (country/city pages, article/info pages,
 *      listing pages, the homepage) — one instance per page, first thing
 *      inside <main>, before the breadcrumb/H1.
 *   ❌ Settings / forms pages (short pages with no content revenue)
 *   ❌ Ad-free routes (enforced automatically via getAdRoutePolicy below —
 *      /about, /contact, /privacy, /terms, /search, /fahras, /embed/*, etc.)
 */

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { getRouteManualAdSlotKey, resolveManualAdSlot } from "@/lib/ads/slot-resolution";
import { getAdRoutePolicy } from "@/lib/ads/route-policy";
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
  const routePolicy = getAdRoutePolicy(pathname || "/");
  const shouldRenderAds = Boolean(clientId && adSlot) && routePolicy.allowAdDelivery;
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
