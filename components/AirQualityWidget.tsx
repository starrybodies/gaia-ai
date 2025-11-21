"use client";

import { useEffect, useState } from "react";
import type { SimpleAirQuality } from "@/types/airquality";

export default function AirQualityWidget() {
  const [airQuality, setAirQuality] = useState<SimpleAirQuality | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [city, setCity] = useState("San Francisco");

  const fetchAirQuality = async (cityName: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/airquality?city=${encodeURIComponent(cityName)}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch air quality data");
      }

      const data = await response.json();
      setAirQuality(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAirQuality(city);
  }, []);

  const handleCityChange = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newCity = formData.get("city") as string;
    if (newCity.trim()) {
      setCity(newCity);
      fetchAirQuality(newCity);
    }
  };

  // Get AQI color
  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return "blue";
    if (aqi <= 100) return "white";
    return "orange";
  };

  return (
    <div className="terminal-window p-6">
      <div className="window-header mb-6">
        <span className="text-blue">[AIR_QUALITY_MODULE]</span>
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
            <div className="font-bold uppercase">OPENAQ_CONNECTED</div>
            <div className="text-[10px] text-white-dim">
              REAL-TIME AIR QUALITY DATA • 10,000+ STATIONS
            </div>
          </div>
        </div>
      </div>

      {/* City input */}
      <form onSubmit={handleCityChange} className="mb-6">
        <div className="flex gap-2">
          <div className="flex-1 border border-white bg-code p-2 flex items-center">
            <span className="text-blue mr-2">&gt;</span>
            <input
              type="text"
              name="city"
              defaultValue={city}
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
          <span className="text-blue">&gt;</span> FETCHING_DATA
          <span className="cursor"></span>
        </div>
      )}

      {error && (
        <div className="border border-white bg-code p-4 text-white font-mono text-sm">
          <span>&gt;&gt; ERROR:</span> {error}
        </div>
      )}

      {airQuality && !loading && !error && (
        <>
          {/* AQI Display */}
          <div className="border border-white bg-code p-6 mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-2xl font-bold text-white uppercase tracking-wider mb-1">
                  {airQuality.city}, {airQuality.country}
                </h3>
                <div className="text-xs text-white-dim uppercase tracking-widest">
                  AIR_QUALITY_INDEX
                </div>
              </div>
              <div className="text-right">
                <div
                  className={`text-4xl font-bold text-${getAQIColor(airQuality.aqi)} font-mono`}
                >
                  {airQuality.aqi}
                </div>
                <div className="text-xs text-white-dim">{airQuality.aqiLevel.toUpperCase()}</div>
              </div>
            </div>

            {/* Pollutant Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-mono">
              {airQuality.measurements.pm25 !== undefined && (
                <div className="border border-white p-3">
                  <div className="text-white-dim uppercase mb-1">PM2.5</div>
                  <div className="text-white text-lg">
                    {airQuality.measurements.pm25.toFixed(1)}
                  </div>
                  <div className="text-white-dim text-[10px]">µg/m³</div>
                </div>
              )}
              {airQuality.measurements.pm10 !== undefined && (
                <div className="border border-white p-3">
                  <div className="text-white-dim uppercase mb-1">PM10</div>
                  <div className="text-white text-lg">
                    {airQuality.measurements.pm10.toFixed(1)}
                  </div>
                  <div className="text-white-dim text-[10px]">µg/m³</div>
                </div>
              )}
              {airQuality.measurements.o3 !== undefined && (
                <div className="border border-white p-3">
                  <div className="text-white-dim uppercase mb-1">O₃</div>
                  <div className="text-white text-lg">
                    {airQuality.measurements.o3.toFixed(1)}
                  </div>
                  <div className="text-white-dim text-[10px]">µg/m³</div>
                </div>
              )}
              {airQuality.measurements.no2 !== undefined && (
                <div className="border border-white p-3">
                  <div className="text-white-dim uppercase mb-1">NO₂</div>
                  <div className="text-white text-lg">
                    {airQuality.measurements.no2.toFixed(1)}
                  </div>
                  <div className="text-white-dim text-[10px]">µg/m³</div>
                </div>
              )}
              {airQuality.measurements.so2 !== undefined && (
                <div className="border border-white p-3">
                  <div className="text-white-dim uppercase mb-1">SO₂</div>
                  <div className="text-white text-lg">
                    {airQuality.measurements.so2.toFixed(1)}
                  </div>
                  <div className="text-white-dim text-[10px]">µg/m³</div>
                </div>
              )}
              {airQuality.measurements.co !== undefined && (
                <div className="border border-white p-3">
                  <div className="text-white-dim uppercase mb-1">CO</div>
                  <div className="text-white text-lg">
                    {airQuality.measurements.co.toFixed(2)}
                  </div>
                  <div className="text-white-dim text-[10px]">mg/m³</div>
                </div>
              )}
            </div>
          </div>

          {/* Info panel */}
          <div className="border border-blue bg-code p-4">
            <div className="text-xs text-white-dim font-mono space-y-1">
              <div>
                <span className="text-blue">&gt;</span> WHAT_IS_AQI: Air Quality Index measures pollution levels (0-500 scale)
              </div>
              <div>
                <span className="text-blue">&gt;</span> GOOD (0-50): Air quality satisfactory, minimal health risk
              </div>
              <div>
                <span className="text-blue">&gt;</span> MODERATE (51-100): Acceptable for most, sensitive groups may experience effects
              </div>
              <div>
                <span className="text-blue">&gt;</span> UNHEALTHY (101+): Health effects for sensitive groups, public advised
              </div>
            </div>
          </div>

          {/* Status bar */}
          <div className="mt-6 pt-4 border-t border-white flex justify-between text-[10px] text-white-dim uppercase tracking-widest">
            <div>
              DATA_SOURCE: <span className="text-blue">OPENAQ_API</span>
            </div>
            <div>
              LAST_UPDATE:{" "}
              <span className="text-blue">
                {new Date(airQuality.lastUpdated).toLocaleTimeString()}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
