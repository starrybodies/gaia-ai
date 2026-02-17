import { NextRequest, NextResponse } from "next/server";
import { getMockOceanData, POPULAR_STATIONS } from "@/lib/ocean";
import { valueOceanEcosystem, formatCurrency } from "@/lib/valuation";

// Parse NDBC standard meteorological data format
function parseNDBCData(text: string, stationId: string) {
  const lines = text.trim().split("\n");
  if (lines.length < 3) return null;

  // Get all data lines (non-header lines)
  const dataLines = lines.filter(l => !l.startsWith("#") && l.trim().length > 0);
  if (dataLines.length === 0) return null;

  // NDBC format columns (space-separated):
  // #YY MM DD hh mm WDIR WSPD GST WVHT DPD APD MWD PRES ATMP WTMP DEWP VIS PTDY TIDE
  const parseVal = (v: string) => v === "MM" || v === "999" || v === "99.0" || v === "99.00" ? null : parseFloat(v);

  // Try to find the best data from recent lines (some readings may have MM values)
  let bestData: Record<string, number | null> = {};
  let timestamp = "";

  for (let i = 0; i < Math.min(dataLines.length, 5); i++) {
    const values = dataLines[i].trim().split(/\s+/);
    if (values.length < 15) continue;

    if (i === 0) {
      // NDBC uses 4-digit years (2025), construct ISO timestamp
      const year = values[0].length === 4 ? values[0] : `20${values[0]}`;
      timestamp = `${year}-${values[1].padStart(2, '0')}-${values[2].padStart(2, '0')}T${values[3].padStart(2, '0')}:${values[4].padStart(2, '0')}:00Z`;
    }

    // Collect first non-null values for each field
    if (bestData.waveHeight === undefined || bestData.waveHeight === null) bestData.waveHeight = parseVal(values[8]);
    if (bestData.wavePeriod === undefined || bestData.wavePeriod === null) bestData.wavePeriod = parseVal(values[9]);
    if (bestData.waveDirection === undefined || bestData.waveDirection === null) bestData.waveDirection = parseVal(values[11]);
    if (bestData.waterTemp === undefined || bestData.waterTemp === null) bestData.waterTemp = parseVal(values[14]);
    if (bestData.airTemp === undefined || bestData.airTemp === null) bestData.airTemp = parseVal(values[13]);
    if (bestData.windSpeed === undefined || bestData.windSpeed === null) bestData.windSpeed = parseVal(values[6]);
    if (bestData.windDirection === undefined || bestData.windDirection === null) bestData.windDirection = parseVal(values[5]);
    if (bestData.windGust === undefined || bestData.windGust === null) bestData.windGust = parseVal(values[7]);
    if (bestData.pressure === undefined || bestData.pressure === null) bestData.pressure = parseVal(values[12]);
    if (bestData.visibility === undefined || bestData.visibility === null) bestData.visibility = parseVal(values[15]);
  }

  const stationInfo = POPULAR_STATIONS.find(s => s.id === stationId) || {
    id: stationId,
    name: `Station ${stationId}`,
    location: "Unknown",
    lat: 0,
    lon: 0,
  };

  // Build history from last 24 data points
  const history = [];
  for (let i = 0; i < Math.min(dataLines.length, 24); i++) {
    const values = dataLines[i].trim().split(/\s+/);
    if (values.length < 15) continue;
    const year = values[0].length === 4 ? values[0] : `20${values[0]}`;
    const tsStr = `${year}-${values[1].padStart(2, '0')}-${values[2].padStart(2, '0')}T${values[3].padStart(2, '0')}:${values[4].padStart(2, '0')}:00Z`;
    const ts = new Date(tsStr);
    if (!isNaN(ts.getTime())) {
      history.push({
        timestamp: ts.toISOString(),
        seaTemperature: parseVal(values[14]),
        waveHeight: parseVal(values[8]),
      });
    }
  }

  return {
    station: {
      id: stationId,
      name: stationInfo.name,
      lat: stationInfo.lat,
      lon: stationInfo.lon,
      type: "buoy",
    },
    current: {
      seaTemperature: bestData.waterTemp,
      airTemperature: bestData.airTemp,
      waveHeight: bestData.waveHeight,
      wavePeriod: bestData.wavePeriod,
      windSpeed: bestData.windSpeed,
      windDirection: bestData.windDirection,
      pressure: bestData.pressure,
      visibility: bestData.visibility,
    },
    conditions: {
      seaState: getSeaState(bestData.waveHeight),
      beaufortScale: getBeaufortScale(bestData.windSpeed),
      waveDirection: bestData.waveDirection,
      windGust: bestData.windGust,
    },
    history: history.reverse(),
    tides: {
      next: [], // NDBC doesn't provide tide predictions
      current: "unknown",
    },
    // Natural Capital Valuation
    valuation: (() => {
      const analysisAreaKm2 = 5000; // ~50km radius coastal zone
      const isCoastal = true; // NDBC buoys are typically coastal
      const waterTemp = bestData.waterTemp || 15;
      const seaState = getSeaState(bestData.waveHeight);
      const oceanVal = valueOceanEcosystem(analysisAreaKm2, isCoastal, waterTemp, seaState);
      return {
        naturalCapital: {
          annualTotal: oceanVal.annualServices.total,
          annualTotalFormatted: formatCurrency(oceanVal.annualServices.total),
        },
        annualEcosystemServices: {
          total: oceanVal.annualServices.total,
          totalFormatted: formatCurrency(oceanVal.annualServices.total),
          breakdown: {
            fisheries: { value: oceanVal.annualServices.fisheries, formatted: formatCurrency(oceanVal.annualServices.fisheries) },
            coastalProtection: { value: oceanVal.annualServices.coastalProtection, formatted: formatCurrency(oceanVal.annualServices.coastalProtection) },
            carbonSequestration: { value: oceanVal.annualServices.carbonSequestration, formatted: formatCurrency(oceanVal.annualServices.carbonSequestration) },
            recreation: { value: oceanVal.annualServices.recreationTourism, formatted: formatCurrency(oceanVal.annualServices.recreationTourism) },
            biodiversity: { value: oceanVal.annualServices.biodiversity, formatted: formatCurrency(oceanVal.annualServices.biodiversity) },
            nutrientCycling: { value: oceanVal.annualServices.nutrientCycling, formatted: formatCurrency(oceanVal.annualServices.nutrientCycling) },
          },
        },
        climateRisks: {
          acidificationCost: oceanVal.healthRisk.acidificationCost,
          acidificationCostFormatted: formatCurrency(oceanVal.healthRisk.acidificationCost),
          temperatureStress: oceanVal.healthRisk.temperatureStressCost,
          temperatureStressFormatted: formatCurrency(oceanVal.healthRisk.temperatureStressCost),
          totalAnnualRisk: oceanVal.healthRisk.acidificationCost + oceanVal.healthRisk.temperatureStressCost + oceanVal.healthRisk.pollutionCost,
          totalAnnualRiskFormatted: formatCurrency(oceanVal.healthRisk.acidificationCost + oceanVal.healthRisk.temperatureStressCost + oceanVal.healthRisk.pollutionCost),
        },
        analysisArea: `${analysisAreaKm2.toLocaleString()} km² coastal zone`,
        methodology: "TEEB Marine & Coastal Ecosystem Services",
      };
    })(),
    source: "NOAA NDBC (Real-time)",
    lastUpdated: timestamp ? new Date(timestamp).toISOString() : new Date().toISOString(),
  };
}

