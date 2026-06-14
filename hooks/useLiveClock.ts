'use client';

import { useEffect, useState } from 'react';

const WIB_TIMEZONE = 'Asia/Jakarta';

function formatWib(date: Date, timeZone: string): string {
  return date.toLocaleString('id-ID', {
    timeZone,
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export function useLiveClock(timeZone = WIB_TIMEZONE) {
  // null sampai mount — hindari hydration mismatch (waktu SSR ≠ klien)
  const [formatted, setFormatted] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => setFormatted(formatWib(new Date(), timeZone));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [timeZone]);

  return { formatted, timeZone, isReady: formatted !== null };
}
