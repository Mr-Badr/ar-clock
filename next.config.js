/** @type {import('next').NextConfig} */

const SHARED_HTML_CACHE_HEADERS = [
  { key: 'Cache-Control', value: 'public, max-age=0, s-maxage=86400, stale-while-revalidate=3600' },
  { key: 'Vary', value: 'Accept-Encoding' },
];

const SHARED_XML_CACHE_HEADERS = [
  { key: 'Cache-Control', value: 'public, max-age=0, s-maxage=86400, stale-while-revalidate=86400' },
];

const SHARED_OG_IMAGE_HEADERS = [
  { key: 'Cache-Control', value: 'public, max-age=0, s-maxage=86400, stale-while-revalidate=86400' },
];

const LEGACY_BLOG_CANONICAL_REDIRECTS = [
  {
    source: '/blog/end-of-service-benefits-saudi',
    destination: '/tools/gulf-finance/end-of-service-benefits',
  },
  {
    source: '/guide/end-of-service-benefits-saudi',
    destination: '/tools/gulf-finance/end-of-service-benefits',
  },
  {
    source: '/guides/end-of-service-benefits-saudi',
    destination: '/tools/gulf-finance/end-of-service-benefits',
  },
  // 'percentage' and 'vat' calculators were removed from CALCULATOR_ROUTES entirely (both are on
  // the PLAN.md §2 blacklist — generic VAT/percentage tools already deeply covered by
  // khaleejcalculators.com) but these legacy blog/guide redirects were never updated to match —
  // found 2026-08-05 while investigating why Google still shows dead /calculators/* URLs in its
  // index: they were pointing at pages that don't exist (true 404s dressed up as a 301). Repointed
  // to the closest living replacement hub.
  {
    source: '/blog/how-to-calculate-percentage-discount',
    destination: '/tools/gulf-finance',
  },
  {
    source: '/guide/how-to-calculate-percentage-discount',
    destination: '/tools/gulf-finance',
  },
  {
    source: '/guides/how-to-calculate-percentage-discount',
    destination: '/tools/gulf-finance',
  },
  {
    source: '/blog/what-is-vat-input-vs-output-tax',
    destination: '/tools/gulf-finance',
  },
  {
    source: '/guide/what-is-vat-input-vs-output-tax',
    destination: '/tools/gulf-finance',
  },
  {
    source: '/guides/what-is-vat-input-vs-output-tax',
    destination: '/tools/gulf-finance',
  },
];

