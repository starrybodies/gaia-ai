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

  try {
    const events = await getRecentEvents('fire', hours, lat, lon, radius);
    return NextResponse.json({ events });
  } catch {
    return NextResponse.json({ events: [] }, { status: 503 });
  }
}
