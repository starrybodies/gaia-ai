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

// Calculate distance between two points in km (Haversine formula)
function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Transform WAQI response to our format
function transformWAQIData(data: any, city: string, distance?: number): AirQualityData {
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
      stationDistance: distance ? Math.round(distance) : undefined,
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
function getMockAirQualityData(city: string, lat?: number, lon?: number): AirQualityData {
  const aqi = 42;
  const aqiInfo = getAQILevel(aqi);

  return {
    location: {
      name: city,
      coordinates: { lat: lat || 48.8167, lon: lon || -123.5 },
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
  const latParam = searchParams.get("lat");
  const lonParam = searchParams.get("lon");

  const lat = latParam ? parseFloat(latParam) : undefined;
  const lon = lonParam ? parseFloat(lonParam) : undefined;

  // If no API key, use mock data
  if (!WAQI_API_KEY) {
    console.log("[DEMO MODE] No WAQI API key, using mock data");
    return NextResponse.json(getMockAirQualityData(city, lat, lon));
  }

  try {
    // If we have coordinates, use geo-based lookup first (most accurate)
    if (lat !== undefined && lon !== undefined && !isNaN(lat) && !isNaN(lon)) {
      console.log(`[WAQI API] Fetching air quality by coordinates (${lat.toFixed(4)}, ${lon.toFixed(4)})`);

      // WAQI geo endpoint returns nearest stations
      const geoUrl = `${WAQI_BASE_URL}/feed/geo:${lat};${lon}/?token=${WAQI_API_KEY}`;

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(geoUrl, {
        headers: { "Accept": "application/json" },
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (response.ok) {
        const result = await response.json();

        if (result.status === "ok" && result.data && typeof result.data !== "string") {
          // Calculate distance to the station
          const stationLat = result.data.city?.geo?.[0];
          const stationLon = result.data.city?.geo?.[1];
          let distance: number | undefined;

          if (stationLat && stationLon) {
            distance = haversineDistance(lat, lon, stationLat, stationLon);

            // Only use station if it's within 500km (reasonable for air quality)
            if (distance > 500) {
              console.log(`[WAQI API] Nearest station too far (${Math.round(distance)}km), using mock data`);
              return NextResponse.json(getMockAirQualityData(city, lat, lon));
            }
          }

          console.log(`[WAQI API] Found station: ${result.data.city?.name} (${distance ? Math.round(distance) + "km away" : "unknown distance"})`);
          return NextResponse.json(transformWAQIData(result.data, city, distance));
        }
      }

      // Geo lookup failed, try map bounds search
      console.log(`[WAQI API] Geo lookup failed, trying bounds search`);

      const bounds = 2; // Search within ~2 degrees
      const mapUrl = `${WAQI_BASE_URL}/map/bounds/?latlng=${lat - bounds},${lon - bounds},${lat + bounds},${lon + bounds}&token=${WAQI_API_KEY}`;

      const mapResponse = await fetch(mapUrl, {
        headers: { "Accept": "application/json" },
      });

      if (mapResponse.ok) {
        const mapResult = await mapResponse.json();

        if (mapResult.status === "ok" && mapResult.data?.length > 0) {
          // Find the nearest station
          let nearestStation = mapResult.data[0];
          let nearestDistance = Infinity;

          for (const station of mapResult.data) {
            const stationLat = station.lat;
            const stationLon = station.lon;
            if (stationLat && stationLon) {
              const dist = haversineDistance(lat, lon, stationLat, stationLon);
              if (dist < nearestDistance) {
                nearestDistance = dist;
                nearestStation = station;
              }
            }
          }

          // Get full data for the nearest station
          const stationUrl = `${WAQI_BASE_URL}/feed/@${nearestStation.uid}/?token=${WAQI_API_KEY}`;
          const stationResponse = await fetch(stationUrl);
          const stationResult = await stationResponse.json();

          if (stationResult.status === "ok" && stationResult.data) {
            console.log(`[WAQI API] Found nearby station via bounds: ${stationResult.data.city?.name} (${Math.round(nearestDistance)}km)`);
            return NextResponse.json(transformWAQIData(stationResult.data, city, nearestDistance));
          }
        }
      }
    }

    // Fallback: Try city name search
    console.log(`[WAQI API] Fetching air quality by name: ${city}`);
    const url = `${WAQI_BASE_URL}/feed/${encodeURIComponent(city)}/?token=${WAQI_API_KEY}`;

    const response = await fetch(url, {
      headers: { "Accept": "application/json" },
    });

    if (!response.ok) {
      console.log(`[WAQI API] API error ${response.status}, using mock data`);
      return NextResponse.json(getMockAirQualityData(city, lat, lon));
    }

    const result = await response.json();

    if (result.status === "ok" && result.data && typeof result.data !== "string") {
      // Verify the station is reasonably close if we have coordinates
      if (lat !== undefined && lon !== undefined) {
        const stationLat = result.data.city?.geo?.[0];
        const stationLon = result.data.city?.geo?.[1];

        if (stationLat && stationLon) {
          const distance = haversineDistance(lat, lon, stationLat, stationLon);
          if (distance > 500) {
            console.log(`[WAQI API] Station "${result.data.city?.name}" too far (${Math.round(distance)}km), using mock data`);
            return NextResponse.json(getMockAirQualityData(city, lat, lon));
          }
          return NextResponse.json(transformWAQIData(result.data, city, distance));
        }
      }
      return NextResponse.json(transformWAQIData(result.data, city));
    }

    console.log(`[WAQI API] No data for ${city}, using mock data`);
    return NextResponse.json(getMockAirQualityData(city, lat, lon));

  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      console.log("[WAQI API] Request timeout, using mock data");
    } else {
      console.error("[WAQI API] Error:", error);
    }
    return NextResponse.json(getMockAirQualityData(city, lat, lon));
  }
}
