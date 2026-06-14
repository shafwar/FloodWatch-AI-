'use client';

// =============================================================================
// FloodWatch Semarang — Forecast Panel
// Displays 5 forecast windows: -1h, Now, +1h, +3h, +6h per location
// =============================================================================

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { useWeatherStore } from '@/store/weatherStore';
import { calculateFloodRisk, calculateRiskLabel, getFloodRiskResult } from '@/lib/floodRiskEngine';
import { getConditionConfig } from '@/lib/weatherConditions';
import { MONITORING_LOCATIONS } from '@/lib/locations';
import { formatTime } from '@/lib/utils';
import { RiskBadge } from '@/components/shared/RiskBadge';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import type { WeatherCondition } from '@/types';
import { cn } from '@/lib/utils';

const WINDOW_ORDER = ['Saat Ini', '3 Jam Kedepan'];

interface ForecastPanelProps {
  compact?: boolean;
}

export function ForecastPanel({ compact = false }: ForecastPanelProps) {
  const [selectedLocation, setSelectedLocation] = useState(MONITORING_LOCATIONS[0].id);

  const selectedLoc = MONITORING_LOCATIONS.find((l) => l.id === selectedLocation)!;

  const allRecords = useWeatherStore((s) => s.records);

  const forecastData = useMemo(() => {
    const locRecords = allRecords.filter((r) => r.daerah === selectedLoc.name);
    return WINDOW_ORDER.map((ket) => {
      const record = locRecords.find((r) => r.keterangan === ket) ?? locRecords[0];
      if (!record) return null;
      const score = calculateFloodRisk(record.kondisi as WeatherCondition, record.kelembapan);
      const level = calculateRiskLabel(score);
      const riskResult = getFloodRiskResult(score);
      const condConfig = getConditionConfig(record.kondisi);
      return { keterangan: ket, record, score, level, riskResult, condConfig };
    }).filter(Boolean);
  }, [selectedLoc, allRecords]);

  const currentData = forecastData.find((f) => f!.keterangan === 'Saat Ini');

  return (
    <div className={cn('rounded-2xl border border-border bg-card overflow-hidden flex flex-col', compact ? 'h-full' : '')}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-semibold text-foreground">Prakiraan Cuaca</h3>
            <p className="text-xs text-muted-foreground">Data BMKG · Slot 3 jam (WIB)</p>
          </div>
          {currentData && (
            <RiskBadge level={currentData.level} size="sm" />
          )}
        </div>
        <Select value={selectedLocation} onValueChange={(v) => { if (v) setSelectedLocation(v); }}>
          <SelectTrigger className="h-8 text-xs w-full" id="forecast-location-select">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {MONITORING_LOCATIONS.map((loc) => (
              <SelectItem key={loc.id} value={loc.id} className="text-xs">
                {loc.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Forecast Windows */}
      <div className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-thin">
        <AnimatePresence mode="wait">
          {forecastData.map((item, idx) => {
            if (!item) return null;
            const isNow = item.keterangan === 'Saat Ini';

            return (
              <motion.div
                key={`${selectedLocation}-${item.keterangan}`}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.07 }}
                className={cn(
                  'relative p-3 rounded-xl border transition-colors',
                  isNow
                    ? 'border-primary/30 bg-primary/5'
                    : 'border-border bg-muted/10 hover:bg-muted/20'
                )}
              >
                {isNow && (
                  <div className="absolute top-2 right-2">
                    <span className="text-[9px] bg-primary text-primary-foreground rounded px-1.5 py-0.5 font-semibold">
                      NOW
                    </span>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  {/* Time window label */}
                  <div className="shrink-0 min-w-[72px]">
                    <p className="text-[10px] text-muted-foreground">{item.keterangan}</p>
                    <p className="text-[10px] font-mono text-muted-foreground/70">
                      {formatTime(item.record.waktu)}
                    </p>
                  </div>

                  {/* Icon + condition */}
                  <div className="flex items-center gap-1.5 flex-1">
                    <span className="text-lg">{item.condConfig.icon}</span>
                    <div>
                      <p className="text-xs font-medium leading-tight">{item.record.kondisi}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {item.record.suhu_c.toFixed(0)}°C · {item.record.kelembapan.toFixed(0)}%
                      </p>
                    </div>
                  </div>

                  {/* Risk */}
                  <div className="flex flex-col items-end gap-1">
                    <RiskBadge level={item.level} size="sm" />
                    <div className="w-16 h-1 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${item.score}%`,
                          backgroundColor: item.riskResult.color,
                          transition: 'width 0.6s ease'
                        }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
