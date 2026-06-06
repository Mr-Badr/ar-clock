import test from 'node:test';
import assert from 'node:assert/strict';

import { getRuntimeEnvHealthSnapshot } from '@/lib/env.server';

const HEALTH_ENV_KEYS = [
  'NODE_ENV',
  'DATABASE_URL',
  'REVALIDATE_SECRET',
  'ENABLE_LIVE_GEO_DB',
] as const;

function withEnv(
  overrides: Partial<Record<(typeof HEALTH_ENV_KEYS)[number], string | undefined>>,
  callback: () => void,
) {
  const previousValues = Object.fromEntries(
    HEALTH_ENV_KEYS.map((key) => [key, process.env[key]]),
  ) as Record<(typeof HEALTH_ENV_KEYS)[number], string | undefined>;

  for (const key of HEALTH_ENV_KEYS) {
    const nextValue = overrides[key];

    if (typeof nextValue === 'string') {
      process.env[key] = nextValue;
      continue;
    }

    delete process.env[key];
  }

  try {
    callback();
  } finally {
    for (const key of HEALTH_ENV_KEYS) {
      const previousValue = previousValues[key];

      if (typeof previousValue === 'string') {
        process.env[key] = previousValue;
        continue;
      }

      delete process.env[key];
    }
  }
}

test('getRuntimeEnvHealthSnapshot reports a structured failure for invalid production env', () => {
  withEnv(
    {
      NODE_ENV: 'production',
      REVALIDATE_SECRET: 'secret',
      DATABASE_URL: undefined,
      ENABLE_LIVE_GEO_DB: undefined,
    },
    () => {
      const snapshot = getRuntimeEnvHealthSnapshot();

      assert.equal(snapshot.status, 'fail');
      assert.equal(
        snapshot.issues.some((issue) => issue.path === 'DATABASE_URL'),
        true,
      );
    },
  );
});

test('getRuntimeEnvHealthSnapshot returns ok when production env requirements are met', () => {
  withEnv(
    {
      NODE_ENV: 'production',
      REVALIDATE_SECRET: 'secret',
      DATABASE_URL: 'postgresql://user:pass@localhost:5432/miqatona',
      ENABLE_LIVE_GEO_DB: undefined,
    },
    () => {
      const snapshot = getRuntimeEnvHealthSnapshot();

      assert.equal(snapshot.status, 'ok');
      assert.deepEqual(snapshot.issues, []);
      assert.equal(snapshot.env.NODE_ENV, 'production');
    },
  );
});
