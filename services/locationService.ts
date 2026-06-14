// =============================================================================
// FloodWatch Semarang — Location Service
// =============================================================================

import { MONITORING_LOCATIONS, LOCATION_MAP } from '@/lib/locations';
import type { MonitoringLocation } from '@/types';

export function getAllLocations(): MonitoringLocation[] {
  return MONITORING_LOCATIONS;
}

export function getLocationById(id: string): MonitoringLocation | undefined {
  return LOCATION_MAP[id];
}

export function getLocationByName(name: string): MonitoringLocation | undefined {
  return MONITORING_LOCATIONS.find((l) => l.name === name);
}

export function searchLocations(query: string): MonitoringLocation[] {
  const q = query.toLowerCase();
  return MONITORING_LOCATIONS.filter(
    (l) =>
      l.name.toLowerCase().includes(q) ||
      l.kelurahan.toLowerCase().includes(q) ||
      l.district.toLowerCase().includes(q)
  );
}
