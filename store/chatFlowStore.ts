'use client';

import { create } from 'zustand';
import type { FloodLevel } from '@/types';
import type { TimeFrame } from '@/lib/chat/queryParser';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export const WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content:
    'Halo! Saya **AQUA Assistant**, asisten FloodWatch Semarang.\n\nTanyakan cuaca, risiko banjir, atau rencana perjalanan Anda — data dari **BMKG** slot 3 jam.',
  timestamp: '',
};

export type AnalysisPhase = 'scanning' | 'analyzing' | 'result' | 'returning';

export interface MapAnalysisSession {
  phase: AnalysisPhase;
  userMessage: string;
  primaryLocationId: string;
  locationIds: string[];
  timeFrame: TimeFrame;
  locationName: string;
  riskLevel: FloodLevel;
  riskScore: number;
  kondisi: string;
  suhu: number;
  kelembapan: number;
  slotLabel: string;
  color: string;
  startedAt: number;
  aiReply: string | null;
  apiError: string | null;
  apiDone: boolean;
}

interface ChatFlowState {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  analysis: MapAnalysisSession | null;
  /** Blocks dashboard flash + scroll before /map opens */
  isNavigatingToMap: boolean;

  setMessages: (messages: ChatMessage[]) => void;
  addMessage: (message: ChatMessage) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setNavigatingToMap: (value: boolean) => void;
  beginMapAnalysis: (
    data: Omit<MapAnalysisSession, 'phase' | 'startedAt' | 'aiReply' | 'apiError' | 'apiDone'>
  ) => void;
  setAnalysisApiResult: (reply: string | null, error?: string | null) => void;
  setAnalysisPhase: (phase: AnalysisPhase) => void;
  clearAnalysis: () => void;
  resetChat: () => void;
}

export const useChatFlowStore = create<ChatFlowState>((set) => ({
  messages: [WELCOME_MESSAGE],
  isLoading: false,
  error: null,
  analysis: null,
  isNavigatingToMap: false,

  setMessages: (messages) => set({ messages }),
  addMessage: (message) => set((s) => ({ messages: [...s.messages, message] })),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setNavigatingToMap: (isNavigatingToMap) => set({ isNavigatingToMap }),

  beginMapAnalysis: (data) =>
    set({
      analysis: {
        ...data,
        phase: 'scanning',
        startedAt: Date.now(),
        aiReply: null,
        apiError: null,
        apiDone: false,
      },
      isLoading: true,
      isNavigatingToMap: true,
      error: null,
    }),

  setAnalysisApiResult: (reply, error = null) =>
    set((s) =>
      s.analysis
        ? {
            analysis: {
              ...s.analysis,
              aiReply: reply,
              apiError: error,
              apiDone: true,
            },
          }
        : {}
    ),

  setAnalysisPhase: (phase) =>
    set((s) => (s.analysis ? { analysis: { ...s.analysis, phase } } : {})),

  clearAnalysis: () =>
    set({ analysis: null, isLoading: false, isNavigatingToMap: false }),

  resetChat: () =>
    set({
      messages: [WELCOME_MESSAGE],
      analysis: null,
      isLoading: false,
      isNavigatingToMap: false,
      error: null,
    }),
}));