const LEGACY_INDEXING_REDIRECTS = [
  // Found 2026-08-11 via live `site:miqatona.com` search — Google's index still ranks these old
  // /calculators/* URLs (retired 2026-08-09, hard 404 by design, see CLAUDE.md) as top results for
  // brand + calculator queries. Unlike the general no-redirect policy for the retirement, these are
  // confirmed still receiving real search visibility right now, so they're redirected to their
  // closest living replacement to stop losing that traffic outright, matching this array's existing
  // precedent (economie/map/time-now typo entries below).
  {
    source: '/calculators/finance',
    destination: '/tools/gulf-finance',
  },
  {
    source: '/calculators/percentage',
    destination: '/tools/gulf-finance',
  },
  {
    source: '/calculators/building/cement',
    destination: '/tools/construction/cement',
  },
  {
    source: '/calculators/building/uae',
    destination: '/tools/construction/build-cost',
  },
  {
    source: '/calculators/building/oman',
    destination: '/tools/construction/build-cost',
  },
  {
    source: '/calculators/age/planets',
    destination: '/tools/health/age-planets',
  },
  {
    source: '/economie',
    destination: '/tools/gulf-finance',
  },
  {
    source: '/economie/best-trading-time',
    destination: '/tools/gulf-finance',
  },
  {
    source: '/map',
    destination: '/',
  },
  {
    source: '/time-now/netherlands',
    destination: '/time-now/the-netherlands',
  },
  {
    source: '/time-now/هولندا',
    destination: '/time-now/the-netherlands',
  },
  {
    source: '/time-now/%D9%87%D9%88%D9%84%D9%86%D8%AF%D8%A7',
    destination: '/time-now/the-netherlands',
  },
  {
    source: '/time-now/الكويت',
    destination: '/time-now/kuwait',
  },
  {
    source: '/time-now/%D8%A7%D9%84%D9%83%D9%88%D9%8A%D8%AA',
    destination: '/time-now/kuwait',
  },
  {
    source: '/time-now/أوغندا',
    destination: '/time-now/uganda',
  },
  {
    source: '/time-now/%D8%A3%D9%88%D8%BA%D9%86%D8%AF%D8%A7',
    destination: '/time-now/uganda',
  },
  {
    source: '/time-now/libya/bani-walid',
    destination: '/time-now/libya',
  },
  {
    source: '/time-now/libya/zawiya',
    destination: '/time-now/libya',
  },
  // Bulk redirect batch added 2026-08-18 — systematic GSC-data-driven pass over all /calculators/*
  // dead URLs still generating real search impressions (126K impressions / 1,850 clicks per 28
  // days across 117 URLs, confirmed via `.secrets/cache/search-console-report...json` — the
  // retirement's own no-redirect policy was costing real, measured traffic, not just theoretical
  // link equity). Exact-tool matches point to their direct /tools/* equivalent; country-specific
  // /calculators/building/<country> pages (no per-country build-cost tool exists anymore) and
  // generic finance/insurance/mortgage/loan variants with no direct replacement point to the
  // closest relevant hub (/tools/gulf-finance, /tools/personal-finance, /tools/islamic,
  // /tools/construction) rather than a topically-unrelated page or a dead end.
  { source: '/calculators/age', destination: '/tools/health/age-calculator' },
  { source: '/calculators/age/birth-day', destination: '/tools/health/age-birth-day' },
  { source: '/calculators/age/calculator', destination: '/tools/health/age-calculator' },
  { source: '/calculators/age/countdown', destination: '/tools/health/age-countdown' },
  { source: '/calculators/age/difference', destination: '/tools/health/age-difference' },
  { source: '/calculators/age/hijri', destination: '/tools/health/age-hijri' },
  { source: '/calculators/age/milestones', destination: '/tools/health/age-milestones' },
  { source: '/calculators/age/retirement', destination: '/tools/health/age-retirement' },
  { source: '/calculators/annual-leave', destination: '/tools/gulf-finance/annual-leave' },
  { source: '/calculators/aqiqah', destination: '/tools/gulf-finance/aqiqah' },
  { source: '/calculators/bill-splitter', destination: '/tools/personal-finance/bill-splitter' },
  { source: '/calculators/bmi', destination: '/tools/health/bmi' },
  { source: '/calculators/boernepenge-denmark', destination: '/tools/gulf-finance/boernepenge-denmark' },
  { source: '/calculators/building', destination: '/tools/construction' },
  { source: '/calculators/building/algeria', destination: '/tools/construction/build-cost' },
  { source: '/calculators/building/bahrain', destination: '/tools/construction/build-cost' },
  { source: '/calculators/building/egypt', destination: '/tools/construction/build-cost' },
  { source: '/calculators/building/iraq', destination: '/tools/construction/build-cost' },
  { source: '/calculators/building/jordan', destination: '/tools/construction/build-cost' },
  { source: '/calculators/building/kuwait', destination: '/tools/construction/build-cost' },
  { source: '/calculators/building/lebanon', destination: '/tools/construction/build-cost' },
  { source: '/calculators/building/libya', destination: '/tools/construction/build-cost' },
  { source: '/calculators/building/morocco', destination: '/tools/construction/build-cost' },
  { source: '/calculators/building/paint', destination: '/tools/construction/paint' },
  { source: '/calculators/building/qatar', destination: '/tools/construction/build-cost' },
  { source: '/calculators/building/rebar', destination: '/tools/construction/rebar-weight' },
  { source: '/calculators/building/saudi-arabia', destination: '/tools/construction/build-cost' },
  { source: '/calculators/building/tiles', destination: '/tools/construction/tiles' },
  { source: '/calculators/building/tunisia', destination: '/tools/construction/build-cost' },
  { source: '/calculators/calories', destination: '/tools/health/calories' },
  { source: '/calculators/car-insurance-bahrain', destination: '/tools/gulf-finance' },
  { source: '/calculators/car-insurance-kuwait', destination: '/tools/gulf-finance' },
  { source: '/calculators/car-insurance-qatar', destination: '/tools/gulf-finance' },
  { source: '/calculators/car-insurance-saudi', destination: '/tools/gulf-finance' },
  { source: '/calculators/car-insurance-uae', destination: '/tools/gulf-finance' },
  { source: '/calculators/car-loan', destination: '/tools/gulf-finance' },
  { source: '/calculators/cgeb-canada', destination: '/tools/gulf-finance/cgeb-canada' },
  { source: '/calculators/date-add-subtract', destination: '/tools/health/date-add-subtract' },
  { source: '/calculators/domestic-worker-cost', destination: '/tools/gulf-finance/domestic-worker-cost' },
  { source: '/calculators/egypt-car-customs', destination: '/tools/gulf-finance' },
  { source: '/calculators/egypt-electricity-bill', destination: '/tools/electrical/consumption-calculator' },
  { source: '/calculators/egypt-income-tax', destination: '/tools/gulf-finance' },
  { source: '/calculators/egypt-social-insurance', destination: '/tools/gulf-finance' },
  { source: '/calculators/egypt-water-bill', destination: '/tools/gulf-finance/egypt-water-bill' },
  { source: '/calculators/electricity-bill', destination: '/tools/electrical/consumption-calculator' },
  { source: '/calculators/end-of-service-benefits', destination: '/tools/gulf-finance/end-of-service-benefits' },
  { source: '/calculators/eos-bahrain', destination: '/tools/gulf-finance/end-of-service-benefits' },
  { source: '/calculators/eos-egypt', destination: '/tools/gulf-finance/end-of-service-benefits' },
  { source: '/calculators/eos-jordan', destination: '/tools/gulf-finance/end-of-service-benefits' },
  { source: '/calculators/eos-kuwait', destination: '/tools/gulf-finance/end-of-service-benefits' },
  { source: '/calculators/eos-qatar', destination: '/tools/gulf-finance/end-of-service-benefits' },
  { source: '/calculators/fasting', destination: '/tools/health/fasting' },
  { source: '/calculators/gosi-retirement', destination: '/tools/gulf-finance' },
  { source: '/calculators/gpa', destination: '/tools/education/gpa' },
  { source: '/calculators/gpa-to-percent', destination: '/tools/education/gpa-to-percent' },
  { source: '/calculators/gulf-pay-dates', destination: '/tools/gulf-finance/gulf-pay-dates' },
  { source: '/calculators/health-insurance-bahrain', destination: '/tools/gulf-finance' },
  { source: '/calculators/health-insurance-kuwait', destination: '/tools/gulf-finance' },
  { source: '/calculators/health-insurance-oman', destination: '/tools/gulf-finance' },
  { source: '/calculators/health-insurance-qatar', destination: '/tools/gulf-finance' },
  { source: '/calculators/health-insurance-saudi', destination: '/tools/gulf-finance' },
  { source: '/calculators/health-insurance-uae', destination: '/tools/gulf-finance' },
  { source: '/calculators/hijri-birthday', destination: '/tools/health/hijri-birthday' },
  { source: '/calculators/iddah', destination: '/tools/gulf-finance/iddah' },
  { source: '/calculators/inheritance', destination: '/tools/islamic' },
  { source: '/calculators/investment', destination: '/tools/personal-finance' },
  { source: '/calculators/iqama', destination: '/tools/gulf-finance/iqama' },
  { source: '/calculators/jordan-income-tax', destination: '/tools/gulf-finance/jordan-income-tax' },
  { source: '/calculators/margin-markup', destination: '/tools/ecommerce/store-profit-margin' },
  { source: '/calculators/monthly-installment', destination: '/tools/personal-finance' },
  { source: '/calculators/morocco-net-salary', destination: '/tools/gulf-finance' },
  { source: '/calculators/mortgage-bahrain', destination: '/tools/gulf-finance' },
  { source: '/calculators/mortgage-kuwait', destination: '/tools/gulf-finance' },
  { source: '/calculators/mortgage-qatar', destination: '/tools/gulf-finance' },
  { source: '/calculators/mortgage-saudi', destination: '/tools/gulf-finance' },
  { source: '/calculators/mortgage-uae', destination: '/tools/gulf-finance' },
  { source: '/calculators/nafaqah', destination: '/tools/gulf-finance/nafaqah' },
  { source: '/calculators/net-salary', destination: '/tools/gulf-finance' },
  { source: '/calculators/ovulation', destination: '/tools/health/ovulation' },
  { source: '/calculators/personal-finance', destination: '/tools/personal-finance' },
  { source: '/calculators/personal-finance/debt-payoff', destination: '/tools/personal-finance/debt-payoff' },
  { source: '/calculators/personal-finance/emergency-fund', destination: '/tools/personal-finance/emergency-fund' },
  { source: '/calculators/personal-finance/savings-goal', destination: '/tools/personal-finance/savings-goal' },
  { source: '/calculators/personal-loan', destination: '/tools/gulf-finance' },
  { source: '/calculators/personal-loan-bahrain', destination: '/tools/gulf-finance' },
  { source: '/calculators/personal-loan-egypt', destination: '/tools/gulf-finance' },
  { source: '/calculators/personal-loan-kuwait', destination: '/tools/gulf-finance' },
  { source: '/calculators/personal-loan-oman', destination: '/tools/gulf-finance' },
  { source: '/calculators/personal-loan-qatar', destination: '/tools/gulf-finance' },
  { source: '/calculators/pregnancy', destination: '/tools/health/pregnancy' },
  { source: '/calculators/pregnancy-weeks', destination: '/tools/health/pregnancy-weeks' },
  { source: '/calculators/salary', destination: '/tools/gulf-finance' },
  { source: '/calculators/saudi-pay-dates', destination: '/tools/gulf-finance/saudi-pay-dates' },
  { source: '/calculators/saudi-school-calendar', destination: '/tools/education/saudi-school-calendar' },
  { source: '/calculators/sick-leave', destination: '/tools/gulf-finance/sick-leave' },
  { source: '/calculators/sleep', destination: '/tools/sleep' },
  { source: '/calculators/sleep/bedtime', destination: '/tools/sleep/bedtime' },
  { source: '/calculators/sleep/nap-calculator', destination: '/tools/sleep/nap-calculator' },
  { source: '/calculators/sleep/sleep-duration', destination: '/tools/sleep/sleep-duration' },
  { source: '/calculators/sleep/sleep-needs-by-age', destination: '/tools/sleep/sleep-needs-by-age' },
  { source: '/calculators/sleep/wake-time', destination: '/tools/sleep/wake-time' },
  { source: '/calculators/soldes-france', destination: '/tools/gulf-finance/soldes-france' },
  { source: '/calculators/standard-deviation', destination: '/tools/education/standard-deviation' },
  { source: '/calculators/uae-corporate-tax', destination: '/tools/gulf-finance' },
  { source: '/calculators/vat', destination: '/tools/gulf-finance' },
  { source: '/calculators/wasiyya', destination: '/tools/gulf-finance/wasiyya' },
  { source: '/calculators/weaning-schedule', destination: '/tools/health/weaning-schedule' },
  { source: '/calculators/weighted-grade', destination: '/tools/education/weighted-grade' },
  { source: '/calculators/work-hours', destination: '/tools/gulf-finance/working-days' },
  { source: '/calculators/working-days', destination: '/tools/gulf-finance/working-days' },
  { source: '/calculators/zakat', destination: '/tools/islamic' },
];

