import test from 'node:test';
import assert from 'node:assert/strict';

process.env.NEXT_PUBLIC_SITE_URL = 'https://www.miqatona.com';

import { GET as getAdsTxt } from '@/app/ads.txt/route';
import robots from '@/app/robots';
import { getAdRoutePolicy } from '@/lib/ads/route-policy';
import { getPublicRuntimeConfig, getServerAdsConfig } from '@/lib/runtime-config';
import { getSiteUrl, SITE_PRIMARY_DOMAIN } from '@/lib/site-config';

type RobotsRule = {
  userAgent?: string;
  allow?: string;
  disallow?: string | string[];
};

function findRobotsRule(rules: RobotsRule[], userAgent: string): RobotsRule | null {
  return rules.find((rule) => rule.userAgent === userAgent) || null;
}

test('site URL canonicalizes www host to the production root domain', () => {
  assert.equal(getSiteUrl(), SITE_PRIMARY_DOMAIN);
  assert.equal(getSiteUrl(), 'https://miqatona.com');
});

test('ads.txt always publishes the verified Google seller account', async () => {
  const response = getAdsTxt();
  const body = await response.text();

  assert.equal(response.status, 200);
  assert.match(body, /^google\.com, pub-5421885011942418, DIRECT, f08c47fec0942fa0\n$/);
});

test('AdSense delivery stays disabled until a certified CMP is confirmed', () => {
  const previousClientId = process.env.ADSENSE_CLIENT_ID;
  const previousCmpFlag = process.env.GOOGLE_CERTIFIED_CMP_ENABLED;
  process.env.ADSENSE_CLIENT_ID = 'ca-pub-5421885011942418';
  delete process.env.GOOGLE_CERTIFIED_CMP_ENABLED;

  try {
    const serverConfig = getServerAdsConfig();
    const publicConfig = getPublicRuntimeConfig();

    assert.equal(serverConfig.clientId, 'ca-pub-5421885011942418');
    assert.equal(serverConfig.enabled, false);
    assert.equal(serverConfig.certifiedCmpEnabled, false);
    assert.equal(publicConfig.ads.clientId, null);
    assert.equal(publicConfig.ads.enabled, false);
  } finally {
    if (typeof previousClientId === 'string') {
      process.env.ADSENSE_CLIENT_ID = previousClientId;
    } else {
      delete process.env.ADSENSE_CLIENT_ID;
    }

    if (typeof previousCmpFlag === 'string') {
      process.env.GOOGLE_CERTIFIED_CMP_ENABLED = previousCmpFlag;
    } else {
      delete process.env.GOOGLE_CERTIFIED_CMP_ENABLED;
    }
  }
});

test('AdSense delivery becomes available after certified CMP confirmation', () => {
  const previousClientId = process.env.ADSENSE_CLIENT_ID;
  const previousCmpFlag = process.env.GOOGLE_CERTIFIED_CMP_ENABLED;
  process.env.ADSENSE_CLIENT_ID = 'ca-pub-5421885011942418';
  process.env.GOOGLE_CERTIFIED_CMP_ENABLED = 'true';

  try {
    const serverConfig = getServerAdsConfig();
    const publicConfig = getPublicRuntimeConfig();

    assert.equal(serverConfig.enabled, true);
    assert.equal(serverConfig.certifiedCmpEnabled, true);
    assert.equal(serverConfig.autoAdsEnabled, false);
    assert.equal(serverConfig.manualSlots.topBanner, '8090183510');
    assert.equal(serverConfig.manualSlots.inArticle, '1176301123');
    assert.equal(serverConfig.manualSlots.inFeed, '1947291465');
    assert.equal(serverConfig.manualSlots.eventsFeedHorizontal, '4296454334');
    assert.equal(serverConfig.manualSlots.multiplex, '3132380621');
    assert.equal(serverConfig.manualSlots.sidebarRight, '4134471107');
    assert.equal(serverConfig.manualSlots.sidebarLeft, '5183828891');
    assert.equal(publicConfig.ads.clientId, 'ca-pub-5421885011942418');
    assert.equal(publicConfig.ads.enabled, true);
  } finally {
    if (typeof previousClientId === 'string') {
      process.env.ADSENSE_CLIENT_ID = previousClientId;
    } else {
      delete process.env.ADSENSE_CLIENT_ID;
    }

    if (typeof previousCmpFlag === 'string') {
      process.env.GOOGLE_CERTIFIED_CMP_ENABLED = previousCmpFlag;
    } else {
      delete process.env.GOOGLE_CERTIFIED_CMP_ENABLED;
    }
  }
});

