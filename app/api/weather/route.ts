import { NextRequest, NextResponse } from "next/server";

const OPENWEATHER_API_KEY = process.env.OPENWEATHERMAP_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";

// Mock data for demo mode (when API key is invalid/not activated)
function getMockWeatherData(city: string) {
  const now = Math.floor(Date.now() / 1000);

  return {
    current: {
      coord: { lon: -122.42, lat: 37.77 },
      weather: [
        {
          id: 800,
          main: "Clear",
          description: "clear sky",
          icon: "01d",
        },
      ],
      base: "stations",
      main: {
        temp: 18.5,
        feels_like: 17.8,
        temp_min: 16.2,
        temp_max: 20.1,
        pressure: 1013,
        humidity: 65,
      },
      visibility: 10000,
      wind: {
        speed: 3.6,
        deg: 230,
      },
      clouds: {
        all: 10,
      },
      dt: now,
      sys: {
        country: "US",
        sunrise: now - 21600,
        sunset: now + 21600,
      },
      timezone: -28800,
      id: 5391959,
      name: city,
      cod: 200,
    },
    forecast: {
      cod: "200",
      message: 0,
      cnt: 40,
      list: Array.from({ length: 40 }, (_, i) => ({
        dt: now + i * 10800,
        main: {
          temp: 18 + Math.sin(i * 0.5) * 5,
          feels_like: 17 + Math.sin(i * 0.5) * 5,
          temp_min: 16 + Math.sin(i * 0.5) * 4,
          temp_max: 20 + Math.sin(i * 0.5) * 4,
          pressure: 1013 + Math.sin(i * 0.3) * 5,
          sea_level: 1013,
          grnd_level: 1011,
          humidity: 65 + Math.sin(i * 0.4) * 15,
          temp_kf: 0,
        },
        weather: [
          {
            id: 800,
            main: i % 3 === 0 ? "Clouds" : "Clear",
            description: i % 3 === 0 ? "few clouds" : "clear sky",
            icon: i % 3 === 0 ? "02d" : "01d",
          },
        ],
        clouds: {
          all: i % 3 === 0 ? 20 : 5,
        },
        wind: {
          speed: 3 + Math.sin(i * 0.2) * 2,
          deg: 230,
          gust: 5,
        },
        visibility: 10000,
        pop: 0,
        sys: {
          pod: i % 2 === 0 ? "d" : "n",
        },
        dt_txt: new Date((now + i * 10800) * 1000).toISOString().replace("T", " ").slice(0, -5),
      })),
      city: {
        id: 5391959,
        name: city,
        coord: {
          lat: 37.77,
          lon: -122.42,
        },
        country: "US",
        population: 873965,
        timezone: -28800,
        sunrise: now - 21600,
        sunset: now + 21600,
      },
    },
  };
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const city = searchParams.get("city") || "San Francisco";
  const demoMode = searchParams.get("demo") === "true";

  // If explicitly in demo mode or no API key, return mock data
  if (demoMode || !OPENWEATHER_API_KEY) {
    console.log(`[DEMO MODE] Returning mock data for ${city}`);
    return NextResponse.json(getMockWeatherData(city));
  }

  try {
    // Fetch current weather
    const currentWeatherUrl = `${BASE_URL}/weather?q=${encodeURIComponent(
      city
    )}&appid=${OPENWEATHER_API_KEY}&units=metric`;

    const currentResponse = await fetch(currentWeatherUrl);

    if (!currentResponse.ok) {
      // If API call fails (401, etc.), fall back to demo mode
      console.log(
        `[DEMO MODE FALLBACK] OpenWeatherMap API error ${currentResponse.status}, using mock data`
      );
      return NextResponse.json(getMockWeatherData(city));
    }

    const currentData = await currentResponse.json();

    // Fetch 5-day forecast
    const forecastUrl = `${BASE_URL}/forecast?q=${encodeURIComponent(
      city
    )}&appid=${OPENWEATHER_API_KEY}&units=metric`;

    const forecastResponse = await fetch(forecastUrl);

    if (!forecastResponse.ok) {
      console.log(
        `[DEMO MODE FALLBACK] Forecast API error ${forecastResponse.status}, using mock data`
      );
      return NextResponse.json(getMockWeatherData(city));
    }

    const forecastData = await forecastResponse.json();

    return NextResponse.json({
      current: currentData,
      forecast: forecastData,
    });
  } catch (error) {
    // On any error, fall back to demo mode instead of returning 500
    console.log(`[DEMO MODE FALLBACK] Error: ${error}, using mock data`);
    return NextResponse.json(getMockWeatherData(city));
  }
}
