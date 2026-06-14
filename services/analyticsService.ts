// =============================================================================
// FloodWatch Semarang — Analytics Service
// =============================================================================

import { HISTORY_RECORDS } from '@/data/mockHistory';
import { MONITORING_LOCATIONS } from '@/lib/locations';
import { average } from '@/lib/utils';

export function getTemperatureTrend(days = 7) {
  const result: Record<string, number[]> = {};
  const now = new Date();

  for (let d = days - 1; d >= 0; d--) {
    const target = new Date(now);
    target.setDate(target.getDate() - d);
    const dateKey = target.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });

    const dayRecords = HISTORY_RECORDS.filter((r) => {
      const rd = new Date(r.timestamp);
      return rd.getDate() === target.getDate() && rd.getMonth() === target.getMonth();
    });

    result[dateKey] = dayRecords.map((r) => r.suhu_c);
  }

  return Object.entries(result).map(([date, temps]) => ({
    date,
    avg: average(temps) || 26,
    min: Math.min(...temps, 26),
    max: Math.max(...temps, 28),
  }));
}

export function getHumidityTrend(days = 7) {
  const result: Record<string, number[]> = {};
  const now = new Date();

  for (let d = days - 1; d >= 0; d--) {
    const target = new Date(now);
    target.setDate(target.getDate() - d);
    const dateKey = target.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });

    const dayRecords = HISTORY_RECORDS.filter((r) => {
      const rd = new Date(r.timestamp);
      return rd.getDate() === target.getDate() && rd.getMonth() === target.getMonth();
    });

    result[dateKey] = dayRecords.map((r) => r.kelembapan);
  }

  return Object.entries(result).map(([date, humids]) => ({
    date,
    avg: average(humids) || 80,
    min: Math.min(...humids, 75),
    max: Math.max(...humids, 85),
  }));
}

export function getLocationRiskSummary() {
  return MONITORING_LOCATIONS.map((loc) => {
    const records = HISTORY_RECORDS.filter((r) => r.daerah === loc.name);
    const scores = records.map((r) => r.floodScore);
    return {
      locationId: loc.id,
      name: loc.kelurahan,
      avgRisk: average(scores),
      maxRisk: Math.max(...scores, 0),
      recordCount: records.length,
    };
  });
}
