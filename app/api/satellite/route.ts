import { NextRequest, NextResponse } from "next/server";
import { getMockSatelliteData } from "@/lib/satellite";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const location = searchParams.get("location") || "Salt Spring Island, BC";
  const lat = parseFloat(searchParams.get("lat") || "48.8167");
  const lon = parseFloat(searchParams.get("lon") || "-123.5000");

  try {
    // NASA EONET API for natural events
    const eonetUrl = "https://eonet.gsfc.nasa.gov/api/v3/events?limit=10&days=30";

    console.log(`[NASA API] Fetching satellite data for ${location}`);

    const response = await fetch(eonetUrl, {
      headers: { "Accept": "application/json" },
    });

    if (!response.ok) {
      console.log(`[DEMO MODE] NASA API error ${response.status}, using mock data`);
      return NextResponse.json(getMockSatelliteData(location, lat, lon));
    }

    // Even with real event data, we'll use mock for indices
    // as those require complex satellite data processing
    console.log(`[NASA API] Connected, using enhanced mock data`);
    return NextResponse.json(getMockSatelliteData(location, lat, lon));

  } catch (error) {
    console.error("NASA Satellite API error:", error);
    console.log("[DEMO MODE FALLBACK] Using mock satellite data");
    return NextResponse.json(getMockSatelliteData(location, lat, lon));
  }
}
