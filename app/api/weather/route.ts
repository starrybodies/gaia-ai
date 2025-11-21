import { NextRequest, NextResponse } from "next/server";

const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";
const WEATHER_URL = "https://api.open-meteo.com/v1/forecast";

// Weather code descriptions
const WEATHER_CODES: Record<number, string> = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Depositing rime fog",
  51: "Light drizzle",
  53: "Moderate drizzle",
  55: "Dense drizzle",
  56: "Light freezing drizzle",
  57: "Dense freezing drizzle",
  61: "Slight rain",
  63: "Moderate rain",
  65: "Heavy rain",
  66: "Light freezing rain",
  67: "Heavy freezing rain",
  71: "Slight snow",
  73: "Moderate snow",
  75: "Heavy snow",
  77: "Snow grains",
  80: "Slight rain showers",
  81: "Moderate rain showers",
  82: "Violent rain showers",
  85: "Slight snow showers",
  86: "Heavy snow showers",
  95: "Thunderstorm",
  96: "Thunderstorm with slight hail",
  99: "Thunderstorm with heavy hail",
};

// Get weather description from code
function getWeatherDescription(code: number): string {
  return WEATHER_CODES[code] || "Unknown";
}

// Geocode city name to coordinates
async function geocodeCity(city: string): Promise<{ lat: number; lon: number; name: string; country: string } | null> {
  try {
    const response = await fetch(
      `${GEOCODING_URL}?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
    );

    if (!response.ok) return null;

    const data = await response.json();

    if (!data.results || data.results.length === 0) return null;

    const result = data.results[0];
    return {
      lat: result.latitude,
      lon: result.longitude,
      name: result.name,
      country: result.country_code || result.country || "",
    };
  } catch {
    return null;
  }
}

// Mock data for fallback
function getMockWeatherData(city: string) {
  const now = Math.floor(Date.now() / 1000);
  return {
    current: {
      name: city,
      sys: { country: "CA" },
      main: { temp: 12, feels_like: 10, humidity: 75, pressure: 1015 },
      weather: [{ description: "Partly cloudy", icon: "02d" }],
      wind: { speed: 3.5 },
      dt: now,
    },
    forecast: {
      list: Array.from({ length: 40 }, (_, i) => ({
        dt: now + i * 10800,
        main: { temp: 12 + Math.sin(i * 0.5) * 5, humidity: 70 + Math.sin(i) * 10, pressure: 1015 },
        weather: [{ description: i % 3 === 0 ? "Cloudy" : "Clear", icon: "02d" }],
        wind: { speed: 3 },
        dt_txt: new Date((now + i * 10800) * 1000).toISOString(),
      })),
      city: { name: city, country: "CA" },
    },
  };
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const city = searchParams.get("city") || "Salt Spring Island";
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  try {
    let coordinates: { lat: number; lon: number; name: string; country: string };

    // Use provided coordinates or geocode the city
    if (lat && lon) {
      coordinates = {
        lat: parseFloat(lat),
        lon: parseFloat(lon),
        name: city,
        country: "",
      };
    } else {
      const geocoded = await geocodeCity(city);
      if (!geocoded) {
        console.log(`[OPEN-METEO] Could not geocode ${city}, using mock data`);
        return NextResponse.json(getMockWeatherData(city));
      }
      coordinates = geocoded;
    }

    console.log(`[OPEN-METEO] Fetching weather for ${coordinates.name} (${coordinates.lat}, ${coordinates.lon})`);

    // Fetch weather data from Open-Meteo
    const weatherUrl = `${WEATHER_URL}?latitude=${coordinates.lat}&longitude=${coordinates.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,cloud_cover,pressure_msl,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,pressure_msl&daily=weather_code,temperature_2m_max,temperature_2m_min,wind_speed_10m_max&timezone=auto&forecast_days=7`;

    const response = await fetch(weatherUrl);

    if (!response.ok) {
      console.log(`[OPEN-METEO] API error ${response.status}, using mock data`);
      return NextResponse.json(getMockWeatherData(city));
    }

    const data = await response.json();

    // Transform to match existing format expected by widget
    const transformed = {
      current: {
        name: coordinates.name,
        sys: { country: coordinates.country },
        main: {
          temp: data.current.temperature_2m,
          feels_like: data.current.apparent_temperature,
          humidity: data.current.relative_humidity_2m,
          pressure: Math.round(data.current.pressure_msl),
        },
        weather: [{
          description: getWeatherDescription(data.current.weather_code),
          icon: data.current.weather_code <= 3 ? "01d" : "04d",
        }],
        wind: { speed: data.current.wind_speed_10m / 3.6 }, // km/h to m/s for consistency
        dt: Math.floor(Date.now() / 1000),
        clouds: { all: data.current.cloud_cover },
      },
      forecast: {
        list: data.hourly.time.slice(0, 40).map((time: string, i: number) => ({
          dt: Math.floor(new Date(time).getTime() / 1000),
          main: {
            temp: data.hourly.temperature_2m[i],
            humidity: data.hourly.relative_humidity_2m[i],
            pressure: Math.round(data.hourly.pressure_msl[i]),
          },
          weather: [{
            description: getWeatherDescription(data.hourly.weather_code[i]),
            icon: data.hourly.weather_code[i] <= 3 ? "01d" : "04d",
          }],
          wind: { speed: data.hourly.wind_speed_10m[i] / 3.6 },
          dt_txt: time.replace("T", " "),
        })),
        city: {
          name: coordinates.name,
          country: coordinates.country,
        },
      },
      // Include raw Open-Meteo data for extended use
      openMeteo: {
        daily: data.daily,
        current: data.current,
        timezone: data.timezone,
      },
    };

    return NextResponse.json(transformed);

  } catch (error) {
    console.error("Open-Meteo API error:", error);
    console.log("[OPEN-METEO FALLBACK] Using mock weather data");
    return NextResponse.json(getMockWeatherData(city));
  }
}
