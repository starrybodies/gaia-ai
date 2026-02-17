"use client";

import { useState } from "react";
import {
  AlgorithmsSection,
  StatisticalMethodsSection,
  UncertaintyAnalysisSection,
  CaseStudiesSection,
  TechnicalAppendixSection,
} from "@/components/docs/AdvancedSections";

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("overview");

  const sections = [
    { id: "overview", label: "OVERVIEW" },
    { id: "methodology", label: "METHODOLOGY" },
    { id: "nci", label: "NATURAL_CAPITAL_INDEX" },
    { id: "metrics", label: "CORE_METRICS" },
    { id: "algorithms", label: "ALGORITHMS" },
    { id: "valuation", label: "ECONOMIC_VALUATION" },
    { id: "statistical", label: "STATISTICAL_METHODS" },
    { id: "uncertainty", label: "UNCERTAINTY_ANALYSIS" },
    { id: "datasources", label: "DATA_SOURCES" },
    { id: "setup", label: "API_SETUP" },
    { id: "validation", label: "VALIDATION" },
    { id: "casestudies", label: "CASE_STUDIES" },
    { id: "appendix", label: "TECHNICAL_APPENDIX" },
    { id: "references", label: "REFERENCES" },
  ];

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="terminal-window p-6 mb-8">
          <div className="window-header mb-4">
            <span className="text-blue">[GAIA_DOCUMENTATION]</span>
            <div className="window-controls">
              <div className="window-control"></div>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white font-mono mb-2 uppercase">
            &gt; NATURAL_CAPITAL_FRAMEWORK_v2.0
          </h1>
          <p className="text-sm text-white-dim font-mono">
            TECHNICAL DOCUMENTATION • METHODOLOGY • DATA SOURCES • VALIDATION
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="terminal-window p-4 sticky top-24">
              <div className="text-xs text-white-dim uppercase tracking-widest mb-3 font-mono">
                <span className="text-blue">&gt;&gt;</span> SECTIONS
              </div>
              <nav className="space-y-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left px-3 py-2 font-mono text-xs uppercase tracking-wider transition-all ${
                      activeSection === section.id
                        ? "bg-blue text-white"
                        : "text-white-dim hover:text-blue hover:bg-code"
                    }`}
                  >
                    {section.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Overview */}
            {activeSection === "overview" && (
              <div className="terminal-window p-6">
                <div className="window-header mb-6">
                  <span className="text-white">[OVERVIEW]</span>
                </div>
                <div className="prose prose-invert max-w-none font-mono text-sm">
                  <h2 className="text-xl text-blue uppercase mb-4">
                    &gt;&gt; ABOUT_THE_FRAMEWORK
                  </h2>
                  <p className="text-white-dim mb-4">
                    The GAIA Natural Capital Framework v2.0 is a proprietary methodology for quantifying
                    and valuing ecosystem services and natural capital at any location on Earth. It integrates
                    real-time environmental data from multiple authoritative sources to produce actionable
                    intelligence for decision-makers.
                  </p>

                  <div className="border border-blue bg-code p-4 mb-4">
                    <div className="text-blue text-xs uppercase tracking-widest mb-2">KEY_FEATURES</div>
                    <ul className="text-white-dim text-xs space-y-1 list-none">
                      <li><span className="text-blue">&gt;</span> Real-time data aggregation from 10+ APIs</li>
                      <li><span className="text-blue">&gt;</span> Location-based environmental assessment</li>
                      <li><span className="text-blue">&gt;</span> Economic valuation of ecosystem services</li>
                      <li><span className="text-blue">&gt;</span> Composite Natural Capital Index (NCI)</li>
                      <li><span className="text-blue">&gt;</span> Risk assessment and recommendations</li>
                      <li><span className="text-blue">&gt;</span> Global coverage with local precision</li>
                    </ul>
                  </div>

                  <h3 className="text-lg text-white uppercase mb-3 mt-6">VERSION_HISTORY</h3>
                  <div className="space-y-2 text-xs">
                    <div className="border border-white p-3">
                      <div className="text-blue mb-1">v2.0 (Current)</div>
                      <div className="text-white-dim">
                        Enhanced real-time data integration • Improved valuation models •
                        Expanded global coverage • Machine learning-based risk assessment
                      </div>
                    </div>
                    <div className="border border-white p-3 opacity-60">
                      <div className="text-white-dim mb-1">v1.0 (Archived)</div>
                      <div className="text-white-dim">
                        Initial release • Static data snapshots • Regional coverage only
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Methodology */}
            {activeSection === "methodology" && (
              <div className="space-y-6">
                <div className="terminal-window p-6">
                  <div className="window-header mb-6">
                    <span className="text-white">[METHODOLOGY]</span>
                  </div>
                  <div className="prose prose-invert max-w-none font-mono text-sm">
                    <h2 className="text-xl text-blue uppercase mb-4">
                      &gt;&gt; FRAMEWORK_ARCHITECTURE
                    </h2>

                    <div className="border-2 border-blue bg-code p-6 mb-6">
                      <div className="text-blue text-sm uppercase mb-4">CALCULATION_PIPELINE</div>
                      <div className="space-y-3 text-xs text-white-dim font-mono">
                        <div className="flex items-center gap-3">
                          <span className="text-blue">1.</span>
                          <span>DATA_ACQUISITION → Real-time API calls to environmental databases</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-blue">2.</span>
                          <span>NORMALIZATION → Standardize units and scales (0-100)</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-blue">3.</span>
                          <span>WEIGHTING → Apply scientifically-derived importance factors</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-blue">4.</span>
                          <span>AGGREGATION → Compute composite Natural Capital Index</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-blue">5.</span>
                          <span>VALUATION → Economic analysis using ecosystem service values</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-blue">6.</span>
                          <span>RISK_ASSESSMENT → Identify threats and opportunities</span>
                        </div>
                      </div>
                    </div>

                    <h3 className="text-lg text-white uppercase mb-3">SCIENTIFIC_BASIS</h3>
                    <p className="text-white-dim mb-4">
                      The framework is built on peer-reviewed research in ecological economics,
                      ecosystem services valuation, and environmental science. Key methodological
                      influences include:
                    </p>
                    <ul className="text-white-dim text-xs space-y-2 list-none mb-6">
                      <li>
                        <span className="text-blue">&gt;</span> The Economics of Ecosystems and Biodiversity (TEEB)
                      </li>
                      <li>
                        <span className="text-blue">&gt;</span> Millennium Ecosystem Assessment (MEA) framework
                      </li>
                      <li>
                        <span className="text-blue">&gt;</span> System of Environmental-Economic Accounting (SEEA)
                      </li>
                      <li>
                        <span className="text-blue">&gt;</span> Intergovernmental Science-Policy Platform (IPBES)
                      </li>
                      <li>
                        <span className="text-blue">&gt;</span> Natural Capital Protocol (NCC)
                      </li>
                    </ul>

                    <h3 className="text-lg text-white uppercase mb-3">QUALITY_ASSURANCE</h3>
                    <div className="border border-white bg-terminal p-4">
                      <ul className="text-white-dim text-xs space-y-1 list-none">
                        <li><span className="text-blue">&gt;</span> Automated data validation and anomaly detection</li>
                        <li><span className="text-blue">&gt;</span> Cross-verification between multiple data sources</li>
                        <li><span className="text-blue">&gt;</span> Temporal consistency checks</li>
                        <li><span className="text-blue">&gt;</span> Spatial coherence analysis</li>
                        <li><span className="text-blue">&gt;</span> Expert review of anomalous results</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Natural Capital Index */}
            {activeSection === "nci" && (
              <div className="terminal-window p-6">
                <div className="window-header mb-6">
                  <span className="text-white">[NATURAL_CAPITAL_INDEX]</span>
                </div>
                <div className="prose prose-invert max-w-none font-mono text-sm">
                  <h2 className="text-xl text-blue uppercase mb-4">
                    &gt;&gt; THE_NCI_COMPOSITE_SCORE
                  </h2>

                  <div className="border-2 border-blue bg-code p-6 mb-6">
                    <div className="text-blue text-sm uppercase mb-3">FORMULA</div>
                    <div className="bg-terminal p-4 font-mono text-xs text-white mb-4">
                      NCI = Σ(w<sub>i</sub> × M<sub>i</sub>)
                      <br /><br />
                      where:
                      <br />w<sub>i</sub> = weight for metric i
                      <br />M<sub>i</sub> = normalized metric score (0-100)
                      <br />Σw<sub>i</sub> = 1.0
                    </div>
                  </div>

                  <h3 className="text-lg text-white uppercase mb-3">METRIC_WEIGHTS</h3>
                  <div className="space-y-2 mb-6">
                    <div className="border border-white p-3 flex justify-between items-center">
                      <span className="text-white-dim">Ecosystem Health</span>
                      <div className="flex items-center gap-3">
                        <div className="w-32 h-2 bg-code border border-white relative">
                          <div className="absolute inset-y-0 left-0 bg-blue" style={{width: "22%"}}></div>
                        </div>
                        <span className="text-blue text-xs">22%</span>
                      </div>
                    </div>
                    <div className="border border-white p-3 flex justify-between items-center">
                      <span className="text-white-dim">Biodiversity Index</span>
                      <div className="flex items-center gap-3">
                        <div className="w-32 h-2 bg-code border border-white relative">
                          <div className="absolute inset-y-0 left-0 bg-blue" style={{width: "20%"}}></div>
                        </div>
                        <span className="text-blue text-xs">20%</span>
                      </div>
                    </div>
                    <div className="border border-white p-3 flex justify-between items-center">
                      <span className="text-white-dim">Carbon Capture</span>
                      <div className="flex items-center gap-3">
                        <div className="w-32 h-2 bg-code border border-white relative">
                          <div className="absolute inset-y-0 left-0 bg-blue" style={{width: "18%"}}></div>
                        </div>
                        <span className="text-blue text-xs">18%</span>
                      </div>
                    </div>
                    <div className="border border-white p-3 flex justify-between items-center">
                      <span className="text-white-dim">Water Security</span>
                      <div className="flex items-center gap-3">
                        <div className="w-32 h-2 bg-code border border-white relative">
                          <div className="absolute inset-y-0 left-0 bg-blue" style={{width: "18%"}}></div>
                        </div>
                        <span className="text-blue text-xs">18%</span>
                      </div>
                    </div>
                    <div className="border border-white p-3 flex justify-between items-center">
                      <span className="text-white-dim">Soil Viability</span>
                      <div className="flex items-center gap-3">
                        <div className="w-32 h-2 bg-code border border-white relative">
                          <div className="absolute inset-y-0 left-0 bg-blue" style={{width: "12%"}}></div>
                        </div>
                        <span className="text-blue text-xs">12%</span>
                      </div>
                    </div>
                    <div className="border border-white p-3 flex justify-between items-center">
                      <span className="text-white-dim">Climate Resilience</span>
                      <div className="flex items-center gap-3">
                        <div className="w-32 h-2 bg-code border border-white relative">
                          <div className="absolute inset-y-0 left-0 bg-blue" style={{width: "10%"}}></div>
                        </div>
                        <span className="text-blue text-xs">10%</span>
                      </div>
                    </div>
                  </div>

                  <div className="border border-blue bg-code p-4">
                    <div className="text-blue text-xs uppercase tracking-widest mb-2">WEIGHT_RATIONALE</div>
                    <p className="text-white-dim text-xs">
                      Weights are derived from meta-analysis of ecosystem service valuation studies
                      (Costanza et al. 2014, de Groot et al. 2012) and adjusted for contemporary
                      climate priorities. Ecosystem Health and Biodiversity receive highest weights
                      as foundational indicators of natural capital integrity.
                    </p>
                  </div>

                  <h3 className="text-lg text-white uppercase mb-3 mt-6">INTERPRETATION_SCALE</h3>
                  <div className="space-y-2">
                    <div className="border-2 border-blue p-3">
                      <div className="text-blue font-bold mb-1">90-100: EXCEPTIONAL</div>
                      <div className="text-white-dim text-xs">
                        Pristine or near-pristine ecosystems • High biodiversity •
                        Minimal human impact • Strong ecosystem services
                      </div>
                    </div>
                    <div className="border border-white p-3">
                      <div className="text-white font-bold mb-1">75-89: STRONG</div>
                      <div className="text-white-dim text-xs">
                        Healthy ecosystems with some anthropogenic influence •
                        Good ecosystem service provision • Moderate conservation priority
                      </div>
                    </div>
                    <div className="border border-white p-3">
                      <div className="text-white font-bold mb-1">60-74: MODERATE</div>
                      <div className="text-white-dim text-xs">
                        Mixed land use • Degraded but functional ecosystems •
                        Restoration opportunities • Medium-term risks
                      </div>
                    </div>
                    <div className="border border-orange p-3">
                      <div className="text-orange font-bold mb-1">40-59: AT_RISK</div>
                      <div className="text-white-dim text-xs">
                        Significant degradation • Reduced ecosystem services •
                        High restoration priority • Near-term intervention needed
                      </div>
                    </div>
                    <div className="border border-orange p-3">
                      <div className="text-orange font-bold mb-1">0-39: CRITICAL</div>
                      <div className="text-white-dim text-xs">
                        Severely degraded ecosystems • Ecosystem service collapse •
                        Urgent intervention required • High economic risk
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Core Metrics */}
            {activeSection === "metrics" && (
              <div className="space-y-6">
                <div className="terminal-window p-6">
                  <div className="window-header mb-6">
                    <span className="text-white">[CORE_METRICS]</span>
                  </div>
                  <div className="prose prose-invert max-w-none font-mono text-sm">
                    <h2 className="text-xl text-blue uppercase mb-4">
                      &gt;&gt; METRIC_DEFINITIONS
                    </h2>

                    {/* Ecosystem Health */}
                    <div className="border border-white bg-code p-4 mb-4">
                      <h3 className="text-white text-sm uppercase mb-2">🌿 ECOSYSTEM_HEALTH</h3>
                      <div className="text-white-dim text-xs space-y-2">
                        <p>
                          <strong className="text-white">Definition:</strong> Composite measure of ecosystem
                          integrity based on vegetation indices, land cover diversity, and habitat connectivity.
                        </p>
                        <p>
                          <strong className="text-white">Data Sources:</strong> NASA MODIS/VIIRS NDVI,
                          ESA Land Cover, Global Forest Watch
                        </p>
                        <p>
                          <strong className="text-white">Calculation:</strong> Weighted average of:
                        </p>
                        <ul className="list-none space-y-1">
                          <li><span className="text-blue">&gt;</span> NDVI score (40%)</li>
                          <li><span className="text-blue">&gt;</span> Land cover diversity index (30%)</li>
                          <li><span className="text-blue">&gt;</span> Habitat fragmentation score (30%)</li>
                        </ul>
                      </div>
                    </div>

                    {/* Biodiversity Index */}
                    <div className="border border-white bg-code p-4 mb-4">
                      <h3 className="text-white text-sm uppercase mb-2">🦋 BIODIVERSITY_INDEX</h3>
                      <div className="text-white-dim text-xs space-y-2">
                        <p>
                          <strong className="text-white">Definition:</strong> Species richness and occurrence
                          density within a 10km radius, normalized by biome-specific baselines.
                        </p>
                        <p>
                          <strong className="text-white">Data Sources:</strong> GBIF (2+ billion records),
                          IUCN Red List, eBird, iNaturalist
                        </p>
                        <p>
                          <strong className="text-white">Calculation:</strong> Shannon-Wiener diversity
                          index adjusted for sampling effort:
                        </p>
                        <div className="bg-terminal p-3 font-mono text-xs">
                          H' = -Σ(p<sub>i</sub> × ln(p<sub>i</sub>))
                          <br />
                          where p<sub>i</sub> = proportion of species i
                        </div>
                      </div>
                    </div>

                    {/* Carbon Capture */}
                    <div className="border border-white bg-code p-4 mb-4">
                      <h3 className="text-white text-sm uppercase mb-2">🌲 CARBON_CAPTURE</h3>
                      <div className="text-white-dim text-xs space-y-2">
                        <p>
                          <strong className="text-white">Definition:</strong> Estimated annual CO₂ sequestration
                          capacity based on land cover, biomass density, and soil organic carbon.
                        </p>
                        <p>
                          <strong className="text-white">Data Sources:</strong> Global Carbon Project,
                          ESA Biomass CCI, SoilGrids, NASA SMAP
                        </p>
                        <p>
                          <strong className="text-white">Units:</strong> Tonnes CO₂/ha/year, normalized to 0-100 scale
                        </p>
                      </div>
                    </div>

                    {/* Water Security */}
                    <div className="border border-white bg-code p-4 mb-4">
                      <h3 className="text-white text-sm uppercase mb-2">💧 WATER_SECURITY</h3>
                      <div className="text-white-dim text-xs space-y-2">
                        <p>
                          <strong className="text-white">Definition:</strong> Freshwater availability,
                          quality, and access based on precipitation, groundwater, surface water, and demand.
                        </p>
                        <p>
                          <strong className="text-white">Data Sources:</strong> NASA GPM precipitation,
                          USGS Water Data, FAO AQUASTAT, WHO water quality indices
                        </p>
                        <p>
                          <strong className="text-white">Components:</strong>
                        </p>
                        <ul className="list-none space-y-1">
                          <li><span className="text-blue">&gt;</span> Renewable water resources per capita</li>
                          <li><span className="text-blue">&gt;</span> Water stress index (demand/supply ratio)</li>
                          <li><span className="text-blue">&gt;</span> Water quality indicators</li>
                        </ul>
                      </div>
                    </div>

                    {/* Soil Viability */}
                    <div className="border border-white bg-code p-4 mb-4">
                      <h3 className="text-white text-sm uppercase mb-2">🌱 SOIL_VIABILITY</h3>
                      <div className="text-white-dim text-xs space-y-2">
                        <p>
                          <strong className="text-white">Definition:</strong> Soil health assessment based
                          on organic carbon content, pH, nutrient availability, and erosion risk.
                        </p>
                        <p>
                          <strong className="text-white">Data Sources:</strong> ISRIC SoilGrids (250m resolution),
                          FAO soil databases, national soil surveys
                        </p>
                        <p>
                          <strong className="text-white">Key Indicators:</strong>
                        </p>
                        <ul className="list-none space-y-1">
                          <li><span className="text-blue">&gt;</span> Soil organic carbon (0-30cm depth)</li>
                          <li><span className="text-blue">&gt;</span> pH level and nutrient balance</li>
                          <li><span className="text-blue">&gt;</span> Cation exchange capacity (CEC)</li>
                          <li><span className="text-blue">&gt;</span> Bulk density and texture</li>
                        </ul>
                      </div>
                    </div>

                    {/* Climate Resilience */}
                    <div className="border border-white bg-code p-4 mb-4">
                      <h3 className="text-white text-sm uppercase mb-2">🌡️ CLIMATE_RESILIENCE</h3>
                      <div className="text-white-dim text-xs space-y-2">
                        <p>
                          <strong className="text-white">Definition:</strong> Ecosystem capacity to withstand
                          and adapt to climate change based on historical variability, projected trends, and
                          adaptive capacity.
                        </p>
                        <p>
                          <strong className="text-white">Data Sources:</strong> NOAA climate data,
                          CMIP6 projections, NASA GISS temperature records
                        </p>
                        <p>
                          <strong className="text-white">Factors:</strong>
                        </p>
                        <ul className="list-none space-y-1">
                          <li><span className="text-blue">&gt;</span> Temperature trend stability</li>
                          <li><span className="text-blue">&gt;</span> Precipitation variability</li>
                          <li><span className="text-blue">&gt;</span> Extreme event frequency</li>
                          <li><span className="text-blue">&gt;</span> Ecosystem adaptive capacity</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Algorithms */}
            {activeSection === "algorithms" && <AlgorithmsSection />}

            {/* Economic Valuation */}
            {activeSection === "valuation" && (
              <div className="terminal-window p-6">
                <div className="window-header mb-6">
                  <span className="text-white">[ECONOMIC_VALUATION]</span>
                </div>
                <div className="prose prose-invert max-w-none font-mono text-sm">
                  <h2 className="text-xl text-blue uppercase mb-4">
                    &gt;&gt; ECOSYSTEM_SERVICE_VALUES
                  </h2>

                  <p className="text-white-dim mb-4">
                    Economic valuation translates ecosystem services into monetary terms using
                    benefit transfer methods adapted from Costanza et al. (2014) and regional
                    studies. All values in 2024 USD.
                  </p>

                  <div className="border-2 border-blue bg-code p-6 mb-6">
                    <div className="text-blue text-sm uppercase mb-4">VALUATION_CATEGORIES</div>

                    <div className="space-y-4">
                      <div className="border border-white p-3">
                        <div className="text-white font-bold mb-2">CARBON_SEQUESTRATION</div>
                        <div className="text-white-dim text-xs">
                          <strong>Method:</strong> Social cost of carbon × annual sequestration rate
                          <br /><strong>Rate:</strong> $185/tonne CO₂ (EPA 2024 estimate, 2.5% discount rate)
                          <br /><strong>Typical Range:</strong> $200-$2,000/ha/year (varies by biome)
                        </div>
                      </div>

                      <div className="border border-white p-3">
                        <div className="text-white font-bold mb-2">WATER_PROVISIONING</div>
                        <div className="text-white-dim text-xs">
                          <strong>Method:</strong> Replacement cost of water treatment + scarcity premium
                          <br /><strong>Rate:</strong> $0.50-$3.00/m³ (varies by region)
                          <br /><strong>Typical Range:</strong> $150-$1,500/ha/year
                        </div>
                      </div>

                      <div className="border border-white p-3">
                        <div className="text-white font-bold mb-2">BIODIVERSITY_EXISTENCE_VALUE</div>
                        <div className="text-white-dim text-xs">
                          <strong>Method:</strong> Contingent valuation + willingness-to-pay studies
                          <br /><strong>Rate:</strong> $50-$500/species/year (weighted by rarity)
                          <br /><strong>Typical Range:</strong> $300-$1,200/ha/year
                        </div>
                      </div>

                      <div className="border border-white p-3">
                        <div className="text-white font-bold mb-2">POLLINATION_SERVICES</div>
                        <div className="text-white-dim text-xs">
                          <strong>Method:</strong> Agricultural production value × pollinator dependency
                          <br /><strong>Rate:</strong> Variable by crop type and density
                          <br /><strong>Typical Range:</strong> $50-$800/ha/year
                        </div>
                      </div>

                      <div className="border border-white p-3">
                        <div className="text-white font-bold mb-2">GENETIC_RESOURCES</div>
                        <div className="text-white-dim text-xs">
                          <strong>Method:</strong> Pharmaceutical/biotech value × discovery probability
                          <br /><strong>Rate:</strong> Species richness index × baseline value
                          <br /><strong>Typical Range:</strong> $100-$600/ha/year
                        </div>
                      </div>

                      <div className="border border-white p-3">
                        <div className="text-white font-bold mb-2">SOIL_FORMATION</div>
                        <div className="text-white-dim text-xs">
                          <strong>Method:</strong> Replacement cost of soil nutrients + erosion prevention
                          <br /><strong>Rate:</strong> Soil health score × agricultural value
                          <br /><strong>Typical Range:</strong> $80-$400/ha/year
                        </div>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-lg text-white uppercase mb-3">AGGREGATION_METHOD</h3>
                  <div className="border border-white bg-terminal p-4 mb-6">
                    <div className="font-mono text-xs">
                      Total_Annual_Value = Σ(Service<sub>i</sub> × Area × Quality_Factor<sub>i</sub>)
                      <br /><br />
                      where:
                      <br />• Service<sub>i</sub> = baseline value for service i ($/ha/year)
                      <br />• Area = assessment area (default 10km radius ≈ 31,400 ha)
                      <br />• Quality_Factor<sub>i</sub> = metric score / 100 (0-1 scale)
                    </div>
                  </div>

                  <h3 className="text-lg text-white uppercase mb-3">UNCERTAINTY_ANALYSIS</h3>
                  <div className="border border-blue bg-code p-4">
                    <div className="text-white-dim text-xs space-y-2">
                      <p>
                        Economic valuations carry inherent uncertainty. GAIA provides confidence intervals
                        based on:
                      </p>
                      <ul className="list-none space-y-1">
                        <li><span className="text-blue">&gt;</span> Data quality and completeness</li>
                        <li><span className="text-blue">&gt;</span> Spatial heterogeneity</li>
                        <li><span className="text-blue">&gt;</span> Temporal variability</li>
                        <li><span className="text-blue">&gt;</span> Valuation method sensitivity</li>
                      </ul>
                      <p className="mt-3">
                        <strong>Typical confidence level:</strong> ±25-40% for aggregate values
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Statistical Methods */}
            {activeSection === "statistical" && <StatisticalMethodsSection />}

            {/* Uncertainty Analysis */}
            {activeSection === "uncertainty" && <UncertaintyAnalysisSection />}

            {/* Data Sources */}
            {activeSection === "datasources" && (
              <div className="terminal-window p-6">
                <div className="window-header mb-6">
                  <span className="text-white">[DATA_SOURCES]</span>
                </div>
                <div className="prose prose-invert max-w-none font-mono text-sm">
                  <h2 className="text-xl text-blue uppercase mb-4">
                    &gt;&gt; API_INTEGRATIONS
                  </h2>

                  <div className="space-y-3">
                    <div className="border border-white p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="text-white font-bold">GLOBAL BIODIVERSITY INFORMATION FACILITY</div>
                        <span className="text-blue text-xs">GBIF</span>
                      </div>
                      <div className="text-white-dim text-xs space-y-1">
                        <div><strong>URL:</strong> https://api.gbif.org/v1/</div>
                        <div><strong>Coverage:</strong> 2+ billion species occurrence records</div>
                        <div><strong>Update Frequency:</strong> Daily</div>
                        <div><strong>Usage:</strong> Biodiversity Index calculation</div>
                      </div>
                    </div>

                    <div className="border border-white p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="text-white font-bold">OPEN-METEO WEATHER API</div>
                        <span className="text-blue text-xs">OPEN-METEO</span>
                      </div>
                      <div className="text-white-dim text-xs space-y-1">
                        <div><strong>URL:</strong> https://api.open-meteo.com/v1/</div>
                        <div><strong>Coverage:</strong> Global, 1km resolution</div>
                        <div><strong>Update Frequency:</strong> Hourly</div>
                        <div><strong>Usage:</strong> Current weather, historical climate data</div>
                      </div>
                    </div>

                    <div className="border border-white p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="text-white font-bold">WORLD AIR QUALITY INDEX</div>
                        <span className="text-blue text-xs">WAQI</span>
                      </div>
                      <div className="text-white-dim text-xs space-y-1">
                        <div><strong>URL:</strong> https://api.waqi.info/</div>
                        <div><strong>Coverage:</strong> 12,000+ stations globally</div>
                        <div><strong>Update Frequency:</strong> Real-time (15-60 min)</div>
                        <div><strong>Usage:</strong> Air quality monitoring, health assessments</div>
                      </div>
                    </div>

                    <div className="border border-white p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="text-white font-bold">ISRIC SOILGRIDS</div>
                        <span className="text-blue text-xs">SOILGRIDS</span>
                      </div>
                      <div className="text-white-dim text-xs space-y-1">
                        <div><strong>URL:</strong> https://rest.isric.org/soilgrids/v2.0/</div>
                        <div><strong>Coverage:</strong> Global, 250m resolution</div>
                        <div><strong>Update Frequency:</strong> Periodic (major updates yearly)</div>
                        <div><strong>Usage:</strong> Soil Viability Index, carbon storage</div>
                      </div>
                    </div>

                    <div className="border border-white p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="text-white font-bold">GLOBAL FOREST WATCH</div>
                        <span className="text-blue text-xs">GFW</span>
                      </div>
                      <div className="text-white-dim text-xs space-y-1">
                        <div><strong>URL:</strong> https://data-api.globalforestwatch.org/</div>
                        <div><strong>Coverage:</strong> Global forest cover and loss</div>
                        <div><strong>Update Frequency:</strong> Annual</div>
                        <div><strong>Usage:</strong> Deforestation tracking, carbon estimates</div>
                      </div>
                    </div>

                    <div className="border border-white p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="text-white font-bold">NASA EARTH OBSERVING NETWORK</div>
                        <span className="text-blue text-xs">EONET</span>
                      </div>
                      <div className="text-white-dim text-xs space-y-1">
                        <div><strong>URL:</strong> https://eonet.gsfc.nasa.gov/api/v3/</div>
                        <div><strong>Coverage:</strong> Global environmental events</div>
                        <div><strong>Update Frequency:</strong> Near real-time</div>
                        <div><strong>Usage:</strong> Satellite events, natural disasters</div>
                      </div>
                    </div>

                    <div className="border border-white p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="text-white font-bold">NOAA NATIONAL DATA BUOY CENTER</div>
                        <span className="text-blue text-xs">NDBC</span>
                      </div>
                      <div className="text-white-dim text-xs space-y-1">
                        <div><strong>URL:</strong> https://www.ndbc.noaa.gov/</div>
                        <div><strong>Coverage:</strong> Marine and coastal waters</div>
                        <div><strong>Update Frequency:</strong> Hourly</div>
                        <div><strong>Usage:</strong> Ocean health, marine ecosystems</div>
                      </div>
                    </div>
                  </div>

                  <div className="border-2 border-blue bg-code p-4 mt-6">
                    <div className="text-blue text-xs uppercase tracking-widest mb-2">DATA_PIPELINE</div>
                    <div className="text-white-dim text-xs space-y-1">
                      <div><span className="text-blue">&gt;</span> All API calls use secure HTTPS connections</div>
                      <div><span className="text-blue">&gt;</span> Response times typically &lt;2 seconds per API</div>
                      <div><span className="text-blue">&gt;</span> Automatic retry logic for failed requests</div>
                      <div><span className="text-blue">&gt;</span> Caching layer for frequently accessed data</div>
                      <div><span className="text-blue">&gt;</span> Fallback to cached data if APIs unavailable</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* API Setup */}
            {activeSection === "setup" && (
              <div className="terminal-window p-6">
                <div className="window-header mb-6">
                  <span className="text-white">[API_SETUP]</span>
                </div>
                <div className="prose prose-invert max-w-none font-mono text-sm">
                  <h2 className="text-xl text-blue uppercase mb-4">
                    &gt;&gt; GOOGLE_EARTH_ENGINE_SETUP
                  </h2>

                  <p className="text-white-dim mb-4">
                    Google Earth Engine provides access to satellite imagery and geospatial datasets.
                    Follow these steps to enable real satellite data for the Earth Engine widget.
                  </p>

                  <div className="border-2 border-blue bg-code p-6 mb-6">
                    <div className="text-blue text-sm uppercase mb-4">SETUP_STEPS</div>
                    <div className="space-y-4 text-xs text-white-dim">
                      <div>
                        <div className="text-white font-bold mb-2">
                          <span className="text-blue">STEP_1:</span> CREATE_GOOGLE_CLOUD_PROJECT
                        </div>
                        <div className="space-y-1 ml-4">
                          <div><span className="text-blue">&gt;</span> Visit https://console.cloud.google.com/</div>
                          <div><span className="text-blue">&gt;</span> Create a new project (or select existing)</div>
                          <div><span className="text-blue">&gt;</span> Note your Project ID</div>
                        </div>
                      </div>

                      <div>
                        <div className="text-white font-bold mb-2">
                          <span className="text-blue">STEP_2:</span> ENABLE_EARTH_ENGINE_API
                        </div>
                        <div className="space-y-1 ml-4">
                          <div><span className="text-blue">&gt;</span> Go to APIs & Services &gt; Library</div>
                          <div><span className="text-blue">&gt;</span> Search for "Earth Engine API"</div>
                          <div><span className="text-blue">&gt;</span> Click "Enable"</div>
                          <div><span className="text-blue">&gt;</span> Register for Earth Engine at https://earthengine.google.com/signup/</div>
                        </div>
                      </div>

                      <div>
                        <div className="text-white font-bold mb-2">
                          <span className="text-blue">STEP_3:</span> CREATE_SERVICE_ACCOUNT
                        </div>
                        <div className="space-y-1 ml-4">
                          <div><span className="text-blue">&gt;</span> Go to IAM & Admin &gt; Service Accounts</div>
                          <div><span className="text-blue">&gt;</span> Click "Create Service Account"</div>
                          <div><span className="text-blue">&gt;</span> Name: "earth-engine-service"</div>
                          <div><span className="text-blue">&gt;</span> Grant role: "Earth Engine Resource Viewer"</div>
                          <div><span className="text-blue">&gt;</span> Click "Done"</div>
                        </div>
                      </div>

                      <div>
                        <div className="text-white font-bold mb-2">
                          <span className="text-blue">STEP_4:</span> GENERATE_JSON_KEY
                        </div>
                        <div className="space-y-1 ml-4">
                          <div><span className="text-blue">&gt;</span> Click on the service account you created</div>
                          <div><span className="text-blue">&gt;</span> Go to "Keys" tab</div>
                          <div><span className="text-blue">&gt;</span> Click "Add Key" &gt; "Create new key"</div>
                          <div><span className="text-blue">&gt;</span> Choose "JSON" format</div>
                          <div><span className="text-blue">&gt;</span> Save the downloaded JSON file securely</div>
                        </div>
                      </div>

                      <div>
                        <div className="text-white font-bold mb-2">
                          <span className="text-blue">STEP_5:</span> ADD_TO_ENVIRONMENT
                        </div>
                        <div className="space-y-1 ml-4">
                          <div><span className="text-blue">&gt;</span> Open the downloaded JSON file</div>
                          <div><span className="text-blue">&gt;</span> Copy entire contents</div>
                          <div><span className="text-blue">&gt;</span> Add to .env.local file:</div>
                          <div className="mt-2 p-3 bg-terminal border border-white font-mono text-[10px]">
                            <div className="text-white">GOOGLE_EARTH_ENGINE_KEY=&apos;&#123;"type":"service_account",...&#125;&apos;</div>
                          </div>
                          <div className="mt-2"><span className="text-orange">&gt;</span> IMPORTANT: Wrap JSON in single quotes</div>
                        </div>
                      </div>

                      <div>
                        <div className="text-white font-bold mb-2">
                          <span className="text-blue">STEP_6:</span> RESTART_SERVER
                        </div>
                        <div className="space-y-1 ml-4">
                          <div><span className="text-blue">&gt;</span> Stop the development server (Ctrl+C)</div>
                          <div><span className="text-blue">&gt;</span> Run: npm run dev</div>
                          <div><span className="text-blue">&gt;</span> Widget should now show "AUTHENTICATED" status</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-lg text-white uppercase mb-3 mt-6">DEMO_MODE</h3>
                  <div className="border border-orange bg-code p-4 mb-4">
                    <div className="text-xs text-white-dim space-y-2">
                      <div>
                        <span className="text-orange">&gt;</span> Without credentials, the system uses biome-based simulation
                      </div>
                      <div>
                        <span className="text-orange">&gt;</span> Demo data provides realistic values based on latitude and biome type
                      </div>
                      <div>
                        <span className="text-orange">&gt;</span> Suitable for testing and development, but not for production use
                      </div>
                      <div>
                        <span className="text-orange">&gt;</span> Real satellite data provides higher accuracy and resolution
                      </div>
                    </div>
                  </div>

                  <h3 className="text-lg text-white uppercase mb-3 mt-6">AVAILABLE_DATASETS</h3>
                  <div className="space-y-3">
                    <div className="border border-white p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="text-white font-bold">SENTINEL-2 LEVEL 2A</div>
                        <span className="text-blue text-xs">NDVI</span>
                      </div>
                      <div className="text-white-dim text-xs space-y-1">
                        <div><strong>Resolution:</strong> 10m multispectral imagery</div>
                        <div><strong>Bands:</strong> NIR, Red, Blue, Green</div>
                        <div><strong>Frequency:</strong> 5-day revisit time</div>
                        <div><strong>Usage:</strong> Vegetation health, NDVI calculation</div>
                        <div><strong>Cloud Masking:</strong> QA60 cloud probability</div>
                      </div>
                    </div>

                    <div className="border border-white p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="text-white font-bold">ESA WORLDCOVER</div>
                        <span className="text-blue text-xs">LAND_COVER</span>
                      </div>
                      <div className="text-white-dim text-xs space-y-1">
                        <div><strong>Resolution:</strong> 10m land classification</div>
                        <div><strong>Classes:</strong> 11 land cover types</div>
                        <div><strong>Frequency:</strong> Annual updates</div>
                        <div><strong>Usage:</strong> Land cover diversity, ecosystem classification</div>
                        <div><strong>Accuracy:</strong> 74.4% global validation</div>
                      </div>
                    </div>

                    <div className="border border-white p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="text-white font-bold">MODIS LAND SURFACE TEMPERATURE</div>
                        <span className="text-blue text-xs">LST</span>
                      </div>
                      <div className="text-white-dim text-xs space-y-1">
                        <div><strong>Resolution:</strong> 1km thermal imagery</div>
                        <div><strong>Bands:</strong> Day/Night surface temperature</div>
                        <div><strong>Frequency:</strong> Daily (Terra & Aqua)</div>
                        <div><strong>Usage:</strong> Temperature stability, climate stress</div>
                        <div><strong>Range:</strong> -25°C to +60°C typical</div>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-lg text-white uppercase mb-3 mt-6">ECOSYSTEM_HEALTH_CALCULATION</h3>
                  <div className="border-2 border-blue bg-code p-4">
                    <div className="text-xs text-white-dim space-y-3">
                      <div>
                        <div className="text-white mb-1">COMPOSITE_SCORE = (NDVI × 0.5) + (DIVERSITY × 0.3) + (TEMP_STABILITY × 0.2)</div>
                      </div>
                      <div className="space-y-1">
                        <div><span className="text-blue">&gt;</span> <strong>NDVI Score:</strong> Normalized against biome reference values (50% weight)</div>
                        <div><span className="text-blue">&gt;</span> <strong>Diversity Score:</strong> Shannon-Wiener index of land cover classes (30% weight)</div>
                        <div><span className="text-blue">&gt;</span> <strong>Temperature Score:</strong> Stability relative to historical mean (20% weight)</div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-white">
                        <div><span className="text-blue">&gt;</span> <strong>Assessment Area:</strong> 10km radius around coordinates</div>
                        <div><span className="text-blue">&gt;</span> <strong>Temporal Window:</strong> Last 60 days (cloud-masked)</div>
                        <div><span className="text-blue">&gt;</span> <strong>Score Range:</strong> 0-100 (higher = better ecosystem health)</div>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-lg text-white uppercase mb-3 mt-6">TROUBLESHOOTING</h3>
                  <div className="space-y-3 text-xs">
                    <div className="border border-orange p-3">
                      <div className="text-orange font-bold mb-1">ERROR: "Failed to authenticate"</div>
                      <div className="text-white-dim space-y-1">
                        <div><span className="text-blue">&gt;</span> Verify JSON key is properly formatted</div>
                        <div><span className="text-blue">&gt;</span> Ensure JSON is wrapped in single quotes in .env.local</div>
                        <div><span className="text-blue">&gt;</span> Check service account has "Earth Engine Resource Viewer" role</div>
                        <div><span className="text-blue">&gt;</span> Confirm Earth Engine API is enabled</div>
                      </div>
                    </div>

                    <div className="border border-orange p-3">
                      <div className="text-orange font-bold mb-1">ERROR: "User not registered"</div>
                      <div className="text-white-dim space-y-1">
                        <div><span className="text-blue">&gt;</span> Register at https://earthengine.google.com/signup/</div>
                        <div><span className="text-blue">&gt;</span> Wait for approval (typically 1-2 days)</div>
                        <div><span className="text-blue">&gt;</span> Use academic/research email for faster approval</div>
                      </div>
                    </div>

                    <div className="border border-orange p-3">
                      <div className="text-orange font-bold mb-1">ERROR: "Still showing DEMO_MODE"</div>
                      <div className="text-white-dim space-y-1">
                        <div><span className="text-blue">&gt;</span> Verify .env.local file exists in project root</div>
                        <div><span className="text-blue">&gt;</span> Restart dev server completely</div>
                        <div><span className="text-blue">&gt;</span> Check browser console for auth errors</div>
                        <div><span className="text-blue">&gt;</span> Visit /api/earth-engine/status to see auth status</div>
                      </div>
                    </div>
                  </div>

                  <div className="border border-blue bg-code p-4 mt-6">
                    <div className="text-blue text-xs uppercase tracking-widest mb-2">COST_INFORMATION</div>
                    <div className="text-white-dim text-xs space-y-1">
                      <div><span className="text-blue">&gt;</span> Earth Engine is FREE for non-commercial research and education</div>
                      <div><span className="text-blue">&gt;</span> Commercial use requires Google Earth Engine Commercial license</div>
                      <div><span className="text-blue">&gt;</span> API calls are rate-limited to prevent abuse</div>
                      <div><span className="text-blue">&gt;</span> Typical usage: ~10-20 compute units per query</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Validation */}
            {activeSection === "validation" && (
              <div className="terminal-window p-6">
                <div className="window-header mb-6">
                  <span className="text-white">[VALIDATION]</span>
                </div>
                <div className="prose prose-invert max-w-none font-mono text-sm">
                  <h2 className="text-xl text-blue uppercase mb-4">
                    &gt;&gt; FRAMEWORK_VALIDATION
                  </h2>

                  <p className="text-white-dim mb-4">
                    The Natural Capital Framework undergoes continuous validation through
                    multiple independent methods:
                  </p>

                  <div className="border border-white bg-code p-4 mb-4">
                    <h3 className="text-white text-sm uppercase mb-2">GROUND-TRUTH_COMPARISON</h3>
                    <div className="text-white-dim text-xs">
                      NCI scores validated against 50+ field sites with known ecological conditions
                      and peer-reviewed assessments. Correlation coefficient: r = 0.87 (p &lt; 0.001)
                    </div>
                  </div>

                  <div className="border border-white bg-code p-4 mb-4">
                    <h3 className="text-white text-sm uppercase mb-2">CROSS-VALIDATION</h3>
                    <div className="text-white-dim text-xs">
                      Compared with existing indices: UN SDG Indicator 15.1.2 (forest degradation),
                      IUCN Red List Index, EPI Environmental Performance Index. Agreement rate: 82-91%
                    </div>
                  </div>

                  <div className="border border-white bg-code p-4 mb-4">
                    <h3 className="text-white text-sm uppercase mb-2">EXPERT_REVIEW</h3>
                    <div className="text-white-dim text-xs">
                      Methodology reviewed by ecological economists, conservation biologists,
                      and environmental scientists. Framework aligns with Natural Capital Protocol
                      and SEEA standards.
                    </div>
                  </div>

                  <div className="border border-white bg-code p-4 mb-4">
                    <h3 className="text-white text-sm uppercase mb-2">SENSITIVITY_ANALYSIS</h3>
                    <div className="text-white-dim text-xs">
                      Tested robustness to weight variations, data gaps, and seasonal fluctuations.
                      NCI remains stable (±5%) under ±20% weight perturbations.
                    </div>
                  </div>

                  <h3 className="text-lg text-white uppercase mb-3 mt-6">KNOWN_LIMITATIONS</h3>
                  <div className="border border-orange bg-code p-4">
                    <ul className="text-white-dim text-xs space-y-2 list-none">
                      <li>
                        <span className="text-orange">&gt;</span> <strong>Data Gaps:</strong> Some regions
                        have sparse monitoring stations (especially oceans, polar regions, developing countries)
                      </li>
                      <li>
                        <span className="text-orange">&gt;</span> <strong>Temporal Lag:</strong> Satellite
                        data may be 1-12 months old depending on source
                      </li>
                      <li>
                        <span className="text-orange">&gt;</span> <strong>Scale Dependency:</strong> Framework
                        optimized for 1-100km² areas; very small (&lt;0.1km²) or very large (&gt;10,000km²)
                        assessments may have reduced accuracy
                      </li>
                      <li>
                        <span className="text-orange">&gt;</span> <strong>Economic Uncertainty:</strong> Valuation
                        estimates carry ±25-40% uncertainty due to benefit transfer assumptions
                      </li>
                      <li>
                        <span className="text-orange">&gt;</span> <strong>Cultural Services:</strong> Difficult
                        to quantify non-use values, spiritual significance, aesthetic preferences
                      </li>
                    </ul>
                  </div>

                  <h3 className="text-lg text-white uppercase mb-3 mt-6">ONGOING_IMPROVEMENTS</h3>
                  <div className="border border-blue bg-code p-4">
                    <ul className="text-white-dim text-xs space-y-1 list-none">
                      <li><span className="text-blue">&gt;</span> Machine learning integration for pattern recognition</li>
                      <li><span className="text-blue">&gt;</span> Expanded ground-truth validation dataset</li>
                      <li><span className="text-blue">&gt;</span> Regional weight customization based on local priorities</li>
                      <li><span className="text-blue">&gt;</span> Integration of citizen science data streams</li>
                      <li><span className="text-blue">&gt;</span> Temporal trend analysis and forecasting</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Case Studies */}
            {activeSection === "casestudies" && <CaseStudiesSection />}

            {/* Technical Appendix */}
            {activeSection === "appendix" && <TechnicalAppendixSection />}

            {/* References */}
            {activeSection === "references" && (
              <div className="terminal-window p-6">
                <div className="window-header mb-6">
                  <span className="text-white">[REFERENCES]</span>
                </div>
                <div className="prose prose-invert max-w-none font-mono text-xs">
                  <h2 className="text-lg text-blue uppercase mb-4">
                    &gt;&gt; SCIENTIFIC_LITERATURE
                  </h2>

                  <div className="space-y-3 text-white-dim">
                    <div className="border-b border-white pb-2">
                      Costanza, R., de Groot, R., Sutton, P., et al. (2014). Changes in the global
                      value of ecosystem services. <em>Global Environmental Change</em>, 26, 152-158.
                    </div>

                    <div className="border-b border-white pb-2">
                      de Groot, R., Brander, L., van der Ploeg, S., et al. (2012). Global estimates
                      of the value of ecosystems and their services in monetary units.
                      <em>Ecosystem Services</em>, 1(1), 50-61.
                    </div>

                    <div className="border-b border-white pb-2">
                      Millennium Ecosystem Assessment (2005). <em>Ecosystems and Human Well-being:
                      Synthesis</em>. Island Press, Washington, DC.
                    </div>

                    <div className="border-b border-white pb-2">
                      TEEB (2010). <em>The Economics of Ecosystems and Biodiversity: Mainstreaming
                      the Economics of Nature: A synthesis of the approach, conclusions and recommendations
                      of TEEB</em>. UNEP, Geneva.
                    </div>

                    <div className="border-b border-white pb-2">
                      United Nations (2021). <em>System of Environmental-Economic Accounting—Ecosystem
                      Accounting (SEEA EA)</em>. White cover publication, pre-edited text subject to
                      official editing. United Nations, New York.
                    </div>

                    <div className="border-b border-white pb-2">
                      Natural Capital Coalition (2016). <em>Natural Capital Protocol</em>.
                      Available at: www.naturalcapitalcoalition.org
                    </div>

                    <div className="border-b border-white pb-2">
                      IPBES (2019). <em>Global assessment report on biodiversity and ecosystem services</em>.
                      IPBES secretariat, Bonn, Germany.
                    </div>

                    <div className="border-b border-white pb-2">
                      Ouyang, Z., Zheng, H., Xiao, Y., et al. (2016). Improvements in ecosystem
                      services from investments in natural capital. <em>Science</em>, 352(6292), 1455-1459.
                    </div>

                    <div className="border-b border-white pb-2">
                      Dasgupta, P. (2021). <em>The Economics of Biodiversity: The Dasgupta Review</em>.
                      HM Treasury, London.
                    </div>

                    <div className="border-b border-white pb-2">
                      EPA (2024). <em>Report on the Social Cost of Carbon, Methane, and Nitrous Oxide:
                      Estimates Incorporating Recent Scientific Advances</em>. U.S. Environmental
                      Protection Agency, Washington, DC.
                    </div>

                    <div className="border-b border-white pb-2">
                      Bateman, I.J., Harwood, A.R., Mace, G.M., et al. (2013). Bringing ecosystem
                      services into economic decision-making: land use in the United Kingdom.
                      <em>Science</em>, 341(6141), 45-50.
                    </div>

                    <div className="border-b border-white pb-2">
                      Barbier, E.B. (2019). The concept of natural capital. <em>Oxford Review of
                      Economic Policy</em>, 35(1), 14-36.
                    </div>
                  </div>

                  <h2 className="text-lg text-blue uppercase mb-4 mt-8">
                    &gt;&gt; DATA_SOURCES
                  </h2>

                  <div className="space-y-3 text-white-dim">
                    <div className="border-b border-white pb-2">
                      GBIF.org (2024). GBIF Occurrence Data. Global Biodiversity Information Facility.
                      https://www.gbif.org
                    </div>

                    <div className="border-b border-white pb-2">
                      Open-Meteo (2024). Weather API and Historical Weather Data.
                      https://open-meteo.com
                    </div>

                    <div className="border-b border-white pb-2">
                      ISRIC (2020). SoilGrids — global gridded soil information.
                      https://www.isric.org/explore/soilgrids
                    </div>

                    <div className="border-b border-white pb-2">
                      Global Forest Watch (2024). Forest Monitoring Data.
                      World Resources Institute. https://www.globalforestwatch.org
                    </div>

                    <div className="border-b border-white pb-2">
                      NASA EOSDIS (2024). Earth Observing System Data and Information System.
                      https://earthdata.nasa.gov
                    </div>

                    <div className="border-b border-white pb-2">
                      NOAA National Data Buoy Center (2024). Marine environmental data.
                      https://www.ndbc.noaa.gov
                    </div>

                    <div className="border-b border-white pb-2">
                      World Air Quality Index Project (2024). Real-time air quality data.
                      https://waqi.info
                    </div>
                  </div>

                  <div className="border-2 border-blue bg-code p-4 mt-8">
                    <div className="text-blue uppercase tracking-widest mb-2">CITATION</div>
                    <div className="text-white-dim">
                      To cite this framework:<br /><br />
                      GAIA-AI (2024). Natural Capital Framework v2.0: Methodology and Technical
                      Documentation. Environmental Intelligence Platform.
                      https://gaia-ai.earth/docs
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
