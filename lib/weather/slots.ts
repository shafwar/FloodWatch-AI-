// =============================================================================
// FloodWatch Semarang — BMKG 3-Hour Slot Utilities (WIB / Asia-Jakarta)
// =============================================================================

const WIB_TIMEZONE = 'Asia/Jakarta';
const SLOT_HOURS = 3;

/** Parse BMKG local_datetime string (WIB) e.g. "2026-06-13 09:00:00" */
export function parseBmkgLocalDatetime(localDatetime: string): Date {
  const [datePart, timePart] = localDatetime.trim().split(' ');
  return new Date(`${datePart}T${timePart}+07:00`);
}

/** Current time as a Date interpreted in WIB context */
export function nowInWib(): Date {
  return new Date(
    new Date().toLocaleString('en-US', { timeZone: WIB_TIMEZONE })
  );
}

/** Milliseconds until the next 3-hour slot boundary (00, 03, 06, … 21 WIB) */
export function msUntilNextSlotBoundary(from: Date = new Date()): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: WIB_TIMEZONE,
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false,
  }).formatToParts(from);

  const hour = Number(parts.find((p) => p.type === 'hour')?.value ?? 0);
  const minute = Number(parts.find((p) => p.type === 'minute')?.value ?? 0);
  const second = Number(parts.find((p) => p.type === 'second')?.value ?? 0);

  const currentMinutes = hour * 60 + minute;
  const slotMinutes = SLOT_HOURS * 60;
  const nextBoundaryMinutes =
    Math.floor(currentMinutes / slotMinutes) * slotMinutes + slotMinutes;

  const minutesUntil =
    nextBoundaryMinutes >= 24 * 60
      ? 24 * 60 - currentMinutes
      : nextBoundaryMinutes - currentMinutes;

  return Math.max((minutesUntil * 60 - second) * 1000, 60_000);
}

/** ISO string for the next 3-hour slot boundary in WIB */
export function nextSlotChangeIso(from: Date = new Date()): string {
  return new Date(from.getTime() + msUntilNextSlotBoundary(from)).toISOString();
}

export interface SlotBoundaries<T> {
  active: T;
  activeIndex: number;
  next: T | null;
  nextIndex: number | null;
}

/**
 * Pick the active 3-hour slot (latest slot whose time <= now)
 * and the next slot (+1 index, typically +3 hours).
 */
export function selectActiveAndNextSlot<T extends { local_datetime: string }>(
  slots: T[],
  now: Date = new Date()
): SlotBoundaries<T> | null {
  if (slots.length === 0) return null;

  const sorted = [...slots].sort(
    (a, b) =>
      parseBmkgLocalDatetime(a.local_datetime).getTime() -
      parseBmkgLocalDatetime(b.local_datetime).getTime()
  );

  const nowMs = now.getTime();
  let activeIndex = 0;

  for (let i = 0; i < sorted.length; i++) {
    const slotMs = parseBmkgLocalDatetime(sorted[i].local_datetime).getTime();
    if (slotMs <= nowMs) activeIndex = i;
    else break;
  }

  const nextIndex = activeIndex + 1 < sorted.length ? activeIndex + 1 : null;

  return {
    active: sorted[activeIndex],
    activeIndex,
    next: nextIndex !== null ? sorted[nextIndex] : null,
    nextIndex,
  };
}
