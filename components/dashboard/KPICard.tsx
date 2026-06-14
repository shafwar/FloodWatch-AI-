'use client';

// =============================================================================
// FloodWatch Semarang — KPI Card Component
// Animated executive KPI card with mini trend indicator
// =============================================================================

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KPICardProps {
  id: string;
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: number;          // positive = up, negative = down, 0 = stable
  trendLabel?: string;
  color?: 'blue' | 'green' | 'yellow' | 'orange' | 'red' | 'purple';
  isLoading?: boolean;
  className?: string;
  index?: number;
}

const COLOR_MAP = {
  blue:   { icon: 'text-blue-400',   bg: 'bg-blue-500/10',   border: 'border-blue-500/20',   glow: 'hover:shadow-blue-500/10' },
  green:  { icon: 'text-green-400',  bg: 'bg-green-500/10',  border: 'border-green-500/20',  glow: 'hover:shadow-green-500/10' },
  yellow: { icon: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', glow: 'hover:shadow-yellow-500/10' },
  orange: { icon: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', glow: 'hover:shadow-orange-500/10' },
  red:    { icon: 'text-red-400',    bg: 'bg-red-500/10',    border: 'border-red-500/20',    glow: 'hover:shadow-red-500/10' },
  purple: { icon: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', glow: 'hover:shadow-purple-500/10' },
};

export function KPICard({
  id, title, value, subtitle, icon: Icon, trend, trendLabel, color = 'blue', isLoading, className, index = 0
}: KPICardProps) {
  const colors = COLOR_MAP[color];
  const TrendIcon = trend === undefined || trend === 0 ? Minus : trend > 0 ? TrendingUp : TrendingDown;
  const trendColor = trend === undefined || trend === 0 ? 'text-muted-foreground' : trend > 0 ? 'text-green-400' : 'text-red-400';

  if (isLoading) {
    return (
      <div className={cn(
        'rounded-2xl border bg-card p-5 animate-pulse',
        'border-border',
        className
      )}>
        <div className="flex items-start justify-between mb-4">
          <div className="w-10 h-10 rounded-xl bg-muted" />
          <div className="w-16 h-5 rounded-md bg-muted" />
        </div>
        <div className="w-24 h-8 rounded-md bg-muted mb-1" />
        <div className="w-32 h-4 rounded-md bg-muted" />
      </div>
    );
  }

  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07, ease: 'easeOut' }}
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      className={cn(
        'rounded-2xl border bg-card p-5',
        'transition-shadow duration-300 cursor-default group',
        `hover:shadow-xl ${colors.glow}`,
        'border-border hover:border-opacity-60',
        className
      )}
    >
      <div className="flex items-start justify-between mb-3">
        {/* Icon */}
        <div className={cn('p-2.5 rounded-xl transition-transform duration-200 group-hover:scale-110', colors.bg)}>
          <Icon size={20} className={colors.icon} />
        </div>

        {/* Trend */}
        {trend !== undefined && (
          <div className={cn('flex items-center gap-1 text-[11px] font-medium', trendColor)}>
            <TrendIcon size={12} />
            <span>{trendLabel ?? `${Math.abs(trend)}%`}</span>
          </div>
        )}
      </div>

      {/* Value */}
      <motion.div
        key={String(value)}
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <p className="text-2xl font-bold text-foreground tracking-tight leading-none mb-1">
          {value}
        </p>
        <p className="text-xs text-muted-foreground leading-tight">{title}</p>
        {subtitle && (
          <p className="text-[11px] text-muted-foreground/70 mt-0.5 leading-tight">{subtitle}</p>
        )}
      </motion.div>
    </motion.div>
  );
}
