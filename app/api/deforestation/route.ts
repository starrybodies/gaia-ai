import { NextRequest, NextResponse } from "next/server";
import { getMockDeforestationData } from "@/lib/deforestation";
import { valueForestEcosystem, valueCarbonStorage, formatCurrency } from "@/lib/valuation";

// Global Forest Watch data - aggregated country/regional statistics
// Note: Real-time GLAD alerts require API key
// Using pre-compiled regional statistics from GFW annual reports

// Forest cover and loss data by country (source: Global Forest Watch 2023)
const FOREST_DATA: Record<string, {
  coverPercent: number;
  lossRate: number; // % per year
  gainRate: number;
  primaryForest: number; // % of total
  protectedPercent: number;
  forestType: string;
}> = {
  "Canada": { coverPercent: 38.2, lossRate: 0.28, gainRate: 0.15, primaryForest: 25, protectedPercent: 12, forestType: "Boreal" },
  "United States": { coverPercent: 33.9, lossRate: 0.24, gainRate: 0.18, primaryForest: 8, protectedPercent: 15, forestType: "Mixed" },
  "Brazil": { coverPercent: 59.4, lossRate: 1.1, gainRate: 0.3, primaryForest: 45, protectedPercent: 28, forestType: "Tropical rainforest" },
  "Indonesia": { coverPercent: 49.1, lossRate: 0.75, gainRate: 0.2, primaryForest: 35, protectedPercent: 15, forestType: "Tropical rainforest" },
  "Russia": { coverPercent: 49.8, lossRate: 0.15, gainRate: 0.08, primaryForest: 30, protectedPercent: 5, forestType: "Boreal/Taiga" },
  "Australia": { coverPercent: 16.3, lossRate: 0.45, gainRate: 0.1, primaryForest: 5, protectedPercent: 18, forestType: "Eucalyptus woodland" },
  "Germany": { coverPercent: 32.7, lossRate: 0.1, gainRate: 0.12, primaryForest: 2, protectedPercent: 35, forestType: "Temperate deciduous" },
  "Japan": { coverPercent: 68.5, lossRate: 0.05, gainRate: 0.08, primaryForest: 12, protectedPercent: 20, forestType: "Temperate" },
  "India": { coverPercent: 24.3, lossRate: 0.15, gainRate: 0.2, primaryForest: 3, protectedPercent: 8, forestType: "Mixed tropical/subtropical" },
  "China": { coverPercent: 22.9, lossRate: 0.12, gainRate: 0.45, primaryForest: 2, protectedPercent: 15, forestType: "Mixed" },
};

// Global deforestation statistics
const GLOBAL_STATS = {
  totalForestArea: 4060, // million hectares
  annualLoss: 10, // million hectares/year (net)
  primaryForestLoss: 3.7, // million hectares/year
  tropicalLoss: 6.3, // million hectares/year
};

// Estimate local forest characteristics based on coordinates
function estimateLocalForest(lat: number, lon: number, country: string) {
  const countryData = FOREST_DATA[country] || {
    coverPercent: 30,
    lossRate: 0.3,
    gainRate: 0.15,
    primaryForest: 10,
    protectedPercent: 10,
    forestType: "Mixed",
  };

  // Adjust based on latitude (biome)
  let biome = "Temperate";
  let carbonDensity = 150; // tonnes C/hectare
  let biodiversityIndex = 0.6;

  if (Math.abs(lat) < 23.5) {
    biome = "Tropical";
    carbonDensity = 200;
    biodiversityIndex = 0.9;
  } else if (Math.abs(lat) > 55) {
    biome = "Boreal";
    carbonDensity = 80;
    biodiversityIndex = 0.4;
  } else if (Math.abs(lat) > 45) {
    biome = "Temperate/Boreal transition";
    carbonDensity = 120;
    biodiversityIndex = 0.5;
  }

  return { ...countryData, biome, carbonDensity, biodiversityIndex };
}

