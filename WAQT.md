# ⏱ WAQT — Design System Reference (AI-Ready Edition)

> **Purpose of this document:** Any AI assistant reading this file must be able to write, audit, and refactor every component in this codebase without asking follow-up questions. Every class name, token, variant, sub-element, behavior, and anti-pattern is documented here with the exact values from `design-system.css`.
>
> Stack: `Next.js` · `Tailwind CSS 4` · `shadcn/ui` · `Noto Kufi Arabic`  
> Direction: **RTL (right-to-left)** · Themes: `dark` (default) · `light` · `dark-hc`  
> CSS file: `design-system.css` — imported last in `globals.css`

---

## Table of Contents

1. [Golden Rules — Read First](#1-golden-rules--read-first)
2. [File Structure & Import Order](#2-file-structure--import-order)
3. [How Themes Work](#3-how-themes-work)
4. [CSS Architecture — @layer and @theme](#4-css-architecture--layer-and-theme)
5. [Token Architecture — Raw vs Semantic](#5-token-architecture--raw-vs-semantic)
6. [All Semantic Tokens — Full Values Per Theme](#6-all-semantic-tokens--full-values-per-theme)
7. [Base Reset & Global Behaviors](#7-base-reset--global-behaviors)
8. [Backgrounds — Surface Elevation System](#8-backgrounds--surface-elevation-system)
9. [Typography — Every Class and Value](#9-typography--every-class-and-value)
10. [Spacing System](#10-spacing-system)
11. [Border Radius System](#11-border-radius-system)
12. [Shadow System](#12-shadow-system)
13. [Transition & Motion Tokens](#13-transition--motion-tokens)
14. [Z-Index Scale](#14-z-index-scale)
15. [Layout — Container, Section, Grid](#15-layout--container-section-grid)
16. [Card System](#16-card-system)
17. [Button System](#17-button-system)
18. [Input System](#18-input-system)
19. [Badge & Chip System](#19-badge--chip-system)
20. [Tab System](#20-tab-system)
21. [Switch / Toggle](#21-switch--toggle)
22. [Select / Dropdown](#22-select--dropdown)
23. [Clock Display](#23-clock-display)
24. [Progress & Countdown](#24-progress--countdown)
25. [Alarm Item](#25-alarm-item)
26. [Modal & Overlay](#26-modal--overlay)
27. [Toast / Notification](#27-toast--notification)
28. [Empty State](#28-empty-state)
29. [Fullscreen Mode](#29-fullscreen-mode)
30. [Accent Placement Rules](#30-accent-placement-rules)
31. [Using Tokens in Tailwind](#31-using-tokens-in-tailwind)
32. [RTL Rules — What AI Must Not Get Wrong](#32-rtl-rules--what-ai-must-not-get-wrong)
33. [Anti-Patterns — What to Never Do](#33-anti-patterns--what-to-never-do)
34. [Quick Decision Table](#34-quick-decision-table)

---

## 1. Golden Rules — Read First

These are absolute constraints. Every component must follow them without exception.

**1. Never hardcode a color.** All colors must come from semantic tokens (`--bg-*`, `--text-*`, `--accent`, etc.) or CSS classes. Not hex values, not Tailwind's built-in palette (no `bg-slate-700`, no `text-white`).

**2. Never add positive letter-spacing to Arabic text.** Arabic letterforms are connected. `tracking-wide` on Arabic body text breaks the script. Only use tracking on numbers and Latin labels.

**3. One `.btn-primary` per screen.** It is the single most important action. Two primary buttons destroys hierarchy.

**4. Respect surface elevation.** Don't put `.card-deep` directly inside `.card`. Use `.card-nested` inside `.card`, then `.card-deep` inside `.card-nested`. Never skip levels.

**5. Never put accent color on backgrounds.** Teal is a highlight — max 10–15% of any screen. Not a fill, not a section background.

**6. Always add `.tabular-nums` to any element showing changing numbers.** Without it, digit widths shift as numbers change, causing layout jitter.

**7. Fullscreen is always dark.** Even if the user is in light mode, `.fullscreen-mode` has a hardcoded `#0A0C18` background and always uses teal `#4ECDC4` for clock digits.

**8. All components are RTL-aware by default.** `direction: rtl` is set on `body`. Do not use `text-left`, padding-left shortcuts, or `margin-right: auto` without understanding how they behave in RTL.

---

## 2. File Structure & Import Order

### `globals.css`

```css
@import "tailwindcss";         /* 1st — Tailwind 4 engine + resets */
@import "shadcn/tailwind.css"; /* 2nd — shadcn component tokens */
@import "./design-system.css"; /* 3rd — WAQT tokens + components, always last */
```

The order is critical. `design-system.css` must come last so its tokens occupy a separate namespace without accidentally overriding shadcn or Tailwind internals.

### `layout.tsx`

```tsx
import { Noto_Kufi_Arabic } from 'next/font/google'

const notoKufi = Noto_Kufi_Arabic({
  subsets: ['arabic'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-noto-kufi',
  display: 'swap',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="ar"
      dir="rtl"
      data-theme="dark"
      className={`${notoKufi.variable} theme-transition`}
    >
      <body>{children}</body>
    </html>
  )
}
```

- `lang="ar"` + `dir="rtl"` — mandatory, sets the entire page direction
- `data-theme="dark"` — the default theme
- `theme-transition` — enables smooth 400ms transition on all theme-related properties

### Theme Switching

```ts
// The ONLY way to switch themes — one attribute on <html>
document.documentElement.setAttribute('data-theme', 'dark')
document.documentElement.setAttribute('data-theme', 'light')
document.documentElement.setAttribute('data-theme', 'dark-hc')
```

---

## 3. How Themes Work

Three themes. One `data-theme` attribute on `<html>`. Every CSS variable resolves automatically per theme. No JS conditionals needed in components.

| `data-theme` | Name | Body BG | Clock Color | Accent |
|---|---|---|---|---|
| `"dark"` | Dark Slate (default) | `#181C2A` | `#4ECDC4` teal + layered glow | `#4ECDC4` |
| `"light"` | Light | `#F2F4FF` | `#1D4ED8` blue, no glow | `#1A9E97` |
| `"dark-hc"` | Black High Contrast | `#0A0A0A` | `#FFFFFF` white + halo glow | `#00E5D8` |

```tsx
// Works in ALL 3 themes — zero changes needed per theme
<div className="card">
  <h3 className="card__title">المنبهات</h3>
  <p className="text-secondary">3 منبهات نشطة</p>
</div>

// NEVER — breaks in light mode, breaks in HC mode
<div style={{ background: '#272D45', color: '#E8EAFF' }}>
<div className="bg-slate-700 text-white">
```

---

## 4. CSS Architecture — @layer and @theme

### Where everything lives in `design-system.css`

| What | Location | Why |
|---|---|---|
| Raw palette (`--raw-*`) | `:root` — no layer | Source of truth, never in components |
| Semantic tokens (`--bg-*`, `--accent`, etc.) | `:root`, `[data-theme="dark"]`, `[data-theme="light"]`, `[data-theme="dark-hc"]` — no layer | Must cascade globally; layers would scope them |
| Tailwind color mapping | `@layer base { @theme inline {} }` | Makes CSS vars available as Tailwind utility names |
| HTML element defaults (`h1`–`h6`, `body`, `a`) | `@layer base` | Lowest specificity — components/utilities override |
| Component classes (`.card`, `.btn`, etc.) | Global scope — no layer | Tailwind utilities can override them |
| Utility classes (`.text-muted`, `.tabular-nums`) | Global scope — `!important` where needed | Single property, always wins |

> **For AI:** If a Tailwind utility isn't overriding a component style, the fix is to move that component class into `@layer components`.

---

## 5. Token Architecture — Raw vs Semantic

### Level 1 — Raw Palette (`--raw-*`)

Source of truth for colors. **Never reference in components.**

```css
--raw-slate-900: #181C2A;
--raw-slate-700: #272D45;
--raw-teal-400:  #4ECDC4;
--raw-blue-800:  #1D4ED8;
```

### Level 2 — Semantic Tokens

Change value per theme. **Always use these in components.**

```css
--bg-base            /* changes per theme */
--accent             /* changes per theme */
--clock-digit-color  /* changes per theme */
--text-primary       /* changes per theme */
```

**Rule:** If you're writing a hex value in JSX or Tailwind arbitrary values, you're doing it wrong. Use a semantic token.

---

## 6. All Semantic Tokens — Full Values Per Theme

### Backgrounds

| Token | Dark Slate | Light | Dark HC | Use for |
|---|---|---|---|---|
| `--bg-base` | `#181C2A` | `#F2F4FF` | `#0A0A0A` | Page body |
| `--bg-subtle` | `#1C2136` | `#ECEFFE` | `#0F0F0F` | Alternate rows, hover |
| `--bg-surface-1` | `#1F2438` | `#FFFFFF` | `#111111` | Sections, sidebars |
| `--bg-surface-2` | `#272D45` | `#F7F8FF` | `#1A1A1A` | L1 Cards |
| `--bg-surface-3` | `#303755` | `#EFF0FA` | `#242424` | L2 Nested cards, inputs |
| `--bg-surface-4` | `#363D5C` | `#E6E8F8` | `#2E2E2E` | L3 Dropdowns, tooltips |
| `--bg-overlay` | `rgba(10,12,24,0.85)` | `rgba(20,24,41,0.45)` | `rgba(0,0,0,0.90)` | Modal backdrop |
| `--bg-glass` | `rgba(31,36,56,0.65)` | `rgba(255,255,255,0.80)` | `rgba(20,20,20,0.80)` | Frosted glass |

### Borders

| Token | Dark Slate | Light | Dark HC | Use for |
|---|---|---|---|---|
| `--border-subtle` | `#2D3350` | `#E0E3F5` | `#2A2A2A` | Dividers, quiet borders |
| `--border-default` | `#363D5C` | `#D0D4F0` | `#3A3A3A` | Card borders |
| `--border-strong` | `#4A5278` | `#B0B8E8` | `#555555` | Hover, focused states |
| `--border-accent` | `rgba(78,205,196,.30)` | `rgba(26,158,151,.30)` | `rgba(0,229,216,.45)` | Active element |
| `--border-accent-strong` | `rgba(78,205,196,.60)` | `rgba(26,158,151,.60)` | `rgba(0,229,216,.80)` | Strongly active |

### Text

| Token | Dark Slate | Light | Dark HC | Use for |
|---|---|---|---|---|
| `--text-primary` | `#E8EAFF` | `#141829` | `#F5F5F5` | Main body text |
| `--text-secondary` | `#7880AA` | `#4E5580` | `#AAAAAA` | Labels, descriptions |
| `--text-muted` | `#454D70` | `#9298C0` | `#666666` | Placeholders, footnotes |
| `--text-disabled` | `#2E3455` | `#C8CCDF` | `#3A3A3A` | Disabled states |
| `--text-on-accent` | `#0E1120` | `#FFFFFF` | `#000000` | Text ON filled teal button |
| `--text-on-clock` | `#4ECDC4` | `#1D4ED8` | `#FFFFFF` | Same as `--clock-digit-color` |
| `--text-link` | `#4ECDC4` | `#1A9E97` | `#00E5D8` | Link color |
| `--text-link-hover` | `#72DAD3` | `#0E7A72` | `#4AF0E8` | Link hover |

### Accent (Teal)

| Token | Dark Slate | Light | Dark HC |
|---|---|---|---|
| `--accent` | `#4ECDC4` | `#1A9E97` | `#00E5D8` |
| `--accent-hover` | `#2BBFB6` | `#137A6E` | `#00C4B8` |
| `--accent-active` | `#1A9E97` | `#0E5E58` | `#009E94` |
| `--accent-soft` | `rgba(78,205,196,.12)` | `rgba(26,158,151,.10)` | `rgba(0,229,216,.14)` |
| `--accent-soft-hover` | `rgba(78,205,196,.20)` | `rgba(26,158,151,.18)` | `rgba(0,229,216,.22)` |
| `--accent-glow` | `rgba(78,205,196,.15)` | `rgba(26,158,151,.12)` | `rgba(0,229,216,.20)` |
| `--accent-glow-strong` | `rgba(78,205,196,.30)` | `rgba(26,158,151,.24)` | `rgba(0,229,216,.40)` |
| `--accent-alt` | `#6C8EF5` | `#1D4ED8` | `#5599FF` |
| `--accent-alt-soft` | `rgba(108,142,245,.12)` | `rgba(29,78,216,.10)` | `rgba(85,153,255,.14)` |

### Clock Tokens

| Token | Dark Slate | Light | Dark HC |
|---|---|---|---|
| `--clock-digit-color` | `#4ECDC4` | `#1D4ED8` | `#FFFFFF` |
| `--clock-digit-glow` | 3-layer teal glow | `none` | 3-layer white halo |
| `--clock-separator` | `rgba(78,205,196,.40)` | `rgba(29,78,216,.30)` | `rgba(255,255,255,.30)` |
| `--clock-label` | `#454D70` | `#9298C0` | `#555555` |
| `--clock-bg` | `rgba(31,36,56,.85)` | `rgba(255,255,255,.95)` | `rgba(17,17,17,.95)` |

**Exact glow values:**

Dark Slate:
```css
--clock-digit-glow:
  0 0 20px rgba(78, 205, 196, 0.55),
  0 0 50px rgba(78, 205, 196, 0.28),
  0 0 90px rgba(78, 205, 196, 0.12);
```

Dark HC:
```css
--clock-digit-glow:
  0 0 15px rgba(255, 255, 255, 0.80),
  0 0 40px rgba(255, 255, 255, 0.40),
  0 0 80px rgba(255, 255, 255, 0.15);
```

Light: `--clock-digit-glow: none`

### Semantic States

| Token | Dark Slate | Light | Dark HC |
|---|---|---|---|
| `--danger` | `#FF6B6B` | `#DC2626` | `#FF4444` |
| `--danger-hover` | `#FF4D4D` | `#B91C1C` | `#FF2222` |
| `--danger-soft` | `rgba(255,107,107,.12)` | `rgba(220,38,38,.08)` | `rgba(255,68,68,.14)` |
| `--danger-border` | `rgba(255,107,107,.30)` | `rgba(220,38,38,.25)` | `rgba(255,68,68,.50)` |
| `--warning` | `#FFD166` | `#B45309` | `#FFCC00` |
| `--warning-soft` | `rgba(255,209,102,.12)` | `rgba(180,83,9,.08)` | `rgba(255,204,0,.14)` |
| `--warning-border` | `rgba(255,209,102,.30)` | `rgba(180,83,9,.25)` | `rgba(255,204,0,.50)` |
| `--success` | `#06D6A0` | `#047857` | `#00FF88` |
| `--success-soft` | `rgba(6,214,160,.12)` | `rgba(4,120,87,.08)` | `rgba(0,255,136,.14)` |
| `--success-border` | `rgba(6,214,160,.30)` | `rgba(4,120,87,.25)` | `rgba(0,255,136,.50)` |
| `--info` | `#74B9FF` | `#0369A1` | `#44CCFF` |
| `--info-soft` | `rgba(116,185,255,.12)` | `rgba(3,105,161,.08)` | `rgba(68,204,255,.14)` |
| `--info-border` | `rgba(116,185,255,.30)` | `rgba(3,105,161,.25)` | `rgba(68,204,255,.50)` |

### Shadows

| Token | Dark Slate | Light | Dark HC |
|---|---|---|---|
| `--shadow-xs` | `0 1px 2px rgba(0,0,0,.30)` | `0 1px 2px rgba(20,24,41,.05)` | `0 1px 3px rgba(0,0,0,.60)` |
| `--shadow-sm` | `0 2px 8px rgba(0,0,0,.35)` | `0 2px 8px rgba(20,24,41,.07)` | `0 2px 8px rgba(0,0,0,.70)` |
| `--shadow-md` | `0 4px 16px rgba(0,0,0,.40)` | `0 4px 16px rgba(20,24,41,.09)` | `0 4px 16px rgba(0,0,0,.75)` |
| `--shadow-lg` | `0 8px 32px rgba(0,0,0,.45)` | `0 8px 32px rgba(20,24,41,.11)` | `0 8px 32px rgba(0,0,0,.80)` |
| `--shadow-xl` | `0 16px 48px rgba(0,0,0,.55)` | `0 16px 48px rgba(20,24,41,.14)` | `0 16px 48px rgba(0,0,0,.85)` |
| `--shadow-card` | `0 2px 8px rgba(0,0,0,.35), 0 1px 3px rgba(0,0,0,.25)` | `0 1px 4px rgba(20,24,41,.06), 0 4px 16px rgba(20,24,41,.07)` | `0 2px 12px rgba(0,0,0,.70)` |
| `--shadow-accent` | `0 0 24px rgba(78,205,196,.18)` | `0 0 20px rgba(26,158,151,.14)` | `0 0 24px rgba(0,229,216,.25)` |
| `--shadow-accent-strong` | `0 0 40px rgba(78,205,196,.32)` | `0 0 36px rgba(26,158,151,.22)` | `0 0 44px rgba(0,229,216,.45)` |
| `--shadow-focus` | `0 0 0 3px var(--accent-soft)` | same formula | same formula |
| `--shadow-focus-danger` | `0 0 0 3px var(--danger-soft)` | same formula | same formula |

### Scrollbar

| Token | Dark Slate | Light | Dark HC |
|---|---|---|---|
| `--scrollbar-track` | `#1F2438` | `#ECEFFE` | `#111111` |
| `--scrollbar-thumb` | `#363D5C` | `#C8CCDF` | `#3A3A3A` |
| `--scrollbar-hover` | `#4A5278` | `#B0B8E8` | `#555555` |

---

## 7. Base Reset & Global Behaviors

Applied globally by `design-system.css` — no classes needed:

- `box-sizing: border-box` on all elements
- `body` → `direction: rtl`, `text-align: right`, `font-family: Noto Kufi Arabic`, `background: var(--bg-base)`, `color: var(--text-primary)`, `-webkit-font-smoothing: antialiased`
- `a` → `color: var(--text-link)`, hover → `var(--text-link-hover)`, `transition: var(--transition-fast)`
- `:focus-visible` → `outline: 2px solid var(--accent)`, `outline-offset: 3px`, `border-radius: 4px`
- `::selection` → `background: var(--accent-soft)`, `color: var(--accent)`
- Scrollbar → 5px wide, themed via `--scrollbar-*` tokens
- `@media (prefers-reduced-motion)` → all animations/transitions → `0.01ms`

---

## 8. Backgrounds — Surface Elevation System

Physical layers of depth. Each level is one step elevated above the previous.

```
[Page Body]   --bg-base         → body (applied automatically)
  └── [Section]   --bg-surface-1    → .section
        └── [Card L1]   --bg-surface-2    → .card
              └── [Card L2]   --bg-surface-3    → .card-nested
                    └── [Card L3]   --bg-surface-4    → .card-deep
                          (also: dropdowns, tooltips, selected items)
```

**Rule:** Never skip a level. `.card-deep` goes inside `.card-nested`, which goes inside `.card`.

```tsx
// Correct nesting
<section className="section">
  <div className="card">
    <div className="card-nested">
      <div className="card-deep">deepest content</div>
    </div>
  </div>
</section>

// Wrong — skipping card-nested
<div className="card">
  <div className="card-deep">skipped a level</div>
</div>
```

---

## 9. Typography — Every Class and Value

**Font:** Noto Kufi Arabic — loaded in `layout.tsx`, applied globally on `body`. Never add the font-family manually to components.

### Type Scale

| Token | Value | Class | Use for |
|---|---|---|---|
| `--text-2xs` | `0.65rem` / ~10.4px | `.text-2xs` | Legal text, tiny labels |
| `--text-xs` | `0.72rem` / ~11.5px | `.text-xs` | Timestamps, captions |
| `--text-sm` | `0.82rem` / ~13.1px | `.text-sm` | Badges, supporting labels |
| `--text-base` | `0.94rem` / ~15px | `.text-base` | Body text (default) |
| `--text-md` | `1.00rem` / 16px | `.text-md` | Slightly larger body |
| `--text-lg` | `1.13rem` / ~18px | `.text-lg` | Card titles, subheadings |
| `--text-xl` | `1.31rem` / ~21px | `.text-xl` | Section headings |
| `--text-2xl` | `1.50rem` / 24px | `.text-2xl` | Page headings, alarm times |
| `--text-3xl` | `1.88rem` / ~30px | `.text-3xl` | Hero headings |
| `--text-4xl` | `2.25rem` / 36px | `.text-4xl` | Display |

### Clock Size Scale (separate from body)

| Token | Value | Class | Use for |
|---|---|---|---|
| `--text-clock-xs` | `3.5rem` / 56px | `.clock-xs` | Widget/inline clock |
| `--text-clock-sm` | `5.5rem` / 88px | `.clock-sm` | Standard clock |
| `--text-clock-md` | `8.0rem` / 128px | `.clock-md` | Main featured clock |
| `--text-clock-lg` | `13.0rem` / 208px | `.clock-lg` | Fullscreen |
| `--text-clock-xl` | `22.0rem` / 352px | `.clock-xl` | AMOLED maximized |

### Font Weight

| Token | Value | Class |
|---|---|---|
| `--font-light` | 300 | `.font-light` |
| `--font-regular` | 400 | `.font-regular` |
| `--font-medium` | 500 | `.font-medium` |
| `--font-semibold` | 600 | `.font-semibold` |
| `--font-bold` | 700 | `.font-bold` |
| `--font-extrabold` | 800 | `.font-extrabold` |
| `--font-black` | 900 | `.font-black` |

### Line Height

| Token | Value | Class | Use for |
|---|---|---|---|
| `--leading-none` | 1.00 | `.leading-none` | Clock digits — no extra space |
| `--leading-tight` | 1.25 | `.leading-tight` | Headings |
| `--leading-snug` | 1.40 | `.leading-snug` | Subheadings |
| `--leading-normal` | 1.60 | `.leading-normal` | Body text (Arabic standard) |
| `--leading-relaxed` | 1.75 | `.leading-relaxed` | Long descriptions |
| `--leading-loose` | 2.00 | `.leading-loose` | Open/accessible content |

### Letter Spacing

| Token | Value | Use for |
|---|---|---|
| `--tracking-tight` | `-0.01em` | Headings |
| `--tracking-normal` | `0em` | Arabic body — always zero |
| `--tracking-wide` | `0.06em` | Numbers, Latin labels ONLY |
| `--tracking-wider` | `0.10em` | Decorative non-Arabic only |
| `--tracking-clock` | `0.04em` | Clock digits |

### Default Heading Styles (applied globally — no class needed)

```
h1 → text-3xl, font-bold,     leading-tight, tracking-tight, text-primary
h2 → text-2xl, font-semibold, leading-tight, text-primary
h3 → text-xl,  font-semibold, leading-snug,  text-primary
h4 → text-lg,  font-medium,   leading-snug,  text-primary
h5, h6 → text-base, font-medium, text-secondary
p → leading-normal, text-primary, max-width: 65ch
```

### Text Color Classes

```css
.text-primary    → color: var(--text-primary)    !important
.text-secondary  → color: var(--text-secondary)  !important
.text-muted      → color: var(--text-muted)      !important
.text-disabled   → color: var(--text-disabled)   !important
.text-accent     → color: var(--accent)          !important
.text-accent-alt → color: var(--accent-alt)      !important
.text-danger     → color: var(--danger)          !important
.text-warning    → color: var(--warning)         !important
.text-success    → color: var(--success)         !important
.text-info       → color: var(--info)            !important
.text-clock      → color: var(--clock-digit-color) !important
```

### `.tabular-nums` — Critical for Clocks

```css
font-variant-numeric: tabular-nums;
font-feature-settings: "tnum" 1;
```

Prevents digit-width layout shifts as numbers change (`1` is narrower than `8` without this).

```tsx
// Always required on time-showing elements
<div className="clock-display clock-md clock-glow tabular-nums">{time}</div>
<div className="alarm-time tabular-nums">07:30</div>
```

### Arabic Text — Letter Spacing Rule

```tsx
// Correct — zero tracking for Arabic
<p className="text-base leading-normal text-primary">النص العربي هنا</p>

// Correct — tracking only on numbers
<span className="tabular-nums tracking-wide">07:30</span>

// NEVER — breaks Arabic letterform connections
<p className="tracking-wide">النص العربي</p>
<p className="tracking-wider">النص العربي</p>
```

---

## 10. Spacing System

Base grid: **8px**. All tokens map to Tailwind's mental model.

| Token | Value | Tailwind equivalent |
|---|---|---|
| `--space-px` | 1px | — |
| `--space-0-5` | 2px | `p-0.5` |
| `--space-1` | 4px | `p-1` / `gap-1` |
| `--space-1-5` | 6px | `p-1.5` |
| `--space-2` | 8px | `p-2` / `gap-2` |
| `--space-2-5` | 10px | `p-2.5` |
| `--space-3` | 12px | `p-3` / `gap-3` |
| `--space-3-5` | 14px | `p-3.5` |
| `--space-4` | 16px | `p-4` / `gap-4` |
| `--space-5` | 20px | `p-5` / `gap-5` |
| `--space-6` | 24px | `p-6` / `gap-6` |
| `--space-7` | 28px | — |
| `--space-8` | 32px | `p-8` / `gap-8` |
| `--space-10` | 40px | `p-10` |
| `--space-12` | 48px | `p-12` |
| `--space-14` | 56px | — |
| `--space-16` | 64px | `p-16` |
| `--space-20` | 80px | `p-20` |
| `--space-24` | 96px | — |
| `--space-32` | 128px | — |

Gap utility classes: `.gap-1` `.gap-2` `.gap-3` `.gap-4` `.gap-5` `.gap-6` `.gap-8`

---

## 11. Border Radius System

| Token | Value | Class | Use for |
|---|---|---|---|
| `--radius-none` | 0 | — | No rounding |
| `--radius-xs` | 3px | `.rounded-xs` | Tiny tags, inline badges |
| `--radius-sm` | 6px | `.rounded-sm` | Small buttons, inputs |
| `--radius-md` | 10px | `.rounded-md` | Standard inputs, buttons |
| `--radius-lg` | 14px | `.rounded-lg` | Nested cards |
| `--radius-xl` | 18px | `.rounded-xl` | Main cards |
| `--radius-2xl` | 24px | `.rounded-2xl` | Sections, modals |
| `--radius-3xl` | 32px | `.rounded-3xl` | Large panels |
| `--radius-full` | 9999px | `.rounded-full` | Pills, chips, dots, switches |

---

## 12. Shadow System

Utility classes:
```css
.shadow-xs            → box-shadow: var(--shadow-xs)
.shadow-sm            → box-shadow: var(--shadow-sm)
.shadow-md            → box-shadow: var(--shadow-md)
.shadow-lg            → box-shadow: var(--shadow-lg)
.shadow-xl            → box-shadow: var(--shadow-xl)
.shadow-accent        → box-shadow: var(--shadow-accent)
.shadow-accent-strong → box-shadow: var(--shadow-accent-strong)
```

Additional shadow tokens:
```css
--shadow-inner:        inset 0 1px 3px rgba(0,0,0,0.15)
--shadow-inner-strong: inset 0 1px 5px rgba(0,0,0,0.35)
--shadow-focus:        0 0 0 3px var(--accent-soft)      /* used by :focus-visible, inputs */
--shadow-focus-danger: 0 0 0 3px var(--danger-soft)      /* used by .input--error:focus */
```

---

## 13. Transition & Motion Tokens

### Duration

| Token | Value |
|---|---|
| `--duration-instant` | 80ms |
| `--duration-fast` | 150ms |
| `--duration-base` | 250ms |
| `--duration-slow` | 400ms |
| `--duration-slower` | 600ms |

### Easing

| Token | Value |
|---|---|
| `--ease-out` | `cubic-bezier(0, 0, 0.2, 1)` |
| `--ease-in-out` | `cubic-bezier(0.4, 0, 0.2, 1)` |
| `--ease-spring` | `cubic-bezier(0.175, 0.885, 0.32, 1.275)` |
| `--ease-bounce` | `cubic-bezier(0.34, 1.56, 0.64, 1)` |

### Preset Transitions

| Token | Speed + Easing | Use for |
|---|---|---|
| `--transition-fast` | 150ms ease-out | Hover states, button presses |
| `--transition-base` | 250ms ease-in-out | Card hover, most UI |
| `--transition-slow` | 400ms ease-in-out | Panel open/close |
| `--transition-theme` | 400ms ease-in-out | Theme switching |
| `--transition-spring` | 400ms ease-spring | Switch thumb animation |

### `.theme-transition`

Applied to `<html>`. Adds `!important` transitions to `background-color`, `border-color`, `color`, `box-shadow` on every element — enabling smooth theme switches.

---

## 14. Z-Index Scale

| Token | Value | Use for |
|---|---|---|
| `--z-below` | -1 | Behind base |
| `--z-base` | 0 | Normal flow |
| `--z-raised` | 10 | Slightly elevated |
| `--z-float` | 50 | Floating buttons |
| `--z-dropdown` | 100 | Dropdowns, popovers |
| `--z-sticky` | 200 | Sticky headers |
| `--z-fixed` | 250 | Fixed nav |
| `--z-overlay` | 300 | Overlays |
| `--z-modal` | 400 | Modals |
| `--z-tooltip` | 500 | Tooltips |
| `--z-toast` | 600 | Toast notifications |
| `--z-max` | 9999 | Fullscreen mode |

---

## 15. Layout — Container, Section, Grid

### `.container`

```css
width: 100%
max-width: 1320px
margin-inline: auto
padding-inline: var(--space-6)   /* 24px */
```

Modifiers: `.container--narrow` → max 760px | `.container--wide` → max 1600px

### `.section`

```css
background-color: var(--bg-surface-1)
border: 1px solid var(--border-subtle)
border-radius: var(--radius-2xl)   /* 24px */
padding: var(--space-8)             /* 32px */
```

Modifier: `.section--flat` → no border, transparent background

### `.divider`

```css
height: 1px
background-color: var(--border-subtle)
margin-block: var(--space-6)   /* 24px top + bottom */
```

Modifier: `.divider--strong` → uses `--border-default`

### `.grid-auto`

```css
display: grid
grid-template-columns: repeat(auto-fit, minmax(260px, 1fr))
gap: var(--space-5)   /* 20px */
```

---

## 16. Card System

### L1 — `.card`

```css
background-color: var(--bg-surface-2)
border: 1px solid var(--border-default)
border-radius: var(--radius-xl)   /* 18px */
padding: var(--space-6)            /* 24px */
box-shadow: var(--shadow-card)
transition: bg, border, box-shadow, transform — --transition-base
```

Hover:
```css
border-color: var(--border-strong)
box-shadow: var(--shadow-md)
transform: translateY(-1px)
```

### L2 — `.card-nested`

```css
background-color: var(--bg-surface-3)
border: 1px solid var(--border-subtle)
border-radius: var(--radius-lg)        /* 14px */
padding: var(--space-4) var(--space-5)  /* 16px 20px */
box-shadow: var(--shadow-xs)
```

Hover: `border-color: var(--border-default)`

### L3 — `.card-deep`

```css
background-color: var(--bg-surface-4)
border: 1px solid var(--border-subtle)
border-radius: var(--radius-md)        /* 10px */
padding: var(--space-3) var(--space-4)  /* 12px 16px */
```

### Card Variants (add alongside `.card`)

| Class | Effect |
|---|---|
| `.card--accent` | `--border-accent-strong` border + accent glow on hover |
| `.card--glass` | `backdrop-filter: blur(20px)`, uses `--bg-glass` |
| `.card--flat` | No shadow, `--border-subtle` border |
| `.card--danger` | `--danger-border` border, `--danger-soft` background |

### Card Sub-elements

| Class | Exact styles |
|---|---|
| `.card__header` | `flex justify-between`, `padding-bottom: space-4`, `border-bottom: 1px solid --border-subtle`, `margin-bottom: space-5` |
| `.card__title` | `text-lg font-semibold leading-tight text-primary` |
| `.card__subtitle` | `text-sm text-secondary margin-top: space-1 leading-snug` |
| `.card__footer` | `flex items-center gap-3`, `padding-top: space-4`, `border-top: 1px solid --border-subtle`, `margin-top: space-5` |

### Full Card Example

```tsx
<div className="card">
  <div className="card__header">
    <div>
      <h3 className="card__title">المنبهات</h3>
      <p className="card__subtitle">3 منبهات نشطة</p>
    </div>
    <button className="btn btn-ghost btn-icon" aria-label="إضافة">
      <PlusIcon className="w-5 h-5" />
    </button>
  </div>

  <div className="flex flex-col gap-3">
    {/* alarm items */}
  </div>

  <div className="card__footer">
    <button className="btn btn-secondary btn-sm btn-pill">عرض الكل</button>
  </div>
</div>

{/* Variant examples */}
<div className="card card--accent">   {/* active/selected card */}
<div className="card card--glass">   {/* frosted overlay */}
<div className="card card--danger">  {/* ringing alarm */}
<div className="card card--flat">    {/* no shadow */}
```

---

## 17. Button System

### Base `.btn`

```css
display: inline-flex; align-items: center; justify-content: center; gap: space-2
font-weight: --font-semibold
font-size: --text-base
line-height: --leading-none
border: 1px solid transparent
border-radius: --radius-md
padding: space-3 space-5    /* 12px 20px */
cursor: pointer
transition: bg, border, color, box-shadow, transform — --transition-fast
```

`:active` → `transform: translateY(1px) scale(0.99)`
`:disabled` → `opacity: 0.38; pointer-events: none`

### Button Types

| Class | BG | Text | Border | Hover |
|---|---|---|---|---|
| `.btn-primary` | `--accent` | `--text-on-accent` | `--accent` | Darker + `--shadow-accent` |
| `.btn-secondary` | transparent | `--accent` | `--border-accent-strong` | `--accent-soft` bg |
| `.btn-ghost` | transparent | `--text-secondary` | transparent | `--bg-surface-3` bg |
| `.btn-surface` | `--bg-surface-3` | `--text-primary` | `--border-default` | `--bg-surface-4` |
| `.btn-danger` | `--danger` | `#ffffff` | `--danger` | `--danger-hover` + glow |

### Button Sizes

| Class | Font | Padding | Radius |
|---|---|---|---|
| `.btn-xs` | `text-xs` | `6px 10px` | 3px |
| `.btn-sm` | `text-sm` | `8px 14px` | 6px |
| *(none)* | `text-base` | `12px 20px` | 10px |
| `.btn-lg` | `text-lg` | `16px 32px` | 14px |
| `.btn-xl` | `text-xl` | `20px 40px` | 18px |

### Shape Modifiers

| Class | Effect |
|---|---|
| `.btn-icon` | Square (`aspect-ratio: 1`), `padding: space-2-5`, `radius-md` |
| `.btn-pill` | `border-radius: radius-full` (9999px) |
| `.btn-block` | `width: 100%` |

```tsx
<button className="btn btn-primary btn-lg btn-pill">ابدأ العد التنازلي</button>
<button className="btn btn-primary">إضافة منبه</button>
<button className="btn btn-secondary btn-sm">تعديل</button>
<button className="btn btn-ghost">إلغاء</button>
<button className="btn btn-surface">إعدادات</button>
<button className="btn btn-danger btn-sm">حذف المنبه</button>
<button className="btn btn-ghost btn-icon" aria-label="حذف"><TrashIcon /></button>
<button className="btn btn-primary btn-block btn-lg">حفظ التغييرات</button>
```

---

## 18. Input System

### `.input-group`

Wrapper: `flex flex-col gap: space-1-5`

### `.input-label`

`text-sm font-medium text-secondary leading-snug`

`.input-label--required` → adds ` *` after label in `--danger` color via `::after` pseudo-element

### `.input`

```css
width: 100%
background-color: var(--bg-surface-3)
color: var(--text-primary)
border: 1px solid var(--border-default)
border-radius: var(--radius-md)   /* 10px */
padding: var(--space-3) var(--space-4)   /* 12px 16px */
font-size: var(--text-base)
direction: rtl
```

States:
- `::placeholder` → `--text-muted`
- `:hover` → `border: --border-strong`
- `:focus` → `border: --accent`, `box-shadow: --shadow-focus`, `background: --bg-surface-2`
- `:disabled` → `opacity: 0.5`, `background: --bg-surface-4`
- `.input--error` → `border: --danger`
- `.input--error:focus` → `box-shadow: --shadow-focus-danger`

### `.textarea`

Add alongside `.input`: `resize: vertical; min-height: 100px; line-height: --leading-relaxed`

### `.input-time`

Add alongside `.input`:
```css
font-variant-numeric: tabular-nums
font-size: var(--text-2xl)
font-weight: var(--font-bold)
letter-spacing: var(--tracking-clock)
text-align: center
color: var(--clock-digit-color)
background-color: var(--bg-surface-2)
border-color: var(--border-accent)
border-radius: var(--radius-lg)   /* 14px */
padding: var(--space-4) var(--space-6)
```

`:focus` → `border: --accent`, `box-shadow: --shadow-accent`

### Hint and Error

```css
.input-hint      → text-xs text-muted
.input-error-msg → text-xs text-danger
```

### Full Form Example

```tsx
<div className="card">
  <div className="flex flex-col gap-5">

    <div className="input-group">
      <label className="input-label input-label--required">اسم المنبه</label>
      <input type="text" className="input" placeholder="مثال: الاستيقاظ الصباحي" />
      <span className="input-hint">سيظهر هذا الاسم عند الرنين</span>
    </div>

    <div className="input-group">
      <label className="input-label input-label--required">الوقت</label>
      <input type="time" className="input input-time" defaultValue="07:00" />
    </div>

    <div className="input-group">
      <label className="input-label">التكرار</label>
      <select className="select">
        <option>بدون تكرار</option>
        <option>يومياً</option>
        <option>أيام الأسبوع</option>
      </select>
    </div>

    <div className="input-group">
      <label className="input-label">الوقت (خطأ)</label>
      <input type="text" className="input input--error" value="25:99" />
      <span className="input-error-msg">وقت غير صحيح</span>
    </div>

    <div className="input-group">
      <label className="input-label">ملاحظات</label>
      <textarea className="input textarea" rows={3} placeholder="ملاحظات..." />
    </div>

  </div>

  <div className="flex gap-3 mt-6 pt-5 border-t border-[--border-subtle]">
    <button className="btn btn-primary flex-1">حفظ المنبه</button>
    <button className="btn btn-ghost">إلغاء</button>
  </div>
</div>
```

---

## 19. Badge & Chip System

### `.badge`

Non-interactive status indicator.

```css
display: inline-flex; align-items: center; gap: space-1
font-size: --text-xs; font-weight: --font-semibold
padding: 3px space-2
border-radius: --radius-full
border: 1px solid transparent
white-space: nowrap
```

Has `::before` — 5px circle dot in `currentColor`

| Class | BG | Text | Border |
|---|---|---|---|
| `.badge-default` | `--bg-surface-3` | `--text-secondary` | `--border-default` |
| `.badge-accent` | `--accent-soft` | `--accent` | `--border-accent` |
| `.badge-danger` | `--danger-soft` | `--danger` | `--danger-border` |
| `.badge-warning` | `--warning-soft` | `--warning` | `--warning-border` |
| `.badge-success` | `--success-soft` | `--success` | `--success-border` |
| `.badge-info` | `--info-soft` | `--info` | `--info-border` |

### `.chip`

Clickable filter/category button.

```css
display: inline-flex; align-items: center
font-size: --text-sm; font-weight: --font-medium
padding: space-2 space-3-5    /* 8px 14px */
border-radius: --radius-full
border: 1px solid --border-default
background-color: --bg-surface-3
color: --text-secondary
cursor: pointer; transition: all --transition-fast
```

Hover and `.chip--active`:
```css
background-color: --accent-soft
color: --accent
border-color: --border-accent
```

```tsx
<span className="badge badge-accent">نشط</span>
<span className="badge badge-success">مكتمل</span>
<span className="badge badge-warning">قريباً</span>
<span className="badge badge-danger">متأخر</span>
<span className="badge badge-info">جديد</span>
<span className="badge badge-default">معطل</span>

<div className="flex gap-2 flex-wrap">
  <button className="chip chip--active">السبت</button>
  <button className="chip">الأحد</button>
  <button className="chip">الاثنين</button>
</div>
```

---

## 20. Tab System

### `.tabs` (pill — default)

```css
display: flex; gap: space-1
background-color: --bg-surface-2
border: 1px solid --border-subtle
border-radius: --radius-xl   /* 18px */
padding: space-1
```

### `.tab`

```css
flex: 1; text-align: center
padding: space-2 space-4    /* 8px 16px */
border-radius: --radius-lg  /* 14px */
font-size: --text-base; font-weight: --font-medium
color: --text-secondary
border: 1px solid transparent
transition: all --transition-fast
```

Hover → `color: --text-primary`

`.tab--active`:
```css
background-color: --bg-surface-4
color: --accent
border-color: --border-accent
box-shadow: --shadow-xs
font-weight: --font-semibold
```

### `.tabs--underline` variant

Add alongside `.tabs`. Removes background, adds bottom border style:

`.tabs--underline .tab--active` → `border-bottom: 2px solid --accent`, no shadow, no background

```tsx
{/* Pill tabs */}
<div className="tabs" role="tablist">
  <button className="tab tab--active" role="tab" aria-selected="true">الساعة</button>
  <button className="tab" role="tab" aria-selected="false">المنبه</button>
  <button className="tab" role="tab" aria-selected="false">التايمر</button>
  <button className="tab" role="tab" aria-selected="false">العد التنازلي</button>
</div>

{/* Underline tabs */}
<div className="tabs tabs--underline" role="tablist">
  <button className="tab tab--active" role="tab">اليوم</button>
  <button className="tab" role="tab">الأسبوع</button>
  <button className="tab" role="tab">الشهر</button>
</div>
```

---

## 21. Switch / Toggle

### Required HTML structure — all 3 parts

```tsx
<label className="switch">
  <input type="checkbox" />         {/* hidden */}
  <span className="switch__track"></span>
  <span className="switch__thumb"></span>
</label>
```

### `.switch`

`position: relative; display: inline-block; width: 44px; height: 24px; cursor: pointer; flex-shrink: 0`

### `.switch__track`

Default: `background: --bg-surface-4`, `border: 1px solid --border-strong`, `border-radius: full`

When `input:checked ~`: `background: --accent-soft`, `border: --accent`

### `.switch__thumb`

Default: `position: absolute; width: 18px; height: 18px; top: 2px; right: 2px; background: --text-muted; border-radius: 50%`

When `input:checked ~`: `background: --accent; transform: translateX(-20px)` (slides left in RTL)

The thumb transitions with `--transition-spring` (bouncy feel).

```tsx
{/* Basic */}
<label className="switch">
  <input type="checkbox" defaultChecked />
  <span className="switch__track"></span>
  <span className="switch__thumb"></span>
</label>

{/* Alarm enable/disable row */}
<div className="flex items-center justify-between">
  <div>
    <p className="font-medium text-base text-primary">منبه الصباح</p>
    <p className="text-sm text-secondary">07:00 — يومياً</p>
  </div>
  <label className="switch">
    <input type="checkbox" defaultChecked />
    <span className="switch__track"></span>
    <span className="switch__thumb"></span>
  </label>
</div>
```

---

## 22. Select / Dropdown

### `.select`

```css
appearance: none
width: 100%
background-color: --bg-surface-3
color: --text-primary
border: 1px solid --border-default
border-radius: --radius-md
padding: space-3 space-4, padding-left: space-10   /* room for chevron */
font-size: --text-base
direction: rtl
cursor: pointer
background-image: SVG chevron (color #7880AA)
background-position: left space-3 center            /* RTL: chevron on left */
```

States: hover → `--border-strong` | focus → `--accent` border + `--shadow-focus`

```tsx
<select className="select">
  <option>بدون تكرار</option>
  <option>يومياً</option>
  <option>أيام الأسبوع</option>
  <option>نهايات الأسبوع</option>
</select>
```

---

## 23. Clock Display

The most important component. Every visual property changes per theme automatically.

### Theme Color Table

| Theme | `--clock-digit-color` | Glow |
|---|---|---|
| `dark` | `#4ECDC4` | 3-layer teal (0.55 → 0.28 → 0.12) |
| `light` | `#1D4ED8` | `none` |
| `dark-hc` | `#FFFFFF` | 3-layer white (0.80 → 0.40 → 0.15) |

### `.clock-wrapper`

`display: flex; flex-direction: column; align-items: center; gap: space-4`

### `.clock-display` — Base class (required)

```css
display: flex; align-items: center; justify-content: center; gap: space-1
font-variant-numeric: tabular-nums
font-feature-settings: "tnum" 1
font-weight: --font-extrabold   /* 800 */
letter-spacing: --tracking-clock  /* 0.04em */
line-height: --leading-none
color: var(--clock-digit-color)  /* auto per theme */
transition: color --transition-theme
```

### Size classes (add one)

```
.clock-xs → 56px   .clock-sm → 88px   .clock-md → 128px
.clock-lg → 208px  .clock-xl → 352px
```

### `.clock-glow`

`text-shadow: var(--clock-digit-glow)` — safe to always include (is `none` in light theme)

### `.clock-sep` (the colon)

```css
color: var(--clock-separator)
margin-bottom: 0.12em
user-select: none
animation: clock-blink 1s step-start infinite
```

`clock-blink`: 0%/100% → `opacity: 1` | 50% → `opacity: 0.15`

### `.clock-segment`

`display: flex; flex-direction: column; align-items: center; gap: space-2`

### `.clock-segment__label`

`text-xs font-medium tracking-wide color: --clock-label; text-transform: uppercase; user-select: none`

### `.clock-ampm`

`text-lg font-semibold color: --clock-digit-color; opacity: 0.55; align-self: flex-end; margin-bottom: 0.3em`

### Color Picker

```css
.clock-color-picker          → flex; gap: space-2
.clock-color-swatch          → 22px circle, border: 2px transparent, cursor: pointer
.clock-color-swatch:hover    → scale(1.25)
.clock-color-swatch--active  → border-color: --text-primary, scale(1.15)
```

Override via JS (applies to individual element only):
```ts
element.style.setProperty('--clock-digit-color', '#FF6B6B')
```

### Full Clock Examples

```tsx
{/* Standard clock with all sub-elements */}
<div className="clock-wrapper">
  <div className="clock-display clock-md clock-glow tabular-nums">
    <div className="clock-segment">
      <span>{hours}</span>
      <span className="clock-segment__label">ساعة</span>
    </div>
    <span className="clock-sep">:</span>
    <div className="clock-segment">
      <span>{minutes}</span>
      <span className="clock-segment__label">دقيقة</span>
    </div>
    <span className="clock-sep">:</span>
    <div className="clock-segment">
      <span>{seconds}</span>
      <span className="clock-segment__label">ثانية</span>
    </div>
    <span className="clock-ampm">م</span>
  </div>
</div>

{/* Small widget */}
<div className="clock-display clock-xs tabular-nums clock-glow">
  12:34:56
</div>
```

---

## 24. Progress & Countdown

### `.progress-track`

`width: 100%; height: 5px; background: --bg-surface-3; border-radius: full; overflow: hidden`

### `.progress-fill`

`height: 100%; border-radius: full; background: --accent; transition: width 1s linear`

### `.progress-fill--countdown`

```css
background: linear-gradient(90deg, var(--success) 0%, var(--warning) 60%, var(--danger) 100%)
background-size: 300% 100%
```

Drive color shift via JS:
```ts
// As timeLeftPercent goes 100 → 0, color shifts green → yellow → red
fill.style.backgroundPosition = `${100 - timeLeftPercent}% 0`
```

### Circular Progress (SVG)

```css
.progress-ring          → transform: rotate(-90deg)
.progress-ring__track   → fill: none; stroke: --bg-surface-3
.progress-ring__fill    → fill: none; stroke: --accent; stroke-linecap: round; transition: stroke-dashoffset 1s linear
```

```tsx
{/* Linear */}
<div className="progress-track">
  <div className="progress-fill" style={{ width: `${pct}%` }} />
</div>

{/* Countdown — shifts from green to red */}
<div className="progress-track">
  <div
    className="progress-fill progress-fill--countdown"
    style={{ width: `${timeLeft}%`, backgroundPosition: `${100 - timeLeft}% 0` }}
  />
</div>

{/* Circular SVG */}
<svg width="120" height="120" className="progress-ring">
  <circle className="progress-ring__track" cx="60" cy="60" r="54" strokeWidth="8" />
  <circle
    className="progress-ring__fill"
    cx="60" cy="60" r="54"
    strokeWidth="8"
    strokeDasharray={`${2 * Math.PI * 54}`}
    strokeDashoffset={`${2 * Math.PI * 54 * (1 - pct / 100)}`}
  />
</svg>
```

---

## 25. Alarm Item

### `.alarm-item`

```css
display: flex; align-items: center; gap: space-4
padding: space-4 space-5   /* 16px 20px */
background: --bg-surface-2
border: 1px solid --border-subtle
border-radius: --radius-xl
transition: bg, border, box-shadow — --transition-fast
```

Hover: `border: --border-default; background: --bg-surface-3`

### States

| Class | Border | Background | Extra |
|---|---|---|---|
| *(none)* | `--border-subtle` | `--bg-surface-2` | Inactive/disabled alarm |
| `.alarm-item--active` | `--border-accent` | `--accent-soft` | Enabled alarm |
| `.alarm-item--ringing` | `--danger-border` | `--danger-soft` | `animation: alarm-pulse 0.7s ease-in-out infinite alternate` |

`alarm-pulse`:
```css
from { box-shadow: 0 0 0 0 var(--danger-soft); }
to   { box-shadow: 0 0 0 10px transparent; }
```

### `.alarm-time`

`font-variant-numeric: tabular-nums; text-2xl font-bold; letter-spacing: --tracking-clock; leading-none; flex-shrink: 0`

Color: `--text-primary` → active: `--accent` → ringing: `--danger`

### Sub-elements

| Class | Styles |
|---|---|
| `.alarm-info` | `flex: 1; min-width: 0` |
| `.alarm-label` | `text-base font-medium text-primary; overflow: hidden; text-overflow: ellipsis; white-space: nowrap` |
| `.alarm-days` | `flex gap-1 flex-wrap; margin-top: space-1-5` |
| `.alarm-day` | `text-2xs font-medium text-muted; background: --bg-surface-3; border-radius: --radius-xs` |
| `.alarm-day--active` | `color: --accent; background: --accent-soft` |

```tsx
<div className="alarm-item alarm-item--active">
  <div className="alarm-time tabular-nums">07:30</div>

  <div className="alarm-info">
    <p className="alarm-label">الاستيقاظ الصباحي</p>
    <div className="alarm-days">
      <span className="alarm-day alarm-day--active">س</span>
      <span className="alarm-day alarm-day--active">ح</span>
      <span className="alarm-day">ن</span>
      <span className="alarm-day">ث</span>
      <span className="alarm-day">ر</span>
      <span className="alarm-day">خ</span>
      <span className="alarm-day">ج</span>
    </div>
  </div>

  <label className="switch">
    <input type="checkbox" defaultChecked />
    <span className="switch__track"></span>
    <span className="switch__thumb"></span>
  </label>
</div>
```

---

## 26. Modal & Overlay

### `.modal-overlay`

```css
position: fixed; inset: 0
background: --bg-overlay
backdrop-filter: blur(6px)
z-index: --z-modal    /* 400 */
display: flex; align-items: center; justify-content: center
padding: space-6
```

### `.modal`

```css
background: --bg-surface-2
border: 1px solid --border-default
border-radius: --radius-2xl   /* 24px */
padding: space-8               /* 32px */
width: 100%; max-width: 500px
box-shadow: --shadow-xl
position: relative
direction: rtl
```

### Sub-elements

| Class | Styles |
|---|---|
| `.modal__header` | `padding-bottom: space-5; margin-bottom: space-6; border-bottom: 1px solid --border-subtle` |
| `.modal__title` | `text-xl font-semibold text-primary` |
| `.modal__subtitle` | `text-sm text-secondary margin-top: space-1` |
| `.modal__close` | `position: absolute; top: space-5; left: space-5` (RTL left = visual end), 32×32px, `background: --bg-surface-3`, `border: 1px solid --border-subtle`, `border-radius: --radius-sm` |

```tsx
{isOpen && (
  <div className="modal-overlay" onClick={handleClose}>
    <div className="modal" role="dialog" aria-modal="true" onClick={e => e.stopPropagation()}>

      <div className="modal__header">
        <h2 className="modal__title">إضافة منبه جديد</h2>
        <p className="modal__subtitle">اضبط وقت المنبه وخصائصه</p>
      </div>

      <button className="modal__close" onClick={handleClose} aria-label="إغلاق">✕</button>

      <div className="flex flex-col gap-5">
        {/* form fields */}
      </div>

      <div className="flex gap-3 mt-6 pt-5 border-t border-[--border-subtle]">
        <button className="btn btn-primary flex-1">حفظ</button>
        <button className="btn btn-ghost" onClick={handleClose}>إلغاء</button>
      </div>
    </div>
  </div>
)}
```

---

## 27. Toast / Notification

### `.toast-container`

```css
position: fixed
bottom: space-6; left: space-6    /* RTL: bottom-left */
display: flex; flex-direction: column; gap: space-3
z-index: --z-toast    /* 600 */
pointer-events: none
max-width: 380px
```

### `.toast`

```css
background: --bg-surface-3
border: 1px solid --border-default
border-radius: --radius-xl
padding: space-4 space-5
box-shadow: --shadow-lg
font-size: --text-sm
pointer-events: all
border-right: 3px solid --accent    /* RTL: accent bar on right side */
```

### Toast Variants (changes the `border-right` color)

| Class | Accent bar color |
|---|---|
| *(default)* | `--accent` (teal) |
| `.toast-danger` | `--danger` |
| `.toast-warning` | `--warning` |
| `.toast-success` | `--success` |
| `.toast-info` | `--info` |

| Sub-element | Styles |
|---|---|
| `.toast__title` | `font-semibold; margin-bottom: space-1` |
| `.toast__msg` | `text-secondary` |

```tsx
<div className="toast-container">
  <div className="toast">
    <div>
      <p className="toast__title">تم حفظ المنبه</p>
      <p className="toast__msg">سيرن الساعة 07:30 صباحاً</p>
    </div>
  </div>
  <div className="toast toast-success"><p className="toast__title">تم تفعيل المنبه</p></div>
  <div className="toast toast-danger">
    <div>
      <p className="toast__title">فشل الحفظ</p>
      <p className="toast__msg">يرجى المحاولة مرة أخرى</p>
    </div>
  </div>
  <div className="toast toast-warning"><p className="toast__title">المنبه خلال 5 دقائق</p></div>
</div>
```

---

## 28. Empty State

### `.empty-state`

`display: flex; flex-direction: column; align-items: center; justify-content: center; gap: space-5; padding: space-20 space-8; text-align: center`

| Sub-element | Styles |
|---|---|
| `.empty-state__icon` | `font-size: 3rem; opacity: 0.28` |
| `.empty-state__title` | `text-lg font-semibold text-secondary` |
| `.empty-state__description` | `text-base text-muted; max-width: 300px; leading-relaxed` |

```tsx
<div className="empty-state">
  <div className="empty-state__icon">🔔</div>
  <h3 className="empty-state__title">لا توجد منبهات</h3>
  <p className="empty-state__description">أضف منبهك الأول وابدأ يومك بالوقت المناسب</p>
  <button className="btn btn-primary btn-pill">إضافة منبه</button>
</div>
```

---

## 29. Fullscreen Mode

**Always dark. Always teal. Regardless of the current theme.**

This is a deliberate design decision — long-duration clock viewing requires a dark background.

### `.fullscreen-mode`

```css
position: fixed; inset: 0
background-color: #0A0C18    /* HARDCODED — not a token */
display: flex; flex-direction: column; align-items: center; justify-content: center
z-index: var(--z-max)        /* 9999 */
```

### Overrides inside `.fullscreen-mode` (hardcoded, ignores app theme)

```css
.fullscreen-mode .clock-display { color: #4ECDC4; }
.fullscreen-mode .clock-glow {
  text-shadow:
    0 0 30px rgba(78, 205, 196, 0.65),
    0 0 70px rgba(78, 205, 196, 0.32),
    0 0 130px rgba(78, 205, 196, 0.14);
}
.fullscreen-mode .clock-sep { color: rgba(78, 205, 196, 0.38); }
```

### `.fullscreen-exit`

```css
position: absolute; top: space-6; left: space-6   /* RTL: top-left */
opacity: 0
transition: opacity --transition-base
```

On `.fullscreen-mode:hover .fullscreen-exit` → `opacity: 1`

```tsx
{isFullscreen && (
  <div className="fullscreen-mode">
    <button className="fullscreen-exit btn btn-ghost btn-sm" onClick={exitFullscreen}>
      خروج
    </button>

    <div className="clock-wrapper">
      <div className="clock-display clock-lg clock-glow tabular-nums font-black">
        <span className="clock-segment">
          <span>{hours}</span>
          <span className="clock-segment__label">ساعة</span>
        </span>
        <span className="clock-sep">:</span>
        <span className="clock-segment">
          <span>{minutes}</span>
          <span className="clock-segment__label">دقيقة</span>
        </span>
        <span className="clock-sep">:</span>
        <span className="clock-segment">
          <span>{seconds}</span>
          <span className="clock-segment__label">ثانية</span>
        </span>
      </div>
    </div>
  </div>
)}
```

---

## 30. Accent Placement Rules

**Teal covers max 10–15% of any screen.** It signals importance. Overusing it destroys the signal.

### Accent Utility Classes

| Class | Renders |
|---|---|
| `.accent-dot` | 8px teal dot (`--accent`) |
| `.accent-dot--danger` | 8px red dot |
| `.accent-dot--warning` | 8px yellow dot |
| `.accent-dot--success` | 8px green dot |
| `.accent-line-top` | `border-top: 2px solid var(--accent)` |
| `.accent-highlight` | `background: --accent-soft; border-radius: --radius-md; padding: space-3 space-4` |
| `.active-indicator` | `border-right: 3px solid var(--accent); padding-right: space-4` |

### Use Accent For

Active tab | Primary CTA (one per screen) | Clock digits | Progress fill | Focus rings | Switch thumb | Active chip | `.card--accent` border | Links | `.active-indicator`

### Never Use Accent For

Section/page backgrounds | Card fills | Multiple buttons on one screen | Decorative dividers | Non-active icon backgrounds

---

## 31. Using Tokens in Tailwind

The `@theme inline` bridge in `design-system.css` maps CSS vars to Tailwind utility names.

### Method 1 — Tailwind mapped name (preferred)

```tsx
<div className="bg-surface-2 text-primary">
<div className="text-accent bg-accent-soft">
```

### Method 2 — CSS var directly (for unmapped tokens)

```tsx
<div className="bg-[--bg-surface-2] text-[--text-primary]">
<div className="border-[--border-accent] shadow-[--shadow-accent]">
<div className="text-[--clock-digit-color]">
```

### With shadcn

shadcn uses `--background`, `--foreground`, `--primary` — different namespace, no conflict.

```tsx
{/* Our custom components */}
<button className="btn btn-primary">حفظ</button>

{/* shadcn with our token overrides */}
<Dialog>
  <DialogContent className="bg-[--bg-surface-2] border-[--border-default]">
    <p className="text-secondary">محتوى</p>
  </DialogContent>
</Dialog>

{/* Mixing — fine */}
<Popover>
  <PopoverContent className="bg-[--bg-surface-3] border-[--border-subtle] shadow-md">
    content
  </PopoverContent>
</Popover>
```

---

## 32. RTL Rules — What AI Must Not Get Wrong

This is an Arabic-first, RTL app. These are the exact behaviors that differ from LTR.

### Document Direction

`<html dir="rtl">` and `body { direction: rtl; text-align: right; }` — set globally. Never override with `dir="ltr"` on a component unless it contains purely Latin/numeric content.

### Physical vs Logical Properties in RTL

In RTL, `left` and `right` swap their visual meaning:
- Visual left (where English starts) = logical `end`
- Visual right (where Arabic starts) = logical `start`

```
LTR layout: [START ... END]  →  left side is start
RTL layout: [END ... START]  →  right side is start
```

Existing RTL-aware positioning in `design-system.css`:

| Element | Property | Why |
|---|---|---|
| `.modal__close` | `left: space-5` | In RTL, left = visual end — correct for close button |
| `.toast-container` | `left: space-6` | Toasts appear bottom-left in RTL (away from primary content) |
| `.active-indicator` | `border-right: 3px solid --accent` | Right = start side in RTL — bar appears before content |
| `.select` chevron | `background-position: left center` | Arrow on left (appears after text in RTL) |
| `.switch__thumb` | `right: 2px` (off state) | Thumb starts on the right (start side) in RTL |
| `.switch__thumb` checked | `translateX(-20px)` | Slides left (toward end) when enabled |
| `.fullscreen-exit` | `left: space-6` | Appears top-left in RTL |

### Flex in RTL

`flex-direction: row` automatically mirrors in RTL — items flow right to left. This is usually correct. If you explicitly need left-to-right flow (e.g., for a code snippet or number sequence), add `dir="ltr"` to that specific element.

### What to Never Do

```tsx
// Never add letter-spacing to Arabic body text
<p className="tracking-wide">النص العربي</p>       // breaks letterforms

// Never hardcode text direction on components that have Arabic content
<div dir="ltr">النص العربي</div>                   // wrong direction

// Use logical Tailwind properties when possible
<div className="ms-auto">                           // margin-inline-start: auto (RTL-safe)
// instead of
<div className="ml-auto">                           // ml = margin-left, unpredictable in RTL
```

---

## 33. Anti-Patterns — What to Never Do

### Hardcoded colors

```tsx
// Wrong
<div style={{ background: '#272D45', color: '#ffffff' }}>
<div className="bg-[#4ECDC4]">
<div className="bg-slate-700 text-white">

// Right
<div className="bg-surface-2 text-primary">
<div className="text-accent">
```

### Skipping elevation levels

```tsx
// Wrong
<div className="card">
  <div className="card-deep">skipped card-nested</div>
</div>

// Right
<div className="card">
  <div className="card-nested">
    <div className="card-deep">correct</div>
  </div>
</div>
```

### Multiple primary buttons

```tsx
// Wrong — no hierarchy
<button className="btn btn-primary">حفظ</button>
<button className="btn btn-primary">إضافة</button>

// Right
<button className="btn btn-primary">حفظ</button>
<button className="btn btn-secondary">إضافة</button>
```

### Clock without `.clock-display` base class

```tsx
// Wrong — clock-md alone has no color/font properties
<div className="clock-md tabular-nums">{time}</div>

// Right — clock-display is the base, clock-md is the size modifier
<div className="clock-display clock-md tabular-nums clock-glow">{time}</div>
```

### Time display without `tabular-nums`

```tsx
// Wrong — digits jitter as they change widths
<div className="clock-display clock-md clock-glow">{time}</div>

// Right
<div className="clock-display clock-md clock-glow tabular-nums">{time}</div>
```

### Letter spacing on Arabic

```tsx
// Wrong — breaks connected letterforms
<p className="text-base tracking-wide">النص العربي</p>
<p style={{ letterSpacing: '2px' }}>النص العربي</p>

// Right
<p className="text-base leading-normal">النص العربي</p>
```

### Accent as a background

```tsx
// Wrong
<section className="bg-accent">
<div className="bg-[--accent]">

// Right — use accent-soft for tinted areas
<div className="accent-highlight">           // uses --accent-soft
<div className="card card--accent">          // uses border-accent + soft shadow
```

### Missing switch parts

```tsx
// Wrong — switch won't work without all 3 parts
<label className="switch">
  <input type="checkbox" />
</label>

// Right — all 3 required
<label className="switch">
  <input type="checkbox" />
  <span className="switch__track"></span>
  <span className="switch__thumb"></span>
</label>
```

---

## 34. Quick Decision Table

| I need... | Use this |
|---|---|
| Page wrapper | `<main>` — bg is automatic |
| A section/panel | `section` |
| Card on a page | `card` |
| Card inside a card | `card-nested` |
| Deepest content block | `card-deep` |
| Active/selected card | `card card--accent` |
| Frosted glass card | `card card--glass` |
| Error/danger card | `card card--danger` |
| No-shadow card | `card card--flat` |
| Card header | `card__header` |
| Card title | `card__title` |
| Card subtitle | `card__subtitle` |
| Card footer | `card__footer` |
| Main CTA (one per screen) | `btn btn-primary` |
| Secondary action | `btn btn-secondary` |
| Cancel/tertiary | `btn btn-ghost` |
| Neutral/settings | `btn btn-surface` |
| Destructive action | `btn btn-danger btn-sm` |
| Icon-only button | `btn btn-ghost btn-icon` |
| Full-width button | `btn btn-primary btn-block` |
| Pill button | `btn btn-primary btn-pill` |
| Text input | `input` |
| Time picker | `input input-time` |
| Error input | `input input--error` |
| Multi-line | `input textarea` |
| Dropdown | `select` |
| Input wrapper | `input-group` |
| Input label | `input-label` |
| Required label | `input-label input-label--required` |
| Input hint | `input-hint` |
| Error message | `input-error-msg` |
| Status pill | `badge badge-accent` / `badge-success` / `badge-danger` / `badge-warning` / `badge-info` / `badge-default` |
| Filter/tag button | `chip` / `chip chip--active` |
| Pill-style tabs | `tabs` → `tab` / `tab tab--active` |
| Underline tabs | `tabs tabs--underline` → `tab` / `tab tab--active` |
| On/off toggle | `switch` → `switch__track` + `switch__thumb` |
| Main clock | `clock-display clock-md clock-glow tabular-nums` |
| Small widget clock | `clock-display clock-xs tabular-nums` |
| Fullscreen clock | `clock-display clock-lg clock-glow tabular-nums font-black` |
| Clock segment | `clock-segment` → `clock-segment__label` |
| Clock colon | `clock-sep` |
| AM/PM | `clock-ampm` |
| Color picker | `clock-color-picker` → `clock-color-swatch` / `clock-color-swatch--active` |
| Progress bar | `progress-track` → `progress-fill` |
| Countdown bar | `progress-track` → `progress-fill progress-fill--countdown` |
| Circular progress | SVG with `.progress-ring` → `.progress-ring__track` + `.progress-ring__fill` |
| Alarm row | `alarm-item` |
| Active alarm | `alarm-item alarm-item--active` |
| Ringing alarm | `alarm-item alarm-item--ringing` |
| Alarm time | `alarm-time tabular-nums` |
| Alarm info | `alarm-info` |
| Alarm name | `alarm-label` |
| Alarm day pills | `alarm-days` → `alarm-day` / `alarm-day--active` |
| Modal backdrop | `modal-overlay` |
| Modal box | `modal` |
| Modal header | `modal__header` |
| Modal title | `modal__title` |
| Modal subtitle | `modal__subtitle` |
| Modal close | `modal__close` |
| Toast list | `toast-container` |
| Toast | `toast` / `toast-success` / `toast-danger` / `toast-warning` / `toast-info` |
| Toast title | `toast__title` |
| Toast message | `toast__msg` |
| Empty screen | `empty-state` → `empty-state__icon` + `empty-state__title` + `empty-state__description` |
| Fullscreen overlay | `fullscreen-mode` |
| Fullscreen exit | `fullscreen-exit btn btn-ghost btn-sm` |
| Status dot | `accent-dot` / `accent-dot--danger` / `accent-dot--success` |
| Active top border | `accent-line-top` |
| Soft accent bg | `accent-highlight` |
| Active sidebar item | `active-indicator` |
| Horizontal rule | `divider` / `divider divider--strong` |
| Auto grid | `grid-auto` |
| Page container | `container` / `container--narrow` / `container--wide` |
| Glass background | `bg-glass` |
| Surface 1 bg | `bg-surface-1` |
| Surface 2 bg | `bg-surface-2` |
| Surface 3 bg | `bg-surface-3` |
| Surface 4 bg | `bg-surface-4` |
| Heading text | `h1`–`h4` (auto-styled) or `text-2xl font-bold leading-tight` |
| Body text | `text-base leading-normal text-primary` |
| Label/description | `text-sm text-secondary` |
| Muted hint | `text-xs text-muted` |
| Error text | `text-sm text-danger` |
| Success text | `text-sm text-success` |

---

> **This file is the complete source of truth for the WAQT design system.**
>
> Every token value, class name, sub-element, variant, animation, behavior, and RTL consideration from `design-system.css` is documented here. When writing or updating components: use semantic tokens, respect surface elevation hierarchy, keep accent sparse (10–15% max), always add `tabular-nums` to time displays, never add `tracking-wide` to Arabic text, and never hardcode a hex color.