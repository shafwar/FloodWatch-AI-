'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { WeatherChatPanel } from '@/components/chat/WeatherChatPanel';
import { DashboardMiniMap } from '@/components/dashboard/DashboardMiniMap';
import { LocationGrid } from '@/components/dashboard/LocationGrid';
import { useChatFlowStore } from '@/store/chatFlowStore';
import { useMobileChatViewport } from '@/hooks/useMobileChatViewport';
import { cn } from '@/lib/utils';

function resetMainScroll() {
  const main = document.querySelector('main');
  main?.scrollTo(0, 0);
  window.scrollTo(0, 0);
}

export function DashboardPageClient() {
  const analysis = useChatFlowStore((s) => s.analysis);
  const isNavigatingToMap = useChatFlowStore((s) => s.isNavigatingToMap);
  const messages = useChatFlowStore((s) => s.messages);

  const hideMapSection = Boolean(analysis) || isNavigatingToMap;
  const hasConversation = messages.length > 1;
  const { isMobile } = useMobileChatViewport(true);
  const mobileChatMode = isMobile && hasConversation && !hideMapSection;

  // Always pin dashboard to top on mount (e.g. after returning from /map)
  useEffect(() => {
    resetMainScroll();
  }, []);

  useEffect(() => {
    if (isNavigatingToMap) resetMainScroll();
  }, [isNavigatingToMap]);

  useEffect(() => {
    if (!analysis && !isNavigatingToMap && hasConversation) {
      resetMainScroll();
    }
  }, [analysis, isNavigatingToMap, hasConversation]);

  // Lock page scroll on mobile during active chat (ChatGPT-style framing)
  useEffect(() => {
    if (!mobileChatMode) return;
    const main = document.querySelector('main');
    const prevMainOverflow = main?.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;
    if (main) main.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    return () => {
      if (main) main.style.overflow = prevMainOverflow ?? '';
      document.body.style.overflow = prevBodyOverflow;
    };
  }, [mobileChatMode]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={cn('flex flex-col', mobileChatMode ? 'h-full' : 'min-h-full')}
    >
      {/* Chat — full viewport on mobile when in conversation */}
      <section
        className={cn(
          'flex flex-col overflow-hidden w-full max-w-3xl mx-auto',
          mobileChatMode
            ? 'fixed inset-x-0 top-16 bottom-0 z-20 bg-background px-3'
            : 'h-[calc(100dvh-4rem)] min-h-[calc(100dvh-4rem)] px-4 sm:px-6'
        )}
      >
        <WeatherChatPanel
          variant="embedded"
          spotlight
          className="flex-1 min-h-0 h-full"
        />
      </section>

      {/* Spacer when mobile chat is fixed overlay */}
      {mobileChatMode && <div className="h-[calc(100dvh-4rem)] shrink-0" aria-hidden />}

      {/* Peta & lokasi — hidden on mobile during active chat */}
      {!hideMapSection && !mobileChatMode && (
        <section className="border-t border-border/40">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
            <DashboardMiniMap height={260} />
            <LocationGrid />
          </div>
        </section>
      )}
    </motion.div>
  );
}
