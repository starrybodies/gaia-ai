import * as XLSX from 'xlsx';

interface ExportData {
  location: {
    name: string;
    lat: number;
    lon: number;
    timestamp: string;
  };
  nci: {
    score: number;
    rating: string;
  };
  metrics: {
    ecosystemHealth: number;
    biodiversityIndex: number;
    carbonCapture: number;
    waterSecurity: number;
    soilViability: number;
    climateResilience: number;
  };
  valuation: {
    totalAnnualValue: number;
    valueAtRisk: number;
    breakdown: {
      carbon: number;
      water: number;
      biodiversity: number;
      soil: number;
      pollination: number;
      genetic: number;
    };
  };
  rawData?: {
    weather?: any;
    airQuality?: any;
    climate?: any;
    biodiversity?: any;
    soil?: any;
    carbon?: any;
    deforestation?: any;
    satellite?: any;
    ocean?: any;
  };
}

export function generateCSV(data: ExportData): string {
  const rows: string[] = [];

  // Header
  rows.push('GAIA Natural Capital Framework v2.0 - Data Export');
  rows.push('');

  // Metadata
  rows.push('METADATA');
  rows.push(`Location,${data.location.name}`);
  rows.push(`Latitude,${data.location.lat}`);
  rows.push(`Longitude,${data.location.lon}`);
  rows.push(`Export Date,${data.location.timestamp}`);
  rows.push(`Methodology,GAIA Proprietary Natural Capital Framework v2.0`);
  rows.push('');

  // Natural Capital Index
  rows.push('NATURAL CAPITAL INDEX');
  rows.push(`NCI Score,${data.nci.score}`);
  rows.push(`Rating,${data.nci.rating}`);
  rows.push('');

  // Core Metrics
  rows.push('CORE METRICS');
  rows.push('Metric,Score (0-100),Weight (%)');
  rows.push(`Ecosystem Health,${data.metrics.ecosystemHealth},22`);
  rows.push(`Biodiversity Index,${data.metrics.biodiversityIndex},20`);
  rows.push(`Carbon Capture,${data.metrics.carbonCapture},18`);
  rows.push(`Water Security,${data.metrics.waterSecurity},18`);
  rows.push(`Soil Viability,${data.metrics.soilViability},12`);
  rows.push(`Climate Resilience,${data.metrics.climateResilience},10`);
  rows.push('');

  // Economic Valuation
  rows.push('ECONOMIC VALUATION (USD/year)');
  rows.push(`Total Annual Value,${data.valuation.totalAnnualValue}`);
  rows.push(`Value at Risk,${data.valuation.valueAtRisk}`);
  rows.push('');
  rows.push('Service Breakdown');
  rows.push(`Carbon Sequestration,${data.valuation.breakdown.carbon}`);
  rows.push(`Water Provisioning,${data.valuation.breakdown.water}`);
  rows.push(`Biodiversity Value,${data.valuation.breakdown.biodiversity}`);
  rows.push(`Soil Formation,${data.valuation.breakdown.soil}`);
  rows.push(`Pollination Services,${data.valuation.breakdown.pollination}`);
  rows.push(`Genetic Resources,${data.valuation.breakdown.genetic}`);
  rows.push('');

  // Footer
  rows.push('CITATION');
  rows.push('GAIA-AI (2024). Natural Capital Framework v2.0: Methodology and Technical Documentation.');
  rows.push('Environmental Intelligence Platform. https://gaia-ai.earth/docs');

  return rows.join('\n');
}

