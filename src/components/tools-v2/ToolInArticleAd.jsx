import AdInArticle from '@/components/ads/AdInArticle';
import DevAdPlaceholder from '@/components/ads/DevAdPlaceholder';
import { getServerAdsConfig } from '@/lib/runtime-config';

// Fixed rule for every /tools page (2026-07-30): one in-article ad in the middle of column 1's
// content, PLUS a separate mobile-only instance right after the tool panel (mobile order:
// tool, then this ad, then content — see .tool-v2-lane-mobile-ad in tools-v2.css). Same
// dev-preview-placeholder pattern as ToolTopAdSlot: shows a placeholder only when ads truly
// aren't configured (`getServerAdsConfig().enabled` false), never alongside a real ad.
export default function ToolInArticleAd({ slotId, className = '' }) {
  const { enabled } = getServerAdsConfig();
  return (
    <div className={`tool-v2-ad-gutter tool-v2-ad-gutter--mid ${className}`}>
      <AdInArticle slotId={slotId} />
      {!enabled ? <DevAdPlaceholder minHeight={180} /> : null}
    </div>
  );
}
