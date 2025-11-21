// WAQI API Response Types (replacing deprecated OpenAQ)
export interface AirQualityData {
  location: {
    name: string;
    coordinates: {
      lat: number;
      lon: number;
    };
  };
  current: {
    aqi: number;
    level: string;
    description: string;
    dominantPollutant: string;
    color: string;
  };
  pollutants: {
    pm25: PollutantValue;
    pm10: PollutantValue;
    o3: PollutantValue;
    no2: PollutantValue;
    so2: PollutantValue;
    co: PollutantValue;
  };
  weather?: {
    temperature?: number;
    humidity?: number;
    pressure?: number;
    wind?: number;
  };
  forecast: any | null;
  attribution: string;
  lastUpdated: string;
}

export interface PollutantValue {
  value: number;
  unit: string;
  whoLimit: number;
}

// Legacy types for backwards compatibility
export interface OpenAQMeasurement {
  parameter: string;
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

// AQI Calculation Helpers
export interface AQIBreakpoint {
  low: number;
  high: number;
  aqiLow: number;
  aqiHigh: number;
  level: string;
  color: string;
}
