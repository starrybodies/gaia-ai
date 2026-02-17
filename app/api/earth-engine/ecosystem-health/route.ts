import { NextRequest, NextResponse } from 'next/server';
import { calculateEcosystemHealth } from '@/lib/earthEngine';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const lat = parseFloat(searchParams.get('lat') || '0');
  const lon = parseFloat(searchParams.get('lon') || '0');
  const radius = parseFloat(searchParams.get('radius') || '10');
  const location = searchParams.get('location') || `${lat.toFixed(2)}°, ${lon.toFixed(2)}°`;

  console.log(`[EARTH ENGINE ECOSYSTEM HEALTH] Request for ${location} (${lat}, ${lon})`);

  try {
    const healthData = await calculateEcosystemHealth(lat, lon, radius);

    return NextResponse.json({
      location,
      coordinates: { lat, lon },
      radius_km: radius,
      ecosystemHealth: healthData,
      methodology: {
        description: 'Composite score combining vegetation health (NDVI), land cover diversity, and temperature stability',
        weights: {
          ndvi: 0.5,
          landCoverDiversity: 0.3,
          temperatureStability: 0.2,
        },
        dataSources: [
          'Sentinel-2 L2A (10m multispectral imagery)',
          'ESA WorldCover (10m land cover classification)',
          'MODIS LST (1km land surface temperature)',
        ],
      },
      source: 'Google Earth Engine (simulated - add credentials for real data)',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[EARTH ENGINE ECOSYSTEM HEALTH] Error:', error);
    return NextResponse.json(
      { error: 'Failed to calculate ecosystem health' },
      { status: 500 }
    );
  }
}
