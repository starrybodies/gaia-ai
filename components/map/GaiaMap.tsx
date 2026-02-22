"use client";

import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import type maplibregl from 'maplibre-gl';
import { GaiaMapBase } from './GaiaMapBase';
import { DeckGLOverlay } from './DeckGLOverlay';
import { buildFireLayer } from './layers/FireLayer';
import { buildConvergenceLayer } from './layers/ConvergenceLayer';
import { LayerControls } from './LayerControls';
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

  const [layerVisibility, setLayerVisibility] = useState({
    fire: true,
    deforestation: true,
    convergence: true,
    airQuality: false,
  });

  const toggleLayer = useCallback((id: string) => {
    setLayerVisibility(prev => ({ ...prev, [id]: !prev[id as keyof typeof prev] }));
  }, []);

  const layerDefs = [
    { id: 'fire', label: 'Fire Detection', visible: layerVisibility.fire, color: '#FF6400' },
    { id: 'deforestation', label: 'Deforestation', visible: layerVisibility.deforestation, color: '#8B5A2B' },
    { id: 'convergence', label: 'Convergence Alerts', visible: layerVisibility.convergence, color: '#FF0000' },
    { id: 'airQuality', label: 'Air Quality', visible: layerVisibility.airQuality, color: '#00A7E1' },
  ];

  const abortRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleViewportChange = useCallback((viewport: Viewport) => {
    if (viewport.zoom < 3) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      abortRef.current?.abort();
      abortRef.current = new AbortController();
      try {
        const res = await fetch(
          `/api/fires?lat=${viewport.latitude}&lon=${viewport.longitude}&radius=500`,
          { signal: abortRef.current.signal }
        );
        if (res.ok) {
          const data = await res.json();
          setFireEvents(data.events ?? []);
        }
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          // Non-abort errors: stale data persists on map
        }
      }
    }, 500);
  }, []);

  useEffect(() => {
    fetch('/api/convergence?min_severity=WATCH')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.alerts) {
          setConvergenceAlerts(
            data.alerts.map((a: { ci_score: number; lat: number; lon: number; h3_cells?: string[] }) => ({
              h3Index: a.h3_cells?.[0] ?? '',
              ci: a.ci_score,
              lat: a.lat ?? 0,
              lon: a.lon ?? 0,
            }))
          );
        }
      })
      .catch(() => {/* convergence API not yet available — silent */});
  }, []);

  const layers = useMemo(() => {
    const result = [];
    if (layerVisibility.fire) result.push(buildFireLayer(fireEvents));
    if (layerVisibility.convergence) result.push(buildConvergenceLayer(convergenceAlerts));
    return result;
  }, [fireEvents, convergenceAlerts, layerVisibility]);

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
      <LayerControls layers={layerDefs} onToggle={toggleLayer} />
      {Boolean(hoveredFeature) && (
        <div className="absolute bottom-8 left-4 bg-black/80 text-white text-xs p-2 rounded font-mono pointer-events-none max-w-xs overflow-auto">
          <pre>{JSON.stringify(hoveredFeature, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
