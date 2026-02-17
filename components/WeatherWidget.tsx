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
import type { SimpleWeather, SimpleForecast, WeatherChartData } from "@/types/weather";
import {
  transformWeatherData,
  transformForecastData,
  transformForecastToChartData,
} from "@/lib/weather";

interface WeatherWidgetProps {
  defaultLocation?: string;
  defaultLat?: number;
  defaultLon?: number;
}

export default function WeatherWidget({
  defaultLocation = "Salt Spring Island, BC",
  defaultLat = 48.8167,
  defaultLon = -123.5,
}: WeatherWidgetProps) {
  const [weather, setWeather] = useState<SimpleWeather | null>(null);
  const [forecast, setForecast] = useState<SimpleForecast[]>([]);
  const [chartData, setChartData] = useState<WeatherChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [city, setCity] = useState(defaultLocation);
  const [coords, setCoords] = useState({ lat: defaultLat, lon: defaultLon });

  const fetchWeather = async (cityName: string, lat?: number, lon?: number) => {
    setLoading(true);
    setError(null);

    try {
      // Build URL with coordinates if available
      let url = `/api/weather?city=${encodeURIComponent(cityName)}`;
      if (lat !== undefined && lon !== undefined) {
        url += `&lat=${lat}&lon=${lon}`;
      }

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Failed to fetch weather data");
      }

      const data = await response.json();

      setWeather(transformWeatherData(data.current));
      setForecast(transformForecastData(data.forecast));
      setChartData(transformForecastToChartData(data.forecast));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(city, coords.lat, coords.lon);
  }, []);

  const handleCityChange = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newCity = formData.get("city") as string;
    if (newCity.trim()) {
      setCity(newCity);
      // Clear coords when manually entering a city name - let API geocode it
      setCoords({ lat: undefined as any, lon: undefined as any });
      fetchWeather(newCity);
    }
  };

  return (
    <div className="terminal-window p-6">
      <div className="window-header mb-6">
        <span className="text-blue">[WEATHER_MODULE]</span>
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
            <div className="font-bold uppercase">OPEN_METEO_CONNECTED</div>
            <div className="text-[10px] text-white-dim">
              REAL-TIME WEATHER • 7-DAY FORECAST • GLOBAL COVERAGE
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
          <span className="text-blue">&gt;</span> FETCHING_DATA<span className="cursor"></span>
        </div>
      )}

      {error && (
        <div className="border border-white bg-code p-4 text-white font-mono text-sm">
          <span>&gt;&gt; ERROR:</span> {error}
        </div>
      )}

      {weather && !loading && !error && (
        <>
          {/* Current weather */}
          <div className="border border-white bg-code p-6 mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-2xl font-bold text-white uppercase tracking-wider mb-1">
                  {weather.location}, {weather.country}
                </h3>
                <div className="text-xs text-white-dim uppercase tracking-widest">
                  CURRENT_CONDITIONS
                </div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-blue font-mono">
                  {weather.temp}°C
                </div>
                <div className="text-xs text-white-dim">
                  FEELS {weather.feelsLike}°C
                </div>
              </div>
            </div>

            <div className="text-sm text-white-dim mb-4 uppercase tracking-wider">
              {weather.description}
            </div>

            <div className="grid grid-cols-3 gap-4 text-xs font-mono">
              <div className="border border-white p-3">
                <div className="text-white-dim uppercase mb-1">HUMIDITY</div>
                <div className="text-white text-lg">{weather.humidity}%</div>
              </div>
              <div className="border border-white p-3">
                <div className="text-white-dim uppercase mb-1">WIND</div>
                <div className="text-white text-lg">{weather.windSpeed}km/h</div>
              </div>
              <div className="border border-white p-3">
                <div className="text-white-dim uppercase mb-1">PRESSURE</div>
                <div className="text-white text-lg">{weather.pressure}hPa</div>
              </div>
            </div>
          </div>

          {/* Chart */}
          {chartData.length > 0 && (
            <div className="border border-blue bg-code p-6 mb-6">
              <div className="text-xs text-blue uppercase tracking-widest mb-4">
                [24_HOUR_FORECAST]
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chartData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255, 255, 255, 0.1)"
                  />
                  <XAxis
                    dataKey="time"
                    stroke="#E8E8E8"
                    style={{
                      fontSize: "10px",
                      fontFamily: "monospace",
                      fill: "#E8E8E8",
                    }}
                  />
                  <YAxis
                    stroke="#E8E8E8"
                    style={{
                      fontSize: "10px",
                      fontFamily: "monospace",
                      fill: "#E8E8E8",
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#A0451A",
                      border: "1px solid #FFFFFF",
                      borderRadius: "0",
                      fontFamily: "monospace",
                      fontSize: "11px",
                    }}
                    labelStyle={{ color: "#FFFFFF" }}
                    itemStyle={{ color: "#00A7E1" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="temp"
                    stroke="#00A7E1"
                    strokeWidth={2}
                    dot={{ fill: "#00A7E1", r: 3 }}
                    name="TEMP (°C)"
                  />
                  <Line
                    type="monotone"
                    dataKey="humidity"
                    stroke="#FFFFFF"
                    strokeWidth={2}
                    dot={{ fill: "#FFFFFF", r: 3 }}
                    name="HUMIDITY (%)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* 5-day forecast */}
          {forecast.length > 0 && (
            <div className="border border-white bg-code p-6">
              <div className="text-xs text-white uppercase tracking-widest mb-4">
                [5_DAY_FORECAST]
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {forecast.map((day, i) => (
                  <div
                    key={i}
                    className="border border-white p-3 hover:border-blue transition-all"
                  >
                    <div className="text-[10px] text-white-dim uppercase mb-2 tracking-wider">
                      {day.datetime}
                    </div>
                    <div className="text-lg font-bold text-blue mb-1">
                      {day.temp}°C
                    </div>
                    <div className="text-[10px] text-white-dim uppercase">
                      {day.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Status bar */}
          <div className="mt-6 pt-4 border-t border-white flex justify-between text-[10px] text-white-dim uppercase tracking-widest">
            <div>
              SOURCE: <span className="text-blue">OPEN_METEO</span>
            </div>
            <div>
              LAST_UPDATE:{" "}
              <span className="text-blue">
                {new Date(weather.timestamp * 1000).toLocaleTimeString()}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
