import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const nextConfig = require('../next.config.js');

function findRedirect(
  redirects: Array<{ source?: string; destination?: string; permanent?: boolean }>,
  source: string,
) {
  return redirects.find((redirect) => redirect.source === source) || null;
}

test('legacy guide routes permanently redirect to canonical blog routes', async () => {
  const redirects = await nextConfig.redirects();
  const expectedRedirects = [
    { source: '/guide', destination: '/blog' },
    { source: '/guide/:slug*', destination: '/blog/:slug*' },
    { source: '/guides', destination: '/blog' },
    { source: '/guides/:slug*', destination: '/blog/:slug*' },
  ];

  for (const expected of expectedRedirects) {
    const redirect = findRedirect(redirects, expected.source);

    assert.ok(redirect, `${expected.source} redirect should exist`);
    assert.equal(redirect.destination, expected.destination);
    assert.equal(redirect.permanent, true);
  }
});
