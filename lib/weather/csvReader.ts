// =============================================================================
// FloodWatch Semarang — CSV Weather Fallback Reader
// =============================================================================

import fs from 'fs';
import path from 'path';
import type { WeatherRecord } from '@/types';
import { MONITORING_LOCATIONS } from '@/lib/locations';

const CSV_PATH = path.join(process.cwd(), 'dataset', 'histori_cuaca_semarang.csv');

export function readCsvWeatherRecords(): WeatherRecord[] {
  if (!fs.existsSync(CSV_PATH)) return [];

  const fileContent = fs.readFileSync(CSV_PATH, 'utf-8');
  const lines = fileContent
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const dataLines = lines.slice(1);
  const parsed: WeatherRecord[] = [];

  for (let idx = 0; idx < dataLines.length; idx++) {
    const line = dataLines[idx];
    const [daerah, keterangan, waktu, kondisi, suhu, kelembapan] = line.split(',');
    const loc = MONITORING_LOCATIONS.find((l) => l.name === daerah);
    const locId = loc ? loc.id : `unknown-${idx}`;

    parsed.push({
      id: `csv-${locId}-${keterangan.replace(/\s+/g, '-').toLowerCase()}`,
      daerah,
      keterangan,
      waktu,
      kondisi: kondisi as WeatherRecord['kondisi'],
      suhu_c: parseFloat(suhu) || 0,
      kelembapan: parseFloat(kelembapan) || 0,
      timestamp: new Date(waktu).toISOString(),
    });
  }

  return pickLatestPerLocation(parsed);
}

/** Full CSV dataset for analytics/history fallback */
export function readCsvFullHistoricalRecords(): WeatherRecord[] {
  if (!fs.existsSync(CSV_PATH)) return [];

  const fileContent = fs.readFileSync(CSV_PATH, 'utf-8');
  const lines = fileContent
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const dataLines = lines.slice(1);
  const parsed: WeatherRecord[] = [];

  for (let idx = 0; idx < dataLines.length; idx++) {
    const line = dataLines[idx];
    const [daerah, keterangan, waktu, kondisi, suhu, kelembapan] = line.split(',');
    const loc = MONITORING_LOCATIONS.find((l) => l.name === daerah);
    const locId = loc ? loc.id : `unknown-${idx}`;

    parsed.push({
      id: `csv-hist-${locId}-${idx}`,
      daerah,
      keterangan,
      waktu,
      kondisi: kondisi as WeatherRecord['kondisi'],
      suhu_c: parseFloat(suhu) || 0,
      kelembapan: parseFloat(kelembapan) || 0,
      timestamp: new Date(waktu).toISOString(),
    });
  }

  return parsed;
}

/** Keep only the newest row per (daerah, keterangan) pair */
function pickLatestPerLocation(records: WeatherRecord[]): WeatherRecord[] {
  const latest = new Map<string, WeatherRecord>();

  for (const record of records) {
    const key = `${record.daerah}::${record.keterangan}`;
    const existing = latest.get(key);
    if (!existing || new Date(record.timestamp) > new Date(existing.timestamp)) {
      latest.set(key, record);
    }
  }

  return Array.from(latest.values());
}