export function generateXLSX(data: ExportData): ArrayBuffer {
  const workbook = XLSX.utils.book_new();

  // Sheet 1: Summary
  const summaryData = [
    ['GAIA Natural Capital Framework v2.0 - Data Export'],
    [],
    ['METADATA'],
    ['Location', data.location.name],
    ['Latitude', data.location.lat],
    ['Longitude', data.location.lon],
    ['Export Date', data.location.timestamp],
    ['Methodology', 'GAIA Proprietary Natural Capital Framework v2.0'],
    [],
    ['NATURAL CAPITAL INDEX'],
    ['NCI Score', data.nci.score],
    ['Rating', data.nci.rating],
    [],
    ['CORE METRICS'],
    ['Metric', 'Score (0-100)', 'Weight (%)', 'Weighted Score'],
    ['Ecosystem Health', data.metrics.ecosystemHealth, 22, (data.metrics.ecosystemHealth * 0.22).toFixed(2)],
    ['Biodiversity Index', data.metrics.biodiversityIndex, 20, (data.metrics.biodiversityIndex * 0.20).toFixed(2)],
    ['Carbon Capture', data.metrics.carbonCapture, 18, (data.metrics.carbonCapture * 0.18).toFixed(2)],
    ['Water Security', data.metrics.waterSecurity, 18, (data.metrics.waterSecurity * 0.18).toFixed(2)],
    ['Soil Viability', data.metrics.soilViability, 12, (data.metrics.soilViability * 0.12).toFixed(2)],
    ['Climate Resilience', data.metrics.climateResilience, 10, (data.metrics.climateResilience * 0.10).toFixed(2)],
  ];
  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');

  // Sheet 2: Economic Valuation
  const valuationData = [
    ['ECONOMIC VALUATION'],
    [],
    ['Total Annual Value (USD)', data.valuation.totalAnnualValue],
    ['Value at Risk (USD)', data.valuation.valueAtRisk],
    [],
    ['SERVICE BREAKDOWN'],
    ['Ecosystem Service', 'Annual Value (USD)', 'Percentage'],
    ['Carbon Sequestration', data.valuation.breakdown.carbon, `${((data.valuation.breakdown.carbon / data.valuation.totalAnnualValue) * 100).toFixed(1)}%`],
    ['Water Provisioning', data.valuation.breakdown.water, `${((data.valuation.breakdown.water / data.valuation.totalAnnualValue) * 100).toFixed(1)}%`],
    ['Biodiversity Value', data.valuation.breakdown.biodiversity, `${((data.valuation.breakdown.biodiversity / data.valuation.totalAnnualValue) * 100).toFixed(1)}%`],
    ['Soil Formation', data.valuation.breakdown.soil, `${((data.valuation.breakdown.soil / data.valuation.totalAnnualValue) * 100).toFixed(1)}%`],
    ['Pollination Services', data.valuation.breakdown.pollination, `${((data.valuation.breakdown.pollination / data.valuation.totalAnnualValue) * 100).toFixed(1)}%`],
    ['Genetic Resources', data.valuation.breakdown.genetic, `${((data.valuation.breakdown.genetic / data.valuation.totalAnnualValue) * 100).toFixed(1)}%`],
    [],
    ['METHODOLOGY'],
    ['Assessment Area', '10km radius (≈31,400 hectares)'],
    ['Valuation Method', 'Benefit transfer from Costanza et al. (2014), de Groot et al. (2012)'],
    ['Social Cost of Carbon', '$185/tonne CO₂ (EPA 2024)'],
    ['Confidence Interval', '±25-40%'],
  ];
  const valuationSheet = XLSX.utils.aoa_to_sheet(valuationData);
  XLSX.utils.book_append_sheet(workbook, valuationSheet, 'Economic Valuation');

  // Sheet 3: Detailed Calculations
  const calculationsData = [
    ['NATURAL CAPITAL INDEX CALCULATION'],
    [],
    ['Formula', 'NCI = Σ(wi × Mi)'],
    ['where wi = weight for metric i, Mi = normalized metric score (0-100)'],
    [],
    ['DETAILED BREAKDOWN'],
    ['Metric', 'Raw Score', 'Weight', 'Weighted Score', 'Contribution to NCI'],
    [
      'Ecosystem Health',
      data.metrics.ecosystemHealth,
      '0.22',
      (data.metrics.ecosystemHealth * 0.22).toFixed(2),
      `${((data.metrics.ecosystemHealth * 0.22 / data.nci.score) * 100).toFixed(1)}%`
    ],
    [
      'Biodiversity Index',
      data.metrics.biodiversityIndex,
      '0.20',
      (data.metrics.biodiversityIndex * 0.20).toFixed(2),
      `${((data.metrics.biodiversityIndex * 0.20 / data.nci.score) * 100).toFixed(1)}%`
    ],
    [
      'Carbon Capture',
      data.metrics.carbonCapture,
      '0.18',
      (data.metrics.carbonCapture * 0.18).toFixed(2),
      `${((data.metrics.carbonCapture * 0.18 / data.nci.score) * 100).toFixed(1)}%`
    ],
    [
      'Water Security',
      data.metrics.waterSecurity,
      '0.18',
      (data.metrics.waterSecurity * 0.18).toFixed(2),
      `${((data.metrics.waterSecurity * 0.18 / data.nci.score) * 100).toFixed(1)}%`
    ],
    [
      'Soil Viability',
      data.metrics.soilViability,
      '0.12',
      (data.metrics.soilViability * 0.12).toFixed(2),
      `${((data.metrics.soilViability * 0.12 / data.nci.score) * 100).toFixed(1)}%`
    ],
    [
      'Climate Resilience',
      data.metrics.climateResilience,
      '0.10',
      (data.metrics.climateResilience * 0.10).toFixed(2),
      `${((data.metrics.climateResilience * 0.10 / data.nci.score) * 100).toFixed(1)}%`
    ],
    [],
    ['TOTAL NCI', '', '1.00', data.nci.score.toFixed(2), '100%'],
  ];
  const calculationsSheet = XLSX.utils.aoa_to_sheet(calculationsData);
  XLSX.utils.book_append_sheet(workbook, calculationsSheet, 'Calculations');

  // Sheet 4: Data Sources
  const sourcesData = [
    ['DATA SOURCES'],
    [],
    ['API/Dataset', 'Coverage', 'Update Frequency', 'Usage'],
    ['GBIF', '2+ billion species records', 'Daily', 'Biodiversity Index'],
    ['Open-Meteo', 'Global, 1km resolution', 'Hourly', 'Weather & Climate'],
    ['WAQI', '12,000+ stations', 'Real-time (15-60min)', 'Air Quality'],
    ['ISRIC SoilGrids', 'Global, 250m resolution', 'Annual', 'Soil Viability'],
    ['Global Forest Watch', 'Global forest cover', 'Annual', 'Deforestation & Carbon'],
    ['NASA EONET', 'Global events', 'Near real-time', 'Satellite Events'],
    ['NOAA NDBC', 'Marine/coastal', 'Hourly', 'Ocean Health'],
    [],
    ['REFERENCES'],
    ['Costanza et al. (2014)', 'Changes in global ecosystem service values', 'Global Environmental Change, 26, 152-158'],
    ['de Groot et al. (2012)', 'Global estimates of ecosystem service values', 'Ecosystem Services, 1(1), 50-61'],
    ['EPA (2024)', 'Social Cost of Carbon Report', 'U.S. Environmental Protection Agency'],
    ['TEEB (2010)', 'Economics of Ecosystems and Biodiversity', 'UNEP Geneva'],
    ['Natural Capital Coalition (2016)', 'Natural Capital Protocol', 'www.naturalcapitalcoalition.org'],
  ];
  const sourcesSheet = XLSX.utils.aoa_to_sheet(sourcesData);
  XLSX.utils.book_append_sheet(workbook, sourcesSheet, 'Data Sources');

  // Sheet 5: Raw Data (if available)
  if (data.rawData) {
    const rawDataArray: any[] = [['RAW DATA'], []];

    Object.entries(data.rawData).forEach(([key, value]) => {
      if (value) {
        rawDataArray.push([key.toUpperCase()]);
        rawDataArray.push([JSON.stringify(value, null, 2)]);
        rawDataArray.push([]);
      }
    });

    const rawDataSheet = XLSX.utils.aoa_to_sheet(rawDataArray);
    XLSX.utils.book_append_sheet(workbook, rawDataSheet, 'Raw Data');
  }

  // Generate buffer
  return XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });
}

export function downloadCSV(data: ExportData, filename: string = 'natural-capital-data.csv') {
  const csv = generateCSV(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function downloadXLSX(data: ExportData, filename: string = 'natural-capital-data.xlsx') {
  const buffer = generateXLSX(data);
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
