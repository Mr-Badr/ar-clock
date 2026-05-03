import 'server-only';

import { cacheLife, cacheTag } from 'next/cache';
import { connection } from 'next/server';

import {
  buildBestTradingTimePageModel,
  buildEconomyLandingLiveModel,
  buildForexPageModel,
  buildGoldMarketHoursPageModel,
  buildMarketClockPageModel,
  buildStockMarketsPageModel,
  buildUsMarketOpenPageModel,
} from '@/lib/economy/engine';
import { getCachedNowIso } from '@/lib/date-utils';
import { featureFlags } from '@/lib/feature-flags';
import { ECONOMY_FALLBACK_NOW_ISO } from '@/lib/economy/page-helpers';
import { getEconomyPreviewSnapshot } from '@/lib/economy/live-data.server';
import { getInitialEconomyPageState } from '@/lib/economy/page-helpers';
import { logger, serializeError } from '@/lib/logger';

const MODEL_BUILDERS = {
  landing: buildEconomyLandingLiveModel,
  'forex-sessions': buildForexPageModel,
  'us-market-open': buildUsMarketOpenPageModel,
  'stock-markets': buildStockMarketsPageModel,
  'gold-market-hours': buildGoldMarketHoursPageModel,
  'market-clock': buildMarketClockPageModel,
  'best-trading-time': buildBestTradingTimePageModel,
};

export function buildEconomyPageServerModel(scope, initialViewer, initialNowIso) {
  const buildModel = MODEL_BUILDERS[scope] || null;
  return buildModel ? buildModel(initialViewer, initialNowIso) : null;
}

function logEconomyServerInfo(message, context = {}) {
  if (!featureFlags.observabilityLogs) return;

  logger.info(message, {
    channel: 'economy',
    surface: 'server-page',
    ...context,
  });
}

export async function getCachedEconomyPageSnapshot(scope = 'landing') {
  'use cache';
  cacheTag('economy-pages', `economy-page-${scope}`);
  cacheLife('minutes');

  const { initialViewer, initialNowIso } = await getInitialEconomyPageState();

  return {
    initialViewer,
    initialNowIso,
    liveSnapshot: await getEconomyPreviewSnapshot(scope),
  };
}

export async function getEconomyPageServerState(scope = 'landing', options = {}) {
  const { includeServerModel = true } = options;

  await connection();
  const startedAt = Date.now();

  try {
    const snapshot = await getCachedEconomyPageSnapshot(scope);
    let initialNowIso = ECONOMY_FALLBACK_NOW_ISO;

    try {
      initialNowIso = await getCachedNowIso();
    } catch {
      initialNowIso = ECONOMY_FALLBACK_NOW_ISO;
    }

    const result = includeServerModel
      ? {
          ...snapshot,
          initialNowIso,
          serverModel: buildEconomyPageServerModel(scope, snapshot.initialViewer, initialNowIso),
        }
      : {
          ...snapshot,
          initialNowIso,
        };

    logEconomyServerInfo('economy-page-server-state-ready', {
      scope,
      includeServerModel,
      durationMs: Date.now() - startedAt,
      initialNowIso,
      viewerTimezone: snapshot.initialViewer?.timezone || null,
    });

    return result;
  } catch (error) {
    logger.error('economy-page-server-state-failed', {
      channel: 'economy',
      surface: 'server-page',
      scope,
      includeServerModel,
      durationMs: Date.now() - startedAt,
      error: serializeError(error),
    });

    throw error;
  }
}
