/**
 * AdLayoutWrapper — Three-column layout: [sidebar] [content] [sidebar]  (v2)
 * ─────────────────────────────────────────────────────────────────────────────
 * Server Component — no "use client" needed (pure layout wrapper).
 *
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │  RTL GRID VISUAL MAP (with dir="rtl" on <body>):                        │
 * │                                                                          │
 * │  DOM order:  [1: sidebar]     [2: content]      [3: sidebar]            │
 * │  Visually:   RIGHT side       CENTER             LEFT side              │
 * │                                                                          │
 * │  CSS Grid in RTL direction renders columns visually right-to-left.      │
 * │  So DOM column 1 = visual RIGHT, DOM column 3 = visual LEFT.            │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * USAGE:
 *
 *   // app/mwaqit-al-salat/[country]/page.tsx
 *   import AdLayoutWrapper from "@/components/ads/AdLayoutWrapper";
 *   import { AdTopBanner, AdInArticle } from "@/components/ads";
 *
 *   export default function CountryPage({ params }) {
 *     return (
 *       // <AdLayoutWrapper> 
 *         <main className="content-col pt-24 pb-20">
 *
 *           <CountryPrayerJsonLd ... />
 *
 *           // Breadcrumb
 *           <nav aria-label="مسار التنقل">...</nav>
 *
 *           // H1 BEFORE ad — required for SEO topic classification
 *           <h1>مواقيت الصلاة في السعودية</h1>
 *
 *           // Banner AFTER h1 — higher viewability per Google heat map data
 *           <AdTopBanner slotId="top-country" />
 *
 *           // First major content block
 *           <PrayerTimesTable />
 *
 *           // Ad between major sections — not inside them
 *           <AdInArticle slotId="mid-country-1" />
 *
 *           // Second content block
 *           <CityListSection />
 *
 *           // Optional second mid-article (only on long pages)
 *           {isLongPage && <AdInArticle slotId="mid-country-2" />}
 *
 *           // Footer content
 *           <RelatedCountries />
 *
 *         </main>
 *       // </AdLayoutWrapper> 
 *     );
 *   }
 *
 * WHEN NOT TO USE:
 *   ❌ Homepage — has its own hero layout
 *   ❌ Pages shorter than 2 viewports (sidebar has nowhere to scroll)
 *   ❌ Full-width table pages (the grid constrains .content-col to 900px)
 *   ❌ Auth/settings pages (no ads needed)
 */

import AdSidebarSticky from "./AdSidebarSticky";

interface AdLayoutWrapperProps {
  children: React.ReactNode;
  /** Hide both sidebars (short pages, special layouts) */
  hideSidebars?: boolean;
}

export default function AdLayoutWrapper({
  children,
  hideSidebars = false,
}: AdLayoutWrapperProps) {
  const adsEnabled = process.env.NEXT_PUBLIC_ENABLE_ADS === "true";

  if (!adsEnabled) {
    return <>{children}</>;
  }

  return (
    <div className="layout-with-ads">

      {/*
        Sidebar slot 1 — DOM first → visual RIGHT side in RTL layout
        Hidden via CSS on < 1280px. Zero layout impact on mobile.
      */}
      {!hideSidebars && (
        <AdSidebarSticky slotId="sidebar-right" />
      )}

      {/* Main content — always present, always center column */}
      {children}

      {/*
        Sidebar slot 3 — DOM last → visual LEFT side in RTL layout
        Hidden via CSS on < 1280px. Zero layout impact on mobile.
      */}
      {!hideSidebars && (
        <AdSidebarSticky slotId="sidebar-left" />
      )}

    </div>
  );
}
