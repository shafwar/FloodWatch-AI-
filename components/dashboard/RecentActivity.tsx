'use client';

// =============================================================================
// FloodWatch Semarang — Recent Activity Feed
// Shows latest alerts and weather updates in a timeline
// =============================================================================

import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CloudRain, CheckCircle, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useAlertStore } from '@/store/alertStore';
import { timeAgo } from '@/lib/utils';
import { cn } from '@/lib/utils';
import type { AlertSeverity } from '@/types';

const SEVERITY_CONFIG: Record<AlertSeverity, { color: string; bgColor: string; icon: typeof AlertTriangle }> = {
  emergency: { color: 'text-red-400',    bgColor: 'bg-red-500/10',    icon: AlertTriangle },
  critical:  { color: 'text-orange-400', bgColor: 'bg-orange-500/10', icon: CloudRain },
  warning:   { color: 'text-yellow-400', bgColor: 'bg-yellow-500/10', icon: CloudRain },
  information: { color: 'text-blue-400', bgColor: 'bg-blue-500/10',   icon: CheckCircle },
};

export function RecentActivity() {
  const alerts = useAlertStore((s) => s.alerts);
  const recentAlerts = alerts.slice(0, 8);

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden h-full flex flex-col">
      <div className="p-5 border-b border-border flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-foreground">Aktivitas Terbaru</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Alert & pembaruan sistem</p>
        </div>
        <Link
          href="/alerts"
          className="flex items-center gap-1 text-xs text-primary hover:underline"
        >
          Lihat semua
          <ArrowRight size={12} />
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-1">
        <AnimatePresence>
          {recentAlerts.map((alert, idx) => {
            const config = SEVERITY_CONFIG[alert.severity];
            const Icon = config.icon;

            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.06 }}
                className={cn(
                  'flex items-start gap-3 p-3 rounded-xl transition-colors',
                  'hover:bg-muted/30 cursor-default group',
                  !alert.read && 'bg-primary/5'
                )}
              >
                {/* Icon */}
                <div className={cn('p-1.5 rounded-lg shrink-0 mt-0.5', config.bgColor)}>
                  <Icon size={13} className={config.color} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground leading-snug truncate">
                    {alert.daerah}
                  </p>
                  <p className="text-[11px] text-muted-foreground leading-snug line-clamp-2 mt-0.5">
                    {alert.message}
                  </p>
                </div>

                {/* Time + unread dot */}
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Clock size={9} />
                    {timeAgo(alert.timestamp)}
                  </div>
                  {!alert.read && (
                    <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
