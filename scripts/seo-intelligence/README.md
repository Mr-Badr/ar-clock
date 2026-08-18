# SEO Intelligence tooling (local-only)

Local, read-only connectors to the Free SEO Intelligence Layer described in
`docs/english-market-expansion-plan.md`. Everything under this directory:

- Runs **only** as a local Node/tsx CLI script (`node --import tsx scripts/...`).
- Is **never imported by `src/`** and is not part of the Next.js build (`npm run
  build` never touches this directory) — it cannot affect production behavior.
- Talks to Google's official REST APIs via the official `googleapis` client
  library — no scraping, no unofficial endpoints.

## Google Search Console (`search-console/`)

Read-only OAuth 2.0 integration using the official Search Console API.

**Scope used**: `https://www.googleapis.com/auth/webmasters.readonly` — read-only.
This integration cannot modify Search Console state (add/remove properties,
submit sitemaps, etc.) even if the code tried to, because the granted OAuth
scope doesn't permit it.

### Setup (one-time, already done for miqatona.com)

1. A Google Cloud project with the **Search Console API** enabled.
2. A **Desktop app** OAuth 2.0 client, downloaded as
   `client_secret_<...>.apps.googleusercontent.com.json` and placed in
   `.secrets/` at the repo root (already gitignored — verified via
   `git check-ignore -v .secrets/`).

### Where things live

| What | Where | In git? |
|---|---|---|
| OAuth client secret (downloaded from Google Cloud Console) | `.secrets/client_secret_*.json` | **No** — `.secrets/` is gitignored |
| Saved OAuth token (refresh token + last access token) | `.secrets/tokens/search-console.json` | **No** — same gitignored directory, created with `0600` permissions |
| Auth/token logic | `scripts/seo-intelligence/search-console/lib/auth.ts` | Yes (no secrets in code) |
| CLI entry points | `scripts/seo-intelligence/search-console/*.ts` | Yes |

No credentials or tokens are ever committed, logged in full, or referenced from
any file under `src/`.

### Commands

```bash
npm run gsc:list-sites
```

First run: prints a Google consent URL (and best-effort opens it in your
default browser), starts a temporary local HTTP server on `127.0.0.1` to
receive the OAuth redirect (standard "installed app" loopback flow, RFC 8252),
exchanges the resulting code for a token, and saves it to
`.secrets/tokens/search-console.json`. Then lists the Search Console
properties the authorized Google account can access.

Subsequent runs reuse the saved refresh token — no browser interaction needed
unless access is revoked.

```bash
npm run gsc:report                              # human-readable, last 28 days
npm run gsc:report -- --refresh                  # bypass the local cache
npm run gsc:report -- --site=sc-domain:x.com     # only needed with 2+ properties
npm run --silent gsc:report -- --json            # machine-readable JSON on stdout
```

`--json` note: use `npm run --silent gsc:report -- --json` (not plain
`npm run gsc:report -- --json`) when piping the output into another tool —
without `--silent`, npm itself prints a `> ar-clock@... gsc:report` banner
line to stdout ahead of the JSON, which breaks JSON parsing downstream.

Reuses the same `getAuthorizedClient()` from `search-console/lib/auth.ts` —
no second OAuth flow, no second credential. Reports:
overall performance, top pages (by clicks and by impressions), top queries,
top countries, `/en/*` pages and queries (currently always empty — no
English pages exist yet, see `docs/english-market-expansion-plan.md`), and
four diagnostic opportunity classifications (high-impressions/low-CTR,
position 4-20, impressions-with-zero-clicks, English pages with any
impressions). Every number comes directly from the Search Console API
response — see the report's own printed "Data & API limitations" section
for what the numbers do and don't mean.

Results for a given site + 28-day window are cached for 12 hours under
`.secrets/cache/` (same gitignored tree as the OAuth token, separate
subfolder — cache holds report data, never credentials/tokens).

```bash
npm run gsc:opportunities                              # human-readable, last 28 days
npm run gsc:opportunities -- --refresh                  # bypass the local cache
npm run --silent gsc:opportunities -- --json             # machine-readable JSON on stdout
```

Diagnostic-only opportunity mining on top of the same 28-day query×page data —
query→page relationships, per-page opportunity summaries (flags A-E), query
cannibalization detection, country/device breakdowns for the top-scoring
opportunities, and a fully documented 0-100 "investigation priority" score
(see `lib/opportunity-scoring.ts` — never a traffic prediction). Everything
is phrased as an investigation opportunity, never a confirmed problem, and
nothing here changes any page automatically.

Fetches the query×page dataset with bounded pagination (up to 4×25,000 = 100k
rows) and tells you explicitly if it's still truncated at that ceiling. It
also cross-checks its derived totals against a cached `npm run gsc:report`
run for the same window (read-only, no extra API call) so you can see how
much data was lost to Google's per-combination anonymization — read the
report's own dataset-completeness and cross-check lines before trusting any
number from it. Country/device breakdowns are only fetched for the top 8
highest-scoring opportunities, to keep API usage bounded.

### Adding more read-only reports later

Per `docs/english-market-expansion-plan.md` §4/§12, future scripts here (URL
Inspection, etc.) should import `getAuthorizedClient()` from
`search-console/lib/auth.ts` rather than duplicating the auth flow, and
should stick to read-only endpoints only.
