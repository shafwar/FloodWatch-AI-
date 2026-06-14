// =============================================================================
// FloodWatch Semarang — Weather Data Aggregator
// Primary: BMKG API · Fallback: CSV · Background recovery supported
// =============================================================================

import { MONITORING_LOCATIONS } from '@/lib/locations';
import type { WeatherRecord, WeatherMeta, BmkgStatus, WeatherApiResponse } from '@/types';
import {
  parseBmkgResponse,
  parseBmkgAllSlotRecords,
  flattenBmkgSlots,
  type BmkgLocationResponse,
} from './bmkgMapper';
import { readCsvWeatherRecords, readCsvFullHistoricalRecords } from './csvReader';
import {
  getCachedWeather,
  setCachedWeather,
  getBmkgCacheTtlMs,
  getFallbackRetryIntervalMs,
} from './cache';
import { nextSlotChangeIso } from './slots';

const BMKG_BASE_URL = 'https://api.bmkg.go.id/publik/prakiraan-cuaca';
const FETCH_TIMEOUT_MS = 12_000;

interface LocationFetchResult {
  loc: (typeof MONITORING_LOCATIONS)[0];
  liveRecords: WeatherRecord[];
  historicalRecords: WeatherRecord[];
  analysisDate: string | null;
  success: boolean;
}

async function fetchBmkgLocation(
  kode: string
): Promise<BmkgLocationResponse | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const res = await fetch(`${BMKG_BASE_URL}?adm4=${kode}`, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
      next: { revalidate: 0 },
    });

    // Treat HTTP errors (429 rate limit, 5xx unavailable) as BMKG failure → CSV fallback
    if (!res.ok) {
      console.warn(`[BMKG] HTTP ${res.status} for adm4=${kode}`);
      return null;
    }
    return (await res.json()) as BmkgLocationResponse;
  } catch (err) {
    console.warn(`[BMKG] Fetch failed for adm4=${kode}:`, err);
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

function resolveBmkgStatus(successCount: number, total: number): BmkgStatus {
  if (successCount === 0) return 'offline';
  if (successCount < total) return 'degraded';
  return 'online';
}

function resolveSource(status: BmkgStatus): WeatherMeta['source'] {
  if (status === 'online') return 'bmkg';
  if (status === 'degraded') return 'hybrid';
  return 'csv';
}

function buildMeta(
  records: WeatherRecord[],
  bmkgStatus: BmkgStatus,
  locationsOnline: number,
  analysisDate: string | null
): WeatherMeta {
  const saatIni = records.find((r) => r.keterangan === 'Saat Ini');
  const now = new Date();
  const isOnline = bmkgStatus === 'online';

  return {
    source: resolveSource(bmkgStatus),
    bmkgStatus,
    activeSlot: saatIni?.waktu ?? null,
    nextSlotChange: nextSlotChangeIso(now),
    fetchedAt: now.toISOString(),
    cacheExpiresAt: new Date(
      now.getTime() + (isOnline ? getBmkgCacheTtlMs() : getFallbackRetryIntervalMs())
    ).toISOString(),
    lastBmkgProbe: now.toISOString(),
    nextRetryAt: isOnline
      ? null
      : new Date(now.getTime() + getFallbackRetryIntervalMs()).toISOString(),
    locationsOnline,
    locationsTotal: MONITORING_LOCATIONS.length,
    bmkgAnalysisDate: analysisDate,
  };
}

function mergeWithCsvFallback(
  bmkgRecords: WeatherRecord[],
  csvRecords: WeatherRecord[]
): WeatherRecord[] {
  const merged = [...bmkgRecords];
  const covered = new Set(bmkgRecords.map((r) => r.daerah));

  for (const csv of csvRecords) {
    if (!covered.has(csv.daerah)) {
      merged.push(csv);
    }
  }

  return merged;
}

async function fetchAllLocations(): Promise<LocationFetchResult[]> {
  return Promise.all(
    MONITORING_LOCATIONS.map(async (loc) => {
      const response = await fetchBmkgLocation(loc.kode);

      if (!response) {
        return {
          loc,
          liveRecords: [],
          historicalRecords: [],
          analysisDate: null,
          success: false,
        };
      }

      const liveRecords = parseBmkgResponse(loc, response);
      const historicalRecords = parseBmkgAllSlotRecords(loc, response);
      const slots = flattenBmkgSlots(response);
      const analysisDate = slots[0]?.analysis_date ?? null;

      return {
        loc,
        liveRecords,
        historicalRecords,
        analysisDate,
        success: liveRecords.length > 0,
      };
    })
  );
}

/** Guaranteed CSV payload — last-resort when aggregator throws */
export function buildCsvFallbackPayload(): WeatherApiResponse {
  const csvLive = readCsvWeatherRecords();
  const csvHistorical = readCsvFullHistoricalRecords();
  return {
    records: csvLive,
    historicalRecords: csvHistorical,
    meta: buildMeta(csvLive, 'offline', 0, null),
  };
}

async function buildWeatherPayload(): Promise<WeatherApiResponse> {
  const results = await fetchAllLocations();
  const successCount = results.filter((r) => r.success).length;
  const total = MONITORING_LOCATIONS.length;
  const bmkgStatus = resolveBmkgStatus(successCount, total);
  const analysisDate = results.find((r) => r.analysisDate)?.analysisDate ?? null;

  const csvLive = readCsvWeatherRecords();
  const csvHistorical = readCsvFullHistoricalRecords();

  if (bmkgStatus === 'offline') {
    return {
      records: csvLive,
      historicalRecords: csvHistorical,
      meta: buildMeta(csvLive, 'offline', 0, null),
    };
  }

  const bmkgLive = results.flatMap((r) => r.liveRecords);
  const bmkgHistorical = results.flatMap((r) => r.historicalRecords);

  if (bmkgStatus === 'degraded') {
    const mergedLive = mergeWithCsvFallback(bmkgLive, csvLive);
    const coveredDaerah = new Set(bmkgHistorical.map((r) => r.daerah));
    const csvSupplement = csvHistorical.filter((r) => !coveredDaerah.has(r.daerah));
    const mergedHistorical = [...bmkgHistorical, ...csvSupplement];

    return {
      records: mergedLive,
      historicalRecords: mergedHistorical,
      meta: buildMeta(mergedLive, 'degraded', successCount, analysisDate),
    };
  }

  return {
    records: bmkgLive,
    historicalRecords: bmkgHistorical,
    meta: buildMeta(bmkgLive, 'online', successCount, analysisDate),
  };
}

async function buildWeatherPayloadSafe(): Promise<WeatherApiResponse> {
  try {
    return await buildWeatherPayload();
  } catch (err) {
    console.error('[Weather] Aggregator error, switching to CSV fallback:', err);
    return buildCsvFallbackPayload();
  }
}

export async function getWeatherData(forceRefresh = false): Promise<WeatherApiResponse> {
  if (!forceRefresh) {
    const cached = getCachedWeather();
    if (cached) return cached;
  }

  const payload = await buildWeatherPayloadSafe();
  setCachedWeather(payload);
  return payload;
}

/** Force BMKG probe — bypasses cache, used by background recovery monitor */
export async function probeBmkgRecovery(): Promise<WeatherApiResponse> {
  const payload = await buildWeatherPayloadSafe();
  setCachedWeather(payload);
  return payload;
}

export function formatActiveSlotLabel(isoTime: string | null): string {
  if (!isoTime) return '—';
  const date = new Date(isoTime);
  return new Intl.DateTimeFormat('id-ID', {
    timeZone: 'Asia/Jakarta',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);
}
