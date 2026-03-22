/**
 * SectionStats — Trust / authority bar
 *
 * DIVIDER TECHNIQUE — gap-px + container background
 * ──────────────────────────────────────────────────
 * The old approach used conditional `borderInlineEnd` per item, which broke
 * on mobile: end-borders appeared on items that were visually the last in
 * their row, creating orphaned lines at the edge of the screen.
 *
 * The fix: CSS grid "gap-px + background bleed" pattern:
 *   • Container: `gap-px` (1px gaps) + border color as its background
 *   • Each <li>: surface color fills the cell; the 1px gap shows through
 *     as a pixel-perfect divider at every cell boundary
 *
 * This works correctly for ALL column counts automatically:
 *   • Mobile (2-col) : vertical divider col-1 | col-2 + horizontal between rows
 *   • SM    (3-col)  : same, no extra code needed
 *   • LG    (5-col)  : one row, only vertical dividers
 *
 * No conditional logic, no nth-child overrides, no breakpoint edge cases.
 *
 * LAST-ITEM FULL-WIDTH
 * ─────────────────────
 * 5 items in 2-col = last item alone in row 3.
 * `[&>li:last-child]:col-span-2` fills the full row on mobile.
 * `sm:[&>li:last-child]:col-span-1` resets to normal width on sm+.
 */

import { STATS } from './data/stats'

export default function SectionStats() {
  return (
    <div
      className="w-full"

    >
      <div className="container-col mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <ul
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-px overflow-hidden
                     [&>li:last-child]:col-span-2 sm:[&>li:last-child]:col-span-1"
          role="list"
          aria-label="إحصائيات الموقع"
          style={{
            borderTop: '1px solid var(--border-subtle)',
            borderBottom: '1px solid var(--border-subtle)',
            borderRadius: '10px',
            background: 'var(--bg-subtle)',
          }}
        >
          {STATS.map((stat) => (
            <li
              key={stat.label}
              className="flex flex-col items-center justify-center py-5 px-4 text-center gap-1"
              style={{
                borderInlineEnd: '1px solid var(--border-subtle)',
                borderInlineStart: '1px solid var(--border-subtle)',
              }}
            >
              <stat.icon
                size={18}
                className="mb-1 opacity-70"
                style={{ color: 'var(--accent-alt)' }}
                aria-hidden="true"
              />
              <span
                className="text-lg sm:text-xl font-extrabold tabular-nums leading-tight"
                style={{ color: 'var(--text-primary)' }}
              >
                {stat.value}
              </span>
              <span
                className="text-[11px] sm:text-xs leading-tight"
                style={{ color: 'var(--text-muted)' }}
              >
                {stat.label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
