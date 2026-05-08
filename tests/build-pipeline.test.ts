import test from 'node:test';
import assert from 'node:assert/strict';

import packageJson from '../package.json';

test('build scripts regenerate holiday indexes before Next.js compilation', () => {
  const buildScript = packageJson?.scripts?.build || '';
  const smokeBuildScript = packageJson?.scripts?.['build:smoke'] || '';

  assert.match(buildScript, /\bevents:build\b/);
  assert.match(smokeBuildScript, /\bevents:build\b/);
});
