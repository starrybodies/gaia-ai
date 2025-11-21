import { NextRequest, NextResponse } from "next/server";
import type { OpenAQLocation } from "@/types/airquality";
import { transformAirQualityData } from "@/lib/airquality";

// Mock data for demo mode
function getMockAirQualityData(city: string): OpenAQLocation {
  return {
    id: 12345,
    name: `${city} Air Quality Station`,
    locality: city,
    country: "US",
    coordinates: {
      latitude: 37.7749,
      longitude: -122.4194,
    },
    measurements: [
      {
        parameter: "pm25",
        value: 28.5,
        lastUpdated: new Date().toISOString(),
        unit: "µg/m³",
      },
      {
        parameter: "pm10",
        value: 45.2,
        lastUpdated: new Date().toISOString(),
        unit: "µg/m³",
      },
      {
        parameter: "o3",
        value: 32.1,
        lastUpdated: new Date().toISOString(),
        unit: "µg/m³",
      },
      {
        parameter: "no2",
        value: 18.7,
        lastUpdated: new Date().toISOString(),
        unit: "µg/m³",
      },
      {
        parameter: "so2",
        value: 5.3,
        lastUpdated: new Date().toISOString(),
        unit: "µg/m³",
      },
      {
        parameter: "co",
        value: 0.4,
        lastUpdated: new Date().toISOString(),
        unit: "mg/m³",
      },
    ],
    lastUpdated: new Date().toISOString(),
  };
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const city = searchParams.get("city") || "San Francisco";

  try {
    // Try to fetch from OpenAQ API
    const response = await fetch(
      `https://api.openaq.org/v2/latest?limit=1&city=${encodeURIComponent(city)}`,
      {
        headers: {
          "Accept": "application/json",
        },
      }
    );

    if (!response.ok) {
      console.log(`[DEMO MODE] OpenAQ API error ${response.status}, using mock data`);
      const mockData = getMockAirQualityData(city);
      return NextResponse.json(transformAirQualityData(mockData));
    }

    const data = await response.json();

    // Check if we got results
    if (!data.results || data.results.length === 0) {
      console.log(`[DEMO MODE] No data for ${city}, using mock data`);
      const mockData = getMockAirQualityData(city);
      return NextResponse.json(transformAirQualityData(mockData));
    }

    const location: OpenAQLocation = data.results[0];
    return NextResponse.json(transformAirQualityData(location));

  } catch (error) {
    console.error("Air Quality API error:", error);
    console.log(`[DEMO MODE FALLBACK] Using mock data`);
    const mockData = getMockAirQualityData(city);
    return NextResponse.json(transformAirQualityData(mockData));
  }
}
