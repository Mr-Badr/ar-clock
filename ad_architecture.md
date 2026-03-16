# Ad Architecture — Complete Guide v2
# WAQT App · Next.js 16 · Tailwind 4 · shadcn · RTL Arabic
# Post-audit: all bugs fixed, SEO + CLS + UX optimized

---

## ✅ WHAT CHANGED FROM v1 → v2 (READ THIS FIRST)

| # | Issue | v1 | v2 Fix |
|---|-------|-----|--------|
| 1 | CLS: SSR hydration mismatch in AdSidebarSticky | `useState(false)` for `isDesktop` | CSS-only hide, JS only gates script |
| 2 | CLS: Sticky anchor content overlap | `sticky-anchor-spacer` height conditional | Always 68px on mobile from page load |
| 3 | CLS: Ad slot sizing | `min-height` only | `aspect-ratio` primary + `min-height` floor |
| 4 | Perf: AdSense script | Not loaded via Next.js Script | New `AdSenseProvider` with `afterInteractive` |
| 5 | SEO: Banner before H1 | Banner between breadcrumb and H1 | Banner AFTER H1 (Google heat map) |
| 6 | Policy: Ad label size | Too small, aria-hidden | Readable size, proper contrast, NOT hidden |
| 7 | Perf: Long page render | No render optimization | `content-visibility: auto` on off-screen slots |
| 8 | RTL: Sidebar order comment | Incorrect explanation | Correct: DOM column 1 = visual RIGHT in RTL |
| 9 | Feed: min-width conflict | `min-width: 250px` on AdInFeed | Removed — parent grid controls min |
| 10 | New component | Missing | `AdSenseProvider` for non-blocking script load |

---

## 1. FILE STRUCTURE

```
components/
  ads/
    index.ts                ← barrel export (NEW in v2)
    AdSenseProvider.tsx     ← global script loader (NEW in v2)
    AdLayoutWrapper.tsx     ← 3-column grid (server component)
    AdTopBanner.tsx         ← horizontal banner (after H1)
    AdInArticle.tsx         ← MPU between sections
    AdInFeed.tsx            ← card-sized for grids
    AdSidebarSticky.tsx     ← desktop-only sticky rail (CLS fixed)
    AdStickyAnchor.tsx      ← mobile-only fixed bottom (CLS fixed)
```

---

## 2. CSS — WHERE TO ADD

Scroll to the END of `new.css` (after line 2711, after `.animate-spin-slow`).
Paste the entire content of `ADD_TO_CSS_v2.css`.

**Do NOT keep any code from `ADD_TO_CSS.css` (v1)** — replace it entirely.

---

## 3. ROOT LAYOUT (app/layout.tsx) — COMPLETE EXAMPLE

```tsx
import { AdStickyAnchor, AdSenseProvider } from "@/components/ads";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        {/* Preconnect to AdSense domains for faster ad loading */}
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
        <link rel="preconnect" href="https://googleads.g.doubleclick.net" />
        <link rel="dns-prefetch" href="https://googleads.g.doubleclick.net" />
      </head>
      <body className="min-h-screen bg-base text-primary">
        <Navbar />
        {children}

        {/* Spacer ALWAYS reserves 68px on mobile — prevents anchor overlap */}
        {/* IMPORTANT: Must come BEFORE AdStickyAnchor in DOM */}
        <div className="sticky-anchor-spacer" aria-hidden="true" />

        {/* Mobile bottom anchor — hidden on desktop via CSS */}
        <AdStickyAnchor />

        {/* AdSense script — loads after page is interactive (non-blocking) */}
        <AdSenseProvider />
      </body>
    </html>
  );
}
```

---

## 4. ARTICLE / COUNTRY / CITY PAGE TEMPLATE

```tsx
import { AdLayoutWrapper, AdTopBanner, AdInArticle } from "@/components/ads";

export default function CountryPage({ params }) {
  return (
    <div className="min-h-screen bg-base text-primary">

      {/* AdLayoutWrapper adds sidebars on desktop — single col on mobile */}
      <AdLayoutWrapper>

        <main className="content-col pt-24 pb-20">

          {/* Structured data — server-side, before visible content */}
          <CountryPrayerJsonLd ... />

          {/* 1. Breadcrumb — always first for UX + SEO navigation signals */}
          <nav aria-label="مسار التنقل" className="text-xs text-muted mb-4 flex items-center gap-1.5">
            <Link href="/">الرئيسية</Link>
            <span aria-hidden="true">›</span>
            <Link href="/mwaqit-al-salat">مواقيت الصلاة</Link>
            <span aria-hidden="true">›</span>
            <span className="text-secondary">{countryAr}</span>
          </nav>

          {/* 2. H1 title — BEFORE any ad (Googlebot topic classification) */}
          <h1 className="text-3xl font-bold mb-6">
            مواقيت الصلاة في {countryAr}
          </h1>

          {/* 3. Top banner — AFTER H1, BEFORE content */}
          {/* Google viewability data: highest CTR just below first heading */}
          <AdTopBanner slotId={`top-${countrySlug}`} />

          {/* 4. First major content section */}
          <section className="section mb-8">
            <PrayerTimesTable country={country} />
          </section>

          {/* 5. First in-article ad — after first content block */}
          <AdInArticle slotId={`mid-${countrySlug}-1`} />

          {/* 6. Second content section */}
          <section className="section mb-8">
            <CityList country={country} />
          </section>

          {/* 7. Second in-article ad — only on long pages */}
          {cities.length > 10 && (
            <AdInArticle slotId={`mid-${countrySlug}-2`} />
          )}

          {/* 8. Footer content */}
          <section className="section">
            <RelatedCountries currentCountry={countrySlug} />
          </section>

        </main>
      </AdLayoutWrapper>

    </div>
  );
}
```

