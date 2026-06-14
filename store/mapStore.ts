// =============================================================================
// FloodWatch Semarang — Map Store (Zustand)
// =============================================================================

import { create } from 'zustand';
import type { MonitoringLocation } from '@/types';
import { SEMARANG_CENTER, DEFAULT_ZOOM } from '@/lib/locations';

export interface DashboardMapFocus {
  locationIds: string[];
  primaryId: string | null;
  scanning: boolean;
}

interface MapState {
  center: [number, number];
  zoom: number;
  selectedLocation: MonitoringLocation | null;
  hoveredLocation: MonitoringLocation | null;
  mapStyle: 'standard' | 'satellite' | 'terrain';
  showClusters: boolean;
  showRiskHeatmap: boolean;
  dashboardFocus: DashboardMapFocus | null;

  // Actions
  setCenter: (center: [number, number]) => void;
  setZoom: (zoom: number) => void;
  setSelectedLocation: (location: MonitoringLocation | null) => void;
  setHoveredLocation: (location: MonitoringLocation | null) => void;
  flyTo: (center: [number, number], zoom?: number) => void;
  setMapStyle: (style: 'standard' | 'satellite' | 'terrain') => void;
  toggleClusters: () => void;
  toggleHeatmap: () => void;
  resetView: () => void;
  setDashboardFocus: (focus: DashboardMapFocus | null) => void;
  setDashboardScanning: (scanning: boolean) => void;
  clearDashboardFocus: () => void;
}

export const useMapStore = create<MapState>()((set) => ({
  center: SEMARANG_CENTER,
  zoom: DEFAULT_ZOOM,
  selectedLocation: null,
  hoveredLocation: null,
  mapStyle: 'standard',
  showClusters: false,
  showRiskHeatmap: false,
  dashboardFocus: null,

  setCenter: (center) => set({ center }),
  setZoom: (zoom) => set({ zoom }),
  setSelectedLocation: (location) => set({ selectedLocation: location }),
  setHoveredLocation: (location) => set({ hoveredLocation: location }),
  flyTo: (center, zoom) => set({ center, zoom: zoom ?? DEFAULT_ZOOM }),
  setMapStyle: (style) => set({ mapStyle: style }),
  toggleClusters: () => set((state) => ({ showClusters: !state.showClusters })),
  toggleHeatmap: () => set((state) => ({ showRiskHeatmap: !state.showRiskHeatmap })),
  resetView: () => set({ center: SEMARANG_CENTER, zoom: DEFAULT_ZOOM, selectedLocation: null }),
  setDashboardFocus: (focus) => set({ dashboardFocus: focus }),
  setDashboardScanning: (scanning) =>
    set((s) =>
      s.dashboardFocus ? { dashboardFocus: { ...s.dashboardFocus, scanning } } : {}
    ),
  clearDashboardFocus: () => set({ dashboardFocus: null }),
}));
