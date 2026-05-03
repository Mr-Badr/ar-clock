"use client";

import { useEffect, useRef, useState } from "react";

import { useMarketingPermission } from "@/lib/client/marketing";
import { useAdsRuntimeConfig } from "@/lib/client/public-runtime";
import { logger, serializeError } from "@/lib/logger";

interface AdSidebarStickyProps {
  slotId?: string;
  className?: string;
  side?: "right" | "left";
  sticky?: boolean;
}

type ManualSidebarSlots = {
  sidebar?: string | null;
  sidebarRight?: string | null;
  sidebarLeft?: string | null;
};

function resolveSidebarSlot(
  side: "right" | "left",
  slotId: string,
  manualSlots: ManualSidebarSlots,
) {
  if (side === "right" || slotId.includes("right")) {
    return manualSlots.sidebarRight || manualSlots.sidebar || "";
  }

  if (side === "left" || slotId.includes("left")) {
    return manualSlots.sidebarLeft || manualSlots.sidebar || "";
  }

  return manualSlots.sidebar || "";
}

export default function AdSidebarSticky({
  slotId = "sidebar-ad",
  className = "",
  side = "right",
  sticky = true,
}: AdSidebarStickyProps) {
  const { clientId, manualSlots } = useAdsRuntimeConfig();
  const adSlot = resolveSidebarSlot(side, slotId, manualSlots);
  const shouldRenderAds = Boolean(clientId && adSlot);
  const canLoadAds = useMarketingPermission(shouldRenderAds);
  const ref = useRef<HTMLElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const loaded = useRef(false);

  useEffect(() => {
    if (!canLoadAds) return;
    if (!ref.current || loaded.current) return;

    const minWidthQuery = sticky ? "(min-width: 1280px)" : "(min-width: 1536px)";
    const isDesktop = window.matchMedia(minWidthQuery).matches;
    if (!isDesktop) return;

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
              logger.warn("adsense-sidebar-init-failed", {
                component: "AdSidebarSticky",
                slotId,
                side,
                error: serializeError(error),
              });
            }

            observer.disconnect();
          }
        });
      },
      { rootMargin: "100px 0px" }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [canLoadAds]);

  if (!shouldRenderAds || !canLoadAds) return null;

  return (
    <aside
      id={slotId}
      ref={ref}
      className={[
        "ad-slot",
        "ad-slot--sidebar",
        sticky ? "ad-slot--sidebar--sticky" : "ad-slot--sidebar--static",
        side === "left" ? "ad-slot--sidebar--left" : "ad-slot--sidebar--right",
        isLoading ? "is-loading" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      role="complementary"
      aria-label="إعلانات جانبية"
    >
      <span className="ad-slot__label">إعلانات</span>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={clientId || undefined}
        data-ad-slot={adSlot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </aside>
  );
}
