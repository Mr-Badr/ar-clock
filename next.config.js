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
      {
        source: '/_next/static/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
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
