'use client';

// =============================================================================
// FloodWatch Semarang — Risk Legend Component
// Floating map legend showing flood level color codes
// =============================================================================

import { motion } from 'framer-motion';
import { FLOOD_LEVELS } from '@/lib/floodRiskEngine';

export function RiskLegend() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="fw-glass rounded-xl p-3 space-y-1.5 min-w-[140px]"
    >
      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
        Legenda Risiko
      </p>
      {FLOOD_LEVELS.map((lvl) => (
        <div key={lvl.level} className="flex items-center gap-2.5">
          <div
            className="w-3 h-3 rounded-sm shrink-0"
            style={{
              backgroundColor: lvl.color,
              boxShadow: `0 0 6px ${lvl.color}66`,
            }}
          />
          <span className="text-[11px] font-medium" style={{ color: lvl.color }}>
            {lvl.level}
          </span>
          <span className="text-[10px] text-muted-foreground ml-auto">
            {lvl.min}–{lvl.max}
          </span>
        </div>
      ))}
      <div className="pt-2 mt-1 border-t border-border/40">
        <p className="text-[9px] text-muted-foreground">
          ● Skor = Kondisi + Kelembapan
        </p>
      </div>
    </motion.div>
  );
}