// Detect country from coordinates using reverse geocoding
async function detectCountry(lat: number, lon: number): Promise<string> {
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
      if (data.results?.[0]?.country) {
        return data.results[0].country;
      }
    }
  } catch {}

  // Fallback: guess country from coordinates
  // Canada - includes BC coastal areas (lon < -114 is west of Alberta)
  if (lat > 41 && lat < 84 && lon < -52 && lon > -141) {
    // Check if it's likely US instead (lower 48 states)
    // BC coast is west of -114 and above 48.5
    if (lon < -114 && lat > 48) return "Canada"; // BC, Yukon, NWT
    if (lat > 49 && lon > -114) return "Canada"; // Rest of Canada
    // Alaska check
    if (lon < -140 || (lon < -130 && lat > 54)) return "United States"; // Alaska
    // US lower 48
    if (lat < 49 && lat > 24 && lon > -125 && lon < -66) return "United States";
    return "Canada"; // Default for ambiguous northern areas
  }
  if (lat > 24 && lat < 50 && lon > -125 && lon < -66) return "United States";
  if (lat < 5 && lat > -34 && lon > -74 && lon < -34) return "Brazil";
  if (lat > 41 && lat < 82 && lon > 19 && lon < 180) return "Russia";
  if (lat > 18 && lat < 54 && lon > 73 && lon < 135) return "China";
  if (lat > -44 && lat < -10 && lon > 113 && lon < 154) return "Australia";
  if (lat > -11 && lat < 6 && lon > 95 && lon < 141) return "Indonesia";
  if (lat > 24 && lat < 46 && lon > 123 && lon < 146) return "Japan";
  if (lat > 6 && lat < 36 && lon > 68 && lon < 98) return "India";
  if (lat > 47 && lat < 55 && lon > 5 && lon < 15) return "Germany";

  return "Unknown";
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const location = searchParams.get("location") || "Salt Spring Island, BC";
  const lat = parseFloat(searchParams.get("lat") || "48.8167");
  const lon = parseFloat(searchParams.get("lon") || "-123.5000");
  let country = searchParams.get("country") || "";

  try {
    // Auto-detect country if not provided
    if (!country || country === "Unknown") {
      country = await detectCountry(lat, lon);
    }

    console.log(`[GFW] Calculating forest data for ${location} (${lat}, ${lon}) in ${country}`);

    // Get forest characteristics for this location
    const forest = estimateLocalForest(lat, lon, country);

    // Calculate area estimates (approximate for a 50km radius)
    const radiusKm = 50;
    const areaHectares = Math.PI * radiusKm * radiusKm * 100; // 785,000 ha approx
    const forestAreaHa = Math.round(areaHectares * (forest.coverPercent / 100));
    const annualLossHa = Math.round(forestAreaHa * (forest.lossRate / 100));
    const annualGainHa = Math.round(forestAreaHa * (forest.gainRate / 100));
    const netChange = annualGainHa - annualLossHa;

    // Generate recent alerts (simulated based on loss rate)
    const alertsPerYear = Math.round(annualLossHa / 50); // ~50ha per alert on average
    const recentAlerts = Math.round(alertsPerYear * (30 / 365)); // Last 30 days

    // Calculate carbon impact
    const carbonLost = Math.round(annualLossHa * forest.carbonDensity * 3.67); // CO2 equivalent
    const carbonStored = Math.round(forestAreaHa * forest.carbonDensity * 3.67);

    // Convert hectares to km²
    const forestAreaKm2 = Math.round(forestAreaHa / 100);
    const annualLossKm2 = Math.round(annualLossHa / 100);
    const annualGainKm2 = Math.round(annualGainHa / 100);
    const totalLossKm2 = annualLossKm2 * 23; // Simulated total since 2000
    const totalGainKm2 = annualGainKm2 * 23;
    const netChangeKm2 = totalGainKm2 - totalLossKm2;

    // Generate history data (last 15 years)
    const currentYear = new Date().getFullYear();
    const history = [];
    for (let i = 14; i >= 0; i--) {
      const year = currentYear - i;
      // Slight decrease over time
      const coverPercent = Math.round((forest.coverPercent + (i * 0.1)) * 10) / 10;
      const lossKm2 = Math.round(annualLossKm2 * (1 + i * 0.02));
      history.push({ year, coverPercent, lossKm2 });
    }

    const result = {
      location: {
        name: location,
        lat,
        lon,
        country: country,
        region: getRegionName(country),
      },
      forestCover: {
        current: forest.coverPercent,
        baseline: Math.round((forest.coverPercent + 3) * 10) / 10, // Estimated 2000 baseline
        change: -3, // Simulated change since 2000
        area: forestAreaKm2,
        treeCount: Math.round(forestAreaKm2 * 500000), // Estimate ~500k trees/km²
      },
      loss: {
        total: totalLossKm2,
        annual: annualLossKm2,
        recentYear: annualLossKm2,
        trend: (netChange >= 0 ? "stable" : forest.lossRate > 0.5 ? "accelerating" : "decreasing") as "accelerating" | "stable" | "decreasing",
        primaryCauses: getPrimaryCauses(country, forest.biome),
      },
      gain: {
        total: totalGainKm2,
        annual: annualGainKm2,
        netChange: netChangeKm2,
      },
      alerts: {
        recent: recentAlerts,
        highConfidence: Math.round(recentAlerts * 0.7),
        locations: [],
      },
      carbon: {
        stored: Math.round(carbonStored / 1000000), // Convert to Mt CO2
        emitted: Math.round(carbonLost * 23 / 1000000), // Total emitted since 2000 in Mt
        potential: Math.round(carbonStored * 1.5 / 1000000),
      },
      biodiversity: {
        speciesAtRisk: Math.round(forest.biodiversityIndex * 100),
        protectedArea: forest.protectedPercent,
        intactForest: forest.primaryForest,
      },
      history,
      // Natural Capital Valuation
      valuation: (() => {
        const forestType = forest.biome.toLowerCase().includes('tropical') ? 'tropical' :
                          forest.biome.toLowerCase().includes('boreal') ? 'boreal' : 'temperate';
        const forestVal = valueForestEcosystem(forestAreaHa, forestType, carbonStored / 3.67, forest.protectedPercent);
        const annualLossValue = Math.round((annualLossHa / forestAreaHa) * forestVal.annualServices.total);
        return {
          naturalCapital: {
            total: forestVal.totalNaturalCapital,
            totalFormatted: formatCurrency(forestVal.totalNaturalCapital),
            carbonStockValue: forestVal.carbonStock.value,
            carbonStockFormatted: formatCurrency(forestVal.carbonStock.value),
          },
          annualEcosystemServices: {
            total: forestVal.annualServices.total,
            totalFormatted: formatCurrency(forestVal.annualServices.total),
            breakdown: {
              carbonSequestration: { value: forestVal.annualServices.carbonSequestration, formatted: formatCurrency(forestVal.annualServices.carbonSequestration) },
              waterRegulation: { value: forestVal.annualServices.waterRegulation, formatted: formatCurrency(forestVal.annualServices.waterRegulation) },
              biodiversityHabitat: { value: forestVal.annualServices.biodiversityHabitat, formatted: formatCurrency(forestVal.annualServices.biodiversityHabitat) },
              erosionControl: { value: forestVal.annualServices.erosionControl, formatted: formatCurrency(forestVal.annualServices.erosionControl) },
              climateRegulation: { value: forestVal.annualServices.climateRegulation, formatted: formatCurrency(forestVal.annualServices.climateRegulation) },
              recreation: { value: forestVal.annualServices.recreationTourism, formatted: formatCurrency(forestVal.annualServices.recreationTourism) },
            },
          },
          deforestationCost: {
            annualLoss: annualLossValue,
            annualLossFormatted: formatCurrency(annualLossValue),
            since2000: annualLossValue * 23,
            since2000Formatted: formatCurrency(annualLossValue * 23),
            carbonEmissionsCost: valueCarbonStorage(carbonLost * 23),
            carbonEmissionsCostFormatted: formatCurrency(valueCarbonStorage(carbonLost * 23)),
          },
          restorationPotential: {
            areaHa: Math.round(forestAreaHa * (1 - forest.coverPercent / 100) * 0.3), // 30% of non-forest could be restored
            valueGain: Math.round(forestAreaHa * 0.1 * 1200), // $1200/ha/yr services from restoration
            valueGainFormatted: formatCurrency(Math.round(forestAreaHa * 0.1 * 1200)),
          },
          methodology: "TEEB Forest Ecosystem Services Valuation Framework",
          carbonPrice: "$50/tonne CO2 (voluntary market)",
        };
      })(),
      lastUpdated: new Date().toISOString(),
    };

    console.log(`[GFW] Forest data calculated for ${location}: ${forestAreaHa} ha forest, ${forest.lossRate}% loss rate`);
    return NextResponse.json(result);

  } catch (error) {
    console.error("Forest API error:", error);
    return NextResponse.json(getMockDeforestationData(location, lat, lon, country));
  }
}

