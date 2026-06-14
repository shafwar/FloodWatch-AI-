// =============================================================================
// FloodWatch Semarang — Mock Weather Data (100+ records)
// Simulates processed ETL output from BMKG Python service
// =============================================================================

import type { WeatherRecord, WeatherCondition } from '@/types';
import { MONITORING_LOCATIONS } from '@/lib/locations';

const CONDITIONS: WeatherCondition[] = [
  'Cerah', 'Cerah Berawan', 'Berawan', 'Berawan Tebal',
  'Hujan Ringan', 'Hujan Sedang', 'Hujan Lebat', 'Hujan Sangat Lebat',
];

const KETERANGAN_LIST = ['1 Jam Sebelum', 'Saat Ini', '1 Jam Kedepan', '3 Jam Kedepan', '6 Jam Kedepan'];

let seed = 12345;
function pseudoRandom() {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

function randomBetween(min: number, max: number): number {
  return Math.round((pseudoRandom() * (max - min) + min) * 10) / 10;
}

function hoursAgo(hours: number): string {
  const d = new Date('2026-06-10T00:00:00Z');
  d.setHours(d.getHours() - hours);
  d.setMinutes(0, 0, 0);
  return d.toISOString();
}

function hoursFromNow(hours: number): string {
  const d = new Date('2026-06-10T00:00:00Z');
  d.setHours(d.getHours() + hours);
  d.setMinutes(0, 0, 0);
  return d.toISOString();
}

// Weighted condition generator — biased toward rainy conditions for Semarang
function randomCondition(bias: 'dry' | 'wet' | 'mixed' = 'mixed'): WeatherCondition {
  const weights: Record<string, WeatherCondition[]> = {
    dry: ['Cerah', 'Cerah', 'Cerah Berawan', 'Cerah Berawan', 'Berawan'],
    wet: ['Hujan Ringan', 'Hujan Sedang', 'Hujan Sedang', 'Hujan Lebat', 'Berawan Tebal'],
    mixed: CONDITIONS,
  };
  const pool = weights[bias];
  return pool[Math.floor(pseudoRandom() * pool.length)];
}

// Current live weather state (what the ETL "Saat Ini" would produce)
export const CURRENT_WEATHER_STATE: Record<string, { kondisi: WeatherCondition; suhu_c: number; kelembapan: number }> = {
  'semarang-tengah-miroto':   { kondisi: 'Hujan Sedang',    suhu_c: 27, kelembapan: 90 },
  'semarang-utara-bandarharjo': { kondisi: 'Berawan Tebal',  suhu_c: 29, kelembapan: 82 },
  'tembalang':                { kondisi: 'Cerah Berawan',   suhu_c: 25, kelembapan: 74 },
  'wonodri':                  { kondisi: 'Hujan Ringan',    suhu_c: 26, kelembapan: 87 },
  'candi':                    { kondisi: 'Berawan',          suhu_c: 24, kelembapan: 79 },
  'jatingaleh':               { kondisi: 'Cerah Berawan',   suhu_c: 23, kelembapan: 72 },
  'gemah':                    { kondisi: 'Hujan Lebat',     suhu_c: 26, kelembapan: 95 },
  'pedurungan-kidul':         { kondisi: 'Hujan Sedang',    suhu_c: 27, kelembapan: 91 },
  'banyumanik':               { kondisi: 'Berawan Tebal',   suhu_c: 22, kelembapan: 80 },
  'srondol-kulon':            { kondisi: 'Cerah',           suhu_c: 21, kelembapan: 68 },
};

// Generate current snapshot records
export const CURRENT_WEATHER_RECORDS: WeatherRecord[] = MONITORING_LOCATIONS.map((loc) => {
  const state = CURRENT_WEATHER_STATE[loc.id];
  const now = new Date('2026-06-10T00:00:00Z');
  now.setMinutes(0, 0, 0);
  return {
    id: `current-${loc.id}`,
    daerah: loc.name,
    keterangan: 'Saat Ini',
    waktu: now.toISOString(),
    kondisi: state.kondisi,
    suhu_c: state.suhu_c,
    kelembapan: state.kelembapan,
    timestamp: '2026-06-10T00:00:00.000Z',
  };
});

// Generate full forecast window records (all 5 keterangan for each location)
export const FORECAST_RECORDS: WeatherRecord[] = MONITORING_LOCATIONS.flatMap((loc) => {
  const state = CURRENT_WEATHER_STATE[loc.id];
  const timeOffsets: Record<string, string> = {
    '1 Jam Sebelum': hoursAgo(1),
    'Saat Ini': '2026-06-10T00:00:00.000Z',
    '1 Jam Kedepan': hoursFromNow(1),
    '3 Jam Kedepan': hoursFromNow(3),
    '6 Jam Kedepan': hoursFromNow(6),
  };

  return KETERANGAN_LIST.map((ket, idx) => ({
    id: `forecast-${loc.id}-${idx}`,
    daerah: loc.name,
    keterangan: ket,
    waktu: timeOffsets[ket] ?? new Date().toISOString(),
    kondisi: idx === 1 ? state.kondisi : randomCondition('mixed'),
    suhu_c: state.suhu_c + randomBetween(-2, 2),
    kelembapan: Math.min(100, state.kelembapan + randomBetween(-5, 5)),
    timestamp: '2026-06-10T00:00:00.000Z',
  }));
});

// Generate historical records (last 24 hours, every hour, all 10 locations = 240 records)
function generateHistoricalRecords(): WeatherRecord[] {
  const records: WeatherRecord[] = [];
  for (let h = 24; h >= 0; h--) {
    MONITORING_LOCATIONS.forEach((loc) => {
      const t = new Date('2026-06-10T00:00:00Z');
      t.setHours(t.getHours() - h, 0, 0, 0);
      const bias = h > 12 ? 'dry' : h > 6 ? 'mixed' : 'wet';
      const kondisi = randomCondition(bias as 'dry' | 'wet' | 'mixed');
      records.push({
        id: `hist-${loc.id}-${h}`,
        daerah: loc.name,
        keterangan: 'Saat Ini',
        waktu: t.toISOString(),
        kondisi,
        suhu_c: randomBetween(21, 32),
        kelembapan: randomBetween(60, 98),
        timestamp: t.toISOString(),
      });
    });
  }
  return records;
}

export const HISTORICAL_RECORDS: WeatherRecord[] = generateHistoricalRecords();

// Generate older history (last 7 days, every 3 hours) for history page
function generateExtendedHistory(): WeatherRecord[] {
  const records: WeatherRecord[] = [];
  for (let day = 7; day >= 0; day--) {
    for (let h = 0; h < 24; h += 3) {
      MONITORING_LOCATIONS.slice(0, 5).forEach((loc) => {
        const t = new Date();
        t.setDate(t.getDate() - day);
        t.setHours(h, 0, 0, 0);
        const kondisi = randomCondition('mixed');
        records.push({
          id: `ext-${loc.id}-${day}-${h}`,
          daerah: loc.name,
          keterangan: 'Saat Ini',
          waktu: t.toISOString(),
          kondisi,
          suhu_c: randomBetween(21, 32),
          kelembapan: randomBetween(60, 98),
          timestamp: t.toISOString(),
        });
      });
    }
  }
  return records;
}

export const EXTENDED_HISTORY: WeatherRecord[] = generateExtendedHistory();

// Combine all records
export const ALL_WEATHER_RECORDS: WeatherRecord[] = [
  ...CURRENT_WEATHER_RECORDS,
  ...HISTORICAL_RECORDS.slice(0, 80),
];
