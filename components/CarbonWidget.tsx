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

interface CarbonWidgetProps {
  defaultLocation?: string;
  defaultLat?: number;
  defaultLon?: number;
}

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

  return (
    <div className="terminal-window p-6">
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
          <div className="border border-white bg-code p-6 mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-white uppercase tracking-wider mb-1">
                  {data.location.name}
                </h3>
                <div className="text-xs text-white-dim uppercase">
                  {data.location.region} • {data.location.country}
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-blue font-mono">
                  {data.atmosphere.co2ppm}
                </div>
                <div className="text-xs text-white-dim">PPM CO₂</div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
              <div className="border border-white p-3">
                <div className="text-white-dim uppercase mb-1">EMISSIONS</div>
                <div className="text-white text-lg">{data.emissions.co2}</div>
                <div className="text-white-dim text-[10px]">T CO₂/CAPITA</div>
                <div className="text-blue text-[10px] mt-1">
                  {getEmissionRating(data.emissions.co2).toUpperCase()}
                </div>
              </div>

              <div className="border border-white p-3">
                <div className="text-white-dim uppercase mb-1">TREND</div>
                <div className="text-white text-lg">
                  {getTrendSymbol(data.emissions.trend)} {Math.abs(data.emissions.changePercent)}%
                </div>
                <div className="text-white-dim text-[10px]">{data.emissions.trend.toUpperCase()}</div>
              </div>

              <div className="border border-white p-3">
                <div className="text-white-dim uppercase mb-1">FOREST_C</div>
                <div className="text-white text-lg">{data.sequestration.forestCarbon}</div>
                <div className="text-white-dim text-[10px]">T CO₂ STORED</div>
              </div>

              <div className="border border-white p-3">
                <div className="text-white-dim uppercase mb-1">NET_BALANCE</div>
                <div className={`text-lg ${data.sequestration.netBalance > 0 ? "text-orange" : "text-blue"}`}>
                  {data.sequestration.netBalance > 0 ? "+" : ""}{data.sequestration.netBalance}
                </div>
                <div className="text-white-dim text-[10px]">T CO₂e</div>
              </div>
            </div>
          </div>

          <div className="border border-white bg-code p-4 mb-6">
            <div className="text-white-dim uppercase text-xs tracking-widest mb-4 font-mono">
              <span className="text-blue">&gt;&gt;</span> ATMOSPHERIC_CO₂_TREND (PPM)
            </div>
            <ResponsiveContainer width="100%" height={150}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff33" />
                <XAxis dataKey="year" stroke="#ffffff" style={{ fontSize: "10px", fontFamily: "monospace" }} />
                <YAxis stroke="#ffffff" style={{ fontSize: "10px", fontFamily: "monospace" }} domain={["dataMin - 5", "dataMax + 5"]} />
                <Tooltip contentStyle={{ backgroundColor: "#D2691E", border: "1px solid #ffffff", fontFamily: "monospace", fontSize: "11px" }} />
                <Line type="monotone" dataKey="CO₂ (ppm)" stroke="#00A7E1" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="border border-blue bg-code p-4">
            <div className="text-xs text-white-dim font-mono space-y-1">
              <div><span className="text-blue">&gt;</span> PRE-INDUSTRIAL CO₂: {PRE_INDUSTRIAL_CO2} ppm (baseline)</div>
              <div><span className="text-blue">&gt;</span> CURRENT GLOBAL: {GLOBAL_CO2_PPM} ppm (+{((GLOBAL_CO2_PPM / PRE_INDUSTRIAL_CO2 - 1) * 100).toFixed(0)}%)</div>
              <div><span className="text-blue">&gt;</span> METHANE (CH₄): {data.atmosphere.ch4ppb} ppb</div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white flex justify-between text-[10px] text-white-dim uppercase tracking-widest">
            <div>SOURCE: <span className="text-blue">GLOBAL_CARBON_PROJECT</span></div>
            <div>UPDATED: <span className="text-blue">{new Date(data.lastUpdated).toLocaleDateString()}</span></div>
          </div>
        </>
      )}
    </div>
  );
}
