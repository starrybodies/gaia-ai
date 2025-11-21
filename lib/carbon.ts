import type { CarbonData } from "@/types/carbon";

// Current global atmospheric CO2 (updated periodically)
export const GLOBAL_CO2_PPM = 421.5; // As of late 2024
export const PRE_INDUSTRIAL_CO2 = 280;

// Regional emission factors (tonnes CO2 per capita, approximate)
export const REGIONAL_EMISSIONS: Record<string, number> = {
  "North America": 14.5,
  "Europe": 6.8,
  "Asia": 4.5,
  "Oceania": 15.2,
  "South America": 2.3,
  "Africa": 1.1,
  "Global Average": 4.7,
};

// Generate mock carbon data for a location
export function getMockCarbonData(
  locationName: string,
  lat: number,
  lon: number,
  country: string = "Canada"
): CarbonData {
  const now = new Date();
  const currentYear = now.getFullYear();

  // Determine region based on coordinates
  let region = "North America";
  if (lon > -30 && lon < 60) region = "Europe";
  else if (lon > 60 && lon < 180) region = "Asia";
  else if (lat < -10 && lon > 100) region = "Oceania";
  else if (lat < 0 && lon < -30) region = "South America";
  else if (lat < 35 && lon > -20 && lon < 55) region = "Africa";

  const regionalEmissions = REGIONAL_EMISSIONS[region] || 4.7;

  // Generate historical data (last 10 years)
  const history = [];
  for (let i = 10; i >= 0; i--) {
    const year = currentYear - i;
    history.push({
      year,
      co2: GLOBAL_CO2_PPM - i * 2.5, // ~2.5 ppm increase per year
      emissions: regionalEmissions * (1 + (10 - i) * 0.01), // slight increase
    });
  }

  // Forest coverage estimate based on latitude (rough)
  const forestFactor = lat > 45 ? 0.6 : lat > 30 ? 0.3 : lat > 0 ? 0.4 : 0.5;

  return {
    location: {
      name: locationName,
      lat,
      lon,
      country,
      region,
    },
    emissions: {
      co2: Math.round(regionalEmissions * 10) / 10,
      methane: Math.round(regionalEmissions * 0.15 * 10) / 10,
      totalGHG: Math.round(regionalEmissions * 1.2 * 10) / 10,
      trend: regionalEmissions > 10 ? "stable" : "decreasing",
      changePercent: Math.round((Math.random() * 6 - 3) * 10) / 10,
    },
    sequestration: {
      forestCarbon: Math.round(forestFactor * 150 * 10) / 10,
      soilCarbon: Math.round(forestFactor * 80 * 10) / 10,
      oceanCarbon: Math.round(25 * 10) / 10, // coastal areas
      netBalance: Math.round((regionalEmissions - forestFactor * 8) * 10) / 10,
    },
    atmosphere: {
      co2ppm: GLOBAL_CO2_PPM,
      ch4ppb: 1920, // current methane levels
      globalAvgCO2: GLOBAL_CO2_PPM,
    },
    history,
    lastUpdated: now.toISOString(),
  };
}

// Get emission rating
export function getEmissionRating(co2PerCapita: number): string {
  if (co2PerCapita < 2) return "Very Low";
  if (co2PerCapita < 5) return "Low";
  if (co2PerCapita < 10) return "Moderate";
  if (co2PerCapita < 15) return "High";
  return "Very High";
}

// Get trend icon
export function getTrendSymbol(trend: string): string {
  if (trend === "increasing") return "↑";
  if (trend === "decreasing") return "↓";
  return "→";
}
