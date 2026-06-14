'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, MapPin, Thermometer, Droplets, Cloud, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AnalysisPhase } from '@/store/chatFlowStore';
import type { FloodLevel } from '@/types';

const LEVEL_STYLES: Record<
  FloodLevel,
  { ring: string; text: string; badge: string; bar: string; glow: string }
> = {
  AMAN: {
    ring: 'border-green-500/50',
    text: 'text-green-400',
    badge: 'bg-green-500/15 text-green-400 border-green-500/30',
    bar: 'bg-green-500/50',
    glow: 'shadow-[0_0_48px_rgba(34,197,94,0.18)]',
  },
  WASPADA: {
    ring: 'border-yellow-500/50',
    text: 'text-yellow-400',
    badge: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
    bar: 'bg-yellow-500/50',
    glow: 'shadow-[0_0_48px_rgba(234,179,8,0.18)]',
  },
  SIAGA: {
    ring: 'border-orange-500/50',
    text: 'text-orange-400',
    badge: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
    bar: 'bg-orange-500/50',
    glow: 'shadow-[0_0_48px_rgba(249,115,22,0.18)]',
  },
  BAHAYA: {
    ring: 'border-red-500/50',
    text: 'text-red-400',
    badge: 'bg-red-500/15 text-red-400 border-red-500/30',
    bar: 'bg-red-500/50',
    glow: 'shadow-[0_0_48px_rgba(239,68,68,0.22)]',
  },
};

interface MapAnalysisOverlayProps {
  phase: AnalysisPhase;
  locationName: string;
  riskLevel: FloodLevel;
  riskScore: number;
  kondisi: string;
  suhu: number;
  kelembapan: number;
  slotLabel: string;
}

export function MapAnalysisOverlay({
  phase,
  locationName,
  riskLevel,
  riskScore,
  kondisi,
  suhu,
  kelembapan,
  slotLabel,
}: MapAnalysisOverlayProps) {
  const styles = LEVEL_STYLES[riskLevel];
  const isAnalyzing = phase === 'analyzing';
  const showResult = phase === 'result';

  if (phase === 'scanning') return null;

  return (
    <div className="absolute inset-0 z-[800] pointer-events-none">
      {/* Scrim — redupkan peta & sembunyikan elemen yang bentrok */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 bg-background/55 backdrop-blur-[3px]"
      />

      {/* Chip lokasi di atas */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-5 left-1/2 -translate-x-1/2 z-10"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/90 backdrop-blur-md px-4 py-2 shadow-lg">
          <Shield size={14} className="text-primary shrink-0" />
          <span className="text-xs font-medium text-foreground">Analisis Lokasi</span>
          <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
          <span className="text-xs text-muted-foreground flex items-center gap-1 max-w-[200px] sm:max-w-none truncate">
            <MapPin size={11} className="shrink-0" />
            {locationName}
          </span>
        </div>
      </motion.div>

      {/* Panel utama */}
      <div className="absolute inset-0 flex items-center justify-center p-6 pt-20">
        <AnimatePresence mode="wait">
          {isAnalyzing && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0, scale: 0.94, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -6 }}
              transition={{ duration: 0.35 }}
              className="w-full max-w-sm rounded-2xl border border-border/60 bg-background/95 backdrop-blur-xl shadow-2xl overflow-hidden"
            >
              <div className="h-1 w-full bg-gradient-to-r from-primary/20 via-primary to-primary/20 animate-pulse" />
              <div className="flex flex-col items-center gap-5 px-6 py-8">
                <div className="relative">
                  <div className="w-14 h-14 rounded-full border-2 border-primary/25 flex items-center justify-center bg-primary/5">
                    <Loader2 size={24} className="text-primary animate-spin" />
                  </div>
                  <span className="absolute inset-0 rounded-full border border-primary/15 animate-ping" />
                </div>
                <div className="text-center space-y-1">
                  <p className="text-sm font-semibold text-foreground">Menganalisis risiko banjir</p>
                  <p className="text-xs text-foreground/70">Memproses data BMKG slot 3 jam...</p>
                </div>
              </div>
            </motion.div>
          )}

          {showResult && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.92, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: -8 }}
              transition={{ type: 'spring', stiffness: 340, damping: 28 }}
              className={cn(
                'w-full max-w-md rounded-2xl border bg-background/95 backdrop-blur-xl shadow-2xl overflow-hidden',
                styles.ring,
                styles.glow
              )}
            >
              <div className={cn('h-1 w-full', styles.bar)} />

              <div className="px-6 pt-6 pb-5 space-y-5">
                <div className="text-center space-y-2">
                  <span
                    className={cn(
                      'inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-wider',
                      styles.badge
                    )}
                  >
                    Hasil Analisis
                  </span>
                  <p className="text-sm font-medium text-foreground">{locationName}</p>
                </div>

                <div className="flex flex-col items-center gap-2">
                  <div
                    className={cn(
                      'flex flex-col items-center justify-center w-24 h-24 rounded-full border-[3px]',
                      styles.ring,
                      'bg-background/80'
                    )}
                  >
                    <span className={cn('text-xl font-bold tracking-tight', styles.text)}>
                      {riskLevel}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Skor risiko <span className="font-semibold text-foreground">{riskScore}</span>/100
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="rounded-xl border border-border/50 bg-muted/20 px-2 py-2.5 text-center">
                    <Cloud size={14} className="mx-auto text-sky-400 mb-1.5" />
                    <p className="text-[10px] text-muted-foreground">Cuaca</p>
                    <p className="text-xs font-medium truncate mt-0.5">{kondisi}</p>
                  </div>
                  <div className="rounded-xl border border-border/50 bg-muted/20 px-2 py-2.5 text-center">
                    <Thermometer size={14} className="mx-auto text-orange-400 mb-1.5" />
                    <p className="text-[10px] text-muted-foreground">Suhu</p>
                    <p className="text-xs font-medium mt-0.5">{suhu}°C</p>
                  </div>
                  <div className="rounded-xl border border-border/50 bg-muted/20 px-2 py-2.5 text-center">
                    <Droplets size={14} className="mx-auto text-cyan-400 mb-1.5" />
                    <p className="text-[10px] text-muted-foreground">Kelembapan</p>
                    <p className="text-xs font-medium mt-0.5">{kelembapan}%</p>
                  </div>
                </div>

                <p className="text-center text-[10px] text-muted-foreground/80">BMKG · {slotLabel}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
