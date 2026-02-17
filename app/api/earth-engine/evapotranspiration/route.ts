import { NextRequest, NextResponse } from 'next/server';
import { getEvapotranspiration } from '@/lib/earthEngine';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const lat = parseFloat(searchParams.get('lat') || '0');
  const lon = parseFloat(searchParams.get('lon') || '0');
  const radius = parseFloat(searchParams.get('radius') || '10');
  const location = searchParams.get('location') || `${lat.toFixed(2)}°, ${lon.toFixed(2)}°`;

  console.log(`[EARTH ENGINE ET] Request for ${location} (${lat}, ${lon})`);

  try {
    const etData = await getEvapotranspiration(lat, lon, radius);

    return NextResponse.json({
      location,
      coordinates: { lat, lon },
      radius_km: radius,
      evapotranspiration: etData,
      source: 'MODIS MOD16A2',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[EARTH ENGINE ET] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch evapotranspiration data' },
      { status: 500 }
    );
  }
}
