"use client";

import { useRef, useEffect } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { Viewport } from './types';

interface GaiaMapBaseProps {
  initialLat?: number;
  initialLon?: number;
  initialZoom?: number;
  onMapReady?: (map: maplibregl.Map) => void;
  onViewportChange?: (viewport: Viewport) => void;
  onMapClick?: (lat: number, lon: number) => void;
  className?: string;
}

// Free open-source basemap from MapLibre demo tiles
const BASEMAP_STYLE = 'https://demotiles.maplibre.org/style.json';

export function GaiaMapBase({
  initialLat = 20,
  initialLon = 0,
  initialZoom = 2,
  onMapReady,
  onViewportChange,
  onMapClick,
  className = 'w-full h-full',
}: GaiaMapBaseProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: BASEMAP_STYLE,
      center: [initialLon, initialLat],
      zoom: initialZoom,
      antialias: true,
    });

    map.addControl(new maplibregl.NavigationControl(), 'top-right');
    map.addControl(new maplibregl.ScaleControl(), 'bottom-left');

    map.on('load', () => {
      onMapReady?.(map);
    });

    map.on('moveend', () => {
      const center = map.getCenter();
      onViewportChange?.({
        latitude: center.lat,
        longitude: center.lng,
        zoom: map.getZoom(),
        bearing: map.getBearing(),
        pitch: map.getPitch(),
      });
    });

    map.on('click', (e) => {
      onMapClick?.(e.lngLat.lat, e.lngLat.lng);
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []); // intentionally empty — map initializes once

  return <div ref={containerRef} className={className} />;
}
