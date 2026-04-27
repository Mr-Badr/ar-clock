'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if (
      typeof window === 'undefined' ||
      !('serviceWorker' in navigator) ||
      !window.isSecureContext
    ) {
      return undefined;
    }

    const swEnabled = process.env.NEXT_PUBLIC_ENABLE_SW === 'true';
    const hostname = window.location.hostname;
    const isLocalhost =
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === '::1';
    const shouldRegister =
      process.env.NODE_ENV === 'production' && swEnabled && !isLocalhost;

    const cleanupExistingServiceWorkers = async () => {
      try {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(registrations.map((registration) => registration.unregister()));

        if ('caches' in window) {
          const cacheKeys = await window.caches.keys();
          await Promise.all(
            cacheKeys
              .filter((key) => key.startsWith('miqat-'))
              .map((key) => window.caches.delete(key)),
          );
        }
      } catch (error) {
        console.warn('[PWA] Service Worker cleanup skipped:', error);
      }
    };

    if (!shouldRegister) {
      cleanupExistingServiceWorkers();
      return undefined;
    }

    const registerSW = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
        });

        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (
                newWorker.state === 'installed' &&
                navigator.serviceWorker.controller
              ) {
                console.info('[PWA] New content is available; please refresh.');
              }
            });
          }
        });
      } catch (error) {
        console.error('[PWA] Service Worker registration failed:', error);
      }
    };

    const scheduleRegistration = () => {
      if ('requestIdleCallback' in window) {
        const idleId = window.requestIdleCallback(() => {
          registerSW();
        }, { timeout: 2500 });

        return () => window.cancelIdleCallback(idleId);
      }

      const timeoutId = globalThis.setTimeout(() => {
        registerSW();
      }, 1200);

      return () => globalThis.clearTimeout(timeoutId);
    };

    // Register after page load to avoid blocking initial render
    if (document.readyState === 'complete') {
      return scheduleRegistration();
    }

    let cleanupScheduledRegistration = () => {};

    const onLoad = () => {
      cleanupScheduledRegistration = scheduleRegistration();
    };

    window.addEventListener('load', onLoad);
    return () => {
      cleanupScheduledRegistration();
      window.removeEventListener('load', onLoad);
    };
  }, []);

  return null;
}
