// =============================================================================
// FloodWatch Semarang — Weather Store (Zustand)
// Single source of truth: BMKG primary · CSV fallback · auto recovery
// =============================================================================

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type {
  WeatherRecord,
  ConnectionStatus,
  RealtimeState,
  WeatherMeta,
  BmkgStatus,
  WeatherDataSource,
} from '@/types';

interface WeatherState extends RealtimeState {
  records: WeatherRecord[];
  historicalRecords: WeatherRecord[];
  isLoading: boolean;
  error: string | null;
  activeSource: WeatherDataSource | null;

  setRecords: (records: WeatherRecord[]) => void;
  setHistoricalRecords: (records: WeatherRecord[]) => void;
  updateRecord: (record: WeatherRecord) => void;
  setConnectionStatus: (status: ConnectionStatus) => void;
  setLastUpdate: (timestamp: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  incrementUpdateCount: () => void;
  setMeta: (meta: WeatherMeta | null) => void;
  fetchWeather: (options?: { forceRefresh?: boolean; probe?: boolean }) => Promise<void>;

  getRecordByLocation: (locationId: string) => WeatherRecord | undefined;
  getCurrentRecords: () => WeatherRecord[];
  isBmkgPrimary: () => boolean;
}

function connectionFromBmkgStatus(status: BmkgStatus | undefined): ConnectionStatus {
  if (!status) return 'connecting';
  if (status === 'online') return 'connected';
  if (status === 'degraded') return 'error';
  return 'disconnected';
}

function applyWeatherPayload(
  data: {
    records?: WeatherRecord[];
    historicalRecords?: WeatherRecord[];
    meta?: WeatherMeta | null;
  },
  get: () => WeatherState,
  set: (partial: Partial<WeatherState>) => void
) {
  const prevSource = get().activeSource;
  const newSource = data.meta?.source ?? null;

  set({
    records: data.records ?? [],
    historicalRecords: data.historicalRecords ?? [],
    meta: data.meta ?? null,
    activeSource: newSource,
    isLoading: false,
    connectionStatus: connectionFromBmkgStatus(data.meta?.bmkgStatus),
    lastUpdate: data.meta?.fetchedAt ?? new Date().toISOString(),
    updateCount: get().updateCount + 1,
    error: null,
  });

  if (prevSource && newSource && prevSource !== newSource) {
    console.info(`[Weather] Data source switched: ${prevSource} → ${newSource}`);
  }
}

export const useWeatherStore = create<WeatherState>()(
  subscribeWithSelector((set, get) => ({
    records: [],
    historicalRecords: [],
    isLoading: true,
    error: null,
    activeSource: null,
    connectionStatus: 'connecting',
    lastUpdate: null,
    updateCount: 0,
    meta: null,

    setRecords: (records) => set({ records }),
    setHistoricalRecords: (records) => set({ historicalRecords: records }),

    updateRecord: (record) =>
      set((state) => ({
        records: state.records.map((r) =>
          r.daerah === record.daerah && r.keterangan === record.keterangan ? record : r
        ),
      })),

    setConnectionStatus: (status) => set({ connectionStatus: status }),
    setLastUpdate: (timestamp) => set({ lastUpdate: timestamp }),
    setLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error }),
    incrementUpdateCount: () => set((state) => ({ updateCount: state.updateCount + 1 })),
    setMeta: (meta) => set({ meta, activeSource: meta?.source ?? null }),

    fetchWeather: async (options) => {
      const isProbe = options?.probe ?? false;
      set({ isLoading: !isProbe, error: null });
      if (!isProbe) set({ connectionStatus: 'connecting' });

      try {
        const params = new URLSearchParams();
        if (options?.forceRefresh) params.set('refresh', 'true');
        if (isProbe) params.set('probe', 'true');

        const query = params.toString();
        const res = await fetch(`/api/weather${query ? `?${query}` : ''}`, {
          cache: 'no-store',
        });

        const data = await res.json();

        if (!res.ok && !data.records) {
          throw new Error(data.error ?? 'Failed to fetch weather data');
        }

        applyWeatherPayload(data, get, set);
      } catch (err) {
        console.error('[Weather] Client fetch error:', err);
        const state = get();

        // Preserve existing data — UI keeps working with last known good state
        set({
          error: err instanceof Error ? err.message : 'Unknown error',
          isLoading: false,
          connectionStatus:
            state.records.length > 0
              ? connectionFromBmkgStatus(state.meta?.bmkgStatus)
              : 'disconnected',
        });
      }
    },

    getRecordByLocation: (locationId) => {
      const { records } = get();
      return records.find(
        (r) => r.keterangan === 'Saat Ini' && r.id.includes(locationId)
      );
    },

    getCurrentRecords: () => {
      const { records } = get();
      return records.filter((r) => r.keterangan === 'Saat Ini');
    },

    isBmkgPrimary: () => {
      const { meta } = get();
      return meta?.bmkgStatus === 'online';
    },
  }))
);
