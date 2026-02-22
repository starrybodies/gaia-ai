import { MVTLayer } from '@deck.gl/geo-layers';

const MARTIN_BASE = process.env.NEXT_PUBLIC_MARTIN_URL ?? 'http://localhost:3002';

export function buildEventsVectorLayer(eventType: 'fire' | 'deforestation') {
  const colorMap: Record<string, [number, number, number, number]> = {
    fire: [255, 100, 0, 180],
    deforestation: [139, 90, 43, 180],
  };

  return new MVTLayer({
    id: `events-mvt-${eventType}`,
    data: `${MARTIN_BASE}/events_recent/{z}/{x}/{y}?event_type=${eventType}`,
    getFillColor: colorMap[eventType],
    getRadius: 500,
    radiusMinPixels: 2,
    radiusMaxPixels: 12,
    pickable: true,
    autoHighlight: true,
  });
}

export function buildConvergenceVectorLayer() {
  return new MVTLayer({
    id: 'convergence-mvt',
    data: `${MARTIN_BASE}/convergence_alerts_active/{z}/{x}/{y}`,
    getFillColor: (f: { properties?: { severity?: string } }) => {
      const severityColors: Record<string, [number, number, number, number]> = {
        WATCH: [255, 255, 0, 80],
        WARNING: [255, 165, 0, 120],
        CRITICAL: [255, 0, 0, 160],
        EMERGENCY: [0, 0, 0, 200],
      };
      return severityColors[f.properties?.severity ?? ''] ?? [128, 128, 128, 80];
    },
    stroked: true,
    getLineColor: [255, 255, 255, 100] as [number, number, number, number],
    lineWidthMinPixels: 1,
    pickable: true,
  });
}
