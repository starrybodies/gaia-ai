import type {
  WeatherData,
  ForecastData,
  SimpleWeather,
  SimpleForecast,
  WeatherChartData,
} from "@/types/weather";

/**
 * Transform OpenWeatherMap current weather data to simplified format
 */
export function transformWeatherData(data: WeatherData): SimpleWeather {
  return {
    location: data.name,
    country: data.sys.country,
    temp: Math.round(data.main.temp),
    feelsLike: Math.round(data.main.feels_like),
    description:
      data.weather[0].description.charAt(0).toUpperCase() +
      data.weather[0].description.slice(1),
    humidity: data.main.humidity,
    windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
    pressure: data.main.pressure,
    icon: data.weather[0].icon,
    timestamp: data.dt,
  };
}

/**
 * Transform OpenWeatherMap forecast data to simplified format
 */
export function transformForecastData(
  data: ForecastData
): SimpleForecast[] {
  // Take one forecast per day (noon readings)
  const dailyForecasts = data.list.filter((item) =>
    item.dt_txt.includes("12:00:00")
  );

  return dailyForecasts.slice(0, 5).map((item) => ({
    datetime: new Date(item.dt * 1000).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    }),
    temp: Math.round(item.main.temp),
    description:
      item.weather[0].description.charAt(0).toUpperCase() +
      item.weather[0].description.slice(1),
    humidity: item.main.humidity,
    windSpeed: Math.round(item.wind.speed * 3.6),
    icon: item.weather[0].icon,
  }));
}

/**
 * Transform forecast data for chart visualization
 */
export function transformForecastToChartData(
  data: ForecastData
): WeatherChartData[] {
  // Take first 8 data points (24 hours, 3-hour intervals)
  return data.list.slice(0, 8).map((item) => ({
    time: new Date(item.dt * 1000).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    temp: Math.round(item.main.temp),
    humidity: item.main.humidity,
    pressure: item.main.pressure,
  }));
}

/**
 * Get weather icon URL from OpenWeatherMap
 */
export function getWeatherIconUrl(iconCode: string): string {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}

/**
 * Fetch weather data from our API endpoint
 */
export async function fetchWeatherData(city: string = "San Francisco") {
  const response = await fetch(
    `/api/weather?city=${encodeURIComponent(city)}`,
    {
      next: { revalidate: 600 }, // Cache for 10 minutes
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch weather data");
  }

  return response.json();
}
