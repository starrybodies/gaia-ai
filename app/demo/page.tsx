"use client";

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
];

export default function DemoPage() {
  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page header */}
        <div className="terminal-window p-6 mb-8">
          <div className="window-header mb-4">
            <span className="text-blue">[GAIA_DASHBOARD]</span>
            <div className="window-controls">
              <div className="window-control"></div>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white font-mono mb-2 uppercase">
            &gt; ENVIRONMENTAL_INTELLIGENCE_PLATFORM
          </h1>
          <p className="text-sm text-white-dim font-mono">
            LOCATION: {DEFAULT_LOCATION.name.toUpperCase()} • 10 ACTIVE DATA MODULES • DRAG TO REARRANGE
          </p>
        </div>

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
              <span className="text-blue">&gt;</span> LOADING VISUALIZATION_ENGINE... <span className="text-white">[OK]</span>
            </div>
            <div className="text-blue pt-1">
              <span className="text-blue">&gt;&gt;</span> ALL_SYSTEMS: OPERATIONAL • 10 MODULES ACTIVE
            </div>
          </div>
        </details>

        {/* Map View - Primary visualization */}
        <div className="mb-8">
          <MapViewWidget
            defaultLocation={DEFAULT_LOCATION.name}
            defaultLat={DEFAULT_LOCATION.lat}
            defaultLon={DEFAULT_LOCATION.lon}
            defaultZoom={11}
          />
        </div>

        {/* Dashboard with draggable widgets */}
        <DashboardLayout widgetIds={WIDGET_IDS}>
          <WeatherWidget />
          <AirQualityWidget />
          <ClimateWidget />
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
          <BiodiversityWidget />
          <OceanWidget />
        </DashboardLayout>

        {/* Module info */}
        <div className="border border-white bg-terminal p-6 mt-8">
          <div className="text-xs text-white-dim font-mono space-y-2">
            <div>
              <span className="text-blue">&gt;&gt;</span> ACTIVE_MODULES: 10/10 [ALL OPERATIONAL]
            </div>
            <div>
              <span className="text-blue">&gt;&gt;</span> MAP_VIEW • WEATHER • AIR_QUALITY • CLIMATE • SATELLITE
            </div>
            <div>
              <span className="text-blue">&gt;&gt;</span> CARBON • SOIL • DEFORESTATION • BIODIVERSITY • OCEAN
            </div>
            <div>
              <span className="text-blue">&gt;&gt;</span> DATA_SOURCES: 10+ APIs • GLOBAL COVERAGE • REAL-TIME
            </div>
            <div>
              <span className="text-blue">&gt;&gt;</span> COVERAGE: 2B+ SPECIES • 100+ YRS CLIMATE • FOREST ALERTS
            </div>
            <div className="pt-2 border-t border-white mt-2">
              <span className="text-white">&gt;&gt;</span> GAIA_AI: ENVIRONMENTAL INTELLIGENCE FOR ALL
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
