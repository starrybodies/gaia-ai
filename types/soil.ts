// Soil & Agriculture Data Types

export interface SoilData {
  location: {
    name: string;
    lat: number;
    lon: number;
  };
  properties: {
    soilType: string; // e.g., "Loam", "Clay", "Sandy"
    texture: string;
    drainage: "poor" | "moderate" | "good" | "excessive";
    pH: number; // 0-14 scale
    organicMatter: number; // percentage
    nitrogen: number; // kg/ha
    phosphorus: number; // kg/ha
    potassium: number; // kg/ha
  };
  health: {
    score: number; // 0-100
    rating: "poor" | "fair" | "good" | "excellent";
    carbonContent: number; // tonnes/ha
    biodiversity: "low" | "moderate" | "high";
    erosionRisk: "low" | "moderate" | "high" | "severe";
  };
  moisture: {
    current: number; // percentage
    fieldCapacity: number; // percentage
    wiltingPoint: number; // percentage
    status: "dry" | "adequate" | "wet" | "saturated";
  };
  landUse: {
    type: string; // "forest", "agriculture", "urban", etc.
    coverage: number; // percentage of area
    cropSuitability: string[];
  };
  lastUpdated: string;
}

export interface SoilLayer {
  depth: string; // e.g., "0-30cm"
  texture: string;
  organicCarbon: number;
  pH: number;
}
