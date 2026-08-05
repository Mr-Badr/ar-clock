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

// Migrated into /tools/construction (2026-07-31) after real Keyword Planner validation —
// see keyword-research/construction-hub/DECISION.md. The old pages carried real, verified
// engine logic (reused, not rebuilt) but the old design system and URLs; redirecting instead
// of leaving both live avoids the two pages competing with each other for the same keywords.
const CONSTRUCTION_HUB_REDIRECTS = [
  {
    source: '/calculators/building/saudi-arabia',
    destination: '/tools/construction/build-cost',
  },
  {
    source: '/calculators/building/rebar',
    destination: '/tools/construction/rebar-weight',
  },
  {
    source: '/calculators/building/cement',
    destination: '/tools/construction/cement',
  },
  {
    source: '/calculators/building/tiles',
    destination: '/tools/construction/tiles',
  },
  {
    source: '/calculators/building/paint',
    destination: '/tools/construction/paint',
  },
];

// Building-by-country consolidation (2026-08-04): the new /tools/construction/build-cost
// selector was extended from 6 GCC-only countries to all 14 countries in country-data.js (5
// GCC countries had 100% identical pricing data to these old per-country pages — pure
// redundancy — and the 8 non-GCC countries' cost_per_m2 figures were re-sourced with real
// 2025/2026 data specifically to support this consolidation, see country-data.js inline
// citations). Retiring all remaining per-country pages + the building index into one flagship
// page instead of duplicating hero/FAQ/decision-table content 13 times over. saudi-arabia
// already redirects above (CONSTRUCTION_HUB_REDIRECTS).
const BUILDING_COUNTRY_REDIRECTS = [
  { source: '/calculators/building', destination: '/tools/construction/build-cost' },
  { source: '/calculators/building/uae', destination: '/tools/construction/build-cost' },
  { source: '/calculators/building/kuwait', destination: '/tools/construction/build-cost' },
  { source: '/calculators/building/qatar', destination: '/tools/construction/build-cost' },
  { source: '/calculators/building/bahrain', destination: '/tools/construction/build-cost' },
  { source: '/calculators/building/oman', destination: '/tools/construction/build-cost' },
  { source: '/calculators/building/egypt', destination: '/tools/construction/build-cost' },
  { source: '/calculators/building/jordan', destination: '/tools/construction/build-cost' },
  { source: '/calculators/building/iraq', destination: '/tools/construction/build-cost' },
  { source: '/calculators/building/lebanon', destination: '/tools/construction/build-cost' },
  { source: '/calculators/building/morocco', destination: '/tools/construction/build-cost' },
  { source: '/calculators/building/algeria', destination: '/tools/construction/build-cost' },
  { source: '/calculators/building/tunisia', destination: '/tools/construction/build-cost' },
  { source: '/calculators/building/libya', destination: '/tools/construction/build-cost' },
];

// Migrated into new /tools/health and /tools/education hubs (2026-08-04) after a real
// competitive audit found these tools had ZERO discoverability from the main /tools directory —
// see keyword-research/health-education-hubs/DECISION.md. Only the tools that survived the
// competition check are migrated; bmi/calories/ovulation/gpa/gpa-to-percent/weighted-grade stay
// at their old URLs (dominated by webteb.com/altibbi.com/hospitals/government/global brands —
// not worth a redesign, see the DECISION.md audit for the full per-tool reasoning).
const HEALTH_EDUCATION_HUB_REDIRECTS = [
  {
    source: '/calculators/weaning-schedule',
    destination: '/tools/health/weaning-schedule',
  },
  {
    source: '/calculators/pregnancy',
    destination: '/tools/health/pregnancy',
  },
  {
    source: '/calculators/pregnancy-weeks',
    destination: '/tools/health/pregnancy-weeks',
  },
  {
    source: '/calculators/saudi-school-calendar',
    destination: '/tools/education/saudi-school-calendar',
  },
  {
    source: '/calculators/age/countdown',
    destination: '/tools/health/age-countdown',
  },
  {
    source: '/calculators/age/planets',
    destination: '/tools/health/age-planets',
  },
  {
    source: '/calculators/age/milestones',
    destination: '/tools/health/age-milestones',
  },
  {
    // The old legacy hub-index pages — replaced outright by the new /tools/health and
    // /tools/education hubs, not left running in parallel (this also resolves a pre-existing
    // seo:validate gap: these old pages were never registered in the sitemap manifest at all).
    source: '/calculators/health',
    destination: '/tools/health',
  },
  {
    source: '/calculators/education',
    destination: '/tools/education',
  },
];

