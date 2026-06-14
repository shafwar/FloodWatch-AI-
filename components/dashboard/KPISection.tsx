'use client';

// =============================================================================
// FloodWatch Semarang — KPI Section
// Executive KPI cards grid using live weather store data
// =============================================================================

import { useMemo } from 'react';
import {
  MapPin, Bell, AlertTriangle, Thermometer,
  Droplets, RefreshCw
} from 'lucide-react';
import { KPICard } from './KPICard';
import { useWeatherStore } from '@/store/weatherStore';
import { useAlertStore } from '@/store/alertStore';
import { calculateFloodRisk, calculateRiskLabel } from '@/lib/floodRiskEngine';
import { MONITORING_LOCATIONS } from '@/lib/locations';
import { formatDateTime, average, cn } from '@/lib/utils';
import type { WeatherCondition } from '@/types';

interface KPISectionProps {
  compact?: boolean;
}

export function KPISection({ compact = false }: KPISectionProps) {
  const allRecords = useWeatherStore((s) => s.records);
  const records = useMemo(() => allRecords.filter((r) => r.keterangan === 'Saat Ini'), [allRecords]);
  const lastUpdate = useWeatherStore((s) => s.lastUpdate);
  const meta = useWeatherStore((s) => s.meta);
  const isLoading = useWeatherStore((s) => s.isLoading);
  const allAlerts = useAlertStore((s) => s.alerts);
  const activeAlerts = useMemo(() => allAlerts.filter((a) => a.status === 'active'), [allAlerts]);

  const kpis = useMemo(() => {
    const temps = records.map((r) => r.suhu_c);
    const humids = records.map((r) => r.kelembapan);

    const highRisk = records.filter((r) => {
      const score = calculateFloodRisk(r.kondisi as WeatherCondition, r.kelembapan);
      const level = calculateRiskLabel(score);
      return level === 'SIAGA' || level === 'BAHAYA';
    }).length;

    return {
      totalLocations: MONITORING_LOCATIONS.length,
      activeAlerts: activeAlerts.length,
      highRiskAreas: highRisk,
      avgTemperature: average(temps),
      avgHumidity: average(humids),
      lastUpdate: lastUpdate ? formatDateTime(lastUpdate) : '—',
    };
  }, [records, activeAlerts, lastUpdate]);

  return (
    <section
      aria-label="KPI Summary"
      className={cn(
        'grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6',
        compact ? 'gap-2.5' : 'gap-4'
      )}
    >
      <KPICard
        id="kpi-total-locations"
        index={0}
        title="Titik Pantau"
        value={kpis.totalLocations}
        subtitle="Aktif di Semarang"
        icon={MapPin}
        color="blue"
        trend={0}
        trendLabel="Stabil"
      />
      <KPICard
        id="kpi-active-alerts"
        index={1}
        title="Alert Aktif"
        value={kpis.activeAlerts}
        subtitle="Perlu perhatian"
        icon={Bell}
        color={kpis.activeAlerts > 3 ? 'red' : kpis.activeAlerts > 0 ? 'yellow' : 'green'}
        trend={kpis.activeAlerts > 0 ? 1 : 0}
        trendLabel={kpis.activeAlerts > 0 ? 'Aktif' : 'Aman'}
      />
      <KPICard
        id="kpi-high-risk"
        index={2}
        title="Area Risiko Tinggi"
        value={kpis.highRiskAreas}
        subtitle="SIAGA & BAHAYA"
        icon={AlertTriangle}
        color={kpis.highRiskAreas > 2 ? 'red' : kpis.highRiskAreas > 0 ? 'orange' : 'green'}
        trend={kpis.highRiskAreas > 0 ? 1 : -1}
        trendLabel={kpis.highRiskAreas > 0 ? 'Waspada' : 'Normal'}
      />
      <KPICard
        id="kpi-avg-temp"
        index={3}
        title="Suhu Rata-Rata"
        value={`${kpis.avgTemperature.toFixed(1)}°C`}
        subtitle="Seluruh titik pantau"
        icon={Thermometer}
        color="orange"
        trend={-1}
        trendLabel="Turun 1.2°"
      />
      <KPICard
        id="kpi-avg-humidity"
        index={4}
        title="Kelembapan Rata-Rata"
        value={`${kpis.avgHumidity.toFixed(0)}%`}
        subtitle="Indikator risiko utama"
        icon={Droplets}
        color={kpis.avgHumidity > 85 ? 'red' : kpis.avgHumidity > 75 ? 'yellow' : 'blue'}
        trend={kpis.avgHumidity > 85 ? 1 : 0}
        trendLabel={kpis.avgHumidity > 85 ? 'Tinggi' : 'Normal'}
      />
      <KPICard
        id="kpi-last-update"
        index={5}
        title="Sumber Data"
        value={
          isLoading
            ? '...'
            : meta?.bmkgStatus === 'online'
              ? 'BMKG'
              : meta?.bmkgStatus === 'degraded'
                ? 'Hybrid'
                : 'CSV'
        }
        subtitle={kpis.lastUpdate}
        icon={RefreshCw}
        color={meta?.bmkgStatus === 'online' ? 'green' : meta?.bmkgStatus === 'degraded' ? 'yellow' : 'orange'}
        trend={0}
        trendLabel={meta?.bmkgStatus === 'online' ? 'API Aktif' : 'Fallback'}
      />
    </section>
  );
}
