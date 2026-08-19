// Reusable "equation card" — the yellow/cream box every tools-v2 page must use to present a real
// mathematical formula, instead of writing it as a run-on sentence buried inside an FAQ answer.
// See .claude/rules/calculator-ui-standards.md §0e for the standing rule this implements.
//
// Server Component — pure markup, no client JS needed. Direction defaults to the page's own RTL
// (Arabic terms like "السعة = معدل البت × ..." read correctly right-to-left, same as any Arabic
// math-textbook sentence — numbers/operators inside stay LTR automatically via Unicode bidi, no
// extra markup needed). Pass `dir="ltr"` only for a formula written in symbolic/Latin notation
// (single-letter scientific variables like C, N, l — rare on this site's practical calculators,
// but supported for cases like a physics/chemistry-style formula with no natural Arabic term).
export function FormulaCard({ label, children, note, dir }) {
  return (
    <div className="tool-v2-formula-card">
      {label ? <p className="tool-v2-formula-card__label">{label}</p> : null}
      <div className="tool-v2-formula-eq" dir={dir}>
        {children}
      </div>
      {note ? <p className="tool-v2-formula-card__note">{note}</p> : null}
    </div>
  );
}

// A vertical fraction: numerator, a rule line, denominator — e.g. <Frac num="C × N" den="l × w" />.
// `num`/`den` accept plain strings or short JSX (keep them short; this is not a full math renderer).
export function Frac({ num, den }) {
  return (
    <span className="tool-v2-formula-frac">
      <span className="tool-v2-formula-frac-num">{num}</span>
      <span className="tool-v2-formula-frac-den">{den}</span>
    </span>
  );
}

// A subscripted variable name, e.g. <Var base="C" sub="DNA" /> renders C with a small DNA below/after it.
export function Var({ base, sub }) {
  return (
    <span className="tool-v2-formula-var">
      {base}
      {sub ? <sub className="tool-v2-formula-sub">{sub}</sub> : null}
    </span>
  );
}
