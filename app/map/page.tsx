import { AppShell } from '@/components/layout/AppShell';
import { MapPageClient } from '@/components/map/MapPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Peta GIS — FloodWatch Semarang',
  description: 'Peta interaktif monitoring banjir real-time dengan 10 titik pantau di Kota Semarang',
};

export default function MapPage() {
  return (
    <AppShell>
      <MapPageClient />
    </AppShell>
  );
}
