# 🌍 03 — Phase 3: Rich Content by Country

**Outcome:** Every country has its own content file. Adding a country is isolated.

---

## 3.1 — Create `src/lib/event-content/countries/`

Split `national.js`, `school.js`, and `support.js` into:
- `sa.js`, `eg.js`, `dz.js`, `ma.js`, `ae.js`, `tn.js`, `kw.js`, `qa.js`
- `shared.js` (for generic back-to-school, vacations).

## 3.2 — Pattern for Country Files

```js
// src/lib/event-content/countries/sa.js
export const SA_CONTENT = {
  'saudi-national-day': {
    seoTitle: 'اليوم الوطني السعودي {{year}} — 23 سبتمبر',
    description: 'اليوم الوطني للمملكة العربية السعودية {{year}}.',
    // ... other content fields ...
  },
  // ... other SA slugs ...
};
```

## 3.3 — Update `event-content/index.js`

Add imports and spread into `ALL_RICH_CONTENT`.

---

**✅ Checkpoint:** `npm run build` + spot-check any country-specific event page.
