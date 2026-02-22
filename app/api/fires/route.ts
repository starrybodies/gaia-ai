import { NextRequest, NextResponse } from 'next/server';
import { getRecentEvents } from '@/lib/convergence';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const latParam = searchParams.get('lat');
  const lonParam = searchParams.get('lon');
  const lat = latParam !== null ? parseFloat(latParam) : undefined;
  const lon = lonParam !== null ? parseFloat(lonParam) : undefined;
  const radius = parseInt(searchParams.get('radius') ?? '500', 10);
  const hours = parseInt(searchParams.get('hours') ?? '24', 10);

  if (lat !== undefined && (isNaN(lat) || lat < -90 || lat > 90)) {
    return NextResponse.json({ error: 'Invalid lat' }, { status: 400 });
  }
  if (lon !== undefined && (isNaN(lon) || lon < -180 || lon > 180)) {
    return NextResponse.json({ error: 'Invalid lon' }, { status: 400 });
  }
  if (isNaN(radius) || isNaN(hours)) {
    return NextResponse.json({ error: 'Invalid radius or hours' }, { status: 400 });
  }

  try {
    const events = await getRecentEvents('fire', hours, lat, lon, radius);
    return NextResponse.json({ events });
  } catch {
    return NextResponse.json({ events: [] }, { status: 503 });
  }
}
