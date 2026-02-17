import { NextRequest, NextResponse } from "next/server";
import { getMockClimateData } from "@/lib/climate";

// Use Open-Meteo's climate API for reliable historical data
const CLIMATE_URL = "https://archive-api.open-meteo.com/v1/archive";
const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";

// Geocode location name to coordinates
async function geocodeLocation(location: string): Promise<{ lat: number; lon: number; name: string } | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(
      `${GEOCODING_URL}?name=${encodeURIComponent(location)}&count=1&language=en&format=json`,
      { signal: controller.signal }
    );
    clearTimeout(timeout);

    if (!response.ok) return null;
    const data = await response.json();
    if (!data.results || data.results.length === 0) return null;

    const result = data.results[0];
    return {
      lat: result.latitude,
      lon: result.longitude,
      name: result.name,
    };
  } catch {
    return null;
  }
}

// Reverse geocode to get location name
async function reverseGeocode(lat: number, lon: number): Promise<string> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${lat}&longitude=${lon}&count=1`,
      { signal: controller.signal }
    );
    clearTimeout(timeout);

    if (response.ok) {
      const data = await response.json();
      if (data.results?.[0]?.name) {
        return data.results[0].name;
      }
    }
  } catch {}
  return `${lat.toFixed(2)}°, ${lon.toFixed(2)}°`;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const location = searchParams.get("location") || "Salt Spring Island, BC";
  const latParam = searchParams.get("lat");
  const lonParam = searchParams.get("lon");

  try {
    let lat: number;
    let lon: number;
    let locationName = location;

    // Use provided coordinates or geocode location
    if (latParam && lonParam) {
      lat = parseFloat(latParam);
      lon = parseFloat(lonParam);
      if (isNaN(lat) || isNaN(lon)) {
        return NextResponse.json(getMockClimateData(location));
      }
      // Get proper location name if needed
      if (location.includes("°") || !location) {
        locationName = await reverseGeocode(lat, lon);
      }
    } else {
      const geo = await geocodeLocation(location);
      if (!geo) {
        console.log(`[CLIMATE] Could not geocode "${location}", using mock data`);
        return NextResponse.json(getMockClimateData(location));
      }
      lat = geo.lat;
      lon = geo.lon;
      locationName = geo.name;
    }

    console.log(`[CLIMATE] Fetching historical data for ${locationName} (${lat.toFixed(4)}, ${lon.toFixed(4)})`);

    // Get historical climate data for the past 10 years
    const endDate = new Date();
    const startDate = new Date();
    startDate.setFullYear(endDate.getFullYear() - 10);

    const startDateStr = startDate.toISOString().split("T")[0];
    const endDateStr = endDate.toISOString().split("T")[0];

    // Fetch historical climate data from Open-Meteo Archive API
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const url = `${CLIMATE_URL}?latitude=${lat}&longitude=${lon}&start_date=${startDateStr}&end_date=${endDateStr}&daily=temperature_2m_max,temperature_2m_min,temperature_2m_mean,precipitation_sum,rain_sum,snowfall_sum,wind_speed_10m_max&timezone=auto`;

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);

    if (!response.ok) {
      console.log(`[CLIMATE] API error ${response.status}, using mock data`);
      return NextResponse.json(getMockClimateData(location));
    }

    const data = await response.json();

    if (!data.daily || !data.daily.time || data.daily.time.length === 0) {
      console.log(`[CLIMATE] No data available, using mock data`);
      return NextResponse.json(getMockClimateData(location));
    }

    // Process the data to create yearly summaries
    const yearlyData: Record<string, {
      temps: number[];
      maxTemps: number[];
      minTemps: number[];
      precip: number;
      rain: number;
      snow: number;
      windMax: number[];
    }> = {};

    for (let i = 0; i < data.daily.time.length; i++) {
      const date = data.daily.time[i];
      const year = date.substring(0, 4);

      if (!yearlyData[year]) {
        yearlyData[year] = {
          temps: [],
          maxTemps: [],
          minTemps: [],
          precip: 0,
          rain: 0,
          snow: 0,
          windMax: [],
        };
      }

      if (data.daily.temperature_2m_mean[i] !== null) {
        yearlyData[year].temps.push(data.daily.temperature_2m_mean[i]);
      }
      if (data.daily.temperature_2m_max[i] !== null) {
        yearlyData[year].maxTemps.push(data.daily.temperature_2m_max[i]);
      }
      if (data.daily.temperature_2m_min[i] !== null) {
        yearlyData[year].minTemps.push(data.daily.temperature_2m_min[i]);
      }
      if (data.daily.precipitation_sum[i] !== null) {
        yearlyData[year].precip += data.daily.precipitation_sum[i];
      }
      if (data.daily.rain_sum[i] !== null) {
        yearlyData[year].rain += data.daily.rain_sum[i];
      }
      if (data.daily.snowfall_sum[i] !== null) {
        yearlyData[year].snow += data.daily.snowfall_sum[i];
      }
      if (data.daily.wind_speed_10m_max[i] !== null) {
        yearlyData[year].windMax.push(data.daily.wind_speed_10m_max[i]);
      }
    }

    // Calculate statistics
    const years = Object.keys(yearlyData).sort();
    const recentYears = years.slice(-10);

    const annualData = recentYears.map(year => {
      const yd = yearlyData[year];
      const avgTemp = yd.temps.length > 0
        ? yd.temps.reduce((a, b) => a + b, 0) / yd.temps.length
        : 0;
      const maxTemp = yd.maxTemps.length > 0 ? Math.max(...yd.maxTemps) : 0;
      const minTemp = yd.minTemps.length > 0 ? Math.min(...yd.minTemps) : 0;

      return {
        year: parseInt(year),
        avgTemp: Math.round(avgTemp * 10) / 10,
        maxTemp: Math.round(maxTemp * 10) / 10,
        minTemp: Math.round(minTemp * 10) / 10,
        totalPrecip: Math.round(yd.precip),
        totalRain: Math.round(yd.rain),
        totalSnow: Math.round(yd.snow * 10) / 10,
      };
    });

    // Calculate overall statistics
    const allTemps = Object.values(yearlyData).flatMap(y => y.temps);
    const allMaxTemps = Object.values(yearlyData).flatMap(y => y.maxTemps);
    const allMinTemps = Object.values(yearlyData).flatMap(y => y.minTemps);
    const totalPrecip = Object.values(yearlyData).reduce((sum, y) => sum + y.precip, 0);

    const avgTemp = allTemps.length > 0
      ? allTemps.reduce((a, b) => a + b, 0) / allTemps.length
      : 15;
    const recordHigh = allMaxTemps.length > 0 ? Math.max(...allMaxTemps) : 35;
    const recordLow = allMinTemps.length > 0 ? Math.min(...allMinTemps) : -10;
    const avgPrecip = totalPrecip / Math.max(years.length, 1);

    // Calculate temperature trend
    let tempTrend = 0;
    if (annualData.length >= 2) {
      const firstHalf = annualData.slice(0, Math.floor(annualData.length / 2));
      const secondHalf = annualData.slice(Math.floor(annualData.length / 2));
      const firstAvg = firstHalf.reduce((sum, d) => sum + d.avgTemp, 0) / firstHalf.length;
      const secondAvg = secondHalf.reduce((sum, d) => sum + d.avgTemp, 0) / secondHalf.length;
      tempTrend = Math.round((secondAvg - firstAvg) * 100) / 100;
    }

    // Monthly averages for the most recent complete year
    const monthlyData: { month: string; avgTemp: number; precip: number }[] = [];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Use last year's data for monthly breakdown
    const lastYear = years[years.length - 1];
    const monthlyTemps: Record<number, number[]> = {};
    const monthlyPrecip: Record<number, number> = {};

    for (let i = 0; i < data.daily.time.length; i++) {
      const date = data.daily.time[i];
      if (date.startsWith(lastYear)) {
        const month = parseInt(date.substring(5, 7)) - 1;
        if (!monthlyTemps[month]) {
          monthlyTemps[month] = [];
          monthlyPrecip[month] = 0;
        }
        if (data.daily.temperature_2m_mean[i] !== null) {
          monthlyTemps[month].push(data.daily.temperature_2m_mean[i]);
        }
        if (data.daily.precipitation_sum[i] !== null) {
          monthlyPrecip[month] += data.daily.precipitation_sum[i];
        }
      }
    }

    for (let m = 0; m < 12; m++) {
      const temps = monthlyTemps[m] || [];
      const avgMonthTemp = temps.length > 0
        ? temps.reduce((a, b) => a + b, 0) / temps.length
        : avgTemp;
      monthlyData.push({
        month: monthNames[m],
        avgTemp: Math.round(avgMonthTemp * 10) / 10,
        precip: Math.round(monthlyPrecip[m] || 0),
      });
    }

    const result = {
      location: locationName,
      coordinates: { lat, lon },
      summary: {
        avgTemp: Math.round(avgTemp * 10) / 10,
        recordHigh: Math.round(recordHigh * 10) / 10,
        recordLow: Math.round(recordLow * 10) / 10,
        avgPrecipitation: Math.round(avgPrecip),
        tempTrend: tempTrend,
        trendDirection: tempTrend > 0.1 ? "warming" : tempTrend < -0.1 ? "cooling" : "stable",
      },
      annualData,
      monthlyData,
      dataSource: "Open-Meteo Historical Archive",
      period: `${startDateStr} to ${endDateStr}`,
      lastUpdated: new Date().toISOString(),
    };

    console.log(`[CLIMATE] Real data received for ${locationName}`);
    return NextResponse.json(result);

  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      console.log("[CLIMATE] Request timeout, using mock data");
    } else {
      console.error("[CLIMATE] API error:", error);
    }
    return NextResponse.json(getMockClimateData(location));
  }
}
