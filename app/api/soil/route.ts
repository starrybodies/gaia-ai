import { NextRequest, NextResponse } from "next/server";
import { getMockSoilData } from "@/lib/soil";
import { valueSoilEcosystem, formatCurrency } from "@/lib/valuation";

// SoilGrids REST API - ISRIC World Soil Information
// Free API, no authentication required
// Docs: https://rest.isric.org/soilgrids/v2.0/docs

const SOILGRIDS_URL = "https://rest.isric.org/soilgrids/v2.0/properties/query";

// Soil property mappings
const SOIL_PROPERTIES = [
  "bdod",   // Bulk density
  "cec",    // Cation exchange capacity
  "cfvo",   // Coarse fragments
  "clay",   // Clay content
  "nitrogen", // Nitrogen
  "ocd",    // Organic carbon density
  "ocs",    // Organic carbon stock
  "phh2o",  // pH (H2O)
  "sand",   // Sand content
  "silt",   // Silt content
  "soc",    // Soil organic carbon
  "wv0010", // Water content at 10 kPa
  "wv0033", // Water content at 33 kPa
  "wv1500", // Water content at 1500 kPa
];

function getSoilHealthScore(data: any): number {
  // Calculate soil health score based on key indicators
  let score = 50; // Base score

  // Organic carbon (higher is better)
  if (data.soc) {
    const soc = data.soc / 10; // Convert to g/kg
    if (soc > 30) score += 15;
    else if (soc > 20) score += 10;
    else if (soc > 10) score += 5;
  }

  // pH (optimal range 6.0-7.5)
  if (data.phh2o) {
    const ph = data.phh2o / 10;
    if (ph >= 6.0 && ph <= 7.5) score += 15;
    else if (ph >= 5.5 && ph <= 8.0) score += 8;
  }

  // CEC (higher is better for nutrient retention)
  if (data.cec) {
    const cec = data.cec / 10;
    if (cec > 25) score += 10;
    else if (cec > 15) score += 5;
  }

  // Texture balance (loamy soils are ideal)
  if (data.clay && data.sand && data.silt) {
    const clay = data.clay / 10;
    const sand = data.sand / 10;
    const silt = data.silt / 10;
    // Loamy soil has balanced texture
    if (clay >= 15 && clay <= 35 && sand <= 55 && silt >= 25) {
      score += 10;
    }
  }

  return Math.min(100, Math.max(0, score));
}

