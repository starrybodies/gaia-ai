import type {
  GBIFSearchResponse,
  BiodiversityData,
  GBIFOccurrence,
} from "@/types/biodiversity";
import { valueBiodiversity, formatCurrency } from "@/lib/valuation";

// Transform GBIF occurrence data to simplified format
export function transformBiodiversityData(
  data: GBIFSearchResponse,
  locationName: string,
  lat: number,
  lon: number
): BiodiversityData {
  // Group occurrences by species
  const speciesMap = new Map<string, {
    scientificName: string;
    commonName?: string;
    count: number;
    lastSeen?: string;
    kingdom?: string;
  }>();

  const kingdomCounts: { [kingdom: string]: number } = {};

  data.results.forEach((occurrence: GBIFOccurrence) => {
    const name = occurrence.scientificName;

    if (speciesMap.has(name)) {
      const existing = speciesMap.get(name)!;
      existing.count++;

      // Update last seen if this occurrence is more recent
      if (occurrence.eventDate && (!existing.lastSeen || occurrence.eventDate > existing.lastSeen)) {
        existing.lastSeen = occurrence.eventDate;
      }
    } else {
      speciesMap.set(name, {
        scientificName: name,
        commonName: occurrence.vernacularName,
        count: 1,
        lastSeen: occurrence.eventDate,
        kingdom: occurrence.kingdom,
      });
    }

    // Count kingdoms
    if (occurrence.kingdom) {
      kingdomCounts[occurrence.kingdom] = (kingdomCounts[occurrence.kingdom] || 0) + 1;
    }
  });

  const occurrences = Array.from(speciesMap.values())
    .sort((a, b) => b.count - a.count);

  // Calculate valuation
  const uniqueSpecies = speciesMap.size;
  const analysisAreaHa = 31400; // ~10km radius
  const atRiskSpecies = Math.round(uniqueSpecies * 0.15); // Estimate ~15% at risk
  const bioVal = valueBiodiversity(uniqueSpecies, analysisAreaHa, atRiskSpecies);

  return {
    location: {
      lat,
      lon,
      name: locationName,
    },
    occurrences,
    summary: {
      totalOccurrences: data.count,
      uniqueSpecies: speciesMap.size,
      kingdoms: kingdomCounts,
    },
    valuation: {
      naturalCapital: {
        annualTotal: bioVal.annualServices.total,
        annualTotalFormatted: formatCurrency(bioVal.annualServices.total),
      },
      annualEcosystemServices: {
        total: bioVal.annualServices.total,
        totalFormatted: formatCurrency(bioVal.annualServices.total),
        breakdown: {
          existenceValue: { value: bioVal.annualServices.existenceValue, formatted: formatCurrency(bioVal.annualServices.existenceValue) },
          geneticResources: { value: bioVal.annualServices.geneticResources, formatted: formatCurrency(bioVal.annualServices.geneticResources) },
          pollination: { value: bioVal.annualServices.pollination, formatted: formatCurrency(bioVal.annualServices.pollination) },
          pestControl: { value: bioVal.annualServices.pestControl, formatted: formatCurrency(bioVal.annualServices.pestControl) },
          seedDispersal: { value: bioVal.annualServices.seedDispersal, formatted: formatCurrency(bioVal.annualServices.seedDispersal) },
        },
      },
      extinctionRisk: {
        atRiskSpecies: bioVal.extinctionRisk.atRiskSpecies,
        potentialLossValue: bioVal.extinctionRisk.potentialLossValue,
        potentialLossValueFormatted: formatCurrency(bioVal.extinctionRisk.potentialLossValue),
      },
      analysisArea: `${Math.round(analysisAreaHa / 100)} km² (~10km radius)`,
      methodology: "TEEB Biodiversity & Ecosystem Services Valuation",
    },
  };
}

