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
 *         <AdInFeed slotId={`feed-${Math.floor(i / 4)}`} />
 *       )}
 *     </React.Fragment>
 *   ))}
 *
 * RULES:
 *   ✅ First ad after at least four real feed items
 *   ✅ Keep at least four real content items between native ads
 *   ✅ Aligns with the feed rhythm while staying visually marked as an ad
 *   ❌ Never inject two consecutive AdInFeed
 */

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { getRouteManualAdSlotKey, resolveManualAdSlot } from "@/lib/ads/slot-resolution";
import { useMarketingPermission } from "@/lib/client/marketing";
import { useAdsRuntimeConfig } from "@/lib/client/public-runtime";
import { logger, serializeError } from "@/lib/logger";

interface AdInFeedProps {
  slotId?: string;
  slotKey?: string;
  className?: string;
}

export default function AdInFeed({
  slotId = "in-feed",
  slotKey,
  className = "",
}: AdInFeedProps) {
  const { clientId, manualSlots } = useAdsRuntimeConfig();
  const pathname = usePathname();
  const preferredSlotKey = slotKey || getRouteManualAdSlotKey(pathname || "/", "inFeed");
  const adSlot = resolveManualAdSlot(manualSlots, preferredSlotKey, "inFeed");
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

            if (insRef.current) {
              const mutObs = new MutationObserver(() => {
                if (insRef.current?.getAttribute("data-ad-status") === "unfilled") {
                  setIsUnfilled(true);
                  mutObs.disconnect();
                }
              });
              mutObs.observe(insRef.current, { attributes: true, attributeFilter: ["data-ad-status"] });
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

  if (!shouldRenderAds || !canLoadAds || isUnfilled) return null;

  return (
    <div
      id={slotId}
      ref={ref}
      className={`ad-slot ad-slot--in-feed ${isLoading ? "is-loading" : ""} ${className}`}
      role="complementary"
      aria-label="إعلان"
    >
      <span className="ad-slot__label">إعلان</span>
      <ins
        ref={insRef}
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
