import WeatherWidget from "@/components/WeatherWidget";

export default function DemoPage() {
  return (
    <div className="bg-background min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="heading-primary mb-2">
                Environmental Dashboard
              </h1>
              <p className="text-stone">
                Real-time environmental data visualization and analysis
              </p>
            </div>
            <span className="badge badge-warning">Alpha Release</span>
          </div>
        </div>

        {/* System status */}
        <div className="data-card p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="status-indicator status-active"></span>
            <div>
              <h3 className="font-semibold text-charcoal">System Status</h3>
              <p className="text-xs text-stone">All systems operational</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="status-indicator status-active"></span>
              <span className="text-stone">Data modules loaded</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="status-indicator status-active"></span>
              <span className="text-stone">API connections active</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="status-indicator status-active"></span>
              <span className="text-stone">Visualization engine ready</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="status-indicator status-active"></span>
              <span className="text-stone">Chart library loaded</span>
            </div>
          </div>
        </div>

        {/* Weather widget */}
        <WeatherWidget />

        {/* Module info */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="data-card p-6">
            <h3 className="heading-tertiary mb-4">Current Capabilities</h3>
            <ul className="space-y-3 text-sm text-stone">
              <li className="flex items-start gap-2">
                <span className="text-rust-orange mt-0.5">→</span>
                <span><strong className="text-charcoal">Real-time Weather:</strong> Current conditions, hourly forecasts, and 5-day predictions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sky-blue mt-0.5">→</span>
                <span><strong className="text-charcoal">Interactive Charts:</strong> Temperature and humidity trend visualization</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-success mt-0.5">→</span>
                <span><strong className="text-charcoal">Location Search:</strong> Query weather data for any city worldwide</span>
              </li>
            </ul>
          </div>

          <div className="data-card p-6">
            <h3 className="heading-tertiary mb-4">Coming Soon</h3>
            <ul className="space-y-3 text-sm text-stone">
              <li className="flex items-start gap-2">
                <span className="text-warning mt-0.5">→</span>
                <span><strong className="text-charcoal">Air Quality Monitoring:</strong> PM2.5, PM10, and AQI data from global stations</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-warning mt-0.5">→</span>
                <span><strong className="text-charcoal">Climate Metrics:</strong> Long-term temperature trends and anomalies</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-warning mt-0.5">→</span>
                <span><strong className="text-charcoal">Ocean Data:</strong> Sea surface temperature and ocean health indicators</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Technical details */}
        <div className="mt-8 data-card p-6">
          <h3 className="heading-tertiary mb-4">Technical Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
            <div>
              <div className="metric-label mb-2">Data Source</div>
              <div className="text-charcoal font-semibold">OpenWeatherMap API</div>
              <div className="text-xs text-stone mt-1">Real-time weather data provider</div>
            </div>
            <div>
              <div className="metric-label mb-2">Update Frequency</div>
              <div className="text-charcoal font-semibold font-mono">10 minutes</div>
              <div className="text-xs text-stone mt-1">Automatic data refresh interval</div>
            </div>
            <div>
              <div className="metric-label mb-2">Visualization</div>
              <div className="text-charcoal font-semibold">Recharts Library</div>
              <div className="text-xs text-stone mt-1">Interactive chart rendering</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
