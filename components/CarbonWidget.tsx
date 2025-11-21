"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { CarbonData } from "@/types/carbon";
import { getEmissionRating, getTrendSymbol, GLOBAL_CO2_PPM, PRE_INDUSTRIAL_CO2 } from "@/lib/carbon";
import { Gauge, DonutChart } from "./visualizations";

interface CarbonWidgetProps {
  defaultLocation?: string;
  defaultLat?: number;
  defaultLon?: number;
}

// Paris Agreement target - 1.5°C warming carbon budget (in Gt CO2)
const CARBON_BUDGET_GT = 400; // Remaining budget from ~2023

export default function CarbonWidget({
  defaultLocation = "Salt Spring Island, BC",
  defaultLat = 48.8167,
  defaultLon = -123.5,
}: CarbonWidgetProps) {
  const [data, setData] = useState<CarbonData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/carbon?location=${encodeURIComponent(defaultLocation)}&lat=${defaultLat}&lon=${defaultLon}`
      );

      if (!response.ok) throw new Error("Failed to fetch carbon data");
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

  const chartData = data?.history.map((h) => ({
    year: h.year.toString(),
    "CO₂ (ppm)": h.co2.toFixed(1),
  }));

  // Emissions breakdown for donut chart
  const getEmissionsBreakdown = () => {
    if (!data) return [];
    // Simulate sector breakdown based on total emissions
    const total = data.emissions.co2;
    return [
      { name: "Energy", value: total * 0.35, color: "#FF8C42" },
      { name: "Transport", value: total * 0.25, color: "#00A7E1" },
      { name: "Industry", value: total * 0.20, color: "#E8E8E8" },
      { name: "Buildings", value: total * 0.12, color: "#98D8C8" },
      { name: "Other", value: total * 0.08, color: "#FFB347" },
    ];
  };

  // Carbon budget gauge thresholds
  const budgetThresholds = [
    { value: 25, color: "#00A7E1" },  // Good
    { value: 50, color: "#98D8C8" },  // Moderate
    { value: 75, color: "#FFB347" },  // Warning
    { value: 100, color: "#FF8C42" }, // Critical
  ];

  // Calculate budget usage (simulated based on regional emissions)
  const getBudgetUsage = () => {
    if (!data) return 0;
    // High emitters use budget faster
    const emissionRate = data.emissions.co2;
    const budgetUsageRate = (emissionRate / 10) * 100; // Normalize to percentage
    return Math.min(budgetUsageRate, 100);
  };

  return (
    <div className="terminal-window p-6 h-full">
      <div className="window-header mb-6">
        <span className="text-blue">[CARBON_TRACKING_MODULE]</span>
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
            <div className="font-bold uppercase">CARBON_OBSERVATORY</div>
            <div className="text-[10px] text-white-dim">
              EMISSIONS • SEQUESTRATION • ATMOSPHERIC CO₂
            </div>
          </div>
        </div>
      </div>

      {loading && (
        <div className="text-white-dim font-mono text-sm">
          <span className="text-blue">&gt;</span> CALCULATING_CARBON_FOOTPRINT
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
          {/* Header with CO2 PPM */}
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
                <div className="text-3xl font-bold text-blue font-mono">
                  {data.atmosphere.co2ppm}
                </div>
                <div className="text-xs text-white-dim">PPM CO₂</div>
              </div>
            </div>
          </div>

          {/* Gauge + Donut side by side */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Carbon Budget Gauge */}
            <div className="border border-white bg-code p-4">
              <div className="text-white-dim uppercase text-[10px] tracking-widest mb-2 font-mono">
                EMISSION_INTENSITY
              </div>
              <Gauge
                value={getBudgetUsage()}
                min={0}
                max={100}
                label={getEmissionRating(data.emissions.co2).toUpperCase()}
                thresholds={budgetThresholds}
                size="sm"
              />
              <div className="text-center text-[10px] text-white-dim font-mono mt-2">
                {data.emissions.co2} T/CAPITA
              </div>
            </div>

            {/* Emissions Breakdown Donut */}
            <div className="border border-white bg-code p-4">
              <div className="text-white-dim uppercase text-[10px] tracking-widest mb-2 font-mono">
                BY_SECTOR
              </div>
              <DonutChart
                data={getEmissionsBreakdown()}
                height={100}
                showLegend={false}
                centerValue={`${data.emissions.co2}`}
                centerLabel="T CO₂"
              />
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-3 text-xs font-mono mb-6">
            <div className="border border-white p-3">
              <div className="text-white-dim uppercase mb-1 text-[10px]">TREND</div>
              <div className={`text-lg ${data.emissions.trend === "decreasing" ? "text-blue" : "text-orange"}`}>
                {getTrendSymbol(data.emissions.trend)} {Math.abs(data.emissions.changePercent)}%
              </div>
            </div>
            <div className="border border-white p-3">
              <div className="text-white-dim uppercase mb-1 text-[10px]">FOREST_C</div>
              <div className="text-white text-lg">{data.sequestration.forestCarbon}</div>
              <div className="text-white-dim text-[10px]">T STORED</div>
            </div>
            <div className="border border-white p-3">
              <div className="text-white-dim uppercase mb-1 text-[10px]">NET</div>
              <div className={`text-lg ${data.sequestration.netBalance > 0 ? "text-orange" : "text-blue"}`}>
                {data.sequestration.netBalance > 0 ? "+" : ""}{data.sequestration.netBalance}
              </div>
            </div>
          </div>

          {/* CO2 Trend Chart */}
          <div className="border border-white bg-code p-4 mb-6">
            <div className="text-white-dim uppercase text-xs tracking-widest mb-3 font-mono">
              <span className="text-blue">&gt;&gt;</span> ATMOSPHERIC_CO₂ (PPM)
            </div>
            <ResponsiveContainer width="100%" height={120}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff33" />
                <XAxis dataKey="year" stroke="#ffffff" style={{ fontSize: "10px", fontFamily: "monospace" }} />
                <YAxis stroke="#ffffff" style={{ fontSize: "10px", fontFamily: "monospace" }} domain={["dataMin - 5", "dataMax + 5"]} />
                <Tooltip contentStyle={{ backgroundColor: "#D2691E", border: "1px solid #ffffff", fontFamily: "monospace", fontSize: "11px" }} />
                <Line type="monotone" dataKey="CO₂ (ppm)" stroke="#00A7E1" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Info panel */}
          <div className="border border-blue bg-code p-3">
            <div className="text-xs text-white-dim font-mono space-y-1">
              <div><span className="text-blue">&gt;</span> PRE-INDUSTRIAL: {PRE_INDUSTRIAL_CO2}ppm • CURRENT: {GLOBAL_CO2_PPM}ppm (+{((GLOBAL_CO2_PPM / PRE_INDUSTRIAL_CO2 - 1) * 100).toFixed(0)}%)</div>
              <div><span className="text-blue">&gt;</span> METHANE: {data.atmosphere.ch4ppb}ppb • BUDGET: ~{CARBON_BUDGET_GT}Gt remaining</div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white flex justify-between text-[10px] text-white-dim uppercase tracking-widest">
            <div>SOURCE: <span className="text-blue">GLOBAL_CARBON_PROJECT</span></div>
            <div>UPDATED: <span className="text-blue">{new Date(data.lastUpdated).toLocaleDateString()}</span></div>
          </div>
        </>
      )}
    </div>
  );
}