// Generate mock biodiversity data for demo mode
export function getMockBiodiversityData(
  locationName: string,
  lat: number,
  lon: number
): BiodiversityData {
  const mockSpecies = [
    { scientificName: "Passer domesticus", commonName: "House Sparrow", count: 42, kingdom: "Animalia" },
    { scientificName: "Sturnus vulgaris", commonName: "European Starling", count: 38, kingdom: "Animalia" },
    { scientificName: "Quercus robur", commonName: "English Oak", count: 25, kingdom: "Plantae" },
    { scientificName: "Columba livia", commonName: "Rock Pigeon", count: 31, kingdom: "Animalia" },
    { scientificName: "Corvus corax", commonName: "Common Raven", count: 18, kingdom: "Animalia" },
    { scientificName: "Acer pseudoplatanus", commonName: "Sycamore Maple", count: 22, kingdom: "Plantae" },
    { scientificName: "Taraxacum officinale", commonName: "Common Dandelion", count: 156, kingdom: "Plantae" },
    { scientificName: "Sciurus carolinensis", commonName: "Eastern Gray Squirrel", count: 27, kingdom: "Animalia" },
    { scientificName: "Junco hyemalis", commonName: "Dark-eyed Junco", count: 34, kingdom: "Animalia" },
    { scientificName: "Turdus migratorius", commonName: "American Robin", count: 29, kingdom: "Animalia" },
  ];

  const totalOccurrences = mockSpecies.reduce((sum, s) => sum + s.count, 0);

  const kingdoms: { [key: string]: number } = {};
  mockSpecies.forEach(s => {
    kingdoms[s.kingdom] = (kingdoms[s.kingdom] || 0) + s.count;
  });

  // Calculate valuation
  const uniqueSpecies = mockSpecies.length;
  const analysisAreaHa = 31400; // ~10km radius
  const atRiskSpecies = Math.round(uniqueSpecies * 0.15); // Estimate ~15% at risk
  const bioVal = valueBiodiversity(uniqueSpecies, analysisAreaHa, atRiskSpecies);

  return {
    location: {
      lat,
      lon,
      name: locationName,
    },
    occurrences: mockSpecies.map(s => ({
      scientificName: s.scientificName,
      commonName: s.commonName,
      count: s.count,
      lastSeen: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      kingdom: s.kingdom,
    })),
    summary: {
      totalOccurrences,
      uniqueSpecies: mockSpecies.length,
      kingdoms,
    },
    valuation: {
      naturalCapital: {
        annualTotal: bioVal.annualServices.total,
        annualTotalFormatted: formatCurrency(bioVal.annualServices.total),
      },
      annualEcosystemServices: {
        total: bioVal.annualServices.total,
        totalFormatted: formatCurrency(bioVal.annualServices.total),
        breakdown: {
          existenceValue: { value: bioVal.annualServices.existenceValue, formatted: formatCurrency(bioVal.annualServices.existenceValue) },
          geneticResources: { value: bioVal.annualServices.geneticResources, formatted: formatCurrency(bioVal.annualServices.geneticResources) },
          pollination: { value: bioVal.annualServices.pollination, formatted: formatCurrency(bioVal.annualServices.pollination) },
          pestControl: { value: bioVal.annualServices.pestControl, formatted: formatCurrency(bioVal.annualServices.pestControl) },
          seedDispersal: { value: bioVal.annualServices.seedDispersal, formatted: formatCurrency(bioVal.annualServices.seedDispersal) },
        },
      },
      extinctionRisk: {
        atRiskSpecies: bioVal.extinctionRisk.atRiskSpecies,
        potentialLossValue: bioVal.extinctionRisk.potentialLossValue,
        potentialLossValueFormatted: formatCurrency(bioVal.extinctionRisk.potentialLossValue),
      },
      analysisArea: `${Math.round(analysisAreaHa / 100)} km² (~10km radius)`,
      methodology: "TEEB Biodiversity & Ecosystem Services Valuation",
    },
  };
}
