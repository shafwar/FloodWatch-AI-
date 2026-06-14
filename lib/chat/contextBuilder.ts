// =============================================================================
// FloodWatch Semarang — Chat Context Builder
// Serialises live BMKG weather data for the AI assistant system prompt.
// =============================================================================

import { getWeatherData, formatActiveSlotLabel } from '@/lib/weather/aggregator';
import { calculateFloodRisk, calculateRiskLabel } from '@/lib/floodRiskEngine';
import type { WeatherCondition } from '@/types';

export interface ChatWeatherContext {
  source: string;
  fetchedAt: string;
  activeSlotLabel: string;
  nextSlotChange: string;
  locationsOnline: number;
  locationsTotal: number;
  summary: string;
  locations: Array<{
    daerah: string;
    saatIni: {
      kondisi: string;
      suhu_c: number;
      kelembapan: number;
      waktu: string;
      risiko: string;
      skor: number;
    } | null;
    tigaJamKedepan: {
      kondisi: string;
      suhu_c: number;
      kelembapan: number;
      waktu: string;
      risiko: string;
      skor: number;
    } | null;
  }>;
}

export async function buildChatWeatherContext(): Promise<ChatWeatherContext> {
  const { records, meta } = await getWeatherData();

  const byDaerah = new Map<string, ChatWeatherContext['locations'][0]>();

  for (const record of records) {
    if (!byDaerah.has(record.daerah)) {
      byDaerah.set(record.daerah, { daerah: record.daerah, saatIni: null, tigaJamKedepan: null });
    }

    const entry = byDaerah.get(record.daerah)!;
    const score = calculateFloodRisk(record.kondisi as WeatherCondition, record.kelembapan);
    const level = calculateRiskLabel(score);
    const slot = {
      kondisi: record.kondisi,
      suhu_c: record.suhu_c,
      kelembapan: record.kelembapan,
      waktu: record.waktu,
      risiko: level,
      skor: score,
    };

    if (record.keterangan === 'Saat Ini') entry.saatIni = slot;
    if (record.keterangan === '3 Jam Kedepan') entry.tigaJamKedepan = slot;
  }

  const locations = Array.from(byDaerah.values());
  const highRisk = locations.filter(
    (l) => l.saatIni && (l.saatIni.skor >= 70 || l.saatIni.risiko === 'SIAGA' || l.saatIni.risiko === 'BAHAYA')
  );
  const waspada = locations.filter((l) => l.saatIni && l.saatIni.skor >= 40 && l.saatIni.skor < 70);

  const summaryParts: string[] = [];
  if (highRisk.length > 0) {
    summaryParts.push(
      `${highRisk.length} wilayah berstatus SIAGA/BAHAYA: ${highRisk.map((l) => l.daerah).join(', ')}`
    );
  }
  if (waspada.length > 0) {
    summaryParts.push(
      `${waspada.length} wilayah berstatus WASPADA: ${waspada.map((l) => l.daerah).join(', ')}`
    );
  }
  if (summaryParts.length === 0) {
    summaryParts.push('Semua wilayah dalam status AMAN atau risiko rendah.');
  }

  return {
    source: meta.source.toUpperCase(),
    fetchedAt: meta.fetchedAt,
    activeSlotLabel: formatActiveSlotLabel(meta.activeSlot),
    nextSlotChange: meta.nextSlotChange,
    locationsOnline: meta.locationsOnline,
    locationsTotal: meta.locationsTotal,
    summary: summaryParts.join('. '),
    locations,
  };
}

export function formatContextForPrompt(ctx: ChatWeatherContext): string {
  return JSON.stringify(ctx, null, 2);
}