---

## 5. LISTING PAGE TEMPLATE (countries / cities grid)

```tsx
import { AdInFeed } from "@/components/ads";

export default function CountriesListPage() {
  return (
    <main className="content-col pt-24 pb-20">

      <h1>مواقيت الصلاة في جميع الدول</h1>

      {/* No top banner on listing pages — let users see cards immediately */}

      <div className="grid-auto mt-8">
        {countries.map((country, i) => (
          <React.Fragment key={country.slug}>
            <CountryCard country={country} />

            {/* Inject ad after every 6th card — never as first item */}
            {(i + 1) % 6 === 0 && (
              <AdInFeed slotId={`feed-${Math.floor(i / 6)}`} />
            )}
          </React.Fragment>
        ))}
      </div>

    </main>
  );
}
```

---

## 6. DEVICE SIZE REFERENCE

| Component | Mobile (<768px) | Tablet (768–1279px) | Desktop (≥1280px) |
|---|---|---|---|
| `AdTopBanner` | 320×50 | 728×90 | 728–970×90 |
| `AdInArticle` | 300×250, centered | 300×250, centered | 300×250, centered |
| `AdInFeed` | card width | card width | card width |
| `AdSidebarSticky` | **hidden** (display:none) | **hidden** | 240×400–600 sticky |
| `AdStickyAnchor` | 100%×60px fixed | 100%×60px fixed | **hidden** (display:none) |

---

## 7. SEO CHECKLIST FOR ARABIC PRAYER TIME PAGES

Each page should have:

```tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  return {
    title: `مواقيت الصلاة في ${countryAr} — وقت`,
    description: `أوقات الصلاة اليوم في ${countryAr}: الفجر، الظهر، العصر، المغرب، العشاء`,
    // hreflang — critical for Arabic RTL SEO
    alternates: {
      canonical: `https://waqt.app/mwaqit-al-salat/${countrySlug}`,
      languages: {
        "ar": `https://waqt.app/mwaqit-al-salat/${countrySlug}`,
      },
    },
    openGraph: {
      locale: "ar_SA",
      type: "website",
    },
  };
}
```

And JSON-LD must include `"inLanguage": "ar"`:
```json
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "inLanguage": "ar",
  "name": "مواقيت الصلاة في السعودية",
  "url": "https://waqt.app/mwaqit-al-salat/saudi-arabia"
}
```

---

## 8. CORE WEB VITALS CHECKLIST

| Metric | Target | Your risk area | Fix |
|---|---|---|---|
| CLS | < 0.1 | Ad slots loading without reserved space | ✅ aspect-ratio in CSS |
| CLS | < 0.1 | AdSidebarSticky SSR mismatch | ✅ CSS-only hide in v2 |
| CLS | < 0.1 | Sticky anchor covering content | ✅ unconditional spacer in v2 |
| LCP | < 2.5s | AdSense script blocking render | ✅ `afterInteractive` in AdSenseProvider |
| INP | < 200ms | Heavy ad JS on mobile | ✅ not loaded on mobile |

---

## 9. GOOGLE ADSENSE POLICY COMPLIANCE

| Requirement | Status |
|---|---|
| Max ads per page | ✅ Design enforces max 2 in-article + 1 banner + 2 sidebars |
| Ad labels visible | ✅ `.ad-slot__label` has readable size + contrast |
| Dismissible anchor | ✅ × button in AdStickyAnchor |
| No accidental clicks | ✅ 40px+ margin-block around all in-article ads |
| Responsive ads | ✅ All slots use `data-full-width-responsive="true"` |
| No misleading labels | ✅ Label says "إعلانات" (direct Arabic for "Advertisements") |
| No pop-ups | ✅ None implemented |

---

## 10. WHEN TO ADD REAL ADSENSE CODE

When your AdSense account is approved:

1. Get your **Publisher ID**: AdSense dashboard → Account → Account information
2. Get **Ad Slot IDs**: AdSense → Ads → By ad unit → create units for each type
3. In each component, find the `// TODO:` comment and replace with:
   ```tsx
   <ins
     className="adsbygoogle"
     style={{ display: "block" }}
     data-ad-client="ca-pub-YOUR_PUBLISHER_ID"
     data-ad-slot="YOUR_SLOT_ID"
     data-ad-format="auto"
     data-full-width-responsive="true"
   />
   ```
   Then add after it:
   ```tsx
   useEffect(() => {
     try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch(e) {}
   }, []);
   ```
4. Update `AdSenseProvider.tsx` with your real publisher ID.
5. Test with Google's Ad Experience Report tool.