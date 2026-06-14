'use client';

// =============================================================================
// FloodWatch Semarang — Dashboard Mini Map (dynamic import wrapper)
// Leaflet needs dynamic import to avoid SSR issues
// =============================================================================

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ExternalLink, Map } from 'lucide-react';
import { cn } from '@/lib/utils';

const FloodMap = dynamic(
  () => import('@/components/map/FloodMap').then((m) => ({ default: m.FloodMap })),
  {
    ssr: false,
    loading: () => (
      <div className="h-full flex items-center justify-center bg-muted/20 rounded-xl">
        <div className="text-center space-y-2">
          <Map size={32} className="text-muted-foreground mx-auto" />
          <p className="text-sm text-muted-foreground">Memuat peta...</p>
        </div>
      </div>
    ),
  }
);

interface DashboardMiniMapProps {
  fill?: boolean;
  height?: number;
  className?: string;
}

export function DashboardMiniMap({ fill = false, height = 420, className }: DashboardMiniMapProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-border/60 bg-card/50 overflow-hidden flex flex-col',
        !fill && !height && 'h-[420px]',
        className
      )}
      style={!fill && height ? { height } : undefined}
    >
      {/* Map toolbar */}
      <div className="px-3 py-2 border-b border-border/40 flex items-center justify-end">
        <Link
          href="/map"
          className="inline-flex items-center gap-1.5 h-7 px-2.5 text-[11px] font-medium rounded-full border border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
        >
          <ExternalLink size={11} />
          Peta penuh
        </Link>
      </div>

      {/* Map */}
      <div className={cn('flex-1 min-h-0', !fill && height && 'h-[calc(100%-37px)]', !fill && !height && 'h-[calc(100%-69px)]')}>
        <FloodMap height="100%" showLegend={true} instanceId="dashboard" interactive />
      </div>
    </div>
  );
}
