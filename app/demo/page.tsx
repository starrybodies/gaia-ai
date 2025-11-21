import WeatherWidget from "@/components/WeatherWidget";

export default function DemoPage() {
  return (
    <div className="bg-black min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page header */}
        <div className="terminal-window p-6 mb-8">
          <div className="window-header mb-4">
            <span className="text-matrix-green">[SYSTEM_DEMO]</span>
            <div className="window-controls">
              <div className="window-control"></div>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-matrix-green font-mono mb-2">
            &gt; DATA_INTEGRATION_DEMO
          </h1>
          <p className="text-sm text-terminal-gray font-mono">
            REAL-TIME ENVIRONMENTAL DATA VISUALIZATION • PROOF_OF_CONCEPT
          </p>
        </div>

        {/* Boot sequence */}
        <div className="terminal-window p-6 mb-8">
          <div className="window-header mb-4">
            <span className="text-neon-cyan">[SYSTEM_LOG]</span>
          </div>
          <div className="font-mono text-xs space-y-1 text-terminal-gray">
            <div>
              <span className="text-matrix-green">&gt;</span> INITIALIZING DATA
              MODULES... <span className="text-neon-cyan">[OK]</span>
            </div>
            <div>
              <span className="text-matrix-green">&gt;</span> CONNECTING
              OPENWEATHERMAP_API... <span className="text-neon-cyan">[OK]</span>
            </div>
            <div>
              <span className="text-matrix-green">&gt;</span> LOADING
              VISUALIZATION_ENGINE... <span className="text-neon-cyan">[OK]</span>
            </div>
            <div>
              <span className="text-matrix-green">&gt;</span> RECHARTS_LIBRARY:
              LOADED <span className="text-neon-cyan">[OK]</span>
            </div>
            <div className="text-matrix-green">
              <span className="text-matrix-green">&gt;&gt;</span> ALL_SYSTEMS:
              OPERATIONAL
            </div>
          </div>
        </div>

        {/* Weather widget */}
        <WeatherWidget />

        {/* Status info */}
        <div className="mt-8 border border-matrix-green/40 bg-terminal-dark p-6">
          <div className="text-xs text-terminal-gray font-mono space-y-2">
            <div>
              <span className="text-matrix-green">&gt;&gt;</span> MODULE_STATUS:
              WEATHER_MODULE [OPERATIONAL]
            </div>
            <div>
              <span className="text-matrix-green">&gt;&gt;</span> DATA_SOURCE:
              OPENWEATHERMAP_API
            </div>
            <div>
              <span className="text-matrix-green">&gt;&gt;</span> UPDATE_FREQUENCY:
              10_MINUTES
            </div>
            <div>
              <span className="text-matrix-green">&gt;&gt;</span> FEATURES:
              CURRENT_WEATHER | 24H_FORECAST | 5DAY_FORECAST
            </div>
            <div className="pt-2 border-t border-matrix-green/20 mt-2">
              <span className="text-neon-cyan">&gt;&gt;</span> NEXT_MODULES:
              AIR_QUALITY | CLIMATE_DATA | OCEAN_METRICS
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
