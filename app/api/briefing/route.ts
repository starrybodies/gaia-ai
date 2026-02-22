import { NextRequest } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { buildSpatialContext, formatBriefingPrompt } from '@/lib/rag';
import { getActiveConvergenceAlerts } from '@/lib/convergence';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  let body: { lat?: number; lon?: number; locationName?: string; signalTypes?: string[] };
  try {
    body = await request.json();
  } catch {
    return new Response('Invalid JSON body', { status: 400 });
  }

  const { lat, lon, locationName: locationNameRaw, signalTypes = [] } = body;
  const locationName = locationNameRaw?.slice(0, 100);

  if (lat === undefined || lon === undefined) {
    return new Response('Missing lat or lon', { status: 400 });
  }

  if (typeof lat !== 'number' || typeof lon !== 'number' ||
      lat < -90 || lat > 90 || lon < -180 || lon > 180) {
    return new Response('Invalid lat/lon values', { status: 400 });
  }

  // Get nearby convergence alerts for context
  let alertSummary = 'No active convergence alerts';
  try {
    const allAlerts = await getActiveConvergenceAlerts('WATCH', 5);
    if (allAlerts.length > 0) {
      alertSummary = allAlerts
        .map(a => `${a.severity} alert (CI=${a.ci_score.toFixed(1)}): ${a.signal_types.join(', ')}`)
        .join('; ');
    }
  } catch (error) {
    console.error('[briefing] Failed to fetch convergence alerts:', error);
  }

  // Fetch spatial news context
  const ALLOWED_SIGNAL_TYPES = new Set(['fire', 'deforestation', 'biodiversity', 'flood', 'drought']);
  const activeSignals = (signalTypes.length > 0 ? signalTypes : ['fire', 'deforestation', 'biodiversity'])
    .filter((s: string) => ALLOWED_SIGNAL_TYPES.has(s))
    .slice(0, 10);
  let newsContext = 'No recent news context available.';
  try {
    newsContext = await buildSpatialContext(
      { lat, lon, name: locationName },
      activeSignals
    );
  } catch (error) {
    console.error('[briefing] Failed to fetch spatial context:', error);
  }

  const prompt = formatBriefingPrompt(
    { lat, lon, name: locationName },
    activeSignals,
    alertSummary,
    newsContext
  );

  // Stream response via SSE
  const encoder = new TextEncoder();
  let claudeStream: ReturnType<typeof anthropic.messages.stream> | undefined;
  const stream = new ReadableStream({
    async start(controller) {
      try {
        claudeStream = anthropic.messages.stream({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 1024,
          messages: [{ role: 'user', content: prompt }],
        });

        for await (const chunk of claudeStream) {
          if (
            chunk.type === 'content_block_delta' &&
            chunk.delta.type === 'text_delta'
          ) {
            const data = `data: ${JSON.stringify({ text: chunk.delta.text })}\n\n`;
            controller.enqueue(encoder.encode(data));
          }
        }

        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      } catch (error) {
        const errMsg = error instanceof Error ? error.message : 'Unknown error';
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ error: errMsg })}\n\n`)
        );
        controller.close();
      }
    },
    cancel() {
      claudeStream?.abort?.();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
