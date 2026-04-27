import 'server-only';

import { cacheLife, cacheTag } from 'next/cache';

import {
  buildBestTradingTimePageModel,
  buildEconomyLandingLiveModel,
  buildForexPageModel,
  buildGoldMarketHoursPageModel,
  buildMarketClockPageModel,
  buildStockMarketsPageModel,
  buildUsMarketOpenPageModel,
} from '@/lib/economy/engine';
import { getEconomyPreviewSnapshot } from '@/lib/economy/live-data.server';
import { getInitialEconomyPageState } from '@/lib/economy/page-helpers';

const MODEL_BUILDERS = {
  landing: buildEconomyLandingLiveModel,
  'forex-sessions': buildForexPageModel,
  'us-market-open': buildUsMarketOpenPageModel,
  'stock-markets': buildStockMarketsPageModel,
  'gold-market-hours': buildGoldMarketHoursPageModel,
  'market-clock': buildMarketClockPageModel,
  'best-trading-time': buildBestTradingTimePageModel,
};

export async function getCachedEconomyPageSnapshot(scope = 'landing') {
  'use cache';
  cacheTag('economy-pages', `economy-page-${scope}`);
  cacheLife('minutes');

  const { initialViewer, initialNowIso } = await getInitialEconomyPageState();
  const buildModel = MODEL_BUILDERS[scope] || null;

  return {
    initialViewer,
    initialNowIso,
    liveSnapshot: await getEconomyPreviewSnapshot(scope),
    serverModel: buildModel ? buildModel(initialViewer, initialNowIso) : null,
  };
}