function getSoilTexture(clay: number, sand: number, silt: number): string {
  // USDA soil texture classification
  if (clay >= 40) {
    if (silt >= 40) return "Silty clay";
    if (sand >= 45) return "Sandy clay";
    return "Clay";
  }
  if (clay >= 27 && clay < 40) {
    if (sand >= 20 && sand < 45) return "Clay loam";
    if (sand < 20) return "Silty clay loam";
    return "Sandy clay loam";
  }
  if (clay >= 7 && clay < 27) {
    if (silt >= 50) return "Silt loam";
    if (sand >= 52) return "Sandy loam";
    return "Loam";
  }
  if (silt >= 80) return "Silt";
  if (sand >= 85) return "Sand";
  return "Loamy sand";
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const location = searchParams.get("location") || "Salt Spring Island, BC";
  const lat = parseFloat(searchParams.get("lat") || "48.8167");
  const lon = parseFloat(searchParams.get("lon") || "-123.5000");

  try {
    // Query SoilGrids for multiple properties at 0-5cm depth
    const propertyParams = SOIL_PROPERTIES.map(p => `property=${p}`).join("&");
    const url = `${SOILGRIDS_URL}?lon=${lon}&lat=${lat}&depth=0-5cm&value=mean&${propertyParams}`;

    console.log(`[SOILGRIDS] Fetching soil data for ${location} (${lat}, ${lon})`);

    const response = await fetch(url, {
      headers: { "Accept": "application/json" },
      next: { revalidate: 86400 }, // Cache for 24 hours (soil data doesn't change often)
    });

    if (!response.ok) {
      console.log(`[SOILGRIDS] Error ${response.status}, using mock data`);
      return NextResponse.json(getMockSoilData(location, lat, lon));
    }

    const data = await response.json();

    // Extract values from response
    const properties: Record<string, number | null> = {};
    if (data.properties?.layers) {
      for (const layer of data.properties.layers) {
        const depth = layer.depths?.find((d: any) => d.label === "0-5cm");
        if (depth?.values?.mean !== undefined) {
          properties[layer.name] = depth.values.mean;
        }
      }
    }

    // If we got no data, fall back to mock
    if (Object.keys(properties).length === 0) {
      console.log(`[SOILGRIDS] No data for location, using mock data`);
      return NextResponse.json(getMockSoilData(location, lat, lon));
    }

    // Calculate derived values
    const clay = (properties.clay || 0) / 10; // g/kg to %
    const sand = (properties.sand || 0) / 10;
    const silt = (properties.silt || 0) / 10;
    const ph = (properties.phh2o || 65) / 10;
    const organicCarbon = (properties.soc || 0) / 10; // g/kg
    const nitrogen = (properties.nitrogen || 0) / 100; // cg/kg to g/kg
    const cec = (properties.cec || 0) / 10; // mmol(c)/kg

    const texture = getSoilTexture(clay, sand, silt);
    const healthScore = getSoilHealthScore(properties);
    const waterHolding = properties.wv0033 ? Math.round(properties.wv0033 / 10) : 30;
    const wiltingPoint = properties.wv1500 ? Math.round(properties.wv1500 / 10) : 15;

    const result = {
      location: {
        name: location,
        lat,
        lon,
      },
      properties: {
        soilType: getSoilType(texture),
        texture: texture,
        drainage: getDrainageClass(clay, sand) as "poor" | "moderate" | "good" | "excessive",
        pH: Math.round(ph * 10) / 10,
        organicMatter: Math.round(organicCarbon * 0.58 * 10) / 10, // Carbon to organic matter conversion
        nitrogen: Math.round(nitrogen * 10) / 10, // kg/ha estimate
        phosphorus: Math.round((cec * 0.3) * 10) / 10, // Estimate from CEC
        potassium: Math.round((cec * 1.2) * 10) / 10, // Estimate from CEC
      },
      health: {
        score: healthScore,
        rating: getHealthRating(healthScore),
        carbonContent: Math.round(organicCarbon * 3.5 * 10) / 10, // tonnes/ha estimate
        biodiversity: getBiodiversityRating(organicCarbon) as "low" | "moderate" | "high",
        erosionRisk: getErosionRisk(clay, sand, organicCarbon) as "low" | "moderate" | "high" | "severe",
      },
      moisture: {
        current: Math.round(waterHolding * 0.7), // Current estimate as % of field capacity
        fieldCapacity: waterHolding,
        wiltingPoint: wiltingPoint,
        status: getMoistureStatus(waterHolding * 0.7) as "dry" | "adequate" | "wet" | "saturated",
      },
      landUse: {
        type: getLandUseType(lat, lon),
        coverage: 75, // Estimate
        cropSuitability: getCropSuitability(ph, texture, organicCarbon),
      },
      // Natural Capital Valuation
      valuation: (() => {
        const analysisAreaHa = 31400; // ~10km radius
        const carbonTonnesPerHa = organicCarbon * 3.5; // tonnes/ha
        const erosionRisk = getErosionRisk(clay, sand, organicCarbon) as "low" | "moderate" | "high" | "severe";
        const soilVal = valueSoilEcosystem(analysisAreaHa, healthScore, carbonTonnesPerHa, erosionRisk);
        return {
          naturalCapital: {
            carbonStock: soilVal.carbonStock.value,
            carbonStockFormatted: formatCurrency(soilVal.carbonStock.value),
            carbonTonnes: soilVal.carbonStock.tonnes,
          },
          annualEcosystemServices: {
            total: soilVal.annualServices.total,
            totalFormatted: formatCurrency(soilVal.annualServices.total),
            breakdown: {
              foodProduction: { value: soilVal.annualServices.foodProduction, formatted: formatCurrency(soilVal.annualServices.foodProduction) },
              waterFiltration: { value: soilVal.annualServices.waterFiltration, formatted: formatCurrency(soilVal.annualServices.waterFiltration) },
              nutrientCycling: { value: soilVal.annualServices.nutrientCycling, formatted: formatCurrency(soilVal.annualServices.nutrientCycling) },
              erosionPrevention: { value: soilVal.annualServices.erosionPrevention, formatted: formatCurrency(soilVal.annualServices.erosionPrevention) },
              carbonStorage: { value: soilVal.annualServices.carbonStorage, formatted: formatCurrency(soilVal.annualServices.carbonStorage) },
            },
          },
          degradation: {
            annualCost: soilVal.degradationCost,
            annualCostFormatted: formatCurrency(soilVal.degradationCost),
            riskLevel: erosionRisk,
          },
          restoration: {
            potential: soilVal.restorationPotential,
            potentialFormatted: formatCurrency(soilVal.restorationPotential),
            healthGap: 100 - healthScore,
          },
          analysisArea: `${Math.round(analysisAreaHa / 100)} km² (~10km radius)`,
          methodology: "Natural Capital Protocol - Soil Ecosystem Services",
        };
      })(),
      lastUpdated: new Date().toISOString(),
    };

    console.log(`[SOILGRIDS] Real data received for ${location}`);
    return NextResponse.json(result);

  } catch (error) {
    console.error("SoilGrids API error:", error);
    return NextResponse.json(getMockSoilData(location, lat, lon));
  }
}

