import { NextRequest, NextResponse } from 'next/server';
import { getLandCover } from '@/lib/earthEngine';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const lat = parseFloat(searchParams.get('lat') || '0');
  const lon = parseFloat(searchParams.get('lon') || '0');
  const radius = parseFloat(searchParams.get('radius') || '10');
  const location = searchParams.get('location') || `${lat.toFixed(2)}°, ${lon.toFixed(2)}°`;

  console.log(`[EARTH ENGINE LAND COVER] Request for ${location} (${lat}, ${lon})`);

  try {
    const landCoverData = await getLandCover(lat, lon, radius);

    return NextResponse.json({
      location,
      coordinates: { lat, lon },
      radius_km: radius,
      landCover: landCoverData,
      source: 'ESA WorldCover / MODIS (simulated - add credentials for real data)',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[EARTH ENGINE LAND COVER] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch land cover data' },
      { status: 500 }
    );
  }
}
