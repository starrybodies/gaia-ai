// Natural Capital Valuation Engine
// Based on TEEB, Natural Capital Protocol, and peer-reviewed methodologies

// =============================================================================
// CARBON PRICING
// =============================================================================

// Carbon credit prices (USD per tonne CO2)
export const CARBON_PRICES = {
  voluntary_market: 50,      // Voluntary carbon market average (2024)
  eu_ets: 80,                // EU Emissions Trading System
  social_cost: 185,          // US EPA Social Cost of Carbon (2024)
  conservative: 30,          // Conservative/floor price
  premium_verified: 120,     // High-quality verified credits
};

export function valueCarbonStorage(tonnesCO2: number, priceType: keyof typeof CARBON_PRICES = 'voluntary_market'): number {
  return tonnesCO2 * CARBON_PRICES[priceType];
}

export function valueCarbonSequestration(tonnesCO2PerYear: number, years: number = 30, discountRate: number = 0.03): number {
  // Net Present Value of future sequestration
  let npv = 0;
  for (let year = 1; year <= years; year++) {
    npv += (tonnesCO2PerYear * CARBON_PRICES.voluntary_market) / Math.pow(1 + discountRate, year);
  }
  return npv;
}

// =============================================================================
// FOREST ECOSYSTEM SERVICES
// =============================================================================

// Values per hectare per year (USD) - based on TEEB global averages
export const FOREST_VALUES_PER_HA = {
  carbon_sequestration: 150,     // Active CO2 absorption
  water_regulation: 245,         // Watershed protection, flood control
  water_supply: 98,              // Freshwater provision
  erosion_control: 86,           // Soil retention
  biodiversity_habitat: 120,     // Genetic resources, habitat provision
  recreation_tourism: 65,        // Ecotourism value
  timber_nontimber: 180,         // Sustainable harvest potential
  air_quality: 45,               // Particulate removal, oxygen
  climate_regulation: 95,        // Local climate moderation
  pollination: 35,               // Support for pollinators
};

export interface ForestValuation {
  areaHectares: number;
  forestType: 'tropical' | 'temperate' | 'boreal' | 'mixed';
  protectedPercent: number;
  annualServices: {
    carbonSequestration: number;
    waterRegulation: number;
    waterSupply: number;
    erosionControl: number;
    biodiversityHabitat: number;
    recreationTourism: number;
    timberNontimber: number;
    airQuality: number;
    climateRegulation: number;
    pollination: number;
    total: number;
  };
  carbonStock: {
    tonnes: number;
    value: number;
  };
  totalNaturalCapital: number;
}

// Forest type multipliers (tropical forests provide more services)
const FOREST_TYPE_MULTIPLIERS: Record<string, number> = {
  tropical: 1.8,
  temperate: 1.0,
  boreal: 0.7,
  mixed: 1.1,
};

export function valueForestEcosystem(
  areaHectares: number,
  forestType: string = 'temperate',
  carbonStockTonnes: number = 0,
  protectedPercent: number = 0
): ForestValuation {
  const multiplier = FOREST_TYPE_MULTIPLIERS[forestType] || 1.0;
  // Protected areas have higher biodiversity value
  const protectedBonus = 1 + (protectedPercent / 100) * 0.3;

  const annualServices = {
    carbonSequestration: Math.round(areaHectares * FOREST_VALUES_PER_HA.carbon_sequestration * multiplier),
    waterRegulation: Math.round(areaHectares * FOREST_VALUES_PER_HA.water_regulation * multiplier),
    waterSupply: Math.round(areaHectares * FOREST_VALUES_PER_HA.water_supply * multiplier),
    erosionControl: Math.round(areaHectares * FOREST_VALUES_PER_HA.erosion_control * multiplier),
    biodiversityHabitat: Math.round(areaHectares * FOREST_VALUES_PER_HA.biodiversity_habitat * multiplier * protectedBonus),
    recreationTourism: Math.round(areaHectares * FOREST_VALUES_PER_HA.recreation_tourism * multiplier),
    timberNontimber: Math.round(areaHectares * FOREST_VALUES_PER_HA.timber_nontimber * multiplier * (1 - protectedPercent / 100)),
    airQuality: Math.round(areaHectares * FOREST_VALUES_PER_HA.air_quality * multiplier),
    climateRegulation: Math.round(areaHectares * FOREST_VALUES_PER_HA.climate_regulation * multiplier),
    pollination: Math.round(areaHectares * FOREST_VALUES_PER_HA.pollination * multiplier),
    total: 0,
  };

  annualServices.total = Object.values(annualServices).reduce((a, b) => a + b, 0);

  const carbonStockValue = valueCarbonStorage(carbonStockTonnes);

  // Total natural capital = carbon stock + NPV of annual services (30 years)
  const totalNaturalCapital = carbonStockValue + valueCarbonSequestration(annualServices.total / CARBON_PRICES.voluntary_market, 30);

  return {
    areaHectares,
    forestType: forestType as ForestValuation['forestType'],
    protectedPercent,
    annualServices,
    carbonStock: {
      tonnes: carbonStockTonnes,
      value: carbonStockValue,
    },
    totalNaturalCapital: Math.round(totalNaturalCapital),
  };
}

