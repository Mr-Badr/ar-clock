"use client";

import { useEffect, useRef, useState } from "react";
import { useMarketingPermission } from "@/lib/client/marketing";
import { useAdsRuntimeConfig } from "@/lib/client/public-runtime";
import { logger, serializeError } from "@/lib/logger";

const EVENTS_FEED_HORIZONTAL_ID = "events-feed-horizontal-01";

export default function AdEventsFeedHorizontal() {
  const { clientId, manualSlots } = useAdsRuntimeConfig();
  const adSlot = manualSlots.eventsFeedHorizontal || "";
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
              logger.warn("adsense-events-feed-horizontal-init-failed", {
                component: "AdEventsFeedHorizontal",
                slotId: EVENTS_FEED_HORIZONTAL_ID,
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
      { rootMargin: "300px 0px" },
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [canLoadAds]);

  if (!shouldRenderAds || !canLoadAds || isUnfilled) return null;

  return (
    <div
      id={EVENTS_FEED_HORIZONTAL_ID}
      ref={ref}
      className={`ad-slot ad-slot--events-feed-horizontal ${isLoading ? "is-loading" : ""}`}
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
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
