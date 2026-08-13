"use client";

import { useEffect, useRef, useState } from "react";

import { watchAdFill } from "@/lib/ads/unfilled";
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
  const insRef = useRef<HTMLModElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUnfilled, setIsUnfilled] = useState(false);
  const loaded = useRef(false);

  useEffect(() => {
    if (!canLoadAds) return;
    if (!ref.current || loaded.current) return;

    // Both rails activate at the same breakpoint (see ads.css) — lowered to 1180px 2026-08-13
    // (owner: "in desktop and normal laptop we should also have side left and right ads")
    // from 1440px, which excluded very common 1280–1366px laptop widths entirely. Must stay
    // in sync with the CSS visibility breakpoint in ads.css, or this JS gate blocks the ad
    // request on a width where the CSS already shows the (then permanently empty) container.
    const isDesktop = window.matchMedia("(min-width: 1180px)").matches;
    if (!isDesktop) return;

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
              logger.warn("adsense-sidebar-init-failed", {
                component: "AdSidebarSticky",
                slotId,
                side,
                error: serializeError(error),
              });
            }

            // Collapse the reserved rail if Google returns no ad (unfilled) — otherwise the
            // 400–600px-tall column sits there as an empty box next to real content forever.
            stopWatch = watchAdFill(insRef.current, () => setIsUnfilled(true));

            observer.disconnect();
          }
        });
      },
      { rootMargin: "100px 0px" }
    );

    observer.observe(ref.current);
    return () => {
      observer.disconnect();
      stopWatch?.();
    };
  }, [canLoadAds]);

  if (!shouldRenderAds || !canLoadAds || isUnfilled) return null;

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
      aria-label="إعلان جانبي"
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
    </aside>
  );
}
