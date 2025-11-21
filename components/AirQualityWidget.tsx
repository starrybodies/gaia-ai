"use client";

import { useEffect, useState } from "react";
import type { SimpleAirQuality } from "@/types/airquality";
import { Gauge, HorizontalBars } from "./visualizations";

// WHO guidelines for pollutant limits (µg/m³)
const WHO_LIMITS = {
  pm25: 15,  // Annual mean
  pm10: 45,  // Annual mean
  o3: 100,   // 8-hour mean
  no2: 25,   // Annual mean
  so2: 40,   // 24-hour mean
  co: 4,     // mg/m³ 24-hour mean
};

export default function AirQualityWidget() {
  const [airQuality, setAirQuality] = useState<SimpleAirQuality | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [city, setCity] = useState("Salt Spring Island, BC");

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

  // AQI thresholds for gauge
  const aqiThresholds = [
    { value: 20, color: "#00A7E1" },  // Good - blue
    { value: 40, color: "#98D8C8" },  // Fair - mint
    { value: 60, color: "#E8E8E8" },  // Moderate - white
    { value: 80, color: "#FFB347" },  // Poor - light orange
    { value: 100, color: "#FF8C42" }, // Very Poor - orange
  ];

  // Prepare pollutant bar data
  const getPollutantBars = () => {
    if (!airQuality) return [];
    const bars = [];

    if (airQuality.measurements.pm25 !== undefined) {
      bars.push({
        label: "PM2.5",
        value: airQuality.measurements.pm25,
        max: WHO_LIMITS.pm25 * 3,
        color: airQuality.measurements.pm25 > WHO_LIMITS.pm25 ? "#FF8C42" : "#00A7E1",
      });
    }
    if (airQuality.measurements.pm10 !== undefined) {
      bars.push({
        label: "PM10",
        value: airQuality.measurements.pm10,
        max: WHO_LIMITS.pm10 * 3,
        color: airQuality.measurements.pm10 > WHO_LIMITS.pm10 ? "#FF8C42" : "#00A7E1",
      });
    }
    if (airQuality.measurements.o3 !== undefined) {
      bars.push({
        label: "O₃",
        value: airQuality.measurements.o3,
        max: WHO_LIMITS.o3 * 2,
        color: airQuality.measurements.o3 > WHO_LIMITS.o3 ? "#FF8C42" : "#00A7E1",
      });
    }
    if (airQuality.measurements.no2 !== undefined) {
      bars.push({
        label: "NO₂",
        value: airQuality.measurements.no2,
        max: WHO_LIMITS.no2 * 3,
        color: airQuality.measurements.no2 > WHO_LIMITS.no2 ? "#FF8C42" : "#00A7E1",
      });
    }
    if (airQuality.measurements.so2 !== undefined) {
      bars.push({
        label: "SO₂",
        value: airQuality.measurements.so2,
        max: WHO_LIMITS.so2 * 2,
        color: airQuality.measurements.so2 > WHO_LIMITS.so2 ? "#FF8C42" : "#00A7E1",
      });
    }

    return bars;
  };

  return (
    <div className="terminal-window p-6 h-full">
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
          {/* AQI Display with Gauge */}
          <div className="border border-white bg-code p-6 mb-6">
            <div className="flex items-start gap-6">
              {/* Gauge */}
              <div className="flex-shrink-0">
                <Gauge
                  value={airQuality.aqi}
                  min={0}
                  max={200}
                  label={airQuality.aqiLevel.toUpperCase()}
                  thresholds={aqiThresholds}
                  size="md"
                />
              </div>

              {/* Location info */}
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white uppercase tracking-wider mb-1">
                  {airQuality.city}
                </h3>
                <div className="text-xs text-white-dim uppercase tracking-widest mb-3">
                  {airQuality.country}
                </div>
                <div className="text-xs text-white-dim font-mono">
                  <div className="mb-1">
                    <span className="text-blue">&gt;</span> AQI_SCALE: 0-50 GOOD, 51-100 MODERATE
                  </div>
                  <div>
                    <span className="text-blue">&gt;</span> 101-150 UNHEALTHY_SENSITIVE, 151+ UNHEALTHY
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pollutant Levels with Bars */}
          <div className="border border-white bg-code p-4 mb-6">
            <div className="text-white-dim uppercase text-xs tracking-widest mb-4 font-mono">
              <span className="text-blue">&gt;&gt;</span> POLLUTANT_LEVELS (µg/m³)
            </div>
            <HorizontalBars
              data={getPollutantBars()}
              showValues={true}
              unit=" µg/m³"
            />
            <div className="mt-3 text-[10px] text-white-dim font-mono">
              <span className="text-blue">BLUE</span> = WITHIN WHO LIMITS • <span className="text-orange">ORANGE</span> = EXCEEDS WHO LIMITS
            </div>
          </div>

          {/* Info panel */}
          <div className="border border-blue bg-code p-4">
            <div className="text-xs text-white-dim font-mono space-y-1">
              <div>
                <span className="text-blue">&gt;</span> WHO_LIMITS: PM2.5 {WHO_LIMITS.pm25}µg/m³ • PM10 {WHO_LIMITS.pm10}µg/m³
              </div>
              <div>
                <span className="text-blue">&gt;</span> O₃ {WHO_LIMITS.o3}µg/m³ • NO₂ {WHO_LIMITS.no2}µg/m³ • SO₂ {WHO_LIMITS.so2}µg/m³
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
