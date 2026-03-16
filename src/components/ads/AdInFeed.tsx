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

interface AdInFeedProps {
  slotId?: string;
  className?: string;
}

export default function AdInFeed({
  slotId = "in-feed",
  className = "",
}: AdInFeedProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const loaded = useRef(false);

  useEffect(() => {
    if (!ref.current || loaded.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !loaded.current) {
            loaded.current = true;
            setIsLoading(false);

            // ─────────────────────────────────────────────────────────────────
            // TODO: Replace with your AdSense code when ready:
            //
            //   try {
            //     (window.adsbygoogle = window.adsbygoogle || []).push({});
            //   } catch (e) {}
            //
            // ─────────────────────────────────────────────────────────────────

            observer.disconnect();
          }
        });
      },
      { rootMargin: "400px 0px" }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    // Uses .card so the ad slot visually blends into the surrounding grid
    <div
      id={slotId}
      ref={ref}
      className={`card ad-slot ad-slot--in-feed ${isLoading ? "is-loading" : ""} ${className}`}
      role="complementary"
      aria-label="إعلانات"
    >
      <span className="ad-slot__label">إعلانات</span>

      {/* ─────────────────────────────────────────────────────────────────────
          TODO: Paste your AdSense <ins> tag here when ready.
          Use "fluid" format for native in-feed:

          <ins
            className="adsbygoogle"
            style={{ display: "block" }}
            data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
            data-ad-slot="XXXXXXXXXX"
            data-ad-format="fluid"
            data-ad-layout-key="-fb+5w+4e-db+86"
          />
          ───────────────────────────────────────────────────────────────────── */}
    </div>
  );
}