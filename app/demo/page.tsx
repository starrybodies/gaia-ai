"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import WeatherWidget from "@/components/WeatherWidget";
import AirQualityWidget from "@/components/AirQualityWidget";
import ClimateWidget from "@/components/ClimateWidget";
import BiodiversityWidget from "@/components/BiodiversityWidget";
import OceanWidget from "@/components/OceanWidget";
import SatelliteWidget from "@/components/SatelliteWidget";
import CarbonWidget from "@/components/CarbonWidget";
import SoilWidget from "@/components/SoilWidget";
import DeforestationWidget from "@/components/DeforestationWidget";
import EarthEngineWidget from "@/components/EarthEngineWidget";
import TabNavigation from "@/components/TabNavigation";
import IntroWalkthrough from "@/components/IntroWalkthrough";
import GaiaAnalyticsView from "@/components/GaiaAnalyticsView";
import ErrorBoundary from "@/components/ErrorBoundary";

// Dynamically import components that use browser APIs
const DashboardLayout = dynamic(() => import("@/components/DashboardLayout"), {
  ssr: false,
  loading: () => (
    <div className="text-white-dim font-mono text-sm">
      <span className="text-blue">&gt;</span> LOADING_DASHBOARD_LAYOUT
      <span className="cursor"></span>
    </div>
  ),
});

const MapViewWidget = dynamic(() => import("@/components/MapViewWidget"), {
  ssr: false,
  loading: () => (
    <div className="terminal-window p-6 h-[600px] flex items-center justify-center">
      <div className="text-white-dim font-mono text-sm">
        <span className="text-blue">&gt;</span> INITIALIZING_MAP_ENGINE
        <span className="cursor"></span>
      </div>
    </div>
  ),
});

// Salt Spring Island, BC - default demo location
const DEFAULT_LOCATION = {
  name: "Salt Spring Island, BC",
  lat: 48.8167,
  lon: -123.5,
};

const WIDGET_IDS = [
  "weather",
  "airquality",
  "climate",
  "satellite",
  "carbon",
  "soil",
  "deforestation",
  "biodiversity",
  "ocean",
  "earthengine",
];

const TABS = [
  { id: "dashboard", label: "DASHBOARD", shortcut: "D" },
  { id: "map", label: "MAP_VIEW", shortcut: "M" },
  { id: "analytics", label: "NATURAL_CAPITAL", shortcut: "N" },
];

