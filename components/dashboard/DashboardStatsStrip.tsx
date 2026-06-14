'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin, Bell, AlertTriangle, Thermometer, Droplets, Radio,
} from 'lucide-react';
import { useWeatherStore } from '@/store/weatherStore';
import { useAlertStore } from '@/store/alertStore';
import { calculateFloodRisk, calculateRiskLabel } from '@/lib/floodRiskEngine';
import { MONITORING_LOCATIONS } from '@/lib/locations';
import { average, cn } from '@/lib/utils';
import type { WeatherCondition } from '@/types';

const spring = { type: 'spring' as const, stiffness: 400, damping: 32 };

export function DashboardStatsStrip() {
  const allRecords = useWeatherStore((s) => s.records);
  const records = useMemo(() => allRecords.filter((r) => r.keterangan === 'Saat Ini'), [allRecords]);
  const meta = useWeatherStore((s) => s.meta);
  const alerts = useAlertStore((s) => s.alerts);
  const activeAlertCount = useMemo(
    () => alerts.filter((a) => a.status === 'active').length,
    [alerts]
  );

  const stats = useMemo(() => {
    const highRisk = records.filter((r) => {
      const score = calculateFloodRisk(r.kondisi as WeatherCondition, r.kelembapan);
      const level = calculateRiskLabel(score);
      return level === 'SIAGA' || level === 'BAHAYA';
    }).length;

    return [
      {
        icon: MapPin,
        label: 'Titik Pantau',
        value: String(MONITORING_LOCATIONS.length),
        accent: 'text-blue-400',
        bg: 'bg-blue-500/10 hover:bg-blue-500/15',
      },
      {
        icon: Bell,
        label: 'Alert',
        value: String(activeAlertCount),
        accent: activeAlertCount > 0 ? 'text-yellow-400' : 'text-green-400',
        bg: activeAlertCount > 0 ? 'bg-yellow-500/10 hover:bg-yellow-500/15' : 'bg-green-500/10 hover:bg-green-500/15',
      },
      {
        icon: AlertTriangle,
        label: 'Risiko Tinggi',
        value: String(highRisk),
        accent: highRisk > 0 ? 'text-orange-400' : 'text-green-400',
        bg: highRisk > 0 ? 'bg-orange-500/10 hover:bg-orange-500/15' : 'bg-green-500/10 hover:bg-green-500/15',
      },
      {
        icon: Thermometer,
        label: 'Suhu',
        value: `${average(records.map((r) => r.suhu_c)).toFixed(1)}°`,
        accent: 'text-orange-400',
        bg: 'bg-orange-500/10 hover:bg-orange-500/15',
      },
      {
        icon: Droplets,
        label: 'Kelembapan',
        value: `${average(records.map((r) => r.kelembapan)).toFixed(0)}%`,
        accent: 'text-cyan-400',
        bg: 'bg-cyan-500/10 hover:bg-cyan-500/15',
      },
      {
        icon: Radio,
        label: 'Sumber',
        value: meta?.bmkgStatus === 'online' ? 'BMKG' : meta?.bmkgStatus === 'degraded' ? 'Hybrid' : 'CSV',
        accent: meta?.bmkgStatus === 'online' ? 'text-green-400' : 'text-yellow-400',
        bg: meta?.bmkgStatus === 'online' ? 'bg-green-500/10 hover:bg-green-500/15' : 'bg-yellow-500/10 hover:bg-yellow-500/15',
      },
    ];
  }, [records, activeAlertCount, meta]);

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin snap-x snap-mandatory">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: i * 0.04 }}
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              'flex items-center gap-2.5 shrink-0 snap-start',
              'rounded-xl border border-border/60 px-3.5 py-2',
              'transition-colors duration-200 cursor-default',
              stat.bg
            )}
          >
            <Icon size={15} className={cn('shrink-0', stat.accent)} />
            <div className="min-w-0">
              <p className={cn('text-sm font-bold leading-none', stat.accent)}>{stat.value}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5 whitespace-nowrap">{stat.label}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
