'use client';

import { useLiveClock } from '@/hooks/useLiveClock';

/** Placeholder dengan lebar mirip output asli — cegah layout shift */
const CLOCK_PLACEHOLDER = '— — —, --.--.--';

export function LiveClock() {
  const { formatted, isReady } = useLiveClock();

  return (
    <div className="hidden md:flex items-center gap-1.5 text-xs text-muted-foreground tabular-nums">
      <div className="live-dot" />
      <span
        className="min-w-[10.5rem] inline-block"
        aria-live="off"
        aria-busy={!isReady}
      >
        {formatted ?? CLOCK_PLACEHOLDER}
      </span>
      <span className="text-[10px] text-muted-foreground/60">WIB</span>
    </div>
  );
}
