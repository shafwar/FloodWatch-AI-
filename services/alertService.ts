// =============================================================================
// FloodWatch Semarang — Alert Service
// =============================================================================

import type { FloodAlert } from '@/types';
import { MOCK_ALERTS } from '@/data/mockAlerts';

// const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? '/api';

export async function fetchAlerts(): Promise<FloodAlert[]> {
  await delay(150);
  return MOCK_ALERTS;
}

export async function fetchActiveAlerts(): Promise<FloodAlert[]> {
  await delay(100);
  return MOCK_ALERTS.filter((a) => a.status === 'active');
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function acknowledgeAlert(_id: string): Promise<void> {
  await delay(50);
  // In production: PUT `${API_BASE}/alerts/${id}/acknowledge`
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function resolveAlert(_id: string): Promise<void> {
  await delay(50);
  // In production: PUT `${API_BASE}/alerts/${id}/resolve`
}

function delay(ms: number): Promise<void> {
  return new Promise((res) => setTimeout(res, ms));
}
