/**
 * Local-only OAuth 2.0 helper for the Google Search Console API.
 *
 * Security model (see scripts/seo-intelligence/README.md for the full writeup):
 * - Reads the Desktop OAuth client secret from `.secrets/` (never committed — see .gitignore).
 * - Requests ONLY the read-only Search Console scope.
 * - Persists the resulting refresh token to `.secrets/tokens/search-console.json`
 *   (also inside the already-gitignored `.secrets/` directory), with owner-only
 *   file permissions (0600).
 * - Never imported by any file under `src/` — this is a local CLI tool only and
 *   is never bundled into the Next.js app or shipped to the website.
 *
 * This module does not scrape Search Console in any way — it only calls the
 * official `googleapis` client library against Google's documented REST API.
 */

import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import path from 'node:path';
import { google } from 'googleapis';

// Deliberately typed off `googleapis`'s own bundled auth client rather than
// importing the standalone `google-auth-library` package: `googleapis`
// vendors its own copy internally, and adding a second top-level
// `google-auth-library` install creates two structurally-similar-but-distinct
// `OAuth2Client` classes that TypeScript (correctly) refuses to treat as
// interchangeable.
type OAuth2Client = InstanceType<typeof google.auth.OAuth2>;

export const READONLY_SCOPES = ['https://www.googleapis.com/auth/webmasters.readonly'];

const SECRETS_DIR = path.join(process.cwd(), '.secrets');
const TOKEN_DIR = path.join(SECRETS_DIR, 'tokens');
const TOKEN_PATH = path.join(TOKEN_DIR, 'search-console.json');

type StoredToken = {
  client_id: string;
  client_secret: string;
  refresh_token?: string;
  access_token?: string;
  expiry_date?: number;
};

type InstalledClientSecret = {
  installed?: {
    client_id: string;
    client_secret: string;
    auth_uri: string;
    token_uri: string;
  };
  web?: {
    client_id: string;
    client_secret: string;
    auth_uri: string;
    token_uri: string;
  };
};

async function findClientSecretFile(): Promise<string> {
  let entries: string[];
  try {
    entries = await readdir(SECRETS_DIR);
  } catch {
    throw new Error(
      `Could not read ${SECRETS_DIR}. Create it and place the downloaded Google OAuth ` +
        `"Desktop app" client JSON there (filename usually starts with "client_secret_").`,
    );
  }
  const match = entries.find((name) => name.startsWith('client_secret') && name.endsWith('.json'));
  if (!match) {
    throw new Error(
      `No client_secret_*.json file found in ${SECRETS_DIR}. Download the OAuth client ` +
        `JSON from Google Cloud Console (APIs & Services > Credentials) and place it there.`,
    );
  }
  return path.join(SECRETS_DIR, match);
}

async function loadClientSecret(): Promise<{ clientId: string; clientSecret: string }> {
  const file = await findClientSecretFile();
  const raw = JSON.parse(await readFile(file, 'utf-8')) as InstalledClientSecret;
  const key = raw.installed ?? raw.web;
  if (!key) {
    throw new Error(`${file} does not look like a valid OAuth client JSON (missing "installed"/"web" key).`);
  }
  return { clientId: key.client_id, clientSecret: key.client_secret };
}

async function loadStoredToken(): Promise<StoredToken | null> {
  try {
    const raw = await readFile(TOKEN_PATH, 'utf-8');
    return JSON.parse(raw) as StoredToken;
  } catch {
    return null;
  }
}

async function persistToken(client: OAuth2Client, clientId: string, clientSecret: string) {
  const creds = client.credentials;
  const payload: StoredToken = {
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: creds.refresh_token ?? undefined,
    access_token: creds.access_token ?? undefined,
    expiry_date: creds.expiry_date ?? undefined,
  };
  await mkdir(TOKEN_DIR, { recursive: true, mode: 0o700 });
  await writeFile(TOKEN_PATH, JSON.stringify(payload, null, 2), { mode: 0o600 });
}

function bestEffortOpenBrowser(url: string) {
  const opener = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start' : 'xdg-open';
  try {
    const child = spawn(opener, [url], { stdio: 'ignore', detached: true, shell: process.platform === 'win32' });
    child.unref();
  } catch {
    // Non-fatal — the URL is always printed to the console as a fallback.
  }
}

