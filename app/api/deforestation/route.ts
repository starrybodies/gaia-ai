import { NextRequest, NextResponse } from "next/server";
import { getMockDeforestationData } from "@/lib/deforestation";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const location = searchParams.get("location") || "Salt Spring Island, BC";
  const lat = parseFloat(searchParams.get("lat") || "48.8167");
  const lon = parseFloat(searchParams.get("lon") || "-123.5000");
  const country = searchParams.get("country") || "Canada";

  try {
    // Forest data sources:
    // - Global Forest Watch (globalforestwatch.org)
    // - Hansen Global Forest Change
    // - GLAD alerts

    console.log(`[FOREST API] Fetching deforestation data for ${location}`);

    // For demo, return location-aware mock data with BC forest characteristics
    return NextResponse.json(getMockDeforestationData(location, lat, lon, country));

  } catch (error) {
    console.error("Deforestation API error:", error);
    console.log("[DEMO MODE FALLBACK] Using mock deforestation data");
    return NextResponse.json(getMockDeforestationData(location, lat, lon, country));
  }
}
