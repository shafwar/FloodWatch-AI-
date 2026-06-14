'use client';

import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Map } from 'lucide-react';
import { useChatFlowStore } from '@/store/chatFlowStore';

export function DashboardTransitionOverlay() {
  const pathname = usePathname();
  const isNavigatingToMap = useChatFlowStore((s) => s.isNavigatingToMap);
  const analysisPhase = useChatFlowStore((s) => s.analysis?.phase);

  const onMapRoute = pathname === '/map';

  // Hanya di dashboard saat menuju peta, atau saat kembali ke chat.
  // Di /map, MapAnalysisOverlay yang menangani UI analisis.
  const show =
    analysisPhase === 'returning' ||
    (isNavigatingToMap && !onMapRoute);

  const label =
    analysisPhase === 'returning'
      ? 'Kembali ke chat...'
      : 'Membuka analisis peta...';

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-3 text-muted-foreground"
          >
            {analysisPhase === 'returning' ? (
              <Loader2 size={28} className="text-primary animate-spin" />
            ) : (
              <Map size={28} className="text-primary" />
            )}
            <p className="text-sm font-medium text-foreground">{label}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