/**
 * Runs the interactive "installed app" OAuth loopback flow (RFC 8252):
 * starts a temporary HTTP server on 127.0.0.1 on an OS-assigned port,
 * prints (and best-effort opens) the Google consent URL, waits for the
 * redirect carrying the authorization code, exchanges it for tokens.
 */
async function runInteractiveAuthFlow(clientId: string, clientSecret: string): Promise<OAuth2Client> {
  return new Promise((resolve, reject) => {
    // Force-closes any lingering keep-alive sockets (e.g. the browser tab's
    // connection to this server) once we're done, so the Node process can
    // exit naturally instead of hanging on an open handle after the real
    // work (token exchange) has already finished.
    const shutdown = () => {
      server.close();
      if (typeof server.closeAllConnections === 'function') {
        server.closeAllConnections();
      }
    };

    const server = createServer(async (req, res) => {
      res.setHeader('Connection', 'close');
      try {
        const url = new URL(req.url ?? '/', 'http://localhost');
        const code = url.searchParams.get('code');
        const error = url.searchParams.get('error');

        if (error) {
          res.writeHead(400, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end('<h1>Authorization denied.</h1><p>You can close this tab.</p>');
          shutdown();
          reject(new Error(`Google returned an error: ${error}`));
          return;
        }
        if (!code) {
          res.writeHead(400, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end('<h1>Missing authorization code.</h1>');
          return;
        }

        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(
          '<h1>Miqatona SEO tooling: authorized.</h1>' +
            '<p>Read-only Search Console access granted. You can close this tab and return to the terminal.</p>',
        );

        const port = (server.address() as { port: number }).port;
        const redirectUri = `http://localhost:${port}`;
        const client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
        const { tokens } = await client.getToken(code);
        client.setCredentials(tokens);
        shutdown();
        resolve(client);
      } catch (err) {
        shutdown();
        reject(err as Error);
      }
    });

    server.listen(0, '127.0.0.1', () => {
      const port = (server.address() as { port: number }).port;
      const redirectUri = `http://localhost:${port}`;
      const client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
      const authUrl = client.generateAuthUrl({
        access_type: 'offline',
        prompt: 'consent',
        scope: READONLY_SCOPES,
      });

      console.log('\nGoogle Search Console — one-time authorization required.');
      console.log('Read-only scope only:', READONLY_SCOPES.join(', '));
      console.log('\nOpen this URL and sign in with the Google account that has access');
      console.log('to the miqatona.com Search Console property:\n');
      console.log(`  ${authUrl}\n`);
      console.log('Waiting for you to approve access in the browser…\n');
      bestEffortOpenBrowser(authUrl);
    });
  });
}

/**
 * Returns an OAuth2Client authorized with the read-only Search Console scope.
 * Reuses a saved refresh token if one exists; otherwise runs the interactive
 * loopback authorization flow once and persists the resulting token.
 */
export async function getAuthorizedClient(): Promise<OAuth2Client> {
  const { clientId, clientSecret } = await loadClientSecret();

  const stored = await loadStoredToken();
  if (stored?.refresh_token) {
    const client = new google.auth.OAuth2(clientId, clientSecret);
    client.setCredentials({
      refresh_token: stored.refresh_token,
      access_token: stored.access_token,
      expiry_date: stored.expiry_date,
    });
    // Keep the persisted token fresh if googleapis silently refreshes the access token.
    client.on('tokens', (tokens) => {
      void persistToken(client, clientId, clientSecret).catch(() => {});
      if (tokens.refresh_token) {
        client.credentials.refresh_token = tokens.refresh_token;
      }
    });
    return client;
  }

  const client = await runInteractiveAuthFlow(clientId, clientSecret);
  if (!client.credentials.refresh_token) {
    console.warn(
      '\nWarning: Google did not return a refresh token (this can happen on repeat ' +
        'authorizations). Re-run after revoking prior access at ' +
        'https://myaccount.google.com/permissions if this keeps happening.\n',
    );
  } else {
    await persistToken(client, clientId, clientSecret);
    console.log(`Token saved to ${path.relative(process.cwd(), TOKEN_PATH)} (owner-only permissions).\n`);
  }
  return client;
}
