# 🔍 05 — Phase 5: Filtering Correctness

**Outcome:** Category, Country, and TimeRange filters are 100% functional.

---

## 5.1 — Fix `timeRange` Filter in `actions.js`

Implement `week`, `month`, and `3months` logic in `loadMoreEvents()`. Pre-resolve Hijri events to calculate target dates correctly for the filter.

## 5.2 — Derive `COUNTRIES` in `HolidaysClient.jsx`

Eliminate the hardcoded `COUNTRIES` array. Use `COUNTRY_META` from `@/lib/calendar-config`.

## 5.3 — Control Display Order

Add `order` field to `COUNTRY_META` and sort the dropdown in `HolidaysClient.jsx`.

## 5.4 — Validate Categories in `enrichEvent()`

Add `VALID_CATEGORIES` set. `console.warn()` if a slug has an unknown category.

---

**✅ Checkpoint:** Click 'الكل' -> 'السعودية' -> 'هذا الأسبوع'. Ensure items are correctly filtered.
