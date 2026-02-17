import { NextRequest, NextResponse } from 'next/server';
import { getPrecipitation } from '@/lib/earthEngine';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const lat = parseFloat(searchParams.get('lat') || '0');
  const lon = parseFloat(searchParams.get('lon') || '0');
  const radius = parseFloat(searchParams.get('radius') || '10');
  const days = parseInt(searchParams.get('days') || '30');
  const location = searchParams.get('location') || `${lat.toFixed(2)}°, ${lon.toFixed(2)}°`;

  console.log(`[EARTH ENGINE PRECIP] Request for ${location} (${lat}, ${lon})`);

  try {
    const precipData = await getPrecipitation(lat, lon, radius, days);

    return NextResponse.json({
      location,
      coordinates: { lat, lon },
      radius_km: radius,
      period_days: days,
      precipitation: precipData,
      source: 'GPM IMERG / CHIRPS',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[EARTH ENGINE PRECIP] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch precipitation data' },
      { status: 500 }
    );
  }
}
