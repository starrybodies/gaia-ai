export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main terminal window */}
          <div className="terminal-window p-8">
            <div className="window-header mb-6">
              <span className="text-white">[SYSTEM_INIT]</span>
              <div className="window-controls">
                <div className="window-control"></div>
                <div className="window-control"></div>
                <div className="window-control"></div>
              </div>
            </div>

            {/* Boot sequence */}
            <div className="font-mono text-xs sm:text-sm space-y-2 mb-8 text-white-dim">
              <div>
                <span className="text-blue">&gt;</span> INITIALIZING GAIA.AI ENVIRONMENTAL INTELLIGENCE...
              </div>
              <div>
                <span className="text-blue">&gt;</span> LOADING DATA SOURCES... <span className="text-white">[OK]</span>
              </div>
              <div>
                <span className="text-blue">&gt;</span> CONNECTING TO EARTH OBSERVATION NETWORKS... <span className="text-white">[OK]</span>
              </div>
              <div>
                <span className="text-blue">&gt;</span> AI SYSTEMS ONLINE... <span className="text-white">[OK]</span>
              </div>
            </div>

            {/* Main heading */}
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-6 font-mono">
              <span className="text-white glow-white">EARTH_INTELLIGENCE</span>
              <br />
              <span className="text-blue glow-blue">UNIVERSALLY_ACCESSIBLE</span>
              <span className="cursor"></span>
            </h1>

            {/* Description */}
            <div className="text-sm sm:text-base text-white-dim max-w-3xl mb-8 font-mono leading-relaxed">
              <span className="text-blue">&gt;</span> COMPREHENSIVE ENVIRONMENTAL DATA PLATFORM
              <br />
              <span className="text-blue">&gt;</span> AI-POWERED QUERY INTERFACE + MODULAR DASHBOARDS
              <br />
              <span className="text-blue">&gt;</span> REAL-TIME MONITORING: CLIMATE | WEATHER | AIR_QUALITY | BIODIVERSITY
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="/demo" className="btn btn-blue text-center">
                <span>&gt; LAUNCH_DASHBOARD</span>
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn text-center"
              >
                &gt; VIEW_SOURCE
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* What is this? */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="terminal-window p-8">
            <div className="window-header mb-6">
              <span className="text-blue">[WHAT_IS_THIS]</span>
            </div>

            <h2 className="text-3xl font-bold mb-6 text-white font-mono uppercase">
              &gt; THE PROBLEM
            </h2>
            <div className="space-y-4 text-sm text-white-dim font-mono leading-relaxed mb-8">
              <p>
                <span className="text-blue">&gt;&gt;</span> ENVIRONMENTAL DATA EXISTS IN SCATTERED, INCOMPATIBLE FORMATS
              </p>
              <p>
                <span className="text-blue">&gt;&gt;</span> ACCESSING IT REQUIRES TECHNICAL EXPERTISE, API KEYS, COMPLEX QUERIES
              </p>
              <p>
                <span className="text-blue">&gt;&gt;</span> CITIZENS, ACTIVISTS, AND SMALL ORGS LACK TOOLS TO UNDERSTAND EARTH'S VITAL SIGNS
              </p>
            </div>

            <h2 className="text-3xl font-bold mb-6 text-white font-mono uppercase">
              &gt; THE SOLUTION
            </h2>
            <div className="space-y-4 text-sm text-white-dim font-mono leading-relaxed">
              <p>
                <span className="text-blue">&gt;&gt;</span> GAIA.AI UNIFIES ENVIRONMENTAL DATA INTO A SINGLE, OPEN-SOURCE PLATFORM
              </p>
              <p>
                <span className="text-blue">&gt;&gt;</span> QUERY DATA IN NATURAL LANGUAGE. NO CODE REQUIRED.
              </p>
              <p>
                <span className="text-blue">&gt;&gt;</span> BUILD CUSTOM DASHBOARDS WITH DRAG-AND-DROP WIDGETS
              </p>
              <p>
                <span className="text-blue">&gt;&gt;</span> VISUALIZE TRENDS, EXPORT DATA, SHARE INSIGHTS
              </p>
              <p>
                <span className="text-blue">&gt;&gt;</span> 100% FREE. 100% OPEN-SOURCE. 100% TRANSPARENT.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Capabilities */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="terminal-window p-6 mb-8">
            <div className="window-header mb-4">
              <span className="text-blue">[CORE_CAPABILITIES]</span>
            </div>
            <h2 className="text-3xl font-bold font-mono text-white">
              &gt; WHAT_YOU_CAN_DO
            </h2>
          </div>

          {/* Capabilities grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                id: "01",
                title: "AI_QUERY_ENGINE",
                desc: "\"Show me air quality in Beijing\" → Get instant visualizations. Natural language processing interprets your intent.",
                icon: "▲",
              },
              {
                id: "02",
                title: "MODULAR_DASHBOARDS",
                desc: "Drag-and-drop widgets. Build custom interfaces. Save configurations. Share with your network.",
                icon: "◆",
              },
              {
                id: "03",
                title: "EARTH_VITALS",
                desc: "Global environmental metrics in real-time. Historical context. Trend analysis. Mission control for Earth.",
                icon: "●",
              },
              {
                id: "04",
                title: "DATA_VIZ",
                desc: "Interactive charts, 3D globes, heatmaps, geospatial overlays. Export for reports and presentations.",
                icon: "■",
              },
              {
                id: "05",
                title: "UNIFIED_API",
                desc: "One API to rule them all. NASA, NOAA, ESA, OpenAQ, GFW and more. All data attributed and transparent.",
                icon: "◗",
              },
              {
                id: "06",
                title: "KNOWLEDGE_BASE",
                desc: "Every metric includes context, methodology, and citations. AI explains complex concepts in plain language.",
                icon: "◉",
              },
            ].map((module, i) => (
              <div
                key={i}
                className="terminal-window p-6 hover:box-glow-blue transition-all group"
              >
                <div className="window-header mb-4">
                  <span className="text-blue">[{module.id}]</span>
                  <div className="window-controls">
                    <div className="window-control"></div>
                  </div>
                </div>

                <div className="text-4xl mb-4 text-white font-mono">
                  {module.icon}
                </div>

                <h3 className="text-base font-bold mb-3 text-white uppercase tracking-wider font-mono">
                  {module.title}
                </h3>

                <p className="text-xs text-white-dim leading-relaxed font-mono">
                  {module.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Data Sources */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="terminal-window p-8">
            <div className="window-header mb-6">
              <span className="text-blue">[DATA_SOURCES]</span>
              <div className="window-controls">
                <div className="window-control"></div>
                <div className="window-control"></div>
                <div className="window-control"></div>
              </div>
            </div>

            <h2 className="text-3xl font-bold mb-4 text-white font-mono">
              &gt; INTEGRATED_NETWORKS
            </h2>
            <p className="text-sm text-white-dim mb-8 font-mono">
              DIRECT CONNECTION TO WORLD&apos;S LEADING ENVIRONMENTAL DATA PROVIDERS
            </p>

            {/* Data source list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mb-6">
              {[
                { name: "NASA_EOSDIS", status: "READY" },
                { name: "NOAA_CDO", status: "READY" },
                { name: "OPENAQ", status: "READY" },
                { name: "GFW_API", status: "READY" },
                { name: "COPERNICUS", status: "READY" },
                { name: "PLANET_LABS", status: "READY" },
                { name: "GOOGLE_EE", status: "READY" },
                { name: "MSFT_PLANETARY", status: "READY" },
                { name: "CLIMATE_TRACE", status: "READY" },
                { name: "OPENWEATHER", status: "DEMO" },
                { name: "SENTINEL_HUB", status: "READY" },
                { name: "GBIF", status: "READY" },
              ].map((source, i) => (
                <div
                  key={i}
                  className="border border-white bg-code p-3 hover:border-blue transition-all font-mono group"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-white-dim group-hover:text-blue transition-colors">
                      {source.name}
                    </span>
                    <span className={`text-[10px] ${source.status === "DEMO" ? "text-orange" : "text-blue"}`}>
                      [{source.status}]
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Additional info */}
            <div className="border-t border-white pt-6">
              <div className="text-xs text-white-dim font-mono">
                <span className="text-blue">&gt;</span> EXPANDING NETWORK: +20 GOVERNMENTAL AND NGO DATABASES
                <br />
                <span className="text-blue">&gt;</span> ALL DATA: ATTRIBUTED • TRANSPARENT • TRACEABLE
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="terminal-window p-8">
            <div className="window-header mb-6">
              <span className="text-white">[PHILOSOPHY]</span>
              <div className="window-controls">
                <div className="window-control"></div>
                <div className="window-control"></div>
              </div>
            </div>

            <h2 className="text-3xl font-bold mb-6 text-white font-mono">
              &gt; CORE_PRINCIPLES
            </h2>

            <div className="space-y-4 text-sm text-white-dim font-mono leading-relaxed">
              <p>
                <span className="text-blue">&gt;&gt;</span> ENVIRONMENTAL DATA MUST BE <span className="text-white glow-white">UNIVERSALLY_ACCESSIBLE</span>
              </p>

              <p>
                <span className="text-blue">&gt;&gt;</span> NOT JUST FOR RESEARCHERS. FOR CITIZENS. FOR ACTIVISTS. FOR EVERYONE.
              </p>

              <p>
                <span className="text-blue">&gt;&gt;</span> RADICAL <span className="text-blue glow-blue">TRANSPARENCY</span> • <span className="text-blue glow-blue">DECENTRALIZATION</span> • <span className="text-blue glow-blue">OPEN_SOURCE</span>
              </p>

              <div className="border border-blue bg-code p-4 my-4">
                <div className="text-xs text-blue mb-2 uppercase tracking-widest">
                  [MISSION]
                </div>
                <p className="text-white">
                  BUILD TOOLS THAT EMPOWER HUMANITY TO UNDERSTAND AND PROTECT OUR LIVING PLANET.
                </p>
              </div>

              <p>
                <span className="text-blue">&gt;&gt;</span> JOIN THE NETWORK. CONTRIBUTE CODE. SHARE DATA. BUILD THE FUTURE.
              </p>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <a href="/about" className="btn btn-blue flex-1 text-center">
                &gt; LEARN_MORE
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="btn flex-1 text-center">
                &gt; CONTRIBUTE
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
