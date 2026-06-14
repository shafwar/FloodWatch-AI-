// =============================================================================
// FloodWatch Semarang — BMKG Response Mapping
// =============================================================================

import type { WeatherCondition, WeatherRecord } from '@/types';
import type { MonitoringLocation } from '@/types';
import { parseBmkgLocalDatetime, selectActiveAndNextSlot } from './slots';

// ---------------------------------------------------------------------------
// BMKG API Types
// ---------------------------------------------------------------------------

export interface BmkgCuacaSlot {
  datetime: string;
  local_datetime: string;
  utc_datetime: string;
  t: number;
  hu: number;
  weather: number;
  weather_desc: string;
  weather_desc_en: string;
  analysis_date?: string;
  time_index?: string;
}

export interface BmkgLocationResponse {
  lokasi: {
    adm4: string;
    desa: string;
    kecamatan: string;
    kotkab: string;
    provinsi: string;
    lat: number;
    lon: number;
    timezone: string;
  };
  data: Array<{
    lokasi: Record<string, unknown>;
    cuaca: BmkgCuacaSlot[][];
  }>;
}

// ---------------------------------------------------------------------------
// Condition Mapping
// ---------------------------------------------------------------------------

const BMKG_CONDITION_MAP: Record<string, WeatherCondition> = {
  Cerah: 'Cerah',
  'Cerah Berawan': 'Cerah Berawan',
  Berawan: 'Berawan',
  'Berawan Tebal': 'Berawan Tebal',
  'Udara Kabur': 'Berawan Tebal',
  Kabut: 'Berawan Tebal',
  'Hujan Ringan': 'Hujan Ringan',
  'Hujan Sedang': 'Hujan Sedang',
  'Hujan Lebat': 'Hujan Lebat',
  'Hujan Petir': 'Hujan Lebat',
  'Hujan Sangat Lebat': 'Hujan Sangat Lebat',
};

export function mapBmkgCondition(desc: string): WeatherCondition {
  const trimmed = desc.trim();
  if (BMKG_CONDITION_MAP[trimmed]) return BMKG_CONDITION_MAP[trimmed];

  const lower = trimmed.toLowerCase();
  if (lower.includes('sangat lebat')) return 'Hujan Sangat Lebat';
  if (lower.includes('petir') || lower.includes('lebat')) return 'Hujan Lebat';
  if (lower.includes('sedang')) return 'Hujan Sedang';
  if (lower.includes('ringan')) return 'Hujan Ringan';
  if (lower.includes('cerah berawan') || lower.includes('sebagian'))
    return 'Cerah Berawan';
  if (lower.includes('tebal') || lower.includes('kabut') || lower.includes('kabur'))
    return 'Berawan Tebal';
  if (lower.includes('cerah')) return 'Cerah';
  if (lower.includes('berawan')) return 'Berawan';

  return 'Berawan';
}

// ---------------------------------------------------------------------------
// Record Builder
// ---------------------------------------------------------------------------

function formatSlotKeterangan(localDatetime: string): string {
  const date = parseBmkgLocalDatetime(localDatetime);
  return new Intl.DateTimeFormat('id-ID', {
    timeZone: 'Asia/Jakarta',
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);
}

function slotToRecord(
  loc: MonitoringLocation,
  slot: BmkgCuacaSlot,
  keterangan: string,
  idSuffix: string
): WeatherRecord {
  const kondisi = mapBmkgCondition(slot.weather_desc);
  const slotTime = parseBmkgLocalDatetime(slot.local_datetime);

  return {
    id: `bmkg-${loc.id}-${idSuffix}`,
    daerah: loc.name,
    keterangan,
    waktu: slotTime.toISOString(),
    kondisi,
    suhu_c: Math.round(slot.t * 10) / 10,
    kelembapan: Math.round(slot.hu),
    timestamp: slotTime.toISOString(),
  };
}

export function parseBmkgResponse(
  loc: MonitoringLocation,
  response: BmkgLocationResponse
): WeatherRecord[] {
  const cuacaGroups = response.data?.[0]?.cuaca;
  if (!cuacaGroups || cuacaGroups.length === 0) return [];

  const allSlots = cuacaGroups.flat();
  const selection = selectActiveAndNextSlot(allSlots);
  if (!selection) return [];

  const records: WeatherRecord[] = [
    slotToRecord(loc, selection.active, 'Saat Ini', 'saat-ini'),
  ];

  if (selection.next) {
    records.push(slotToRecord(loc, selection.next, '3 Jam Kedepan', '3jam-kedepan'));
  }

  return records;
}

/** All forecast slots from BMKG (for analytics/history when API is online) */
export function parseBmkgAllSlotRecords(
  loc: MonitoringLocation,
  response: BmkgLocationResponse
): WeatherRecord[] {
  const slots = flattenBmkgSlots(response);
  return slots.map((slot, idx) =>
    slotToRecord(
      loc,
      slot,
      formatSlotKeterangan(slot.local_datetime),
      `slot-${idx}`
    )
  );
}

export function flattenBmkgSlots(response: BmkgLocationResponse): BmkgCuacaSlot[] {
  const cuacaGroups = response.data?.[0]?.cuaca;
  if (!cuacaGroups) return [];
  return cuacaGroups
    .flat()
    .sort(
      (a, b) =>
        parseBmkgLocalDatetime(a.local_datetime).getTime() -
        parseBmkgLocalDatetime(b.local_datetime).getTime()
    );
}
