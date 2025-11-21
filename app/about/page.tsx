"use client";

import { useState } from "react";

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState<"mission" | "tech" | "data" | "roadmap">("mission");

  return (
    <div className="bg-black min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="terminal-window p-8 mb-8">
          <div className="window-header mb-6">
            <span className="text-matrix-green">[ABOUT_GAIA.AI]</span>
            <div className="window-controls">
              <div className="window-control"></div>
              <div className="window-control"></div>
              <div className="window-control"></div>
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-5xl font-bold text-matrix-green font-mono mb-2 glow-green">
              GAIA.AI
            </h1>
            <div className="text-lg text-neon-cyan font-mono">
              &gt; ENVIRONMENTAL_INTELLIGENCE_PLATFORM
            </div>
            <div className="text-sm text-terminal-gray font-mono max-w-3xl">
              <span className="text-matrix-green">&gt;&gt;</span> UNIVERSAL ACCESS
              TO EARTH&apos;S VITAL SIGNS
              <br />
              <span className="text-matrix-green">&gt;&gt;</span> REAL-TIME DATA •
              AI-POWERED ANALYSIS • RADICAL TRANSPARENCY
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8 flex gap-2 flex-wrap">
          {[
            { id: "mission", label: "[MISSION]", color: "matrix-green" },
            { id: "tech", label: "[TECHNOLOGY]", color: "neon-cyan" },
            { id: "data", label: "[DATA_SOURCES]", color: "neon-blue" },
            { id: "roadmap", label: "[ROADMAP]", color: "neon-magenta" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-3 border-2 font-mono text-sm uppercase tracking-wider transition-all ${
                activeTab === tab.id
                  ? `bg-${tab.color} text-black border-${tab.color}`
                  : `bg-black text-${tab.color} border-${tab.color} hover:bg-${tab.color}/10`
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Mission Tab */}
        {activeTab === "mission" && (
          <div className="space-y-6">
            <div className="terminal-window p-8">
              <div className="window-header mb-6">
                <span className="text-matrix-green">[MISSION_STATEMENT]</span>
              </div>

              <div className="space-y-6 text-sm text-terminal-gray font-mono leading-relaxed">
                <div>
                  <h2 className="text-2xl text-matrix-green font-bold mb-4 uppercase">
                    &gt; THE_PROBLEM
                  </h2>
                  <p className="mb-3">
                    <span className="text-matrix-green">&gt;&gt;</span>{" "}
                    ENVIRONMENTAL DATA IS FRAGMENTED ACROSS HUNDREDS OF SOURCES
                  </p>
                  <p className="mb-3">
                    <span className="text-matrix-green">&gt;&gt;</span> MOST
                    PEOPLE LACK ACCESS TO COMPREHENSIVE EARTH MONITORING
                  </p>
                  <p className="mb-3">
                    <span className="text-matrix-green">&gt;&gt;</span> EXISTING
                    TOOLS ARE EITHER TOO SPECIALIZED OR TOO SIMPLISTIC
                  </p>
                  <p>
                    <span className="text-matrix-green">&gt;&gt;</span>{" "}
                    INFORMATION ASYMMETRY PREVENTS ENVIRONMENTAL AGENCY
                  </p>
                </div>

                <div className="border-t border-matrix-green/30 pt-6">
                  <h2 className="text-2xl text-neon-cyan font-bold mb-4 uppercase">
                    &gt; THE_SOLUTION
                  </h2>
                  <div className="border border-matrix-green/40 bg-terminal-dark p-6 mb-4">
                    <p className="text-matrix-green text-lg mb-3 font-bold">
                      DATA_LEGIBILITY = ENVIRONMENTAL_AGENCY
                    </p>
                    <p className="text-terminal-gray">
                      GAIA.AI UNIFIES EARTH&apos;S ENVIRONMENTAL DATA INTO A
                      SINGLE, ACCESSIBLE, AI-POWERED PLATFORM. WE BELIEVE THAT
                      UNDERSTANDING OUR PLANET&apos;S HEALTH SHOULD NOT REQUIRE A
                      PHD OR INSTITUTIONAL ACCESS.
                    </p>
                  </div>
                  <p className="mb-3">
                    <span className="text-neon-cyan">&gt;&gt;</span> UNIFIED API
                    LAYER ACROSS NASA, NOAA, ESA, AND MORE
                  </p>
                  <p className="mb-3">
                    <span className="text-neon-cyan">&gt;&gt;</span> AI-POWERED
                    NATURAL LANGUAGE QUERIES
                  </p>
                  <p className="mb-3">
                    <span className="text-neon-cyan">&gt;&gt;</span> CUSTOMIZABLE
                    MODULAR DASHBOARDS
                  </p>
                  <p>
                    <span className="text-neon-cyan">&gt;&gt;</span> OPEN SOURCE •
                    TRANSPARENT • FREE
                  </p>
                </div>

                <div className="border-t border-matrix-green/30 pt-6">
                  <h2 className="text-2xl text-neon-blue font-bold mb-4 uppercase">
                    &gt; CORE_VALUES
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      {
                        title: "UNIVERSAL_ACCESS",
                        desc: "Environmental data should be free and accessible to all humans, from citizens to policymakers.",
                      },
                      {
                        title: "RADICAL_TRANSPARENCY",
                        desc: "All data sources, methodologies, and algorithms are open and auditable. No black boxes.",
                      },
                      {
                        title: "DECENTRALIZATION",
                        desc: "User-controlled, open standards, interoperable with other systems. No data silos.",
                      },
                      {
                        title: "SUSTAINABILITY",
                        desc: "Efficient, lightweight, designed to run on minimal resources. Solar-powered friendly.",
                      },
                    ].map((value, i) => (
                      <div
                        key={i}
                        className="border border-matrix-green/40 bg-terminal-dark p-4"
                      >
                        <div className="text-neon-cyan font-bold mb-2 uppercase">
                          [{value.title}]
                        </div>
                        <div className="text-xs text-terminal-gray">
                          {value.desc}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Technology Tab */}
        {activeTab === "tech" && (
          <div className="space-y-6">
            <div className="terminal-window p-8">
              <div className="window-header mb-6">
                <span className="text-neon-cyan">[TECHNOLOGY_STACK]</span>
              </div>

              <div className="space-y-6">
                <div>
                  <h2 className="text-xl text-matrix-green font-bold mb-4 uppercase font-mono">
                    &gt; ARCHITECTURE
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      {
                        layer: "FRONTEND",
                        tech: [
                          "Next.js 14 (React 18)",
                          "TypeScript",
                          "Tailwind CSS v4",
                          "Recharts",
                          "Deck.gl",
                          "MapLibre GL",
                        ],
                        color: "matrix-green",
                      },
                      {
                        layer: "BACKEND",
                        tech: [
                          "Next.js API Routes",
                          "Anthropic Claude API",
                          "PostgreSQL + Prisma",
                          "Vercel KV (Redis)",
                          "Edge Functions",
                        ],
                        color: "neon-cyan",
                      },
                      {
                        layer: "DEPLOYMENT",
                        tech: [
                          "Vercel Edge Network",
                          "Serverless Functions",
                          "Global CDN",
                          "Auto-scaling",
                          "Zero-downtime deploys",
                        ],
                        color: "neon-blue",
                      },
                    ].map((stack, i) => (
                      <div key={i} className="border border-matrix-green/40 bg-terminal-dark p-4">
                        <div className={`text-${stack.color} font-bold mb-3 uppercase text-sm border-b border-matrix-green/30 pb-2`}>
                          [{stack.layer}]
                        </div>
                        <ul className="space-y-2 text-xs text-terminal-gray font-mono">
                          {stack.tech.map((item, j) => (
                            <li key={j}>
                              <span className="text-matrix-green">&gt;</span> {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-matrix-green/30 pt-6">
                  <h2 className="text-xl text-matrix-green font-bold mb-4 uppercase font-mono">
                    &gt; KEY_FEATURES
                  </h2>
                  <div className="space-y-3 text-sm text-terminal-gray font-mono">
                    {[
                      {
                        feature: "AI_QUERY_ENGINE",
                        desc: "Natural language processing powered by Claude. Ask questions, get visualizations.",
                      },
                      {
                        feature: "MODULAR_WIDGETS",
                        desc: "Drag-and-drop dashboard builder. Each widget connects to specific data sources.",
                      },
                      {
                        feature: "REAL-TIME_DATA",
                        desc: "Live updates from satellites, weather stations, ocean buoys, air quality sensors.",
                      },
                      {
                        feature: "DATA_INTEGRATION",
                        desc: "Unified API layer abstracts complexity of 20+ environmental data providers.",
                      },
                      {
                        feature: "CACHING_LAYER",
                        desc: "Intelligent caching reduces API calls, improves performance, respects rate limits.",
                      },
                      {
                        feature: "VISUALIZATION",
                        desc: "Interactive charts, 3D globes, heatmaps, time series, geospatial overlays.",
                      },
                    ].map((item, i) => (
                      <div key={i} className="border border-matrix-green/40 bg-terminal-dark p-4">
                        <div className="text-neon-cyan font-bold mb-2">
                          &gt; {item.feature}
                        </div>
                        <div className="text-xs text-terminal-gray pl-4">
                          {item.desc}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Data Sources Tab */}
        {activeTab === "data" && (
          <div className="terminal-window p-8">
            <div className="window-header mb-6">
              <span className="text-neon-blue">[DATA_SOURCES]</span>
            </div>

            <div className="space-y-8">
              {[
                {
                  tier: "TIER_1_INTEGRATED",
                  status: "OPERATIONAL",
                  color: "matrix-green",
                  sources: [
                    {
                      name: "OpenWeatherMap",
                      metrics: "Weather, Temperature, Precipitation, Wind",
                      coverage: "Global, 3-hour intervals",
                    },
                    {
                      name: "NOAA CDO",
                      metrics: "Climate data, Historical records, Severe weather",
                      coverage: "Global, Daily updates",
                    },
                    {
                      name: "NASA EOSDIS",
                      metrics: "Satellite imagery, Earth observation, Land/Ocean data",
                      coverage: "Global, Near real-time",
                    },
                    {
                      name: "OpenAQ",
                      metrics: "Air quality, PM2.5, PM10, Ozone, NO2, SO2",
                      coverage: "100+ countries, Hourly",
                    },
                    {
                      name: "Global Forest Watch",
                      metrics: "Deforestation, Forest fires, Land use change",
                      coverage: "Global, Weekly updates",
                    },
                  ],
                },
                {
                  tier: "TIER_2_PLANNED",
                  status: "DEVELOPMENT",
                  color: "neon-cyan",
                  sources: [
                    {
                      name: "Google Earth Engine",
                      metrics: "Satellite analysis, Environmental change detection",
                      coverage: "40+ years of data",
                    },
                    {
                      name: "Copernicus",
                      metrics: "Climate, Atmosphere, Marine, Land monitoring",
                      coverage: "EU Sentinel satellites",
                    },
                    {
                      name: "Planet Labs",
                      metrics: "Daily satellite imagery, Change detection",
                      coverage: "Global, Daily",
                    },
                    {
                      name: "Microsoft Planetary Computer",
                      metrics: "Petabytes of environmental data, ML models",
                      coverage: "Multi-source aggregation",
                    },
                    {
                      name: "Climate TRACE",
                      metrics: "Greenhouse gas emissions, Facility-level tracking",
                      coverage: "Global emissions inventory",
                    },
                  ],
                },
                {
                  tier: "TIER_3_FUTURE",
                  status: "ROADMAP",
                  color: "neon-blue",
                  sources: [
                    {
                      name: "GBIF",
                      metrics: "Biodiversity data, Species observations",
                      coverage: "2B+ occurrence records",
                    },
                    {
                      name: "Ocean Networks Canada",
                      metrics: "Ocean monitoring, Marine sensors",
                      coverage: "Pacific & Arctic oceans",
                    },
                    {
                      name: "USGS EarthExplorer",
                      metrics: "Land imaging, Topography, Geology",
                      coverage: "US & Global",
                    },
                    {
                      name: "Sentinel Hub",
                      metrics: "Multi-spectral satellite imagery",
                      coverage: "Global, High resolution",
                    },
                  ],
                },
              ].map((tier, i) => (
                <div key={i}>
                  <div className="flex items-center gap-4 mb-4">
                    <h2 className={`text-xl text-${tier.color} font-bold uppercase font-mono`}>
                      &gt; {tier.tier}
                    </h2>
                    <span className={`text-xs text-${tier.color} border border-${tier.color}/40 px-3 py-1`}>
                      [{tier.status}]
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {tier.sources.map((source, j) => (
                      <div
                        key={j}
                        className="border border-matrix-green/40 bg-terminal-dark p-4 hover:border-matrix-green transition-all"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="text-neon-cyan font-bold text-sm">
                            {source.name}
                          </div>
                          <div className="text-[10px] text-terminal-gray uppercase">
                            {source.coverage}
                          </div>
                        </div>
                        <div className="text-xs text-terminal-gray font-mono">
                          <span className="text-matrix-green">&gt;</span> {source.metrics}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Roadmap Tab */}
        {activeTab === "roadmap" && (
          <div className="terminal-window p-8">
            <div className="window-header mb-6">
              <span className="text-neon-magenta">[DEVELOPMENT_ROADMAP]</span>
            </div>

            <div className="space-y-6">
              {[
                {
                  phase: "PHASE_1_FOUNDATION",
                  status: "IN_PROGRESS",
                  progress: 60,
                  color: "matrix-green",
                  items: [
                    "✓ Cypherpunk UI design system",
                    "✓ Next.js + TypeScript foundation",
                    "✓ First data integration (Weather)",
                    "✓ Basic data visualization (Recharts)",
                    "⧗ AI query interface (Claude API)",
                    "⧗ User authentication",
                    "⧗ Dashboard persistence",
                  ],
                },
                {
                  phase: "PHASE_2_CORE_DATA",
                  status: "PLANNED",
                  progress: 0,
                  color: "neon-cyan",
                  items: [
                    "○ Integrate 5+ Tier 1 data sources",
                    "○ Unified data adapter layer",
                    "○ Real-time data streaming",
                    "○ Caching & rate limit handling",
                    "○ Map visualizations (MapLibre)",
                    "○ Advanced charts & graphs",
                  ],
                },
                {
                  phase: "PHASE_3_INTELLIGENCE",
                  status: "FUTURE",
                  progress: 0,
                  color: "neon-blue",
                  items: [
                    "○ AI-powered insights & anomaly detection",
                    "○ Predictive modeling integration",
                    "○ Custom alert system",
                    "○ Correlation analysis",
                    "○ Natural language report generation",
                    "○ Educational AI tutor",
                  ],
                },
                {
                  phase: "PHASE_4_COLLABORATION",
                  status: "FUTURE",
                  progress: 0,
                  color: "neon-magenta",
                  items: [
                    "○ Shared dashboards & annotations",
                    "○ Community templates",
                    "○ Public API for developers",
                    "○ Export to research platforms",
                    "○ Multi-user workspaces",
                    "○ Integration with GIS tools",
                  ],
                },
                {
                  phase: "PHASE_5_WEB4",
                  status: "RESEARCH",
                  progress: 0,
                  color: "neon-yellow",
                  items: [
                    "○ Decentralized data storage (IPFS)",
                    "○ Blockchain data provenance",
                    "○ Token-gated premium features",
                    "○ DAO governance structure",
                    "○ Federated data sharing",
                    "○ Self-sovereign identity",
                  ],
                },
              ].map((phase, i) => (
                <div key={i} className="border border-matrix-green/40 bg-terminal-dark p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className={`text-lg text-${phase.color} font-bold uppercase font-mono mb-1`}>
                        &gt; {phase.phase}
                      </h3>
                      <div className="text-xs text-terminal-gray uppercase">
                        STATUS: <span className={`text-${phase.color}`}>{phase.status}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl text-${phase.color} font-bold font-mono`}>
                        {phase.progress}%
                      </div>
                      <div className="text-[10px] text-terminal-gray uppercase">
                        COMPLETE
                      </div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mb-4 h-2 bg-terminal-dark border border-matrix-green/30">
                    <div
                      className={`h-full bg-${phase.color} transition-all`}
                      style={{ width: `${phase.progress}%` }}
                    ></div>
                  </div>

                  <ul className="space-y-2 text-sm text-terminal-gray font-mono">
                    {phase.items.map((item, j) => (
                      <li key={j} className="flex items-center gap-2">
                        <span className={item.startsWith("✓") ? "text-matrix-green" : item.startsWith("⧗") ? "text-neon-cyan" : "text-terminal-gray"}>
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-8 border border-neon-cyan/40 bg-terminal-dark p-6">
              <h3 className="text-neon-cyan font-bold mb-3 uppercase font-mono">
                &gt; CONTRIBUTE_TO_ROADMAP
              </h3>
              <p className="text-sm text-terminal-gray font-mono mb-4">
                GAIA.AI IS OPEN SOURCE. JOIN US IN BUILDING THE FUTURE OF
                ENVIRONMENTAL INTELLIGENCE.
              </p>
              <div className="flex gap-4">
                <a
                  href="https://github.com"
                  className="px-6 py-3 border-2 border-matrix-green text-matrix-green hover:bg-matrix-green hover:text-black transition-all font-mono text-xs uppercase tracking-wider"
                >
                  &gt; GITHUB
                </a>
                <a
                  href="https://discord.com"
                  className="px-6 py-3 border-2 border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-black transition-all font-mono text-xs uppercase tracking-wider"
                >
                  &gt; DISCORD
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
