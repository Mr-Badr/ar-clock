# 📈 06 — Phase 6: Production Arabic SEO

**Outcome:** Dynamic JSON-LD. RTL declaration. Language alternates.

---

## 6.1 — Dynamic `eventStatus` in Schema

Map `eventState` (`today` | `upcoming` | `passed`) to Schema.org `eventStatus`.

## 6.2 — Verify `dir="rtl"` in `layout.tsx`

Ensure `<html lang="ar" dir="rtl">` is present for perfect RTL and search indexing.

## 6.3 — Add `hreflang` to Country-Variant Events

Use `alternates` in `generateMetadata()` for pages like `/holidays/ramadan-in-saudi`.

## 6.4 — Sitemap Configuration

Ensure `changefreq: 'daily'` and appropriate priorities (0.6 - 0.9).

## 6.5 — OG Image Health Check

Ensure `opengraph-image` routes return `200` OK for Google Event carousel eligibility.

---

**✅ Checkpoint:** Verify breadcrumbs and event status in Google's Rich Result Test.
