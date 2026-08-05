import { Markazi_Text } from 'next/font/google';
import './guide-v2.css';

// Added 2026-08-04 alongside the domestic-worker eligibility checker + contract generator —
// this hub's existing tools all use plain `tool-v2-option-list` rows, but a 6-country selector
// reads much better as a compact horizontal chip row (the `.guide-v2-checker-chip` pattern
// already proven across the cleaning/pest-control/landscaping hubs) than a tall vertical list.
// Purely additive: no existing gulf-finance page references these classes, so this can't affect
// them.
const markaziText = Markazi_Text({
  subsets: ['arabic'],
  weight: ['600', '700'],
  variable: '--font-guide-display',
  display: 'swap',
});

export default function GulfFinanceLayout({ children }) {
  return <div className={markaziText.variable}>{children}</div>;
}
