"use client";

import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { useEffect } from "react";
import type { LatLngExpression } from "leaflet";

interface BiodiversityMapProps {
  center: LatLngExpression;
  zoom: number;
}

// Component to update map center when props change
function MapUpdater({ center, zoom }: BiodiversityMapProps) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);

  return null;
}

export default function BiodiversityMap({ center, zoom }: BiodiversityMapProps) {
  return (
    <div className="border border-white" style={{ height: "400px", width: "100%" }}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: "100%", width: "100%", background: "#000000" }}
        zoomControl={true}
      >
        {/* Base map - CartoDB Dark Matter for cypherpunk aesthetic */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {/* GBIF Occurrence Density Layer - green points */}
        <TileLayer
          attribution='&copy; <a href="https://www.gbif.org">GBIF</a>'
          url="https://api.gbif.org/v2/map/occurrence/density/{z}/{x}/{y}@1x.png?style=green.point"
          opacity={0.8}
        />

        <MapUpdater center={center} zoom={zoom} />
      </MapContainer>
    </div>
  );
}
