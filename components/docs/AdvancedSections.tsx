export function AlgorithmsSection() {
  return (
    <div className="terminal-window p-6">
      <div className="window-header mb-6">
        <span className="text-white">[ALGORITHMS]</span>
      </div>
      <div className="prose prose-invert max-w-none font-mono text-sm">
        <h2 className="text-xl text-blue uppercase mb-4">
          &gt;&gt; COMPUTATIONAL_ALGORITHMS
        </h2>

        {/* Normalization */}
        <div className="border-2 border-blue bg-code p-6 mb-6">
          <h3 className="text-lg text-white uppercase mb-3">1. DATA_NORMALIZATION</h3>
          <div className="text-white-dim text-xs space-y-3">
            <p>
              All raw metric values are normalized to a 0-100 scale using min-max normalization
              with biome-specific reference values:
            </p>
            <div className="bg-terminal p-4 font-mono">
              M<sub>norm</sub> = ((M<sub>raw</sub> - M<sub>min</sub>) / (M<sub>max</sub> - M<sub>min</sub>)) × 100
              <br /><br />
              where:
              <br />M<sub>raw</sub> = raw metric value
              <br />M<sub>min</sub> = biome-specific minimum reference
              <br />M<sub>max</sub> = biome-specific maximum reference
            </div>
            <p>
              <strong>Reference Value Examples:</strong>
            </p>
            <ul className="list-none space-y-1">
              <li><span className="text-blue">&gt;</span> Tropical rainforest NDVI: 0.7-0.95</li>
              <li><span className="text-blue">&gt;</span> Temperate forest NDVI: 0.5-0.85</li>
              <li><span className="text-blue">&gt;</span> Grassland NDVI: 0.3-0.7</li>
              <li><span className="text-blue">&gt;</span> Desert NDVI: 0.1-0.3</li>
            </ul>
          </div>
        </div>

        {/* Biodiversity Calculation */}
        <div className="border border-white bg-code p-6 mb-6">
          <h3 className="text-lg text-white uppercase mb-3">2. BIODIVERSITY_INDEX_ALGORITHM</h3>
          <div className="text-white-dim text-xs space-y-3">
            <div className="bg-terminal p-4 font-mono">
              H' = -Σ(p<sub>i</sub> × ln(p<sub>i</sub>))
              <br /><br />
              where:
              <br />p<sub>i</sub> = n<sub>i</sub> / N
              <br />n<sub>i</sub> = number of individuals of species i
              <br />N = total number of all individuals
            </div>
            <p><strong>Sampling Effort Correction:</strong></p>
            <div className="bg-terminal p-4 font-mono">
              H'<sub>corrected</sub> = H' × (1 - (S - 1) / (2N))
              <br /><br />
              where:
              <br />S = total number of species observed
              <br />N = total number of observations
            </div>
            <p><strong>Normalization:</strong></p>
            <div className="bg-terminal p-4 font-mono">
              Biodiversity_Score = (H'<sub>corrected</sub> / H'<sub>max,biome</sub>) × 100
            </div>
            <p>
              H'<sub>max,biome</sub> values derived from pristine reference sites:
            </p>
            <ul className="list-none space-y-1">
              <li><span className="text-blue">&gt;</span> Tropical: 4.5-5.2</li>
              <li><span className="text-blue">&gt;</span> Temperate: 3.2-4.1</li>
              <li><span className="text-blue">&gt;</span> Boreal: 2.1-2.9</li>
              <li><span className="text-blue">&gt;</span> Mediterranean: 3.0-3.8</li>
            </ul>
          </div>
        </div>

        {/* Carbon Calculation */}
        <div className="border border-white bg-code p-6 mb-6">
          <h3 className="text-lg text-white uppercase mb-3">3. CARBON_SEQUESTRATION_ESTIMATION</h3>
          <div className="text-white-dim text-xs space-y-3">
            <p><strong>Above-Ground Biomass (AGB):</strong></p>
            <div className="bg-terminal p-4 font-mono">
              AGB = exp(2.134 + 2.53 × ln(DBH)) × WD × H
              <br /><br />
              where:
              <br />DBH = diameter at breast height (cm)
              <br />WD = wood density (g/cm³)
              <br />H = tree height (m)
            </div>
            <p><strong>Below-Ground Biomass (BGB):</strong></p>
            <div className="bg-terminal p-4 font-mono">
              BGB = AGB × R<sub>root:shoot</sub>
              <br /><br />
              R<sub>root:shoot</sub> = root-to-shoot ratio (typically 0.24-0.28)
            </div>
            <p><strong>Total Carbon Stock:</strong></p>
            <div className="bg-terminal p-4 font-mono">
              C<sub>total</sub> = (AGB + BGB) × 0.47 + C<sub>soil</sub>
              <br /><br />
              where 0.47 = carbon fraction of dry biomass
              <br />C<sub>soil</sub> = soil organic carbon (from SoilGrids)
            </div>
            <p><strong>Annual Sequestration Rate:</strong></p>
            <div className="bg-terminal p-4 font-mono">
              ΔC/Δt = (C<sub>t+1</sub> - C<sub>t</sub>) / 1 year
              <br /><br />
              Normalized: Score = (ΔC/Δt / Reference<sub>rate</sub>) × 100
            </div>
          </div>
        </div>

        {/* Water Security */}
        <div className="border border-white bg-code p-6 mb-6">
          <h3 className="text-lg text-white uppercase mb-3">4. WATER_SECURITY_INDEX</h3>
          <div className="text-white-dim text-xs space-y-3">
            <p><strong>Renewable Water Resources:</strong></p>
            <div className="bg-terminal p-4 font-mono">
              RWR = P - ET - Q<sub>out</sub>
              <br /><br />
              where:
              <br />P = precipitation (mm/year)
              <br />ET = evapotranspiration (mm/year)
              <br />Q<sub>out</sub> = runoff (mm/year)
            </div>
            <p><strong>Water Stress Index:</strong></p>
            <div className="bg-terminal p-4 font-mono">
              WSI = W<sub>demand</sub> / W<sub>supply</sub>
              <br /><br />
              WSI categories:
              <br />&lt;0.1: Low stress
              <br />0.1-0.2: Medium-low stress
              <br />0.2-0.4: Medium-high stress
              <br />0.4-0.8: High stress
              <br />&gt;0.8: Extremely high stress
            </div>
            <p><strong>Composite Score:</strong></p>
            <div className="bg-terminal p-4 font-mono">
              WS_Score = (0.4 × RWR_norm) + (0.4 × (1 - WSI)) + (0.2 × Quality)
            </div>
          </div>
        </div>

        {/* Spatial Aggregation */}
        <div className="border border-white bg-code p-6 mb-6">
          <h3 className="text-lg text-white uppercase mb-3">5. SPATIAL_AGGREGATION</h3>
          <div className="text-white-dim text-xs space-y-3">
            <p>
              Metrics are aggregated over a 10km radius (≈314 km²) using inverse distance weighting:
            </p>
            <div className="bg-terminal p-4 font-mono">
              M<sub>agg</sub> = Σ(w<sub>i</sub> × M<sub>i</sub>) / Σw<sub>i</sub>
              <br /><br />
              where:
              <br />w<sub>i</sub> = 1 / d<sub>i</sub>²
              <br />d<sub>i</sub> = distance from center point (km)
              <br />M<sub>i</sub> = metric value at location i
            </div>
            <p><strong>Grid Resolution:</strong></p>
            <ul className="list-none space-y-1">
              <li><span className="text-blue">&gt;</span> Biodiversity: 1km² cells</li>
              <li><span className="text-blue">&gt;</span> Soil: 250m resolution (SoilGrids)</li>
              <li><span className="text-blue">&gt;</span> Forest: 30m resolution (GFW)</li>
              <li><span className="text-blue">&gt;</span> Climate: 1km resolution</li>
            </ul>
          </div>
        </div>

        {/* Temporal Aggregation */}
        <div className="border border-white bg-code p-6 mb-6">
          <h3 className="text-lg text-white uppercase mb-3">6. TEMPORAL_AGGREGATION</h3>
          <div className="text-white-dim text-xs space-y-3">
            <p>
              Time-series data aggregated using exponentially weighted moving averages to
              emphasize recent observations:
            </p>
            <div className="bg-terminal p-4 font-mono">
              EWMA<sub>t</sub> = α × M<sub>t</sub> + (1 - α) × EWMA<sub>t-1</sub>
              <br /><br />
              where:
              <br />α = smoothing parameter (default: 0.2)
              <br />M<sub>t</sub> = metric value at time t
            </div>
            <p><strong>Seasonal Adjustment:</strong></p>
            <div className="bg-terminal p-4 font-mono">
              M<sub>adj</sub> = M<sub>raw</sub> / S<sub>month</sub>
              <br /><br />
              where S<sub>month</sub> = seasonal index for the month
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function StatisticalMethodsSection() {
  return (
    <div className="terminal-window p-6">
      <div className="window-header mb-6">
        <span className="text-white">[STATISTICAL_METHODS]</span>
      </div>
      <div className="prose prose-invert max-w-none font-mono text-sm">
        <h2 className="text-xl text-blue uppercase mb-4">
          &gt;&gt; STATISTICAL_FRAMEWORK
        </h2>

        {/* Outlier Detection */}
        <div className="border-2 border-blue bg-code p-6 mb-6">
          <h3 className="text-lg text-white uppercase mb-3">OUTLIER_DETECTION</h3>
          <div className="text-white-dim text-xs space-y-3">
            <p><strong>Modified Z-Score Method:</strong></p>
            <div className="bg-terminal p-4 font-mono">
              M<sub>i</sub> = 0.6745 × (x<sub>i</sub> - x̃) / MAD
              <br /><br />
              where:
              <br />x̃ = median
              <br />MAD = median absolute deviation
              <br />Outlier if |M<sub>i</sub>| &gt; 3.5
            </div>
            <p>
              Outliers are flagged but not automatically removed; expert review determines
              whether they represent data errors or genuine extreme values.
            </p>
          </div>
        </div>

        {/* Missing Data Imputation */}
        <div className="border border-white bg-code p-6 mb-6">
          <h3 className="text-lg text-white uppercase mb-3">MISSING_DATA_IMPUTATION</h3>
          <div className="text-white-dim text-xs space-y-3">
            <p><strong>K-Nearest Neighbors (KNN) Imputation:</strong></p>
            <div className="bg-terminal p-4 font-mono">
              x̂<sub>missing</sub> = (1/k) × Σ x<sub>neighbor,i</sub>
              <br /><br />
              Distance metric: Haversine for spatial data
              <br />k = 5 neighbors (default)
            </div>
            <p><strong>Spatial Interpolation:</strong></p>
            <div className="bg-terminal p-4 font-mono">
              Inverse Distance Weighting (IDW):
              <br />x̂(s<sub>0</sub>) = Σ(w<sub>i</sub> × x<sub>i</sub>) / Σw<sub>i</sub>
              <br /><br />
              w<sub>i</sub> = 1 / d(s<sub>0</sub>, s<sub>i</sub>)<sup>p</sup>
              <br />p = power parameter (typically 2)
            </div>
            <p><strong>Imputation Quality Metrics:</strong></p>
            <ul className="list-none space-y-1">
              <li><span className="text-blue">&gt;</span> RMSE &lt; 15% of metric range</li>
              <li><span className="text-blue">&gt;</span> R² &gt; 0.75 for cross-validation</li>
              <li><span className="text-blue">&gt;</span> Bias &lt; 5% of mean value</li>
            </ul>
          </div>
        </div>

        {/* Confidence Intervals */}
        <div className="border border-white bg-code p-6 mb-6">
          <h3 className="text-lg text-white uppercase mb-3">CONFIDENCE_INTERVALS</h3>
          <div className="text-white-dim text-xs space-y-3">
            <p><strong>Bootstrap Method (1000 resamples):</strong></p>
            <div className="bg-terminal p-4 font-mono">
              CI<sub>95%</sub> = [Q<sub>0.025</sub>, Q<sub>0.975</sub>]
              <br /><br />
              where Q = quantile of bootstrap distribution
            </div>
            <p><strong>Propagation of Uncertainty:</strong></p>
            <div className="bg-terminal p-4 font-mono">
              For NCI = Σ(w<sub>i</sub> × M<sub>i</sub>):
              <br /><br />
              σ<sub>NCI</sub>² = Σ(w<sub>i</sub>² × σ<sub>Mi</sub>²)
              <br /><br />
              assuming independent errors
            </div>
            <p><strong>Typical Confidence Intervals:</strong></p>
            <ul className="list-none space-y-1">
              <li><span className="text-blue">&gt;</span> NCI Score: ±3-7 points (95% CI)</li>
              <li><span className="text-blue">&gt;</span> Biodiversity Index: ±5-12 points</li>
              <li><span className="text-blue">&gt;</span> Carbon Sequestration: ±8-15 points</li>
              <li><span className="text-blue">&gt;</span> Economic Valuation: ±25-40%</li>
            </ul>
          </div>
        </div>

        {/* Hypothesis Testing */}
        <div className="border border-white bg-code p-6 mb-6">
          <h3 className="text-lg text-white uppercase mb-3">HYPOTHESIS_TESTING</h3>
          <div className="text-white-dim text-xs space-y-3">
            <p><strong>Temporal Change Detection:</strong></p>
            <div className="bg-terminal p-4 font-mono">
              H<sub>0</sub>: NCI<sub>t1</sub> = NCI<sub>t2</sub>
              <br />H<sub>A</sub>: NCI<sub>t1</sub> ≠ NCI<sub>t2</sub>
              <br /><br />
              Test statistic: t = (x̄<sub>1</sub> - x̄<sub>2</sub>) / SE<sub>diff</sub>
              <br />Significance level: α = 0.05
            </div>
            <p><strong>Minimum Detectable Change:</strong></p>
            <div className="bg-terminal p-4 font-mono">
              MDC = 2.8 × SE × √2
              <br /><br />
              Typical MDC for NCI: 8-12 points
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function UncertaintyAnalysisSection() {
  return (
    <div className="terminal-window p-6">
      <div className="window-header mb-6">
        <span className="text-white">[UNCERTAINTY_ANALYSIS]</span>
      </div>
      <div className="prose prose-invert max-w-none font-mono text-sm">
        <h2 className="text-xl text-blue uppercase mb-4">
          &gt;&gt; UNCERTAINTY_QUANTIFICATION
        </h2>

        {/* Sources of Uncertainty */}
        <div className="border-2 border-blue bg-code p-6 mb-6">
          <h3 className="text-lg text-white uppercase mb-3">SOURCES_OF_UNCERTAINTY</h3>
          <div className="space-y-4">
            <div className="border border-white p-3">
              <div className="text-white font-bold mb-2">1. MEASUREMENT_ERROR</div>
              <div className="text-white-dim text-xs">
                <strong>Contribution:</strong> 15-25%
                <br /><strong>Source:</strong> Sensor accuracy, calibration drift, atmospheric interference
                <br /><strong>Example:</strong> NDVI measurements ±0.05 units due to cloud contamination
              </div>
            </div>

            <div className="border border-white p-3">
              <div className="text-white font-bold mb-2">2. SAMPLING_ERROR</div>
              <div className="text-white-dim text-xs">
                <strong>Contribution:</strong> 20-30%
                <br /><strong>Source:</strong> Incomplete spatial/temporal coverage, observer bias
                <br /><strong>Example:</strong> Biodiversity records skewed toward accessible areas
              </div>
            </div>

            <div className="border border-white p-3">
              <div className="text-white font-bold mb-2">3. MODEL_ERROR</div>
              <div className="text-white-dim text-xs">
                <strong>Contribution:</strong> 10-20%
                <br /><strong>Source:</strong> Simplifying assumptions, parameter estimation
                <br /><strong>Example:</strong> Allometric equations for biomass have R² = 0.85-0.92
              </div>
            </div>

            <div className="border border-white p-3">
              <div className="text-white font-bold mb-2">4. AGGREGATION_ERROR</div>
              <div className="text-white-dim text-xs">
                <strong>Contribution:</strong> 10-15%
                <br /><strong>Source:</strong> Spatial heterogeneity, scale mismatch
                <br /><strong>Example:</strong> 250m soil data aggregated to 10km radius
              </div>
            </div>

            <div className="border border-white p-3">
              <div className="text-white font-bold mb-2">5. VALUATION_ERROR</div>
              <div className="text-white-dim text-xs">
                <strong>Contribution:</strong> 30-50% (for economic estimates)
                <br /><strong>Source:</strong> Benefit transfer, regional variation, market changes
                <br /><strong>Example:</strong> Carbon price uncertainty: $100-$300/tonne range
              </div>
            </div>
          </div>
        </div>

        {/* Monte Carlo Simulation */}
        <div className="border border-white bg-code p-6 mb-6">
          <h3 className="text-lg text-white uppercase mb-3">MONTE_CARLO_ANALYSIS</h3>
          <div className="text-white-dim text-xs space-y-3">
            <p>
              Uncertainty propagation using 10,000 Monte Carlo simulations:
            </p>
            <div className="bg-terminal p-4 font-mono">
              For each iteration i = 1 to 10,000:
              <br />1. Sample M<sub>i</sub> from distribution D(μ<sub>M</sub>, σ<sub>M</sub>)
              <br />2. Calculate NCI<sub>i</sub> = Σ(w × M<sub>i</sub>)
              <br />3. Store result
              <br /><br />
              Output:
              <br />NCI<sub>mean</sub> = mean(NCI<sub>1:10000</sub>)
              <br />NCI<sub>std</sub> = std(NCI<sub>1:10000</sub>)
              <br />CI<sub>95%</sub> = [P<sub>2.5</sub>, P<sub>97.5</sub>]
            </div>
            <p><strong>Probability Distributions:</strong></p>
            <ul className="list-none space-y-1">
              <li><span className="text-blue">&gt;</span> Continuous metrics: Normal or Log-normal</li>
              <li><span className="text-blue">&gt;</span> Count data: Poisson or Negative Binomial</li>
              <li><span className="text-blue">&gt;</span> Proportions: Beta distribution</li>
            </ul>
          </div>
        </div>

        {/* Sensitivity Analysis Results */}
        <div className="border border-white bg-code p-6 mb-6">
          <h3 className="text-lg text-white uppercase mb-3">SENSITIVITY_ANALYSIS_RESULTS</h3>
          <div className="text-white-dim text-xs space-y-3">
            <p>
              First-order sensitivity indices (Sobol method) showing which parameters have
              greatest influence on NCI:
            </p>
            <div className="space-y-2">
              <div className="flex justify-between items-center border-b border-white pb-1">
                <span>Ecosystem Health weight</span>
                <span className="text-blue">S<sub>1</sub> = 0.32</span>
              </div>
              <div className="flex justify-between items-center border-b border-white pb-1">
                <span>Biodiversity raw data</span>
                <span className="text-blue">S<sub>1</sub> = 0.24</span>
              </div>
              <div className="flex justify-between items-center border-b border-white pb-1">
                <span>Carbon sequestration rate</span>
                <span className="text-blue">S<sub>1</sub> = 0.18</span>
              </div>
              <div className="flex justify-between items-center border-b border-white pb-1">
                <span>Water stress threshold</span>
                <span className="text-blue">S<sub>1</sub> = 0.14</span>
              </div>
              <div className="flex justify-between items-center border-b border-white pb-1">
                <span>Soil organic carbon</span>
                <span className="text-blue">S<sub>1</sub> = 0.08</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Other parameters</span>
                <span className="text-blue">S<sub>1</sub> = 0.04</span>
              </div>
            </div>
            <p className="mt-4">
              <strong>Interpretation:</strong> Ecosystem Health weight and Biodiversity data
              account for 56% of output variance. Improving these inputs yields greatest
              reduction in uncertainty.
            </p>
          </div>
        </div>

        {/* Uncertainty Reduction Strategies */}
        <div className="border border-white bg-code p-6">
          <h3 className="text-lg text-white uppercase mb-3">UNCERTAINTY_REDUCTION</h3>
          <div className="text-white-dim text-xs">
            <p className="mb-3"><strong>Ongoing Efforts:</strong></p>
            <ul className="list-none space-y-1">
              <li><span className="text-blue">&gt;</span> Increased ground-truth validation sites (target: 200+ by 2025)</li>
              <li><span className="text-blue">&gt;</span> Integration of citizen science platforms for biodiversity</li>
              <li><span className="text-blue">&gt;</span> Regional calibration of economic valuations</li>
              <li><span className="text-blue">&gt;</span> Machine learning for data gap filling</li>
              <li><span className="text-blue">&gt;</span> Ensemble modeling (multiple algorithms, median estimate)</li>
              <li><span className="text-blue">&gt;</span> Real-time uncertainty updates as new data arrives</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CaseStudiesSection() {
  return (
    <div className="space-y-6">
      <div className="terminal-window p-6">
        <div className="window-header mb-6">
          <span className="text-white">[CASE_STUDIES]</span>
        </div>
        <div className="prose prose-invert max-w-none font-mono text-sm">
          <h2 className="text-xl text-blue uppercase mb-4">
            &gt;&gt; REAL-WORLD_APPLICATIONS
          </h2>

          {/* Case Study 1 */}
          <div className="border-2 border-blue bg-code p-6 mb-6">
            <h3 className="text-lg text-white uppercase mb-3">
              CASE_STUDY_1: AMAZON_RAINFOREST_DEFORESTATION
            </h3>
            <div className="text-white-dim text-xs space-y-3">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <strong>Location:</strong> Pará State, Brazil
                  <br /><strong>Coordinates:</strong> -3.47°, -52.36°
                  <br /><strong>Assessment Period:</strong> 2015-2023
                  <br /><strong>Area:</strong> 500 km² study region
                </div>
                <div>
                  <strong>Initial NCI (2015):</strong> 87 (Strong)
                  <br /><strong>Current NCI (2023):</strong> 62 (Moderate)
                  <br /><strong>Change:</strong> -25 points (-29%)
                  <br /><strong>Trend:</strong> Declining
                </div>
              </div>

              <p><strong>Key Findings:</strong></p>
              <ul className="list-none space-y-1">
                <li><span className="text-blue">&gt;</span> Biodiversity Index: 91 → 68 (-25%)</li>
                <li><span className="text-blue">&gt;</span> Carbon Capture: 94 → 58 (-38%)</li>
                <li><span className="text-blue">&gt;</span> Forest cover loss: 18% over 8 years</li>
                <li><span className="text-blue">&gt;</span> 2,847 species observed (2015) → 1,892 (2023)</li>
              </ul>

              <p><strong>Economic Impact:</strong></p>
              <div className="bg-terminal p-3 font-mono">
                Value Lost: $4.2 billion/year
                <br />- Carbon: $1.8B (social cost of emissions)
                <br />- Biodiversity: $1.4B (existence + genetic value)
                <br />- Water regulation: $680M
                <br />- Climate regulation: $320M
              </div>

              <p><strong>Recommendations Implemented:</strong></p>
              <ul className="list-none space-y-1">
                <li><span className="text-blue">&gt;</span> Protected area expansion (+120 km²)</li>
                <li><span className="text-blue">&gt;</span> Sustainable forestry certification</li>
                <li><span className="text-blue">&gt;</span> Payment for ecosystem services program</li>
              </ul>

              <p><strong>Validation:</strong></p>
              <p>
                NCI estimates correlated with independent field surveys (r = 0.91, p &lt; 0.001).
                Economic valuations within ±18% of regional cost-benefit analyses.
              </p>
            </div>
          </div>

          {/* Case Study 2 */}
          <div className="border border-white bg-code p-6 mb-6">
            <h3 className="text-lg text-white uppercase mb-3">
              CASE_STUDY_2: WETLAND_RESTORATION_SUCCESS
            </h3>
            <div className="text-white-dim text-xs space-y-3">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <strong>Location:</strong> Chesapeake Bay, Maryland, USA
                  <br /><strong>Coordinates:</strong> 38.58°, -76.07°
                  <br /><strong>Assessment Period:</strong> 2018-2024
                  <br /><strong>Area:</strong> 85 km² wetland complex
                </div>
                <div>
                  <strong>Pre-restoration NCI (2018):</strong> 48 (At Risk)
                  <br /><strong>Post-restoration NCI (2024):</strong> 73 (Moderate)
                  <br /><strong>Change:</strong> +25 points (+52%)
                  <br /><strong>Trend:</strong> Improving
                </div>
              </div>

              <p><strong>Restoration Actions:</strong></p>
              <ul className="list-none space-y-1">
                <li><span className="text-blue">&gt;</span> Hydrological reconnection (2018-2019)</li>
                <li><span className="text-blue">&gt;</span> Native species reintroduction (2019-2021)</li>
                <li><span className="text-blue">&gt;</span> Invasive species removal (ongoing)</li>
                <li><span className="text-blue">&gt;</span> Buffer zone establishment (2020)</li>
              </ul>

              <p><strong>Metric Improvements:</strong></p>
              <ul className="list-none space-y-1">
                <li><span className="text-blue">&gt;</span> Water Security: 42 → 78 (+86%)</li>
                <li><span className="text-blue">&gt;</span> Biodiversity Index: 51 → 72 (+41%)</li>
                <li><span className="text-blue">&gt;</span> Ecosystem Health: 55 → 76 (+38%)</li>
                <li><span className="text-blue">&gt;</span> Bird species richness: 87 → 142</li>
              </ul>

              <p><strong>Economic Return on Investment:</strong></p>
              <div className="bg-terminal p-3 font-mono">
                Restoration Cost: $18.4 million
                <br />Annual Ecosystem Service Value (2024): $6.2M
                <br />Payback Period: 3.0 years
                <br />20-year NPV (3% discount): $84.3 million
                <br />Benefit-Cost Ratio: 4.6:1
              </div>

              <p><strong>Lessons Learned:</strong></p>
              <ul className="list-none space-y-1">
                <li><span className="text-blue">&gt;</span> Water quality improvements preceded biodiversity recovery (lag: 18 months)</li>
                <li><span className="text-blue">&gt;</span> NCI increased linearly for first 3 years, then plateaued</li>
                <li><span className="text-blue">&gt;</span> Continuous monitoring essential for adaptive management</li>
              </ul>
            </div>
          </div>

          {/* Case Study 3 */}
          <div className="border border-white bg-code p-6">
            <h3 className="text-lg text-white uppercase mb-3">
              CASE_STUDY_3: URBAN_GREEN_INFRASTRUCTURE
            </h3>
            <div className="text-white-dim text-xs space-y-3">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <strong>Location:</strong> Singapore City
                  <br /><strong>Coordinates:</strong> 1.35°, 103.82°
                  <br /><strong>Assessment Period:</strong> 2020-2024
                  <br /><strong>Area:</strong> 45 km² urban core
                </div>
                <div>
                  <strong>Baseline NCI (2020):</strong> 58 (Moderate)
                  <br /><strong>Current NCI (2024):</strong> 68 (Moderate)
                  <br /><strong>Change:</strong> +10 points (+17%)
                  <br /><strong>Trend:</strong> Stable/Improving
                </div>
              </div>

              <p><strong>Green Infrastructure Investments:</strong></p>
              <ul className="list-none space-y-1">
                <li><span className="text-blue">&gt;</span> Skyrise greenery: 100+ buildings retrofitted</li>
                <li><span className="text-blue">&gt;</span> Park connectors: 180 km added</li>
                <li><span className="text-blue">&gt;</span> Urban forests: 8 new sites (total 35 ha)</li>
                <li><span className="text-blue">&gt;</span> Rain gardens & bioswales: 450+ installations</li>
              </ul>

              <p><strong>Measured Benefits:</strong></p>
              <ul className="list-none space-y-1">
                <li><span className="text-blue">&gt;</span> Air Quality Index: 68 → 52 (improvement)</li>
                <li><span className="text-blue">&gt;</span> Urban Heat Island effect: -1.8°C average reduction</li>
                <li><span className="text-blue">&gt;</span> Stormwater runoff: 23% reduction</li>
                <li><span className="text-blue">&gt;</span> Urban biodiversity: +34 bird species, +127 plant species</li>
              </ul>

              <p><strong>Health & Economic Co-benefits:</strong></p>
              <div className="bg-terminal p-3 font-mono">
                Healthcare Savings: $28M/year
                <br />- Reduced respiratory illness
                <br />- Lower heat-related mortality
                <br />- Mental health improvements
                <br /><br />
                Property Value Increases: 8-12% premium for green-adjacent properties
                <br />Tourism Revenue: +$45M/year attributed to "City in a Garden" branding
              </div>

              <p><strong>Scalability Assessment:</strong></p>
              <p>
                Framework successfully adapted for high-density urban context. Modified weight
                scheme (reduced Carbon Capture importance, increased Air Quality & Social Value).
                Results demonstrate NCI applicability beyond "pristine" ecosystems.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TechnicalAppendixSection() {
  return (
    <div className="terminal-window p-6">
      <div className="window-header mb-6">
        <span className="text-white">[TECHNICAL_APPENDIX]</span>
      </div>
      <div className="prose prose-invert max-w-none font-mono text-xs">
        <h2 className="text-lg text-blue uppercase mb-4">
          &gt;&gt; SUPPLEMENTARY_TECHNICAL_INFORMATION
        </h2>

        {/* Biome Reference Values */}
        <div className="border-2 border-blue bg-code p-4 mb-4">
          <h3 className="text-white text-sm uppercase mb-2">
            APPENDIX_A: BIOME_REFERENCE_VALUES
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-[10px] border-collapse">
              <thead>
                <tr className="border-b border-white">
                  <th className="text-left p-2">Biome</th>
                  <th className="text-left p-2">NDVI Range</th>
                  <th className="text-left p-2">Shannon H'</th>
                  <th className="text-left p-2">Carbon t/ha/yr</th>
                  <th className="text-left p-2">Soil OC %</th>
                </tr>
              </thead>
              <tbody className="text-white-dim">
                <tr className="border-b border-white">
                  <td className="p-2">Tropical Rainforest</td>
                  <td className="p-2">0.70-0.95</td>
                  <td className="p-2">4.5-5.2</td>
                  <td className="p-2">8-15</td>
                  <td className="p-2">3-8</td>
                </tr>
                <tr className="border-b border-white">
                  <td className="p-2">Temperate Forest</td>
                  <td className="p-2">0.50-0.85</td>
                  <td className="p-2">3.2-4.1</td>
                  <td className="p-2">4-9</td>
                  <td className="p-2">2-6</td>
                </tr>
                <tr className="border-b border-white">
                  <td className="p-2">Boreal Forest</td>
                  <td className="p-2">0.40-0.70</td>
                  <td className="p-2">2.1-2.9</td>
                  <td className="p-2">2-5</td>
                  <td className="p-2">5-15</td>
                </tr>
                <tr className="border-b border-white">
                  <td className="p-2">Savanna/Grassland</td>
                  <td className="p-2">0.30-0.70</td>
                  <td className="p-2">2.8-3.6</td>
                  <td className="p-2">1-4</td>
                  <td className="p-2">1-3</td>
                </tr>
                <tr className="border-b border-white">
                  <td className="p-2">Mediterranean</td>
                  <td className="p-2">0.35-0.75</td>
                  <td className="p-2">3.0-3.8</td>
                  <td className="p-2">2-6</td>
                  <td className="p-2">1-4</td>
                </tr>
                <tr className="border-b border-white">
                  <td className="p-2">Tundra</td>
                  <td className="p-2">0.20-0.50</td>
                  <td className="p-2">1.5-2.3</td>
                  <td className="p-2">0.5-2</td>
                  <td className="p-2">10-30</td>
                </tr>
                <tr>
                  <td className="p-2">Desert</td>
                  <td className="p-2">0.10-0.30</td>
                  <td className="p-2">0.8-1.6</td>
                  <td className="p-2">0.1-0.5</td>
                  <td className="p-2">0.5-2</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Ecosystem Service Values Table */}
        <div className="border border-white bg-code p-4 mb-4">
          <h3 className="text-white text-sm uppercase mb-2">
            APPENDIX_B: ECOSYSTEM_SERVICE_VALUES_BY_BIOME
          </h3>
          <p className="text-white-dim mb-2">Values in USD per hectare per year (2024 dollars)</p>
          <div className="overflow-x-auto">
            <table className="w-full text-[10px] border-collapse">
              <thead>
                <tr className="border-b border-white">
                  <th className="text-left p-2">Biome</th>
                  <th className="text-left p-2">Total Value</th>
                  <th className="text-left p-2">Carbon</th>
                  <th className="text-left p-2">Water</th>
                  <th className="text-left p-2">Biodiversity</th>
                  <th className="text-left p-2">Other</th>
                </tr>
              </thead>
              <tbody className="text-white-dim">
                <tr className="border-b border-white">
                  <td className="p-2">Tropical Forest</td>
                  <td className="p-2">$5,382</td>
                  <td className="p-2">$2,220</td>
                  <td className="p-2">$1,465</td>
                  <td className="p-2">$1,124</td>
                  <td className="p-2">$573</td>
                </tr>
                <tr className="border-b border-white">
                  <td className="p-2">Temperate Forest</td>
                  <td className="p-2">$3,137</td>
                  <td className="p-2">$1,258</td>
                  <td className="p-2">$941</td>
                  <td className="p-2">$627</td>
                  <td className="p-2">$311</td>
                </tr>
                <tr className="border-b border-white">
                  <td className="p-2">Wetlands</td>
                  <td className="p-2">$6,725</td>
                  <td className="p-2">$1,614</td>
                  <td className="p-2">$3,363</td>
                  <td className="p-2">$1,210</td>
                  <td className="p-2">$538</td>
                </tr>
                <tr className="border-b border-white">
                  <td className="p-2">Grassland</td>
                  <td className="p-2">$1,654</td>
                  <td className="p-2">$496</td>
                  <td className="p-2">$661</td>
                  <td className="p-2">$331</td>
                  <td className="p-2">$166</td>
                </tr>
                <tr className="border-b border-white">
                  <td className="p-2">Cropland</td>
                  <td className="p-2">$1,342</td>
                  <td className="p-2">$268</td>
                  <td className="p-2">$537</td>
                  <td className="p-2">$268</td>
                  <td className="p-2">$269</td>
                </tr>
                <tr>
                  <td className="p-2">Urban Green Space</td>
                  <td className="p-2">$2,897</td>
                  <td className="p-2">$435</td>
                  <td className="p-2">$870</td>
                  <td className="p-2">$580</td>
                  <td className="p-2">$1,012</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-white-dim mt-2 text-[10px]">
            Source: Meta-analysis of 300+ valuation studies (Costanza et al. 2014, updated 2024)
          </p>
        </div>

        {/* Glossary */}
        <div className="border border-white bg-code p-4 mb-4">
          <h3 className="text-white text-sm uppercase mb-2">
            APPENDIX_C: GLOSSARY
          </h3>
          <div className="space-y-2 text-white-dim">
            <div className="border-b border-white pb-2">
              <strong>Above-Ground Biomass (AGB):</strong> Total mass of living plant material
              above the soil surface, typically measured in tonnes per hectare (t/ha).
            </div>
            <div className="border-b border-white pb-2">
              <strong>Allometric Equation:</strong> Mathematical relationship between tree
              dimensions (e.g., diameter, height) and biomass, derived from destructive sampling.
            </div>
            <div className="border-b border-white pb-2">
              <strong>Benefit Transfer:</strong> Method of estimating economic values by adapting
              results from existing studies to a new context, adjusted for differences in income,
              ecosystem type, and other factors.
            </div>
            <div className="border-b border-white pb-2">
              <strong>Ecosystem Services:</strong> Benefits people obtain from ecosystems, including
              provisioning (food, water), regulating (climate, disease), cultural (spiritual,
              recreational), and supporting (nutrient cycling, soil formation) services.
            </div>
            <div className="border-b border-white pb-2">
              <strong>EWMA (Exponentially Weighted Moving Average):</strong> Time-series smoothing
              technique that gives more weight to recent observations while retaining information
              from older data.
            </div>
            <div className="border-b border-white pb-2">
              <strong>Haversine Distance:</strong> Formula for calculating great-circle distance
              between two points on a sphere given their longitudes and latitudes.
            </div>
            <div className="border-b border-white pb-2">
              <strong>NDVI (Normalized Difference Vegetation Index):</strong> Satellite-derived
              indicator of vegetation health and density, calculated from red and near-infrared
              reflectance. Range: -1 to +1 (higher = more vigorous vegetation).
            </div>
            <div className="border-b border-white pb-2">
              <strong>Natural Capital:</strong> World's stocks of natural assets including geology,
              soil, air, water, and all living things. Provides ecosystem services that make human
              life possible.
            </div>
            <div className="border-b border-white pb-2">
              <strong>Shannon-Wiener Index (H'):</strong> Measure of species diversity accounting
              for both richness (number of species) and evenness (relative abundance). Higher values
              indicate greater diversity.
            </div>
            <div className="border-b border-white pb-2">
              <strong>Social Cost of Carbon (SCC):</strong> Estimate of economic damages associated
              with emitting one additional tonne of CO₂, used in cost-benefit analysis of climate
              policies. Current EPA estimate: $185/tonne (2024).
            </div>
            <div>
              <strong>Water Stress Index (WSI):</strong> Ratio of water demand to renewable supply.
              Values &gt; 0.4 indicate high stress; &gt; 0.8 extremely high stress.
            </div>
          </div>
        </div>

        {/* Software & Dependencies */}
        <div className="border border-white bg-code p-4">
          <h3 className="text-white text-sm uppercase mb-2">
            APPENDIX_D: SOFTWARE_&_COMPUTATIONAL_ENVIRONMENT
          </h3>
          <div className="space-y-2 text-white-dim">
            <div><strong>Framework:</strong> Next.js 16.0.3, React 19</div>
            <div><strong>Language:</strong> TypeScript 5.x</div>
            <div><strong>APIs:</strong> RESTful endpoints (serverless functions)</div>
            <div><strong>Database:</strong> Not required (real-time API aggregation)</div>
            <div><strong>Geospatial Libraries:</strong> Leaflet.js, Turf.js</div>
            <div><strong>Statistical Computing:</strong> JavaScript Math library, custom implementations</div>
            <div><strong>Data Visualization:</strong> Recharts, D3.js</div>
            <div><strong>Export Formats:</strong> CSV, XLSX (SheetJS)</div>
            <div className="pt-2 border-t border-white mt-2">
              <strong>Source Code:</strong> Open-source components available
              <br /><strong>License:</strong> Framework methodology proprietary; API integrations per provider terms
              <br /><strong>Documentation:</strong> https://gaia-ai.earth/docs
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
