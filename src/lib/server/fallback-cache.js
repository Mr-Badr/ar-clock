function getFallbackStore() {
  if (!globalThis.__miqatFallbackCacheStore__) {
    globalThis.__miqatFallbackCacheStore__ = new Map();
  }

  return globalThis.__miqatFallbackCacheStore__;
}

export function readFallbackCache(key, maxAgeMs = Infinity) {
  const store = getFallbackStore();
  const entry = store.get(key);

  if (!entry) return null;
  if (Date.now() - entry.updatedAt > maxAgeMs) return null;

  return entry;
}

export function writeFallbackCache(key, value) {
  const store = getFallbackStore();

  store.set(key, {
    value,
    updatedAt: Date.now(),
  });
}
