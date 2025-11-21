// GBIF (Global Biodiversity Information Facility) API Types

export interface GBIFOccurrence {
  key: number;
  scientificName: string;
  vernacularName?: string;
  kingdom?: string;
  phylum?: string;
  class?: string;
  order?: string;
  family?: string;
  genus?: string;
  species?: string;
  decimalLatitude: number;
  decimalLongitude: number;
  country?: string;
  locality?: string;
  eventDate?: string;
  basisOfRecord: string;
  references?: string;
}

export interface GBIFSearchResponse {
  offset: number;
  limit: number;
  endOfRecords: boolean;
  count: number;
  results: GBIFOccurrence[];
}

export interface GBIFSpeciesMatch {
  usageKey: number;
  scientificName: string;
  canonicalName: string;
  rank: string;
  status: string;
  confidence: number;
  matchType: string;
  kingdom?: string;
  phylum?: string;
  class?: string;
  order?: string;
  family?: string;
  genus?: string;
  species?: string;
}

// Simplified Biodiversity Data for UI
export interface BiodiversityData {
  location: {
    lat: number;
    lon: number;
    name: string;
  };
  occurrences: {
    scientificName: string;
    commonName?: string;
    count: number;
    lastSeen?: string;
    kingdom?: string;
  }[];
  summary: {
    totalOccurrences: number;
    uniqueSpecies: number;
    kingdoms: {
      [kingdom: string]: number;
    };
  };
}

// Map tile configuration
export interface GBIFMapTileConfig {
  baseUrl: string;
  style: "green.point" | "classic.point" | "purpleHeat.point" | "orange.marker";
  zoom: number;
  center: [number, number];
}
