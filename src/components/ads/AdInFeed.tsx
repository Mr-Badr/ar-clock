"use client";

/**
 * AdInFeed — Native card-sized ad  (v2 — min-width fix)
 * ─────────────────────────────────────────────────────────────────────────────
 * SIZE:    100% of grid card slot width (controlled by parent grid)
 *          Height: fluid, min-height: 120px via CSS
 *
 * v2 CHANGE: Removed `min-width: 250px` from CSS.
 *   v1 had `min-width: 250px` which conflicted with narrow grid columns on
 *   small phones, causing horizontal overflow.
 *   v2: The parent `.grid-auto` (minmax(260px, 1fr)) controls min-width —
 *   the ad slot just fills 100% of whatever slot it's placed in.
 *   AdSense 250px minimum is met because the grid column is ≥260px.
 *
 * WHERE TO USE — inside grid/list item maps:
 *
 *   {countries.map((country, i) => (
 *     <React.Fragment key={country.slug}>
 *       <CountryCard country={country} />
 *       {(i + 1) % 6 === 0 && (
 *         <AdInFeed slotId={`feed-${Math.floor(i / 6)}`} />
 *       )}
 *     </React.Fragment>
 *   ))}
 *
 * RULES:
 *   ✅ First ad after item index 5 minimum (not index 0, 1, 2...)
 *   ✅ Max 1 ad per 5 real items (Google policy)
 *   ✅ Uses .card class so it visually matches surrounding cards
 *   ❌ Never inject two consecutive AdInFeed
 */

import { useEffect, useRef, useState } from "react";
import { useMarketingPermission } from "@/lib/client/marketing";
import { useAdsRuntimeConfig } from "@/lib/client/public-runtime";
import { logger, serializeError } from "@/lib/logger";

interface AdInFeedProps {
  slotId?: string;
  className?: string;
}

export default function AdInFeed({
  slotId = "in-feed",
  className = "",
}: AdInFeedProps) {
  const { clientId, manualSlots } = useAdsRuntimeConfig();
  const adSlot = manualSlots.inFeed || "";
  const shouldRenderAds = Boolean(clientId && adSlot);
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
              logger.warn("adsense-in-feed-init-failed", {
                component: "AdInFeed",
                slotId,
                error: serializeError(error),
              });
            }

            observer.disconnect();
          }
        });
      },
      { rootMargin: "400px 0px" }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [canLoadAds, slotId]);

  if (!shouldRenderAds || !canLoadAds) return null;

  return (
    <div
      id={slotId}
      ref={ref}
      className={`card ad-slot ad-slot--in-feed ${isLoading ? "is-loading" : ""} ${className}`}
      role="complementary"
      aria-label="إعلانات"
    >
      <span className="ad-slot__label">إعلانات</span>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={clientId || undefined}
        data-ad-slot={adSlot}
        data-ad-format="fluid"
        data-ad-layout-key={manualSlots.inFeedLayoutKey || undefined}
      />
    </div>
  );
}
