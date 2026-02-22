import { query } from './db';

interface Location {
  lat: number;
  lon: number;
  name?: string;
}

interface SpatialContextOptions {
  mockMode?: boolean;
  radiusKm?: number;
  maxDocuments?: number;
}

export async function buildSpatialContext(
  location: Location,
  eventTypes: string[],
  options: SpatialContextOptions = {}
): Promise<string> {
  if (options.mockMode) {
    return `[Mock context for ${location.lat}, ${location.lon}]`;
  }

  const radiusM = (options.radiusKm ?? 500) * 1000;
  const maxDocs = options.maxDocuments ?? 5;

  // Spatial retrieval: find relevant documents near the location
  const result = await query(
    `SELECT content, source, source_tier, created_at
     FROM document_embeddings
     WHERE event_types && $1
       AND (
         location IS NULL
         OR ST_DWithin(location::geography, ST_MakePoint($2, $3)::geography, $4)
       )
       AND created_at > NOW() - INTERVAL '72 hours'
     ORDER BY created_at DESC
     LIMIT $5`,
    [eventTypes, location.lon, location.lat, radiusM, maxDocs]
  );

  if (result.rows.length === 0) {
    return 'No recent news context available for this region.';
  }

  return result.rows
    .map((row, i) => `[Source ${i + 1}: ${row.source} (Tier ${row.source_tier ?? 'unknown'})]\n${row.content}`)
    .join('\n\n---\n\n');
}

export function formatBriefingPrompt(
  location: Location & { name?: string },
  signalTypes: string[],
  alertSummary: string,
  newsContext: string
): string {
  const locationStr = location.name ?? `${location.lat.toFixed(2)}, ${location.lon.toFixed(2)}`;

  return `You are GAIA, an AI environmental intelligence system. Generate a concise situation briefing.

LOCATION: ${locationStr}
ACTIVE SIGNALS: ${signalTypes.join(', ')}
ALERT STATUS: ${alertSummary}

RECENT NEWS CONTEXT:
${newsContext}

Generate a structured briefing following this format:

## Situation Summary
[2-3 sentences: what is happening, how severe]

## Active Threats
[Bullet list of each signal type with z-score interpretation]

## Recent Intelligence
[Key findings from news sources with citations]

## Trajectory Assessment
[Is this accelerating, stable, or improving? What to watch next]

## Data Confidence
[Note any gaps, low-confidence readings, or data limitations]

Rules:
- Use "associated with" not "caused by" for correlations
- Flag data gaps explicitly
- Keep under 600 words
- No speculation beyond what data supports`;
}
