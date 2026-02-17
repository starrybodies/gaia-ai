"use client";

import { useEffect, useState } from "react";
import type { AirQualityData } from "@/types/airquality";
import { Gauge, HorizontalBars } from "./visualizations";

interface AirQualityWidgetProps {
  defaultLocation?: string;
  defaultLat?: number;
  defaultLon?: number;
}

export default function AirQualityWidget({
  defaultLocation = "Salt Spring Island",
  defaultLat = 48.8167,
  defaultLon = -123.5,
}: AirQualityWidgetProps) {
  const [airQuality, setAirQuality] = useState<AirQualityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [city, setCity] = useState(defaultLocation);
  const [coords, setCoords] = useState({ lat: defaultLat, lon: defaultLon });

  const fetchAirQuality = async (cityName: string, lat?: number, lon?: number) => {
    setLoading(true);
    setError(null);

    try {
      let url = `/api/airquality?city=${encodeURIComponent(cityName)}`;
      if (lat !== undefined && lon !== undefined) {
        url += `&lat=${lat}&lon=${lon}`;
      }
      const response = await fetch(url);

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
    fetchAirQuality(city, coords.lat, coords.lon);
  }, []);

  const handleCityChange = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newCity = formData.get("city") as string;
    if (newCity.trim()) {
      setCity(newCity);
      // Clear coords when manually entering a city - let API geocode it
      setCoords({ lat: undefined as any, lon: undefined as any });
      fetchAirQuality(newCity);
    }
  };

  // AQI thresholds for gauge
  const aqiThresholds = [
    { value: 50, color: "#00A7E1" },  // Good - blue
    { value: 100, color: "#98D8C8" }, // Moderate - mint
    { value: 150, color: "#FFB347" }, // Unhealthy Sensitive - light orange
    { value: 200, color: "#FF8C42" }, // Unhealthy - orange
    { value: 300, color: "#D2691E" }, // Very Unhealthy - burnt orange
  ];

  // Prepare pollutant bar data
  const getPollutantBars = () => {
    if (!airQuality) return [];
    const bars = [];
    const p = airQuality.pollutants;

    if (p.pm25.value > 0) {
      bars.push({
        label: "PM2.5",
        value: p.pm25.value,
        max: p.pm25.whoLimit * 3,
        color: p.pm25.value > p.pm25.whoLimit ? "#FF8C42" : "#00A7E1",
      });
    }
    if (p.pm10.value > 0) {
      bars.push({
        label: "PM10",
        value: p.pm10.value,
        max: p.pm10.whoLimit * 3,
        color: p.pm10.value > p.pm10.whoLimit ? "#FF8C42" : "#00A7E1",
      });
    }
    if (p.o3.value > 0) {
      bars.push({
        label: "O3",
        value: p.o3.value,
        max: p.o3.whoLimit * 2,
        color: p.o3.value > p.o3.whoLimit ? "#FF8C42" : "#00A7E1",
      });
    }
    if (p.no2.value > 0) {
      bars.push({
        label: "NO2",
        value: p.no2.value,
        max: p.no2.whoLimit * 3,
        color: p.no2.value > p.no2.whoLimit ? "#FF8C42" : "#00A7E1",
      });
    }
    if (p.so2.value > 0) {
      bars.push({
        label: "SO2",
        value: p.so2.value,
        max: p.so2.whoLimit * 2,
        color: p.so2.value > p.so2.whoLimit ? "#FF8C42" : "#00A7E1",
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

      {/* API status banner */}
      <div className="mb-4 border border-blue bg-code p-3">
        <div className="flex items-center gap-2 text-blue text-xs font-mono">
          <span className="status-indicator status-active"></span>
          <div>
            <div className="font-bold uppercase">WAQI_CONNECTED</div>
            <div className="text-[10px] text-white-dim">
              WORLD AIR QUALITY INDEX • 12,000+ STATIONS
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
                  value={airQuality.current.aqi}
                  min={0}
                  max={300}
                  label={airQuality.current.level.toUpperCase()}
                  thresholds={aqiThresholds}
                  size="md"
                />
              </div>

              {/* Location info */}
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white uppercase tracking-wider mb-1">
                  {airQuality.location.name}
                </h3>
                <div className="text-xs text-white-dim uppercase tracking-widest mb-3">
                  {airQuality.current.description}
                </div>
                <div className="text-xs text-white-dim font-mono">
                  <div className="mb-1">
                    <span className="text-blue">&gt;</span> DOMINANT: {airQuality.current.dominantPollutant.toUpperCase()}
                  </div>
                  <div>
                    <span className="text-blue">&gt;</span> AQI: 0-50 GOOD, 51-100 MODERATE, 101+ UNHEALTHY
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

          {/* Weather data if available */}
          {airQuality.weather && (airQuality.weather.temperature !== undefined || airQuality.weather.humidity !== undefined) && (
            <div className="grid grid-cols-4 gap-3 text-xs font-mono mb-6">
              {airQuality.weather.temperature !== undefined && (
                <div className="border border-white p-3">
                  <div className="text-white-dim uppercase mb-1 text-[10px]">TEMP</div>
                  <div className="text-white text-lg">{airQuality.weather.temperature}°</div>
                </div>
              )}
              {airQuality.weather.humidity !== undefined && (
                <div className="border border-white p-3">
                  <div className="text-white-dim uppercase mb-1 text-[10px]">HUMIDITY</div>
                  <div className="text-white text-lg">{airQuality.weather.humidity}%</div>
                </div>
              )}
              {airQuality.weather.pressure !== undefined && (
                <div className="border border-white p-3">
                  <div className="text-white-dim uppercase mb-1 text-[10px]">PRESSURE</div>
                  <div className="text-white text-lg">{airQuality.weather.pressure}</div>
                </div>
              )}
              {airQuality.weather.wind !== undefined && (
                <div className="border border-white p-3">
                  <div className="text-white-dim uppercase mb-1 text-[10px]">WIND</div>
                  <div className="text-white text-lg">{airQuality.weather.wind}</div>
                </div>
              )}
            </div>
          )}

          {/* Info panel */}
          <div className="border border-blue bg-code p-4">
            <div className="text-xs text-white-dim font-mono space-y-1">
              <div>
                <span className="text-blue">&gt;</span> WHO_LIMITS: PM2.5 {airQuality.pollutants.pm25.whoLimit}µg/m³ • PM10 {airQuality.pollutants.pm10.whoLimit}µg/m³
              </div>
              <div>
                <span className="text-blue">&gt;</span> O3 {airQuality.pollutants.o3.whoLimit}µg/m³ • NO2 {airQuality.pollutants.no2.whoLimit}µg/m³ • SO2 {airQuality.pollutants.so2.whoLimit}µg/m³
              </div>
            </div>
          </div>

          {/* Status bar */}
          <div className="mt-6 pt-4 border-t border-white flex justify-between text-[10px] text-white-dim uppercase tracking-widest">
            <div>
              SOURCE: <span className="text-blue">{airQuality.attribution.toUpperCase()}</span>
            </div>
            <div>
              UPDATED:{" "}
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
