import { AppShell } from '@/components/layout/AppShell';
import { AlertsPageClient } from '@/components/alerts/AlertsPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Alert Center — FloodWatch Semarang',
  description: 'Manajemen alert dan peringatan dini banjir real-time Kota Semarang',
};

export default function AlertsPage() {
  return (
    <AppShell>
      <AlertsPageClient />
    </AppShell>
  );
}
