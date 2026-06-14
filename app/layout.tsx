import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/layout/Providers';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'FloodWatch Semarang — Sistem Monitoring Banjir Real-Time',
  description:
    'Platform pemantauan banjir dan kecerdasan cuaca berbasis web untuk Kota Semarang. Visualisasi data prakiraan BMKG secara real-time untuk pemantauan dini bencana banjir.',
  keywords: ['FloodWatch', 'Semarang', 'Monitoring Banjir', 'BMKG', 'IoT', 'Smart City'],
  authors: [{ name: 'FloodWatch Team' }],
  metadataBase: new URL('https://floodwatch-semarang.id'),
  openGraph: {
    title: 'FloodWatch Semarang',
    description: 'Sistem Monitoring Banjir Real-Time Kota Semarang',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