// =============================================================================
// SOIL ECOSYSTEM SERVICES
// =============================================================================

export const SOIL_VALUES_PER_HA = {
  carbon_storage: 45,            // Soil carbon value
  nutrient_cycling: 85,          // Nitrogen, phosphorus cycling
  water_filtration: 120,         // Groundwater recharge, purification
  erosion_prevention: 65,        // Soil retention value
  food_production: 450,          // Agricultural productivity support
  biodiversity_support: 35,      // Soil biome value
};

export interface SoilValuation {
  areaHectares: number;
  healthScore: number;
  annualServices: {
    carbonStorage: number;
    nutrientCycling: number;
    waterFiltration: number;
    erosionPrevention: number;
    foodProduction: number;
    biodiversitySupport: number;
    total: number;
  };
  carbonStock: {
    tonnes: number;
    value: number;
  };
  degradationCost: number;  // Annual cost if soil continues to degrade
  restorationPotential: number;  // Value gain if restored to optimal
}

export function valueSoilEcosystem(
  areaHectares: number,
  healthScore: number,  // 0-100
  carbonContentTonnesPerHa: number,
  erosionRisk: 'low' | 'moderate' | 'high' | 'severe'
): SoilValuation {
  // Health score affects service provision (degraded soil provides fewer services)
  const healthMultiplier = healthScore / 100;

  // Erosion risk affects certain services
  const erosionMultipliers: Record<string, number> = {
    low: 1.0,
    moderate: 0.85,
    high: 0.6,
    severe: 0.3,
  };
  const erosionMult = erosionMultipliers[erosionRisk] || 0.7;

  const annualServices = {
    carbonStorage: Math.round(areaHectares * SOIL_VALUES_PER_HA.carbon_storage * healthMultiplier),
    nutrientCycling: Math.round(areaHectares * SOIL_VALUES_PER_HA.nutrient_cycling * healthMultiplier),
    waterFiltration: Math.round(areaHectares * SOIL_VALUES_PER_HA.water_filtration * healthMultiplier),
    erosionPrevention: Math.round(areaHectares * SOIL_VALUES_PER_HA.erosion_prevention * erosionMult),
    foodProduction: Math.round(areaHectares * SOIL_VALUES_PER_HA.food_production * healthMultiplier),
    biodiversitySupport: Math.round(areaHectares * SOIL_VALUES_PER_HA.biodiversity_support * healthMultiplier),
    total: 0,
  };
  annualServices.total = Object.values(annualServices).reduce((a, b) => a + b, 0);

  const carbonStockTonnes = carbonContentTonnesPerHa * areaHectares;
  const carbonStockValue = valueCarbonStorage(carbonStockTonnes);

  // Degradation cost: what's lost annually if health declines 5% per year
  const optimalServices = areaHectares * Object.values(SOIL_VALUES_PER_HA).reduce((a, b) => a + b, 0);
  const degradationCost = Math.round(optimalServices * 0.05);

  // Restoration potential: value gain if restored to 100% health
  const restorationPotential = Math.round(optimalServices - annualServices.total);

  return {
    areaHectares,
    healthScore,
    annualServices,
    carbonStock: {
      tonnes: carbonStockTonnes,
      value: carbonStockValue,
    },
    degradationCost,
    restorationPotential,
  };
}

// =============================================================================
// OCEAN ECOSYSTEM SERVICES
// =============================================================================

export const OCEAN_VALUES_PER_KM2 = {
  carbon_sequestration: 2500,    // Blue carbon (seagrass, mangroves, etc.)
  fisheries: 15000,              // Commercial and subsistence fishing
  coastal_protection: 8000,      // Storm surge, erosion protection
  nutrient_cycling: 3500,        // Marine nutrient processing
  recreation_tourism: 12000,     // Coastal tourism value
  biodiversity: 4500,            // Marine genetic resources
  water_purification: 2000,      // Filtration by marine organisms
};

export interface OceanValuation {
  areaKm2: number;
  coastalZone: boolean;
  annualServices: {
    carbonSequestration: number;
    fisheries: number;
    coastalProtection: number;
    nutrientCycling: number;
    recreationTourism: number;
    biodiversity: number;
    waterPurification: number;
    total: number;
  };
  healthRisk: {
    acidificationCost: number;
    temperatureStressCost: number;
    pollutionCost: number;
  };
}

