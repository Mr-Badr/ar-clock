"use client";

/**
 * AdTopBanner — Horizontal leaderboard  (v2 — placement corrected)
 * ─────────────────────────────────────────────────────────────────────────────
 * SIZE:    320×50 mobile  |  728×90 tablet  |  970×90 desktop
 * CLS:     Reserved via aspect-ratio + min-height in CSS
 *
 * ⚠️  v1 vs v2 PLACEMENT CHANGE:
 *   v1: Banner placed BEFORE <h1> (between breadcrumb and title)
 *   v2: Banner placed AFTER <h1> (between title and first content block)
 *
 *   WHY: Google's viewability research shows ads just BELOW the first content
 *   element (the H1 title) have HIGHER viewability AND CTR than ads above it.
 *   Also: Googlebot needs to see your H1 BEFORE any ad markup for correct
 *   topic classification and SEO ranking.
 *
 * CORRECT JSX ORDER:
 *
 *   <nav aria-label="مسار التنقل">... breadcrumb ...</nav>
 *   <h1 className="...">عنوان الصفحة</h1>           ← SEO first
 *   <AdTopBanner slotId="top-country" />             ← THEN banner
 *   <PrayerTimesTable />                             ← then content
 *
 * USE ON:
 *   ✅ Country pages (/mwaqit-al-salat/[country])
 *   ✅ City pages    (/mwaqit-al-salat/[country]/[city])
 *   ✅ Article / info pages
 *   ✅ Listing pages (countries list, cities list)
 *   ❌ Homepage hero (the hero IS the above-fold — skip banner)
 *   ❌ Settings / forms pages (short pages with no content revenue)
 */

import { useEffect, useRef, useState } from "react";

interface AdTopBannerProps {
  /** Unique ID per page to prevent AdSense slot conflicts */
  slotId?: string;
  className?: string;
}

export default function AdTopBanner({
  slotId = "top-banner",
  className = "",
}: AdTopBannerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const loaded = useRef(false);

  useEffect(() => {
    if (!ref.current || loaded.current) return;

    // Load when slot is within 200px of viewport — gives ad time to render
    // before user reaches it (no visible pop-in, better viewability score)
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
      { rootMargin: "200px 0px" }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      id={slotId}
      ref={ref}
      className={`ad-slot ad-slot--top-banner ${isLoading ? "is-loading" : ""} ${className}`}
      role="complementary"
      aria-label="إعلانات"
    >
      {/* Label — required by Google AdSense policy to be visible */}
      <span className="ad-slot__label">إعلانات</span>

      {/* ─────────────────────────────────────────────────────────────────────
          TODO: Paste your AdSense <ins> tag here when ready.
          For best fill rate, use "auto" format with full-width responsive:

          <ins
            className="adsbygoogle"
            style={{ display: "block" }}
            data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
            data-ad-slot="XXXXXXXXXX"
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
          ───────────────────────────────────────────────────────────────────── */}
    </div>
  );
}