export default function DemoPage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showWalkthrough, setShowWalkthrough] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Check if user has seen the walkthrough
  useEffect(() => {
    setIsClient(true);
    const hasSeenWalkthrough = localStorage.getItem("gaia_walkthrough_complete");
    if (!hasSeenWalkthrough) {
      setShowWalkthrough(true);
    }
  }, []);

  const handleWalkthroughComplete = () => {
    localStorage.setItem("gaia_walkthrough_complete", "true");
    setShowWalkthrough(false);
  };

  const handleWalkthroughSkip = () => {
    localStorage.setItem("gaia_walkthrough_complete", "true");
    setShowWalkthrough(false);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case "d":
          setActiveTab("dashboard");
          break;
        case "m":
          setActiveTab("map");
          break;
        case "n":
          setActiveTab("analytics");
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!isClient) {
    return (
      <div className="min-h-screen py-20 flex items-center justify-center">
        <div className="text-white-dim font-mono text-sm">
          <span className="text-blue">&gt;</span> INITIALIZING_GAIA
          <span className="cursor"></span>
        </div>
      </div>
    );
  }

  if (showWalkthrough) {
    return (
      <IntroWalkthrough
        onComplete={handleWalkthroughComplete}
        onSkip={handleWalkthroughSkip}
      />
    );
  }

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page header */}
        <div className="terminal-window p-6 mb-6">
          <div className="window-header mb-4">
            <span className="text-blue">[GAIA_DASHBOARD]</span>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowWalkthrough(true)}
                className="text-[10px] text-white-dim hover:text-blue font-mono uppercase transition-colors"
              >
                [?] HELP
              </button>
              <div className="window-controls">
                <div className="window-control"></div>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-white font-mono mb-2 uppercase">
                &gt; ENVIRONMENTAL_INTELLIGENCE_PLATFORM
              </h1>
              <p className="text-sm text-white-dim font-mono">
                LOCATION: {DEFAULT_LOCATION.name.toUpperCase()} • 11 ACTIVE DATA MODULES • KEYBOARD_SHORTCUTS_ENABLED
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <TabNavigation
          tabs={TABS}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Dashboard View */}
        {activeTab === "dashboard" && (
          <ErrorBoundary>
            {/* System status - collapsed */}
            <details className="terminal-window p-6 mb-8 group">
              <summary className="cursor-pointer list-none">
                <div className="window-header">
                  <span className="text-white">[SYSTEM_LOG]</span>
                  <span className="text-blue text-xs ml-2 group-open:hidden">CLICK_TO_EXPAND</span>
                  <span className="text-blue text-xs ml-2 hidden group-open:inline">CLICK_TO_COLLAPSE</span>
                </div>
              </summary>
              <div className="font-mono text-xs space-y-1 text-white-dim mt-4">
                <div>
                  <span className="text-blue">&gt;</span> INITIALIZING GAIA_AI... <span className="text-white">[OK]</span>
                </div>
                <div>
                  <span className="text-blue">&gt;</span> LOADING GEOSPATIAL_ENGINE... <span className="text-white">[OK]</span>
                </div>
                <div>
                  <span className="text-blue">&gt;</span> CONNECTING OPENWEATHERMAP_API... <span className="text-white">[OK]</span>
                </div>
                <div>
                  <span className="text-blue">&gt;</span> CONNECTING OPENAQ_API... <span className="text-white">[OK]</span>
                </div>
                <div>
                  <span className="text-blue">&gt;</span> CONNECTING NOAA_CDO_API... <span className="text-white">[OK]</span>
                </div>
                <div>
                  <span className="text-blue">&gt;</span> CONNECTING GBIF_API... <span className="text-white">[OK]</span>
                </div>
                <div>
                  <span className="text-blue">&gt;</span> CONNECTING NOAA_NDBC_API... <span className="text-white">[OK]</span>
                </div>
                <div>
                  <span className="text-blue">&gt;</span> CONNECTING NASA_EARTH_OBSERVATORY... <span className="text-white">[OK]</span>
                </div>
                <div>
                  <span className="text-blue">&gt;</span> CONNECTING GLOBAL_CARBON_PROJECT... <span className="text-white">[OK]</span>
                </div>
                <div>
                  <span className="text-blue">&gt;</span> CONNECTING ISRIC_SOILGRIDS... <span className="text-white">[OK]</span>
                </div>
                <div>
                  <span className="text-blue">&gt;</span> CONNECTING GLOBAL_FOREST_WATCH... <span className="text-white">[OK]</span>
                </div>
                <div>
                  <span className="text-blue">&gt;</span> CONNECTING GOOGLE_EARTH_ENGINE... <span className="text-white">[OK]</span>
                </div>
                <div>
                  <span className="text-blue">&gt;</span> LOADING VISUALIZATION_ENGINE... <span className="text-white">[OK]</span>
                </div>
                <div className="text-blue pt-1">
                  <span className="text-blue">&gt;&gt;</span> ALL_SYSTEMS: OPERATIONAL • 11 MODULES ACTIVE
                </div>
              </div>
            </details>

            {/* Dashboard with draggable widgets */}
            <DashboardLayout widgetIds={WIDGET_IDS}>
              <WeatherWidget
                defaultLocation={DEFAULT_LOCATION.name}
                defaultLat={DEFAULT_LOCATION.lat}
                defaultLon={DEFAULT_LOCATION.lon}
              />
              <AirQualityWidget
                defaultLocation={DEFAULT_LOCATION.name}
                defaultLat={DEFAULT_LOCATION.lat}
                defaultLon={DEFAULT_LOCATION.lon}
              />
              <ClimateWidget
                defaultLocation={DEFAULT_LOCATION.name}
                defaultLat={DEFAULT_LOCATION.lat}
                defaultLon={DEFAULT_LOCATION.lon}
              />
              <SatelliteWidget
                defaultLocation={DEFAULT_LOCATION.name}
                defaultLat={DEFAULT_LOCATION.lat}
                defaultLon={DEFAULT_LOCATION.lon}
              />
              <CarbonWidget
                defaultLocation={DEFAULT_LOCATION.name}
                defaultLat={DEFAULT_LOCATION.lat}
                defaultLon={DEFAULT_LOCATION.lon}
              />
              <SoilWidget
                defaultLocation={DEFAULT_LOCATION.name}
                defaultLat={DEFAULT_LOCATION.lat}
                defaultLon={DEFAULT_LOCATION.lon}
              />
              <DeforestationWidget
                defaultLocation={DEFAULT_LOCATION.name}
                defaultLat={DEFAULT_LOCATION.lat}
                defaultLon={DEFAULT_LOCATION.lon}
              />
              <BiodiversityWidget
                defaultLocation={DEFAULT_LOCATION.name}
                defaultLat={DEFAULT_LOCATION.lat}
                defaultLon={DEFAULT_LOCATION.lon}
              />
              <OceanWidget />
              <EarthEngineWidget
                defaultLocation={DEFAULT_LOCATION.name}
                defaultLat={DEFAULT_LOCATION.lat}
                defaultLon={DEFAULT_LOCATION.lon}
              />
            </DashboardLayout>

            {/* Module info */}
            <div className="border border-white bg-terminal p-6 mt-8">
              <div className="text-xs text-white-dim font-mono space-y-2">
                <div>
                  <span className="text-blue">&gt;&gt;</span> ACTIVE_MODULES: 11/11 [ALL OPERATIONAL]
                </div>
                <div>
                  <span className="text-blue">&gt;&gt;</span> MAP_VIEW • WEATHER • AIR_QUALITY • CLIMATE • SATELLITE
                </div>
                <div>
                  <span className="text-blue">&gt;&gt;</span> CARBON • SOIL • DEFORESTATION • BIODIVERSITY • OCEAN
                </div>
                <div>
                  <span className="text-blue">&gt;&gt;</span> EARTH_ENGINE • SENTINEL-2 • MODIS • ESA WORLDCOVER
                </div>
                <div>
                  <span className="text-blue">&gt;&gt;</span> DATA_SOURCES: 15+ APIs • GLOBAL COVERAGE • REAL-TIME
                </div>
                <div>
                  <span className="text-blue">&gt;&gt;</span> COVERAGE: 2B+ SPECIES • 100+ YRS CLIMATE • FOREST ALERTS • NDVI
                </div>
                <div className="pt-2 border-t border-white mt-2">
                  <span className="text-white">&gt;&gt;</span> GAIA_AI: ENVIRONMENTAL INTELLIGENCE FOR ALL
                </div>
              </div>
            </div>
          </ErrorBoundary>
        )}

        {/* Map View */}
        {activeTab === "map" && (
          <ErrorBoundary>
            <div className="space-y-6">
            <MapViewWidget
              defaultLocation={DEFAULT_LOCATION.name}
              defaultLat={DEFAULT_LOCATION.lat}
              defaultLon={DEFAULT_LOCATION.lon}
              defaultZoom={11}
            />

            {/* Quick actions */}
            <div className="terminal-window p-6">
              <div className="window-header mb-4">
                <span className="text-blue">[MAP_CONTROLS]</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button className="border border-white p-3 text-xs font-mono uppercase hover:bg-white hover:text-background transition-all">
                  <span className="text-blue">[S]</span> SATELLITE_VIEW
                </button>
                <button className="border border-white p-3 text-xs font-mono uppercase hover:bg-white hover:text-background transition-all">
                  <span className="text-blue">[T]</span> TERRAIN_VIEW
                </button>
                <button className="border border-white p-3 text-xs font-mono uppercase hover:bg-white hover:text-background transition-all">
                  <span className="text-blue">[L]</span> TOGGLE_LAYERS
                </button>
                <button className="border border-white p-3 text-xs font-mono uppercase hover:bg-white hover:text-background transition-all">
                  <span className="text-blue">[F]</span> FULLSCREEN
                </button>
              </div>
              <div className="mt-4 text-[10px] text-white-dim font-mono">
                <span className="text-blue">&gt;</span> CLICK_ANYWHERE_ON_MAP_TO_QUERY_ENVIRONMENTAL_DATA
              </div>
            </div>
            </div>
          </ErrorBoundary>
        )}

        {/* Analytics View */}
        {activeTab === "analytics" && (
          <ErrorBoundary>
            <GaiaAnalyticsView
            lat={DEFAULT_LOCATION.lat}
            lon={DEFAULT_LOCATION.lon}
            locationName={DEFAULT_LOCATION.name}
          />
          </ErrorBoundary>
        )}
      </div>
    </div>
  );
}
