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
  AreaChart,
  Area,
} from "recharts";
import type { OceanData } from "@/types/ocean";
import { getSeaState, getWindDirection, celsiusToFahrenheit, metersToFeet, msToKnots, POPULAR_STATIONS } from "@/lib/ocean";

export default function OceanWidget() {
  const [oceanData, setOceanData] = useState<OceanData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStation, setSelectedStation] = useState("46026");

  const fetchOceanData = async (stationId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/ocean?station=${stationId}`);

      if (!response.ok) {
        throw new Error("Failed to fetch ocean data");
      }

      const data = await response.json();
      setOceanData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOceanData(selectedStation);
  }, [selectedStation]);

  // Format time for charts
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Prepare chart data
  const chartData = oceanData?.history.map((point) => ({
    time: formatTime(point.timestamp),
    "Sea Temp": point.seaTemperature?.toFixed(1),
    "Wave Height": point.waveHeight?.toFixed(1),
  }));

  return (
    <div className="terminal-window p-6">
      <div className="window-header mb-6">
        <span className="text-blue">[OCEAN_METRICS_MODULE]</span>
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
            <div className="font-bold uppercase">NOAA_NDBC_CONNECTED</div>
            <div className="text-[10px] text-white-dim">
              BUOY DATA • SEA CONDITIONS • TIDE PREDICTIONS
            </div>
          </div>
        </div>
      </div>

      {/* Station selector */}
      <div className="mb-6">
        <div className="text-white-dim uppercase text-xs tracking-widest mb-2 font-mono">
          <span className="text-blue">&gt;</span> SELECT_BUOY_STATION
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {POPULAR_STATIONS.slice(0, 8).map((station) => (
            <button
              key={station.id}
              onClick={() => setSelectedStation(station.id)}
              className={`p-2 border text-xs font-mono uppercase transition-all ${
                selectedStation === station.id
                  ? "border-blue bg-blue text-white"
                  : "border-white text-white-dim hover:border-blue hover:text-blue"
              }`}
            >
              {station.name}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="text-white-dim font-mono text-sm">
          <span className="text-blue">&gt;</span> FETCHING_BUOY_DATA
          <span className="cursor"></span>
        </div>
      )}

      {error && (
        <div className="border border-white bg-code p-4 text-white font-mono text-sm">
          <span>&gt;&gt; ERROR:</span> {error}
        </div>
      )}

      {oceanData && !loading && !error && (
        <>
          {/* Station Info */}
          <div className="border border-white bg-code p-6 mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-white uppercase tracking-wider mb-1">
                  {oceanData.station.name}
                </h3>
                <div className="text-xs text-white-dim uppercase tracking-widest">
                  STATION_{oceanData.station.id} • {oceanData.station.lat.toFixed(3)}°N, {Math.abs(oceanData.station.lon).toFixed(3)}°W
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue font-mono">
                  {oceanData.current.seaTemperature}°C
                </div>
                <div className="text-xs text-white-dim">
                  ({celsiusToFahrenheit(oceanData.current.seaTemperature || 0).toFixed(1)}°F)
                </div>
              </div>
            </div>

            {/* Current Conditions Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
              <div className="border border-white p-3">
                <div className="text-white-dim uppercase mb-1">WAVE_HEIGHT</div>
                <div className="text-white text-lg">
                  {oceanData.current.waveHeight?.toFixed(1)} m
                </div>
                <div className="text-white-dim text-[10px]">
                  ({metersToFeet(oceanData.current.waveHeight || 0).toFixed(1)} ft)
                </div>
                <div className="text-blue text-[10px] mt-1">
                  {getSeaState(oceanData.current.waveHeight || 0).toUpperCase()}
                </div>
              </div>

              <div className="border border-white p-3">
                <div className="text-white-dim uppercase mb-1">WAVE_PERIOD</div>
                <div className="text-white text-lg">
                  {oceanData.current.wavePeriod?.toFixed(1)} s
                </div>
                <div className="text-white-dim text-[10px]">DOMINANT</div>
              </div>

              <div className="border border-white p-3">
                <div className="text-white-dim uppercase mb-1">WIND</div>
                <div className="text-white text-lg">
                  {msToKnots(oceanData.current.windSpeed || 0).toFixed(0)} kts
                </div>
                <div className="text-white-dim text-[10px]">
                  {getWindDirection(oceanData.current.windDirection || 0)} ({oceanData.current.windDirection}°)
                </div>
              </div>

              <div className="border border-white p-3">
                <div className="text-white-dim uppercase mb-1">PRESSURE</div>
                <div className="text-white text-lg">
                  {oceanData.current.pressure?.toFixed(0)} hPa
                </div>
                <div className="text-white-dim text-[10px]">BAROMETRIC</div>
              </div>
            </div>
          </div>

          {/* Tide Predictions */}
          {oceanData.tides && (
            <div className="border border-white bg-code p-4 mb-6">
              <div className="text-white-dim uppercase text-xs tracking-widest mb-4 font-mono">
                <span className="text-blue">&gt;&gt;</span> TIDE_PREDICTIONS • CURRENTLY {oceanData.tides.current.toUpperCase()}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {oceanData.tides.next.map((tide, idx) => (
                  <div key={idx} className="border border-white p-3 text-center">
                    <div className={`text-lg font-bold ${tide.type === "H" ? "text-blue" : "text-white"}`}>
                      {tide.type === "H" ? "HIGH" : "LOW"}
                    </div>
                    <div className="text-white text-sm">
                      {tide.height.toFixed(1)} m
                    </div>
                    <div className="text-white-dim text-[10px]">
                      {new Date(tide.timestamp).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sea Temperature Chart */}
          <div className="border border-white bg-code p-4 mb-6">
            <div className="text-white-dim uppercase text-xs tracking-widest mb-4 font-mono">
              <span className="text-blue">&gt;&gt;</span> SEA_TEMPERATURE_24H (°C)
            </div>
            <ResponsiveContainer width="100%" height={150}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff33" />
                <XAxis
                  dataKey="time"
                  stroke="#ffffff"
                  style={{ fontSize: "10px", fontFamily: "monospace" }}
                  interval="preserveStartEnd"
                />
                <YAxis
                  stroke="#ffffff"
                  style={{ fontSize: "10px", fontFamily: "monospace" }}
                  domain={["dataMin - 1", "dataMax + 1"]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#D2691E",
                    border: "1px solid #ffffff",
                    fontFamily: "monospace",
                    fontSize: "11px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="Sea Temp"
                  stroke="#00A7E1"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Wave Height Chart */}
          <div className="border border-white bg-code p-4 mb-6">
            <div className="text-white-dim uppercase text-xs tracking-widest mb-4 font-mono">
              <span className="text-blue">&gt;&gt;</span> WAVE_HEIGHT_24H (m)
            </div>
            <ResponsiveContainer width="100%" height={150}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff33" />
                <XAxis
                  dataKey="time"
                  stroke="#ffffff"
                  style={{ fontSize: "10px", fontFamily: "monospace" }}
                  interval="preserveStartEnd"
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
                  dataKey="Wave Height"
                  stroke="#FF8C42"
                  fill="#FF8C4277"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Info panel */}
          <div className="border border-blue bg-code p-4">
            <div className="text-xs text-white-dim font-mono space-y-1">
              <div>
                <span className="text-blue">&gt;</span> DATASET: NOAA National Data Buoy Center (NDBC)
              </div>
              <div>
                <span className="text-blue">&gt;</span> COVERAGE: Ocean buoys, coastal stations, ships
              </div>
              <div>
                <span className="text-blue">&gt;</span> METRICS: Sea temp, wave height, wind, pressure, tides
              </div>
              <div>
                <span className="text-blue">&gt;</span> UPDATE_FREQUENCY: Hourly observations
              </div>
            </div>
          </div>

          {/* Status bar */}
          <div className="mt-6 pt-4 border-t border-white flex justify-between text-[10px] text-white-dim uppercase tracking-widest">
            <div>
              DATA_SOURCE: <span className="text-blue">NOAA_NDBC</span>
            </div>
            <div>
              LAST_UPDATE:{" "}
              <span className="text-blue">
                {new Date(oceanData.lastUpdated).toLocaleTimeString()}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
