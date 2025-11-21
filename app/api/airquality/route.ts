import { NextRequest, NextResponse } from "next/server";
import type { AirQualityData } from "@/types/airquality";

const WAQI_API_KEY = process.env.WAQI_API_KEY;
const WAQI_BASE_URL = "https://api.waqi.info";

// AQI level descriptions
function getAQILevel(aqi: number): { level: string; description: string; color: string } {
  if (aqi <= 50) return { level: "Good", description: "Air quality is satisfactory", color: "#00A7E1" };
  if (aqi <= 100) return { level: "Moderate", description: "Acceptable for most", color: "#98D8C8" };
  if (aqi <= 150) return { level: "Unhealthy for Sensitive", description: "Sensitive groups may be affected", color: "#FFB347" };
  if (aqi <= 200) return { level: "Unhealthy", description: "Health effects possible for all", color: "#FF8C42" };
  if (aqi <= 300) return { level: "Very Unhealthy", description: "Health alert", color: "#D2691E" };
  return { level: "Hazardous", description: "Emergency conditions", color: "#8B0000" };
}

// Transform WAQI response to our format
function transformWAQIData(data: any, city: string): AirQualityData {
  const aqi = data.aqi || 0;
  const aqiInfo = getAQILevel(aqi);

  // Extract pollutant values from iaqi (individual AQI values)
  const iaqi = data.iaqi || {};

  return {
    location: {
      name: data.city?.name || city,
      coordinates: {
        lat: data.city?.geo?.[0] || 0,
        lon: data.city?.geo?.[1] || 0,
      },
    },
    current: {
      aqi: aqi,
      level: aqiInfo.level,
      description: aqiInfo.description,
      dominantPollutant: data.dominentpol || "pm25",
      color: aqiInfo.color,
    },
    pollutants: {
      pm25: {
        value: iaqi.pm25?.v || 0,
        unit: "µg/m³",
        whoLimit: 15,
      },
      pm10: {
        value: iaqi.pm10?.v || 0,
        unit: "µg/m³",
        whoLimit: 45,
      },
      o3: {
        value: iaqi.o3?.v || 0,
        unit: "µg/m³",
        whoLimit: 100,
      },
      no2: {
        value: iaqi.no2?.v || 0,
        unit: "µg/m³",
        whoLimit: 25,
      },
      so2: {
        value: iaqi.so2?.v || 0,
        unit: "µg/m³",
        whoLimit: 40,
      },
      co: {
        value: iaqi.co?.v || 0,
        unit: "mg/m³",
        whoLimit: 4,
      },
    },
    weather: {
      temperature: iaqi.t?.v,
      humidity: iaqi.h?.v,
      pressure: iaqi.p?.v,
      wind: iaqi.w?.v,
    },
    forecast: data.forecast?.daily || null,
    attribution: data.attributions?.map((a: any) => a.name).join(", ") || "WAQI",
    lastUpdated: data.time?.iso || new Date().toISOString(),
  };
}

// Mock data for demo mode
function getMockAirQualityData(city: string): AirQualityData {
  const aqi = 42;
  const aqiInfo = getAQILevel(aqi);

  return {
    location: {
      name: city,
      coordinates: { lat: 48.8167, lon: -123.5 },
    },
    current: {
      aqi: aqi,
      level: aqiInfo.level,
      description: aqiInfo.description,
      dominantPollutant: "pm25",
      color: aqiInfo.color,
    },
    pollutants: {
      pm25: { value: 12.5, unit: "µg/m³", whoLimit: 15 },
      pm10: { value: 28.3, unit: "µg/m³", whoLimit: 45 },
      o3: { value: 45.2, unit: "µg/m³", whoLimit: 100 },
      no2: { value: 8.7, unit: "µg/m³", whoLimit: 25 },
      so2: { value: 3.1, unit: "µg/m³", whoLimit: 40 },
      co: { value: 0.3, unit: "mg/m³", whoLimit: 4 },
    },
    weather: {
      temperature: 14,
      humidity: 72,
      pressure: 1015,
      wind: 3.2,
    },
    forecast: null,
    attribution: "Demo Data",
    lastUpdated: new Date().toISOString(),
  };
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const city = searchParams.get("city") || "Salt Spring Island";

  // If no API key, use mock data
  if (!WAQI_API_KEY) {
    console.log("[DEMO MODE] No WAQI API key, using mock data");
    return NextResponse.json(getMockAirQualityData(city));
  }

  try {
    // WAQI API - search by city name
    const url = `${WAQI_BASE_URL}/feed/${encodeURIComponent(city)}/?token=${WAQI_API_KEY}`;

    console.log(`[WAQI API] Fetching air quality for ${city}`);

    const response = await fetch(url, {
      headers: { "Accept": "application/json" },
    });

    if (!response.ok) {
      console.log(`[DEMO MODE] WAQI API error ${response.status}, using mock data`);
      return NextResponse.json(getMockAirQualityData(city));
    }

    const result = await response.json();

    // WAQI returns { status: "ok", data: {...} } or { status: "error", data: "..." }
    if (result.status !== "ok" || !result.data || typeof result.data === "string") {
      console.log(`[WAQI API] No data for ${city}: ${result.data || "unknown error"}`);

      // Try searching for nearest station instead
      const geoUrl = `${WAQI_BASE_URL}/search/?keyword=${encodeURIComponent(city)}&token=${WAQI_API_KEY}`;
      const geoResponse = await fetch(geoUrl);
      const geoResult = await geoResponse.json();

      if (geoResult.status === "ok" && geoResult.data?.length > 0) {
        // Get data from first matching station
        const stationId = geoResult.data[0].uid;
        const stationUrl = `${WAQI_BASE_URL}/feed/@${stationId}/?token=${WAQI_API_KEY}`;
        const stationResponse = await fetch(stationUrl);
        const stationResult = await stationResponse.json();

        if (stationResult.status === "ok" && stationResult.data) {
          console.log(`[WAQI API] Found nearby station: ${stationResult.data.city?.name}`);
          return NextResponse.json(transformWAQIData(stationResult.data, city));
        }
      }

      console.log(`[DEMO MODE] No WAQI stations near ${city}, using mock data`);
      return NextResponse.json(getMockAirQualityData(city));
    }

    return NextResponse.json(transformWAQIData(result.data, city));

  } catch (error) {
    console.error("WAQI API error:", error);
    console.log("[DEMO MODE FALLBACK] Using mock air quality data");
    return NextResponse.json(getMockAirQualityData(city));
  }
}
