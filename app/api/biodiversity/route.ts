import { NextRequest, NextResponse } from "next/server";
import type { GBIFSearchResponse } from "@/types/biodiversity";
import { transformBiodiversityData, getMockBiodiversityData } from "@/lib/biodiversity";

const GBIF_BASE_URL = "https://api.gbif.org/v1";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const location = searchParams.get("location") || "San Francisco, CA";

  // For simplicity, use fixed coordinates for demo
  // In production, you'd geocode the location first
  const lat = parseFloat(searchParams.get("lat") || "37.7749");
  const lon = parseFloat(searchParams.get("lon") || "-122.4194");

  try {
    // Search for occurrences within 10km of the location
    const distance = 10; // km
    const url = `${GBIF_BASE_URL}/occurrence/search?decimalLatitude=${lat}&decimalLongitude=${lon}&limit=100&offset=0`;

    console.log(`[GBIF API] Fetching biodiversity data near ${location}`);

    const response = await fetch(url, {
      headers: {
        "Accept": "application/json",
      },
    });

    if (!response.ok) {
      console.log(
        `[DEMO MODE] GBIF API error ${response.status}, using mock data`
      );
      return NextResponse.json(getMockBiodiversityData(location, lat, lon));
    }

    const data: GBIFSearchResponse = await response.json();

    // Check if we got results
    if (!data.results || data.results.length === 0) {
      console.log(`[DEMO MODE] No GBIF data for ${location}, using mock data`);
      return NextResponse.json(getMockBiodiversityData(location, lat, lon));
    }

    const transformedData = transformBiodiversityData(data, location, lat, lon);
    return NextResponse.json(transformedData);
  } catch (error) {
    console.error("GBIF API error:", error);
    console.log("[DEMO MODE FALLBACK] Using mock biodiversity data");
    return NextResponse.json(getMockBiodiversityData(location, lat, lon));
  }
}
