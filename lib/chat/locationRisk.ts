// =============================================================================
// FloodWatch — Compute risk for map analysis (synced with AI response)
// =============================================================================

import { MONITORING_LOCATIONS } from '@/lib/locations';
import { calculateFloodRisk, calculateRiskLabel, getFloodRiskResult } from '@/lib/floodRiskEngine';
import type { TimeFrame } from '@/lib/chat/queryParser';
import type { WeatherRecord, WeatherCondition, FloodLevel } from '@/types';

export interface LocationRiskResult {
  locationId: string;
  locationName: string;
  riskLevel: FloodLevel;
  riskScore: number;
  kondisi: string;
  suhu: number;
  kelembapan: number;
  slotLabel: string;
  color: string;
}

export function computeLocationRisk(
  locationId: string,
  timeFrame: TimeFrame,
  records: WeatherRecord[]
): LocationRiskResult {
  const loc = MONITORING_LOCATIONS.find((l) => l.id === locationId)!;
  const slot = timeFrame === 'forecast' ? '3 Jam Kedepan' : 'Saat Ini';
  const record =
    records.find((r) => r.daerah === loc.name && r.keterangan === slot) ??
    records.find((r) => r.daerah === loc.name && r.keterangan === 'Saat Ini');

  const kondisi = (record?.kondisi ?? 'Cerah') as WeatherCondition;
  const kelembapan = record?.kelembapan ?? 0;
  const suhu = record?.suhu_c ?? 0;
  const score = record ? calculateFloodRisk(kondisi, kelembapan) : 0;
  const level = calculateRiskLabel(score);
  const risk = getFloodRiskResult(score);

  return {
    locationId,
    locationName: loc.name,
    riskLevel: level,
    riskScore: score,
    kondisi,
    suhu,
    kelembapan,
    slotLabel: slot,
    color: risk.color,
  };
}
