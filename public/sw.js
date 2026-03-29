/**
 * Service Worker for Miqat PWA
 * Provides offline support and caching for Arabic clock app
 */

const CACHE_VERSION = 'v1'; // Bump this when deploying major updates
const STATIC_CACHE = `miqat-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `miqat-dynamic-${CACHE_VERSION}`;

// Core assets to cache immediately on install (atomic)
const CORE_ASSETS = [
  '/',
  '/offline',
  '/manifest.webmanifest',
  '/favicon.ico',
];

// Content pages prefixed to cache individually (best-effort)
const CONTENT_PAGES = [
  '/holidays',
  '/mwaqit-al-salat',
  '/time-now',
  '/time-difference',
];

// API endpoints to cache with network-first strategy
const API_ENDPOINTS = [
  '/api/ip-city',
  '/api/search-city',
  '/api/cities-by-country',
];

// Install event - cache static assets safely
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then(async (cache) => {
      console.log(`[SW] Caching core assets for ${CACHE_VERSION}`);
      // Atomic caching - core requirements
      await cache.addAll(CORE_ASSETS);
      
      // Best-effort caching - content pages
      for (const page of CONTENT_PAGES) {
        try {
          await cache.add(page);
        } catch (e) {
          console.warn(`[SW] Failed to precache ${page}`, e);
        }
      }
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http requests
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // Strategy 1: Cache-first for static assets
  if (isStaticAsset(url.pathname)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Strategy 2: Network-first for API calls
  if (isApiEndpoint(url.pathname)) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Strategy 3: Stale-while-revalidate for pages
  event.respondWith(staleWhileRevalidate(request));
});

// Cache-first strategy
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('[SW] Cache-first failed:', error);
    return new Response('Offline', { status: 503 });
  }
}

// Network-first strategy
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    return new Response(JSON.stringify({ error: 'Offline' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// Stale-while-revalidate strategy
async function staleWhileRevalidate(request) {
  const cachedResponse = await caches.match(request);
  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      const cache = caches.open(DYNAMIC_CACHE);
      cache.then((c) => c.put(request, networkResponse.clone()));
    }
    return networkResponse;
  }).catch(() => {
    // If navigation request fails, return offline page
    if (request.mode === 'navigate') {
      return caches.match('/offline');
    }
    return cachedResponse;
  });

  return cachedResponse || fetchPromise;
}

// Helper functions
function isStaticAsset(pathname) {
  return (
    pathname.startsWith('/_next/static/') ||
    pathname.startsWith('/icons/') ||
    pathname.endsWith('.css') ||
    pathname.endsWith('.js') ||
    pathname.endsWith('.png') ||
    pathname.endsWith('.jpg') ||
    pathname.endsWith('.svg') ||
    pathname.endsWith('.ico')
  );
}

function isApiEndpoint(pathname) {
  return API_ENDPOINTS.some((endpoint) => pathname.startsWith(endpoint));
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('[SW] Background sync triggered');
  }
});

// Push notifications (for future use)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1,
      },
      actions: [
        { action: 'explore', title: 'استكشف' },
        { action: 'close', title: 'إغلاق' },
      ],
    };
    event.waitUntil(self.registration.showNotification(data.title, options));
  }
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'explore') {
    event.waitUntil(clients.openWindow('/'));
  }
});
