'use client';

// =============================================================================
// FloodWatch Semarang — Active Data Source Indicator
// Shows when system is on CSV fallback or hybrid mode; auto-updates on recovery
// =============================================================================

import { motion, AnimatePresence } from 'framer-motion';
import { Database, CloudOff, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useWeatherStore } from '@/store/weatherStore';
import { cn } from '@/lib/utils';

export function DataSourceBanner() {
  const meta = useWeatherStore((s) => s.meta);
  const isLoading = useWeatherStore((s) => s.isLoading);
  const activeSource = useWeatherStore((s) => s.activeSource);

  if (!meta || isLoading) return null;

  const isOnline = meta.bmkgStatus === 'online';

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={meta.bmkgStatus}
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        className={cn(
          'mb-4 rounded-xl border px-4 py-2.5 flex items-center gap-3 text-sm',
          isOnline
            ? 'border-green-500/20 bg-green-500/5 text-green-400'
            : meta.bmkgStatus === 'degraded'
              ? 'border-yellow-500/20 bg-yellow-500/5 text-yellow-400'
              : 'border-orange-500/20 bg-orange-500/5 text-orange-400'
        )}
      >
        {isOnline ? (
          <CheckCircle2 size={16} className="shrink-0" />
        ) : meta.bmkgStatus === 'degraded' ? (
          <Database size={16} className="shrink-0" />
        ) : (
          <CloudOff size={16} className="shrink-0" />
        )}

        <div className="flex-1 min-w-0">
          <p className="font-medium leading-tight">
            {isOnline
              ? 'Sumber data aktif: API BMKG'
              : meta.bmkgStatus === 'degraded'
                ? 'Mode hybrid: BMKG + CSV cadangan'
                : 'Sumber data aktif: CSV cadangan (BMKG tidak tersedia)'}
          </p>
          <p className="text-xs opacity-80 mt-0.5">
            {isOnline
              ? `${meta.locationsOnline}/${meta.locationsTotal} lokasi · Slot 3 jam WIB`
              : meta.nextRetryAt
                ? `Monitoring recovery aktif · Cek ulang BMKG otomatis setiap 5 menit`
                : 'Mencoba menghubungkan ke BMKG...'}
          </p>
        </div>

        {!isOnline && (
          <div className="flex items-center gap-1.5 text-xs opacity-70 shrink-0">
            <RefreshCw size={12} className="animate-spin" />
            <span>Recovery</span>
          </div>
        )}

        <span className="text-[10px] font-mono uppercase tracking-wide opacity-60 shrink-0 hidden sm:inline">
          {activeSource ?? meta.source}
        </span>
      </motion.div>
    </AnimatePresence>
  );
}
