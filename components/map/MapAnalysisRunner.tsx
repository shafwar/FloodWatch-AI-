'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useChatFlowStore } from '@/store/chatFlowStore';
import { useMapStore } from '@/store/mapStore';

/** Durasi pan peta sebelum overlay loading muncul */
const SCAN_PAN_MS = 3200;
const MIN_ANALYSIS_MS = 2500;
const RESULT_DISPLAY_MS = 2200;
const RETURN_FADE_MS = 600;

function waitForApiDone(): Promise<void> {
  return new Promise((resolve) => {
    if (useChatFlowStore.getState().analysis?.apiDone) {
      resolve();
      return;
    }
    const unsub = useChatFlowStore.subscribe((state) => {
      if (state.analysis?.apiDone) {
        unsub();
        resolve();
      }
    });
  });
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export function MapAnalysisRunner() {
  const router = useRouter();
  const analysis = useChatFlowStore((s) => s.analysis);
  const scanningRef = useRef(false);
  const analyzingRef = useRef(false);

  // Fase 1: pan peta (tanpa overlay loading)
  useEffect(() => {
    if (!analysis || analysis.phase !== 'scanning' || scanningRef.current) return;

    scanningRef.current = true;

    const { locationIds, primaryLocationId } = analysis;

    useMapStore.getState().setDashboardFocus({
      locationIds,
      primaryId: primaryLocationId,
      scanning: true,
    });

    const timer = setTimeout(() => {
      useMapStore.getState().setDashboardScanning(false);
      useChatFlowStore.getState().setAnalysisPhase('analyzing');
      scanningRef.current = false;
    }, SCAN_PAN_MS);

    return () => {
      clearTimeout(timer);
      scanningRef.current = false;
    };
  }, [analysis]);

  // Fase 2–4: analisis → hasil → kembali
  useEffect(() => {
    if (!analysis || analysis.phase !== 'analyzing' || analyzingRef.current) return;

    analyzingRef.current = true;

    const { startedAt } = analysis;

    const run = async () => {
      try {
        await Promise.all([
          waitForApiDone(),
          sleep(Math.max(0, MIN_ANALYSIS_MS - (Date.now() - startedAt))),
        ]);

        useChatFlowStore.getState().setAnalysisPhase('result');

        await sleep(RESULT_DISPLAY_MS);

        const state = useChatFlowStore.getState();
        const session = state.analysis;

        if (session?.aiReply) {
          state.addMessage({
            id: `assistant-${Date.now()}`,
            role: 'assistant',
            content: session.aiReply,
            timestamp: new Date().toISOString(),
          });
        } else if (session?.apiError) {
          state.setError(session.apiError);
        }

        useMapStore.getState().clearDashboardFocus();
        state.setAnalysisPhase('returning');
        state.setNavigatingToMap(false);

        await sleep(RETURN_FADE_MS);

        router.replace('/dashboard');

        requestAnimationFrame(() => {
          useChatFlowStore.getState().clearAnalysis();
        });
      } finally {
        analyzingRef.current = false;
      }
    };

    run();
  }, [analysis, router]);

  return null;
}