// The fuel-price feature (13 country pages + comparison) moved out of /tools/gulf-finance into
// its own /tools/fuel-prices category 2026-08-25 — "gulf-finance" no longer fit a pan-Arab (not
// just GCC) live-pricing feature. These URLs are hours old with ~zero real Google indexing, so
// this is the cheapest possible time to fix the structure; redirects added anyway as correct
// practice and to keep any already-shared/bookmarked links working. See fuel-prices-registry.js's
// header and data.js's `compare` CALCULATOR_ROUTES entry for the rest of this migration.
const FUEL_PRICES_CATEGORY_MIGRATION_REDIRECTS = [
  { source: '/tools/gulf-finance/saudi-fuel-prices', destination: '/tools/fuel-prices/saudi-fuel-prices' },
  { source: '/tools/gulf-finance/uae-fuel-prices', destination: '/tools/fuel-prices/uae-fuel-prices' },
  { source: '/tools/gulf-finance/kuwait-fuel-prices', destination: '/tools/fuel-prices/kuwait-fuel-prices' },
  { source: '/tools/gulf-finance/qatar-fuel-prices', destination: '/tools/fuel-prices/qatar-fuel-prices' },
  { source: '/tools/gulf-finance/bahrain-fuel-prices', destination: '/tools/fuel-prices/bahrain-fuel-prices' },
  { source: '/tools/gulf-finance/oman-fuel-prices', destination: '/tools/fuel-prices/oman-fuel-prices' },
  { source: '/tools/gulf-finance/egypt-fuel-prices', destination: '/tools/fuel-prices/egypt-fuel-prices' },
  { source: '/tools/gulf-finance/morocco-fuel-prices', destination: '/tools/fuel-prices/morocco-fuel-prices' },
  { source: '/tools/gulf-finance/jordan-fuel-prices', destination: '/tools/fuel-prices/jordan-fuel-prices' },
  { source: '/tools/gulf-finance/algeria-fuel-prices', destination: '/tools/fuel-prices/algeria-fuel-prices' },
  { source: '/tools/gulf-finance/tunisia-fuel-prices', destination: '/tools/fuel-prices/tunisia-fuel-prices' },
  { source: '/tools/gulf-finance/iraq-fuel-prices', destination: '/tools/fuel-prices/iraq-fuel-prices' },
  { source: '/tools/gulf-finance/lebanon-fuel-prices', destination: '/tools/fuel-prices/lebanon-fuel-prices' },
  { source: '/tools/gulf-finance/gulf-fuel-prices', destination: '/tools/fuel-prices/compare' },
];

