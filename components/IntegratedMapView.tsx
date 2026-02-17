"use client";

import { useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import LocationDataPanel from "./LocationDataPanel";
import MapChatInterface from "./MapChatInterface";
import "leaflet/dist/leaflet.css";

// Dynamically import the map core
const IntegratedMapCore = dynamic(() => import("./IntegratedMapCore"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-code flex items-center justify-center">
      <div className="text-white-dim font-mono text-sm">
        <span className="text-blue">&gt;</span> LOADING_MAP
        <span className="cursor"></span>
      </div>
    </div>
  ),
});

export interface SelectedLocation {
  lat: number;
  lon: number;
  name?: string;
  country?: string;
}

export type TemporalView = "past" | "present" | "projected";

export default function IntegratedMapView() {
  const [selectedLocation, setSelectedLocation] = useState<SelectedLocation | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [temporalView, setTemporalView] = useState<TemporalView>("present");
  const [zoom, setZoom] = useState(3);
  const [cursorCoords, setCursorCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [locationName, setLocationName] = useState("");
  const [environmentalData, setEnvironmentalData] = useState<any>(null);

  // Reverse geocode when location changes
  useEffect(() => {
    if (!selectedLocation) {
      setLocationName("");
      return;
    }

    const geocode = async () => {
      try {
        const response = await fetch(
          `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${selectedLocation.lat}&longitude=${selectedLocation.lon}&count=1`
        );
        if (response.ok) {
          const data = await response.json();
          if (data.results?.[0]) {
            const r = data.results[0];
            setLocationName(`${r.name}${r.admin1 ? `, ${r.admin1}` : ""}${r.country ? `, ${r.country}` : ""}`);
            return;
          }
        }
      } catch (e) {}
      setLocationName(`${selectedLocation.lat.toFixed(4)}°, ${selectedLocation.lon.toFixed(4)}°`);
    };

    geocode();
  }, [selectedLocation]);

  // Fetch environmental data when location changes
  useEffect(() => {
    if (!selectedLocation) {
      setEnvironmentalData(null);
      return;
    }

    const fetchData = async () => {
      const { lat, lon } = selectedLocation;
      const name = locationName || `${lat.toFixed(2)}°, ${lon.toFixed(2)}°`;

      try {
        const [carbon, forest, soil, biodiversity, ocean, weather] = await Promise.all([
          fetch(`/api/carbon?location=${encodeURIComponent(name)}&lat=${lat}&lon=${lon}`).then(r => r.json()).catch(() => null),
          fetch(`/api/deforestation?location=${encodeURIComponent(name)}&lat=${lat}&lon=${lon}`).then(r => r.json()).catch(() => null),
          fetch(`/api/soil?location=${encodeURIComponent(name)}&lat=${lat}&lon=${lon}`).then(r => r.json()).catch(() => null),
          fetch(`/api/biodiversity?location=${encodeURIComponent(name)}&lat=${lat}&lon=${lon}`).then(r => r.json()).catch(() => null),
          fetch(`/api/ocean?lat=${lat}&lon=${lon}`).then(r => r.json()).catch(() => null),
          fetch(`/api/weather?city=${encodeURIComponent(name)}&lat=${lat}&lon=${lon}`).then(r => r.json()).catch(() => null),
        ]);

        setEnvironmentalData({ carbon, forest, soil, biodiversity, ocean, weather });
      } catch (e) {
        console.error("Failed to fetch environmental data:", e);
      }
    };

    // Small delay to allow geocoding to complete
    const timer = setTimeout(fetchData, 500);
    return () => clearTimeout(timer);
  }, [selectedLocation, locationName]);

  const handleMapClick = useCallback((lat: number, lon: number) => {
    setSelectedLocation({ lat, lon });
    setPanelOpen(true);
  }, []);

  const handleClosePanel = useCallback(() => {
    setPanelOpen(false);
  }, []);

  const toggleChat = useCallback(() => {
    setChatOpen(prev => !prev);
  }, []);

  return (
    <div className="h-screen w-screen bg-terminal overflow-hidden relative">
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-[1001] bg-terminal border-b border-white">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-4">
            <div className="font-mono text-sm">
              <span className="text-blue">[GAIA_MAP]</span>
              <span className="text-white-dim ml-2">INTEGRATED_ENVIRONMENTAL_VIEW</span>
            </div>
            <a
              href="/demo"
              className="text-[10px] font-mono text-white-dim hover:text-blue border border-white px-2 py-1 hover:border-blue transition-all"
            >
              &lt; DASHBOARD
            </a>
          </div>

          {/* Temporal View Toggle */}
          <div className="flex items-center gap-2">
            <span className="text-white-dim text-[10px] font-mono mr-2">TEMPORAL:</span>
            {(["past", "present", "projected"] as TemporalView[]).map((view) => (
              <button
                key={view}
                onClick={() => setTemporalView(view)}
                className={`px-3 py-1 border font-mono text-[10px] uppercase tracking-wider transition-all ${
                  temporalView === view
                    ? "border-blue bg-blue text-white"
                    : "border-white text-white-dim hover:border-blue hover:text-blue"
                }`}
              >
                {view === "past" && "HISTORICAL"}
                {view === "present" && "CURRENT"}
                {view === "projected" && "FORECAST"}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 text-[10px] font-mono text-white-dim">
            <span>ZOOM: <span className="text-blue">{zoom}</span></span>
            {cursorCoords && (
              <span>
                CURSOR: <span className="text-white">{cursorCoords.lat.toFixed(4)}°, {cursorCoords.lon.toFixed(4)}°</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="absolute inset-0 pt-[41px]">
        <IntegratedMapCore
          onMapClick={handleMapClick}
          onZoomChange={setZoom}
          onCursorMove={setCursorCoords}
          selectedLocation={selectedLocation}
        />
      </div>

      {/* Click instruction overlay */}
      {!selectedLocation && (
        <div className="absolute bottom-14 left-1/2 transform -translate-x-1/2 z-[1001]">
          <div className="bg-terminal border border-blue px-4 py-2">
            <div className="text-blue text-xs font-mono uppercase tracking-wider animate-pulse">
              <span className="text-white">&gt;</span> CLICK_ANYWHERE_TO_QUERY_LOCATION
            </div>
          </div>
        </div>
      )}

      {/* Chat toggle button */}
      <button
        onClick={toggleChat}
        className={`absolute bottom-12 left-4 z-[1001] px-4 py-3 border-2 font-mono text-sm uppercase tracking-wider transition-all flex items-center gap-2 ${
          chatOpen
            ? "border-blue bg-blue text-white"
            : "border-blue text-blue hover:bg-blue hover:text-white bg-terminal"
        }`}
      >
        <span className="text-lg">💬</span>
        <span>{chatOpen ? "CLOSE" : "ASK GAIA"}</span>
      </button>

      {/* Chat Interface */}
      <MapChatInterface
        location={selectedLocation}
        locationName={locationName}
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        environmentalData={environmentalData}
      />

      {/* Location Data Panel */}
      <LocationDataPanel
        location={selectedLocation}
        isOpen={panelOpen}
        onClose={handleClosePanel}
        temporalView={temporalView}
      />

      {/* Status bar */}
      <div className="absolute bottom-0 left-0 right-0 z-[1000] bg-terminal border-t border-blue px-4 py-2">
        <div className="flex justify-between text-[10px] font-mono text-white-dim">
          <div className="flex items-center gap-4">
            <span>SOURCE: <span className="text-blue">MULTI-API</span></span>
            <span>COVERAGE: <span className="text-blue">GLOBAL</span></span>
            <span>MODULES: <span className="text-blue">7 ACTIVE</span></span>
          </div>
          <div className="flex items-center gap-4">
            {selectedLocation && locationName && (
              <span className="text-white">{locationName}</span>
            )}
            {selectedLocation && (
              <span>
                <span className="text-blue">{selectedLocation.lat.toFixed(4)}°, {selectedLocation.lon.toFixed(4)}°</span>
              </span>
            )}
            {!selectedLocation && (
              <span>PROJECTION: <span className="text-blue">EPSG:3857</span></span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
