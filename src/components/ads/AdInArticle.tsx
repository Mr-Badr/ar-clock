"use client";

/**
 * AdInArticle — Fluid native unit between editorial sections
 * ─────────────────────────────────────────────────────────────────────────────
 * SIZE:    Responsive width with variable height, controlled by AdSense.
 *          The CSS reserves a stable minimum before the creative loads.
 *
 * WHERE TO USE — BETWEEN major content sections, never inside them:
 *
 *   <PrayerTimesTable />
 *
 *   <AdInArticle slotId="mid-country-1" />        ← BETWEEN sections
 *
 *   <CityListSection />
 *
 *   ← optional second ad, only if page has 3+ major sections:
 *   <AdInArticle slotId="mid-country-2" />
 *
 *   <RelatedPagesSection />
 *
 * RULES:
 *   ✅ Max 2 per page (3+ hurts eCPM via inventory dilution)
 *   ✅ At least one major content block (not just a divider) between two ads
 *   ✅ margin-block: var(--space-10) already in CSS — don't add extra margin
 *   ❌ Never two AdInArticle back-to-back (violates AdSense policy)
 *   ❌ Never as first element on page (Googlebot quality signal)
 *   ❌ Never inside a .card — between cards only
 */

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { getRouteManualAdSlotKey, resolveManualAdSlot } from "@/lib/ads/slot-resolution";
import { watchAdFill } from "@/lib/ads/unfilled";
import { useMarketingPermission } from "@/lib/client/marketing";
import { useAdsRuntimeConfig } from "@/lib/client/public-runtime";
import { logger, serializeError } from "@/lib/logger";

interface AdInArticleProps {
  slotId?: string;
  slotKey?: string;
  className?: string;
}

export default function AdInArticle({
  slotId = "in-article",
  slotKey,
  className = "",
}: AdInArticleProps) {
  const { clientId, manualSlots } = useAdsRuntimeConfig();
  const pathname = usePathname();
  const preferredSlotKey = slotKey || getRouteManualAdSlotKey(pathname || "/", "inArticle");
  const adSlot = resolveManualAdSlot(manualSlots, preferredSlotKey, "inArticle");
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
              logger.warn("adsense-in-article-init-failed", {
                component: "AdInArticle",
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
      // Tight margin (was 300px): impressions are counted at render, so a wide
      // pre-load logs unviewable impressions on quick-bounce pages (2026-07
      // unit report: in-article Active View 0.375). Space is CSS-reserved.
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
      className={`ad-slot ad-slot--in-article ${isLoading ? "is-loading" : ""} ${className}`}
      role="complementary"
      aria-label="إعلان"
    >
      <span className="ad-slot__label">إعلان</span>
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: "block", textAlign: "center" }}
        data-ad-client={clientId || undefined}
        data-ad-slot={adSlot}
        data-ad-layout="in-article"
        data-ad-format="fluid"
      />
    </div>
  );
}
