'use client';

import { useState, useRef, useCallback } from 'react';
import { flushSync } from 'react-dom';
import { useRouter } from 'next/navigation';
import { parseUserMapQuery } from '@/lib/chat/queryParser';
import { computeLocationRisk } from '@/lib/chat/locationRisk';
import type { LocationRiskResult } from '@/lib/chat/locationRisk';
import { useWeatherStore } from '@/store/weatherStore';
import { useMapStore } from '@/store/mapStore';
import {
  useChatFlowStore,
  WELCOME_MESSAGE,
  type ChatMessage,
} from '@/store/chatFlowStore';

export type { ChatMessage };
export { WELCOME_MESSAGE };

export const SUGGESTED_QUESTIONS = [
  'Bagaimana cuaca Semarang Utara saat ini?',
  'Wilayah mana yang berisiko banjir?',
  'Apakah akan hujan 3 jam ke depan?',
  'Mau ke Semarang bawah jam 8 malam, aman nggak?',
];

async function fetchChatReply(
  message: string,
  history: Array<{ role: 'user' | 'model'; content: string }>,
  mapResult?: LocationRiskResult
): Promise<string> {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history, mapResult }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? 'Gagal mendapatkan respons AI');
  return data.reply;
}

export function useWeatherChat() {
  const router = useRouter();
  const bottomRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState('');

  const messages = useChatFlowStore((s) => s.messages);
  const isLoading = useChatFlowStore((s) => s.isLoading);
  const error = useChatFlowStore((s) => s.error);
  const setError = useChatFlowStore((s) => s.setError);
  const setLoading = useChatFlowStore((s) => s.setLoading);
  const addMessage = useChatFlowStore((s) => s.addMessage);
  const beginMapAnalysis = useChatFlowStore((s) => s.beginMapAnalysis);
  const setAnalysisApiResult = useChatFlowStore((s) => s.setAnalysisApiResult);
  const resetChatStore = useChatFlowStore((s) => s.resetChat);

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    const el = scrollAreaRef.current;
    if (!el) return;
    // Native overflow container (mobile / spotlight)
    if (el.dataset.chatScroll === 'native') {
      el.scrollTop = el.scrollHeight;
      return;
    }
    const viewport = el.querySelector(
      '[data-slot="scroll-area-viewport"]'
    ) as HTMLElement | null;
    if (viewport) {
      viewport.scrollTop = viewport.scrollHeight;
    }
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading) return;

      setError(null);
      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: trimmed,
        timestamp: new Date().toISOString(),
      };

      const intent = parseUserMapQuery(trimmed);
      const hasLocation = intent.locationIds.length > 0;

      const history = messages
        .filter((m) => m.id !== 'welcome')
        .slice(-10)
        .map((m) => ({
          role: (m.role === 'user' ? 'user' : 'model') as 'user' | 'model',
          content: m.content,
        }));

      if (hasLocation && intent.primaryLocationId) {
        const records = useWeatherStore.getState().records;
        const risk = computeLocationRisk(
          intent.primaryLocationId,
          intent.timeFrame,
          records
        );

        flushSync(() => {
          const main = document.querySelector('main');
          main?.scrollTo(0, 0);
          window.scrollTo(0, 0);
          beginMapAnalysis({
            userMessage: trimmed,
            primaryLocationId: intent.primaryLocationId!,
            locationIds: intent.locationIds,
            timeFrame: intent.timeFrame,
            locationName: risk.locationName,
            riskLevel: risk.riskLevel,
            riskScore: risk.riskScore,
            kondisi: risk.kondisi,
            suhu: risk.suhu,
            kelembapan: risk.kelembapan,
            slotLabel: risk.slotLabel,
            color: risk.color,
          });
          addMessage(userMsg);
          setInput('');
        });

        fetchChatReply(trimmed, history, risk)
          .then((reply) => setAnalysisApiResult(reply))
          .catch((err) =>
            setAnalysisApiResult(
              null,
              err instanceof Error ? err.message : 'Terjadi kesalahan'
            )
          );

        requestAnimationFrame(() => {
          router.replace('/map');
        });
        return;
      }

      addMessage(userMsg);
      setInput('');
      setLoading(true);

      try {
        const reply = await fetchChatReply(trimmed, history);
        addMessage({
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: reply,
          timestamp: new Date().toISOString(),
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
      } finally {
        setLoading(false);
        useMapStore.getState().clearDashboardFocus();
      }
    },
    [
      isLoading,
      messages,
      addMessage,
      setError,
      setLoading,
      beginMapAnalysis,
      setAnalysisApiResult,
      router,
    ]
  );

  const resetChat = useCallback(() => {
    resetChatStore();
    setInput('');
    useMapStore.getState().clearDashboardFocus();
  }, [resetChatStore]);

  return {
    messages,
    input,
    setInput,
    isLoading,
    error,
    bottomRef,
    scrollAreaRef,
    sendMessage,
    resetChat,
    scrollToBottom,
    hasConversation: messages.length > 1,
  };
}
