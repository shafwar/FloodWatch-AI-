// =============================================================================
// FloodWatch Semarang — Server-Side Weather Cache
// =============================================================================

import type { WeatherApiResponse } from '@/types';

interface CacheEntry {
  payload: WeatherApiResponse;
  storedAt: number;
}

/** BMKG online — cache 6 hours (aligns with ~2× daily BMKG updates) */
const BMKG_CACHE_TTL_MS = 6 * 60 * 60 * 1000;

/** Fallback mode — shorter TTL so recovery probes can refresh sooner */
const FALLBACK_CACHE_TTL_MS = 2 * 60 * 1000;

let memoryCache: CacheEntry | null = null;

function getTtlForPayload(payload: WeatherApiResponse): number {
  return payload.meta.bmkgStatus === 'online'
    ? BMKG_CACHE_TTL_MS
    : FALLBACK_CACHE_TTL_MS;
}

export function getCachedWeather(): WeatherApiResponse | null {
  if (!memoryCache) return null;

  const ttl = getTtlForPayload(memoryCache.payload);
  if (Date.now() - memoryCache.storedAt > ttl) {
    memoryCache = null;
    return null;
  }

  return memoryCache.payload;
}

export function setCachedWeather(payload: WeatherApiResponse): void {
  memoryCache = { payload, storedAt: Date.now() };
}

export function getBmkgCacheTtlMs(): number {
  return BMKG_CACHE_TTL_MS;
}

export function getFallbackRetryIntervalMs(): number {
  return 5 * 60 * 1000; // 5 minutes — background BMKG recovery probe
}
