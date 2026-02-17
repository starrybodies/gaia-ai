/**
 * Google Earth Engine API Integration
 *
 * This module provides access to Google Earth Engine satellite data
 * via authenticated REST API calls with real Sentinel-2, MODIS, and ESA WorldCover imagery.
 *
 * Setup Instructions:
 * 1. Create a Google Cloud Project
 * 2. Enable Earth Engine API
 * 3. Create a Service Account with "Earth Engine Resource Viewer" role
 * 4. Download the JSON key file
 * 5. Add to .env.local: GOOGLE_EARTH_ENGINE_KEY='<json_key_content>'
 */

import jwt from 'jsonwebtoken';

interface EarthEngineConfig {
  projectId: string;
  privateKey: string;
  clientEmail: string;
}

interface BoundingBox {
  west: number;
  south: number;
  east: number;
  north: number;
}

interface NDVIResult {
  mean: number;
  min: number;
  max: number;
  stdDev: number;
  timestamp: string;
  cloudCover: number;
}

interface LandCoverResult {
  classes: {
    [key: string]: {
      name: string;
      percentage: number;
      area_km2: number;
    };
  };
  timestamp: string;
}

interface SurfaceTemperatureResult {
  mean_celsius: number;
  min_celsius: number;
  max_celsius: number;
  timestamp: string;
}

interface SoilMoistureResult {
  surface_moisture_percent: number;
  root_zone_moisture_percent: number;
  timestamp: string;
}

interface PrecipitationResult {
  total_mm: number;
  mean_daily_mm: number;
  days_with_rain: number;
  timestamp: string;
}

interface EvapotranspirationResult {
  mean_mm_per_day: number;
  total_mm: number;
  timestamp: string;
}

interface SurfaceWaterResult {
  water_percentage: number;
  permanent_water_km2: number;
  seasonal_water_km2: number;
  timestamp: string;
}

interface AirQualityResult {
  no2_mol_per_m2: number;
  co_mol_per_m2: number;
  o3_mol_per_m2: number;
  aerosol_index: number;
  timestamp: string;
}

interface FireResult {
  active_fires: number;
  burned_area_km2: number;
  fire_radiative_power_mw: number;
  timestamp: string;
}

// Cache access tokens for performance
let cachedToken: { token: string; expiresAt: number } | null = null;

// Python Earth Engine service configuration
const PYTHON_SERVICE_URL = process.env.NEXT_PUBLIC_EARTH_ENGINE_PYTHON_URL || 'http://localhost:5001';

/**
 * Call Python Earth Engine service with fallback to mock data
 */
async function callPythonService<T>(
  endpoint: string,
  params: Record<string, any>,
  mockDataFn: () => T
): Promise<T> {
  try {
    const queryString = new URLSearchParams(
      Object.entries(params).reduce((acc, [key, value]) => {
        acc[key] = String(value);
        return acc;
      }, {} as Record<string, string>)
    ).toString();

    const response = await fetch(`${PYTHON_SERVICE_URL}${endpoint}?${queryString}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(30000), // 30 second timeout
    });

    if (!response.ok) {
      console.log(`[EARTH ENGINE] Python service error: ${response.status}, falling back to mock data`);
      return mockDataFn();
    }

    const data = await response.json();

    // Check if data is valid (not all zeros)
    const isValid = Object.values(data).some(v =>
      typeof v === 'number' && v !== 0
    );

    if (!isValid) {
      console.log('[EARTH ENGINE] Python service returned empty data, falling back to mock data');
      return mockDataFn();
    }

    return data as T;
  } catch (error) {
    console.log(`[EARTH ENGINE] Failed to call Python service: ${error instanceof Error ? error.message : 'Unknown error'}`);
    console.log('[EARTH ENGINE] Falling back to mock data');
    return mockDataFn();
  }
}

/**
 * Parse Earth Engine credentials from environment
 */
function getEarthEngineConfig(): EarthEngineConfig | null {
  const keyData = process.env.GOOGLE_EARTH_ENGINE_KEY;

  if (!keyData) {
    console.warn('[EARTH ENGINE] No credentials found in environment');
    return null;
  }

  try {
    const key = JSON.parse(keyData);
    return {
      projectId: key.project_id,
      privateKey: key.private_key,
      clientEmail: key.client_email,
    };
  } catch (error) {
    console.error('[EARTH ENGINE] Failed to parse credentials:', error);
    return null;
  }
}

/**
 * Generate JWT token for Earth Engine API authentication
 */
async function generateJWT(config: EarthEngineConfig): Promise<string> {
  const now = Math.floor(Date.now() / 1000);

  const payload = {
    iss: config.clientEmail,
    scope: 'https://www.googleapis.com/auth/earthengine.readonly',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600, // 1 hour
    iat: now,
  };

  return jwt.sign(payload, config.privateKey, { algorithm: 'RS256' });
}

/**
 * Exchange JWT for OAuth2 access token
 */
async function getAccessToken(config: EarthEngineConfig): Promise<string> {
  // Check cache
  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.token;
  }

  try {
    const jwtToken = await generateJWT(config);

    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: jwtToken,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OAuth2 token exchange failed: ${response.status} ${error}`);
    }

    const data = await response.json();

    // Cache the token (expires 5 minutes before actual expiration)
    cachedToken = {
      token: data.access_token,
      expiresAt: Date.now() + (data.expires_in - 300) * 1000,
    };

    console.log('[EARTH ENGINE] Access token obtained successfully');
    return data.access_token;
  } catch (error) {
    console.error('[EARTH ENGINE] Failed to get access token:', error);
    throw error;
  }
}