test('AdSense delivery rejects a runtime client id that does not match the verified account', () => {
  const previousClientId = process.env.ADSENSE_CLIENT_ID;
  const previousCmpFlag = process.env.GOOGLE_CERTIFIED_CMP_ENABLED;
  process.env.ADSENSE_CLIENT_ID = 'ca-pub-1234567890123456';
  process.env.GOOGLE_CERTIFIED_CMP_ENABLED = 'true';

  try {
    const serverConfig = getServerAdsConfig();

    assert.equal(serverConfig.clientId, null);
    assert.equal(serverConfig.clientIdMatchesAccount, false);
    assert.equal(serverConfig.enabled, false);
  } finally {
    if (typeof previousClientId === 'string') {
      process.env.ADSENSE_CLIENT_ID = previousClientId;
    } else {
      delete process.env.ADSENSE_CLIENT_ID;
    }

    if (typeof previousCmpFlag === 'string') {
      process.env.GOOGLE_CERTIFIED_CMP_ENABLED = previousCmpFlag;
    } else {
      delete process.env.GOOGLE_CERTIFIED_CMP_ENABLED;
    }
  }
});

test('analytics requires an explicit enable flag and a configured tracking id', () => {
  const previousAnalyticsFlag = process.env.ENABLE_ANALYTICS;
  const previousMeasurementId = process.env.GA_MEASUREMENT_ID;
  delete process.env.ENABLE_ANALYTICS;
  process.env.GA_MEASUREMENT_ID = 'G-TEST123456';

  try {
    assert.equal(getPublicRuntimeConfig().analytics.enabled, false);

    process.env.ENABLE_ANALYTICS = 'true';
    assert.equal(getPublicRuntimeConfig().analytics.enabled, true);
    assert.equal(getPublicRuntimeConfig().analytics.gaMeasurementId, 'G-TEST123456');
  } finally {
    if (typeof previousAnalyticsFlag === 'string') {
      process.env.ENABLE_ANALYTICS = previousAnalyticsFlag;
    } else {
      delete process.env.ENABLE_ANALYTICS;
    }

    if (typeof previousMeasurementId === 'string') {
      process.env.GA_MEASUREMENT_ID = previousMeasurementId;
    } else {
      delete process.env.GA_MEASUREMENT_ID;
    }
  }
});

test('robots explicitly allow Google Ads crawlers to reach public landing pages', () => {
  const data = robots();
  const rules = data.rules as RobotsRule[];
  const adsBotRules = ['AdsBot-Google', 'AdsBot-Google-Mobile'];

  for (const userAgent of adsBotRules) {
    const rule = findRobotsRule(rules, userAgent);

    assert.ok(rule, `${userAgent} rule should exist`);
    assert.equal(rule.allow, '/');
    assert.deepEqual(rule.disallow, ['/api/', '/search?*', '/offline']);
  }
});

test('AdSense delivery is disabled on trust, navigation, and non-content routes', () => {
  const blockedPaths = [
    '/about',
    '/contact',
    '/disclaimer',
    '/editorial-policy',
    '/fahras',
    '/offline',
    '/privacy',
    '/search',
    '/terms',
    '/api/health',
  ];

  for (const pathname of blockedPaths) {
    assert.equal(
      getAdRoutePolicy(pathname).allowAdDelivery,
      false,
      `${pathname} should not load AdSense`,
    );
  }

  assert.equal(getAdRoutePolicy('/').allowAdDelivery, true);
  assert.equal(getAdRoutePolicy('/holidays/ramadan').allowAdDelivery, true);
  assert.equal(getAdRoutePolicy('/time-now/saudi-arabia/riyadh').allowAdDelivery, true);
});
