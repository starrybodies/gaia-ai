import type { DeforestationData } from "@/types/deforestation";

// Global forest statistics
export const GLOBAL_FOREST_STATS = {
  totalArea: 4.06, // billion hectares
  annualLoss: 10, // million hectares
  annualGain: 5, // million hectares
  netLoss: 5, // million hectares per year
};

// Generate mock deforestation data
export function getMockDeforestationData(
  locationName: string,
  lat: number,
  lon: number,
  country: string = "Canada"
): DeforestationData {
  const now = new Date();
  const currentYear = now.getFullYear();

  // BC/Pacific Northwest has high forest cover
  const isHighForest = lat > 45 && lon < -115;
  const baselineCover = isHighForest ? 82 : 45;
  const currentCover = baselineCover - (Math.random() * 5 + 2); // small loss

  // Generate historical data
  const history = [];
  for (let i = 24; i >= 0; i--) {
    const year = 2000 + i;
    const coverLoss = i * 0.15; // gradual loss
    history.push({
      year,
      coverPercent: Math.round((baselineCover - coverLoss) * 10) / 10,
      lossKm2: Math.round(50 + Math.random() * 100),
    });
  }

  // Recent alerts (mock)
  const alerts = [];
  for (let i = 0; i < 3; i++) {
    alerts.push({
      lat: lat + (Math.random() - 0.5) * 0.5,
      lon: lon + (Math.random() - 0.5) * 0.5,
      date: new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      area: Math.round(Math.random() * 50 + 5),
    });
  }

  const totalLoss = Math.round((baselineCover - currentCover) * 100); // km²
  const annualLoss = Math.round(totalLoss / 24);

  return {
    location: {
      name: locationName,
      lat,
      lon,
      country,
      region: "British Columbia",
    },
    forestCover: {
      current: Math.round(currentCover * 10) / 10,
      baseline: baselineCover,
      change: Math.round((currentCover - baselineCover) * 10) / 10,
      area: Math.round(currentCover * 50), // km² (scaled for demo)
      treeCount: Math.round(currentCover * 50 * 400), // ~400 trees per km²
    },
    loss: {
      total: totalLoss,
      annual: annualLoss,
      recentYear: Math.round(annualLoss * (0.8 + Math.random() * 0.4)),
      trend: "stable",
      primaryCauses: ["Logging", "Mountain Pine Beetle", "Wildfires", "Development"],
    },
    gain: {
      total: Math.round(totalLoss * 0.4),
      annual: Math.round(annualLoss * 0.4),
      netChange: Math.round(-totalLoss * 0.6),
    },
    alerts: {
      recent: alerts.length,
      highConfidence: Math.ceil(alerts.length * 0.7),
      locations: alerts,
    },
    carbon: {
      stored: Math.round(currentCover * 2.5), // Mt CO2
      emitted: Math.round(totalLoss * 0.05), // Mt CO2
      potential: Math.round(baselineCover * 2.5),
    },
    biodiversity: {
      speciesAtRisk: 47,
      protectedArea: 28,
      intactForest: Math.round(currentCover * 0.6),
    },
    history,
    lastUpdated: now.toISOString(),
  };
}

// Get forest health rating
export function getForestHealthRating(coverPercent: number, trend: string): string {
  if (coverPercent > 70 && trend !== "accelerating") return "Healthy";
  if (coverPercent > 50) return "Moderate Concern";
  if (coverPercent > 30) return "At Risk";
  return "Critical";
}

// Get trend color
export function getTrendColor(trend: string): string {
  if (trend === "decreasing") return "blue";
  if (trend === "stable") return "white";
  return "orange";
}
