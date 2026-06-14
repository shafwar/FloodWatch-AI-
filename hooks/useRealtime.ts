'use client';

// =============================================================================
// FloodWatch Semarang — BMKG Sync + Background Recovery
// - Fetches BMKG on mount & at each 3-hour slot boundary
// - Polls at user refresh interval for live chart/alert updates
// - When BMKG offline/degraded: probes every 5 min to auto-recover
// =============================================================================

import { useEffect, useRef, useCallback } from 'react';
import { useWeatherStore } from '@/store/weatherStore';
import { useAlertStore } from '@/store/alertStore';
import { useUIStore } from '@/store/uiStore';
import { LOCATION_BY_NAME } from '@/lib/locations';
import { generateAlert } from '@/lib/floodRiskEngine';
import { msUntilNextSlotBoundary } from '@/lib/weather/slots';
import type { WeatherCondition } from '@/types';

const BMKG_RECOVERY_INTERVAL_MS = 5 * 60 * 1000;

export function useRealtime() {
  const fetchWeather = useWeatherStore((s) => s.fetchWeather);
  const setConnectionStatus = useWeatherStore((s) => s.setConnectionStatus);
  const getCurrentRecords = useWeatherStore((s) => s.getCurrentRecords);
  const meta = useWeatherStore((s) => s.meta);
  const setAlerts = useAlertStore((s) => s.setAlerts);
  const notificationsEnabled = useUIStore((s) => s.settings.notifications);
  const refreshIntervalSec = useUIStore((s) => s.settings.refreshInterval);

  const hasLoaded = useRef(false);
  const slotTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const recoveryTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const syncAlertsFromRecords = useCallback(() => {
    if (!notificationsEnabled) {
      setAlerts([]);
      return;
    }

    const currentRecords = getCurrentRecords();
    const alerts = currentRecords
      .map((r) => {
        const loc = LOCATION_BY_NAME[r.daerah];
        if (!loc) return null;
        return generateAlert(
          loc.id,
          r.daerah,
          r.kondisi as WeatherCondition,
          r.kelembapan,
          `alert-${loc.id}-${r.kondisi}`
        );
      })
      .filter((a): a is NonNullable<typeof a> => a !== null);

    setAlerts(alerts);
  }, [getCurrentRecords, setAlerts, notificationsEnabled]);

  const refreshWeather = useCallback(
    async (options?: { probe?: boolean }) => {
      await fetchWeather(options);
      syncAlertsFromRecords();
    },
    [fetchWeather, syncAlertsFromRecords]
  );

  const scheduleNextSlotSync = useCallback(() => {
    if (slotTimerRef.current) clearTimeout(slotTimerRef.current);

    const delay = msUntilNextSlotBoundary();
    slotTimerRef.current = setTimeout(async () => {
      await refreshWeather();
      scheduleNextSlotSync();
    }, delay);
  }, [refreshWeather]);

  const startRecoveryMonitor = useCallback(() => {
    if (recoveryTimerRef.current) clearInterval(recoveryTimerRef.current);

    recoveryTimerRef.current = setInterval(async () => {
      const status = useWeatherStore.getState().meta?.bmkgStatus;
      if (status === 'online') return;
      await refreshWeather({ probe: true });
    }, BMKG_RECOVERY_INTERVAL_MS);
  }, [refreshWeather]);

  const stopRecoveryMonitor = useCallback(() => {
    if (recoveryTimerRef.current) {
      clearInterval(recoveryTimerRef.current);
      recoveryTimerRef.current = null;
    }
  }, []);

  // Poll interval dari pengaturan — chart & alert ikut ter-update
  useEffect(() => {
    if (pollTimerRef.current) clearInterval(pollTimerRef.current);

    const ms = Math.max(30, refreshIntervalSec) * 1000;
    pollTimerRef.current = setInterval(() => {
      refreshWeather();
    }, ms);

    return () => {
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
    };
  }, [refreshIntervalSec, refreshWeather]);

  // Re-sync alert saat toggle notifikasi berubah
  useEffect(() => {
    syncAlertsFromRecords();
  }, [notificationsEnabled, syncAlertsFromRecords]);

  useEffect(() => {
    if (meta?.bmkgStatus === 'online') {
      stopRecoveryMonitor();
    } else if (meta?.bmkgStatus) {
      startRecoveryMonitor();
    }
  }, [meta?.bmkgStatus, startRecoveryMonitor, stopRecoveryMonitor]);

  useEffect(() => {
    if (!hasLoaded.current) {
      hasLoaded.current = true;
      refreshWeather().then(() => scheduleNextSlotSync());
    }

    return () => {
      if (slotTimerRef.current) clearTimeout(slotTimerRef.current);
      stopRecoveryMonitor();
      setConnectionStatus('disconnected');
    };
  }, [refreshWeather, scheduleNextSlotSync, stopRecoveryMonitor, setConnectionStatus]);
}
