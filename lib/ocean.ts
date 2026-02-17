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

// NOAA buoy stations - comprehensive list for better coverage
export const POPULAR_STATIONS = [
  // US West Coast
  { id: "46237", name: "San Francisco Bar", lat: 37.786, lon: -122.634 },
  { id: "46026", name: "San Francisco", lat: 37.759, lon: -122.833 },
  { id: "46025", name: "Santa Monica Basin", lat: 33.749, lon: -119.053 },
  { id: "46029", name: "Columbia River Bar", lat: 46.163, lon: -124.514 },
  { id: "46005", name: "Washington Offshore", lat: 46.100, lon: -131.000 },
  { id: "46006", name: "SE Papa", lat: 40.800, lon: -137.500 },
  { id: "46011", name: "Santa Maria", lat: 35.000, lon: -120.991 },
  { id: "46015", name: "Port Orford", lat: 42.765, lon: -124.845 },
  { id: "46027", name: "St. Georges", lat: 41.850, lon: -124.381 },
  { id: "46041", name: "Cape Elizabeth", lat: 47.353, lon: -124.731 },
  { id: "46047", name: "Tanner Bank", lat: 32.433, lon: -119.533 },
  { id: "46053", name: "East Santa Barbara", lat: 34.252, lon: -119.841 },
  { id: "46054", name: "West Santa Barbara", lat: 34.274, lon: -120.453 },
  { id: "46066", name: "Oregon Offshore", lat: 42.759, lon: -129.900 },
  { id: "46069", name: "South Santa Rosa", lat: 33.674, lon: -120.213 },
  { id: "46086", name: "San Clemente Basin", lat: 32.500, lon: -118.000 },
  { id: "46088", name: "New Dungeness", lat: 48.333, lon: -123.167 },
  { id: "46089", name: "Tillamook", lat: 45.927, lon: -125.779 },
  { id: "46131", name: "Vancouver Island", lat: 49.908, lon: -124.992 },
  { id: "46132", name: "Vancouver Island South", lat: 49.736, lon: -126.601 },
  { id: "46146", name: "Halibut Bank", lat: 49.340, lon: -123.730 },
  { id: "46183", name: "North Hecate Strait", lat: 53.620, lon: -131.100 },
  { id: "46184", name: "North Nomad", lat: 53.920, lon: -138.850 },
  { id: "46185", name: "South Hecate Strait", lat: 52.420, lon: -129.780 },
  { id: "46206", name: "La Perouse Bank", lat: 48.842, lon: -126.000 },

  // US East Coast
  { id: "44013", name: "Boston", lat: 42.346, lon: -70.651 },
  { id: "44025", name: "Long Island", lat: 40.251, lon: -73.164 },
  { id: "41009", name: "Canaveral", lat: 28.508, lon: -80.185 },
  { id: "41047", name: "Cape Hatteras", lat: 33.848, lon: -75.998 },
  { id: "41001", name: "Hatteras Deep", lat: 34.677, lon: -72.699 },
  { id: "41002", name: "South Hatteras", lat: 31.759, lon: -74.837 },
  { id: "41004", name: "Edisto", lat: 32.502, lon: -79.099 },
  { id: "41008", name: "Gray's Reef", lat: 31.402, lon: -80.869 },
  { id: "41013", name: "Frying Pan Shoals", lat: 33.441, lon: -77.743 },
  { id: "41025", name: "Diamond Shoals", lat: 35.006, lon: -75.402 },
  { id: "44008", name: "Nantucket", lat: 40.504, lon: -69.247 },
  { id: "44009", name: "Delaware Bay", lat: 38.457, lon: -74.702 },
  { id: "44011", name: "Georges Bank", lat: 41.110, lon: -66.618 },
  { id: "44014", name: "Virginia Beach", lat: 36.611, lon: -74.836 },
  { id: "44017", name: "Montauk Point", lat: 40.693, lon: -72.048 },
  { id: "44020", name: "Nantucket Sound", lat: 41.443, lon: -70.186 },
  { id: "44027", name: "Jonesport", lat: 44.282, lon: -67.306 },

  // Gulf of Mexico
  { id: "42001", name: "Gulf of Mexico Central", lat: 25.897, lon: -89.658 },
  { id: "42002", name: "Gulf of Mexico West", lat: 25.790, lon: -93.666 },
  { id: "42003", name: "Gulf of Mexico East", lat: 26.044, lon: -85.612 },
  { id: "42019", name: "Freeport", lat: 27.906, lon: -95.352 },
  { id: "42020", name: "Corpus Christi", lat: 26.966, lon: -96.694 },
  { id: "42035", name: "Galveston", lat: 29.232, lon: -94.413 },
  { id: "42036", name: "Tampa", lat: 28.500, lon: -84.517 },
  { id: "42039", name: "Pensacola", lat: 28.786, lon: -86.007 },
  { id: "42040", name: "Mobile Bay", lat: 29.180, lon: -88.260 },

  // Hawaii
  { id: "51000", name: "Hawaii Northwest", lat: 23.445, lon: -162.279 },
  { id: "51001", name: "Hawaii Central", lat: 23.445, lon: -154.056 },
  { id: "51002", name: "Hawaii East", lat: 17.094, lon: -157.679 },
  { id: "51003", name: "Hawaii Southeast", lat: 19.170, lon: -160.564 },
  { id: "51004", name: "Southeast Hawaii", lat: 17.526, lon: -152.485 },
  { id: "51101", name: "Waimea", lat: 21.674, lon: -158.121 },

  // Alaska
  { id: "46001", name: "Gulf of Alaska", lat: 56.300, lon: -148.000 },
  { id: "46060", name: "Portlock Bank", lat: 59.450, lon: -147.950 },
  { id: "46061", name: "Shelikof Strait", lat: 58.250, lon: -152.170 },
  { id: "46072", name: "Central Gulf", lat: 51.640, lon: -172.000 },
  { id: "46073", name: "Southeast Bering Sea", lat: 55.030, lon: -172.000 },
  { id: "46078", name: "Shumagin Islands", lat: 54.550, lon: -160.810 },
  { id: "46080", name: "Portage", lat: 58.020, lon: -152.060 },
  { id: "46083", name: "Fairweather Ground", lat: 58.248, lon: -137.992 },

  // Great Lakes
  { id: "45001", name: "Lake Superior Mid", lat: 48.066, lon: -87.779 },
  { id: "45002", name: "Lake Michigan North", lat: 45.344, lon: -86.411 },
  { id: "45003", name: "Lake Huron North", lat: 45.350, lon: -82.840 },
  { id: "45004", name: "Lake Superior East", lat: 47.581, lon: -86.585 },
  { id: "45005", name: "Lake Erie West", lat: 41.680, lon: -82.398 },
  { id: "45006", name: "Lake Superior West", lat: 47.336, lon: -89.794 },
  { id: "45007", name: "Lake Michigan South", lat: 42.674, lon: -87.026 },
  { id: "45008", name: "Lake Huron South", lat: 44.283, lon: -82.418 },
  { id: "45012", name: "Lake Ontario", lat: 43.621, lon: -77.401 },
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
