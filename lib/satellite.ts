import type { SatelliteData } from "@/types/satellite";

// NASA GIBS tile URL generator
export function getGIBSTileUrl(
  layer: string,
  date: string,
  z: number,
  x: number,
  y: number
): string {
  return `https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/${layer}/default/${date}/250m/${z}/${y}/${x}.jpg`;
}

// Common GIBS layers
export const GIBS_LAYERS = {
  trueColor: "MODIS_Terra_CorrectedReflectance_TrueColor",
  vegetation: "MODIS_Terra_NDVI_8Day",
  seaTemp: "GHRSST_L4_MUR_Sea_Surface_Temperature",
  fires: "MODIS_Terra_Thermal_Anomalies_Day",
  aerosol: "MODIS_Terra_Aerosol_Optical_Depth",
};

// Generate mock satellite data
export function getMockSatelliteData(
  locationName: string,
  lat: number,
  lon: number
): SatelliteData {
  const now = new Date();
  const dateStr = now.toISOString().split("T")[0];

  // Generate mock events nearby
  const mockEvents = [
    {
      id: "EONET_1",
      title: "Wildfire Activity - Regional",
      category: "Wildfires",
      date: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      distance: 150,
    },
    {
      id: "EONET_2",
      title: "Severe Storm System",
      category: "Severe Storms",
      date: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      distance: 320,
    },
  ];

  // Seasonal NDVI variation
  const month = now.getMonth();
  const seasonalFactor = Math.sin((month / 12) * 2 * Math.PI - Math.PI / 2) * 0.3 + 0.5;

  return {
    location: {
      name: locationName,
      lat,
      lon,
    },
    imagery: [
      {
        date: dateStr,
        source: "MODIS Terra",
        url: `https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/${dateStr}/250m/6/${Math.floor(lat + 90)}/${Math.floor(lon + 180)}.jpg`,
        type: "visible",
      },
      {
        date: dateStr,
        source: "MODIS NDVI",
        url: `https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/MODIS_Terra_NDVI_8Day/default/${dateStr}/250m/6/${Math.floor(lat + 90)}/${Math.floor(lon + 180)}.png`,
        type: "vegetation",
      },
    ],
    events: mockEvents,
    indices: {
      ndvi: Math.round(seasonalFactor * 100) / 100, // 0.2-0.8 typical
      evi: Math.round((seasonalFactor * 0.8) * 100) / 100,
      ndwi: Math.round((Math.random() * 0.4 - 0.1) * 100) / 100, // -0.1 to 0.3
      lst: Math.round((15 + seasonalFactor * 15 + Math.random() * 5) * 10) / 10, // 15-35°C
    },
    lastUpdated: now.toISOString(),
  };
}

// Get NDVI health description
export function getNDVIDescription(ndvi: number): string {
  if (ndvi < 0) return "Water/Snow";
  if (ndvi < 0.1) return "Bare Soil";
  if (ndvi < 0.2) return "Sparse Vegetation";
  if (ndvi < 0.4) return "Moderate Vegetation";
  if (ndvi < 0.6) return "Dense Vegetation";
  return "Very Dense Vegetation";
}

// Get NDVI color
export function getNDVIColor(ndvi: number): string {
  if (ndvi < 0.2) return "orange";
  if (ndvi < 0.4) return "white";
  return "blue";
}
