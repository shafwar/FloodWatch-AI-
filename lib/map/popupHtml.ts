// =============================================================================
// FloodWatch Semarang — Leaflet Popup HTML Builder
// =============================================================================

import { calculateFloodRisk, calculateRiskLabel, getFloodRiskResult } from '@/lib/floodRiskEngine';
import { getConditionConfig } from '@/lib/weatherConditions';
import { formatDateTime } from '@/lib/utils';
import type { MonitoringLocation } from '@/types';
import type { WeatherCondition, WeatherRecord } from '@/types';

export function buildMarkerPopupHtml(
  location: MonitoringLocation,
  record: WeatherRecord | null
): string {
  if (!record) {
    return `<div style="padding:16px;font-family:system-ui,sans-serif;color:#e2e8f0;">
      <p style="margin:0;font-size:13px;color:#94a3b8;">Tidak ada data tersedia</p>
    </div>`;
  }

  const score = calculateFloodRisk(record.kondisi as WeatherCondition, record.kelembapan);
  const level = calculateRiskLabel(score);
  const risk = getFloodRiskResult(score);
  const cond = getConditionConfig(record.kondisi);

  const levelColors: Record<string, string> = {
    AMAN: '#22c55e',
    WASPADA: '#eab308',
    SIAGA: '#f97316',
    BAHAYA: '#ef4444',
  };

  return `
    <div style="padding:16px;width:240px;font-family:system-ui,sans-serif;color:#e2e8f0;">
      <div style="display:flex;gap:8px;margin-bottom:12px;padding-bottom:12px;border-bottom:1px solid #334155;">
        <span style="font-size:20px;">${cond.icon}</span>
        <div>
          <p style="margin:0;font-weight:600;font-size:13px;">${location.name}</p>
          <p style="margin:2px 0 0;font-size:11px;color:#94a3b8;">${record.kondisi}</p>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px;">
        <div style="padding:8px;border-radius:8px;background:rgba(249,115,22,0.1);">
          <p style="margin:0 0 4px;font-size:10px;color:#fb923c;">Suhu</p>
          <p style="margin:0;font-weight:700;font-size:13px;font-family:monospace;">${record.suhu_c.toFixed(1)}°C</p>
        </div>
        <div style="padding:8px;border-radius:8px;background:rgba(59,130,246,0.1);">
          <p style="margin:0 0 4px;font-size:10px;color:#60a5fa;">Kelembapan</p>
          <p style="margin:0;font-weight:700;font-size:13px;font-family:monospace;">${record.kelembapan.toFixed(0)}%</p>
        </div>
      </div>
      <div style="padding:10px;border-radius:10px;margin-bottom:12px;background:${risk.color}14;border:1px solid ${risk.color}33;">
        <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
          <span style="font-size:10px;color:#94a3b8;">Skor Risiko</span>
          <span style="font-weight:700;font-size:13px;color:${risk.color};font-family:monospace;">${score}/100</span>
        </div>
        <div style="height:6px;border-radius:99px;background:rgba(255,255,255,0.1);">
          <div style="height:100%;width:${score}%;border-radius:99px;background:${risk.color};"></div>
        </div>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <span style="font-size:10px;color:#94a3b8;">Status</span>
        <span style="font-size:10px;font-weight:700;padding:2px 8px;border-radius:99px;background:${levelColors[level]}22;color:${levelColors[level]};border:1px solid ${levelColors[level]}55;">${level}</span>
      </div>
      <p style="margin:10px 0 0;padding-top:10px;border-top:1px solid #334155;font-size:10px;color:#64748b;">${formatDateTime(record.waktu)}</p>
    </div>
  `;
}
