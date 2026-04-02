"use client";

/**
 * AdInArticle — Medium Rectangle MPU  (v2 — aspect-ratio CLS fix)
 * ─────────────────────────────────────────────────────────────────────────────
 * SIZE:    300×250 — highest eCPM unit industry-wide. Max width 336px.
 *          Centered in content column.
 *
 * v2 CHANGE: Uses `aspect-ratio: 300/250` in CSS (instead of only min-height).
 *   aspect-ratio is more reliable for CLS prevention on fluid-width containers.
 *   The CSS also adds `content-visibility: auto` for render performance on
 *   long pages with multiple sections.
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
import {
  isPublicEnvEnabled,
  useMarketingPermission,
} from "@/lib/client/marketing";

interface AdInArticleProps {
  slotId?: string;
  className?: string;
}

export default function AdInArticle({
  slotId = "in-article",
  className = "",
}: AdInArticleProps) {
  const adsEnabled = isPublicEnvEnabled(process.env.NEXT_PUBLIC_ENABLE_ADS);
  const clientId = (process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "").trim();
  const adSlot = (process.env.NEXT_PUBLIC_ADSENSE_IN_ARTICLE_SLOT || "").trim();
  const shouldRenderAds = adsEnabled && clientId.startsWith("ca-pub-") && Boolean(adSlot);
  const canLoadAds = useMarketingPermission(shouldRenderAds);
  const ref = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const loaded = useRef(false);

  useEffect(() => {
    if (!canLoadAds) return;
    if (!ref.current || loaded.current) return;

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
              console.warn("AdSense in-article slot failed to initialize:", error);
            }

            observer.disconnect();
          }
        });
      },
      { rootMargin: "300px 0px" }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [canLoadAds]);

  if (!shouldRenderAds || !canLoadAds) return null;

  return (
    <div
      id={slotId}
      ref={ref}
      className={`ad-slot ad-slot--in-article ${isLoading ? "is-loading" : ""} ${className}`}
      role="complementary"
      aria-label="إعلانات"
    >
      <span className="ad-slot__label">إعلانات</span>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={clientId}
        data-ad-slot={adSlot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
