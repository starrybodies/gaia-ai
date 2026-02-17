import { NextRequest, NextResponse } from 'next/server';
import { getSurfaceWater } from '@/lib/earthEngine';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const lat = parseFloat(searchParams.get('lat') || '0');
  const lon = parseFloat(searchParams.get('lon') || '0');
  const radius = parseFloat(searchParams.get('radius') || '10');
  const location = searchParams.get('location') || `${lat.toFixed(2)}°, ${lon.toFixed(2)}°`;

  console.log(`[EARTH ENGINE WATER] Request for ${location} (${lat}, ${lon})`);

  try {
    const waterData = await getSurfaceWater(lat, lon, radius);

    return NextResponse.json({
      location,
      coordinates: { lat, lon },
      radius_km: radius,
      surface_water: waterData,
      source: 'JRC Global Surface Water',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[EARTH ENGINE WATER] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch surface water data' },
      { status: 500 }
    );
  }
}
