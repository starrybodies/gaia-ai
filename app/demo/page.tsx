import WeatherWidget from "@/components/WeatherWidget";
import AirQualityWidget from "@/components/AirQualityWidget";
import ClimateWidget from "@/components/ClimateWidget";

export default function DemoPage() {
  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page header */}
        <div className="terminal-window p-6 mb-8">
          <div className="window-header mb-4">
            <span className="text-blue">[DEMO_DASHBOARD]</span>
            <div className="window-controls">
              <div className="window-control"></div>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white font-mono mb-2 uppercase">
            &gt; ENVIRONMENTAL_DATA_DASHBOARD
          </h1>
          <p className="text-sm text-white-dim font-mono">
            REAL-TIME DATA VISUALIZATION • INTEGRATED DATA SOURCES
          </p>
        </div>

        {/* System status */}
        <div className="terminal-window p-6 mb-8">
          <div className="window-header mb-4">
            <span className="text-white">[SYSTEM_LOG]</span>
          </div>
          <div className="font-mono text-xs space-y-1 text-white-dim">
            <div>
              <span className="text-blue">&gt;</span> INITIALIZING DATA MODULES... <span className="text-white">[OK]</span>
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
              <span className="text-blue">&gt;</span> LOADING VISUALIZATION_ENGINE... <span className="text-white">[OK]</span>
            </div>
            <div>
              <span className="text-blue">&gt;</span> RECHARTS_LIBRARY: LOADED <span className="text-white">[OK]</span>
            </div>
            <div className="text-blue">
              <span className="text-blue">&gt;&gt;</span> ALL_SYSTEMS: OPERATIONAL
            </div>
          </div>
        </div>

        {/* Data widgets grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <WeatherWidget />
          <AirQualityWidget />
        </div>

        {/* Climate widget - full width */}
        <div className="mb-8">
          <ClimateWidget />
        </div>

        {/* Module info */}
        <div className="border border-white bg-terminal p-6">
          <div className="text-xs text-white-dim font-mono space-y-2">
            <div>
              <span className="text-blue">&gt;&gt;</span> ACTIVE_MODULES: WEATHER + AIR_QUALITY + CLIMATE [OPERATIONAL]
            </div>
            <div>
              <span className="text-blue">&gt;&gt;</span> DATA_SOURCES: OPENWEATHERMAP • OPENAQ • NOAA_CDO
            </div>
            <div>
              <span className="text-blue">&gt;&gt;</span> UPDATE_FREQUENCY: 10_MINUTES (AUTO-REFRESH)
            </div>
            <div>
              <span className="text-blue">&gt;&gt;</span> COVERAGE: GLOBAL • 10,000+ STATIONS • 100+ YEARS HISTORICAL
            </div>
            <div className="pt-2 border-t border-white mt-2">
              <span className="text-white">&gt;&gt;</span> COMING_SOON: BIODIVERSITY | OCEAN_METRICS | SATELLITE_IMAGERY | SOIL_DATA
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