// Remaining age-cluster tools migrated to /tools/health (2026-08-04), completing the age
// cluster's tools-v2 migration started above — same reasoning: redirect instead of parallel-run
// so the two URLs never compete for the same keywords. The dedicated '/calculators/age' cluster
// index page is retired in favor of the age group already inside /tools/health (see the
// "age-time" TYPE_GROUPS entry in src/app/tools/health/page.jsx) rather than duplicating a
// second standalone hub for the same 8 tools.
const AGE_CLUSTER_REDIRECTS = [
  {
    source: '/calculators/age',
    destination: '/tools/health',
  },
  {
    source: '/calculators/age/calculator',
    destination: '/tools/health/age-calculator',
  },
  {
    source: '/calculators/age-calculator',
    destination: '/tools/health/age-calculator',
  },
  {
    source: '/calculators/age/hijri',
    destination: '/tools/health/age-hijri',
  },
  {
    source: '/calculators/age/difference',
    destination: '/tools/health/age-difference',
  },
  {
    source: '/calculators/age/birth-day',
    destination: '/tools/health/age-birth-day',
  },
  {
    source: '/calculators/age/retirement',
    destination: '/tools/health/age-retirement',
  },
];

// Gulf-finance stragglers migrated to /tools/gulf-finance (2026-08-04) — pure design migration,
// these 11 tools were already linked from and ranking inside the /tools/gulf-finance hub, just
// still living at their old /calculators/* URLs and old design system.
const GULF_FINANCE_STRAGGLER_REDIRECTS = [
  { source: '/calculators/annual-leave', destination: '/tools/gulf-finance/annual-leave' },
  { source: '/calculators/aqiqah', destination: '/tools/gulf-finance/aqiqah' },
  { source: '/calculators/domestic-worker-cost', destination: '/tools/gulf-finance/domestic-worker-cost' },
  { source: '/calculators/gulf-pay-dates', destination: '/tools/gulf-finance/gulf-pay-dates' },
  { source: '/calculators/iddah', destination: '/tools/gulf-finance/iddah' },
  { source: '/calculators/iqama', destination: '/tools/gulf-finance/iqama' },
  { source: '/calculators/nafaqah', destination: '/tools/gulf-finance/nafaqah' },
  { source: '/calculators/saudi-pay-dates', destination: '/tools/gulf-finance/saudi-pay-dates' },
  { source: '/calculators/sick-leave', destination: '/tools/gulf-finance/sick-leave' },
  { source: '/calculators/wasiyya', destination: '/tools/gulf-finance/wasiyya' },
  { source: '/calculators/working-days', destination: '/tools/gulf-finance/working-days' },
];

