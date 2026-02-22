export interface Viewport {
  latitude: number;
  longitude: number;
  zoom: number;
  bearing?: number;
  pitch?: number;
}

export interface MapLayer {
  id: string;
  type: 'fire' | 'deforestation' | 'air-quality' | 'biodiversity' | 'ocean' | 'convergence';
  visible: boolean;
  opacity: number;
}

export interface EnvironmentalEvent {
  id: string;
  type: MapLayer['type'];
  lat: number;
  lon: number;
  h3Index: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  timestamp: string;
  properties: Record<string, unknown>;
}
