import { ScatterplotLayer } from '@deck.gl/layers';

interface ConvergenceAlert {
  h3Index: string;
  ci: number;
  lat: number;
  lon: number;
}

export function buildConvergenceLayer(alerts: ConvergenceAlert[]) {
  return new ScatterplotLayer({
    id: 'convergence-heatmap',
    data: alerts,
    getPosition: (d: ConvergenceAlert) => [d.lon, d.lat],
    getRadius: (d: ConvergenceAlert) => Math.max(5000, d.ci * 3000),
    getFillColor: (d: ConvergenceAlert) => {
      if (d.ci >= 15) return [0, 0, 0, 200];
      if (d.ci >= 10) return [255, 0, 0, 160];
      if (d.ci >= 5) return [255, 165, 0, 120];
      return [255, 255, 0, 80];
    },
    radiusMinPixels: 10,
    radiusMaxPixels: 80,
    pickable: true,
  });
}
