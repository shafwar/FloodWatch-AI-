import { AppShell } from '@/components/layout/AppShell';
import { SettingsPageClient } from '@/components/settings/SettingsPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pengaturan — FloodWatch Semarang',
  description: 'Konfigurasi sistem monitoring FloodWatch Semarang',
};

export default function SettingsPage() {
  return (
    <AppShell>
      <SettingsPageClient />
    </AppShell>
  );
}
