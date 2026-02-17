import { NextRequest, NextResponse } from "next/server";

interface ChatRequest {
  query: string;
  location: {
    lat: number;
    lon: number;
    name: string;
  };
  environmentalData?: any;
}

// Format currency values
function formatCurrency(value: number): string {
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  if (value >= 1e3) return `$${(value / 1e3).toFixed(0)}K`;
  return `$${value.toFixed(0)}`;
}

// Generate contextual response based on query and data
function generateResponse(query: string, location: any, data: any): { response: string; sourceData?: any } {
  const q = query.toLowerCase();
  const locationName = location.name || `${location.lat.toFixed(4)}°, ${location.lon.toFixed(4)}°`;

  // Calculate aggregate values if data exists
  let totalNaturalCapital = 0;
  if (data?.forest?.valuation?.naturalCapital?.total) {
    totalNaturalCapital += data.forest.valuation.naturalCapital.total;
  }
  if (data?.soil?.valuation?.naturalCapital?.carbonStock) {
    totalNaturalCapital += data.soil.valuation.naturalCapital.carbonStock;
  }
  if (data?.biodiversity?.valuation?.naturalCapital?.annualTotal) {
    totalNaturalCapital += data.biodiversity.valuation.naturalCapital.annualTotal * 20;
  }
  if (data?.ocean?.valuation?.naturalCapital?.annualTotal) {
    totalNaturalCapital += data.ocean.valuation.naturalCapital.annualTotal * 20;
  }
  if (data?.carbon?.valuation?.naturalCapital?.totalSequestrationValue) {
    totalNaturalCapital += data.carbon.valuation.naturalCapital.totalSequestrationValue;
  }

  // Natural capital / value queries
  if (q.includes("natural capital") || q.includes("total value") || q.includes("worth") || q.includes("how much")) {
    let response = `## Natural Capital Assessment\n**Location:** ${locationName}\n\n`;

    if (totalNaturalCapital > 0) {
      response += `### Total Natural Capital Value\n**${formatCurrency(totalNaturalCapital)}** (20-year NPV)\n\n`;
      response += `### Breakdown by Category\n`;

      if (data?.forest?.valuation?.naturalCapital?.totalFormatted) {
        response += `- **Forest Capital:** ${data.forest.valuation.naturalCapital.totalFormatted}\n`;
      }
      if (data?.soil?.valuation?.naturalCapital?.carbonStockFormatted) {
        response += `- **Soil Carbon:** ${data.soil.valuation.naturalCapital.carbonStockFormatted}\n`;
      }
      if (data?.biodiversity?.valuation?.naturalCapital?.annualTotalFormatted) {
        response += `- **Biodiversity Services:** ${data.biodiversity.valuation.naturalCapital.annualTotalFormatted}/year\n`;
      }
      if (data?.ocean?.valuation?.naturalCapital?.annualTotalFormatted) {
        response += `- **Marine Services:** ${data.ocean.valuation.naturalCapital.annualTotalFormatted}/year\n`;
      }

      response += `\n*Methodology: TEEB + Natural Capital Protocol*`;
    } else {
      response += "Natural capital data is being calculated. Please check the data panel for live updates.";
    }

    return { response, sourceData: { totalNaturalCapital } };
  }

  // Carbon queries
  if (q.includes("carbon") || q.includes("emissions") || q.includes("sequestration") || q.includes("co2")) {
    const c = data?.carbon;
    let response = `## Carbon Analysis\n**Location:** ${locationName}\n\n`;

    if (c) {
      response += `### Atmospheric Data\n`;
      response += `- **Current CO₂:** ${c.atmosphere?.co2ppm || "—"} ppm\n`;
      response += `- **Methane (CH₄):** ${c.atmosphere?.ch4ppb || "—"} ppb\n\n`;

      response += `### Regional Emissions\n`;
      response += `- **Per Capita:** ${c.emissions?.co2 || "—"} tonnes CO₂/year\n`;
      response += `- **Trend:** ${c.emissions?.trend || "—"}\n\n`;

      if (c.valuation) {
        response += `### Carbon Economics\n`;
        response += `- **Sequestration Value:** ${c.valuation.naturalCapital?.totalSequestrationValueFormatted || "—"}\n`;
        response += `- **Social Cost of Emissions:** ${c.valuation.emissionsCost?.socialCostFormatted || "—"}/year\n`;
        response += `- **Net Position:** ${c.valuation.netPosition?.status || "—"}\n`;
      }
    } else {
      response += "Carbon data is being loaded for this location.";
    }

    return { response };
  }

  // Biodiversity queries
  if (q.includes("species") || q.includes("biodiversity") || q.includes("wildlife") || q.includes("animals") || q.includes("plants")) {
    const b = data?.biodiversity;
    let response = `## Biodiversity Report\n**Location:** ${locationName}\n\n`;

    if (b) {
      response += `### Summary\n`;
      response += `- **Unique Species:** ${b.summary?.uniqueSpecies || "—"}\n`;
      response += `- **Total Observations:** ${b.summary?.totalOccurrences?.toLocaleString() || "—"}\n`;
      response += `- **Data Source:** GBIF (Global Biodiversity Information Facility)\n\n`;

      if (b.occurrences?.length > 0) {
        response += `### Notable Species\n`;
        b.occurrences.slice(0, 8).forEach((s: any) => {
          const commonName = s.commonName ? ` (${s.commonName})` : "";
          response += `- *${s.scientificName}*${commonName} - ${s.count} observations\n`;
        });
      }

      if (b.valuation) {
        response += `\n### Ecosystem Service Value\n`;
        response += `- **Annual Services:** ${b.valuation.naturalCapital?.annualTotalFormatted || "—"}/year\n`;
        response += `- **At-Risk Species:** ${b.valuation.extinctionRisk?.atRiskSpecies || 0}\n`;
        response += `- **Potential Loss if Degraded:** ${b.valuation.extinctionRisk?.potentialLossValueFormatted || "—"}\n`;
      }
    } else {
      response += "Biodiversity data is being loaded from GBIF.";
    }

    return { response };
  }

  // Forest queries
  if (q.includes("forest") || q.includes("tree") || q.includes("deforestation") || q.includes("logging")) {
    const f = data?.forest;
    let response = `## Forest Analysis\n**Location:** ${locationName}\n\n`;

    if (f) {
      response += `### Current Status\n`;
      response += `- **Forest Cover:** ${f.forestCover?.current || "—"}%\n`;
      response += `- **Forest Area:** ${f.forestCover?.area?.toLocaleString() || "—"} km²\n`;
      response += `- **Change Since 2000:** ${f.forestCover?.change || "—"}%\n\n`;

      response += `### Deforestation\n`;
      response += `- **Total Loss:** ${f.loss?.total?.toLocaleString() || "—"} km²\n`;
      response += `- **Annual Loss Rate:** ${f.loss?.annual || "—"} km²/year\n`;
      response += `- **Primary Causes:** ${f.loss?.primaryCauses?.slice(0, 3).join(", ") || "—"}\n\n`;

      if (f.valuation) {
        response += `### Natural Capital Value\n`;
        response += `- **Total Forest Capital:** ${f.valuation.naturalCapital?.totalFormatted || "—"}\n`;
        response += `- **Annual Ecosystem Services:** ${f.valuation.annualEcosystemServices?.totalFormatted || "—"}/year\n`;
        response += `- **Cost of Deforestation:** ${f.valuation.deforestationCost?.annualLossFormatted || "—"}/year\n`;
      }
    } else {
      response += "Forest data is being loaded for this location.";
    }

    return { response };
  }

  // Soil queries
  if (q.includes("soil") || q.includes("ground") || q.includes("earth")) {
    const s = data?.soil;
    let response = `## Soil Analysis\n**Location:** ${locationName}\n\n`;

    if (s) {
      response += `### Soil Health\n`;
      response += `- **Health Score:** ${s.health?.score || "—"}/100\n`;
      response += `- **Carbon Content:** ${s.health?.carbonContent || "—"} tonnes/hectare\n`;
      response += `- **pH Level:** ${s.properties?.ph || "—"}\n\n`;

      response += `### Classification\n`;
      response += `- **Soil Type:** ${s.classification?.type || "—"}\n`;
      response += `- **Drainage:** ${s.classification?.drainage || "—"}\n\n`;

      if (s.valuation) {
        response += `### Carbon Stock Value\n`;
        response += `- **Total Value:** ${s.valuation.naturalCapital?.carbonStockFormatted || "—"}\n`;
        response += `- **Annual Services:** ${s.valuation.annualEcosystemServices?.totalFormatted || "—"}/year\n`;
        response += `- **Restoration Potential:** +${s.valuation.restoration?.potentialFormatted || "—"}\n`;
      }
    } else {
      response += "Soil data is being loaded from SoilGrids.";
    }

    return { response };
  }

  // Ocean / marine queries
  if (q.includes("ocean") || q.includes("marine") || q.includes("sea") || q.includes("coastal") || q.includes("wave")) {
    const o = data?.ocean;
    let response = `## Marine Conditions\n**Location:** ${locationName}\n\n`;

    if (o) {
      response += `### Current Conditions\n`;
      response += `- **Sea Temperature:** ${o.current?.seaTemperature || "—"}°C\n`;
      response += `- **Wave Height:** ${o.current?.waveHeight?.toFixed(1) || "—"} m\n`;
      response += `- **Wave Period:** ${o.current?.wavePeriod?.toFixed(1) || "—"} s\n`;
      response += `- **Sea State:** ${o.current?.seaState || "—"}\n\n`;

      if (o.valuation) {
        response += `### Marine Ecosystem Value\n`;
        response += `- **Annual Services:** ${o.valuation.naturalCapital?.annualTotalFormatted || "—"}/year\n`;
        response += `- **Climate Risks:** ${o.valuation.climateRisks?.totalAnnualRiskFormatted || "—"}/year\n`;
      }
    } else {
      response += "Ocean data is being loaded from NOAA buoys.";
    }

    return { response };
  }

  // Climate / weather queries
  if (q.includes("climate") || q.includes("weather") || q.includes("temperature") || q.includes("forecast")) {
    const w = data?.weather;
    let response = `## Climate & Weather\n**Location:** ${locationName}\n\n`;

    if (w?.current) {
      response += `### Current Conditions\n`;
      response += `- **Temperature:** ${w.current.temperature}°C\n`;
      response += `- **Conditions:** ${w.current.conditions}\n`;
      response += `- **Humidity:** ${w.current.humidity}%\n`;
      response += `- **Wind:** ${w.current.windSpeed || "—"} km/h\n`;
    } else {
      response += "Weather data is being loaded for this location.\n";
    }

    const c = data?.carbon;
    if (c) {
      response += `\n### Climate Context\n`;
      response += `- **Atmospheric CO₂:** ${c.atmosphere?.co2ppm || "—"} ppm\n`;
      response += `- **Pre-industrial CO₂:** 280 ppm\n`;
      response += `- **Change:** +${((c.atmosphere?.co2ppm || 420) - 280).toFixed(0)} ppm (+${(((c.atmosphere?.co2ppm || 420) / 280 - 1) * 100).toFixed(0)}%)\n`;
    }

    return { response };
  }

  // Risk queries
  if (q.includes("risk") || q.includes("threat") || q.includes("danger") || q.includes("vulnerability")) {
    let response = `## Risk Assessment\n**Location:** ${locationName}\n\n`;

    response += `### Environmental Risks\n`;

    // Forest risks
    if (data?.forest) {
      const lossRate = data.forest.loss?.trend || "stable";
      response += `- **Deforestation Risk:** ${lossRate === "increasing" ? "HIGH" : lossRate === "stable" ? "MODERATE" : "LOW"}\n`;
    }

    // Climate risks
    if (data?.ocean?.valuation?.climateRisks) {
      response += `- **Coastal Climate Risk:** ${data.ocean.valuation.climateRisks.totalAnnualRiskFormatted}/year\n`;
    }

    // Biodiversity risks
    if (data?.biodiversity?.valuation?.extinctionRisk) {
      response += `- **Species at Risk:** ${data.biodiversity.valuation.extinctionRisk.atRiskSpecies}\n`;
      response += `- **Potential Value Loss:** ${data.biodiversity.valuation.extinctionRisk.potentialLossValueFormatted}\n`;
    }

    // Carbon risks
    if (data?.carbon?.valuation?.emissionsCost) {
      response += `- **Emissions Social Cost:** ${data.carbon.valuation.emissionsCost.socialCostFormatted}/year\n`;
    }

    response += `\n*Risk valuations based on current environmental trends and TEEB methodology.*`;

    return { response };
  }

  // Ecosystem services queries
  if (q.includes("ecosystem") || q.includes("service")) {
    let response = `## Ecosystem Services\n**Location:** ${locationName}\n\n`;

    response += `### Provisioning Services\n`;
    response += `- Food and freshwater production\n`;
    response += `- Raw materials and genetic resources\n\n`;

    response += `### Regulating Services\n`;
    response += `- Carbon sequestration and storage\n`;
    response += `- Water purification and regulation\n`;
    response += `- Climate regulation and air quality\n`;
    response += `- Pollination and pest control\n\n`;

    response += `### Cultural Services\n`;
    response += `- Recreation and ecotourism\n`;
    response += `- Aesthetic and spiritual values\n`;
    response += `- Education and research\n\n`;

    response += `### Supporting Services\n`;
    response += `- Nutrient cycling\n`;
    response += `- Soil formation\n`;
    response += `- Habitat provision\n\n`;

    if (totalNaturalCapital > 0) {
      response += `**Total Valued Services:** ${formatCurrency(totalNaturalCapital)} (20-year NPV)`;
    }

    return { response };
  }

  // Default / help response
  let response = `## GAIA AI - Environmental Intelligence\n**Location:** ${locationName}\n\n`;
  response += `I can provide detailed analysis on:\n\n`;
  response += `- **Natural Capital** - Total ecosystem value and breakdown\n`;
  response += `- **Carbon** - Emissions, sequestration, and carbon economics\n`;
  response += `- **Biodiversity** - Species data, observations, and conservation value\n`;
  response += `- **Forest** - Cover, deforestation trends, and forest capital\n`;
  response += `- **Soil** - Health, carbon storage, and agricultural potential\n`;
  response += `- **Ocean** - Marine conditions and coastal ecosystem services\n`;
  response += `- **Climate** - Weather data and climate context\n`;
  response += `- **Risks** - Environmental threats and vulnerability assessment\n\n`;
  response += `Try asking: "What is the natural capital value?" or "Show me the biodiversity data"`;

  return { response };
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();
    const { query, location, environmentalData } = body;

    if (!query || !location) {
      return NextResponse.json(
        { error: "Query and location are required" },
        { status: 400 }
      );
    }

    const result = generateResponse(query, location, environmentalData);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to process query" },
      { status: 500 }
    );
  }
}