function generateRecommendations(data: Record<string, number | null>): string[] {
  const recs: string[] = [];

  const ph = (data.phh2o || 65) / 10;
  if (ph < 5.5) recs.push("Consider liming to raise soil pH");
  else if (ph > 8.0) recs.push("Add sulfur or organic matter to lower pH");

  const soc = (data.soc || 0) / 10;
  if (soc < 15) recs.push("Add organic matter to improve soil carbon");

  const clay = (data.clay || 0) / 10;
  if (clay > 45) recs.push("Add organic matter to improve clay soil structure");

  const sand = (data.sand || 0) / 10;
  if (sand > 70) recs.push("Add compost to improve water retention");

  if (recs.length === 0) recs.push("Soil conditions are generally favorable");

  return recs;
}

function getSoilType(texture: string): string {
  if (texture.includes("Clay")) return "Clay";
  if (texture.includes("Sand")) return "Sandy";
  if (texture.includes("Silt")) return "Silty";
  if (texture.includes("Loam")) return "Loam";
  return "Mixed";
}

function getDrainageClass(clay: number, sand: number): string {
  if (clay > 40) return "poor";
  if (sand > 70) return "excessive";
  if (clay > 25) return "moderate";
  return "good";
}

function getHealthRating(score: number): "poor" | "fair" | "good" | "excellent" {
  if (score < 30) return "poor";
  if (score < 50) return "fair";
  if (score < 75) return "good";
  return "excellent";
}

function getBiodiversityRating(organicCarbon: number): string {
  if (organicCarbon > 25) return "high";
  if (organicCarbon > 15) return "moderate";
  return "low";
}

function getErosionRisk(clay: number, sand: number, organicCarbon: number): string {
  if (sand > 70 && organicCarbon < 10) return "high";
  if (clay < 10 && organicCarbon < 15) return "moderate";
  if (organicCarbon > 25) return "low";
  return "moderate";
}

function getMoistureStatus(moisture: number): string {
  if (moisture < 15) return "dry";
  if (moisture < 30) return "adequate";
  if (moisture < 45) return "wet";
  return "saturated";
}

function getLandUseType(lat: number, lon: number): string {
  // Rough estimate based on latitude
  if (Math.abs(lat) > 60) return "tundra";
  if (Math.abs(lat) > 45) return "forest";
  if (Math.abs(lat) < 23.5) return "tropical";
  return "mixed";
}

function getCropSuitability(ph: number, texture: string, organicCarbon: number): string[] {
  const crops: string[] = [];

  if (ph >= 6.0 && ph <= 7.5) {
    crops.push("Vegetables", "Grains");
  }
  if (texture.includes("Loam")) {
    crops.push("Root crops", "Legumes");
  }
  if (organicCarbon > 20) {
    crops.push("Berries", "Perennials");
  }
  if (texture.includes("Sandy")) {
    crops.push("Carrots", "Potatoes");
  }

  return crops.length > 0 ? crops : ["Cover crops", "Pasture"];
}
