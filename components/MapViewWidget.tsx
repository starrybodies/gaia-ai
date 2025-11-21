"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// Dynamically import map to avoid SSR issues
const MapViewCore = dynamic(() => import("./MapViewCore"), {
  ssr: false,
  loading: () => (
    <div className="h-full min-h-[500px] border border-white bg-code flex items-center justify-center">
      <div className="text-white-dim font-mono text-sm">
        <span className="text-blue">&gt;</span> INITIALIZING_MAP_ENGINE
        <span className="cursor"></span>
      </div>
    </div>
  ),
});

export interface MapLayer {
  id: string;
  name: string;
  type: "tile" | "marker" | "heatmap";
  url?: string;
  active: boolean;
  opacity?: number;
}

interface MapViewWidgetProps {
  defaultLocation?: string;
  defaultLat?: number;
  defaultLon?: number;
  defaultZoom?: number;
}

const DEFAULT_LAYERS: MapLayer[] = [
  {
    id: "biodiversity",
    name: "BIODIVERSITY",
    type: "tile",
    url: "https://api.gbif.org/v2/map/occurrence/density/{z}/{x}/{y}@1x.png?style=green.point",
    active: true,
    opacity: 0.7,
  },
  {
    id: "satellite",
    name: "SATELLITE",
    type: "tile",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    active: false,
    opacity: 1,
  },
  {
    id: "terrain",
    name: "TERRAIN",
    type: "tile",
    url: "https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.png",
    active: false,
    opacity: 0.8,
  },
];

export default function MapViewWidget({
  defaultLocation = "Salt Spring Island, BC",
  defaultLat = 48.8167,
  defaultLon = -123.5,
  defaultZoom = 11,
}: MapViewWidgetProps) {
  const [layers, setLayers] = useState<MapLayer[]>(DEFAULT_LAYERS);
  const [coordinates, setCoordinates] = useState({ lat: defaultLat, lon: defaultLon });
  const [zoom, setZoom] = useState(defaultZoom);
  const [location, setLocation] = useState(defaultLocation);
  const [cursorCoords, setCursorCoords] = useState<{ lat: number; lon: number } | null>(null);

  const toggleLayer = (layerId: string) => {
    setLayers((prev) =>
      prev.map((layer) =>
        layer.id === layerId ? { ...layer, active: !layer.active } : layer
      )
    );
  };

  const handleLocationSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newLocation = formData.get("location") as string;
    if (newLocation.trim()) {
      setLocation(newLocation);
      // In production, geocode the location
      // For demo, keep current coordinates
    }
  };

  return (
    <div className="terminal-window p-6 h-full flex flex-col">
      <div className="window-header mb-4">
        <span className="text-blue">[MAP_VIEW_MODULE]</span>
        <div className="window-controls">
          <div className="window-control"></div>
          <div className="window-control"></div>
          <div className="window-control"></div>
        </div>
      </div>

      {/* Status banner */}
      <div className="mb-4 border border-blue bg-code p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-blue text-xs font-mono">
            <span className="status-indicator status-active"></span>
            <div>
              <div className="font-bold uppercase">GEOSPATIAL_ENGINE</div>
              <div className="text-[10px] text-white-dim">
                MULTI-LAYER ENVIRONMENTAL MAPPING
              </div>
            </div>
          </div>
          <div className="text-xs font-mono text-white-dim">
            ZOOM: <span className="text-blue">{zoom}</span>
          </div>
        </div>
      </div>

      {/* Location input */}
      <form onSubmit={handleLocationSubmit} className="mb-4">
        <div className="flex gap-2">
          <div className="flex-1 border border-white bg-code p-2 flex items-center">
            <span className="text-blue mr-2">&gt;</span>
            <input
              type="text"
              name="location"
              defaultValue={location}
              placeholder="ENTER_COORDINATES"
              className="bg-transparent border-none outline-none text-white font-mono text-sm flex-1 uppercase tracking-wider placeholder:text-white-dim placeholder:opacity-50"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 border-2 border-blue text-blue hover:bg-blue hover:text-white transition-all font-mono text-xs uppercase tracking-wider"
          >
            LOCATE
          </button>
        </div>
      </form>

      {/* Layer controls */}
      <div className="mb-4 flex flex-wrap gap-2">
        {layers.map((layer) => (
          <button
            key={layer.id}
            onClick={() => toggleLayer(layer.id)}
            className={`px-3 py-1 border font-mono text-xs uppercase tracking-wider transition-all ${
              layer.active
                ? "border-blue bg-blue text-white"
                : "border-white text-white-dim hover:border-blue hover:text-blue"
            }`}
          >
            {layer.active ? "[X]" : "[ ]"} {layer.name}
          </button>
        ))}
      </div>

      {/* Map container */}
      <div className="flex-1 min-h-[400px] relative">
        <MapViewCore
          center={[coordinates.lat, coordinates.lon]}
          zoom={zoom}
          layers={layers}
          onZoomChange={setZoom}
          onCursorMove={setCursorCoords}
        />

        {/* Coordinate overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-terminal bg-opacity-90 border-t border-white p-2 z-[1000]">
          <div className="flex justify-between text-[10px] font-mono">
            <div className="text-white-dim">
              CENTER: <span className="text-blue">{coordinates.lat.toFixed(4)}°N, {Math.abs(coordinates.lon).toFixed(4)}°W</span>
            </div>
            {cursorCoords && (
              <div className="text-white-dim">
                CURSOR: <span className="text-white">{cursorCoords.lat.toFixed(4)}°N, {Math.abs(cursorCoords.lon).toFixed(4)}°W</span>
              </div>
            )}
            <div className="text-white-dim">
              LAYERS: <span className="text-blue">{layers.filter(l => l.active).length}/{layers.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Info panel */}
      <div className="mt-4 border border-white bg-code p-3">
        <div className="text-xs text-white-dim font-mono space-y-1">
          <div>
            <span className="text-blue">&gt;</span> BIODIVERSITY: GBIF species occurrence density (2B+ records)
          </div>
          <div>
            <span className="text-blue">&gt;</span> SATELLITE: ESRI World Imagery (high-resolution)
          </div>
          <div>
            <span className="text-blue">&gt;</span> TERRAIN: Stamen terrain with hillshading
          </div>
        </div>
      </div>

      {/* Status bar */}
      <div className="mt-4 pt-3 border-t border-white flex justify-between text-[10px] text-white-dim uppercase tracking-widest">
        <div>
          LOCATION: <span className="text-blue">{location.toUpperCase()}</span>
        </div>
        <div>
          PROJECTION: <span className="text-blue">EPSG:3857</span>
        </div>
      </div>
    </div>
  );
}
