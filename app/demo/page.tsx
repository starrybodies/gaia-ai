import WeatherWidget from "@/components/WeatherWidget";
import AirQualityWidget from "@/components/AirQualityWidget";
import ClimateWidget from "@/components/ClimateWidget";
import BiodiversityWidget from "@/components/BiodiversityWidget";
import OceanWidget from "@/components/OceanWidget";
import SatelliteWidget from "@/components/SatelliteWidget";
import CarbonWidget from "@/components/CarbonWidget";
import SoilWidget from "@/components/SoilWidget";
import DeforestationWidget from "@/components/DeforestationWidget";

// Salt Spring Island, BC - default demo location
const DEFAULT_LOCATION = {
  name: "Salt Spring Island, BC",
  lat: 48.8167,
  lon: -123.5,
};

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
            LOCATION: {DEFAULT_LOCATION.name.toUpperCase()} • 9 ACTIVE DATA MODULES
          </p>
        </div>

        {/* System status */}
        <div className="terminal-window p-6 mb-8">
          <div className="window-header mb-4">
            <span className="text-white">[SYSTEM_LOG]</span>
          </div>
          <div className="font-mono text-xs space-y-1 text-white-dim">
            <div>
              <span className="text-blue">&gt;</span> INITIALIZING GAIA_AI... <span className="text-white">[OK]</span>
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
              <span className="text-blue">&gt;&gt;</span> ALL_SYSTEMS: OPERATIONAL • 9 MODULES ACTIVE
            </div>
          </div>
        </div>

        {/* Weather + Air Quality grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <WeatherWidget />
          <AirQualityWidget />
        </div>

        {/* Climate widget */}
        <div className="mb-8">
          <ClimateWidget />
        </div>

        {/* Satellite + Carbon grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
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
        </div>

        {/* Soil + Deforestation grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
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
        </div>

        {/* Biodiversity widget - full width with map */}
        <div className="mb-8">
          <BiodiversityWidget />
        </div>

        {/* Ocean widget */}
        <div className="mb-8">
          <OceanWidget />
        </div>

        {/* Module info */}
        <div className="border border-white bg-terminal p-6">
          <div className="text-xs text-white-dim font-mono space-y-2">
            <div>
              <span className="text-blue">&gt;&gt;</span> ACTIVE_MODULES: 9/9 [ALL OPERATIONAL]
            </div>
            <div>
              <span className="text-blue">&gt;&gt;</span> WEATHER • AIR_QUALITY • CLIMATE • SATELLITE • CARBON
            </div>
            <div>
              <span className="text-blue">&gt;&gt;</span> SOIL • DEFORESTATION • BIODIVERSITY • OCEAN
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
