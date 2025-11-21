export default function Home() {
  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-cream rounded-full border border-border mb-6">
              <span className="status-indicator status-active"></span>
              <span className="text-xs font-semibold text-stone">
                Real-time Environmental Intelligence
              </span>
            </div>

            <h1 className="heading-primary mb-6">
              Earth's Vital Data,{" "}
              <span className="text-rust-orange">Universally Accessible</span>
            </h1>

            <p className="text-lg text-stone leading-relaxed mb-8 max-w-3xl mx-auto">
              Comprehensive environmental intelligence platform providing real-time access to climate, weather, air quality, and biodiversity data from the world's leading sources—powered by AI.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <a href="/demo" className="btn btn-primary">
                Explore Dashboard
              </a>
              <a
                href="/about"
                className="btn btn-outline"
              >
                Learn More
              </a>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {[
                { label: "Data Sources", value: "10+", color: "sky-blue" },
                { label: "Metrics", value: "100+", color: "rust-orange" },
                { label: "Coverage", value: "Global", color: "success" },
                { label: "License", value: "MIT", color: "warning" },
              ].map((stat, i) => (
                <div key={i} className="data-card p-4 text-center">
                  <div
                    className={`metric-value text-3xl mb-1 text-${stat.color}`}
                  >
                    {stat.value}
                  </div>
                  <div className="metric-label text-xs">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Data Categories */}
      <section className="py-16 bg-cream/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="heading-secondary mb-4">
              Comprehensive Environmental Data
            </h2>
            <p className="text-stone max-w-2xl mx-auto">
              Access real-time, historical, and projected data across multiple environmental domains
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Climate & Weather",
                description:
                  "Real-time weather conditions, forecasts, temperature trends, precipitation patterns, and climate change indicators",
                icon: "🌡️",
                metrics: ["Temperature", "Precipitation", "Wind Patterns"],
                color: "sky-blue",
              },
              {
                title: "Air Quality",
                description:
                  "PM2.5, PM10, CO2, NO2, ozone levels, and air quality indices from thousands of monitoring stations worldwide",
                icon: "💨",
                metrics: ["PM2.5", "AQI", "Pollutants"],
                color: "rust-orange",
              },
              {
                title: "Ocean & Water",
                description:
                  "Sea surface temperature, ocean currents, salinity, acidification, and freshwater quality metrics",
                icon: "🌊",
                metrics: ["Temperature", "pH Levels", "Salinity"],
                color: "data-primary",
              },
              {
                title: "Biodiversity",
                description:
                  "Species observations, habitat monitoring, ecosystem health, and conservation status data",
                icon: "🌿",
                metrics: ["Species Count", "Habitat Loss", "Conservation"],
                color: "data-tertiary",
              },
              {
                title: "Land & Forests",
                description:
                  "Deforestation rates, land cover changes, agricultural data, and vegetation health indices",
                icon: "🌲",
                metrics: ["Forest Cover", "Land Use", "Vegetation"],
                color: "success",
              },
              {
                title: "Energy & Emissions",
                description:
                  "Carbon emissions, renewable energy production, fossil fuel consumption, and emission tracking",
                icon: "⚡",
                metrics: ["CO2 Emissions", "Renewables", "Energy Mix"],
                color: "warning",
              },
            ].map((category, i) => (
              <div
                key={i}
                className="data-module hover:shadow-lg transition-all group"
              >
                <div className="flex items-start gap-3 mb-4">
                  <span className="text-4xl">{category.icon}</span>
                  <div className="flex-1">
                    <h3 className="heading-tertiary text-lg mb-2">
                      {category.title}
                    </h3>
                  </div>
                </div>

                <p className="text-sm text-stone leading-relaxed mb-4">
                  {category.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {category.metrics.map((metric, j) => (
                    <span
                      key={j}
                      className="badge badge-primary text-[10px]"
                    >
                      {metric}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Data Preview */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="data-card p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="heading-secondary mb-2">
                  Real-Time Data Access
                </h2>
                <p className="text-stone">
                  Live environmental metrics updated continuously
                </p>
              </div>
              <a href="/demo" className="btn btn-primary">
                View Dashboard
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  metric: "Global Temp",
                  value: "+1.1°C",
                  trend: "↑",
                  status: "warning",
                },
                {
                  metric: "CO2 Level",
                  value: "419 ppm",
                  trend: "↑",
                  status: "error",
                },
                {
                  metric: "Forest Cover",
                  value: "31.2%",
                  trend: "↓",
                  status: "warning",
                },
                {
                  metric: "Renewables",
                  value: "29.5%",
                  trend: "↑",
                  status: "success",
                },
              ].map((item, i) => (
                <div key={i} className="text-center p-4 bg-cream rounded-lg">
                  <div className="metric-label mb-2">{item.metric}</div>
                  <div className="flex items-center justify-center gap-2">
                    <span className="metric-value text-3xl">{item.value}</span>
                    <span
                      className={`text-2xl ${
                        item.status === "success"
                          ? "text-success"
                          : item.status === "warning"
                          ? "text-warning"
                          : "text-error"
                      }`}
                    >
                      {item.trend}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Data Sources */}
      <section className="py-16 bg-cream/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="heading-secondary mb-4">
              Integrated Data Sources
            </h2>
            <p className="text-stone max-w-2xl mx-auto">
              Connected to the world's leading environmental monitoring networks
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { name: "NASA EOSDIS", status: "active" },
              { name: "NOAA", status: "active" },
              { name: "OpenAQ", status: "active" },
              { name: "Copernicus", status: "active" },
              { name: "Planet Labs", status: "active" },
              { name: "Google Earth Engine", status: "active" },
              { name: "GBIF", status: "active" },
              { name: "Global Forest Watch", status: "active" },
              { name: "Climate TRACE", status: "active" },
              { name: "OpenWeatherMap", status: "active" },
            ].map((source, i) => (
              <div
                key={i}
                className="data-card p-4 text-center hover:border-sky-blue transition-all"
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span
                    className={`status-indicator status-${source.status}`}
                  ></span>
                </div>
                <div className="text-xs font-semibold text-charcoal">
                  {source.name}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <a
              href="/about#data"
              className="text-sm text-rust-orange hover:text-rust-orange-dark font-semibold inline-flex items-center gap-2"
            >
              View all data sources →
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="data-card p-8 sm:p-12 text-center gradient-warm">
            <h2 className="heading-secondary mb-4 text-charcoal">
              Start Exploring Environmental Data
            </h2>
            <p className="text-stone mb-8 max-w-2xl mx-auto">
              Access comprehensive environmental intelligence through our AI-powered platform. Real-time monitoring, historical analysis, and future projections—all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/demo" className="btn btn-secondary">
                Launch Dashboard
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
              >
                View on GitHub
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
