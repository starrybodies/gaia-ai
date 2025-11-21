// NOAA Ocean Data Types

// NDBC (National Data Buoy Center) Station Data
export interface NDBCStation {
  id: string;
  name: string;
  lat: number;
  lon: number;
  type: "buoy" | "ship" | "coastal";
}

export interface NDBCObservation {
  timestamp: string;
  windSpeed?: number; // m/s
  windDirection?: number; // degrees
  windGust?: number; // m/s
  waveHeight?: number; // meters
  dominantWavePeriod?: number; // seconds
  averageWavePeriod?: number; // seconds
  waveDirection?: number; // degrees
  seaTemperature?: number; // Celsius
  airTemperature?: number; // Celsius
  pressure?: number; // hPa
  visibility?: number; // nautical miles
  waterLevel?: number; // meters
}

// CO-OPS (Center for Operational Oceanographic Products) Tide Data
export interface TidePrediction {
  timestamp: string;
  height: number; // meters
  type: "H" | "L"; // High or Low
}

export interface TideStation {
  id: string;
  name: string;
  lat: number;
  lon: number;
  state?: string;
}

// Simplified Ocean Data for UI
export interface OceanData {
  station: {
    id: string;
    name: string;
    lat: number;
    lon: number;
    type: string;
  };
  current: {
    seaTemperature?: number;
    airTemperature?: number;
    waveHeight?: number;
    wavePeriod?: number;
    windSpeed?: number;
    windDirection?: number;
    pressure?: number;
    visibility?: number;
  };
  tides?: {
    next: TidePrediction[];
    current: "rising" | "falling" | "high" | "low";
  };
  history: {
    timestamp: string;
    seaTemperature?: number;
    waveHeight?: number;
  }[];
  lastUpdated: string;
}

// Sea condition descriptors
export type SeaState =
  | "Calm"
  | "Smooth"
  | "Slight"
  | "Moderate"
  | "Rough"
  | "Very Rough"
  | "High"
  | "Very High"
  | "Phenomenal";