// Second wave of the same 2026-08-25 gulf-finance split, same day: domestic-worker recruitment (8
// tools, a genuinely distinct topic from personal salary/labor-law finance), general Sharia
// rulings (4 tools, finishing what /tools/islamic's cross-link section had already half-done since
// 2026-08-11), and the 3 non-Arab diaspora payment-date tools. Unlike the fuel-price move, these
// pages are ~20 days old (confirmed via `git log --diff-filter=A`), not hours — a 301 preserves
// the vast majority of ranking signal, but this is real link equity being moved, not a zero-risk
// same-day fix. See data.js's `domestic-worker`/`international-benefits` CALCULATOR_HUBS entries
// and gulf-finance/page.jsx's own comment for the rest of this migration.
const GULF_FINANCE_SECOND_WAVE_MIGRATION_REDIRECTS = [
  { source: '/tools/gulf-finance/domestic-worker-cost', destination: '/tools/domestic-worker/domestic-worker-cost' },
  { source: '/tools/gulf-finance/domestic-worker-uae', destination: '/tools/domestic-worker/domestic-worker-uae' },
  { source: '/tools/gulf-finance/domestic-worker-kuwait', destination: '/tools/domestic-worker/domestic-worker-kuwait' },
  { source: '/tools/gulf-finance/domestic-worker-qatar', destination: '/tools/domestic-worker/domestic-worker-qatar' },
  { source: '/tools/gulf-finance/domestic-worker-bahrain', destination: '/tools/domestic-worker/domestic-worker-bahrain' },
  { source: '/tools/gulf-finance/domestic-worker-oman', destination: '/tools/domestic-worker/domestic-worker-oman' },
  { source: '/tools/gulf-finance/domestic-worker-eligibility', destination: '/tools/domestic-worker/domestic-worker-eligibility' },
  { source: '/tools/gulf-finance/domestic-worker-contract', destination: '/tools/domestic-worker/domestic-worker-contract' },
  { source: '/tools/gulf-finance/wasiyya', destination: '/tools/islamic/wasiyya' },
  { source: '/tools/gulf-finance/iddah', destination: '/tools/islamic/iddah' },
  { source: '/tools/gulf-finance/aqiqah', destination: '/tools/islamic/aqiqah' },
  { source: '/tools/gulf-finance/nafaqah', destination: '/tools/islamic/nafaqah' },
  { source: '/tools/gulf-finance/cgeb-canada', destination: '/tools/international-benefits/cgeb-canada' },
  { source: '/tools/gulf-finance/soldes-france', destination: '/tools/international-benefits/soldes-france' },
  { source: '/tools/gulf-finance/boernepenge-denmark', destination: '/tools/international-benefits/boernepenge-denmark' },
];

