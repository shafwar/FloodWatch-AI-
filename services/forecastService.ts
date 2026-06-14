// =============================================================================
// FloodWatch Semarang — Forecast Service
// =============================================================================

import type { ForecastEntry } from '@/types';
import { FORECAST_RECORDS } from '@/data/mockWeather';
import { calculateFloodRisk, calculateRiskLabel } from '@/lib/floodRiskEngine';
import { MONITORING_LOCATIONS } from '@/lib/locations';
import type { WeatherCondition } from '@/types';

export async function fetchForecast(locationId?: string): Promise<ForecastEntry[]> {
  await delay(200);

  const records = locationId
    ? FORECAST_RECORDS.filter((r) => {
        const loc = MONITORING_LOCATIONS.find((l) => l.id === locationId);
        return loc ? r.daerah === loc.name : true;
      })
    : FORECAST_RECORDS;

  return records.map((r) => {
    const score = calculateFloodRisk(r.kondisi as WeatherCondition, r.kelembapan);
    return {
      locationId: MONITORING_LOCATIONS.find((l) => l.name === r.daerah)?.id ?? '',
      daerah: r.daerah,
      keterangan: r.keterangan,
      waktu: r.waktu,
      kondisi: r.kondisi,
      suhu_c: r.suhu_c,
      kelembapan: r.kelembapan,
      floodScore: score,
      floodLevel: calculateRiskLabel(score),
    };
  });
}

function delay(ms: number): Promise<void> {
  return new Promise((res) => setTimeout(res, ms));
}
