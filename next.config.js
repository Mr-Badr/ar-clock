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
  { source: '/calculators/bill-splitter', destination: '/tools/personal-finance' },
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
    deviceSizes: [390, 640, 750, 828, 1080, 1200],
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
    }
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
