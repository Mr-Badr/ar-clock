# 🌙 04 — Phase 4: Hijri Engine Improvements

**Outcome:** Direct `hijriLabel` return. Removed redundant API calls.

---

## 4.1 — Enrich `hijri-resolver.js` Return Shape

Modify `resolveAllHijriEvents()` to return:
```js
{
  isoString: '...',
  hijriYear:  1447,
  hijriDay:   1,
  hijriMonth: 9,
  hijriLabel: '1 رمضان 1447 هـ',
}
```

## 4.2 — Remove Duplicate API call in `[slug]/page.jsx`

Delete the `fetch` from `api.aladhan.com/v1/gToH`. Use `calInfo.hijriLabel` directly.

---

**✅ Checkpoint:** Verify hijri label in `/holidays/ramadan`. One less network request.
