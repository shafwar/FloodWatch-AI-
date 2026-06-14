'use client';

// =============================================================================
// FloodWatch Semarang — useWeatherData hook
// =============================================================================

import { useMemo } from 'react';
import { useWeatherStore } from '@/store/weatherStore';
import { calculateFloodRisk, calculateRiskLabel, getFloodRiskResult } from '@/lib/floodRiskEngine';
import { MONITORING_LOCATIONS } from '@/lib/locations';
import { average } from '@/lib/utils';
import type { WeatherCondition } from '@/types';

export function useWeatherData() {
  const records = useWeatherStore((s) => s.records);
  const connectionStatus = useWeatherStore((s) => s.connectionStatus);
  const lastUpdate = useWeatherStore((s) => s.lastUpdate);
  const isLoading = useWeatherStore((s) => s.isLoading);
  const meta = useWeatherStore((s) => s.meta);
  const activeSource = useWeatherStore((s) => s.activeSource);
  const historicalRecords = useWeatherStore((s) => s.historicalRecords);

  const currentRecords = useMemo(
    () => records.filter((r) => r.keterangan === 'Saat Ini'),
    [records]
  );

  const enrichedRecords = useMemo(() =>
    currentRecords.map((r) => {
      const score = calculateFloodRisk(r.kondisi as WeatherCondition, r.kelembapan);
      const level = calculateRiskLabel(score);
      const risk = getFloodRiskResult(score);
      return { ...r, floodScore: score, floodLevel: level, riskResult: risk };
    }),
    [currentRecords]
  );

  const stats = useMemo(() => {
    const temps = currentRecords.map((r) => r.suhu_c);
    const humids = currentRecords.map((r) => r.kelembapan);
    const scores = enrichedRecords.map((r) => r.floodScore);

    return {
      avgTemp: average(temps),
      avgHumidity: average(humids),
      avgRisk: average(scores),
      maxRisk: Math.max(...scores, 0),
      highRiskCount: enrichedRecords.filter((r) => r.floodLevel === 'SIAGA' || r.floodLevel === 'BAHAYA').length,
    };
  }, [currentRecords, enrichedRecords]);

  return {
    records,
    currentRecords,
    enrichedRecords,
    stats,
    connectionStatus,
    lastUpdate,
    isLoading,
    locationCount: MONITORING_LOCATIONS.length,
    meta,
    activeSource,
    historicalRecords,
    isBmkgPrimary: meta?.bmkgStatus === 'online',
  };
}
