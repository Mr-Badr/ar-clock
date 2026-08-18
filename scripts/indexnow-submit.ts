// scripts/indexnow-submit.ts
//
// Self-service IndexNow submission — notifies participating search engines (Bing, Yandex,
// Seznam.cz, Naver; NOT Google, which has no equivalent public API) that a URL was
// published/updated, so they can crawl it faster than waiting for organic discovery. Free, no
// account/OAuth needed — the only "credential" is the key file hosted at the site root, which
// IndexNow verifies by fetching it over HTTPS before accepting submissions.
//
// Key file: public/fb0e550fde7b8ee1371c0c34a7d676ce.txt (must stay in sync with INDEXNOW_KEY below —
// if you ever rotate the key, regenerate both together).
//
// Usage:
//   node --import tsx scripts/indexnow-submit.ts https://miqatona.com/holidays/sudan-independence-day https://miqatona.com/holidays/mauritania-independence-day
//   node --import tsx scripts/indexnow-submit.ts --file urls.txt   (one URL per line)
//
// Never call this in a loop per-URL for bulk batches — IndexNow's own API accepts up to 10,000
// URLs in a single POST; batch them into one call instead of one request per URL.

import { readFileSync } from 'node:fs';

const INDEXNOW_KEY = 'fb0e550fde7b8ee1371c0c34a7d676ce';
const HOST = 'miqatona.com';
const KEY_LOCATION = `https://${HOST}/${INDEXNOW_KEY}.txt`;
const ENDPOINT = 'https://api.indexnow.org/indexnow';

function parseArgs(): string[] {
  const args = process.argv.slice(2);
  const fileFlagIndex = args.indexOf('--file');
  if (fileFlagIndex !== -1) {
    const filePath = args[fileFlagIndex + 1];
    if (!filePath) {
      console.error('[indexnow] --file requires a path argument');
      process.exit(1);
    }
    return readFileSync(filePath, 'utf8')
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
  }
  return args.filter((a) => a.startsWith('http'));
}

async function main() {
  const urlList = parseArgs();
  if (urlList.length === 0) {
    console.error('[indexnow] No URLs provided. Pass URLs as args or --file <path>.');
    process.exit(1);
  }

  const invalidHost = urlList.find((u) => {
    try {
      return new URL(u).host !== HOST;
    } catch {
      return true;
    }
  });
  if (invalidHost) {
    console.error(`[indexnow] Refusing to submit — URL does not belong to ${HOST}: ${invalidHost}`);
    process.exit(1);
  }

  const body = {
    host: HOST,
    key: INDEXNOW_KEY,
    keyLocation: KEY_LOCATION,
    urlList,
  };

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body),
  });

  console.log(`[indexnow] Submitted ${urlList.length} URL(s) — status ${res.status}`);
  if (res.status !== 200 && res.status !== 202) {
    const text = await res.text().catch(() => '');
    console.error('[indexnow] Non-success response:', text.slice(0, 500));
    process.exit(1);
  }
}

main();
