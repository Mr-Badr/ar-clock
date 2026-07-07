---
paths:
  - src/components/calculators/**
  - src/app/calculators/**
---

# Calculator UI/UX Standards

Derived from EOS Kuwait/Qatar/Bahrain redesign session (2026-07-01), revised 2026-07-08 after owner
feedback that decorative border accents read as templated/AI-generated just like gradients do.
Apply to every new calculator and whenever touching existing ones.

---

## 1. No Gradient Backgrounds — Ever

Gradients on form cards and result panels look AI-generated and cheap. Always use flat surfaces.

```css
/* ❌ NEVER */
.calc-esb-form-card  { background: linear-gradient(180deg, ...); }
.calc-esb-result-panel { background: linear-gradient(160deg, ...); }

/* ✅ ALWAYS */
.calc-form-card    { background: var(--bg-surface-1); border: 1px solid var(--border-default); border-radius: 16px; }
.calc-result-panel { background: var(--bg-surface-1); border: 1px solid var(--border-default); border-radius: 18px; }
```

## 1b. No Decorative Colored Border Stripes — Ever (added 2026-07-08)

**Superseded rule, kept for history:** an earlier version of this doc recommended a colored
`border-top: 3px solid var(--green)` as "the AI-generated-proof alternative to gradients." Owner
feedback (2026-07-08) was direct: a colored line stamped on a box reads as its own kind of generic
AI-template pattern, not as intentional design. **Do not add colored border-top/bottom/inline-start/
inline-end accents to cards, panels, or result boxes as a substitute for real visual hierarchy.**

Carry color with meaning instead — pick ONE of these, not a border stripe:
- **Icon chip**: a small circular badge (`border-radius: var(--radius-full)`, ~2–2.25rem) with a
  tinted background (`var(--{color}-subtle)`) and matching icon color (`var(--{color}-text)`),
  placed above or beside the value/title. This is what a human designer reaches for — the icon
  carries the category, the chip carries the color, nothing needs a stripe.
- **Tinted surface**: `background: color-mix(in srgb, var(--{color}-subtle) 40–55%, var(--surface))`
  on the whole card for a single hero/featured element — used sparingly, not on every card in a grid.
- **Semantic badge/pill** (`badge-success`, `badge-warning`, etc. — already used site-wide) inline
  in the copy, when the color signals a real state (Ramadan, sacred month, error/success).

```css
/* ❌ NEVER (however it's oriented) */
.card { border-top: 3px solid var(--green); }
.card { border-inline-start: 3px solid var(--blue); }

/* ✅ Icon chip carries the color instead */
.card-icon {
  display: inline-flex; align-items: center; justify-content: center;
  width: 2.25rem; height: 2.25rem; border-radius: var(--radius-full, 999px);
  background: var(--blue-subtle); color: var(--blue-text);
}
```

If a grid of cards needs visual variety (e.g. 4 stat tiles), rotate the icon-chip color per tile
(`:nth-child(4n+1..4)`) rather than rotating a border stripe color — same variety, no template look.

The colored `border-top` (3px) gives the result panel identity without decoration. Use `var(--green)` for finance tools, `var(--blue)` for info tools, `var(--amber)` for warnings.

---

## 2. No Letter-Spacing on Arabic Text

`letter-spacing` on Arabic text is explicitly forbidden in DESIGN.md §9.2. Check every label, badge, and caption.

```css
/* ❌ NEVER on Arabic labels */
.calc-amount-label { letter-spacing: 0.04em; }

/* ✅ Always 0 on Arabic */
.calc-amount-label { letter-spacing: 0; }

/* ✅ Negative letter-spacing IS allowed on the numeric amount value (Latin digits) */
.calc-amount-value { letter-spacing: -0.015em; direction: ltr; text-align: end; }
```

---

## 3. No Hardcoded Hex Colors — Use CSS Variables Only

```css
/* ❌ NEVER */
color: #10b981;
border-color: #0A6A2D;

/* ✅ ALWAYS */
color: var(--green-text);
border-color: var(--green-border);
```

**Full CSS variable map (dark mode values):**
| Intent | Variable | Value |
|---|---|---|
| Green primary | `var(--green)` | `#1DBB6A` |
| Green text | `var(--green-text)` | `#52E090` |
| Green border | `var(--green-border)` | `#0A6A2D` |
| Green subtle bg | `var(--green-subtle)` | `#031A0C` |
| Blue primary | `var(--blue)` | `#5AADFF` |
| Blue text | `var(--blue-text)` | `#99CEFF` |
| Red primary | `var(--red)` | `#FF4558` |
| Red text | `var(--red-text)` | `#FF8090` |
| Amber | `var(--amber)` | `#FBB63C` |

