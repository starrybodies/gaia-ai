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

  return (
    <div className="terminal-window p-6">
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
                  {data.forestCover.current}%
                </div>
                <div className="text-xs text-white-dim">FOREST COVER</div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
              <div className="border border-white p-3">
                <div className="text-white-dim uppercase mb-1">BASELINE</div>
                <div className="text-white text-lg">{data.forestCover.baseline}%</div>
                <div className="text-white-dim text-[10px]">YEAR 2000</div>
              </div>

              <div className="border border-white p-3">
                <div className="text-white-dim uppercase mb-1">CHANGE</div>
                <div className={`text-lg ${data.forestCover.change < 0 ? "text-orange" : "text-blue"}`}>
                  {data.forestCover.change > 0 ? "+" : ""}{data.forestCover.change}%
                </div>
                <div className="text-white-dim text-[10px]">SINCE 2000</div>
              </div>

              <div className="border border-white p-3">
                <div className="text-white-dim uppercase mb-1">AREA</div>
                <div className="text-white text-lg">{data.forestCover.area}</div>
                <div className="text-white-dim text-[10px]">KM²</div>
              </div>

              <div className="border border-white p-3">
                <div className="text-white-dim uppercase mb-1">TREND</div>
                <div className={`text-lg text-${getTrendColor(data.loss.trend)}`}>
                  {data.loss.trend.toUpperCase()}
                </div>
                <div className="text-white-dim text-[10px]">LOSS RATE</div>
              </div>
            </div>
          </div>

          <div className="border border-white bg-code p-4 mb-6">
            <div className="text-white-dim uppercase text-xs tracking-widest mb-4 font-mono">
              <span className="text-blue">&gt;&gt;</span> FOREST_COVER_HISTORY (%)
            </div>
            <ResponsiveContainer width="100%" height={150}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff33" />
                <XAxis dataKey="year" stroke="#ffffff" style={{ fontSize: "10px", fontFamily: "monospace" }} />
                <YAxis stroke="#ffffff" style={{ fontSize: "10px", fontFamily: "monospace" }} domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: "#D2691E", border: "1px solid #ffffff", fontFamily: "monospace", fontSize: "11px" }} />
                <Area type="monotone" dataKey="Forest Cover %" stroke="#00A7E1" fill="#00A7E177" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            <div className="border border-white bg-code p-4">
              <div className="text-white-dim uppercase text-xs tracking-widest mb-4 font-mono">
                <span className="text-blue">&gt;&gt;</span> LOSS_STATISTICS
              </div>
              <div className="space-y-2 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-white-dim">TOTAL_LOSS</span>
                  <span className="text-orange">{data.loss.total} km²</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white-dim">ANNUAL_AVG</span>
                  <span className="text-white">{data.loss.annual} km²/yr</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white-dim">REFORESTATION</span>
                  <span className="text-blue">{data.gain.total} km²</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white-dim">NET_CHANGE</span>
                  <span className={data.gain.netChange < 0 ? "text-orange" : "text-blue"}>
                    {data.gain.netChange} km²
                  </span>
                </div>
              </div>
            </div>

            <div className="border border-white bg-code p-4">
              <div className="text-white-dim uppercase text-xs tracking-widest mb-4 font-mono">
                <span className="text-blue">&gt;&gt;</span> CARBON_IMPACT
              </div>
              <div className="space-y-2 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-white-dim">STORED</span>
                  <span className="text-blue">{data.carbon.stored} Mt CO₂</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white-dim">EMITTED</span>
                  <span className="text-orange">{data.carbon.emitted} Mt CO₂</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white-dim">PROTECTED</span>
                  <span className="text-white">{data.biodiversity.protectedArea}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white-dim">AT_RISK_SPECIES</span>
                  <span className="text-white">{data.biodiversity.speciesAtRisk}</span>
                </div>
              </div>
            </div>
          </div>

          {data.alerts.recent > 0 && (
            <div className="border border-orange bg-code p-4 mb-6">
              <div className="text-orange uppercase text-xs tracking-widest mb-2 font-mono">
                <span>&gt;&gt;</span> {data.alerts.recent} RECENT ALERTS (30 DAYS)
              </div>
              <div className="text-xs text-white-dim font-mono">
                Primary causes: {data.loss.primaryCauses.join(" • ")}
              </div>
            </div>
          )}

          <div className="border border-blue bg-code p-4">
            <div className="text-xs text-white-dim font-mono space-y-1">
              <div><span className="text-blue">&gt;</span> STATUS: {getForestHealthRating(data.forestCover.current, data.loss.trend).toUpperCase()}</div>
              <div><span className="text-blue">&gt;</span> INTACT_FOREST: {data.biodiversity.intactForest}% of total</div>
              <div><span className="text-blue">&gt;</span> ESTIMATED_TREES: {(data.forestCover.treeCount || 0).toLocaleString()}</div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white flex justify-between text-[10px] text-white-dim uppercase tracking-widest">
            <div>SOURCE: <span className="text-blue">GLOBAL_FOREST_WATCH</span></div>
            <div>UPDATED: <span className="text-blue">{new Date(data.lastUpdated).toLocaleDateString()}</span></div>
          </div>
        </>
      )}
    </div>
  );
}
