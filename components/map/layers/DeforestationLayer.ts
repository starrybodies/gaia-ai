import { MVTLayer } from '@deck.gl/geo-layers';

export function buildDeforestationLayer(martinBaseUrl: string) {
  return new MVTLayer({
    id: 'deforestation-mvt',
    data: `${martinBaseUrl}/deforestation_alerts/{z}/{x}/{y}`,
    getFillColor: [139, 90, 43, 180] as [number, number, number, number],
    getLineColor: [180, 120, 60, 255] as [number, number, number, number],
    lineWidthMinPixels: 1,
    pickable: true,
  });
}