// Sleep + personal-finance clusters migrated to /tools (2026-08-04) — unlike the age/gulf-finance
// batches, these two needed a real research pass first (owner: sleep tools were flagged at 0
// clicks). Research confirmed the 10 real interactive tools are winnable (little/no direct
// calculator competition), while a separate "sleep guides" content system (8 slugs) was found to
// be genuinely dead code — authored but never routable — and was dropped, not migrated.
const SLEEP_PERSONAL_FINANCE_REDIRECTS = [
  { source: '/calculators/sleep', destination: '/tools/sleep' },
  { source: '/calculators/sleep/bedtime', destination: '/tools/sleep/bedtime' },
  { source: '/calculators/sleep/wake-time', destination: '/tools/sleep/wake-time' },
  { source: '/calculators/sleep/sleep-duration', destination: '/tools/sleep/sleep-duration' },
  { source: '/calculators/sleep/nap-calculator', destination: '/tools/sleep/nap-calculator' },
  { source: '/calculators/sleep/sleep-debt', destination: '/tools/sleep/sleep-debt' },
  { source: '/calculators/sleep/sleep-needs-by-age', destination: '/tools/sleep/sleep-needs-by-age' },
  { source: '/calculators/personal-finance', destination: '/tools/personal-finance' },
  { source: '/calculators/personal-finance/emergency-fund', destination: '/tools/personal-finance/emergency-fund' },
  { source: '/calculators/personal-finance/debt-payoff', destination: '/tools/personal-finance/debt-payoff' },
  { source: '/calculators/personal-finance/savings-goal', destination: '/tools/personal-finance/savings-goal' },
  { source: '/calculators/personal-finance/net-worth', destination: '/tools/personal-finance/net-worth' },
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
  {
    source: '/blog/how-to-calculate-percentage-discount',
    destination: '/calculators/percentage',
  },
  {
    source: '/guide/how-to-calculate-percentage-discount',
    destination: '/calculators/percentage',
  },
  {
    source: '/guides/how-to-calculate-percentage-discount',
    destination: '/calculators/percentage',
  },
  {
    source: '/blog/what-is-vat-input-vs-output-tax',
    destination: '/calculators/vat',
  },
  {
    source: '/guide/what-is-vat-input-vs-output-tax',
    destination: '/calculators/vat',
  },
  {
    source: '/guides/what-is-vat-input-vs-output-tax',
    destination: '/calculators/vat',
  },
];

const LEGACY_INDEXING_REDIRECTS = [
  {
    source: '/economie',
    destination: '/calculators/finance',
  },
  {
    source: '/economie/best-trading-time',
    destination: '/calculators/finance',
  },
  {
    source: '/map',
    destination: '/fahras',
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
        source: '/mwaqit-al-salat/:path*',
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
        source: '/calculators/:path*',
        headers: SHARED_HTML_CACHE_HEADERS,
      },
      {
        source: '/time-now/:path*/opengraph-image',
        headers: SHARED_OG_IMAGE_HEADERS,
      },
      {
        source: '/mwaqit-al-salat/:path*/opengraph-image',
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
      ...CONSTRUCTION_HUB_REDIRECTS.map((redirect) => ({
        ...redirect,
        permanent: true,
      })),
      ...BUILDING_COUNTRY_REDIRECTS.map((redirect) => ({
        ...redirect,
        permanent: true,
      })),
      ...HEALTH_EDUCATION_HUB_REDIRECTS.map((redirect) => ({
        ...redirect,
        permanent: true,
      })),
      ...AGE_CLUSTER_REDIRECTS.map((redirect) => ({
        ...redirect,
        permanent: true,
      })),
      ...GULF_FINANCE_STRAGGLER_REDIRECTS.map((redirect) => ({
        ...redirect,
        permanent: true,
      })),
      ...SLEEP_PERSONAL_FINANCE_REDIRECTS.map((redirect) => ({
        ...redirect,
        permanent: true,
      })),
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
      {
        source: '/guide',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/guide/:slug*',
        destination: '/blog/:slug*',
        permanent: true,
      },
      {
        source: '/guides',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/guides/:slug*',
        destination: '/blog/:slug*',
        permanent: true,
      },
      {
        source: '/prayer-times/:country/:city',
        destination: '/mwaqit-al-salat/:country/:city',
        permanent: true,
      },
      {
        source: '/salat/:country/:city',
        destination: '/mwaqit-al-salat/:country/:city',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