export function valueOceanEcosystem(
  areaKm2: number,
  isCoastal: boolean,
  waterTemp: number,
  seaState: string
): OceanValuation {
  // Coastal zones have higher service values
  const coastalMultiplier = isCoastal ? 1.5 : 0.8;

  // Temperature stress affects productivity
  const tempStress = waterTemp > 25 ? 0.85 : waterTemp < 5 ? 0.9 : 1.0;

  const annualServices = {
    carbonSequestration: Math.round(areaKm2 * OCEAN_VALUES_PER_KM2.carbon_sequestration * tempStress),
    fisheries: Math.round(areaKm2 * OCEAN_VALUES_PER_KM2.fisheries * coastalMultiplier * tempStress),
    coastalProtection: Math.round(areaKm2 * OCEAN_VALUES_PER_KM2.coastal_protection * (isCoastal ? 1 : 0.1)),
    nutrientCycling: Math.round(areaKm2 * OCEAN_VALUES_PER_KM2.nutrient_cycling * tempStress),
    recreationTourism: Math.round(areaKm2 * OCEAN_VALUES_PER_KM2.recreation_tourism * coastalMultiplier),
    biodiversity: Math.round(areaKm2 * OCEAN_VALUES_PER_KM2.biodiversity * tempStress),
    waterPurification: Math.round(areaKm2 * OCEAN_VALUES_PER_KM2.water_purification * tempStress),
    total: 0,
  };
  annualServices.total = Object.values(annualServices).reduce((a, b) => a + b, 0);

  // Climate risk costs
  const healthRisk = {
    acidificationCost: Math.round(annualServices.total * 0.02),  // 2% annual loss from acidification
    temperatureStressCost: Math.round(annualServices.total * (waterTemp > 22 ? 0.03 : 0)),
    pollutionCost: Math.round(annualServices.total * 0.01),
  };

  return {
    areaKm2,
    coastalZone: isCoastal,
    annualServices,
    healthRisk,
  };
}

// =============================================================================
// BIODIVERSITY VALUATION
// =============================================================================

export const BIODIVERSITY_VALUES = {
  species_existence: 500,        // Per species existence value (willingness to pay)
  genetic_resources: 150,        // Per species pharmaceutical/agricultural potential
  pollination_per_ha: 200,       // Pollination services
  pest_control_per_ha: 85,       // Natural pest regulation
  seed_dispersal_per_ha: 45,     // Seed dispersal services
};

export interface BiodiversityValuation {
  uniqueSpecies: number;
  areaHectares: number;
  annualServices: {
    existenceValue: number;
    geneticResources: number;
    pollination: number;
    pestControl: number;
    seedDispersal: number;
    total: number;
  };
  extinctionRisk: {
    atRiskSpecies: number;
    potentialLossValue: number;
  };
}

export function valueBiodiversity(
  uniqueSpecies: number,
  areaHectares: number,
  atRiskSpecies: number = 0
): BiodiversityValuation {
  const annualServices = {
    existenceValue: Math.round(uniqueSpecies * BIODIVERSITY_VALUES.species_existence),
    geneticResources: Math.round(uniqueSpecies * BIODIVERSITY_VALUES.genetic_resources),
    pollination: Math.round(areaHectares * BIODIVERSITY_VALUES.pollination_per_ha),
    pestControl: Math.round(areaHectares * BIODIVERSITY_VALUES.pest_control_per_ha),
    seedDispersal: Math.round(areaHectares * BIODIVERSITY_VALUES.seed_dispersal_per_ha),
    total: 0,
  };
  annualServices.total = Object.values(annualServices).reduce((a, b) => a + b, 0);

  const extinctionRisk = {
    atRiskSpecies,
    potentialLossValue: Math.round(atRiskSpecies * (BIODIVERSITY_VALUES.species_existence + BIODIVERSITY_VALUES.genetic_resources)),
  };

  return {
    uniqueSpecies,
    areaHectares,
    annualServices,
    extinctionRisk,
  };
}

// =============================================================================
// AGGREGATE NATURAL CAPITAL
// =============================================================================

export interface NaturalCapitalSummary {
  location: string;
  totalAnnualValue: number;
  totalAssetValue: number;  // NPV over 30 years
  breakdown: {
    forest: number;
    soil: number;
    water: number;
    biodiversity: number;
    carbon: number;
  };
  risks: {
    climateChange: number;
    degradation: number;
    pollution: number;
  };
  opportunities: {
    restoration: number;
    conservation: number;
  };
}

export function formatCurrency(value: number): string {
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  if (value >= 1e3) return `$${(value / 1e3).toFixed(0)}K`;
  return `$${value.toFixed(0)}`;
}

export function formatCurrencyCompact(value: number): string {
  if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
  if (value >= 1e3) return `${(value / 1e3).toFixed(0)}K`;
  return value.toFixed(0);
}
