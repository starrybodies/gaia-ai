// OpenAQ API Response Types
export interface OpenAQMeasurement {
  parameter: string; // pm25, pm10, o3, no2, so2, co
  value: number;
  lastUpdated: string;
  unit: string;
  sourceName?: string;
  averagingPeriod?: {
    value: number;
    unit: string;
  };
}

export interface OpenAQLocation {
  id: number;
  name: string;
  locality?: string;
  country: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  measurements: OpenAQMeasurement[];
  lastUpdated: string;
}

// Simplified Air Quality Data for UI
export interface SimpleAirQuality {
  location: string;
  city: string;
  country: string;
  coordinates: {
    lat: number;
    lon: number;
  };
  measurements: {
    pm25?: number;
    pm10?: number;
    o3?: number;
    no2?: number;
    so2?: number;
    co?: number;
  };
  aqi: number; // Calculated Air Quality Index
  aqiLevel: string; // Good, Moderate, Unhealthy, etc.
  lastUpdated: string;
}

// AQI Calculation Helpers
export interface AQIBreakpoint {
  low: number;
  high: number;
  aqiLow: number;
  aqiHigh: number;
  level: string;
  color: string;
}
