"use client";

import { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
  ZoomControl,
} from "react-leaflet";
import L from "leaflet";
import type { SelectedLocation } from "./IntegratedMapView";

// Custom marker for selected location
const createSelectedIcon = () => {
  return L.divIcon({
    className: "selected-marker",
    html: `
      <div style="
        width: 32px;
        height: 32px;
        background: #00A7E1;
        border: 3px solid #FFFFFF;
        border-radius: 50%;
        box-shadow: 0 0 20px rgba(0, 167, 225, 0.8);
        animation: pulse 2s infinite;
        position: relative;
      ">
        <div style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 10px;
          height: 10px;
          background: #FFFFFF;
          border-radius: 50%;
        "></div>
      </div>
      <style>
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 20px rgba(0, 167, 225, 0.8); }
          50% { box-shadow: 0 0 40px rgba(0, 167, 225, 1); }
        }
      </style>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

interface IntegratedMapCoreProps {
  onMapClick: (lat: number, lon: number) => void;
  onZoomChange?: (zoom: number) => void;
  onCursorMove?: (coords: { lat: number; lon: number } | null) => void;
  selectedLocation: SelectedLocation | null;
}

// Component to handle map events
function MapEventHandler({
  onMapClick,
  onZoomChange,
  onCursorMove,
}: {
  onMapClick: (lat: number, lon: number) => void;
  onZoomChange?: (zoom: number) => void;
  onCursorMove?: (coords: { lat: number; lon: number } | null) => void;
}) {
  const map = useMapEvents({
    click: (e) => {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
    zoomend: () => {
      onZoomChange?.(map.getZoom());
    },
    mousemove: (e) => {
      onCursorMove?.({ lat: e.latlng.lat, lon: e.latlng.lng });
    },
    mouseout: () => {
      onCursorMove?.(null);
    },
  });

  return null;
}

// Component to fly to selected location
function MapFlyTo({ location }: { location: SelectedLocation | null }) {
  const map = useMap();

  useEffect(() => {
    if (location) {
      map.flyTo([location.lat, location.lon], Math.max(map.getZoom(), 8), {
        duration: 1,
      });
    }
  }, [location, map]);

  useEffect(() => {
    // Fix map size on mount
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 100);
    return () => clearTimeout(timer);
  }, [map]);

  return null;
}

export default function IntegratedMapCore({
  onMapClick,
  onZoomChange,
  onCursorMove,
  selectedLocation,
}: IntegratedMapCoreProps) {
  const selectedIcon = createSelectedIcon();

  return (
    <MapContainer
      center={[30, 0]}
      zoom={3}
      className="h-full w-full"
      zoomControl={false}
      attributionControl={false}
      style={{ background: "#1a1a1a" }}
    >
      {/* Dark base layer */}
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; CARTO'
      />

      {/* Environmental overlay - GBIF biodiversity density */}
      <TileLayer
        url="https://api.gbif.org/v2/map/occurrence/density/{z}/{x}/{y}@1x.png?style=green.point"
        opacity={0.5}
      />

      {/* Selected location marker */}
      {selectedLocation && (
        <Marker
          position={[selectedLocation.lat, selectedLocation.lon]}
          icon={selectedIcon}
        />
      )}

      {/* Zoom control */}
      <ZoomControl position="bottomright" />

      {/* Event handlers */}
      <MapEventHandler
        onMapClick={onMapClick}
        onZoomChange={onZoomChange}
        onCursorMove={onCursorMove}
      />
      <MapFlyTo location={selectedLocation} />
    </MapContainer>
  );
}
