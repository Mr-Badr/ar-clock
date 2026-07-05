"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { getRouteManualAdSlotKey, resolveManualAdSlot } from "@/lib/ads/slot-resolution";
import { watchAdFill } from "@/lib/ads/unfilled";
import { useMarketingPermission } from "@/lib/client/marketing";
import { useAdsRuntimeConfig } from "@/lib/client/public-runtime";
import { logger, serializeError } from "@/lib/logger";

interface AdMultiplexProps {
  slotId?: string;
  slotKey?: string;
  className?: string;
}

export default function AdMultiplex({
  slotId = "multiplex",
  slotKey,
  className = "",
}: AdMultiplexProps) {
  const { clientId, manualSlots } = useAdsRuntimeConfig();
  const pathname = usePathname();
  const preferredSlotKey = slotKey || getRouteManualAdSlotKey(pathname || "/", "multiplex");
  const adSlot = resolveManualAdSlot(manualSlots, preferredSlotKey, "multiplex");
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
              logger.warn("adsense-multiplex-init-failed", {
                component: "AdMultiplex",
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
      // Tight margin (was 500px): the multiplex sits at end-of-page, so a
      // 500px pre-fire counted impressions as users approached the footer and
      // left (2026-07 unit report: 1 impression, RPM 0.05, Active View 0).
      { rootMargin: "100px 0px" },
    );

    observer.observe(ref.current);
    return () => {
      observer.disconnect();
      stopWatch?.();
    };
  }, [canLoadAds, slotId]);

  if (!shouldRenderAds || !canLoadAds || isUnfilled) return null;

  return (
    <div
      id={slotId}
      ref={ref}
      className={`ad-slot ad-slot--multiplex ${isLoading ? "is-loading" : ""} ${className}`}
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
        data-ad-format="autorelaxed"
        data-full-width-responsive="true"
      />
    </div>
  );
}
