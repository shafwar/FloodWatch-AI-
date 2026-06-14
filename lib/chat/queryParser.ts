// =============================================================================
// FloodWatch — Parse user chat for map focus & time intent
// =============================================================================

import { MONITORING_LOCATIONS } from '@/lib/locations';

export type TimeFrame = 'now' | 'forecast';

export interface MapQueryIntent {
  locationIds: string[];
  primaryLocationId: string | null;
  timeFrame: TimeFrame;
  isTravelQuery: boolean;
  matchedLabels: string[];
}

const ALIAS_GROUPS: Array<{ ids: string[]; terms: string[] }> = [
  { ids: ['semarang-utara-bandarharjo'], terms: ['semarang utara', 'utara', 'bandarharjo', 'tanjung mas'] },
  { ids: ['semarang-tengah-miroto'], terms: ['semarang tengah', 'tengah', 'miroto'] },
  { ids: ['wonodri'], terms: ['semarang selatan', 'selatan', 'wonodri'] },
  { ids: ['pedurungan-kidul', 'gemah'], terms: ['pedurungan', 'pedurungan kidul'] },
  { ids: ['gemah'], terms: ['gemah'] },
  { ids: ['tembalang'], terms: ['tembalang'] },
  { ids: ['banyumanik', 'srondol-kulon'], terms: ['banyumanik', 'srondol'] },
  { ids: ['candi', 'jatingaleh'], terms: ['candisari', 'candi', 'jatingaleh'] },
  {
    ids: ['wonodri', 'pedurungan-kidul', 'gemah', 'candi', 'jatingaleh'],
    terms: ['semarang bawah', 'daerah bawah', 'wilayah selatan', 'area rendah'],
  },
];

const FORECAST_TERMS = [
  '3 jam', 'tiga jam', 'kedepan', 'nanti', 'besok', 'malam', 'pagi', 'siang',
  'jam 8', 'jam 20', 'rencana', 'mau ke', 'mau pergi', 'perjalanan', 'berangkat',
];
const NOW_TERMS = ['sekarang', 'saat ini', 'hari ini', 'baru ini', 'kondisi terkini'];

function normalize(text: string): string {
  return text.toLowerCase().replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

export function parseUserMapQuery(message: string): MapQueryIntent {
  const text = normalize(message);
  const matchedIds = new Set<string>();
  const matchedLabels: string[] = [];

  for (const group of ALIAS_GROUPS) {
    if (group.terms.some((term) => text.includes(term))) {
      group.ids.forEach((id) => matchedIds.add(id));
      matchedLabels.push(group.terms[0]);
    }
  }

  // Match by district / kelurahan name from config
  for (const loc of MONITORING_LOCATIONS) {
    const district = normalize(loc.district);
    const kelurahan = normalize(loc.kelurahan);
    const name = normalize(loc.name);
    if (
      (district.length > 4 && text.includes(district)) ||
      (kelurahan.length > 4 && text.includes(kelurahan)) ||
      text.includes(name)
    ) {
      matchedIds.add(loc.id);
      matchedLabels.push(loc.name);
    }
  }

  const isTravelQuery =
    /mau (ke|pergi|jalan)|rencana (ke|pergi)|pergi ke|menuju|berangkat/.test(text);

  const timeFrame: TimeFrame =
    FORECAST_TERMS.some((t) => text.includes(t)) && !NOW_TERMS.some((t) => text.includes(t))
      ? 'forecast'
      : NOW_TERMS.some((t) => text.includes(t))
        ? 'now'
        : isTravelQuery
          ? 'forecast'
          : 'now';

  const locationIds = Array.from(matchedIds);
  const primaryLocationId = locationIds[0] ?? null;

  return {
    locationIds,
    primaryLocationId,
    timeFrame,
    isTravelQuery,
    matchedLabels: [...new Set(matchedLabels)],
  };
}

export function buildNoLocationHints(userMessage: string): string {
  return `
## Petunjuk: user belum menyebut lokasi spesifik
- Pesan user: "${userMessage}"
- Ringkas dulu kondisi cuaca Semarang **saat ini** dari data JSON (suhu rata-rata, kelembapan, area yang WASPADA/SIAGA jika ada).
- Lalu tanyakan dengan ramah: **"Mau ke daerah mana di Semarang?"** agar bisa dianalisis lebih detail.
- Jangan mengarang data. Nada santai seperti ChatGPT.`;
}

export function buildMapResultHints(
  mapResult: {
    locationName: string;
    riskLevel: string;
    riskScore: number;
    kondisi: string;
    suhu: number;
    kelembapan: number;
    slotLabel: string;
  },
  userMessage: string
): string {
  return `
## Petunjuk WAJIB — sinkron dengan peta analisis
User sudah melihat hasil di peta fullscreen. **WAJIB** sebutkan level risiko yang sama:
- Lokasi: **${mapResult.locationName}**
- Status di peta: **${mapResult.riskLevel}** (skor ${mapResult.riskScore})
- Cuaca (${mapResult.slotLabel}): ${mapResult.kondisi}, ${mapResult.suhu}°C, kelembapan ${mapResult.kelembapan}%
- Pesan user: "${userMessage}"
- Buka jawaban dengan mengonfirmasi status tersebut, lalu jelaskan artinya + saran praktis perjalanan.
- Bahasa Indonesia santai, mudah dibaca, 2–4 paragraf pendek.`;
}

export function buildQueryHints(intent: MapQueryIntent, userMessage: string): string {
  if (intent.locationIds.length === 0) {
    return buildNoLocationHints(userMessage);
  }

  const locNames = intent.locationIds
    .map((id) => MONITORING_LOCATIONS.find((l) => l.id === id)?.name)
    .filter(Boolean);

  const timeLabel =
    intent.timeFrame === 'forecast'
      ? 'Prioritaskan data slot **3 Jam Kedepan** (bukan per menit).'
      : 'Prioritaskan data slot **Saat Ini**.';

  return `
## Petunjuk khusus pertanyaan ini
- Pesan user: "${userMessage}"
- Lokasi: **${locNames.join(', ')}**
- ${timeLabel}
${intent.isTravelQuery ? '- Pertanyaan perjalanan: sertakan saran praktis (payung, hindari genangan, waktu berangkat).' : ''}
- Jika user minta prediksi per menit, jelaskan sopan lalu berikan slot 3 jam terdekat.
- Nada hangat seperti teman yang membantu.`;
}
