import test from 'node:test';
import assert from 'node:assert/strict';

process.env.NEXT_PUBLIC_SITE_URL = 'https://www.miqatona.com';

import { GET as getAdsTxt } from '@/app/ads.txt/route';
import robots from '@/app/robots';
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

test('ads.txt publishes the Google seller line when AdSense client id is configured', async () => {
  const previousValue = process.env.ADSENSE_CLIENT_ID;
  process.env.ADSENSE_CLIENT_ID = 'ca-pub-1234567890123456';

  try {
    const response = getAdsTxt();
    const body = await response.text();

    assert.equal(response.status, 200);
    assert.match(body, /^google\.com, pub-1234567890123456, DIRECT, f08c47fec0942fa0\n$/);
  } finally {
    if (typeof previousValue === 'string') {
      process.env.ADSENSE_CLIENT_ID = previousValue;
    } else {
      delete process.env.ADSENSE_CLIENT_ID;
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
