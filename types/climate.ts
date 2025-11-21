// NOAA Climate Data Online (CDO) API Types

export interface NOAADataPoint {
  date: string;
  datatype: string; // TMAX, TMIN, PRCP, SNOW, etc.
  station: string;
  attributes: string;
  value: number; // tenths of degrees C or tenths of mm
}

export interface NOAAResponse {
  metadata: {
    resultset: {
      offset: number;
      count: number;
      limit: number;
    };
  };
  results: NOAADataPoint[];
}

export interface NOAALocation {
  id: string;
  name: string;
  datacoverage: number;
  mindate: string;
  maxdate: string;
}

// Simplified Climate Data for UI
export interface ClimateData {
  location: string;
  locationId: string;
  startDate: string;
  endDate: string;
  timeSeries: {
    date: string;
    tempMax?: number; // Celsius
    tempMin?: number; // Celsius
    tempAvg?: number; // Celsius
    precipitation?: number; // mm
    snow?: number; // mm
  }[];
  summary: {
    avgTempMax: number;
    avgTempMin: number;
    totalPrecipitation: number;
    dataPoints: number;
  };
}

// Data type codes
export type NOAADataType =
  | "TMAX" // Max temperature
  | "TMIN" // Min temperature
  | "TAVG" // Average temperature
  | "PRCP" // Precipitation
  | "SNOW" // Snowfall
  | "SNWD"; // Snow depth
