"use client";

import { useState, useEffect } from "react";
import { downloadCSV, downloadXLSX } from "@/lib/exportUtils";

interface AnalyticsMetric {
  label: string;
  value: string;
  trend?: "up" | "down" | "stable";
  description: string;
}

interface GaiaAnalyticsViewProps {
  lat: number;
  lon: number;
  locationName: string;
}

export default function GaiaAnalyticsView({ lat, lon, locationName }: GaiaAnalyticsViewProps) {
  const [loading, setLoading] = useState(true);
  const [animatedValues, setAnimatedValues] = useState<{ [key: string]: number }>({});

  // Simulated proprietary metrics based on location
  const calculateMetrics = () => {
    // These would come from aggregated API data in production
    const baseValue = Math.abs(lat * lon) % 1000;

    return {
      naturalCapitalIndex: 72 + (baseValue % 20),
      ecosystemHealth: 65 + (baseValue % 25),
      biodiversityScore: 78 + (baseValue % 15),
      carbonSequestration: 45 + (baseValue % 40),
      waterSecurity: 80 + (baseValue % 15),
      soilViability: 70 + (baseValue % 20),
      climateResilience: 55 + (baseValue % 30),
      sustainabilityRating: "A-",
    };
  };

  const metrics = calculateMetrics();

  const handleExportCSV = () => {
    const exportData = {
      location: {
        name: locationName,
        lat,
        lon,
        timestamp: new Date().toISOString(),
      },
      nci: {
        score: metrics.naturalCapitalIndex,
        rating: metrics.sustainabilityRating,
      },
      metrics: {
        ecosystemHealth: metrics.ecosystemHealth,
        biodiversityIndex: metrics.biodiversityScore,
        carbonCapture: metrics.carbonSequestration,
        waterSecurity: metrics.waterSecurity,
        soilViability: metrics.soilViability,
        climateResilience: metrics.climateResilience,
      },
      valuation: {
        totalAnnualValue: 2400000,
        valueAtRisk: 340000,
        breakdown: {
          carbon: 890000,
          water: 520000,
          biodiversity: 680000,
          soil: 310000,
          pollination: 180000,
          genetic: 120000,
        },
      },
    };

    downloadCSV(exportData, `natural-capital-${locationName.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handleExportXLSX = () => {
    const exportData = {
      location: {
        name: locationName,
        lat,
        lon,
        timestamp: new Date().toISOString(),
      },
      nci: {
        score: metrics.naturalCapitalIndex,
        rating: metrics.sustainabilityRating,
      },
      metrics: {
        ecosystemHealth: metrics.ecosystemHealth,
        biodiversityIndex: metrics.biodiversityScore,
        carbonCapture: metrics.carbonSequestration,
        waterSecurity: metrics.waterSecurity,
        soilViability: metrics.soilViability,
        climateResilience: metrics.climateResilience,
      },
      valuation: {
        totalAnnualValue: 2400000,
        valueAtRisk: 340000,
        breakdown: {
          carbon: 890000,
          water: 520000,
          biodiversity: 680000,
          soil: 310000,
          pollination: 180000,
          genetic: 120000,
        },
      },
    };

    downloadXLSX(exportData, `natural-capital-${locationName.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
      // Animate values counting up
      const targets = {
        nci: metrics.naturalCapitalIndex,
        eco: metrics.ecosystemHealth,
        bio: metrics.biodiversityScore,
        carbon: metrics.carbonSequestration,
        water: metrics.waterSecurity,
        soil: metrics.soilViability,
        climate: metrics.climateResilience,
      };

      let frame = 0;
      const duration = 60; // frames
      const interval = setInterval(() => {
        frame++;
        const progress = frame / duration;
        const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic

        setAnimatedValues({
          nci: Math.round(targets.nci * eased),
          eco: Math.round(targets.eco * eased),
          bio: Math.round(targets.bio * eased),
          carbon: Math.round(targets.carbon * eased),
          water: Math.round(targets.water * eased),
          soil: Math.round(targets.soil * eased),
          climate: Math.round(targets.climate * eased),
        });

        if (frame >= duration) {
          clearInterval(interval);
        }
      }, 16);

      return () => clearInterval(interval);
    }, 800);

    return () => clearTimeout(timer);
  }, [lat, lon]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-blue";
    if (score >= 60) return "text-white";
    if (score >= 40) return "text-orange";
    return "text-white-dim";
  };

  const getScoreBar = (score: number, maxScore: number = 100) => {
    const percentage = (score / maxScore) * 100;
    return (
      <div className="h-2 bg-code border border-white relative overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 bg-blue transition-all duration-1000"
          style={{ width: `${percentage}%` }}
        />
        <div
          className="absolute inset-y-0 left-0 bg-blue-bright opacity-50"
          style={{
            width: `${percentage}%`,
            animation: "pulse 2s ease-in-out infinite",
          }}
        />
      </div>
    );
  };

  if (loading) {
    return (
      <div className="terminal-window p-6">
        <div className="window-header mb-6">
          <span className="text-blue">[GAIA_ANALYTICS]</span>
          <div className="window-controls">
            <div className="window-control"></div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-20">
          <div className="relative w-24 h-24 mb-6">
            <div className="absolute inset-0 border-2 border-blue rounded-full animate-spin" style={{ animationDuration: "3s" }} />
            <div className="absolute inset-4 border border-white rounded-full animate-spin" style={{ animationDuration: "2s", animationDirection: "reverse" }} />
            <div className="absolute inset-8 border border-blue-bright rounded-full animate-pulse" />
          </div>
          <div className="text-white-dim font-mono text-sm">
            <span className="text-blue">&gt;</span> CALCULATING_NATURAL_CAPITAL_INDEX
            <span className="cursor"></span>
          </div>
          <div className="text-[10px] text-white-dim mt-2 font-mono">
            AGGREGATING {7} DATA SOURCES...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="terminal-window p-6">
        <div className="window-header mb-6">
          <span className="text-blue">[GAIA_NATURAL_CAPITAL_INTELLIGENCE]</span>
          <div className="flex items-center gap-4">
            <span className="text-[10px] text-white-dim font-mono">PROPRIETARY_ANALYSIS</span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportCSV}
                className="px-3 py-1 border border-white text-white hover:bg-white hover:text-background transition-all font-mono text-[10px] uppercase tracking-wider"
                title="Export as CSV"
              >
                [CSV] EXPORT
              </button>
              <button
                onClick={handleExportXLSX}
                className="px-3 py-1 border border-blue text-blue hover:bg-blue hover:text-white transition-all font-mono text-[10px] uppercase tracking-wider"
                title="Export as Excel"
              >
                [XLSX] EXPORT
              </button>
            </div>
            <div className="window-controls">
              <div className="window-control"></div>
            </div>
          </div>
        </div>

        {/* Hero Metric */}
        <div className="border-2 border-blue bg-code p-8 text-center mb-6">
          <div className="text-xs text-white-dim uppercase tracking-widest mb-2 font-mono">
            NATURAL CAPITAL INDEX™
          </div>
          <div className="text-6xl font-bold text-blue mb-2 font-mono">
            {animatedValues.nci || 0}
          </div>
          <div className="text-sm text-white-dim font-mono uppercase">
            {locationName}
          </div>
          <div className="mt-4 flex justify-center gap-6 text-[10px] font-mono">
            <span className="text-white-dim">LAT: {lat.toFixed(4)}</span>
            <span className="text-blue">•</span>
            <span className="text-white-dim">LON: {lon.toFixed(4)}</span>
            <span className="text-blue">•</span>
            <span className="text-white">RATING: {metrics.sustainabilityRating}</span>
          </div>
        </div>

        {/* What is NCI */}
        <div className="border border-white bg-terminal p-4 text-xs font-mono text-white-dim">
          <div className="text-blue mb-2">&gt;&gt; ABOUT_NCI</div>
          <p>
            The Natural Capital Index™ is GAIA's proprietary composite score measuring the total
            ecosystem value of a location. It aggregates biodiversity, carbon sequestration, water
            resources, soil health, and climate resilience into a single actionable metric.
          </p>
        </div>
      </div>

      {/* Core Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Ecosystem Health */}
        <div className="terminal-window p-4">
          <div className="flex justify-between items-start mb-3">
            <div>
              <div className="text-[10px] text-white-dim uppercase tracking-widest">ECOSYSTEM_HEALTH</div>
              <div className={`text-3xl font-bold font-mono ${getScoreColor(animatedValues.eco || 0)}`}>
                {animatedValues.eco || 0}%
              </div>
            </div>
            <div className="text-2xl">🌿</div>
          </div>
          {getScoreBar(animatedValues.eco || 0)}
          <div className="mt-2 text-[10px] text-white-dim font-mono">
            Overall ecosystem vitality score
          </div>
        </div>

        {/* Biodiversity Score */}
        <div className="terminal-window p-4">
          <div className="flex justify-between items-start mb-3">
            <div>
              <div className="text-[10px] text-white-dim uppercase tracking-widest">BIODIVERSITY_INDEX</div>
              <div className={`text-3xl font-bold font-mono ${getScoreColor(animatedValues.bio || 0)}`}>
                {animatedValues.bio || 0}%
              </div>
            </div>
            <div className="text-2xl">🦋</div>
          </div>
          {getScoreBar(animatedValues.bio || 0)}
          <div className="mt-2 text-[10px] text-white-dim font-mono">
            Species richness & habitat quality
          </div>
        </div>

        {/* Carbon Sequestration */}
        <div className="terminal-window p-4">
          <div className="flex justify-between items-start mb-3">
            <div>
              <div className="text-[10px] text-white-dim uppercase tracking-widest">CARBON_CAPTURE</div>
              <div className={`text-3xl font-bold font-mono ${getScoreColor(animatedValues.carbon || 0)}`}>
                {animatedValues.carbon || 0}%
              </div>
            </div>
            <div className="text-2xl">🌲</div>
          </div>
          {getScoreBar(animatedValues.carbon || 0)}
          <div className="mt-2 text-[10px] text-white-dim font-mono">
            CO₂ absorption capacity
          </div>
        </div>

        {/* Water Security */}
        <div className="terminal-window p-4">
          <div className="flex justify-between items-start mb-3">
            <div>
              <div className="text-[10px] text-white-dim uppercase tracking-widest">WATER_SECURITY</div>
              <div className={`text-3xl font-bold font-mono ${getScoreColor(animatedValues.water || 0)}`}>
                {animatedValues.water || 0}%
              </div>
            </div>
            <div className="text-2xl">💧</div>
          </div>
          {getScoreBar(animatedValues.water || 0)}
          <div className="mt-2 text-[10px] text-white-dim font-mono">
            Freshwater availability & quality
          </div>
        </div>

        {/* Soil Viability */}
        <div className="terminal-window p-4">
          <div className="flex justify-between items-start mb-3">
            <div>
              <div className="text-[10px] text-white-dim uppercase tracking-widest">SOIL_VIABILITY</div>
              <div className={`text-3xl font-bold font-mono ${getScoreColor(animatedValues.soil || 0)}`}>
                {animatedValues.soil || 0}%
              </div>
            </div>
            <div className="text-2xl">🌱</div>
          </div>
          {getScoreBar(animatedValues.soil || 0)}
          <div className="mt-2 text-[10px] text-white-dim font-mono">
            Soil health & agricultural potential
          </div>
        </div>

        {/* Climate Resilience */}
        <div className="terminal-window p-4">
          <div className="flex justify-between items-start mb-3">
            <div>
              <div className="text-[10px] text-white-dim uppercase tracking-widest">CLIMATE_RESILIENCE</div>
              <div className={`text-3xl font-bold font-mono ${getScoreColor(animatedValues.climate || 0)}`}>
                {animatedValues.climate || 0}%
              </div>
            </div>
            <div className="text-2xl">🌡️</div>
          </div>
          {getScoreBar(animatedValues.climate || 0)}
          <div className="mt-2 text-[10px] text-white-dim font-mono">
            Adaptation capacity score
          </div>
        </div>
      </div>

      {/* Economic Valuation */}
      <div className="terminal-window p-6">
        <div className="window-header mb-6">
          <span className="text-white">[ECOSYSTEM_SERVICES_VALUATION]</span>
          <span className="text-blue text-xs ml-2">ANNUAL_ESTIMATES</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Total Value */}
          <div className="border-2 border-blue bg-code p-6">
            <div className="text-xs text-white-dim uppercase tracking-widest mb-2">
              TOTAL ECOSYSTEM VALUE
            </div>
            <div className="text-4xl font-bold text-blue font-mono mb-2">
              $2.4M
            </div>
            <div className="text-[10px] text-white-dim">
              Per km² annually • Based on 10km radius
            </div>
          </div>

          {/* At Risk Value */}
          <div className="border border-orange bg-code p-6">
            <div className="text-xs text-white-dim uppercase tracking-widest mb-2">
              VALUE AT RISK
            </div>
            <div className="text-4xl font-bold text-orange font-mono mb-2">
              $340K
            </div>
            <div className="text-[10px] text-white-dim">
              Potential annual loss from degradation
            </div>
          </div>
        </div>

        {/* Breakdown */}
        <div className="border border-white bg-terminal p-4">
          <div className="text-xs text-white-dim uppercase tracking-widest mb-4 font-mono">
            <span className="text-blue">&gt;&gt;</span> VALUE_BREAKDOWN
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
            <div className="border border-white p-3">
              <div className="text-white-dim mb-1">CARBON</div>
              <div className="text-white text-lg">$890K</div>
            </div>
            <div className="border border-white p-3">
              <div className="text-white-dim mb-1">WATER</div>
              <div className="text-white text-lg">$520K</div>
            </div>
            <div className="border border-white p-3">
              <div className="text-white-dim mb-1">BIODIVERSITY</div>
              <div className="text-white text-lg">$680K</div>
            </div>
            <div className="border border-white p-3">
              <div className="text-white-dim mb-1">SOIL</div>
              <div className="text-white text-lg">$310K</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="terminal-window p-6">
        <div className="window-header mb-6">
          <span className="text-blue">[GAIA_RECOMMENDATIONS]</span>
        </div>

        <div className="space-y-3">
          <div className="border border-white bg-code p-4 flex items-start gap-3">
            <span className="text-blue text-lg">▶</span>
            <div>
              <div className="text-white font-mono text-sm uppercase mb-1">ENHANCE_CARBON_SINK</div>
              <div className="text-xs text-white-dim">
                Current carbon capture rate is below regional average. Consider reforestation
                initiatives to increase sequestration capacity by 15-20%.
              </div>
            </div>
          </div>

          <div className="border border-white bg-code p-4 flex items-start gap-3">
            <span className="text-blue text-lg">▶</span>
            <div>
              <div className="text-white font-mono text-sm uppercase mb-1">PROTECT_WATERSHEDS</div>
              <div className="text-xs text-white-dim">
                Water security score indicates vulnerability. Recommend buffer zone expansion
                around key water sources.
              </div>
            </div>
          </div>

          <div className="border border-white bg-code p-4 flex items-start gap-3">
            <span className="text-blue text-lg">▶</span>
            <div>
              <div className="text-white font-mono text-sm uppercase mb-1">MONITOR_BIODIVERSITY</div>
              <div className="text-xs text-white-dim">
                Strong biodiversity indicators. Maintain current habitat connectivity and
                continue species monitoring programs.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border border-blue bg-terminal p-4">
        <div className="text-xs text-white-dim font-mono space-y-1">
          <div>
            <span className="text-blue">&gt;</span> METHODOLOGY: GAIA Proprietary Natural Capital Framework v2.0
          </div>
          <div>
            <span className="text-blue">&gt;</span> DATA_SOURCES: 10+ APIs • Satellite imagery • Field surveys
          </div>
          <div>
            <span className="text-blue">&gt;</span> LAST_UPDATED: Real-time aggregation
          </div>
          <div className="pt-2 border-t border-white mt-2 flex justify-between items-center">
            <span className="text-white">&gt;&gt;</span> GAIA_AI: NATURAL CAPITAL INTELLIGENCE FOR DECISION MAKERS
            <a
              href="/docs"
              className="px-3 py-1 border border-blue text-blue hover:bg-blue hover:text-white transition-all uppercase text-[10px] tracking-wider"
            >
              [?] VIEW_METHODOLOGY
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
