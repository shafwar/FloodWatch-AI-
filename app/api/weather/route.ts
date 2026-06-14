import { NextResponse } from 'next/server';
import {
  getWeatherData,
  probeBmkgRecovery,
  buildCsvFallbackPayload,
} from '@/lib/weather/aggregator';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const forceRefresh = searchParams.get('refresh') === 'true';
    const probe = searchParams.get('probe') === 'true';

    const payload = probe
      ? await probeBmkgRecovery()
      : await getWeatherData(forceRefresh);

    return NextResponse.json(payload, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (error) {
    console.error('Error in /api/weather, returning CSV fallback:', error);
    const fallback = buildCsvFallbackPayload();
    return NextResponse.json(fallback, {
      headers: { 'Cache-Control': 'no-store' },
    });
  }
}