function getPrimaryCauses(country: string, biome: string): string[] {
  const causes: Record<string, string[]> = {
    "Canada": ["Wildfires", "Logging", "Mining", "Infrastructure"],
    "Brazil": ["Agriculture expansion", "Cattle ranching", "Illegal logging", "Mining"],
    "Indonesia": ["Palm oil plantations", "Pulpwood", "Mining", "Agriculture"],
    "Russia": ["Logging", "Wildfires", "Mining"],
    "United States": ["Wildfires", "Development", "Agriculture", "Logging"],
    "Australia": ["Wildfires", "Agriculture", "Urban expansion"],
  };

  if (biome === "Tropical") {
    return causes[country] || ["Agriculture expansion", "Logging", "Infrastructure"];
  }
  if (biome === "Boreal") {
    return causes[country] || ["Logging", "Wildfires", "Mining"];
  }
  return causes[country] || ["Development", "Agriculture", "Logging"];
}

function getCountryForestRank(country: string): string {
  const topForested = ["Russia", "Brazil", "Canada", "United States", "China", "Australia", "Indonesia"];
  const rank = topForested.indexOf(country) + 1;
  if (rank > 0) return `#${rank} by forest area`;
  return "Outside top 10";
}

function getRegionName(country: string): string {
  const regions: Record<string, string> = {
    "Canada": "North America",
    "United States": "North America",
    "Brazil": "South America",
    "Russia": "Eurasia",
    "China": "East Asia",
    "Australia": "Oceania",
    "Indonesia": "Southeast Asia",
    "Germany": "Europe",
    "Japan": "East Asia",
    "India": "South Asia",
  };
  return regions[country] || "Global";
}
