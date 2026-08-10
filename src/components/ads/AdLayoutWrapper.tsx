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
 *   // app/time-now/[country]/page.tsx
 *   import AdLayoutWrapper from "@/components/ads/AdLayoutWrapper";
 *   import { AdTopBanner, AdInArticle } from "@/components/ads";
 *
 *   export default function CountryPage({ params }) {
 *     return (
 *       // <AdLayoutWrapper>
 *         <main className="content-col pt-24 pb-20">
 *
 *           <CountryTimeJsonLd ... />
 *
 *           // Banner FIRST — before breadcrumb/H1, see AdTopBanner.tsx v3
 *           <AdTopBanner slotId="top-country" />
 *
 *           // Breadcrumb
 *           <nav aria-label="مسار التنقل">...</nav>
 *
 *           <h1>الوقت الان في السعودية</h1>
 *
 *           // First major content block
 *           <TimezoneInfoCard />
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
import DevAdPlaceholder from "./DevAdPlaceholder";
import { getServerAdsConfig } from "@/lib/runtime-config";

// Gates the dev-preview rail shell below — never true for a real production build (ads are
// configured there via env vars, so the `!adsEnabled` branch isn't reached in the first
// place). Exists purely so layout work like the /tools 3-column system can be reviewed
// locally with the real rail width reserved, instead of every ad silently collapsing to zero.
const isDevPreview = process.env.NODE_ENV !== "production";

interface AdLayoutWrapperProps {
  children: React.ReactNode;
  /** Hide both sidebars (short pages, special layouts) */
  hideSidebars?: boolean;
  /** Standard = broad content pages, narrow = denser tool pages, wide = hubs with rich grids */
  layout?: "standard" | "narrow" | "wide";
  /** single = one sticky rail, dual = sticky right + static left, none = content only */
  sidebarMode?: "single" | "dual" | "none";
}

export default function AdLayoutWrapper({
  children,
  hideSidebars,
  layout,
  sidebarMode,
}: AdLayoutWrapperProps) {
  const { enabled, manualSlots } = getServerAdsConfig();
  const shouldHideSidebars = hideSidebars === true;
  const resolvedLayout = layout ?? "standard";
  const requestedSidebarMode = sidebarMode ?? "single";
  const adsEnabled = enabled && Boolean(
    manualSlots.sidebar || manualSlots.sidebarRight || manualSlots.sidebarLeft,
  );
  const resolvedSidebarMode = shouldHideSidebars ? "none" : requestedSidebarMode;

  // hideSidebars (→ "none") is a real per-page decision (short pages, special layouts) —
  // always honor it, dev preview or not.
  if (resolvedSidebarMode === "none") {
    return <>{children}</>;
  }

  if (!adsEnabled) {
    // Real production builds configure ads via env vars, so this branch is normally only
    // reached locally. Bail to bare content exactly as before UNLESS this is a dev preview,
    // in which case show the real 3-column shape with placeholder rails so layout work can
    // be reviewed without ads actually being configured.
    if (!isDevPreview) {
      return <>{children}</>;
    }

    return (
      <div
        className="layout-with-ads"
        data-layout={resolvedLayout}
        data-rail-mode={resolvedSidebarMode}
      >
        {children}
        <aside className="ad-slot ad-slot--sidebar ad-slot--sidebar--sticky ad-slot--sidebar--right" aria-hidden="true">
          <DevAdPlaceholder />
        </aside>
        {resolvedSidebarMode === "dual" && (
          <aside className="ad-slot ad-slot--sidebar ad-slot--sidebar--static ad-slot--sidebar--left" aria-hidden="true">
            <DevAdPlaceholder />
          </aside>
        )}
      </div>
    );
  }

  return (
    <div
      className="layout-with-ads"
      data-layout={resolvedLayout}
      data-rail-mode={resolvedSidebarMode}
    >

      {/* Main content — always present, always center column */}
      {children}

      {/*
        Primary rail — sticky and placed on the visual right with CSS grid.
        It renders after content in the DOM so page H1 appears before ads.
      */}
      <AdSidebarSticky slotId="sidebar-right" side="right" sticky />

      {/*
        Secondary rail — only on layouts that can carry more density.
        It stays static so we never show mirrored sticky ads.
      */}
      {resolvedSidebarMode === "dual" && (
        <AdSidebarSticky slotId="sidebar-left" side="left" sticky={false} />
      )}

    </div>
  );
}
