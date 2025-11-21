import { NextRequest, NextResponse } from "next/server";
import { getMockCarbonData } from "@/lib/carbon";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const location = searchParams.get("location") || "Salt Spring Island, BC";
  const lat = parseFloat(searchParams.get("lat") || "48.8167");
  const lon = parseFloat(searchParams.get("lon") || "-123.5000");
  const country = searchParams.get("country") || "Canada";

  try {
    // Carbon data comes from various research institutions
    // Global Carbon Project, NOAA, etc. - mostly annual reports
    // For real-time demo, we use calculated mock data based on regional averages

    console.log(`[CARBON API] Fetching carbon data for ${location}`);

    // We could fetch from Global Carbon Project API or similar
    // For now, return high-quality mock data based on regional statistics
    return NextResponse.json(getMockCarbonData(location, lat, lon, country));

  } catch (error) {
    console.error("Carbon API error:", error);
    console.log("[DEMO MODE FALLBACK] Using mock carbon data");
    return NextResponse.json(getMockCarbonData(location, lat, lon, country));
  }
}
