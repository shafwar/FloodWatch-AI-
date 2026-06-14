'use client';

// =============================================================================
// FloodWatch Semarang — useAlerts hook
// =============================================================================

import { useMemo } from 'react';
import { useAlertStore } from '@/store/alertStore';

export function useAlerts() {
  const alerts = useAlertStore((s) => s.alerts);
  const markAsRead = useAlertStore((s) => s.markAsRead);
  const markAllAsRead = useAlertStore((s) => s.markAllAsRead);
  const acknowledgeAlert = useAlertStore((s) => s.acknowledgeAlert);
  const resolveAlert = useAlertStore((s) => s.resolveAlert);
  const unreadCount = useAlertStore((s) => s.getUnreadCount());

  const activeAlerts = useMemo(() => alerts.filter((a) => a.status === 'active'), [alerts]);
  const emergencyAlerts = useMemo(() => alerts.filter((a) => a.severity === 'emergency'), [alerts]);
  const criticalAlerts = useMemo(() => alerts.filter((a) => a.severity === 'critical'), [alerts]);

  return {
    alerts,
    activeAlerts,
    emergencyAlerts,
    criticalAlerts,
    unreadCount,
    markAsRead,
    markAllAsRead,
    acknowledgeAlert,
    resolveAlert,
  };
}
