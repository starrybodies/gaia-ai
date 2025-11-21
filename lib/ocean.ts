import type { OceanData, SeaState } from "@/types/ocean";

// Get sea state description based on wave height (Douglas Scale)
export function getSeaState(waveHeight: number): SeaState {
  if (waveHeight < 0.1) return "Calm";
  if (waveHeight < 0.5) return "Smooth";
  if (waveHeight < 1.25) return "Slight";
  if (waveHeight < 2.5) return "Moderate";
  if (waveHeight < 4) return "Rough";
  if (waveHeight < 6) return "Very Rough";
  if (waveHeight < 9) return "High";
  if (waveHeight < 14) return "Very High";
  return "Phenomenal";
}

// Get wind direction as compass point
export function getWindDirection(degrees: number): string {
  const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}

// Convert Celsius to Fahrenheit
export function celsiusToFahrenheit(celsius: number): number {
  return celsius * 9/5 + 32;
}

// Convert meters to feet
export function metersToFeet(meters: number): number {
  return meters * 3.28084;
}

// Convert m/s to knots
export function msToKnots(ms: number): number {
  return ms * 1.94384;
}

// Popular NOAA buoy stations
export const POPULAR_STATIONS = [
  { id: "46237", name: "San Francisco Bar", lat: 37.786, lon: -122.634 },
  { id: "44013", name: "Boston", lat: 42.346, lon: -70.651 },
  { id: "41009", name: "Canaveral", lat: 28.508, lon: -80.185 },
  { id: "46025", name: "Santa Monica Basin", lat: 33.749, lon: -119.053 },
  { id: "44025", name: "Long Island", lat: 40.251, lon: -73.164 },
  { id: "46026", name: "San Francisco", lat: 37.759, lon: -122.833 },
  { id: "41047", name: "Cape Hatteras", lat: 33.848, lon: -75.998 },
  { id: "46029", name: "Columbia River Bar", lat: 46.163, lon: -124.514 },
];

// Generate mock ocean data for demo mode
export function getMockOceanData(stationId: string): OceanData {
  const station = POPULAR_STATIONS.find(s => s.id === stationId) || POPULAR_STATIONS[0];

  // Generate realistic mock data
  const now = new Date();
  const baseTemp = 15 + Math.sin((now.getMonth() / 12) * 2 * Math.PI) * 5; // Seasonal variation
  const waveVariation = Math.random() * 2;

  // Generate 24 hours of history
  const history = [];
  for (let i = 24; i >= 0; i--) {
    const historyTime = new Date(now.getTime() - i * 60 * 60 * 1000);
    history.push({
      timestamp: historyTime.toISOString(),
      seaTemperature: baseTemp + (Math.random() * 2 - 1),
      waveHeight: 1.5 + Math.sin(i / 6) * 0.5 + waveVariation,
    });
  }

  // Generate next 4 tide predictions
  const tides = [];
  let tideHour = now.getHours();
  for (let i = 0; i < 4; i++) {
    tideHour += 6 + Math.floor(Math.random() * 2);
    const tideTime = new Date(now);
    tideTime.setHours(tideHour % 24);
    if (tideHour >= 24) tideTime.setDate(tideTime.getDate() + Math.floor(tideHour / 24));

    tides.push({
      timestamp: tideTime.toISOString(),
      height: i % 2 === 0 ? 1.8 + Math.random() * 0.4 : 0.3 + Math.random() * 0.3,
      type: (i % 2 === 0 ? "H" : "L") as "H" | "L",
    });
  }

  return {
    station: {
      id: station.id,
      name: station.name,
      lat: station.lat,
      lon: station.lon,
      type: "buoy",
    },
    current: {
      seaTemperature: Math.round((baseTemp + Math.random() * 2) * 10) / 10,
      airTemperature: Math.round((baseTemp + 2 + Math.random() * 3) * 10) / 10,
      waveHeight: Math.round((1.5 + waveVariation) * 10) / 10,
      wavePeriod: Math.round((8 + Math.random() * 4) * 10) / 10,
      windSpeed: Math.round((5 + Math.random() * 10) * 10) / 10,
      windDirection: Math.floor(Math.random() * 360),
      pressure: Math.round((1013 + Math.random() * 20 - 10) * 10) / 10,
      visibility: Math.round((8 + Math.random() * 4) * 10) / 10,
    },
    tides: {
      next: tides,
      current: Math.random() > 0.5 ? "rising" : "falling",
    },
    history,
    lastUpdated: now.toISOString(),
  };
}
