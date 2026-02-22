"use client";

import { useState, useCallback } from 'react';
import type maplibregl from 'maplibre-gl';
import { GaiaMapBase } from './GaiaMapBase';
import { DeckGLOverlay } from './DeckGLOverlay';
import { buildFireLayer } from './layers/FireLayer';
import { buildConvergenceLayer } from './layers/ConvergenceLayer';
import type { Viewport } from './types';

interface GaiaMapProps {
  onLocationSelect?: (lat: number, lon: number) => void;
}

interface FireEvent {
  id: string;
  lat: number;
  lon: number;
  confidence: number;
  brightness: number;
  timestamp: string;
}

interface ConvergenceAlert {
  h3Index: string;
  ci: number;
  lat: number;
  lon: number;
}

export function GaiaMap({ onLocationSelect }: GaiaMapProps) {
  const [map, setMap] = useState<maplibregl.Map | null>(null);
  const [fireEvents, setFireEvents] = useState<FireEvent[]>([]);
  const [convergenceAlerts, setConvergenceAlerts] = useState<ConvergenceAlert[]>([]);
  const [hoveredFeature, setHoveredFeature] = useState<unknown>(null);

  const layers = [
    buildFireLayer(fireEvents),
    buildConvergenceLayer(convergenceAlerts),
  ];

  const handleViewportChange = useCallback(async (viewport: Viewport) => {
    if (viewport.zoom < 3) return;

    try {
      const res = await fetch(
        `/api/fires?lat=${viewport.latitude}&lon=${viewport.longitude}&radius=500`
      );
      if (res.ok) {
        const data = await res.json();
        setFireEvents(data.events ?? []);
      }
    } catch {
      // Fail silently — stale data persists on map
    }
  }, []);

  return (
    <div className="relative w-full h-full">
      <GaiaMapBase
        initialLat={20}
        initialLon={0}
        initialZoom={2}
        onMapReady={setMap}
        onViewportChange={handleViewportChange}
        onMapClick={onLocationSelect}
      />
      <DeckGLOverlay
        map={map}
        layers={layers}
        onHover={(info) => setHoveredFeature(info.object ?? null)}
      />
      {Boolean(hoveredFeature) && (
        <div className="absolute bottom-8 left-4 bg-black/80 text-white text-xs p-2 rounded font-mono pointer-events-none max-w-xs overflow-auto">
          <pre>{JSON.stringify(hoveredFeature, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
