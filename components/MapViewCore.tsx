"use client";

import { useEffect } from "react";
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
// leaflet CSS is imported in globals.css
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
  onMapClick?: (coords: { lat: number; lon: number }) => void;
  clickedMarkers?: Array<{ lat: number; lon: number; data?: any }>;
}

// Component to handle map events
function MapEventHandler({
  onZoomChange,
  onCursorMove,
  onMapClick,
}: {
  onZoomChange?: (zoom: number) => void;
  onCursorMove?: (coords: { lat: number; lon: number } | null) => void;
  onMapClick?: (coords: { lat: number; lon: number }) => void;
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
    click: (e) => {
      onMapClick?.({ lat: e.latlng.lat, lon: e.latlng.lng });
    },
  });

  return null;
}

// Component to update map center and handle resize
function MapCenterUpdater({ center }: { center: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center);
  }, [center, map]);

  // Invalidate size on mount to fix rendering issues
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 100);
    return () => clearTimeout(timer);
  }, [map]);

  return null;
}

export default function MapViewCore({
  center,
  zoom,
  layers,
  onZoomChange,
  onCursorMove,
  onMapClick,
  clickedMarkers = [],
}: MapViewCoreProps) {
  const markerIcon = createCustomIcon();

  return (
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

      {/* Clicked location markers with data */}
      {clickedMarkers.map((marker, idx) => (
        <Marker key={`clicked-${idx}`} position={[marker.lat, marker.lon]} icon={markerIcon}>
          <Popup>
            <div className="text-xs font-mono" style={{ minWidth: '300px', maxWidth: '350px' }}>
              {marker.data?.loading && (
                <div className="text-white-dim">
                  <span className="animate-pulse">&gt; ANALYZING_ENVIRONMENT...</span>
                </div>
              )}

              {marker.data?.error && (
                <div className="text-orange">
                  ERROR: {marker.data.error}
                </div>
              )}

              {marker.data?.assessment && (
                <>
                  <div className="mb-3 border-b-2 border-blue pb-2">
                    <div className="text-white-dim text-[10px]">ENVIRONMENTAL HEALTH</div>
                    <div className="flex items-baseline gap-2">
                      <div className="text-2xl font-bold text-blue">
                        {marker.data.assessment.overall_score}
                      </div>
                      <div className="text-sm text-white">
                        {marker.data.assessment.health_grade}
                      </div>
                    </div>
                  </div>

                  <div className="mb-2 border-b border-white-dim pb-2">
                    <div className="text-white-dim text-[10px]">COORDINATES</div>
                    <div className="text-white text-[10px]">
                      {marker.lat.toFixed(4)}°, {marker.lon.toFixed(4)}°
                    </div>
                  </div>

                  <div className="mb-2 border-b border-white-dim pb-2">
                    <div className="text-white-dim text-[10px] mb-1">SCORES</div>
                    {marker.data.assessment.scores.vegetation !== undefined && (
                      <div className="flex justify-between text-[10px]">
                        <span className="text-white-dim">Vegetation:</span>
                        <span className="text-blue font-bold">
                          {marker.data.assessment.scores.vegetation.toFixed(0)}/100
                        </span>
                      </div>
                    )}
                    {marker.data.assessment.scores.landcover !== undefined && (
                      <div className="flex justify-between text-[10px]">
                        <span className="text-white-dim">Land Cover:</span>
                        <span className="text-blue font-bold">
                          {marker.data.assessment.scores.landcover.toFixed(0)}/100
                        </span>
                      </div>
                    )}
                    {marker.data.assessment.scores.water !== undefined && (
                      <div className="flex justify-between text-[10px]">
                        <span className="text-white-dim">Water:</span>
                        <span className="text-blue font-bold">
                          {marker.data.assessment.scores.water.toFixed(0)}/100
                        </span>
                      </div>
                    )}
                  </div>

                  {marker.data.assessment.metrics && (
                    <div className="mb-2 border-b border-white-dim pb-2">
                      <div className="text-white-dim text-[10px] mb-1">METRICS</div>
                      {marker.data.assessment.metrics.ndvi && (
                        <div className="flex justify-between text-[10px]">
                          <span className="text-white-dim">NDVI:</span>
                          <span className="text-white">
                            {marker.data.assessment.metrics.ndvi.value}
                          </span>
                        </div>
                      )}
                      {marker.data.assessment.metrics.natural_landcover && (
                        <div className="flex justify-between text-[10px]">
                          <span className="text-white-dim">Natural Cover:</span>
                          <span className="text-white">
                            {marker.data.assessment.metrics.natural_landcover.value}%
                          </span>
                        </div>
                      )}
                      {marker.data.assessment.metrics.water_occurrence && (
                        <div className="flex justify-between text-[10px]">
                          <span className="text-white-dim">Water:</span>
                          <span className="text-white">
                            {marker.data.assessment.metrics.water_occurrence.value}%
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {marker.data.assessment.recommendations && marker.data.assessment.recommendations.length > 0 && (
                    <div className="mb-2">
                      <div className="text-white-dim text-[10px] mb-1">RECOMMENDATIONS</div>
                      {marker.data.assessment.recommendations.slice(0, 2).map((rec: string, i: number) => (
                        <div key={i} className="text-[9px] text-white-dim leading-tight mb-1">
                          • {rec}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="text-[8px] text-white-dim mt-2 pt-2 border-t border-white-dim">
                    Data: Sentinel-2, ESA WorldCover, JRC
                  </div>
                </>
              )}
            </div>
          </Popup>
        </Marker>
      ))}

      {/* Zoom control - positioned top right */}
      <ZoomControl position="topright" />

      {/* Event handlers */}
      <MapEventHandler
        onZoomChange={onZoomChange}
        onCursorMove={onCursorMove}
        onMapClick={onMapClick}
      />
      <MapCenterUpdater center={center} />
    </MapContainer>
  );
}
