import type { OpenAQLocation, SimpleAirQuality, AQIBreakpoint } from "@/types/airquality";

// US EPA AQI Breakpoints for PM2.5
const PM25_BREAKPOINTS: AQIBreakpoint[] = [
  { low: 0, high: 12, aqiLow: 0, aqiHigh: 50, level: "Good", color: "blue" },
  { low: 12.1, high: 35.4, aqiLow: 51, aqiHigh: 100, level: "Moderate", color: "white" },
  { low: 35.5, high: 55.4, aqiLow: 101, aqiHigh: 150, level: "Unhealthy for Sensitive", color: "orange" },
  { low: 55.5, high: 150.4, aqiLow: 151, aqiHigh: 200, level: "Unhealthy", color: "orange" },
  { low: 150.5, high: 250.4, aqiLow: 201, aqiHigh: 300, level: "Very Unhealthy", color: "orange" },
  { low: 250.5, high: 500, aqiLow: 301, aqiHigh: 500, level: "Hazardous", color: "orange" },
];

// Calculate AQI from PM2.5 concentration
export function calculateAQI(pm25: number): number {
  for (const bp of PM25_BREAKPOINTS) {
    if (pm25 >= bp.low && pm25 <= bp.high) {
      return Math.round(
        ((bp.aqiHigh - bp.aqiLow) / (bp.high - bp.low)) * (pm25 - bp.low) + bp.aqiLow
      );
    }
  }
  return pm25 > 500 ? 500 : 0;
}

// Get AQI level description
export function getAQILevel(aqi: number): string {
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Moderate";
  if (aqi <= 150) return "Unhealthy for Sensitive Groups";
  if (aqi <= 200) return "Unhealthy";
  if (aqi <= 300) return "Very Unhealthy";
  return "Hazardous";
}

// Transform OpenAQ data to simplified format
export function transformAirQualityData(data: OpenAQLocation): SimpleAirQuality {
  const measurements: SimpleAirQuality["measurements"] = {};

  data.measurements.forEach((m) => {
    const param = m.parameter.toLowerCase();
    if (["pm25", "pm10", "o3", "no2", "so2", "co"].includes(param)) {
      measurements[param as keyof typeof measurements] = m.value;
    }
  });

  // Calculate AQI from PM2.5 if available
  const pm25 = measurements.pm25 || 0;
  const aqi = pm25 > 0 ? calculateAQI(pm25) : 0;

  return {
    location: data.name,
    city: data.locality || data.name,
    country: data.country,
    coordinates: {
      lat: data.coordinates.latitude,
      lon: data.coordinates.longitude,
    },
    measurements,
    aqi,
    aqiLevel: getAQILevel(aqi),
    lastUpdated: data.lastUpdated,
  };
}
