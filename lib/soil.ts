import type { SoilData } from "@/types/soil";

// Soil type descriptions
export const SOIL_TYPES = {
  "Loam": "Balanced mix of sand, silt, and clay - ideal for most plants",
  "Clay": "Fine particles, retains water well, can be heavy",
  "Sandy": "Large particles, drains quickly, low nutrient retention",
  "Silt": "Medium particles, smooth texture, good fertility",
  "Peat": "High organic matter, acidic, excellent water retention",
  "Chalk": "Calcium-rich, alkaline, free draining",
};

// Generate mock soil data
export function getMockSoilData(
  locationName: string,
  lat: number,
  lon: number
): SoilData {
  const now = new Date();

  // Determine soil type based on location (simplified)
  let soilType = "Loam";
  let pH = 6.5;
  let organicMatter = 4.5;

  // Pacific Northwest / temperate rainforest tends to have:
  if (lat > 45 && lon < -120) {
    soilType = "Loam";
    pH = 5.8; // slightly acidic
    organicMatter = 6.2; // high organic matter
  }

  // Seasonal moisture variation
  const month = now.getMonth();
  const moistureFactor = Math.cos((month / 12) * 2 * Math.PI) * 0.3 + 0.5;

  // Calculate health score
  const healthScore = Math.round(
    (organicMatter * 8 + (7 - Math.abs(pH - 6.5)) * 10 + moistureFactor * 20) + 30
  );

  return {
    location: {
      name: locationName,
      lat,
      lon,
    },
    properties: {
      soilType,
      texture: "Fine Loamy",
      drainage: "good",
      pH: Math.round(pH * 10) / 10,
      organicMatter: Math.round(organicMatter * 10) / 10,
      nitrogen: Math.round(120 + Math.random() * 60),
      phosphorus: Math.round(25 + Math.random() * 20),
      potassium: Math.round(180 + Math.random() * 80),
    },
    health: {
      score: Math.min(100, Math.max(0, healthScore)),
      rating: healthScore > 75 ? "excellent" : healthScore > 50 ? "good" : healthScore > 25 ? "fair" : "poor",
      carbonContent: Math.round((organicMatter * 12) * 10) / 10, // tonnes/ha
      biodiversity: organicMatter > 5 ? "high" : organicMatter > 3 ? "moderate" : "low",
      erosionRisk: "low",
    },
    moisture: {
      current: Math.round(moistureFactor * 60 + 20),
      fieldCapacity: 45,
      wiltingPoint: 15,
      status: moistureFactor > 0.6 ? "wet" : moistureFactor > 0.3 ? "adequate" : "dry",
    },
    landUse: {
      type: "Mixed Forest",
      coverage: 78,
      cropSuitability: ["Berries", "Apples", "Leafy Greens", "Root Vegetables"],
    },
    lastUpdated: now.toISOString(),
  };
}

// Get pH description
export function getPHDescription(pH: number): string {
  if (pH < 5.5) return "Strongly Acidic";
  if (pH < 6.0) return "Moderately Acidic";
  if (pH < 6.5) return "Slightly Acidic";
  if (pH < 7.5) return "Neutral";
  if (pH < 8.0) return "Slightly Alkaline";
  return "Alkaline";
}

// Get soil health color
export function getSoilHealthColor(score: number): string {
  if (score >= 75) return "blue";
  if (score >= 50) return "white";
  return "orange";
}
