import AdTopBanner from '@/components/ads/AdTopBanner';
import DevAdPlaceholder from '@/components/ads/DevAdPlaceholder';
import { getServerAdsConfig } from '@/lib/runtime-config';

// Fixed rule for every /tools page (2026-07-30): the top-of-page ad slot always gets a
// reserved gutter right below the navbar, before any breadcrumb/H1/content — never let a
// tool page render with zero space between the navbar and the page title. AdTopBanner itself
// renders nothing when ads aren't configured for the current environment (by design — see
// its own JSDoc); in that case this shows a placeholder so the intended spacing is visible
// while building. Gated on the same `enabled` flag AdLayoutWrapper uses (clientId + certified
// CMP), not just NODE_ENV, so it can never show up alongside a real ad in a non-production
// environment that happens to have real AdSense credentials configured. Never touches
// AdTopBanner's own logic.
export default function ToolTopAdSlot({ slotId = 'top-calculator-tool' }) {
  const { enabled } = getServerAdsConfig();
  return (
    <div className="tool-v2-ad-gutter tool-v2-ad-gutter--top">
      <AdTopBanner slotId={slotId} size="large" />
      {!enabled ? <DevAdPlaceholder large /> : null}
    </div>
  );
}
