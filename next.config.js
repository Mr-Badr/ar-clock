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
    destination: '/calculators/end-of-service-benefits',
  },
  {
    source: '/guide/end-of-service-benefits-saudi',
    destination: '/calculators/end-of-service-benefits',
  },
  {
    source: '/guides/end-of-service-benefits-saudi',
    destination: '/calculators/end-of-service-benefits',
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
        source: '/(.*)',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
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
