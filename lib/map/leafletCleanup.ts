// =============================================================================
// FloodWatch Semarang — Leaflet Container Cleanup Utilities
// =============================================================================

import type { Map as LeafletMap } from 'leaflet';

type LeafletElement = HTMLElement & { _leaflet_id?: number };

export function releaseLeafletContainer(container: HTMLElement | null): void {
  if (!container) return;
  container.innerHTML = '';
  delete (container as LeafletElement)._leaflet_id;
}

export function destroyLeafletMap(
  map: LeafletMap | null,
  container: HTMLElement | null
): void {
  if (map) {
    try {
      map.off();
      map.remove();
    } catch {
      // Map may already be removed during fast refresh
    }
  }
  releaseLeafletContainer(container);
}
