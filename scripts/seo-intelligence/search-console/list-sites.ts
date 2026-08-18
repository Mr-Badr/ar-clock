/**
 * Minimal read-only smoke test for the Google Search Console API integration.
 *
 * What this does:
 *   1. Authorizes (interactively the first time, silently via the saved
 *      refresh token afterwards) using the read-only
 *      `webmasters.readonly` scope.
 *   2. Calls `sites.list` — lists the Search Console properties the
 *      authorized Google account has access to.
 *
 * What this deliberately does NOT do:
 *   - No performance/query data is fetched (searchanalytics.query is not
 *     called here).
 *   - No writes of any kind — the OAuth scope itself is read-only, so this
 *     script has no ability to modify Search Console state even if it tried.
 *   - No changes to any website/production file.
 *
 * Run: npm run gsc:list-sites
 */

import { google } from 'googleapis';
import { getAuthorizedClient } from './lib/auth';

async function main() {
  const auth = await getAuthorizedClient();
  const searchConsole = google.webmasters({ version: 'v3', auth });

  const response = await searchConsole.sites.list();
  const entries = response.data.siteEntry ?? [];

  if (entries.length === 0) {
    console.log('Authenticated successfully, but this Google account has no Search Console properties.');
    return;
  }

  console.log(`Authenticated. Found ${entries.length} Search Console propert${entries.length === 1 ? 'y' : 'ies'}:\n`);
  for (const entry of entries) {
    console.log(`  - ${entry.siteUrl}  (permission: ${entry.permissionLevel})`);
  }
  console.log('');
}

main().catch((error) => {
  console.error('\nGoogle Search Console auth test failed:');
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
