# 🗓️ 02 — Phase 2: Date System Overhaul

**Outcome:** 100% dynamic dates. No hardcoded year ceilings.

---

## 2.1 — Replace `replaceYears()` with `replaceTokens()`

In `holidays-engine.js`:

```js
export function replaceTokens(str, gregorianYear, hijriYear) {
  if (!str) return str;
  return str
    .replace(/\{\{year\}\}/g,      String(gregorianYear))
    .replace(/\{\{hijriYear\}\}/g, hijriYear ? String(hijriYear) : String(gregorianYear))
    .replace(/\{\{nextYear\}\}/g,  String(gregorianYear + 1));
}

// Deprecated, delegates to replaceTokens
export function replaceYears(str, gregorianYear, hijriYear) {
  let out = replaceTokens(str, gregorianYear, hijriYear);
  // Legacy cleanup...
  return out;
}
```

## 2.2 — Update `resolveEventMeta()` for `_dynamic` QuickFacts

Handle `_dynamic: 'gregorian'` and `_dynamic: 'hijri'` flags.

## 2.3 — Build Dynamic Country Dates

Create `buildDynamicCountryDates()` helper in `[slug]/page.jsx` or `src/lib/event-utils.js`.

```js
export function buildDynamicCountryDates(ev, resolvedMap, nowMs, countryMeta, getCalConfig) { ... }
```

## 2.4 — `getEventState()` — Day-Of Handling

Determine `'today' | 'upcoming' | 'passed'` for schema and UI.

## 2.5 — Tokenize Content Strings

Replace 2026/2027 in `event-content/` with `{{year}}` and `{{hijriYear}}`.

---

**✅ Checkpoint:** Visit `/holidays/ramadan` in Mock 2027. Dates should be perfectly correct.
