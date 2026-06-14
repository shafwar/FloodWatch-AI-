'use client';

import { useMemo } from 'react';
import { MapPin, Thermometer, Droplets } from 'lucide-react';
import { useWeatherStore } from '@/store/weatherStore';
import { calculateFloodRisk, calculateRiskLabel } from '@/lib/floodRiskEngine';
import { getConditionConfig } from '@/lib/weatherConditions';
import { RiskBadge } from '@/components/shared/RiskBadge';
import { cn } from '@/lib/utils';
import type { WeatherCondition } from '@/types';

export function LocationGrid() {
  const allRecords = useWeatherStore((s) => s.records);
  const isLoading = useWeatherStore((s) => s.isLoading);

  const locations = useMemo(() => {
    const current = allRecords.filter((r) => r.keterangan === 'Saat Ini');
    return current.map((r) => {
      const score = calculateFloodRisk(r.kondisi as WeatherCondition, r.kelembapan);
      const level = calculateRiskLabel(score);
      const cond = getConditionConfig(r.kondisi);
      return { ...r, score, level, cond };
    });
  }, [allRecords]);

  return (
    <div className="rounded-2xl border border-border/60 bg-card/50 overflow-hidden">
      {isLoading && locations.length === 0 ? (
        <div className="p-8 text-center text-sm text-muted-foreground">Memuat data...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-border/30">
          {locations.map((loc) => (
            <div
              key={loc.daerah}
              className={cn(
                'bg-card px-4 py-3.5 flex flex-col gap-2',
                'hover:bg-muted/30 transition-colors duration-200'
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2 min-w-0">
                  <MapPin size={14} className="text-primary shrink-0 mt-0.5" />
                  <p className="text-sm font-medium text-foreground leading-snug truncate">
                    {loc.daerah}
                  </p>
                </div>
                <RiskBadge level={loc.level} size="sm" />
              </div>

              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className={cn('flex items-center gap-1', loc.cond.textColor)}>
                  <span>{loc.cond.icon}</span>
                  {loc.kondisi}
                </span>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Thermometer size={12} className="text-orange-400" />
                  {loc.suhu_c}°C
                </span>
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Droplets size={12} className="text-cyan-400" />
                  {loc.kelembapan}%
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
