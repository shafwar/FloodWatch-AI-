import { NextResponse } from 'next/server';
import { z } from 'zod';
import { buildChatWeatherContext, formatContextForPrompt } from '@/lib/chat/contextBuilder';
import { parseUserMapQuery, buildQueryHints, buildMapResultHints } from '@/lib/chat/queryParser';
import { buildSystemPrompt } from '@/lib/chat/systemPrompt';
import { generateChatReply } from '@/lib/chat/gemini';

export const dynamic = 'force-dynamic';

const mapResultSchema = z
  .object({
    locationId: z.string(),
    locationName: z.string(),
    riskLevel: z.enum(['AMAN', 'WASPADA', 'SIAGA', 'BAHAYA']),
    riskScore: z.number(),
    kondisi: z.string(),
    suhu: z.number(),
    kelembapan: z.number(),
    slotLabel: z.string(),
    color: z.string(),
  })
  .optional();

const chatRequestSchema = z.object({
  message: z.string().min(1, 'Pesan tidak boleh kosong').max(2000),
  history: z
    .array(
      z.object({
        role: z.enum(['user', 'model']),
        content: z.string().max(4000),
      })
    )
    .max(20)
    .default([]),
  mapResult: mapResultSchema,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = chatRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Format permintaan tidak valid', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { message, history, mapResult } = parsed.data;

    const weatherContext = await buildChatWeatherContext();
    const queryIntent = parseUserMapQuery(message);

    let queryHints = buildQueryHints(queryIntent, message);
    if (mapResult) {
      queryHints += buildMapResultHints(mapResult, message);
    }

    const systemPrompt = buildSystemPrompt(formatContextForPrompt(weatherContext), queryHints);

    const reply = await generateChatReply(systemPrompt, history, message);

    return NextResponse.json({
      reply,
      meta: {
        source: weatherContext.source,
        activeSlot: weatherContext.activeSlotLabel,
        fetchedAt: weatherContext.fetchedAt,
        mapResult: mapResult
          ? { level: mapResult.riskLevel, score: mapResult.riskScore }
          : undefined,
      },
    });
  } catch (error) {
    console.error('Chat API error:', error);
    const message =
      error instanceof Error ? error.message : 'Gagal memproses permintaan chat';

    const status = message.includes('GEMINI_API_KEY') ? 503 : 500;

    return NextResponse.json({ error: message }, { status });
  }
}
