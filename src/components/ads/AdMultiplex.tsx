"use client";

import { useEffect, useRef, useState } from "react";
import { useMarketingPermission } from "@/lib/client/marketing";
import { useAdsRuntimeConfig } from "@/lib/client/public-runtime";
import { logger, serializeError } from "@/lib/logger";

interface AdMultiplexProps {
  slotId?: string;
  className?: string;
}

export default function AdMultiplex({
  slotId = "multiplex",
  className = "",
}: AdMultiplexProps) {
  const { clientId, manualSlots } = useAdsRuntimeConfig();
  const adSlot = manualSlots.multiplex || "";
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
              logger.warn("adsense-multiplex-init-failed", {
                component: "AdMultiplex",
                slotId,
                error: serializeError(error),
              });
            }

            observer.disconnect();
          }
        });
      },
      { rootMargin: "500px 0px" },
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [canLoadAds, slotId]);

  if (!shouldRenderAds || !canLoadAds) return null;

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
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={clientId || undefined}
        data-ad-slot={adSlot}
        data-ad-format="autorelaxed"
      />
    </div>
  );
}
