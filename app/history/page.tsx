import { AppShell } from '@/components/layout/AppShell';
import { HistoryPageClient } from '@/components/history/HistoryPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Riwayat Data — FloodWatch Semarang',
  description: 'Data historis cuaca dan banjir 7 hari terakhir Kota Semarang',
};

export default function HistoryPage() {
  return (
    <AppShell>
      <HistoryPageClient />
    </AppShell>
  );
}
