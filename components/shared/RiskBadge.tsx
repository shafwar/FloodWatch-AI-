'use client';

// =============================================================================
// FloodWatch Semarang — Risk Badge Component
// Reusable badge displaying flood risk level with color coding
// =============================================================================

import { cn } from '@/lib/utils';
import type { FloodLevel } from '@/types';

interface RiskBadgeProps {
  level: FloodLevel;
  score?: number;
  size?: 'sm' | 'md' | 'lg';
  showScore?: boolean;
  pulse?: boolean;
  className?: string;
}

const LEVEL_CONFIG: Record<FloodLevel, {
  label: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
  dotColor: string;
}> = {
  AMAN:    { label: 'AMAN',    bgClass: 'bg-green-500/15',  textClass: 'text-green-400',  borderClass: 'border-green-500/40',  dotColor: '#22c55e' },
  WASPADA: { label: 'WASPADA', bgClass: 'bg-yellow-500/15', textClass: 'text-yellow-400', borderClass: 'border-yellow-500/40', dotColor: '#eab308' },
  SIAGA:   { label: 'SIAGA',   bgClass: 'bg-orange-500/15', textClass: 'text-orange-400', borderClass: 'border-orange-500/40', dotColor: '#f97316' },
  BAHAYA:  { label: 'BAHAYA',  bgClass: 'bg-red-500/15',    textClass: 'text-red-400',    borderClass: 'border-red-500/40',    dotColor: '#ef4444' },
};

const SIZE_CLASS = {
  sm: 'text-[10px] px-1.5 py-0.5 gap-1',
  md: 'text-xs px-2.5 py-1 gap-1.5',
  lg: 'text-sm px-3 py-1.5 gap-2',
};

export function RiskBadge({ level, score, size = 'md', showScore = false, pulse = false, className }: RiskBadgeProps) {
  const config = LEVEL_CONFIG[level];

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border font-semibold tracking-wide',
        config.bgClass,
        config.textClass,
        config.borderClass,
        SIZE_CLASS[size],
        pulse && level === 'BAHAYA' && 'pulse-red',
        className
      )}
    >
      <span
        className="rounded-full shrink-0"
        style={{
          width: size === 'sm' ? 5 : size === 'lg' ? 8 : 6,
          height: size === 'sm' ? 5 : size === 'lg' ? 8 : 6,
          backgroundColor: config.dotColor,
          boxShadow: `0 0 6px ${config.dotColor}88`,
        }}
      />
      {config.label}
      {showScore && score !== undefined && (
        <span className="opacity-70 font-normal">({score})</span>
      )}
    </span>
  );
}
