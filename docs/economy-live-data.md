# Economy Live Data

Miqatona uses a free-first data strategy for economy pages. The goal is to keep the core experience useful without forcing a paid provider.

## Current approach

- Core market/session timing logic is generated locally in the app.
- Server-rendered economy pages use cached snapshots for crawlable HTML.
- Client widgets keep the page feeling live after first paint.
- Yahoo Finance is used as the zero-key best-effort baseline for quotes and mini intraday chart lines.
- External APIs are optional enrichments, not hard requirements.

## Optional env vars

Add any of these to `.env.local` only if you want to enrich the free fallback layer:

```env
ECONOMY_LIVE_DATA_PROVIDER=auto
ALPHA_VANTAGE_API_KEY=
TWELVE_DATA_API_KEY=
FRED_API_KEY=
NEWSAPI_API_KEY=
GNEWS_API_KEY=
```

## Provider policy

- `ECONOMY_LIVE_DATA_PROVIDER=auto` is recommended.
- Yahoo-style quote fetching is treated as a no-key best-effort baseline, not a guaranteed forever-stable backbone.
- `TWELVE_DATA_API_KEY` is optional. It has a free tier, but it is not an unlimited always-free foundation for the product.
- `ALPHA_VANTAGE_API_KEY` is optional and useful for specific fallback quote and market-status cases.
- `FRED_API_KEY` is optional for macro indicators.
- `NEWSAPI_API_KEY` and `GNEWS_API_KEY` are optional for news enrichment only.

## What stays free even without keys

- Session timing and overlap logic
- Market open/close schedule models
- Server HTML for the main economy tools
- Free quote cards and mini chart context when Yahoo responses are available
- Client-side local time adaptation
- Crypto public-feed expansion paths that do not require a key

## Implementation notes

- Cached server snapshots live in `src/lib/economy/page-snapshots.server.js`.
- Live provider routing lives in `src/lib/economy/live-data.server.js`.
- Main economy pages stream client live widgets behind `Suspense` while keeping crawlable server content in the HTML.
