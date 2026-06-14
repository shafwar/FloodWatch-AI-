'use client';

// =============================================================================
// FloodWatch Semarang — App Shell
// Main layout wrapper with sidebar + content area
// =============================================================================


import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';
import { DataSourceBanner } from '@/components/shared/DataSourceBanner';
import { DashboardTransitionOverlay } from '@/components/dashboard/DashboardTransitionOverlay';
import { useRealtime } from '@/hooks/useRealtime';
import { useChatFlowStore } from '@/store/chatFlowStore';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const WeatherChatWidget = dynamic(
  () =>
    import('@/components/chat/WeatherChatWidget').then((m) => ({
      default: m.WeatherChatWidget,
    })),
  { ssr: false }
);

interface AppShellProps {
  children: React.ReactNode;
  /** Dashboard uses embedded chat — skip floating widget & global banner */
  embeddedChat?: boolean;
}

/** Routes that use full-width layout (maps, immersive views) */
const FULL_WIDTH_ROUTES = ['/map'];

function RealtimeProvider() {
  // Sync with BMKG data at each 3-hour slot boundary (WIB)
  useRealtime();
  return null;
}

export function AppShell({ children, embeddedChat = false }: AppShellProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const isNavigatingToMap = useChatFlowStore((s) => s.isNavigatingToMap);
  const analysis = useChatFlowStore((s) => s.analysis);
  const analysisPhase = analysis?.phase;
  const isMapAnalysis = Boolean(analysis);
  const lockMainScroll =
    embeddedChat &&
    (isNavigatingToMap || analysisPhase === 'returning' || isMapAnalysis);
  const isFullWidth =
    embeddedChat || FULL_WIDTH_ROUTES.some((route) => pathname.startsWith(route));

  // Client-only gate for floating widget (dynamic import, ssr: false)
  useEffect(() => {
    setMounted(true);
  }, []);

  const showFloatingChat = !embeddedChat && mounted && !isMapAnalysis;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <RealtimeProvider />
      <DashboardTransitionOverlay />
      <Sidebar />

      {/* Main content area */}
      <motion.div
        className="flex flex-col flex-1 min-w-0 overflow-hidden"
        animate={{ marginLeft: 0 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
      >
        <TopNav />

        <main className={cn(
          'flex-1 scrollbar-thin',
          lockMainScroll ? 'overflow-hidden' : 'overflow-y-auto',
          embeddedChat ? 'p-0' : 'p-4 lg:p-6',
          'transition-opacity duration-300'
        )}>
          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className={cn(
              'w-full',
              !isFullWidth && 'max-w-[1400px] mx-auto'
            )}
          >
            {!embeddedChat && !isMapAnalysis && <DataSourceBanner />}
            {children}
          </motion.div>
        </main>
      </motion.div>

      {showFloatingChat && <WeatherChatWidget />}
    </div>
  );
}
