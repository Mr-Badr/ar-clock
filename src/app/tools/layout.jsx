import './tools-v2.css';
import CalculatorAdLayout from '@/components/ads/CalculatorAdLayout';

// Found 2026-08-11 (live production audit): the AdSense client ID / CMP-certified flag are read
// from process.env, and most /tools/* pages have no server-side data fetch of their own (pure
// client-interactive calculators), so Next.js fully statically optimizes them — freezing in
// whatever env vars were present at the one-time build forever. Confirmed live:
// miqatona.com/tools/construction/build-cost served `"clientId":null,"enabled":false` in
// production. The real fix lives at the actual source of that value, not here: see
// `getCachedPublicRuntimeConfig()` in `src/lib/runtime-config-cached.js` (used by the root
// layout) — a segment-level `export const revalidate` here is NOT compatible with this project's
// Cache Components config (`nextConfig.cacheComponents`) and errors the build, so don't re-add one.
export default function ToolsLayout({ children }) {
  return <CalculatorAdLayout sidebarMode="dual">{children}</CalculatorAdLayout>;
}
