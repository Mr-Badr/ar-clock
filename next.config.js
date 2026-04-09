/** @type {import('next').NextConfig} */
const SHARED_HTML_CACHE_HEADERS = [
  { key: 'Cache-Control', value: 'public, max-age=0, s-maxage=86400, stale-while-revalidate=3600' },
  { key: 'Vary', value: 'Accept-Encoding' },
];

const SHARED_XML_CACHE_HEADERS = [
  { key: 'Cache-Control', value: 'public, max-age=0, s-maxage=86400, stale-while-revalidate=86400' },
];

const nextConfig = {
  // ── Server ───────────────────────────────────────────────────────────────────
  // Keep Drizzle/Postgres out of the Edge runtime bundle (they are Node-only)
  serverExternalPackages: ['@neondatabase/serverless', 'postgres', 'drizzle-orm'],

  // ── HTTP ─────────────────────────────────────────────────────────────────────
  compress: true,
  poweredByHeader: false,

  // ── Images ──────────────────────────────────────────────────────────────────
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 86400,
    deviceSizes: [390, 640, 750, 828, 1080, 1200],
  },

  // ── Compiler ─────────────────────────────────────────────────────────────────
  // Remove console.log in production for smaller bundles
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },

  // ── Production Cache ────────────────────────────────────────────────────────
  cacheComponents: true,
  reactCompiler: true,

  // ── Cache Life (Next.js 16) ─────────────────────────────────────────────────
  cacheLife: {
    geodata: {
      stale: 3600,        // serve stale for 1h client-side
      revalidate: 86400,  // revalidate daily on server
      expire: 604800,     // expire after 7 days maximum
    }
  },

  // ── Experiments ──────────────────────────────────────────────────────────────
  experimental: {
    // Inline critical CSS for faster FCP
    optimizeCss: true,
    // Tree-shake icon/animation libraries — only the used exports are bundled
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
        // Apply to all routes
        source: '/(.*)',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(self)' },
          // Preconnect to Open-Meteo for faster weather API calls
          { key: 'Link', value: '<https://api.open-meteo.com>; rel=preconnect' },
        ],
      },
      {
        // Static assets — aggressive long-term caching
        source: '/_next/static/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        // High-intent content hubs that are safe to cache publicly.
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
        // robots.txt should stay cacheable but easy to refresh.
        source: '/robots.txt',
        headers: SHARED_XML_CACHE_HEADERS,
      },
      {
        // Root sitemap files.
        source: '/sitemap.xml',
        headers: SHARED_XML_CACHE_HEADERS,
      },
      {
        source: '/sitemap-index.xml',
        headers: SHARED_XML_CACHE_HEADERS,
      },
      {
        // Nested sitemap metadata routes such as /holidays/sitemap.xml and /date/hijri/sitemap.xml.
        source: '/:section*/sitemap.xml',
        headers: SHARED_XML_CACHE_HEADERS,
      },
      {
        // Per-country sharded sitemaps such as /time-now/sitemap/morocco.xml.
        source: '/:section*/sitemap/:slug*',
        headers: SHARED_XML_CACHE_HEADERS,
      },
      {
        // Date feature child sitemap routes return XML without the .xml suffix.
        source: '/date/sitemaps/:slug*',
        headers: SHARED_XML_CACHE_HEADERS,
      },
      {
        // API routes — no public caching
        source: '/api/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'no-store' },
        ],
      },
    ];
  },

  // ── Redirects ────────────────────────────────────────────────────────────────
  async redirects() {
    return [
      // Force a single canonical production host for SEO, sitemaps, and Search Console.
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.miqatona.com' }],
        destination: 'https://miqatona.com/:path*',
        permanent: true,
      },
      // Support common alternative URL formats
      { source: '/prayer-times/:country/:city', destination: '/mwaqit-al-salat/:country/:city', permanent: true },
      { source: '/salat/:country/:city', destination: '/mwaqit-al-salat/:country/:city', permanent: true },
    ];
  },
};

module.exports = nextConfig;
