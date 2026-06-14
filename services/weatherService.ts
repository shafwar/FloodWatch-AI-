// =============================================================================
// FloodWatch Semarang — Weather Service
// API layer for weather data (mock implementation)
// Replace API URLs with real backend endpoints when available
// =============================================================================

import type { WeatherRecord } from '@/types';
import { CURRENT_WEATHER_RECORDS, HISTORICAL_RECORDS } from '@/data/mockWeather';
import { MONITORING_LOCATIONS } from '@/lib/locations';

// const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? '/api';

/**
 * Fetch current weather for all monitoring locations.
 * In production, replace with: fetch(`${API_BASE}/weather/current`)
 */
export async function fetchCurrentWeather(): Promise<WeatherRecord[]> {
  // Mock: return current weather records
  await delay(200);
  return CURRENT_WEATHER_RECORDS;
}

/**
 * Fetch weather for a specific location.
 */
export async function fetchLocationWeather(locationId: string): Promise<WeatherRecord | null> {
  await delay(100);
  return CURRENT_WEATHER_RECORDS.find((r) => r.id.includes(locationId)) ?? null;
}

/**
 * Fetch historical weather records.
 */
export async function fetchHistoricalWeather(
  locationId?: string,
  from?: Date,
  to?: Date
): Promise<WeatherRecord[]> {
  await delay(300);
  let records = HISTORICAL_RECORDS;

  if (locationId) {
    const loc = MONITORING_LOCATIONS.find((l) => l.id === locationId);
    if (loc) records = records.filter((r) => r.daerah === loc.name);
  }

  if (from) records = records.filter((r) => new Date(r.timestamp) >= from);
  if (to) records = records.filter((r) => new Date(r.timestamp) <= to);

  return records;
}

// ---------------------------------------------------------------------------
// Utility
// ---------------------------------------------------------------------------

function delay(ms: number): Promise<void> {
  return new Promise((res) => setTimeout(res, ms));
}
