import { Markazi_Text } from 'next/font/google';
import './guide-v2.css';

// New category (2026-08-25) — split out of /tools/gulf-finance, which had grown to 43 tools across
// 13 non-Gulf countries under a "Gulf finance" URL (owner: "this is no more gulf finance"). See
// fuel-prices-registry.js's header + docs/holiday-event-opportunity-backlog.md for the full history.
// Same Markazi-display-font + guide-v2.css pattern as every other guide-v2 category layout — this
// file is a near-literal copy of gulf-finance/layout.jsx, kept separate per this codebase's
// established "20 literal per-category guide-v2.css copies, not shared" convention.
const markaziText = Markazi_Text({
  subsets: ['arabic'],
  weight: ['600', '700'],
  variable: '--font-guide-display',
  display: 'swap',
});

export default function FuelPricesLayout({ children }) {
  return <div className={markaziText.variable}>{children}</div>;
}