const nextConfig = {
  // ── Server ───────────────────────────────────────────────────────────────────
  serverExternalPackages: [
    'postgres',
    'drizzle-orm',
  ],

  // FIX (Next 16 compatibility)
  // REMOVE deprecated/invalid key if it exists anywhere
  // serverComponentsExternalPackages ❌ DO NOT USE

  output: 'standalone',

  // ── HTTP ─────────────────────────────────────────────────────────────────────
  // Disable Node-level compression. This app is served behind nginx, and
  // uncompressed streaming from Next.js is more reliable for Safari/WebKit.
  compress: false,
  poweredByHeader: false,

  // ── Images ──────────────────────────────────────────────────────────────────
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 86400,
    // Owner, 2026-08-27: "why i see the image in hero with lose resolution" — this list was
    // deliberately tuned mobile-first (site is ~96% mobile traffic) and capped at 1200, but the
    // hero's <Image> renders full-bleed (`sizes="100vw"`) — on ANY screen wider than 1200px
    // (the large majority of real laptop/desktop widths: 1366, 1440, 1920, 2560...), the browser
    // had no larger srcset candidate to pick and was forced to stretch the 1200px-wide image
    // across a much wider box, which is exactly what read as "low resolution." Added the common
    // desktop tiers (Next's own default list already goes up to 3840 — this project had trimmed
    // below that on purpose for bandwidth, with this blur as an unintended side effect). The
    // small mobile-tuned sizes stay untouched, so the ~96% mobile majority's requests are
    // unaffected — these larger candidates only ever get requested by browsers whose viewport
    // actually warrants them.
    deviceSizes: [390, 640, 750, 828, 1080, 1200, 1440, 1920, 2560],
    // Next 16 rejects any `quality` prop value not explicitly whitelisted here (confirmed via a
    // real 400 response) — 75 stays as the sitewide implicit default for every other `<Image>`
    // (calculator icons, event thumbnails, etc., where bandwidth matters more than photographic
    // fidelity); 90 is opt-in only for the hero and footer's full-bleed background photos
    // (owner: "make them super clean and clear images in all devices" — these are the two
    // largest, most visually-important images on the site, worth the extra bytes).
    qualities: [75, 90],
  },

  // ── Compiler ─────────────────────────────────────────────────────────────────
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
      ? { exclude: ['error', 'warn'] }
      : false,
  },

  // ── Production Cache ────────────────────────────────────────────────────────
  cacheComponents: true,
  reactCompiler: true,

  // ── Cache Life (Next.js 16) ─────────────────────────────────────────────────
  cacheLife: {
    geodata: {
      stale: 3600,
      revalidate: 86400,
      expire: 604800,
    },
    // uae-fuel-prices live fetch (2026-08-25) — the source only changes monthly, so this isn't
    // about needing fresher data than a day old; it's a safety margin so the page is never more
    // than ~1 day behind whenever the upstream API actually publishes an update. `stale: 3600`
    // serves an already-cached response instantly while revalidating in the background; `expire:
    // 259200` (3 days) is the hard ceiling — past that, a request blocks on a fresh fetch attempt
    // rather than keep serving something that old.
    fuelPricesDaily: {
      stale: 3600,
      revalidate: 86400,
      expire: 259200,
    },
  },

  // ── Experiments ──────────────────────────────────────────────────────────────
  experimental: {
    optimizeCss: true,

    optimizePackageImports: [
      '@phosphor-icons/react',
      'lucide-react',
      'motion',
      'recharts',
      'date-fns',
    ],
  },

  // ── Security & Performance Headers ───────────────────────────────────────────
  async headers() {
    return [
      {
        // Everything except /embed/* gets the normal same-origin framing lock.
        source: '/:path((?!embed/).*)',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(self)' },
        ],
      },
      {
        // Embed widgets are built to be iframed into third-party sites — no
        // X-Frame-Options here, and CSP frame-ancestors explicitly allows any
        // origin to embed them (this is the ONLY route family that does).
        source: '/embed/:path*',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Content-Security-Policy', value: 'frame-ancestors *' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(self)' },
        ],
      },
      // ── YOUR ORIGINAL ROUTES (UNCHANGED) ────────────────────────────────
      {
        source: '/time-now/:path*',
        headers: SHARED_HTML_CACHE_HEADERS,
      },
      {
        source: '/holidays/:path*',
        headers: SHARED_HTML_CACHE_HEADERS,
      },
      {
        source: '/time-difference/:path*',
        headers: SHARED_HTML_CACHE_HEADERS,
      },
      {
        source: '/tools/:path*',
        headers: SHARED_HTML_CACHE_HEADERS,
      },
      {
        source: '/time-now/:path*/opengraph-image',
        headers: SHARED_OG_IMAGE_HEADERS,
      },
      {
        source: '/holidays/:path*/opengraph-image',
        headers: SHARED_OG_IMAGE_HEADERS,
      },
      {
        source: '/api/og/:path*',
        headers: SHARED_OG_IMAGE_HEADERS,
      },

      {
        source: '/robots.txt',
        headers: SHARED_XML_CACHE_HEADERS,
      },
      {
        source: '/sitemap.xml',
        headers: SHARED_XML_CACHE_HEADERS,
      },
      {
        source: '/sitemap-index.xml',
        headers: SHARED_XML_CACHE_HEADERS,
      },
      {
        source: '/:section*/sitemap.xml',
        headers: SHARED_XML_CACHE_HEADERS,
      },
      {
        source: '/:section*/sitemap/:slug*',
        headers: SHARED_XML_CACHE_HEADERS,
      },
      {
        source: '/date/sitemaps/:slug*',
        headers: SHARED_XML_CACHE_HEADERS,
      },

      {
        source: '/api/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'no-store' },
        ],
      },
    ];
  },

  // ── Redirects (UNCHANGED) ────────────────────────────────────────────────
  async redirects() {
    return [
      ...LEGACY_BLOG_CANONICAL_REDIRECTS.map((redirect) => ({
        ...redirect,
        permanent: true,
      })),
      ...LEGACY_INDEXING_REDIRECTS.map((redirect) => ({
        ...redirect,
        permanent: true,
      })),
      ...FUEL_PRICES_CATEGORY_MIGRATION_REDIRECTS.map((redirect) => ({
        ...redirect,
        permanent: true,
      })),
      ...GULF_FINANCE_SECOND_WAVE_MIGRATION_REDIRECTS.map((redirect) => ({
        ...redirect,
        permanent: true,
      })),
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.miqatona.com' }],
        destination: 'https://miqatona.com/:path*',
        permanent: true,
      },
      {
        source: '/&',
        destination: '/',
        permanent: true,
      },
      {
        source: '/%26',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
