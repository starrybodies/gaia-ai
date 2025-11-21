// NASA Earth Observation Types

export interface NASAImage {
  identifier: string;
  title: string;
  date: string;
  url: string;
  caption?: string;
  coordinates?: {
    lat: number;
    lon: number;
  };
}

export interface EONETEvent {
  id: string;
  title: string;
  description?: string;
  categories: { id: string; title: string }[];
  sources: { id: string; url: string }[];
  geometry: {
    date: string;
    type: string;
    coordinates: [number, number];
  }[];
}

export interface SatelliteData {
  location: {
    name: string;
    lat: number;
    lon: number;
  };
  imagery: {
    date: string;
    source: string;
    url: string;
    type: "visible" | "infrared" | "vegetation" | "water";
  }[];
  events: {
    id: string;
    title: string;
    category: string;
    date: string;
    distance?: number; // km from location
  }[];
  indices: {
    ndvi?: number; // Normalized Difference Vegetation Index (-1 to 1)
    evi?: number; // Enhanced Vegetation Index
    ndwi?: number; // Normalized Difference Water Index
    lst?: number; // Land Surface Temperature (°C)
  };
  lastUpdated: string;
}
