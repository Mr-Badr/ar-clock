// Reusable "reference data grid" — compact scannable chips for a fixed list of standard values
// (sizes, presets, ranges). See .claude/rules/calculator-ui-standards.md §0e: a comma-separated
// list of values used to get dumped as a run-on sentence inside an FAQ answer; it belongs here
// instead, as real visual content, with the FAQ reduced to a short pointer.
// Server Component — pure markup, no client JS needed.

export function ReferenceGrid({ items }) {
  return (
    <div className="tool-v2-ref-grid">
      {items.map((item) => (
        <div className="tool-v2-ref-chip" key={item.value}>
          <span className="tool-v2-ref-chip__value">{item.value}</span>
          {item.meta ? <span className="tool-v2-ref-chip__meta">{item.meta}</span> : null}
        </div>
      ))}
    </div>
  );
}