---

## 4. Mobile-First Layout: 1-Column → 2-Column at lg

Every calculator uses this layout pattern:

```css
/* Mobile: form above, result below (single column) */
.calc-esb-layout {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

/* Desktop (≥1024px): form left, sticky result right */
@media (min-width: 1024px) {
  .calc-esb-layout {
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: start;
    gap: var(--space-6);
  }
  .calc-esb-result-col {
    position: sticky;
    top: var(--space-4);
  }
}
```

Test at 375px first, then 768px, then 1280px.

---

## 5. Country/Tool Identity on Result Panel

Every result panel must have a header row identifying what the tool is calculating. Do not let result panels look generic.

```jsx
<div className="calc-esb-result-header">
  <span className="calc-esb-country-badge calc-esb-country-badge--kw">🇰🇼 الكويت</span>
  <span className="calc-esb-live-dot" aria-hidden="true" />
</div>
```

```css
.calc-esb-result-header { display: flex; align-items: center; justify-content: space-between; }
.calc-esb-country-badge { font-size: var(--text-xs); font-weight: 700; padding: 3px 10px; border-radius: 999px; border: 1px solid; }
.calc-esb-country-badge--kw { color: var(--green-text); border-color: var(--green-border); background: var(--green-subtle); }
.calc-esb-country-badge--qa { color: var(--red-text); border-color: color-mix(in srgb, var(--red) 40%, transparent); background: color-mix(in srgb, var(--red) 8%, transparent); }
.calc-esb-country-badge--bh { color: var(--blue-text); border-color: color-mix(in srgb, var(--blue) 40%, transparent); background: color-mix(in srgb, var(--blue) 8%, transparent); }

/* Pulsing live dot */
.calc-esb-live-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--green); animation: esb-pulse 2s ease-in-out infinite; }
@keyframes esb-pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(0.75); } }
```

---

## 6. Sidebar Facts: Horizontal Strip on Mobile

Sidebar quick-facts must be visible on mobile as a compact horizontal strip, not hidden.

```css
/* Mobile: horizontal flex row */
.calc-esb-sidebar-facts {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  border-radius: 10px;
  border: 1px solid var(--border-subtle);
  background: color-mix(in srgb, var(--bg-surface-2) 50%, transparent);
}

/* Desktop: back to vertical column */
@media (min-width: 1024px) {
  .calc-esb-sidebar-facts { flex-direction: column; gap: var(--space-3); padding: var(--space-3) var(--space-4); }
}
```

---

## 7. CalculatorHero Highlights: Support Both String and Object

`highlights` prop accepts both `string[]` and `{ label: string, desc?: string }[]`. Do not assume one format.

```jsx
// In common.jsx — always detect type before rendering
const isObj = item && typeof item === 'object';
return isObj ? (
  <span>
    <strong className="calc-highlight-label">{item.label}</strong>
    {item.desc ? <span className="calc-highlight-desc"> — {item.desc}</span> : null}
  </span>
) : (
  <span>{item}</span>
);
```

```css
.calc-highlight-list svg { color: var(--green); }
.calc-highlight-label { color: var(--text-primary); font-weight: 600; }
.calc-highlight-desc  { color: var(--text-secondary); }
```

---

## 8. Amount Display: LTR Direction, End Alignment

The numeric output must display in LTR (digits flow left-to-right) while aligning to the right in RTL context.

```css
.calc-amount-value {
  font-size: clamp(2.2rem, 7vw, 3.6rem);
  font-weight: 900;
  line-height: 1.05;
  letter-spacing: -0.015em;
  color: var(--green-text);
  font-variant-numeric: tabular-nums;
  direction: ltr;       /* digits LTR */
  text-align: end;      /* aligns right in RTL parent */
}
```

---

## 9. Pre-Ship UI Checklist (every calculator)

Before marking a calculator ready to commit:

- [ ] Form card: flat background, `var(--bg-surface-1)`, no gradient
- [ ] Result panel: flat background + `border-top: 3px solid var(--green)`
- [ ] No `letter-spacing` on any Arabic text element
- [ ] No hardcoded hex colors — all `var(--...)` 
- [ ] Result panel has identity header (badge + live dot)
- [ ] Layout is 1-column at 375px, 2-column at 1024px
- [ ] Sidebar facts visible on mobile (horizontal strip)
- [ ] Amount value uses `direction: ltr; text-align: end`
- [ ] CalculatorHero highlights render correctly (string or object)
- [ ] Tested with RTL: no broken alignments, no mirrored icons
