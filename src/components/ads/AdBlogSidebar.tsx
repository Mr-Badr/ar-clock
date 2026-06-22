"use client";

/**
 * AdBlogSidebar — In-column sidebar unit for the blog article layout.
 * ─────────────────────────────────────────────────────────────────────────────
 * Unlike AdSidebarSticky (a fixed 240px rail for the AdLayoutWrapper grid),
 * this unit is designed to live INSIDE the blog's own `.sidebar` aside column
 * (BlogArticleView), below the table-of-contents cards. It fills the column
 * width (280–320px) and inherits the aside's sticky positioning, so it never
 * nests a second sticky context or fights the shared grid CSS.
 *
 * WHERE: appended as the last child of the blog `<aside className={styles.sidebar}>`.
 * SHOWS: only where the blog sidebar itself is visible (desktop ≥1100px). The
 *        consent gate + IntersectionObserver still apply.
 */

import { useEffect, useRef, useState } from "react";
import { useMarketingPermission } from "@/lib/client/marketing";
import { useAdsRuntimeConfig } from "@/lib/client/public-runtime";
import { logger, serializeError } from "@/lib/logger";

interface AdBlogSidebarProps {
  slotId?: string;
  /** Card class from the host layout so the unit matches surrounding cards. */
  className?: string;
}

export default function AdBlogSidebar({
  slotId = "blog-sidebar",
  className = "",
}: AdBlogSidebarProps) {
  const { clientId, manualSlots } = useAdsRuntimeConfig();
  const adSlot = manualSlots.sidebarRight || manualSlots.sidebar || "";
  const shouldRenderAds = Boolean(clientId && adSlot);
  const canLoadAds = useMarketingPermission(shouldRenderAds);
  const ref = useRef<HTMLDivElement>(null);
  const loaded = useRef(false);

  useEffect(() => {
    if (!canLoadAds) return;
    if (!ref.current || loaded.current) return;

    // The blog sidebar column only renders at ≥1100px. Below that the aside is
    // hidden/stacked, so there is no point requesting a desktop sidebar creative.
    if (!window.matchMedia("(min-width: 1100px)").matches) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !loaded.current) {
            loaded.current = true;
            try {
              const adsWindow = window as Window & { adsbygoogle?: unknown[] };
              (adsWindow.adsbygoogle = adsWindow.adsbygoogle || []).push({});
            } catch (error) {
              logger.warn("adsense-blog-sidebar-init-failed", {
                component: "AdBlogSidebar",
                slotId,
                error: serializeError(error),
              });
            }
            observer.disconnect();
          }
        });
      },
      { rootMargin: "200px 0px" }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [canLoadAds, slotId]);

  if (!shouldRenderAds || !canLoadAds) return null;

  return (
    <div
      id={slotId}
      ref={ref}
      className={`ad-slot ad-slot--blog-sidebar ${className}`}
      role="complementary"
      aria-label="إعلان"
    >
      <span className="ad-slot__label">إعلان</span>
      <ins
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
