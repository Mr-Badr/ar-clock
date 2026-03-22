# 🏗️ 01 — Phase 1: Data Split

**Outcome:** `holidays-engine.js` becomes logic-only. Event database moved to `src/lib/events/`.

---

## 1.1 — Create `src/lib/events/islamic.js`

Move `RELIGIOUS_HOLIDAYS` array from `holidays-engine.js` (lines 340-569).

```js
export const RELIGIOUS_HOLIDAYS = [
  // ramadan, eid-al-fitr, etc.
];
```

## 1.2 — Create `src/lib/events/seasonal.js`

Move `SEASONAL_EVENTS` (lines 571-628).

```js
export const SEASONAL_EVENTS = [
  // new-year, winter-season, etc.
];
```

## 1.3 — Create `src/lib/events/index.js` (CRITICAL)

To avoid circular dependencies, use this specific pattern:

```js
// src/lib/events/index.js (NO IMPORT FROM holidays-engine)
import { RELIGIOUS_HOLIDAYS } from './islamic.js';
// ... other imports ...

// Dedup logic (pure JS)
const _seen = new Set();
function dedup(arr) { ... }

export const ALL_RAW_EVENTS = [
  ...dedup(RELIGIOUS_HOLIDAYS),
  ...dedup(SEASONAL_EVENTS),
  // ... other country events ...
];
```

## 1.4 — Gut `holidays-engine.js`

Add at the **very bottom** of `holidays-engine.js`:

```js
// Build ALL_EVENTS here — enrichEvent is defined above
import { ALL_RAW_EVENTS } from './events/index.js';
export const ALL_EVENTS = ALL_RAW_EVENTS.map(e => enrichEvent(e));

// Backward-compat re-exports
export { ALL_EVENTS };
export { RELIGIOUS_HOLIDAYS } from './events/islamic.js';
export { SEASONAL_EVENTS } from './events/seasonal.js';
```

---

**✅ Checkpoint:** `npm run build` must pass. Verify 57 slugs generated.
