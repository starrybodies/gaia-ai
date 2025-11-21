export default function Home() {
  return (
    <div className="bg-black min-h-screen">
      {/* Hero Section - Terminal Boot Sequence */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main terminal window */}
          <div className="terminal-window p-8 mb-8">
            <div className="window-header mb-6">
              <span className="text-matrix-green">[SYSTEM_INIT]</span>
              <div className="window-controls">
                <div className="window-control"></div>
                <div className="window-control"></div>
                <div className="window-control"></div>
              </div>
            </div>

            {/* Boot sequence */}
            <div className="font-mono text-xs sm:text-sm space-y-2 mb-8 text-terminal-gray">
              <div>
                <span className="text-matrix-green">&gt;</span> INITIALIZING
                GAIA.AI ENVIRONMENTAL INTELLIGENCE SYSTEM...
              </div>
              <div>
                <span className="text-matrix-green">&gt;</span> LOADING DATA
                SOURCES... <span className="text-neon-cyan">[OK]</span>
              </div>
              <div>
                <span className="text-matrix-green">&gt;</span> CONNECTING TO
                EARTH OBSERVATION NETWORKS...{" "}
                <span className="text-neon-cyan">[OK]</span>
              </div>
              <div>
                <span className="text-matrix-green">&gt;</span> AI SYSTEMS
                ONLINE... <span className="text-neon-cyan">[OK]</span>
              </div>
            </div>

            {/* Main heading */}
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-6 font-mono">
              <span className="text-matrix-green glow-green">
                EARTH_INTELLIGENCE
              </span>
              <br />
              <span className="text-neon-cyan glow-cyan">
                UNIVERSALLY_ACCESSIBLE
              </span>
              <span className="cursor"></span>
            </h1>

            {/* Description */}
            <div className="text-sm sm:text-base text-terminal-gray max-w-3xl mb-8 font-mono leading-relaxed">
              <span className="text-matrix-green">&gt;</span> COMPREHENSIVE
              ENVIRONMENTAL DATA PLATFORM
              <br />
              <span className="text-matrix-green">&gt;</span> AI-POWERED QUERY
              INTERFACE + MODULAR DASHBOARDS
              <br />
              <span className="text-matrix-green">&gt;</span> REAL-TIME
              MONITORING: CLIMATE | WEATHER | AIR_QUALITY | BIODIVERSITY
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <a
                href="/demo"
                className="px-6 py-3 bg-black border-2 border-matrix-green text-matrix-green hover:bg-matrix-green hover:text-black transition-all font-mono text-sm uppercase tracking-wider relative group text-center"
              >
                <span className="relative z-10">
                  &gt; LAUNCH_DASHBOARD.EXE
                </span>
                <div className="absolute inset-0 box-glow-green opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-black border-2 border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-black transition-all font-mono text-sm uppercase tracking-wider text-center"
              >
                &gt; VIEW_SOURCE.GIT
              </a>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                {
                  label: "DATA_SOURCES",
                  value: "05+",
                  color: "matrix-green",
                },
                {
                  label: "METRICS",
                  value: "100+",
                  color: "neon-cyan",
                },
                {
                  label: "UPTIME",
                  value: "24/7",
                  color: "neon-blue",
                },
                {
                  label: "LICENSE",
                  value: "MIT",
                  color: "neon-magenta",
                },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="border border-matrix-green/40 bg-terminal-dark p-3 hover:border-matrix-green hover:box-glow-green transition-all"
                >
                  <div
                    className={`text-2xl sm:text-3xl font-bold mb-1 text-${stat.color} font-mono`}
                  >
                    {stat.value}
                  </div>
                  <div className="text-[10px] text-terminal-gray uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Status indicator */}
          <div className="flex items-center justify-center gap-2 text-xs text-terminal-gray uppercase tracking-widest">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-matrix-green opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-matrix-green"></span>
            </span>
            <span>ALPHA_v0.1.0 • OPEN_SOURCE • DECENTRALIZED</span>
          </div>
        </div>
      </section>

      {/* System Modules Section */}
      <section id="features" className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="terminal-window p-6 mb-8">
            <div className="window-header mb-4">
              <span className="text-neon-cyan">[SYSTEM_MODULES]</span>
            </div>
            <h2 className="text-3xl font-bold font-mono text-matrix-green">
              &gt; CORE_CAPABILITIES
            </h2>
            <p className="text-sm text-terminal-gray mt-2 font-mono">
              MODULAR ARCHITECTURE FOR COMPREHENSIVE EARTH MONITORING
            </p>
          </div>

          {/* Modules grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                id: "MODULE_01",
                title: "AI_QUERY_ENGINE",
                desc: "Natural language processing for environmental data queries. AI interprets intent and generates contextual visualizations.",
                color: "matrix-green",
                icon: "▲",
              },
              {
                id: "MODULE_02",
                title: "DASHBOARD_BUILDER",
                desc: "Modular widget system with drag-and-drop. Build custom interfaces, save configurations, share with network.",
                color: "neon-cyan",
                icon: "◆",
              },
              {
                id: "MODULE_03",
                title: "EARTH_VITALS",
                desc: "Mission control view of global environmental metrics. Real-time data with historical context and trend analysis.",
                color: "neon-blue",
                icon: "●",
              },
              {
                id: "MODULE_04",
                title: "VIZ_ENGINE",
                desc: "Interactive charts, 3D globes, heatmaps, geospatial overlays. Export visualizations for analysis and reporting.",
                color: "neon-magenta",
                icon: "■",
              },
              {
                id: "MODULE_05",
                title: "DATA_INTEGRATION",
                desc: "Unified API layer for NASA, NOAA, ESA, OpenAQ, GFW and more. All data properly attributed and transparent.",
                color: "neon-yellow",
                icon: "◗",
              },
              {
                id: "MODULE_06",
                title: "KNOWLEDGE_BASE",
                desc: "Educational overlays and AI explanations. Every metric includes context, methodology, and citation generator.",
                color: "matrix-green",
                icon: "◉",
              },
            ].map((module, i) => (
              <div
                key={i}
                className="terminal-window p-6 hover:box-glow-green transition-all group"
              >
                <div className="window-header mb-4">
                  <span className={`text-${module.color}`}>[{module.id}]</span>
                  <div className="window-controls">
                    <div className="window-control"></div>
                  </div>
                </div>

                <div
                  className={`text-4xl mb-4 text-${module.color} font-mono`}
                >
                  {module.icon}
                </div>

                <h3
                  className={`text-base font-bold mb-3 text-${module.color} uppercase tracking-wider font-mono`}
                >
                  {module.title}
                </h3>

                <p className="text-xs text-terminal-gray leading-relaxed font-mono">
                  {module.desc}
                </p>

                <div className="mt-4 text-[10px] text-terminal-gray">
                  STATUS:{" "}
                  <span className={`text-${module.color}`}>OPERATIONAL</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Data Sources Terminal */}
      <section id="data" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="terminal-window p-8">
            <div className="window-header mb-6">
              <span className="text-neon-cyan">[DATA_SOURCES]</span>
              <div className="window-controls">
                <div className="window-control"></div>
                <div className="window-control"></div>
                <div className="window-control"></div>
              </div>
            </div>

            <h2 className="text-3xl font-bold mb-4 text-matrix-green font-mono">
              &gt; INTEGRATED_NETWORKS
            </h2>
            <p className="text-sm text-terminal-gray mb-8 font-mono">
              DIRECT CONNECTION TO WORLD&apos;S LEADING ENVIRONMENTAL DATA
              PROVIDERS
            </p>

            {/* Data source list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mb-6">
              {[
                { name: "NASA_EOSDIS", status: "CONNECTED" },
                { name: "NOAA_CDO", status: "CONNECTED" },
                { name: "OPENAQ", status: "CONNECTED" },
                { name: "GFW_API", status: "CONNECTED" },
                { name: "COPERNICUS", status: "READY" },
                { name: "PLANET_LABS", status: "READY" },
                { name: "GOOGLE_EE", status: "READY" },
                { name: "MSFT_PLANETARY", status: "READY" },
                { name: "CLIMATE_TRACE", status: "READY" },
                { name: "OPENWEATHER", status: "CONNECTED" },
                { name: "SENTINEL_HUB", status: "READY" },
                { name: "GBIF", status: "READY" },
              ].map((source, i) => (
                <div
                  key={i}
                  className="border border-matrix-green/40 bg-terminal-dark p-3 hover:border-matrix-green transition-all font-mono group"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-terminal-gray group-hover:text-matrix-green transition-colors">
                      {source.name}
                    </span>
                    <span
                      className={`text-[10px] ${
                        source.status === "CONNECTED"
                          ? "text-matrix-green"
                          : "text-neon-cyan"
                      }`}
                    >
                      [{source.status}]
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Additional info */}
            <div className="border-t border-matrix-green/30 pt-6">
              <div className="text-xs text-terminal-gray font-mono">
                <span className="text-matrix-green">&gt;</span> EXPANDING
                NETWORK: +20 GOVERNMENTAL AND NGO DATABASES
                <br />
                <span className="text-matrix-green">&gt;</span> ALL DATA:
                ATTRIBUTED • TRANSPARENT • TRACEABLE
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Terminal */}
      <section id="about" className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="terminal-window p-8">
            <div className="window-header mb-6">
              <span className="text-neon-magenta">[SYSTEM_INFO]</span>
              <div className="window-controls">
                <div className="window-control"></div>
                <div className="window-control"></div>
              </div>
            </div>

            <h2 className="text-3xl font-bold mb-6 text-matrix-green font-mono">
              &gt; CYPHERPUNK_MANIFESTO
            </h2>

            <div className="space-y-4 text-sm text-terminal-gray font-mono leading-relaxed">
              <p>
                <span className="text-matrix-green">&gt;&gt;</span> GAIA.AI
                OPERATES ON PRINCIPLES OF{" "}
                <span className="text-matrix-green glow-green">
                  RADICAL_TRANSPARENCY
                </span>
                ,{" "}
                <span className="text-neon-cyan glow-cyan">
                  DECENTRALIZATION
                </span>
                , AND{" "}
                <span className="text-neon-blue glow-blue">
                  UNIVERSAL_ACCESS
                </span>
              </p>

              <p>
                <span className="text-matrix-green">&gt;&gt;</span>{" "}
                ENVIRONMENTAL DATA MUST BE ACCESSIBLE TO ALL: CITIZENS •
                RESEARCHERS • ACTIVISTS • POLICYMAKERS • ENGINEERS
              </p>

              <p>
                <span className="text-matrix-green">&gt;&gt;</span> WEB1
                SIMPLICITY [FAST, FUNCTIONAL, ACCESSIBLE]
                <br />
                <span className="text-matrix-green">&gt;&gt;</span> WEB2 POLISH
                [BEAUTIFUL, INTUITIVE, POWERFUL]
                <br />
                <span className="text-matrix-green">&gt;&gt;</span> WEB4 VALUES
                [OPEN, INTEROPERABLE, USER-CONTROLLED]
              </p>

              <div className="border border-matrix-green/40 bg-terminal-dark p-4 my-4">
                <div className="text-xs text-matrix-green mb-2 uppercase tracking-widest">
                  [MISSION_STATEMENT]
                </div>
                <p className="text-neon-cyan">
                  BUILD TOOLS THAT EMPOWER HUMANITY TO UNDERSTAND AND PROTECT
                  OUR LIVING PLANET. DATA_LEGIBILITY = ENVIRONMENTAL_AGENCY.
                </p>
              </div>

              <p>
                <span className="text-matrix-green">&gt;&gt;</span> JOIN THE
                NETWORK. CONTRIBUTE CODE. SHARE DATA. BUILD THE FUTURE.
              </p>
            </div>

            <div className="mt-8 flex gap-4">
              <button className="flex-1 px-6 py-3 bg-black border-2 border-matrix-green text-matrix-green hover:bg-matrix-green hover:text-black transition-all font-mono text-sm uppercase tracking-wider">
                &gt; EXPLORE_SYSTEM.EXE
              </button>
              <button className="flex-1 px-6 py-3 bg-black border-2 border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-black transition-all font-mono text-sm uppercase tracking-wider">
                &gt; JOIN_NETWORK.EXE
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
