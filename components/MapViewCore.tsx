"use client";

import { useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
  ZoomControl,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { MapLayer } from "./MapViewWidget";

// Custom dark-styled marker icon
const createCustomIcon = () => {
  return L.divIcon({
    className: "custom-marker",
    html: `
      <div style="
        width: 24px;
        height: 24px;
        background: #00A7E1;
        border: 2px solid #FFFFFF;
        border-radius: 50%;
        box-shadow: 0 0 10px rgba(0, 167, 225, 0.5);
        position: relative;
      ">
        <div style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 8px;
          height: 8px;
          background: #FFFFFF;
          border-radius: 50%;
        "></div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });
};

interface MapViewCoreProps {
  center: [number, number];
  zoom: number;
  layers: MapLayer[];
  onZoomChange?: (zoom: number) => void;
  onCursorMove?: (coords: { lat: number; lon: number } | null) => void;
}

// Component to handle map events
function MapEventHandler({
  onZoomChange,
  onCursorMove,
}: {
  onZoomChange?: (zoom: number) => void;
  onCursorMove?: (coords: { lat: number; lon: number } | null) => void;
}) {
  const map = useMapEvents({
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

// Component to update map center
function MapCenterUpdater({ center }: { center: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center);
  }, [center, map]);

  return null;
}

export default function MapViewCore({
  center,
  zoom,
  layers,
  onZoomChange,
  onCursorMove,
}: MapViewCoreProps) {
  const markerIcon = createCustomIcon();

  return (
    <>
      {/* Custom CSS for dark map styling */}
      <style jsx global>{`
        .leaflet-container {
          background: #1a1a1a;
          font-family: monospace;
        }

        /* Dark tile filter for CartoDB */
        .dark-tiles {
          filter: invert(1) hue-rotate(180deg) brightness(0.9) contrast(0.9);
        }

        /* Custom zoom controls */
        .leaflet-control-zoom {
          border: 1px solid #ffffff !important;
          border-radius: 0 !important;
          background: #D2691E !important;
        }

        .leaflet-control-zoom a {
          background: #D2691E !important;
          color: #ffffff !important;
          border: none !important;
          border-bottom: 1px solid #ffffff !important;
          font-family: monospace !important;
          font-weight: bold !important;
          width: 30px !important;
          height: 30px !important;
          line-height: 30px !important;
        }

        .leaflet-control-zoom a:hover {
          background: #00A7E1 !important;
          color: #ffffff !important;
        }

        .leaflet-control-zoom a:last-child {
          border-bottom: none !important;
        }

        /* Attribution styling */
        .leaflet-control-attribution {
          background: rgba(210, 105, 30, 0.9) !important;
          color: #ffffff !important;
          font-family: monospace !important;
          font-size: 9px !important;
          padding: 2px 6px !important;
        }

        .leaflet-control-attribution a {
          color: #00A7E1 !important;
        }

        /* Popup styling */
        .leaflet-popup-content-wrapper {
          background: #D2691E !important;
          border: 1px solid #ffffff !important;
          border-radius: 0 !important;
          color: #ffffff !important;
          font-family: monospace !important;
        }

        .leaflet-popup-tip {
          background: #D2691E !important;
          border: 1px solid #ffffff !important;
        }

        .leaflet-popup-close-button {
          color: #ffffff !important;
        }

        /* Scale control */
        .leaflet-control-scale-line {
          background: rgba(210, 105, 30, 0.9) !important;
          border: 1px solid #ffffff !important;
          border-top: none !important;
          color: #ffffff !important;
          font-family: monospace !important;
          font-size: 10px !important;
        }

        /* Custom marker pulse animation */
        @keyframes marker-pulse {
          0% { box-shadow: 0 0 0 0 rgba(0, 167, 225, 0.5); }
          70% { box-shadow: 0 0 0 15px rgba(0, 167, 225, 0); }
          100% { box-shadow: 0 0 0 0 rgba(0, 167, 225, 0); }
        }

        .custom-marker > div {
          animation: marker-pulse 2s infinite;
        }
      `}</style>

      <MapContainer
        center={center}
        zoom={zoom}
        className="h-full w-full"
        zoomControl={false}
        attributionControl={true}
      >
        {/* Dark base layer - CartoDB Dark Matter */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        />

        {/* Dynamic overlay layers */}
        {layers
          .filter((layer) => layer.active && layer.type === "tile" && layer.url)
          .map((layer) => (
            <TileLayer
              key={layer.id}
              url={layer.url!}
              opacity={layer.opacity || 0.7}
              attribution={`${layer.name} Layer`}
            />
          ))}

        {/* Center marker */}
        <Marker position={center} icon={markerIcon}>
          <Popup>
            <div className="text-xs uppercase tracking-wider">
              <div className="font-bold mb-1">LOCATION_MARKER</div>
              <div>LAT: {center[0].toFixed(4)}</div>
              <div>LON: {center[1].toFixed(4)}</div>
            </div>
          </Popup>
        </Marker>

        {/* Zoom control - positioned top right */}
        <ZoomControl position="topright" />

        {/* Event handlers */}
        <MapEventHandler onZoomChange={onZoomChange} onCursorMove={onCursorMove} />
        <MapCenterUpdater center={center} />
      </MapContainer>
    </>
  );
}
