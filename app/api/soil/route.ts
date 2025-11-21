import { NextRequest, NextResponse } from "next/server";
import { getMockSoilData } from "@/lib/soil";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const location = searchParams.get("location") || "Salt Spring Island, BC";
  const lat = parseFloat(searchParams.get("lat") || "48.8167");
  const lon = parseFloat(searchParams.get("lon") || "-123.5000");

  try {
    // Soil data sources:
    // - OpenLandMap (https://openlandmap.org)
    // - ISRIC World Soil Information
    // - USDA NRCS Web Soil Survey
    // These require complex API integration

    console.log(`[SOIL API] Fetching soil data for ${location}`);

    // For demo, return location-aware mock data
    return NextResponse.json(getMockSoilData(location, lat, lon));

  } catch (error) {
    console.error("Soil API error:", error);
    console.log("[DEMO MODE FALLBACK] Using mock soil data");
    return NextResponse.json(getMockSoilData(location, lat, lon));
  }
}
