import { NextRequest, NextResponse } from "next/server";

const OPENWEATHER_API_KEY = process.env.OPENWEATHERMAP_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const city = searchParams.get("city") || "San Francisco";

  if (!OPENWEATHER_API_KEY) {
    return NextResponse.json(
      { error: "OpenWeatherMap API key not configured" },
      { status: 500 }
    );
  }

  try {
    // Fetch current weather
    const currentWeatherUrl = `${BASE_URL}/weather?q=${encodeURIComponent(
      city
    )}&appid=${OPENWEATHER_API_KEY}&units=metric`;

    const currentResponse = await fetch(currentWeatherUrl);

    if (!currentResponse.ok) {
      throw new Error(`OpenWeatherMap API error: ${currentResponse.status}`);
    }

    const currentData = await currentResponse.json();

    // Fetch 5-day forecast
    const forecastUrl = `${BASE_URL}/forecast?q=${encodeURIComponent(
      city
    )}&appid=${OPENWEATHER_API_KEY}&units=metric`;

    const forecastResponse = await fetch(forecastUrl);

    if (!forecastResponse.ok) {
      throw new Error(
        `OpenWeatherMap Forecast API error: ${forecastResponse.status}`
      );
    }

    const forecastData = await forecastResponse.json();

    return NextResponse.json({
      current: currentData,
      forecast: forecastData,
    });
  } catch (error) {
    console.error("Weather API error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to fetch weather data",
      },
      { status: 500 }
    );
  }
}
