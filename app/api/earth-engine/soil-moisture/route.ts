import { NextRequest, NextResponse } from 'next/server';
import { getSoilMoisture } from '@/lib/earthEngine';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const lat = parseFloat(searchParams.get('lat') || '0');
  const lon = parseFloat(searchParams.get('lon') || '0');
  const radius = parseFloat(searchParams.get('radius') || '10');
  const location = searchParams.get('location') || `${lat.toFixed(2)}°, ${lon.toFixed(2)}°`;

  console.log(`[EARTH ENGINE SOIL] Request for ${location} (${lat}, ${lon})`);

  try {
    const soilData = await getSoilMoisture(lat, lon, radius);

    return NextResponse.json({
      location,
      coordinates: { lat, lon },
      radius_km: radius,
      soil_moisture: soilData,
      source: 'SMAP L4 Global 3-hourly 9km',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[EARTH ENGINE SOIL] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch soil moisture data' },
      { status: 500 }
    );
  }
}
