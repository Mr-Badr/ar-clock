import test from 'node:test';
import assert from 'node:assert/strict';

import prayerCityImage from '@/app/mwaqit-al-salat/[country]/[city]/opengraph-image.jsx';
import timeNowCountryImage from '@/app/time-now/[country]/opengraph-image.jsx';
import timeNowCityImage from '@/app/time-now/[country]/[city]/opengraph-image.jsx';

type OgRouteParams = Record<string, string>;
type OgRouteModule = (input: { params: Promise<OgRouteParams> }) => Promise<Response>;

async function renderImageBytes(routeModule: OgRouteModule, params: OgRouteParams): Promise<{ contentType: string | null; byteLength: number }> {
  const response = await routeModule({
    params: Promise.resolve(params),
  });

  const contentType = response.headers.get('content-type');
  const imageBytes = await response.arrayBuffer();

  return {
    contentType,
    byteLength: imageBytes.byteLength,
  };
}

test('time-now city OG image renders a PNG body for long-tail cities', async () => {
  const routes = [
    { country: 'kyrgyzstan', city: 'bishkek' },
    { country: 'china', city: 'ordos' },
    { country: 'marshall-islands', city: 'majuro' },
    { country: 'cameroon', city: 'yaounde' },
    { country: 'egypt', city: 'suez' },
    { country: 'japan', city: 'higashiosaka' },
    { country: 'rwanda', city: 'kigali' },
  ];

  for (const route of routes) {
    const result = await renderImageBytes(timeNowCityImage, route);

    assert.equal(result.contentType, 'image/png');
    assert.ok(result.byteLength > 0);
  }
});

test('time-now country OG image renders a PNG body for country routes', async () => {
  const routes = [
    { country: 'azerbaijan' },
    { country: 'laos' },
  ];

  for (const route of routes) {
    const result = await renderImageBytes(timeNowCountryImage, route);

    assert.equal(result.contentType, 'image/png');
    assert.ok(result.byteLength > 0);
  }
});

test('prayer city OG image renders a PNG body without closing the response early', async () => {
  const routes = [
    { country: 'turkey', city: 'bagcilar' },
    { country: 'burundi', city: 'gitega' },
    { country: 'china', city: 'suqian' },
    { country: 'guinea', city: 'camayenne' },
    { country: 'mozambique', city: 'matola' },
    { country: 'saudi-arabia', city: 'taif' },
    { country: 'china', city: 'guilin' },
  ];

  for (const route of routes) {
    const result = await renderImageBytes(prayerCityImage, route);

    assert.equal(result.contentType, 'image/png');
    assert.ok(result.byteLength > 0);
  }
});
