// =============================================================================
// FloodWatch Semarang — Dashboard Store (Zustand)
// =============================================================================

import { create } from 'zustand';

interface DashboardState {
  isRefreshing: boolean;
  lastRefreshAt: string | null;
  activeTab: string;
  compactMode: boolean;

  setRefreshing: (refreshing: boolean) => void;
  setLastRefreshAt: (time: string) => void;
  setActiveTab: (tab: string) => void;
  toggleCompactMode: () => void;
}

export const useDashboardStore = create<DashboardState>()((set) => ({
  isRefreshing: false,
  lastRefreshAt: null,
  activeTab: 'overview',
  compactMode: false,

  setRefreshing: (refreshing) => set({ isRefreshing: refreshing }),
  setLastRefreshAt: (time) => set({ lastRefreshAt: time }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  toggleCompactMode: () => set((state) => ({ compactMode: !state.compactMode })),
}));
