// Deforestation & Forest Cover Types

export interface DeforestationData {
  location: {
    name: string;
    lat: number;
    lon: number;
    country: string;
    region?: string;
  };
  forestCover: {
    current: number; // percentage
    baseline: number; // percentage (year 2000)
    change: number; // percentage points
    area: number; // km²
    treeCount?: number; // estimated
  };
  loss: {
    total: number; // km² since baseline
    annual: number; // km²/year average
    recentYear: number; // km² most recent year
    trend: "accelerating" | "stable" | "decreasing";
    primaryCauses: string[];
  };
  gain: {
    total: number; // km² reforested
    annual: number; // km²/year
    netChange: number; // gain - loss
  };
  alerts: {
    recent: number; // alerts in last 30 days
    highConfidence: number;
    locations: {
      lat: number;
      lon: number;
      date: string;
      area: number; // hectares
    }[];
  };
  carbon: {
    stored: number; // Mt CO2
    emitted: number; // Mt CO2 from deforestation
    potential: number; // Mt CO2 if fully forested
  };
  biodiversity: {
    speciesAtRisk: number;
    protectedArea: number; // percentage
    intactForest: number; // percentage
  };
  history: {
    year: number;
    coverPercent: number;
    lossKm2: number;
  }[];
  lastUpdated: string;
}

export interface ForestAlert {
  id: string;
  lat: number;
  lon: number;
  date: string;
  confidence: "low" | "medium" | "high";
  area: number; // hectares
  type: "deforestation" | "degradation" | "fire";
}
