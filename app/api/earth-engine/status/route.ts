import { NextResponse } from 'next/server';
import { getEarthEngineStatus } from '@/lib/earthEngine';

export async function GET() {
  const status = getEarthEngineStatus();

  return NextResponse.json({
    status: status.mode === 'authenticated' ? 'active' : 'demo',
    ...status,
    endpoints: {
      ndvi: '/api/earth-engine/ndvi?lat=48.8167&lon=-123.5',
      landCover: '/api/earth-engine/landcover?lat=48.8167&lon=-123.5',
      ecosystemHealth: '/api/earth-engine/ecosystem-health?lat=48.8167&lon=-123.5',
      soilMoisture: '/api/earth-engine/soil-moisture?lat=48.8167&lon=-123.5',
      precipitation: '/api/earth-engine/precipitation?lat=48.8167&lon=-123.5&days=30',
      evapotranspiration: '/api/earth-engine/evapotranspiration?lat=48.8167&lon=-123.5',
      surfaceWater: '/api/earth-engine/surface-water?lat=48.8167&lon=-123.5',
      airQuality: '/api/earth-engine/air-quality-satellite?lat=48.8167&lon=-123.5',
      fire: '/api/earth-engine/fire?lat=48.8167&lon=-123.5',
    },
    note: status.mode === 'demo'
      ? 'Currently using simulated data based on biome models. Add Earth Engine credentials to access real satellite data.'
      : 'Earth Engine authenticated and ready to use.',
  });
}
