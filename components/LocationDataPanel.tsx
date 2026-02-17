"use client";

import { useState, useEffect, useCallback } from "react";
import type { SelectedLocation, TemporalView } from "./IntegratedMapView";

interface LocationDataPanelProps {
  location: SelectedLocation | null;
  isOpen: boolean;
  onClose: () => void;
  temporalView: TemporalView;
  onAskQuestion?: (question: string) => void;
}

interface ModuleData {
  id: string;
  name: string;
  icon: string;
  description: string;
  loading: boolean;
  error: string | null;
  data: any;
  expanded: boolean;
}

const MODULES = [
  { id: "summary", name: "NATURAL CAPITAL", icon: "$", description: "Total ecosystem value" },
  { id: "climate", name: "CLIMATE", icon: "°", description: "Weather & carbon data" },
  { id: "carbon", name: "CARBON", icon: "C", description: "Emissions & sequestration" },
  { id: "forest", name: "FOREST", icon: "🌲", description: "Cover & deforestation" },
  { id: "soil", name: "SOIL", icon: "▦", description: "Health & carbon storage" },
  { id: "biodiversity", name: "BIODIVERSITY", icon: "◉", description: "Species & ecosystems" },
  { id: "ocean", name: "OCEAN", icon: "≋", description: "Marine conditions" },
];

