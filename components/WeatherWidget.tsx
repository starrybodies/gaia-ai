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

export default function WeatherWidget() {
  const [weather, setWeather] = useState<SimpleWeather | null>(null);
  const [forecast, setForecast] = useState<SimpleForecast[]>([]);
  const [chartData, setChartData] = useState<WeatherChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [city, setCity] = useState("San Francisco");

  const fetchWeather = async (cityName: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/weather?city=${encodeURIComponent(cityName)}`
      );

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
    fetchWeather(city);
  }, []);

  const handleCityChange = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newCity = formData.get("city") as string;
    if (newCity.trim()) {
      setCity(newCity);
      fetchWeather(newCity);
    }
  };

  return (
    <div className="data-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="heading-tertiary mb-1">Weather & Climate</h3>
          <p className="text-xs text-stone">Real-time atmospheric conditions</p>
        </div>
        <span className="badge badge-primary text-[10px]">Live Data</span>
      </div>

      {/* Demo mode banner */}
      <div className="mb-4 bg-warning/10 border border-warning rounded-lg p-3">
        <div className="flex items-center gap-2 text-warning text-xs">
          <span className="animate-pulse">⚠</span>
          <div>
            <div className="font-semibold">Demo Mode Active</div>
            <div className="text-[10px] text-stone">
              API key pending activation • Showing mock data
            </div>
          </div>
        </div>
      </div>

      {/* City input */}
      <form onSubmit={handleCityChange} className="mb-6">
        <div className="flex gap-2">
          <div className="flex-1 border border-border-strong bg-cream rounded-lg p-3 flex items-center hover:border-sky-blue transition-all">
            <input
              type="text"
              name="city"
              defaultValue={city}
              placeholder="Enter location..."
              className="bg-transparent border-none outline-none text-charcoal text-sm flex-1 placeholder:text-stone"
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary px-6"
          >
            Search
          </button>
        </div>
      </form>

      {loading && (
        <div className="text-center py-8">
          <div className="skeleton h-4 w-32 mx-auto"></div>
        </div>
      )}

      {error && (
        <div className="bg-error/10 border border-error rounded-lg p-4 text-error text-sm">
          <span className="font-semibold">Error:</span> {error}
        </div>
      )}

      {weather && !loading && !error && (
        <>
          {/* Current weather */}
          <div className="data-module mb-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h4 className="text-2xl font-bold text-charcoal mb-1">
                  {weather.location}, {weather.country}
                </h4>
                <div className="text-xs text-stone font-medium">
                  Current Conditions
                </div>
              </div>
              <div className="text-right">
                <div className="metric-value text-5xl text-rust-orange">
                  {weather.temp}°
                </div>
                <div className="text-xs text-stone">
                  Feels like {weather.feelsLike}°C
                </div>
              </div>
            </div>

            <div className="text-sm text-stone mb-6 capitalize">
              {weather.description}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-cream rounded-lg p-4">
                <div className="metric-label mb-1">Humidity</div>
                <div className="metric-value text-2xl text-sky-blue">{weather.humidity}%</div>
              </div>
              <div className="bg-cream rounded-lg p-4">
                <div className="metric-label mb-1">Wind Speed</div>
                <div className="metric-value text-2xl text-sky-blue">{weather.windSpeed}</div>
                <div className="metric-unit text-xs">km/h</div>
              </div>
              <div className="bg-cream rounded-lg p-4">
                <div className="metric-label mb-1">Pressure</div>
                <div className="metric-value text-2xl text-sky-blue">{weather.pressure}</div>
                <div className="metric-unit text-xs">hPa</div>
              </div>
            </div>
          </div>

          {/* Chart */}
          {chartData.length > 0 && (
            <div className="chart-container mb-6">
              <div className="text-xs font-semibold text-stone uppercase tracking-wide mb-4">
                24-Hour Forecast
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chartData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#D4C5A9"
                  />
                  <XAxis
                    dataKey="time"
                    stroke="#8B7E74"
                    style={{
                      fontSize: "11px",
                      fontFamily: "var(--font-geist-sans)",
                      fill: "#8B7E74",
                    }}
                  />
                  <YAxis
                    stroke="#8B7E74"
                    style={{
                      fontSize: "11px",
                      fontFamily: "var(--font-geist-sans)",
                      fill: "#8B7E74",
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#FFFFFF",
                      border: "1px solid #D4C5A9",
                      borderRadius: "8px",
                      fontFamily: "var(--font-geist-sans)",
                      fontSize: "12px",
                      boxShadow: "0 2px 8px rgba(44, 36, 22, 0.1)",
                    }}
                    labelStyle={{ color: "#3D3429", fontWeight: 600 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="temp"
                    stroke="#CD5C5C"
                    strokeWidth={2}
                    dot={{ fill: "#CD5C5C", r: 4 }}
                    name="Temperature (°C)"
                  />
                  <Line
                    type="monotone"
                    dataKey="humidity"
                    stroke="#5B9BD5"
                    strokeWidth={2}
                    dot={{ fill: "#5B9BD5", r: 4 }}
                    name="Humidity (%)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* 5-day forecast */}
          {forecast.length > 0 && (
            <div className="mb-6">
              <div className="text-xs font-semibold text-stone uppercase tracking-wide mb-4">
                5-Day Forecast
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {forecast.map((day, i) => (
                  <div
                    key={i}
                    className="data-card p-4 text-center hover:border-sky-blue transition-all"
                  >
                    <div className="text-xs text-stone mb-2 font-medium">
                      {day.datetime}
                    </div>
                    <div className="metric-value text-2xl text-rust-orange mb-1">
                      {day.temp}°
                    </div>
                    <div className="text-xs text-stone capitalize">
                      {day.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="pt-4 border-t border-border flex justify-between text-xs text-stone">
            <div>
              Data source: <span className="text-charcoal font-semibold">OpenWeatherMap</span>
            </div>
            <div>
              Updated:{" "}
              <span className="text-charcoal font-semibold font-mono">
                {new Date(weather.timestamp * 1000).toLocaleTimeString()}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
