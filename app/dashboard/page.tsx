import { AppShell } from '@/components/layout/AppShell';
import { DashboardPageClient } from '@/components/dashboard/DashboardPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard — FloodWatch Semarang',
  description: 'Executive dashboard monitoring banjir dan cuaca real-time Kota Semarang',
};

export default function DashboardPage() {
  return (
    <AppShell embeddedChat>
      <DashboardPageClient />
    </AppShell>
  );
}
