"use client";

import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { DeforestationData } from "@/types/deforestation";
import { getForestHealthRating, getTrendColor } from "@/lib/deforestation";
import { Gauge, DonutChart, HorizontalBars } from "./visualizations";

interface DeforestationWidgetProps {
  defaultLocation?: string;
  defaultLat?: number;
  defaultLon?: number;
}

export default function DeforestationWidget({
  defaultLocation = "Salt Spring Island, BC",
  defaultLat = 48.8167,
  defaultLon = -123.5,
}: DeforestationWidgetProps) {
  const [data, setData] = useState<DeforestationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/deforestation?location=${encodeURIComponent(defaultLocation)}&lat=${defaultLat}&lon=${defaultLon}`
      );

      if (!response.ok) throw new Error("Failed to fetch forest data");
      setData(await response.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [defaultLocation]);

  const chartData = data?.history.slice(-15).map((h) => ({
    year: h.year.toString(),
    "Forest Cover %": h.coverPercent,
  }));

  // Forest cover thresholds for gauge
  const coverThresholds = [
    { value: 20, color: "#FF8C42" }, // Critical
    { value: 40, color: "#FFB347" }, // Poor
    { value: 60, color: "#E8E8E8" }, // Moderate
    { value: 100, color: "#00A7E1" }, // Good
  ];

  // Carbon balance donut
  const getCarbonBalance = () => {
    if (!data) return [];
    return [
      { name: "Stored", value: data.carbon.stored, color: "#00A7E1" },
      { name: "Emitted", value: data.carbon.emitted, color: "#FF8C42" },
    ];
  };

  // Loss/Gain bars
  const getLossGainBars = () => {
    if (!data) return [];
    const maxVal = Math.max(data.loss.total, data.gain.total) * 1.2;
    return [
      { label: "Tree Loss", value: data.loss.total, max: maxVal, color: "#FF8C42" },
      { label: "Tree Gain", value: data.gain.total, max: maxVal, color: "#00A7E1" },
    ];
  };

  return (
    <div className="terminal-window p-6 h-full">
      <div className="window-header mb-6">
        <span className="text-blue">[FOREST_WATCH_MODULE]</span>
        <div className="window-controls">
          <div className="window-control"></div>
          <div className="window-control"></div>
          <div className="window-control"></div>
        </div>
      </div>

      <div className="mb-4 border border-blue bg-code p-3">
        <div className="flex items-center gap-2 text-blue text-xs font-mono">
          <span className="status-indicator status-active"></span>
          <div>
            <div className="font-bold uppercase">GLOBAL_FOREST_WATCH</div>
            <div className="text-[10px] text-white-dim">
              DEFORESTATION • REFORESTATION • CARBON STORAGE
            </div>
          </div>
        </div>
      </div>

      {loading && (
        <div className="text-white-dim font-mono text-sm">
          <span className="text-blue">&gt;</span> SCANNING_FOREST_COVERAGE
          <span className="cursor"></span>
        </div>
      )}

      {error && (
        <div className="border border-white bg-code p-4 text-white font-mono text-sm">
          <span>&gt;&gt; ERROR:</span> {error}
        </div>
      )}

      {data && !loading && !error && (
        <>
          {/* Header */}
          <div className="border border-white bg-code p-4 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-1">
                  {data.location.name}
                </h3>
                <div className="text-xs text-white-dim uppercase">
                  {data.location.region}
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue font-mono">
                  {data.forestCover.current}%
                </div>
                <div className="text-[10px] text-white-dim">FOREST COVER</div>
              </div>
            </div>
          </div>

          {/* Gauge + Carbon Donut */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Forest Cover Gauge */}
            <div className="border border-white bg-code p-4">
              <div className="text-white-dim uppercase text-[10px] tracking-widest mb-2 font-mono">
                COVER_STATUS
              </div>
              <Gauge
                value={data.forestCover.current}
                min={0}
                max={100}
                label={getForestHealthRating(data.forestCover.current, data.loss.trend).toUpperCase()}
                thresholds={coverThresholds}
                size="sm"
              />
            </div>

            {/* Carbon Balance Donut */}
            <div className="border border-white bg-code p-4">
              <div className="text-white-dim uppercase text-[10px] tracking-widest mb-2 font-mono">
                CARBON_BALANCE
              </div>
              <DonutChart
                data={getCarbonBalance()}
                height={100}
                showLegend={false}
                centerValue={`${data.carbon.stored - data.carbon.emitted > 0 ? "+" : ""}${data.carbon.stored - data.carbon.emitted}`}
                centerLabel="Mt NET"
              />
            </div>
          </div>

          {/* Key metrics */}
          <div className="grid grid-cols-4 gap-3 text-xs font-mono mb-6">
            <div className="border border-white p-3">
              <div className="text-white-dim uppercase mb-1 text-[10px]">AREA</div>
              <div className="text-white text-lg">{data.forestCover.area}</div>
              <div className="text-[10px] text-white-dim">KM²</div>
            </div>
            <div className="border border-white p-3">
              <div className="text-white-dim uppercase mb-1 text-[10px]">CHANGE</div>
              <div className={`text-lg ${data.forestCover.change < 0 ? "text-orange" : "text-blue"}`}>
                {data.forestCover.change > 0 ? "+" : ""}{data.forestCover.change}%
              </div>
              <div className="text-[10px] text-white-dim">2000→NOW</div>
            </div>
            <div className="border border-white p-3">
              <div className="text-white-dim uppercase mb-1 text-[10px]">TREND</div>
              <div className={`text-lg text-${getTrendColor(data.loss.trend)}`}>
                {data.loss.trend.toUpperCase().slice(0, 4)}
              </div>
              <div className="text-[10px] text-white-dim">RATE</div>
            </div>
            <div className="border border-white p-3">
              <div className="text-white-dim uppercase mb-1 text-[10px]">ALERTS</div>
              <div className={`text-lg ${data.alerts.recent > 0 ? "text-orange" : "text-blue"}`}>
                {data.alerts.recent}
              </div>
              <div className="text-[10px] text-white-dim">30 DAYS</div>
            </div>
          </div>

          {/* Loss/Gain Bars */}
          <div className="border border-white bg-code p-4 mb-6">
            <div className="text-white-dim uppercase text-xs tracking-widest mb-3 font-mono">
              <span className="text-blue">&gt;&gt;</span> LOSS_VS_GAIN (KM²)
            </div>
            <HorizontalBars
              data={getLossGainBars()}
              showValues={true}
              unit=" km²"
            />
            <div className="mt-3 flex justify-between text-[10px] font-mono">
              <span className="text-white-dim">
                NET: <span className={data.gain.netChange >= 0 ? "text-blue" : "text-orange"}>
                  {data.gain.netChange >= 0 ? "+" : ""}{data.gain.netChange} km²
                </span>
              </span>
              <span className="text-white-dim">
                ANNUAL: <span className="text-orange">{data.loss.annual} km²/yr</span>
              </span>
            </div>
          </div>

          {/* Forest Cover History */}
          <div className="border border-white bg-code p-4 mb-6">
            <div className="text-white-dim uppercase text-xs tracking-widest mb-3 font-mono">
              <span className="text-blue">&gt;&gt;</span> FOREST_COVER_HISTORY (%)
            </div>
            <ResponsiveContainer width="100%" height={120}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff33" />
                <XAxis dataKey="year" stroke="#ffffff" style={{ fontSize: "10px", fontFamily: "monospace" }} />
                <YAxis stroke="#ffffff" style={{ fontSize: "10px", fontFamily: "monospace" }} domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: "#D2691E", border: "1px solid #ffffff", fontFamily: "monospace", fontSize: "11px" }} />
                <Area type="monotone" dataKey="Forest Cover %" stroke="#00A7E1" fill="#00A7E177" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Natural Capital Valuation */}
          {(data as any).valuation && (
            <div className="border-2 border-blue bg-code p-4 mb-6">
              <div className="text-blue uppercase text-xs tracking-widest mb-3 font-mono font-bold">
                <span className="text-white">$$</span> NATURAL_CAPITAL_VALUE
              </div>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="border border-white p-3">
                  <div className="text-white-dim uppercase mb-1 text-[10px]">TOTAL_ASSET</div>
                  <div className="text-blue text-xl font-bold">{(data as any).valuation.naturalCapital.totalFormatted}</div>
                  <div className="text-[10px] text-white-dim">NATURAL CAPITAL</div>
                </div>
                <div className="border border-white p-3">
                  <div className="text-white-dim uppercase mb-1 text-[10px]">ANNUAL_SERVICES</div>
                  <div className="text-blue text-xl font-bold">{(data as any).valuation.annualEcosystemServices.totalFormatted}</div>
                  <div className="text-[10px] text-white-dim">PER YEAR</div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-[10px] font-mono">
                <div className="border border-white p-2">
                  <div className="text-white-dim mb-1">CARBON</div>
                  <div className="text-white">{(data as any).valuation.annualEcosystemServices.breakdown.carbonSequestration.formatted}</div>
                </div>
                <div className="border border-white p-2">
                  <div className="text-white-dim mb-1">WATER</div>
                  <div className="text-white">{(data as any).valuation.annualEcosystemServices.breakdown.waterRegulation.formatted}</div>
                </div>
                <div className="border border-white p-2">
                  <div className="text-white-dim mb-1">BIODIV</div>
                  <div className="text-white">{(data as any).valuation.annualEcosystemServices.breakdown.biodiversityHabitat.formatted}</div>
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-white text-[10px] text-orange font-mono">
                <span className="text-white">&gt;</span> DEFORESTATION_COST: {(data as any).valuation.deforestationCost.annualLossFormatted}/yr
              </div>
            </div>
          )}

          {/* Info panel */}
          <div className="border border-blue bg-code p-3">
            <div className="text-xs text-white-dim font-mono space-y-1">
              <div><span className="text-blue">&gt;</span> PROTECTED: {data.biodiversity.protectedArea}% • INTACT: {data.biodiversity.intactForest}%</div>
              <div><span className="text-blue">&gt;</span> AT_RISK_SPECIES: {data.biodiversity.speciesAtRisk} • TREES: {(data.forestCover.treeCount || 0).toLocaleString()}</div>
              <div><span className="text-blue">&gt;</span> CAUSES: {data.loss.primaryCauses.slice(0, 3).join(" • ")}</div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white flex justify-between text-[10px] text-white-dim uppercase tracking-widest">
            <div>SOURCE: <span className="text-blue">GLOBAL_FOREST_WATCH</span></div>
            <div>UPDATED: <span className="text-blue">{new Date(data.lastUpdated).toLocaleDateString()}</span></div>
          </div>
        </>
      )}
    </div>
  );
}
