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
    <div className="terminal-window p-6">
      <div className="window-header mb-6">
        <span className="text-neon-cyan">[WEATHER_MODULE]</span>
        <div className="window-controls">
          <div className="window-control"></div>
          <div className="window-control"></div>
          <div className="window-control"></div>
        </div>
      </div>

      {/* City input */}
      <form onSubmit={handleCityChange} className="mb-6">
        <div className="flex gap-2">
          <div className="flex-1 border border-matrix-green/40 bg-terminal-dark p-2 flex items-center">
            <span className="text-matrix-green mr-2">&gt;</span>
            <input
              type="text"
              name="city"
              defaultValue={city}
              placeholder="ENTER_LOCATION"
              className="bg-transparent border-none outline-none text-matrix-green font-mono text-sm flex-1 uppercase tracking-wider placeholder:text-terminal-gray"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 border-2 border-matrix-green text-matrix-green hover:bg-matrix-green hover:text-black transition-all font-mono text-xs uppercase tracking-wider"
          >
            QUERY
          </button>
        </div>
      </form>

      {loading && (
        <div className="text-terminal-gray font-mono text-sm">
          <span className="text-matrix-green">&gt;</span> FETCHING_DATA
          <span className="cursor"></span>
        </div>
      )}

      {error && (
        <div className="border border-neon-red bg-terminal-dark p-4 text-neon-red font-mono text-sm">
          <span>&gt;&gt; ERROR:</span> {error}
        </div>
      )}

      {weather && !loading && !error && (
        <>
          {/* Current weather */}
          <div className="border border-matrix-green/40 bg-terminal-dark p-6 mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-2xl font-bold text-matrix-green uppercase tracking-wider mb-1">
                  {weather.location}, {weather.country}
                </h3>
                <div className="text-xs text-terminal-gray uppercase tracking-widest">
                  CURRENT_CONDITIONS
                </div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-neon-cyan font-mono">
                  {weather.temp}°C
                </div>
                <div className="text-xs text-terminal-gray">
                  FEELS {weather.feelsLike}°C
                </div>
              </div>
            </div>

            <div className="text-sm text-terminal-gray mb-4 uppercase tracking-wider">
              {weather.description}
            </div>

            <div className="grid grid-cols-3 gap-4 text-xs font-mono">
              <div className="border border-matrix-green/30 p-3">
                <div className="text-terminal-gray uppercase mb-1">HUMIDITY</div>
                <div className="text-matrix-green text-lg">{weather.humidity}%</div>
              </div>
              <div className="border border-matrix-green/30 p-3">
                <div className="text-terminal-gray uppercase mb-1">WIND</div>
                <div className="text-matrix-green text-lg">{weather.windSpeed}km/h</div>
              </div>
              <div className="border border-matrix-green/30 p-3">
                <div className="text-terminal-gray uppercase mb-1">PRESSURE</div>
                <div className="text-matrix-green text-lg">{weather.pressure}hPa</div>
              </div>
            </div>
          </div>

          {/* Chart */}
          {chartData.length > 0 && (
            <div className="border border-neon-cyan/40 bg-terminal-dark p-6 mb-6">
              <div className="text-xs text-neon-cyan uppercase tracking-widest mb-4">
                [24_HOUR_FORECAST]
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chartData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(0, 255, 65, 0.1)"
                  />
                  <XAxis
                    dataKey="time"
                    stroke="#808080"
                    style={{
                      fontSize: "10px",
                      fontFamily: "monospace",
                      fill: "#808080",
                    }}
                  />
                  <YAxis
                    stroke="#808080"
                    style={{
                      fontSize: "10px",
                      fontFamily: "monospace",
                      fill: "#808080",
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0a0a0a",
                      border: "1px solid #00ff41",
                      borderRadius: "0",
                      fontFamily: "monospace",
                      fontSize: "11px",
                    }}
                    labelStyle={{ color: "#00ff41" }}
                    itemStyle={{ color: "#00ffff" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="temp"
                    stroke="#00ffff"
                    strokeWidth={2}
                    dot={{ fill: "#00ffff", r: 3 }}
                    name="TEMP (°C)"
                  />
                  <Line
                    type="monotone"
                    dataKey="humidity"
                    stroke="#00ff41"
                    strokeWidth={2}
                    dot={{ fill: "#00ff41", r: 3 }}
                    name="HUMIDITY (%)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* 5-day forecast */}
          {forecast.length > 0 && (
            <div className="border border-neon-blue/40 bg-terminal-dark p-6">
              <div className="text-xs text-neon-blue uppercase tracking-widest mb-4">
                [5_DAY_FORECAST]
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {forecast.map((day, i) => (
                  <div
                    key={i}
                    className="border border-matrix-green/30 p-3 hover:border-matrix-green transition-all"
                  >
                    <div className="text-[10px] text-terminal-gray uppercase mb-2 tracking-wider">
                      {day.datetime}
                    </div>
                    <div className="text-lg font-bold text-neon-cyan mb-1">
                      {day.temp}°C
                    </div>
                    <div className="text-[10px] text-terminal-gray uppercase">
                      {day.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Status bar */}
          <div className="mt-6 pt-4 border-t border-matrix-green/20 flex justify-between text-[10px] text-terminal-gray uppercase tracking-widest">
            <div>
              DATA_SOURCE: <span className="text-matrix-green">OPENWEATHERMAP</span>
            </div>
            <div>
              LAST_UPDATE:{" "}
              <span className="text-matrix-green">
                {new Date(weather.timestamp * 1000).toLocaleTimeString()}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
