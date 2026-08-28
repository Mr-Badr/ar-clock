'use client';

// tools-v2/PremiumSelect.client.jsx
// Owner, 2026-08-28: "the dropbox and select box still not have perfect ui ux, because i see a
// list of items with inside a rectangle, not special, check the web for special modern design."
// Real, well-documented reason a plain `<select>` can never fully fix this: the CLOSED box can be
// custom-styled with CSS (already done, see tools-v2.css/calculators.css), but the OPEN popup
// list is rendered by the OS/browser itself — no CSS can round its corners, add hover states, or
// theme it. That's a hard browser limitation, not something to keep chasing with more `<select>`
// CSS. The only real fix is a custom-rendered dropdown, and this codebase already HAS one, fully
// built and premium-styled (src/components/ui/select.tsx — Radix Select, rounded popup, elevated
// surface, checkmark indicator, animated open/close) — it just wasn't wired into any calculator
// yet, all of which used a bare native `<select>` instead.
//
// This wrapper exists so swapping a calculator's `<select>` for the real component is a
// near-mechanical one-line change instead of hand-writing the full Select/SelectTrigger/
// SelectContent/SelectItem tree at every call site: same `value`/`onChange`-shaped API a native
// select already has (adapted to Radix's own `value`/`onValueChange`), same `id` (so the existing
// `<label htmlFor>` in every calculator still focuses it — Radix's trigger is a real `<button>`,
// which a label's `for` correctly focuses on click).
//
// The trigger carries `tool-v2-select-trigger-box` by default (styled in tools-v2.css), a
// self-contained class — not a `.tool-v2-field > [data-slot=...]` parent-selector rule — on
// purpose: calculators nest a `<select>` inside several different wrapper divs (`.tool-v2-field`
// for a normal labeled field, `.tool-v2-addon-inputs` for a repeatable row, etc.), and a
// parent-scoped selector would silently miss every wrapper it wasn't written for. A class on the
// component itself works identically everywhere it's used, regardless of what wraps it.
//
// `variant="inline"` skips that box entirely for the rare case where a bare `<select>` was a
// small auto-width chip inside its own bespoke control bar (e.g. the timezone converter's
// reference-city picker) rather than a full-width labeled form field — forcing the standard
// 44px/full-width field box onto a compact inline control would break that layout, not fix it.
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

/**
 * @param {{
 *   id?: string,
 *   value?: string | number,
 *   onChange?: (value: string) => void,
 *   options: Array<{ value: string | number, label: string }>,
 *   placeholder?: string,
 *   disabled?: boolean,
 *   className?: string,
 *   variant?: 'field' | 'inline',
 *   ariaLabel?: string,
 * }} props
 */
export default function PremiumSelect({
  id,
  value,
  onChange,
  options,
  placeholder,
  disabled = false,
  className,
  variant = 'field',
  ariaLabel,
}) {
  // A native <select> commonly used an empty-string `<option value="">` as its "nothing chosen
  // yet" placeholder row. Radix Select reserves an empty string internally (a real SelectItem
  // can't use it), so that state is expressed as `value=undefined` + the `placeholder` prop
  // instead — treat '' the same as null/undefined here so call sites don't need to know the
  // difference.
  const hasValue = value != null && value !== '';
  return (
    <Select
      value={hasValue ? String(value) : undefined}
      onValueChange={(next) => onChange?.(next)}
      disabled={disabled}
      // Real bug found alongside the checkmark-icon report: Radix doesn't just inherit RTL from
      // the page's own CSS `direction` — it needs this prop explicitly for its OWN internal
      // logic (which side inset-inline-end resolves to, arrow-key navigation order). Without it,
      // Radix defaulted to ltr regardless of the page being RTL. Removing the checkmark (below)
      // was the direct fix for what was visible; this is the actual root correctness fix so
      // nothing else Radix does internally (keyboard nav, any future inline-positioned element)
      // silently assumes the wrong direction too.
      dir="rtl"
    >
      <SelectTrigger
        id={id}
        aria-label={ariaLabel}
        className={cn(variant === 'field' && 'tool-v2-select-trigger-box', className)}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      {/* Owner, 2026-08-28 (real report): "the dropbox has arrow down in right and when i click
          i see arrow up on left, and all the other content move when i select" — the default
          Radix Select positioning mode is `item-aligned`, which tries to align the CURRENTLY
          SELECTED item exactly over the trigger (useful for mimicking a native OS select, but
          it moves/resizes the whole popup based on which item happens to be selected, and can
          visually overlap the trigger's own chevron with the popup's own scroll-up chevron —
          exactly "arrow up on left" appearing on open). `position="popper"` is Radix's other,
          more standard mode: the popup just anchors directly below the trigger, at a width that
          matches the trigger exactly (`--radix-select-trigger-width`, wired up in
          ui/select.tsx's own `popper` branch) — predictable every time, not selection-dependent,
          which is also what actually fixes "content moves" (nothing about the trigger's own box
          changes size or position when an item is picked; only the popup's open/closed state
          does). */}
      <SelectContent position="popper" sideOffset={6}>
        {options.map((opt) => (
          <SelectItem key={opt.value} value={String(opt.value)}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
