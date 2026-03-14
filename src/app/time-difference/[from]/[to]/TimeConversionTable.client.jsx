/* app/time-difference/[from]/[to]/TimeConversionTable.client.jsx */
'use client';

import { useState } from 'react';

/**
 * TimeConversionTable — Client component (tab switching only).
 *
 * Uses the design system's .tabs / .tab / .tab--active classes directly
 * (new.css §19) so no shadcn Tabs overrides are needed at all.
 *
 * All row data is pre-computed server-side and passed as plain serialisable
 * props — this component owns zero data logic, keeping page.jsx a pure RSC.
 *
 * @prop groups   {Array<{ label, icon, rows: Array<{ fromTime, toTime, note }> }>}
 * @prop fromCity {string} — Arabic city name, column header
 * @prop toCity   {string} — Arabic city name, column header
 */
export default function TimeConversionTable({ groups, fromCity, toCity }) {
  const [active, setActive] = useState(0);
  const group = groups[active];

  return (
    <div>
      {/* ── Tab switcher ─────────────────────────────────────────────
       *
       *  .tabs       — pill container (bg-surface-2, border-subtle, radius-xl)
       *  .tab        — inactive pill (text-secondary, transparent bg)
       *  .tab--active — active pill (bg-surface-4, text accent-alt, border-accent)
       *
       *  All from new.css §19 — zero overrides needed.
       */}
      <div className="tabs mb-4" role="tablist" aria-label="اختر فترة اليوم">
        {groups.map((g, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={active === i}
            aria-controls={`conv-panel-${i}`}
            id={`conv-tab-${i}`}
            className={`tab${active === i ? ' tab--active' : ''}`}
            onClick={() => setActive(i)}
            type="button"
          >
            {/* Icon — aria-hidden, purely decorative */}
            <span aria-hidden="true" className="leading-none">{g.icon}</span>
            {/* Label text — text-sm font-medium from design system */}
            <span className="text-sm font-medium">{g.label}</span>
          </button>
        ))}
      </div>

      {/* ── Table panel ──────────────────────────────────────────────
       *
       *  .table-wrapper  — overflow-x scroll, border, radius-xl, shadow-xs
       *  .table          — bg-surface-1, border-collapse, text-sm, text-primary
       *  .table--compact — tighter padding (space-2 / space-4)
       *
       *  <th> inherits text-align: right from .table th.
       *  City columns need center alignment → inline style wins over class rule.
       *
       *  .td-accent  — accent-alt colour + font-semibold  (new.css §32)
       *  .td-warning — warning colour                     (new.css §32)
       *  .tabular-nums — tabular-nums utility              (new.css §08)
       *  .font-bold    — font-weight extrabold token       (new.css §08)
       */}
      <div
        className="table-wrapper"
        role="tabpanel"
        id={`conv-panel-${active}`}
        aria-labelledby={`conv-tab-${active}`}
      >
        <table className="table table--compact">
          <thead>
            <tr>
              {/* "From" city — centre-aligned */}
              <th style={{ textAlign: 'center', width: '44%' }}>
                {fromCity}
              </th>

              {/* Arrow spacer — no heading text, narrow */}
              <th
                aria-hidden="true"
                style={{ textAlign: 'center', width: '12%' }}
              />

              {/* "To" city — centre-aligned */}
              <th style={{ textAlign: 'center', width: '44%' }}>
                {toCity}
              </th>
            </tr>
          </thead>

          <tbody>
            {group.rows.map((row, j) => (
              <tr key={j}>

                {/* Source time — bold, tabular, primary colour */}
                <td
                  className="tabular-nums font-bold"
                  style={{ textAlign: 'center' }}
                  dir="ltr"
                >
                  {row.fromTime}
                </td>

                {/* Arrow — decorative separator, muted, tiny */}
                <td
                  className="text-muted text-xs"
                  style={{ textAlign: 'center' }}
                  aria-hidden="true"
                >
                  ←
                </td>

                {/* Destination time — accent colour or warning if midnight-crossing */}
                <td
                  className={`tabular-nums font-bold${row.note ? ' td-warning' : ' td-accent'}`}
                  style={{ textAlign: 'center' }}
                  dir="ltr"
                >
                  {row.toTime}
                  {row.note && (
                    <span className="td-day-note">{row.note}</span>
                  )}
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}