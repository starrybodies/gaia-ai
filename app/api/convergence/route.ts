import { NextRequest, NextResponse } from 'next/server';
import { getActiveConvergenceAlerts } from '@/lib/convergence';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const minSeverity = searchParams.get('min_severity') ?? 'WATCH';
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '100', 10), 500);

  try {
    const alerts = await getActiveConvergenceAlerts(minSeverity, limit);
    return NextResponse.json({ alerts, count: alerts.length });
  } catch (error) {
    console.error('Convergence API error:', error);
    return NextResponse.json(
      { alerts: [], count: 0, error: 'Database unavailable' },
      { status: 503 }
    );
  }
}
