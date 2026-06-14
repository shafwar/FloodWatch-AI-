import { AppShell } from '@/components/layout/AppShell';
import { AnalyticsPageClient } from '@/components/charts/AnalyticsPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Analytics — FloodWatch Semarang',
  description: 'Analisis tren cuaca dan risiko banjir Kota Semarang',
};

export default function AnalyticsPage() {
  return (
    <AppShell>
      <AnalyticsPageClient />
    </AppShell>
  );
}