function getSeaState(waveHeight: number | null): string {
  if (waveHeight === null) return "Unknown";
  if (waveHeight < 0.1) return "Calm (glassy)";
  if (waveHeight < 0.5) return "Calm (rippled)";
  if (waveHeight < 1.25) return "Smooth";
  if (waveHeight < 2.5) return "Slight";
  if (waveHeight < 4) return "Moderate";
  if (waveHeight < 6) return "Rough";
  if (waveHeight < 9) return "Very rough";
  if (waveHeight < 14) return "High";
  return "Very high";
}

function getBeaufortScale(windSpeed: number | null): number {
  if (windSpeed === null) return 0;
  const knots = windSpeed * 1.944; // m/s to knots
  if (knots < 1) return 0;
  if (knots < 4) return 1;
  if (knots < 7) return 2;
  if (knots < 11) return 3;
  if (knots < 17) return 4;
  if (knots < 22) return 5;
  if (knots < 28) return 6;
  if (knots < 34) return 7;
  if (knots < 41) return 8;
  if (knots < 48) return 9;
  if (knots < 56) return 10;
  if (knots < 64) return 11;
  return 12;
}

// Calculate distance between two coordinates using Haversine formula
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

// Find nearest buoy station to given coordinates
function findNearestStation(lat: number, lon: number): { station: typeof POPULAR_STATIONS[0], distance: number } {
  let nearest = POPULAR_STATIONS[0];
  let minDistance = haversineDistance(lat, lon, nearest.lat, nearest.lon);

  for (const station of POPULAR_STATIONS) {
    const distance = haversineDistance(lat, lon, station.lat, station.lon);
    if (distance < minDistance) {
      minDistance = distance;
      nearest = station;
    }
  }

  return { station: nearest, distance: minDistance };
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");
  let stationId = searchParams.get("station");
  let stationDistance = 0;

  // If lat/lon provided, find nearest station
  if (lat && lon) {
    const latNum = parseFloat(lat);
    const lonNum = parseFloat(lon);
    if (!isNaN(latNum) && !isNaN(lonNum)) {
      const { station, distance } = findNearestStation(latNum, lonNum);
      stationId = station.id;
      stationDistance = distance;
      console.log(`[NOAA NDBC] Nearest station to ${latNum}, ${lonNum} is ${station.name} (${stationId}) at ${distance.toFixed(0)}km`);
    }
  }

  // Default to San Francisco if no station found
  if (!stationId) {
    stationId = "46026";
  }

  try {
    const url = `https://www.ndbc.noaa.gov/data/realtime2/${stationId}.txt`;

    console.log(`[NOAA NDBC] Fetching ocean data for station ${stationId}`);

    const response = await fetch(url, {
      headers: { "Accept": "text/plain" },
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) {
      console.log(`[NOAA NDBC] Error ${response.status}, using mock data`);
      return NextResponse.json(getMockOceanData(stationId));
    }

    const text = await response.text();
    const parsedData = parseNDBCData(text, stationId);

    if (!parsedData) {
      console.log(`[NOAA NDBC] Could not parse data for ${stationId}, using mock data`);
      return NextResponse.json(getMockOceanData(stationId));
    }

    console.log(`[NOAA NDBC] Real data received for station ${stationId}`);
    return NextResponse.json(parsedData);

  } catch (error) {
    console.error("NOAA NDBC API error:", error);
    return NextResponse.json(getMockOceanData(stationId));
  }
}

// Get list of available stations
export async function POST() {
  return NextResponse.json({ stations: POPULAR_STATIONS });
}
