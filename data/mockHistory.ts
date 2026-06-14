// =============================================================================
// FloodWatch Semarang — Mock History Data
// Extended historical records for History page
// =============================================================================

import type { HistoryRecord, WeatherCondition, FloodLevel } from '@/types';
import { MONITORING_LOCATIONS } from '@/lib/locations';
import { calculateFloodRisk, calculateRiskLabel } from '@/lib/floodRiskEngine';

// Conditions removed to fix ESLint

let seed = 54321;
function pseudoRandom() {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

function randomBetween(min: number, max: number): number {
  return Math.round((pseudoRandom() * (max - min) + min) * 10) / 10;
}

function randomCondition(): WeatherCondition {
  // Realistic weight distribution for Semarang (tropical monsoon)
  const weighted = [
    'Cerah', 'Cerah Berawan', 'Cerah Berawan',
    'Berawan', 'Berawan', 'Berawan Tebal',
    'Hujan Ringan', 'Hujan Ringan', 'Hujan Sedang',
    'Hujan Lebat',
  ] as WeatherCondition[];
  return weighted[Math.floor(pseudoRandom() * weighted.length)];
}

function generateHistory(): HistoryRecord[] {
  const records: HistoryRecord[] = [];
  const now = new Date('2026-06-10T00:00:00Z');

  // 7 days of data, every 3 hours, all 10 locations
  for (let day = 0; day < 7; day++) {
    for (let hour = 0; hour < 24; hour += 3) {
      MONITORING_LOCATIONS.forEach((loc) => {
        const t = new Date(now);
        t.setDate(t.getDate() - day);
        t.setHours(hour, 0, 0, 0);

        const kondisi = randomCondition();
        const suhu_c = randomBetween(21, 33);
        const kelembapan = randomBetween(62, 98);
        const floodScore = calculateFloodRisk(kondisi, kelembapan);
        const floodLevel = calculateRiskLabel(floodScore);

        records.push({
          id: `hist-${loc.id}-${day}-${hour}`,
          daerah: loc.name,
          keterangan: 'Saat Ini',
          waktu: t.toISOString(),
          kondisi,
          suhu_c,
          kelembapan,
          timestamp: t.toISOString(),
          floodScore,
          floodLevel,
        });
      });
    }
  }

  // Sort by most recent first
  return records.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export const HISTORY_RECORDS: HistoryRecord[] = generateHistory();

// Helper: get records for a specific date range
export function getHistoryByDateRange(from: Date, to: Date): HistoryRecord[] {
  return HISTORY_RECORDS.filter((r) => {
    const t = new Date(r.timestamp);
    return t >= from && t <= to;
  });
}

// Helper: get records for a specific location
export function getHistoryByLocation(locationId: string): HistoryRecord[] {
  return HISTORY_RECORDS.filter((r) =>
    r.id.includes(locationId)
  );
}

// Summary stats for charts
export function getFloodLevelDistribution(): Record<FloodLevel, number> {
  const dist: Record<FloodLevel, number> = { AMAN: 0, WASPADA: 0, SIAGA: 0, BAHAYA: 0 };
  HISTORY_RECORDS.forEach((r) => { dist[r.floodLevel]++; });
  return dist;
}

export function getConditionDistribution(): Record<string, number> {
  const dist: Record<string, number> = {};
  HISTORY_RECORDS.forEach((r) => {
    dist[r.kondisi] = (dist[r.kondisi] ?? 0) + 1;
  });
  return dist;
}
