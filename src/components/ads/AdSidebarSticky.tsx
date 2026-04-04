"use client";

import { useEffect, useRef, useState } from "react";

import {
  isPublicEnvEnabled,
  useMarketingPermission,
} from "@/lib/client/marketing";

interface AdSidebarStickyProps {
  slotId?: string;
  className?: string;
}

function resolveSidebarSlot(slotId: string) {
  if (slotId.includes("right")) {
    return (
      process.env.NEXT_PUBLIC_ADSENSE_SIDEBAR_RIGHT_SLOT ||
      process.env.NEXT_PUBLIC_ADSENSE_SIDEBAR_SLOT ||
      ""
    ).trim();
  }

  if (slotId.includes("left")) {
    return (
      process.env.NEXT_PUBLIC_ADSENSE_SIDEBAR_LEFT_SLOT ||
      process.env.NEXT_PUBLIC_ADSENSE_SIDEBAR_SLOT ||
      ""
    ).trim();
  }

  return (process.env.NEXT_PUBLIC_ADSENSE_SIDEBAR_SLOT || "").trim();
}

export default function AdSidebarSticky({
  slotId = "sidebar-ad",
  className = "",
}: AdSidebarStickyProps) {
  const adsEnabled = isPublicEnvEnabled(process.env.NEXT_PUBLIC_ENABLE_ADS);
  const clientId = (process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "").trim();
  const adSlot = resolveSidebarSlot(slotId);
  const shouldRenderAds = adsEnabled && clientId.startsWith("ca-pub-") && Boolean(adSlot);
  const canLoadAds = useMarketingPermission(shouldRenderAds);
  const ref = useRef<HTMLElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const loaded = useRef(false);

  useEffect(() => {
    if (!canLoadAds) return;
    if (!ref.current || loaded.current) return;

    const isDesktop = window.matchMedia("(min-width: 1280px)").matches;
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
              console.warn("AdSense sidebar slot failed to initialize:", error);
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
      className={`ad-slot ad-slot--sidebar ${isLoading ? "is-loading" : ""} ${className}`}
      role="complementary"
      aria-label="إعلانات جانبية"
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
    </aside>
  );
}
