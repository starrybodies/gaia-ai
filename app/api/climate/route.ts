import { NextRequest, NextResponse } from "next/server";
import type { NOAAResponse } from "@/types/climate";
import { transformClimateData, getMockClimateData } from "@/lib/climate";

const NOAA_API_KEY = process.env.NOAA_API_KEY;
const NOAA_BASE_URL = "https://www.ncdc.noaa.gov/cdo-web/api/v2";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const location = searchParams.get("location") || "San Francisco, CA";

  // For demo purposes, we'll use a simplified approach
  // In production, you'd want to:
  // 1. First lookup location ID using NOAA locations endpoint
  // 2. Then query data for that location

  // Date range: last year of data
  const endDate = new Date();
  const startDate = new Date();
  startDate.setFullYear(endDate.getFullYear() - 1);

  const startDateStr = startDate.toISOString().split("T")[0];
  const endDateStr = endDate.toISOString().split("T")[0];

  try {
    if (!NOAA_API_KEY) {
      console.log("[DEMO MODE] No NOAA API key, using mock data");
      return NextResponse.json(getMockClimateData(location));
    }

    // NOAA requires a location ID. For simplicity, we'll use a common location
    // In production, you'd geocode the location first
    const locationId = "CITY:US370019"; // San Francisco as default

    // Query for temperature and precipitation data
    const datatypes = "TMAX,TMIN,PRCP";
    const url = `${NOAA_BASE_URL}/data?datasetid=GHCND&locationid=${locationId}&startdate=${startDateStr}&enddate=${endDateStr}&datatypeid=${datatypes}&limit=1000&units=metric`;

    console.log(`[NOAA API] Fetching climate data for ${location}`);

    const response = await fetch(url, {
      headers: {
        "token": NOAA_API_KEY,
        "Accept": "application/json",
      },
    });

    if (!response.ok) {
      console.log(
        `[DEMO MODE] NOAA API error ${response.status}, using mock data`
      );
      return NextResponse.json(getMockClimateData(location));
    }

    const data: NOAAResponse = await response.json();

    // Check if we got results
    if (!data.results || data.results.length === 0) {
      console.log(`[DEMO MODE] No NOAA data for ${location}, using mock data`);
      return NextResponse.json(getMockClimateData(location));
    }

    const transformedData = transformClimateData(
      data,
      location,
      locationId,
      startDateStr,
      endDateStr
    );

    return NextResponse.json(transformedData);
  } catch (error) {
    console.error("NOAA Climate API error:", error);
    console.log("[DEMO MODE FALLBACK] Using mock data");
    return NextResponse.json(getMockClimateData(location));
  }
}