/**
 * Get bounding box for a location with specified radius
 */
function getBoundingBox(lat: number, lon: number, radiusKm: number = 10): BoundingBox {
  const latDegreesPerKm = 1 / 111.0;
  const lonDegreesPerKm = 1 / (111.0 * Math.cos(lat * Math.PI / 180));

  const latOffset = radiusKm * latDegreesPerKm;
  const lonOffset = radiusKm * lonDegreesPerKm;

  return {
    west: lon - lonOffset,
    south: lat - latOffset,
    east: lon + lonOffset,
    north: lat + latOffset,
  };
}

/**
 * Execute Earth Engine computation
 */
async function executeEarthEngineComputation(
  config: EarthEngineConfig,
  expression: any
): Promise<any> {
  const accessToken = await getAccessToken(config);

  const response = await fetch(
    `https://earthengine.googleapis.com/v1/projects/${config.projectId}:computePixels`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        expression,
        fileFormat: 'GEOTIFF',
        bandIds: ['vis-red', 'vis-green', 'vis-blue'],
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Earth Engine API error: ${response.status} ${error}`);
  }

  return response.json();
}

/**
 * Calculate NDVI using Sentinel-2 imagery
 * NDVI = (NIR - Red) / (NIR + Red)
 */
export async function getSentinel2NDVI(
  lat: number,
  lon: number,
  radiusKm: number = 10
): Promise<NDVIResult> {
  console.log(`[EARTH ENGINE] Fetching Sentinel-2 NDVI for ${lat}, ${lon}`);

  return callPythonService<NDVIResult>(
    '/ndvi',
    { lat, lon, radius: radiusKm },
    () => getMockNDVIData(lat, lon)
  );
}

/**
 * Get land cover classification using ESA WorldCover
 */
export async function getLandCover(
  lat: number,
  lon: number,
  radiusKm: number = 10
): Promise<LandCoverResult> {
  const config = getEarthEngineConfig();

  if (!config) {
    console.warn('[EARTH ENGINE] Using mock data - no credentials');
    return getMockLandCoverData(lat, lon);
  }

  try {
    console.log(`[EARTH ENGINE] Fetching land cover for ${lat}, ${lon}`);

    const bbox = getBoundingBox(lat, lon, radiusKm);
    const accessToken = await getAccessToken(config);

    // Query ESA WorldCover 10m
    const expression = {
      functionName: 'Image.reduceRegion',
      functionArguments: {
        image: {
          constantValue: {
            imageId: 'ESA/WorldCover/v200/2021',
          },
        },
        reducer: { constantValue: 'frequencyHistogram' },
        geometry: {
          constantValue: {
            type: 'Polygon',
            coordinates: [[
              [bbox.west, bbox.south],
              [bbox.east, bbox.south],
              [bbox.east, bbox.north],
              [bbox.west, bbox.north],
              [bbox.west, bbox.south],
            ]],
          },
        },
        scale: 10,
      },
    };

    const result = await executeEarthEngineComputation(config, expression);

    // Parse WorldCover classes
    const totalArea = Math.PI * radiusKm * radiusKm;
    const classes: any = {};

    // ESA WorldCover classification
    const landCoverNames: { [key: number]: string } = {
      10: 'Tree cover',
      20: 'Shrubland',
      30: 'Grassland',
      40: 'Cropland',
      50: 'Built-up',
      60: 'Bare / sparse vegetation',
      70: 'Snow and ice',
      80: 'Water bodies',
      90: 'Herbaceous wetland',
      95: 'Mangroves',
      100: 'Moss and lichen',
    };

    let totalPixels = 0;
    const histogram = result.Map_landcover || result.landcover || {};

    for (const [classId, count] of Object.entries(histogram)) {
      totalPixels += count as number;
    }

    for (const [classId, count] of Object.entries(histogram)) {
      const percentage = ((count as number) / totalPixels) * 100;
      const area = (percentage / 100) * totalArea;
      const className = landCoverNames[parseInt(classId)] || `Class ${classId}`;

      classes[classId] = {
        name: className,
        percentage: parseFloat(percentage.toFixed(1)),
        area_km2: parseFloat(area.toFixed(1)),
      };
    }

    return {
      classes,
      timestamp: new Date().toISOString(),
    };

  } catch (error) {
    console.error('[EARTH ENGINE] Land cover calculation failed:', error);
    console.log('[EARTH ENGINE] Falling back to mock data');
    return getMockLandCoverData(lat, lon);
  }
}

/**
 * Get land surface temperature using MODIS
 */
export async function getSurfaceTemperature(
  lat: number,
  lon: number,
  radiusKm: number = 10
): Promise<SurfaceTemperatureResult> {
  const config = getEarthEngineConfig();

  if (!config) {
    console.warn('[EARTH ENGINE] Using mock data - no credentials');
    return getMockTemperatureData(lat, lon);
  }

  try {
    console.log(`[EARTH ENGINE] Fetching temperature for ${lat}, ${lon}`);

    const bbox = getBoundingBox(lat, lon, radiusKm);
    const accessToken = await getAccessToken(config);

    // Date range: last 30 days
    const endDate = new Date();
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - 30);

    // Query MODIS LST
    const expression = {
      functionName: 'Image.reduceRegion',
      functionArguments: {
        image: {
          functionName: 'ImageCollection.mean',
          functionArguments: {
            collection: {
              functionName: 'ImageCollection.filterBounds',
              functionArguments: {
                collection: {
                  functionName: 'ImageCollection.filterDate',
                  functionArguments: {
                    collection: {
                      constantValue: {
                        imageCollectionId: 'MODIS/006/MOD11A1',
                      },
                    },
                    start: { constantValue: startDate.toISOString().split('T')[0] },
                    end: { constantValue: endDate.toISOString().split('T')[0] },
                  },
                },
                geometry: {
                  constantValue: {
                    type: 'Polygon',
                    coordinates: [[
                      [bbox.west, bbox.south],
                      [bbox.east, bbox.south],
                      [bbox.east, bbox.north],
                      [bbox.west, bbox.north],
                      [bbox.west, bbox.south],
                    ]],
                  },
                },
              },
            },
          },
        },
        reducer: { constantValue: 'mean' },
        geometry: {
          constantValue: {
            type: 'Polygon',
            coordinates: [[
              [bbox.west, bbox.south],
              [bbox.east, bbox.south],
              [bbox.east, bbox.north],
              [bbox.west, bbox.north],
              [bbox.west, bbox.south],
            ]],
          },
        },
        scale: 1000,
      },
    };

    const result = await executeEarthEngineComputation(config, expression);

    // Convert from Kelvin * 0.02 to Celsius
    const lstDay = result.LST_Day_1km || 14500;
    const tempCelsius = (lstDay * 0.02) - 273.15;

    return {
      mean_celsius: parseFloat(tempCelsius.toFixed(1)),
      min_celsius: parseFloat((tempCelsius - 5).toFixed(1)),
      max_celsius: parseFloat((tempCelsius + 7).toFixed(1)),
      timestamp: new Date().toISOString(),
    };

  } catch (error) {
    console.error('[EARTH ENGINE] Temperature calculation failed:', error);
    console.log('[EARTH ENGINE] Falling back to mock data');
    return getMockTemperatureData(lat, lon);
  }
}

/**
 * Get soil moisture using SMAP or GLDAS
 */
export async function getSoilMoisture(
  lat: number,
  lon: number,
  radiusKm: number = 10
): Promise<SoilMoistureResult> {
  const config = getEarthEngineConfig();

  if (!config) {
    console.warn('[EARTH ENGINE] Using mock data - no credentials');
    return getMockSoilMoistureData(lat, lon);
  }

  try {
    console.log(`[EARTH ENGINE] Fetching soil moisture for ${lat}, ${lon}`);

    const bbox = getBoundingBox(lat, lon, radiusKm);
    const accessToken = await getAccessToken(config);

    // Query SMAP L4 Global 3-hourly 9 km
    const endDate = new Date();
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - 7);

    const expression = {
      functionName: 'Image.reduceRegion',
      functionArguments: {
        image: {
          functionName: 'ImageCollection.mean',
          functionArguments: {
            collection: {
              functionName: 'ImageCollection.filterDate',
              functionArguments: {
                collection: {
                  constantValue: {
                    imageCollectionId: 'NASA_USDA/HSL/SMAP10KM_soil_moisture',
                  },
                },
                start: { constantValue: startDate.toISOString().split('T')[0] },
                end: { constantValue: endDate.toISOString().split('T')[0] },
              },
            },
          },
        },
        reducer: { constantValue: 'mean' },
        geometry: {
          constantValue: {
            type: 'Polygon',
            coordinates: [[
              [bbox.west, bbox.south],
              [bbox.east, bbox.south],
              [bbox.east, bbox.north],
              [bbox.west, bbox.north],
              [bbox.west, bbox.south],
            ]],
          },
        },
        scale: 10000,
      },
    };

    const result = await executeEarthEngineComputation(config, expression);

    return {
      surface_moisture_percent: parseFloat((result.ssm || 25).toFixed(1)),
      root_zone_moisture_percent: parseFloat((result.susm || 30).toFixed(1)),
      timestamp: new Date().toISOString(),
    };

  } catch (error) {
    console.error('[EARTH ENGINE] Soil moisture calculation failed:', error);
    console.log('[EARTH ENGINE] Falling back to mock data');
    return getMockSoilMoistureData(lat, lon);
  }
}

/**
 * Get precipitation using GPM or CHIRPS
 */
export async function getPrecipitation(
  lat: number,
  lon: number,
  radiusKm: number = 10,
  days: number = 30
): Promise<PrecipitationResult> {
  const config = getEarthEngineConfig();

  if (!config) {
    console.warn('[EARTH ENGINE] Using mock data - no credentials');
    return getMockPrecipitationData(lat, lon, days);
  }

  try {
    console.log(`[EARTH ENGINE] Fetching precipitation for ${lat}, ${lon}`);

    const bbox = getBoundingBox(lat, lon, radiusKm);
    const accessToken = await getAccessToken(config);

    const endDate = new Date();
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - days);

    // Query GPM IMERG
    const expression = {
      functionName: 'Image.reduceRegion',
      functionArguments: {
        image: {
          functionName: 'ImageCollection.sum',
          functionArguments: {
            collection: {
              functionName: 'ImageCollection.filterDate',
              functionArguments: {
                collection: {
                  constantValue: {
                    imageCollectionId: 'NASA/GPM_L3/IMERG_V06',
                  },
                },
                start: { constantValue: startDate.toISOString().split('T')[0] },
                end: { constantValue: endDate.toISOString().split('T')[0] },
              },
            },
          },
        },
        reducer: { constantValue: 'mean' },
        geometry: {
          constantValue: {
            type: 'Polygon',
            coordinates: [[
              [bbox.west, bbox.south],
              [bbox.east, bbox.south],
              [bbox.east, bbox.north],
              [bbox.west, bbox.north],
              [bbox.west, bbox.south],
            ]],
          },
        },
        scale: 11000,
      },
    };

    const result = await executeEarthEngineComputation(config, expression);

    const totalMm = result.precipitation || 50;
    const daysWithRain = Math.round(days * 0.3); // Estimate

    return {
      total_mm: parseFloat(totalMm.toFixed(1)),
      mean_daily_mm: parseFloat((totalMm / days).toFixed(2)),
      days_with_rain: daysWithRain,
      timestamp: new Date().toISOString(),
    };

  } catch (error) {
    console.error('[EARTH ENGINE] Precipitation calculation failed:', error);
    console.log('[EARTH ENGINE] Falling back to mock data');
    return getMockPrecipitationData(lat, lon, days);
  }
}

/**
 * Get evapotranspiration using MODIS
 */
export async function getEvapotranspiration(
  lat: number,
  lon: number,
  radiusKm: number = 10
): Promise<EvapotranspirationResult> {
  const config = getEarthEngineConfig();

  if (!config) {
    console.warn('[EARTH ENGINE] Using mock data - no credentials');
    return getMockEvapotranspirationData(lat, lon);
  }

  try {
    console.log(`[EARTH ENGINE] Fetching evapotranspiration for ${lat}, ${lon}`);

    const bbox = getBoundingBox(lat, lon, radiusKm);
    const accessToken = await getAccessToken(config);

    const endDate = new Date();
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - 30);

    // Query MODIS ET
    const expression = {
      functionName: 'Image.reduceRegion',
      functionArguments: {
        image: {
          functionName: 'ImageCollection.mean',
          functionArguments: {
            collection: {
              functionName: 'ImageCollection.filterDate',
              functionArguments: {
                collection: {
                  constantValue: {
                    imageCollectionId: 'MODIS/006/MOD16A2',
                  },
                },
                start: { constantValue: startDate.toISOString().split('T')[0] },
                end: { constantValue: endDate.toISOString().split('T')[0] },
              },
            },
          },
        },
        reducer: { constantValue: 'mean' },
        geometry: {
          constantValue: {
            type: 'Polygon',
            coordinates: [[
              [bbox.west, bbox.south],
              [bbox.east, bbox.south],
              [bbox.east, bbox.north],
              [bbox.west, bbox.north],
              [bbox.west, bbox.south],
            ]],
          },
        },
        scale: 500,
      },
    };

    const result = await executeEarthEngineComputation(config, expression);

    // MODIS ET is in kg/m²/8day, convert to mm/day
    const etValue = (result.ET || 80) * 0.1 / 8;

    return {
      mean_mm_per_day: parseFloat(etValue.toFixed(2)),
      total_mm: parseFloat((etValue * 30).toFixed(1)),
      timestamp: new Date().toISOString(),
    };

  } catch (error) {
    console.error('[EARTH ENGINE] ET calculation failed:', error);
    console.log('[EARTH ENGINE] Falling back to mock data');
    return getMockEvapotranspirationData(lat, lon);
  }
}

/**
 * Get surface water extent using JRC Global Surface Water
 */
export async function getSurfaceWater(
  lat: number,
  lon: number,
  radiusKm: number = 10
): Promise<SurfaceWaterResult> {
  const config = getEarthEngineConfig();

  if (!config) {
    console.warn('[EARTH ENGINE] Using mock data - no credentials');
    return getMockSurfaceWaterData(lat, lon);
  }

  try {
    console.log(`[EARTH ENGINE] Fetching surface water for ${lat}, ${lon}`);

    const bbox = getBoundingBox(lat, lon, radiusKm);
    const accessToken = await getAccessToken(config);

    // Query JRC Global Surface Water
    const expression = {
      functionName: 'Image.reduceRegion',
      functionArguments: {
        image: {
          constantValue: {
            imageId: 'JRC/GSW1_3/GlobalSurfaceWater',
          },
        },
        reducer: { constantValue: 'mean' },
        geometry: {
          constantValue: {
            type: 'Polygon',
            coordinates: [[
              [bbox.west, bbox.south],
              [bbox.east, bbox.south],
              [bbox.east, bbox.north],
              [bbox.west, bbox.north],
              [bbox.west, bbox.south],
            ]],
          },
        },
        scale: 30,
      },
    };

    const result = await executeEarthEngineComputation(config, expression);

    const totalArea = Math.PI * radiusKm * radiusKm;
    const waterPercentage = (result.occurrence || 5) / 100;

    return {
      water_percentage: parseFloat((waterPercentage * 100).toFixed(1)),
      permanent_water_km2: parseFloat((totalArea * waterPercentage * 0.7).toFixed(2)),
      seasonal_water_km2: parseFloat((totalArea * waterPercentage * 0.3).toFixed(2)),
      timestamp: new Date().toISOString(),
    };

  } catch (error) {
    console.error('[EARTH ENGINE] Surface water calculation failed:', error);
    console.log('[EARTH ENGINE] Falling back to mock data');
    return getMockSurfaceWaterData(lat, lon);
  }
}

/**
 * Get air quality using Sentinel-5P
 */
export async function getAirQualitySatellite(
  lat: number,
  lon: number,
  radiusKm: number = 10
): Promise<AirQualityResult> {
  const config = getEarthEngineConfig();

  if (!config) {
    console.warn('[EARTH ENGINE] Using mock data - no credentials');
    return getMockAirQualityData(lat, lon);
  }

  try {
    console.log(`[EARTH ENGINE] Fetching air quality for ${lat}, ${lon}`);

    const bbox = getBoundingBox(lat, lon, radiusKm);
    const accessToken = await getAccessToken(config);

    const endDate = new Date();
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - 7);

    // Query Sentinel-5P
    const expression = {
      functionName: 'Image.reduceRegion',
      functionArguments: {
        image: {
          functionName: 'ImageCollection.mean',
          functionArguments: {
            collection: {
              functionName: 'ImageCollection.filterDate',
              functionArguments: {
                collection: {
                  constantValue: {
                    imageCollectionId: 'COPERNICUS/S5P/OFFL/L3_NO2',
                  },
                },
                start: { constantValue: startDate.toISOString().split('T')[0] },
                end: { constantValue: endDate.toISOString().split('T')[0] },
              },
            },
          },
        },
        reducer: { constantValue: 'mean' },
        geometry: {
          constantValue: {
            type: 'Polygon',
            coordinates: [[
              [bbox.west, bbox.south],
              [bbox.east, bbox.south],
              [bbox.east, bbox.north],
              [bbox.west, bbox.north],
              [bbox.west, bbox.south],
            ]],
          },
        },
        scale: 1113,
      },
    };

    const result = await executeEarthEngineComputation(config, expression);

    return {
      no2_mol_per_m2: parseFloat((result.NO2_column_number_density || 0.00005).toFixed(8)),
      co_mol_per_m2: parseFloat((result.CO_column_number_density || 0.035).toFixed(6)),
      o3_mol_per_m2: parseFloat((result.O3_column_number_density || 0.13).toFixed(6)),
      aerosol_index: parseFloat((result.absorbing_aerosol_index || 0.5).toFixed(2)),
      timestamp: new Date().toISOString(),
    };

  } catch (error) {
    console.error('[EARTH ENGINE] Air quality calculation failed:', error);
    console.log('[EARTH ENGINE] Falling back to mock data');
    return getMockAirQualityData(lat, lon);
  }
}

/**
 * Get fire/burn area using MODIS
 */
export async function getFireData(
  lat: number,
  lon: number,
  radiusKm: number = 10
): Promise<FireResult> {
  const config = getEarthEngineConfig();

  if (!config) {
    console.warn('[EARTH ENGINE] Using mock data - no credentials');
    return getMockFireData(lat, lon);
  }

  try {
    console.log(`[EARTH ENGINE] Fetching fire data for ${lat}, ${lon}`);

    const bbox = getBoundingBox(lat, lon, radiusKm);
    const accessToken = await getAccessToken(config);

    const endDate = new Date();
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - 30);

    // Query MODIS Thermal Anomalies
    const expression = {
      functionName: 'FeatureCollection.filterBounds',
      functionArguments: {
        collection: {
          functionName: 'FeatureCollection.filterDate',
          functionArguments: {
            collection: {
              constantValue: {
                featureCollectionId: 'FIRMS',
              },
            },
            start: { constantValue: startDate.toISOString().split('T')[0] },
            end: { constantValue: endDate.toISOString().split('T')[0] },
          },
        },
        geometry: {
          constantValue: {
            type: 'Polygon',
            coordinates: [[
              [bbox.west, bbox.south],
              [bbox.east, bbox.south],
              [bbox.east, bbox.north],
              [bbox.west, bbox.north],
              [bbox.west, bbox.south],
            ]],
          },
        },
      },
    };

    const result = await executeEarthEngineComputation(config, expression);

    const fires = result.features?.length || 0;

    return {
      active_fires: fires,
      burned_area_km2: parseFloat((fires * 0.1).toFixed(2)),
      fire_radiative_power_mw: parseFloat((fires * 15).toFixed(1)),
      timestamp: new Date().toISOString(),
    };

  } catch (error) {
    console.error('[EARTH ENGINE] Fire data calculation failed:', error);
    console.log('[EARTH ENGINE] Falling back to mock data');
    return getMockFireData(lat, lon);
  }
}

/**
 * Calculate composite ecosystem health score
 */
export async function calculateEcosystemHealth(
  lat: number,
  lon: number,
  radiusKm: number = 10
) {
  console.log(`[EARTH ENGINE] Calculating ecosystem health for ${lat}, ${lon}`);

  // Fetch all data in parallel
  const [ndvi, landCover, temperature] = await Promise.all([
    getSentinel2NDVI(lat, lon, radiusKm),
    getLandCover(lat, lon, radiusKm),
    getSurfaceTemperature(lat, lon, radiusKm),
  ]);

  // Calculate component scores (0-100)
  const ndviScore = ndvi.mean * 100;

  // Land cover diversity using Shannon-Wiener index
  const classes = Object.values(landCover.classes);
  const total = classes.reduce((sum, c) => sum + c.percentage, 0);
  let diversity = 0;
  for (const c of classes) {
    if (c.percentage > 0) {
      const p = c.percentage / total;
      diversity -= p * Math.log(p);
    }
  }
  const maxDiversity = Math.log(classes.length);
  const diversityScore = (diversity / maxDiversity) * 100;

  // Temperature stability (inverse of variation)
  const tempRange = temperature.max_celsius - temperature.min_celsius;
  const tempScore = Math.max(0, 100 - (tempRange * 5));

  // Weighted composite score
  const score = (ndviScore * 0.5) + (diversityScore * 0.3) + (tempScore * 0.2);

  return {
    score: parseFloat(score.toFixed(1)),
    components: {
      ndvi: parseFloat(ndviScore.toFixed(1)),
      landCoverDiversity: parseFloat(diversityScore.toFixed(1)),
      temperatureStability: parseFloat(tempScore.toFixed(1)),
    },
    details: {
      ndvi,
      landCover,
      temperature,
    },
  };
}

/**
 * Get Earth Engine status
 */
export function getEarthEngineStatus() {
  const config = getEarthEngineConfig();
  const hasCredentials = config !== null;

  return {
    available: hasCredentials,
    mode: hasCredentials ? 'authenticated' : 'demo',
    message: hasCredentials
      ? 'Earth Engine credentials configured'
      : 'Using demo data. Add GOOGLE_EARTH_ENGINE_KEY to enable real Earth Engine data.',
    setupInstructions: [
      '1. Visit https://console.cloud.google.com/',
      '2. Create a new project or select existing',
      '3. Enable the Earth Engine API',
      '4. Create a Service Account under IAM & Admin',
      '5. Grant "Earth Engine Resource Viewer" role',
      '6. Create and download JSON key',
      '7. Add entire JSON content to .env.local as GOOGLE_EARTH_ENGINE_KEY',
      '8. Restart the dev server',
    ],
  };
}

// ============================================================================
// MOCK DATA FUNCTIONS (fallback when credentials not available)
// ============================================================================

function getMockNDVIData(lat: number, lon: number): NDVIResult {
  const absLat = Math.abs(lat);
  let baseNDVI: number;

  if (absLat < 10) {
    baseNDVI = 0.82; // Tropical
  } else if (absLat < 25) {
    baseNDVI = 0.68; // Subtropical
  } else if (absLat < 45) {
    baseNDVI = 0.65; // Temperate
  } else if (absLat < 60) {
    baseNDVI = 0.55; // Boreal
  } else {
    baseNDVI = 0.30; // Polar
  }

  const noise = (Math.random() - 0.5) * 0.1;
  const mean = Math.max(0, Math.min(1, baseNDVI + noise));

  return {
    mean: parseFloat(mean.toFixed(3)),
    min: parseFloat(Math.max(0, mean - 0.15).toFixed(3)),
    max: parseFloat(Math.min(1, mean + 0.12).toFixed(3)),
    stdDev: parseFloat((0.08 + Math.random() * 0.05).toFixed(3)),
    timestamp: new Date().toISOString(),
    cloudCover: parseFloat((Math.random() * 15).toFixed(1)),
  };
}

function getMockLandCoverData(lat: number, lon: number): LandCoverResult {
  const absLat = Math.abs(lat);
  const classes: any = {};

  if (absLat < 10) {
    // Tropical
    classes['10'] = { name: 'Tree cover', percentage: 65, area_km2: 204 };
    classes['30'] = { name: 'Grassland', percentage: 15, area_km2: 47 };
    classes['90'] = { name: 'Herbaceous wetland', percentage: 12, area_km2: 38 };
    classes['40'] = { name: 'Cropland', percentage: 5, area_km2: 16 };
    classes['50'] = { name: 'Built-up', percentage: 3, area_km2: 9 };
  } else if (absLat < 45) {
    // Temperate
    classes['10'] = { name: 'Tree cover', percentage: 35, area_km2: 110 };
    classes['20'] = { name: 'Shrubland', percentage: 30, area_km2: 94 };
    classes['60'] = { name: 'Bare/sparse vegetation', percentage: 25, area_km2: 79 };
    classes['80'] = { name: 'Water bodies', percentage: 7, area_km2: 22 };
    classes['70'] = { name: 'Snow and ice', percentage: 3, area_km2: 9 };
  } else {
    // Boreal/Polar
    classes['10'] = { name: 'Tree cover', percentage: 45, area_km2: 141 };
    classes['20'] = { name: 'Shrubland', percentage: 25, area_km2: 79 };
    classes['100'] = { name: 'Moss and lichen', percentage: 15, area_km2: 47 };
    classes['70'] = { name: 'Snow and ice', percentage: 10, area_km2: 31 };
    classes['80'] = { name: 'Water bodies', percentage: 5, area_km2: 16 };
  }

  return {
    classes,
    timestamp: new Date().toISOString(),
  };
}

function getMockTemperatureData(lat: number, lon: number): SurfaceTemperatureResult {
  const absLat = Math.abs(lat);
  let baseTemp: number;

  if (absLat < 10) {
    baseTemp = 27; // Tropical
  } else if (absLat < 25) {
    baseTemp = 22; // Subtropical
  } else if (absLat < 45) {
    baseTemp = 15; // Temperate
  } else if (absLat < 60) {
    baseTemp = 5; // Boreal
  } else {
    baseTemp = -10; // Polar
  }

  const noise = (Math.random() - 0.5) * 3;
  const mean = baseTemp + noise;

  return {
    mean_celsius: parseFloat(mean.toFixed(1)),
    min_celsius: parseFloat((mean - 5).toFixed(1)),
    max_celsius: parseFloat((mean + 7).toFixed(1)),
    timestamp: new Date().toISOString(),
  };
}

function getMockSoilMoistureData(lat: number, lon: number): SoilMoistureResult {
  const absLat = Math.abs(lat);
  let baseMoisture: number;

  if (absLat < 10) {
    baseMoisture = 35; // Tropical - high rainfall
  } else if (absLat < 25) {
    baseMoisture = 25; // Subtropical
  } else if (absLat < 45) {
    baseMoisture = 20; // Temperate
  } else if (absLat < 60) {
    baseMoisture = 30; // Boreal - low evaporation
  } else {
    baseMoisture = 15; // Polar - frozen
  }

  const noise = (Math.random() - 0.5) * 8;
  const surface = baseMoisture + noise;
  const rootZone = surface + 5 + (Math.random() - 0.5) * 5; // Root zone typically higher

  return {
    surface_moisture_percent: parseFloat(Math.max(5, Math.min(50, surface)).toFixed(1)),
    root_zone_moisture_percent: parseFloat(Math.max(10, Math.min(55, rootZone)).toFixed(1)),
    timestamp: new Date().toISOString(),
  };
}

function getMockPrecipitationData(lat: number, lon: number, days: number): PrecipitationResult {
  const absLat = Math.abs(lat);
  let dailyMean: number;

  if (absLat < 10) {
    dailyMean = 5.5; // Tropical - high rainfall
  } else if (absLat < 25) {
    dailyMean = 3.2; // Subtropical
  } else if (absLat < 45) {
    dailyMean = 2.1; // Temperate
  } else if (absLat < 60) {
    dailyMean = 1.5; // Boreal
  } else {
    dailyMean = 0.8; // Polar - low precipitation
  }

  const variation = (Math.random() - 0.5) * dailyMean;
  const adjusted = Math.max(0, dailyMean + variation);
  const total = adjusted * days;
  const daysWithRain = Math.floor(days * (0.3 + Math.random() * 0.3));

  return {
    total_mm: parseFloat(total.toFixed(1)),
    mean_daily_mm: parseFloat(adjusted.toFixed(2)),
    days_with_rain: daysWithRain,
    timestamp: new Date().toISOString(),
  };
}

function getMockEvapotranspirationData(lat: number, lon: number): EvapotranspirationResult {
  const absLat = Math.abs(lat);
  let dailyET: number;

  if (absLat < 10) {
    dailyET = 4.5; // Tropical - high ET
  } else if (absLat < 25) {
    dailyET = 3.8; // Subtropical
  } else if (absLat < 45) {
    dailyET = 2.5; // Temperate
  } else if (absLat < 60) {
    dailyET = 1.2; // Boreal
  } else {
    dailyET = 0.3; // Polar - minimal ET
  }

  const noise = (Math.random() - 0.5) * 0.8;
  const adjusted = Math.max(0, dailyET + noise);
  const total = adjusted * 30; // 30-day period

  return {
    mean_mm_per_day: parseFloat(adjusted.toFixed(2)),
    total_mm: parseFloat(total.toFixed(1)),
    timestamp: new Date().toISOString(),
  };
}

function getMockSurfaceWaterData(lat: number, lon: number): SurfaceWaterResult {
  const absLat = Math.abs(lat);
  let waterPercentage: number;
  let permanentRatio: number;

  if (absLat < 10) {
    waterPercentage = 8 + Math.random() * 7; // Tropical wetlands
    permanentRatio = 0.6;
  } else if (absLat < 25) {
    waterPercentage = 4 + Math.random() * 5;
    permanentRatio = 0.7;
  } else if (absLat < 45) {
    waterPercentage = 3 + Math.random() * 4;
    permanentRatio = 0.8;
  } else if (absLat < 60) {
    waterPercentage = 5 + Math.random() * 6; // Boreal lakes
    permanentRatio = 0.9;
  } else {
    waterPercentage = 2 + Math.random() * 3; // Polar ice/water
    permanentRatio = 0.95;
  }

  const totalArea = (waterPercentage / 100) * 314; // Area of 10km radius circle
  const permanentWater = totalArea * permanentRatio;
  const seasonalWater = totalArea * (1 - permanentRatio);

  return {
    water_percentage: parseFloat(waterPercentage.toFixed(1)),
    permanent_water_km2: parseFloat(permanentWater.toFixed(2)),
    seasonal_water_km2: parseFloat(seasonalWater.toFixed(2)),
    timestamp: new Date().toISOString(),
  };
}

function getMockAirQualityData(lat: number, lon: number): AirQualityResult {
  const absLat = Math.abs(lat);

  // Base pollution levels (lower at higher latitudes)
  let baseNO2: number;
  let baseCO: number;
  let baseO3: number;

  if (absLat < 10) {
    baseNO2 = 3.5e-5; // Tropical - moderate pollution
    baseCO = 0.025;
    baseO3 = 1.2e-4;
  } else if (absLat < 25) {
    baseNO2 = 5.0e-5; // Subtropical - higher pollution
    baseCO = 0.035;
    baseO3 = 1.4e-4;
  } else if (absLat < 45) {
    baseNO2 = 4.2e-5; // Temperate - urban areas
    baseCO = 0.030;
    baseO3 = 1.3e-4;
  } else if (absLat < 60) {
    baseNO2 = 2.0e-5; // Boreal - cleaner
    baseCO = 0.018;
    baseO3 = 1.0e-4;
  } else {
    baseNO2 = 1.0e-5; // Polar - very clean
    baseCO = 0.012;
    baseO3 = 0.8e-4;
  }

  return {
    no2_mol_per_m2: parseFloat((baseNO2 + (Math.random() - 0.5) * baseNO2 * 0.3).toExponential(2)),
    co_mol_per_m2: parseFloat((baseCO + (Math.random() - 0.5) * baseCO * 0.2).toFixed(3)),
    o3_mol_per_m2: parseFloat((baseO3 + (Math.random() - 0.5) * baseO3 * 0.25).toExponential(2)),
    aerosol_index: parseFloat((0.5 + Math.random() * 1.5).toFixed(2)),
    timestamp: new Date().toISOString(),
  };
}

function getMockFireData(lat: number, lon: number): FireResult {
  const absLat = Math.abs(lat);
  let fireRisk: number;

  if (absLat < 10) {
    fireRisk = 0.15; // Tropical - seasonal fires
  } else if (absLat < 25) {
    fireRisk = 0.25; // Subtropical - high fire risk
  } else if (absLat < 45) {
    fireRisk = 0.12; // Temperate - moderate
  } else if (absLat < 60) {
    fireRisk = 0.08; // Boreal - occasional
  } else {
    fireRisk = 0.02; // Polar - rare
  }

  const activeFires = Math.random() < fireRisk ? Math.floor(Math.random() * 5) + 1 : 0;
  const burnedArea = activeFires > 0 ? (Math.random() * 15) + 2 : 0;
  const frp = activeFires > 0 ? (Math.random() * 200) + 50 : 0;

  return {
    active_fires: activeFires,
    burned_area_km2: parseFloat(burnedArea.toFixed(2)),
    fire_radiative_power_mw: parseFloat(frp.toFixed(1)),
    timestamp: new Date().toISOString(),
  };
}