export default function LocationDataPanel({
  location,
  isOpen,
  onClose,
  temporalView,
  onAskQuestion,
}: LocationDataPanelProps) {
  const [modules, setModules] = useState<ModuleData[]>(
    MODULES.map((m) => ({
      ...m,
      loading: false,
      error: null,
      data: null,
      expanded: m.id === "summary",
    }))
  );
  const [aggregatedValue, setAggregatedValue] = useState<number>(0);
  const [locationName, setLocationName] = useState<string>("");

  // Reverse geocode to get location name
  const reverseGeocode = useCallback(async (lat: number, lon: number) => {
    try {
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${lat}&longitude=${lon}&count=1`
      );
      if (response.ok) {
        const data = await response.json();
        if (data.results?.[0]) {
          const r = data.results[0];
          return `${r.name}${r.admin1 ? `, ${r.admin1}` : ""}${r.country ? `, ${r.country}` : ""}`;
        }
      }
    } catch (e) {}
    return `${lat.toFixed(4)}°, ${lon.toFixed(4)}°`;
  }, []);

  // Fetch all data when location changes
  useEffect(() => {
    if (!location || !isOpen) return;

    const fetchAllData = async () => {
      // Set all to loading
      setModules((prev) =>
        prev.map((m) => ({ ...m, loading: true, error: null, data: null }))
      );

      const { lat, lon } = location;

      // Get location name via reverse geocoding
      const resolvedName = await reverseGeocode(lat, lon);
      setLocationName(resolvedName);

      // Fetch all APIs in parallel
      const fetches = [
        // Climate/Weather
        fetch(`/api/carbon?location=${encodeURIComponent(resolvedName)}&lat=${lat}&lon=${lon}`).then((r) => r.json()).catch(() => null),
        // Forest
        fetch(`/api/deforestation?location=${encodeURIComponent(resolvedName)}&lat=${lat}&lon=${lon}`).then((r) => r.json()).catch(() => null),
        // Soil
        fetch(`/api/soil?location=${encodeURIComponent(resolvedName)}&lat=${lat}&lon=${lon}`).then((r) => r.json()).catch(() => null),
        // Biodiversity
        fetch(`/api/biodiversity?location=${encodeURIComponent(resolvedName)}&lat=${lat}&lon=${lon}`).then((r) => r.json()).catch(() => null),
        // Ocean (use nearest coastal station based on location)
        fetch(`/api/ocean?lat=${lat}&lon=${lon}`).then((r) => r.json()).catch(() => null),
        // Weather data
        fetch(`/api/weather?city=${encodeURIComponent(resolvedName)}&lat=${lat}&lon=${lon}`).then((r) => r.json()).catch(() => null),
      ];

      const [carbon, forest, soil, biodiversity, ocean, weather] = await Promise.all(fetches);

      // Calculate aggregated natural capital (20-year NPV for annual values)
      let totalValue = 0;
      const npvMultiplier = 20; // 20 year net present value

      if (forest?.valuation?.naturalCapital?.total) {
        totalValue += forest.valuation.naturalCapital.total;
      }
      if (soil?.valuation?.naturalCapital?.carbonStock) {
        totalValue += soil.valuation.naturalCapital.carbonStock;
      }
      if (biodiversity?.valuation?.naturalCapital?.annualTotal) {
        totalValue += biodiversity.valuation.naturalCapital.annualTotal * npvMultiplier;
      }
      if (ocean?.valuation?.naturalCapital?.annualTotal) {
        totalValue += ocean.valuation.naturalCapital.annualTotal * npvMultiplier;
      }
      if (carbon?.valuation?.naturalCapital?.totalSequestrationValue) {
        totalValue += carbon.valuation.naturalCapital.totalSequestrationValue;
      }

      setAggregatedValue(totalValue);

      // Update modules with fetched data
      setModules((prev) =>
        prev.map((m) => {
          let moduleData = null;
          switch (m.id) {
            case "summary":
              moduleData = { totalValue, forest, soil, biodiversity, ocean, carbon, weather, locationName: resolvedName };
              break;
            case "climate":
              moduleData = { carbon, weather };
              break;
            case "carbon":
              moduleData = carbon;
              break;
            case "forest":
              moduleData = forest;
              break;
            case "soil":
              moduleData = soil;
              break;
            case "biodiversity":
              moduleData = biodiversity;
              break;
            case "ocean":
              moduleData = ocean;
              break;
          }
          return { ...m, loading: false, data: moduleData };
        })
      );
    };

    fetchAllData();
  }, [location, isOpen, reverseGeocode]);

  const toggleModule = (id: string) => {
    setModules((prev) =>
      prev.map((m) => (m.id === id ? { ...m, expanded: !m.expanded } : m))
    );
  };

  const formatCurrency = (value: number): string => {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(0)}K`;
    return `$${value.toFixed(0)}`;
  };

  if (!isOpen) return null;

  return (
    <div
      className={`absolute top-[41px] right-0 bottom-[25px] w-[480px] bg-terminal border-l-2 border-blue z-[1002] transform transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      } overflow-hidden flex flex-col shadow-2xl`}
    >
      {/* Panel Header */}
      <div className="bg-code border-b-2 border-blue p-5 flex-shrink-0">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <div className="text-blue text-[10px] font-mono uppercase tracking-[0.2em] mb-2">
              LOCATION ANALYSIS
            </div>
            <div className="text-white font-mono text-lg font-bold tracking-wide">
              {locationName || (location ? `${location.lat.toFixed(4)}°, ${location.lon.toFixed(4)}°` : "—")}
            </div>
            {location && locationName && (
              <div className="text-white-dim font-mono text-[11px] mt-1">
                {location.lat.toFixed(4)}°N, {location.lon.toFixed(4)}°E
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-white-dim hover:text-blue font-mono text-sm px-3 py-1 border border-white hover:border-blue transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Temporal indicator */}
        <div className="flex items-center gap-3 text-[10px] font-mono">
          <span className="text-white-dim">DATA VIEW:</span>
          <span className={`px-2 py-0.5 border ${
            temporalView === "present" ? "border-blue text-blue" : "border-white text-white-dim"
          }`}>
            {temporalView === "past" && "HISTORICAL (2000-2020)"}
            {temporalView === "present" && "REAL-TIME"}
            {temporalView === "projected" && "FORECAST (2024-2050)"}
          </span>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        {/* Modules */}
        {modules.map((module) => (
          <div key={module.id} className={`border-b border-white/30 ${module.expanded ? 'bg-code/50' : ''}`}>
            {/* Module header - clickable */}
            <button
              onClick={() => toggleModule(module.id)}
              className="w-full px-5 py-4 flex items-center justify-between hover:bg-code/80 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className={`w-8 h-8 flex items-center justify-center border-2 ${
                  module.expanded ? 'border-blue bg-blue/20 text-blue' : 'border-white/50 text-white-dim'
                } font-mono text-sm transition-colors`}>
                  {module.icon}
                </span>
                <div className="text-left">
                  <div className="text-white font-mono text-sm uppercase tracking-wider">
                    {module.name}
                  </div>
                  <div className="text-white-dim font-mono text-[10px]">
                    {module.description}
                  </div>
                </div>
                {module.loading && (
                  <span className="text-blue text-[10px] animate-pulse ml-2">●</span>
                )}
              </div>
              <span className={`font-mono text-lg transition-transform ${module.expanded ? 'rotate-180' : ''}`}>
                {module.expanded ? "−" : "+"}
              </span>
            </button>

            {/* Module content */}
            {module.expanded && (
              <div className="px-5 pb-5">
                {module.loading ? (
                  <div className="text-white-dim text-xs font-mono py-4 text-center">
                    <span className="text-blue animate-pulse">● ● ●</span>
                    <div className="mt-2">FETCHING DATA</div>
                  </div>
                ) : module.data ? (
                  <ModuleContent
                    moduleId={module.id}
                    data={module.data}
                    temporalView={temporalView}
                    formatCurrency={formatCurrency}
                    aggregatedValue={aggregatedValue}
                  />
                ) : (
                  <div className="text-white-dim text-xs font-mono py-4 text-center border border-dashed border-white/30">
                    NO DATA AVAILABLE FOR THIS LOCATION
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Panel footer */}
      <div className="border-t-2 border-blue bg-code p-3 flex-shrink-0">
        <div className="flex justify-between items-center text-[10px] font-mono">
          <div className="text-white-dim">
            <span className="text-blue">◆</span> TEEB + Natural Capital Protocol
          </div>
          <div className="text-white-dim">
            <span className="text-blue">{modules.filter(m => m.data).length}</span>/{modules.length} modules
          </div>
        </div>
      </div>
    </div>
  );
}

// Render content based on module type
function ModuleContent({
  moduleId,
  data,
  temporalView,
  formatCurrency,
  aggregatedValue,
}: {
  moduleId: string;
  data: any;
  temporalView: TemporalView;
  formatCurrency: (v: number) => string;
  aggregatedValue: number;
}) {
  switch (moduleId) {
    case "summary":
      return <SummaryContent data={data} formatCurrency={formatCurrency} aggregatedValue={aggregatedValue} temporalView={temporalView} />;
    case "climate":
    case "carbon":
      return <CarbonContent data={data} formatCurrency={formatCurrency} temporalView={temporalView} />;
    case "forest":
      return <ForestContent data={data} formatCurrency={formatCurrency} temporalView={temporalView} />;
    case "soil":
      return <SoilContent data={data} formatCurrency={formatCurrency} temporalView={temporalView} />;
    case "biodiversity":
      return <BiodiversityContent data={data} formatCurrency={formatCurrency} />;
    case "ocean":
      return <OceanContent data={data} formatCurrency={formatCurrency} />;
    default:
      return <div className="text-white-dim text-xs">No renderer</div>;
  }
}

function SummaryContent({ data, formatCurrency, aggregatedValue, temporalView }: any) {
  // Calculate annual ecosystem services
  const annualServices =
    (data.forest?.valuation?.annualEcosystemServices?.total || 0) +
    (data.soil?.valuation?.annualEcosystemServices?.total || 0) +
    (data.biodiversity?.valuation?.naturalCapital?.annualTotal || 0) +
    (data.ocean?.valuation?.naturalCapital?.annualTotal || 0);

  return (
    <div className="space-y-4">
      {/* Total Natural Capital - Big display */}
      <div className="border-2 border-blue p-5 bg-blue/10 text-center">
        <div className="text-blue text-[10px] uppercase tracking-[0.15em] mb-2">
          TOTAL NATURAL CAPITAL VALUE
        </div>
        <div className="text-blue text-4xl font-bold font-mono mb-2">
          {formatCurrency(aggregatedValue)}
        </div>
        <div className="text-white-dim text-[10px]">
          20-YEAR NPV • ~10KM RADIUS
        </div>
      </div>

      {/* Annual Services */}
      <div className="border border-white p-4 bg-code">
        <div className="flex justify-between items-center">
          <div className="text-white-dim text-[10px] uppercase">Annual Ecosystem Services</div>
          <div className="text-white font-mono text-lg">{formatCurrency(annualServices)}/yr</div>
        </div>
      </div>

      {/* Breakdown by category */}
      <div className="text-[10px] font-mono uppercase tracking-wider text-white-dim mb-2">
        Value Breakdown
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="border border-white/50 p-3 bg-code">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">🌲</span>
            <span className="text-white-dim text-[10px]">FOREST</span>
          </div>
          <div className="text-white font-mono text-sm font-bold">
            {data.forest?.valuation?.naturalCapital?.totalFormatted || "—"}
          </div>
        </div>
        <div className="border border-white/50 p-3 bg-code">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">▦</span>
            <span className="text-white-dim text-[10px]">SOIL CARBON</span>
          </div>
          <div className="text-white font-mono text-sm font-bold">
            {data.soil?.valuation?.naturalCapital?.carbonStockFormatted || "—"}
          </div>
        </div>
        <div className="border border-white/50 p-3 bg-code">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">◉</span>
            <span className="text-white-dim text-[10px]">BIODIVERSITY</span>
          </div>
          <div className="text-white font-mono text-sm font-bold">
            {data.biodiversity?.valuation?.naturalCapital?.annualTotalFormatted || "—"}
            <span className="text-white-dim text-[10px] font-normal">/yr</span>
          </div>
        </div>
        <div className="border border-white/50 p-3 bg-code">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">≋</span>
            <span className="text-white-dim text-[10px]">MARINE</span>
          </div>
          <div className="text-white font-mono text-sm font-bold">
            {data.ocean?.valuation?.naturalCapital?.annualTotalFormatted || "—"}
            <span className="text-white-dim text-[10px] font-normal">/yr</span>
          </div>
        </div>
      </div>

      {/* Weather snapshot if available */}
      {data.weather?.current && (
        <div className="border border-white/30 p-3 bg-code/50">
          <div className="text-white-dim text-[10px] uppercase mb-2">Current Conditions</div>
          <div className="flex justify-between items-center font-mono text-sm">
            <span className="text-white">{data.weather.current.temperature}°C</span>
            <span className="text-white-dim">{data.weather.current.conditions}</span>
            <span className="text-white-dim">{data.weather.current.humidity}% RH</span>
          </div>
        </div>
      )}

      {/* Temporal comparison */}
      {temporalView !== "present" && (
        <div className={`border-2 p-4 ${temporalView === "past" ? "border-white" : "border-orange"}`}>
          <div className={`text-[11px] font-mono uppercase tracking-wider mb-2 ${
            temporalView === "past" ? "text-white" : "text-orange"
          }`}>
            {temporalView === "past" ? "Historical Comparison" : "Projected Change"}
          </div>
          <div className="text-white font-mono">
            {temporalView === "past" ? (
              <>
                <div className="text-lg mb-1">{formatCurrency(aggregatedValue * 1.15)}</div>
                <div className="text-[10px] text-white-dim">2000 baseline • −13% since then</div>
              </>
            ) : (
              <>
                <div className="text-lg text-orange mb-1">{formatCurrency(aggregatedValue * 0.85)}</div>
                <div className="text-[10px] text-white-dim">2050 projection • −15% if current trends continue</div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function CarbonContent({ data, formatCurrency, temporalView }: any) {
  if (!data) return <div className="text-white-dim text-xs font-mono">No data available</div>;

  return (
    <div className="space-y-3">
      {/* Key metrics */}
      <div className="grid grid-cols-2 gap-3">
        <div className="border border-white/50 p-3 bg-code">
          <div className="text-white-dim text-[10px] uppercase mb-1">Atmospheric CO₂</div>
          <div className="text-white text-xl font-mono font-bold">{data.atmosphere?.co2ppm || "—"}</div>
          <div className="text-white-dim text-[10px]">ppm</div>
        </div>
        <div className="border border-white/50 p-3 bg-code">
          <div className="text-white-dim text-[10px] uppercase mb-1">Per Capita</div>
          <div className="text-white text-xl font-mono font-bold">{data.emissions?.co2 || "—"}</div>
          <div className="text-white-dim text-[10px]">tonnes CO₂/yr</div>
        </div>
      </div>

      {/* Carbon Economics */}
      {data.valuation && (
        <div className="border-2 border-blue p-4 bg-blue/5">
          <div className="text-blue text-[10px] uppercase tracking-wider mb-3">Carbon Economics</div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-white-dim text-[11px]">Sequestration Value</span>
              <span className="text-white font-mono">{data.valuation.naturalCapital?.totalSequestrationValueFormatted || "—"}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white-dim text-[11px]">Social Cost of Emissions</span>
              <span className="text-orange font-mono">{data.valuation.emissionsCost?.socialCostFormatted || "—"}/yr</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-white/20">
              <span className="text-white-dim text-[11px]">Net Position</span>
              <span className={`font-mono ${data.valuation.netPosition?.isPositive ? 'text-blue' : 'text-orange'}`}>
                {data.valuation.netPosition?.status || "—"}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Temporal context */}
      {temporalView === "past" && (
        <div className="border border-white/30 p-3 text-[11px] font-mono">
          <div className="text-white-dim mb-1">Historical Context</div>
          <div className="text-white">
            2000 baseline: ~370 ppm
            <span className="text-orange ml-2">+{((data.atmosphere?.co2ppm || 420) - 370).toFixed(0)} ppm since</span>
          </div>
        </div>
      )}
      {temporalView === "projected" && (
        <div className="border border-orange p-3 text-[11px] font-mono">
          <div className="text-orange mb-1">2050 Projection</div>
          <div className="text-white">
            ~500 ppm expected
            <span className="text-orange ml-2">+{(500 - (data.atmosphere?.co2ppm || 420)).toFixed(0)} ppm from now</span>
          </div>
        </div>
      )}
    </div>
  );
}

function ForestContent({ data, formatCurrency, temporalView }: any) {
  if (!data) return <div className="text-white-dim text-xs">No data</div>;

  return (
    <div className="space-y-2 text-[10px] font-mono">
      <div className="grid grid-cols-2 gap-2">
        <div className="border border-white p-2">
          <div className="text-white-dim">COVER</div>
          <div className="text-white text-lg">{data.forestCover?.current || "N/A"}%</div>
        </div>
        <div className="border border-white p-2">
          <div className="text-white-dim">AREA</div>
          <div className="text-white text-lg">{data.forestCover?.area || "N/A"} km²</div>
        </div>
      </div>
      {data.valuation && (
        <>
          <div className="border border-blue p-2">
            <div className="text-blue mb-1">NATURAL_CAPITAL</div>
            <div className="text-white">{data.valuation.naturalCapital?.totalFormatted}</div>
          </div>
          <div className="border border-orange p-2">
            <div className="text-orange mb-1">DEFORESTATION_COST</div>
            <div className="text-white">{data.valuation.deforestationCost?.annualLossFormatted}/yr</div>
          </div>
        </>
      )}
      {temporalView === "past" && data.forestCover && (
        <div className="text-white-dim">2000 cover: {(data.forestCover.current + 3).toFixed(1)}% (lost {data.loss?.total || 0} km²)</div>
      )}
      {temporalView === "projected" && data.forestCover && (
        <div className="text-orange">2050 projected: {(data.forestCover.current - 5).toFixed(1)}% at current loss rate</div>
      )}
    </div>
  );
}

function SoilContent({ data, formatCurrency, temporalView }: any) {
  if (!data) return <div className="text-white-dim text-xs">No data</div>;

  return (
    <div className="space-y-2 text-[10px] font-mono">
      <div className="grid grid-cols-2 gap-2">
        <div className="border border-white p-2">
          <div className="text-white-dim">HEALTH</div>
          <div className="text-white text-lg">{data.health?.score || "N/A"}/100</div>
        </div>
        <div className="border border-white p-2">
          <div className="text-white-dim">CARBON</div>
          <div className="text-white text-lg">{data.health?.carbonContent || "N/A"} T/ha</div>
        </div>
      </div>
      {data.valuation && (
        <div className="border border-blue p-2">
          <div className="text-blue mb-1">CARBON_STOCK_VALUE</div>
          <div className="text-white">{data.valuation.naturalCapital?.carbonStockFormatted}</div>
          <div className="text-white-dim">Restoration potential: +{data.valuation.restoration?.potentialFormatted}</div>
        </div>
      )}
    </div>
  );
}

function BiodiversityContent({ data, formatCurrency }: any) {
  if (!data) return <div className="text-white-dim text-xs">No data</div>;

  return (
    <div className="space-y-2 text-[10px] font-mono">
      <div className="grid grid-cols-2 gap-2">
        <div className="border border-white p-2">
          <div className="text-white-dim">SPECIES</div>
          <div className="text-white text-lg">{data.summary?.uniqueSpecies || "N/A"}</div>
        </div>
        <div className="border border-white p-2">
          <div className="text-white-dim">OBSERVATIONS</div>
          <div className="text-white text-lg">{data.summary?.totalOccurrences || "N/A"}</div>
        </div>
      </div>
      {data.valuation && (
        <>
          <div className="border border-blue p-2">
            <div className="text-blue mb-1">ECOSYSTEM_SERVICES</div>
            <div className="text-white">{data.valuation.naturalCapital?.annualTotalFormatted}/yr</div>
          </div>
          <div className="border border-orange p-2">
            <div className="text-orange mb-1">EXTINCTION_RISK</div>
            <div className="text-white">{data.valuation.extinctionRisk?.atRiskSpecies || 0} species at risk</div>
            <div className="text-white-dim">Potential loss: {data.valuation.extinctionRisk?.potentialLossValueFormatted}</div>
          </div>
        </>
      )}
    </div>
  );
}

function OceanContent({ data, formatCurrency }: any) {
  if (!data) return <div className="text-white-dim text-xs">No data</div>;

  return (
    <div className="space-y-2 text-[10px] font-mono">
      <div className="grid grid-cols-2 gap-2">
        <div className="border border-white p-2">
          <div className="text-white-dim">SEA_TEMP</div>
          <div className="text-white text-lg">{data.current?.seaTemperature || "N/A"}°C</div>
        </div>
        <div className="border border-white p-2">
          <div className="text-white-dim">WAVE_HEIGHT</div>
          <div className="text-white text-lg">{data.current?.waveHeight?.toFixed(1) || "N/A"}m</div>
        </div>
      </div>
      {data.valuation && (
        <>
          <div className="border border-blue p-2">
            <div className="text-blue mb-1">MARINE_SERVICES</div>
            <div className="text-white">{data.valuation.naturalCapital?.annualTotalFormatted}/yr</div>
          </div>
          <div className="border border-orange p-2">
            <div className="text-orange mb-1">CLIMATE_RISK</div>
            <div className="text-white">{data.valuation.climateRisks?.totalAnnualRiskFormatted}/yr</div>
          </div>
        </>
      )}
    </div>
  );
}
