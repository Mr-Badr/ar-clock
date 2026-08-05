import './guide-v2.css';

// No guide-v2 article page exists in this hub (single-calculator hub per owner's explicit
// "one tool only" scope decision) — this import exists purely so the calculator's shared
// `.guide-v2-checker-chip`/`.guide-v2-checker-options` classes (chip-style multi-choice rows,
// reused across every hub's calculators) are actually styled here too.
export default function PoolsLayout({ children }) {
  return children;
}
