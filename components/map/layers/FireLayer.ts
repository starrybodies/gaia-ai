import { ScatterplotLayer } from '@deck.gl/layers';

interface FireEvent {
  id: string;
  lat: number;
  lon: number;
  confidence: number;
  brightness: number;
  timestamp: string;
}

export function buildFireLayer(events: FireEvent[]) {
  return new ScatterplotLayer({
    id: 'fire-layer',
    data: events,
    getPosition: (d: FireEvent) => [d.lon, d.lat],
    getRadius: (d: FireEvent) => Math.max(500, d.brightness * 10),
    getFillColor: (d: FireEvent) => {
      const c = Math.min(1, Math.max(0, d.confidence));
      const alpha = Math.floor(c * 255);
      return [255, Math.floor(100 - c * 80), 0, alpha];
    },
    radiusMinPixels: 2,
    radiusMaxPixels: 20,
    pickable: true,
  });
}
