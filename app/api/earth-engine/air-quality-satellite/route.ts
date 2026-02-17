import { NextRequest, NextResponse } from 'next/server';
import { getAirQualitySatellite } from '@/lib/earthEngine';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const lat = parseFloat(searchParams.get('lat') || '0');
  const lon = parseFloat(searchParams.get('lon') || '0');
  const radius = parseFloat(searchParams.get('radius') || '10');
  const location = searchParams.get('location') || `${lat.toFixed(2)}°, ${lon.toFixed(2)}°`;

  console.log(`[EARTH ENGINE AIR] Request for ${location} (${lat}, ${lon})`);

  try {
    const airData = await getAirQualitySatellite(lat, lon, radius);

    return NextResponse.json({
      location,
      coordinates: { lat, lon },
      radius_km: radius,
      air_quality: airData,
      source: 'Sentinel-5P TROPOMI',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[EARTH ENGINE AIR] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch air quality data' },
      { status: 500 }
    );
  }
}
