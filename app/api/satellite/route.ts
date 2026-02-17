import { NextRequest, NextResponse } from "next/server";
import { getMockSatelliteData } from "@/lib/satellite";

// NASA EONET API for natural events
const EONET_URL = "https://eonet.gsfc.nasa.gov/api/v3/events";
// NASA FIRMS API for fire data (no key required for limited use)
const FIRMS_URL = "https://firms.modaps.eosdis.nasa.gov/api/area/csv";

interface NaturalEvent {
  id: string;
  title: string;
  category: string;
  date: string;
  coordinates: [number, number];
  distance: number;
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function getEventCategory(categories: any[]): string {
  const category = categories?.[0]?.title || "Unknown";
  return category;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const location = searchParams.get("location") || "Salt Spring Island, BC";
  const lat = parseFloat(searchParams.get("lat") || "48.8167");
  const lon = parseFloat(searchParams.get("lon") || "-123.5000");

  try {
    console.log(`[NASA EONET] Fetching satellite/events data for ${location} (${lat}, ${lon})`);

    // Fetch recent natural events from EONET
    const eonetResponse = await fetch(`${EONET_URL}?limit=50&days=30&status=open`, {
      headers: { "Accept": "application/json" },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    let nearbyEvents: NaturalEvent[] = [];
    let globalEvents: any[] = [];

    if (eonetResponse.ok) {
      const eonetData = await eonetResponse.json();
      globalEvents = eonetData.events || [];

      // Find events near our location (within 1000km)
      for (const event of globalEvents) {
        if (event.geometry?.length > 0) {
          const geom = event.geometry[event.geometry.length - 1];
          if (geom.coordinates) {
            const eventLon = geom.coordinates[0];
            const eventLat = geom.coordinates[1];
            const distance = calculateDistance(lat, lon, eventLat, eventLon);

            if (distance < 1000) {
              nearbyEvents.push({
                id: event.id,
                title: event.title,
                category: getEventCategory(event.categories),
                date: geom.date,
                coordinates: [eventLat, eventLon],
                distance: Math.round(distance),
              });
            }
          }
        }
      }

      // Sort by distance
      nearbyEvents.sort((a, b) => a.distance - b.distance);
      nearbyEvents = nearbyEvents.slice(0, 10); // Top 10 nearest
    }

    // Calculate vegetation and environmental indices based on location
    // These are estimates based on latitude and season
    const month = new Date().getMonth();
    const isNorthernHemisphere = lat > 0;
    const isSummer = isNorthernHemisphere ? (month >= 5 && month <= 8) : (month >= 11 || month <= 2);
    const isWinter = isNorthernHemisphere ? (month >= 11 || month <= 2) : (month >= 5 && month <= 8);

    // NDVI varies by season and latitude
    let ndvi = 0.5; // Base value
    if (Math.abs(lat) < 23.5) ndvi = 0.7; // Tropical
    else if (Math.abs(lat) < 45) ndvi = isSummer ? 0.65 : 0.35; // Temperate
    else ndvi = isSummer ? 0.5 : 0.15; // High latitude

    // Adjust for coastal/island locations (typically greener)
    if (location.toLowerCase().includes("island")) ndvi = Math.min(0.8, ndvi + 0.1);

    // Land surface temperature estimate
    const baseLST = 15 + (30 * Math.cos(lat * Math.PI / 90));
    const lst = isSummer ? baseLST + 10 : baseLST - 5;

    // Count events by category for summary
    const eventSummary: Record<string, number> = {};
    for (const event of globalEvents) {
      const cat = getEventCategory(event.categories);
      eventSummary[cat] = (eventSummary[cat] || 0) + 1;
    }

    const result = {
      location: {
        name: location,
        lat,
        lon,
      },
      indices: {
        ndvi: Math.round(ndvi * 100) / 100,
        evi: Math.round((ndvi * 0.9) * 100) / 100,
        ndwi: Math.round((ndvi * 0.7 - 0.1) * 100) / 100, // Estimate based on vegetation
        lst: Math.round(lst * 10) / 10,
      },
      events: nearbyEvents,
      imagery: [{
        date: new Date().toISOString().split("T")[0],
        source: "MODIS/Terra & Aqua",
        url: `https://worldview.earthdata.nasa.gov/?v=${lon-2},${lat-2},${lon+2},${lat+2}`,
        type: "visible" as const,
      }],
      globalSummary: {
        totalActiveEvents: globalEvents.length,
        byCategory: eventSummary,
        nearbyCount: nearbyEvents.length,
        searchRadius: "1000km",
      },
      alerts: nearbyEvents.length > 0 ?
        nearbyEvents.slice(0, 3).map(e => ({
          type: e.category,
          message: `${e.title} (${e.distance}km away)`,
          severity: e.distance < 100 ? "high" : e.distance < 500 ? "medium" : "low",
        })) : [],
      source: "NASA EONET",
      lastUpdated: new Date().toISOString(),
    };

    console.log(`[NASA EONET] Found ${nearbyEvents.length} events within 1000km, ${globalEvents.length} global`);
    return NextResponse.json(result);

  } catch (error) {
    console.error("NASA API error:", error);
    return NextResponse.json(getMockSatelliteData(location, lat, lon));
  }
}
