"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { ClimateData } from "@/types/climate";

export default function ClimateWidget() {
  const [climateData, setClimateData] = useState<ClimateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState("San Francisco, CA");

  const fetchClimateData = async (locationName: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/climate?location=${encodeURIComponent(locationName)}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch climate data");
      }

      const data = await response.json();
      setClimateData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClimateData(location);
  }, []);

  const handleLocationChange = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newLocation = formData.get("location") as string;
    if (newLocation.trim()) {
      setLocation(newLocation);
      fetchClimateData(newLocation);
    }
  };

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
  };

  // Prepare data for charts (sample every Nth point for readability)
  const chartData = climateData?.timeSeries
    .filter((_, index) => index % 4 === 0) // Show every 4th point
    .map((point) => ({
      date: formatDate(point.date),
      "Max Temp": point.tempMax?.toFixed(1),
      "Min Temp": point.tempMin?.toFixed(1),
      "Avg Temp": point.tempAvg?.toFixed(1),
      Precipitation: point.precipitation?.toFixed(1),
    }));

  return (
    <div className="terminal-window p-6">
      <div className="window-header mb-6">
        <span className="text-blue">[CLIMATE_DATA_MODULE]</span>
        <div className="window-controls">
          <div className="window-control"></div>
          <div className="window-control"></div>
          <div className="window-control"></div>
        </div>
      </div>

      {/* Demo mode banner */}
      <div className="mb-4 border border-blue bg-code p-3">
        <div className="flex items-center gap-2 text-blue text-xs font-mono">
          <span className="status-indicator status-active"></span>
          <div>
            <div className="font-bold uppercase">NOAA_CDO_CONNECTED</div>
            <div className="text-[10px] text-white-dim">
              HISTORICAL CLIMATE DATA • GLOBAL COVERAGE
            </div>
          </div>
        </div>
      </div>

      {/* Location input */}
      <form onSubmit={handleLocationChange} className="mb-6">
        <div className="flex gap-2">
          <div className="flex-1 border border-white bg-code p-2 flex items-center">
            <span className="text-blue mr-2">&gt;</span>
            <input
              type="text"
              name="location"
              defaultValue={location}
              placeholder="ENTER_LOCATION"
              className="bg-transparent border-none outline-none text-white font-mono text-sm flex-1 uppercase tracking-wider placeholder:text-white-dim placeholder:opacity-50"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 border-2 border-blue text-blue hover:bg-blue hover:text-white transition-all font-mono text-xs uppercase tracking-wider"
          >
            QUERY
          </button>
        </div>
      </form>

      {loading && (
        <div className="text-white-dim font-mono text-sm">
          <span className="text-blue">&gt;</span> FETCHING_CLIMATE_DATA
          <span className="cursor"></span>
        </div>
      )}

      {error && (
        <div className="border border-white bg-code p-4 text-white font-mono text-sm">
          <span>&gt;&gt; ERROR:</span> {error}
        </div>
      )}

      {climateData && !loading && !error && (
        <>
          {/* Summary Stats */}
          <div className="border border-white bg-code p-6 mb-6">
            <h3 className="text-xl font-bold text-white uppercase tracking-wider mb-4">
              {climateData.location}
            </h3>
            <div className="text-xs text-white-dim uppercase tracking-widest mb-4">
              {climateData.startDate} → {climateData.endDate}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-mono">
              <div className="border border-white p-3">
                <div className="text-white-dim uppercase mb-1">AVG_MAX_TEMP</div>
                <div className="text-white text-lg">
                  {climateData.summary.avgTempMax.toFixed(1)}°C
                </div>
                <div className="text-white-dim text-[10px]">
                  ({(climateData.summary.avgTempMax * 9/5 + 32).toFixed(1)}°F)
                </div>
              </div>

              <div className="border border-white p-3">
                <div className="text-white-dim uppercase mb-1">AVG_MIN_TEMP</div>
                <div className="text-white text-lg">
                  {climateData.summary.avgTempMin.toFixed(1)}°C
                </div>
                <div className="text-white-dim text-[10px]">
                  ({(climateData.summary.avgTempMin * 9/5 + 32).toFixed(1)}°F)
                </div>
              </div>

              <div className="border border-white p-3">
                <div className="text-white-dim uppercase mb-1">TOTAL_PRECIP</div>
                <div className="text-white text-lg">
                  {climateData.summary.totalPrecipitation.toFixed(0)} mm
                </div>
                <div className="text-white-dim text-[10px]">
                  ({(climateData.summary.totalPrecipitation / 25.4).toFixed(1)} in)
                </div>
              </div>
            </div>
          </div>

          {/* Temperature Chart */}
          <div className="border border-white bg-code p-4 mb-6">
            <div className="text-white-dim uppercase text-xs tracking-widest mb-4 font-mono">
              <span className="text-blue">&gt;&gt;</span> TEMPERATURE_TRENDS (°C)
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff33" />
                <XAxis
                  dataKey="date"
                  stroke="#ffffff"
                  style={{ fontSize: "10px", fontFamily: "monospace" }}
                />
                <YAxis
                  stroke="#ffffff"
                  style={{ fontSize: "10px", fontFamily: "monospace" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#D2691E",
                    border: "1px solid #ffffff",
                    fontFamily: "monospace",
                    fontSize: "11px",
                  }}
                />
                <Legend
                  wrapperStyle={{
                    fontSize: "10px",
                    fontFamily: "monospace",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="Max Temp"
                  stroke="#FF8C42"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="Min Temp"
                  stroke="#00A7E1"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Precipitation Chart */}
          <div className="border border-white bg-code p-4 mb-6">
            <div className="text-white-dim uppercase text-xs tracking-widest mb-4 font-mono">
              <span className="text-blue">&gt;&gt;</span> PRECIPITATION_PATTERN (mm)
            </div>
            <ResponsiveContainer width="100%" height={150}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff33" />
                <XAxis
                  dataKey="date"
                  stroke="#ffffff"
                  style={{ fontSize: "10px", fontFamily: "monospace" }}
                />
                <YAxis
                  stroke="#ffffff"
                  style={{ fontSize: "10px", fontFamily: "monospace" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#D2691E",
                    border: "1px solid #ffffff",
                    fontFamily: "monospace",
                    fontSize: "11px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="Precipitation"
                  stroke="#00A7E1"
                  fill="#00A7E177"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Info panel */}
          <div className="border border-blue bg-code p-4">
            <div className="text-xs text-white-dim font-mono space-y-1">
              <div>
                <span className="text-blue">&gt;</span> DATASET: NOAA Climate Data Online (CDO)
              </div>
              <div>
                <span className="text-blue">&gt;</span> COVERAGE: Historical weather observations
              </div>
              <div>
                <span className="text-blue">&gt;</span> DATA_POINTS: {climateData.summary.dataPoints} records over 1 year
              </div>
              <div>
                <span className="text-blue">&gt;</span> METRICS: Daily max/min temperatures, precipitation
              </div>
            </div>
          </div>

          {/* Status bar */}
          <div className="mt-6 pt-4 border-t border-white flex justify-between text-[10px] text-white-dim uppercase tracking-widest">
            <div>
              DATA_SOURCE: <span className="text-blue">NOAA_CDO_API</span>
            </div>
            <div>
              LOCATION_ID: <span className="text-blue">{climateData.locationId}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
