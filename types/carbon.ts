// Carbon & Emissions Data Types

export interface CarbonData {
  location: {
    name: string;
    lat: number;
    lon: number;
    country: string;
    region?: string;
  };
  emissions: {
    co2: number; // tonnes CO2 per capita
    methane: number; // tonnes CH4 equivalent
    totalGHG: number; // total greenhouse gas tonnes CO2e
    trend: "increasing" | "decreasing" | "stable";
    changePercent: number; // year over year
  };
  sequestration: {
    forestCarbon: number; // tonnes CO2 stored
    soilCarbon: number; // tonnes CO2 stored
    oceanCarbon: number; // tonnes CO2 absorbed
    netBalance: number; // emissions - sequestration
  };
  atmosphere: {
    co2ppm: number; // current atmospheric CO2 (ppm)
    ch4ppb: number; // methane (ppb)
    globalAvgCO2: number; // for comparison
  };
  history: {
    year: number;
    co2: number;
    emissions: number;
  }[];
  lastUpdated: string;
}

export interface GlobalCarbonStats {
  atmosphericCO2: number;
  annualEmissions: number; // Gt CO2
  annualIncrease: number; // ppm/year
  oceanAbsorption: number; // Gt CO2
  landAbsorption: number; // Gt CO2
}
