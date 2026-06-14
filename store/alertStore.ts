// =============================================================================
// FloodWatch Semarang — Alert Store (Zustand)
// =============================================================================

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type { FloodAlert, AlertSeverity, AlertStatus } from '@/types';
interface AlertState {
  alerts: FloodAlert[];
  isLoading: boolean;

  // Actions
  addAlert: (alert: FloodAlert) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  acknowledgeAlert: (id: string) => void;
  resolveAlert: (id: string) => void;
  setAlerts: (alerts: FloodAlert[]) => void;

  // Selectors (as computed getters)
  getActiveAlerts: () => FloodAlert[];
  getUnreadCount: () => number;
  getAlertsBySeverity: (severity: AlertSeverity) => FloodAlert[];
  getAlertsByStatus: (status: AlertStatus) => FloodAlert[];
}

export const useAlertStore = create<AlertState>()(
  subscribeWithSelector((set, get) => ({
    alerts: [],
    isLoading: false,

    addAlert: (alert) =>
      set((state) => ({ alerts: [alert, ...state.alerts] })),

    markAsRead: (id) =>
      set((state) => ({
        alerts: state.alerts.map((a) => (a.id === id ? { ...a, read: true } : a)),
      })),

    markAllAsRead: () =>
      set((state) => ({
        alerts: state.alerts.map((a) => ({ ...a, read: true })),
      })),

    acknowledgeAlert: (id) =>
      set((state) => ({
        alerts: state.alerts.map((a) =>
          a.id === id ? { ...a, status: 'acknowledged' as AlertStatus, read: true } : a
        ),
      })),

    resolveAlert: (id) =>
      set((state) => ({
        alerts: state.alerts.map((a) =>
          a.id === id
            ? { ...a, status: 'resolved' as AlertStatus, resolvedAt: new Date().toISOString(), read: true }
            : a
        ),
      })),

    setAlerts: (alerts) => set({ alerts }),

    getActiveAlerts: () => get().alerts.filter((a) => a.status === 'active'),
    getUnreadCount: () => get().alerts.filter((a) => !a.read).length,
    getAlertsBySeverity: (severity) => get().alerts.filter((a) => a.severity === severity),
    getAlertsByStatus: (status) => get().alerts.filter((a) => a.status === status),
  }))
);
