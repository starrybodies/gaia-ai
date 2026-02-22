import { query } from './db';

export interface ConvergenceAlert {
  id: number;
  time: string;
  severity: 'WATCH' | 'WARNING' | 'CRITICAL' | 'EMERGENCY';
  ci_score: number;
  threat_profile: string | null;
  h3_cells: string[];
  signal_types: string[];
  signal_z_scores: Record<string, number>;
  lat: number | null;
  lon: number | null;
}

export async function getActiveConvergenceAlerts(
  minSeverity: string = 'WATCH',
  limit: number = 100
): Promise<ConvergenceAlert[]> {
  const severityRank: Record<string, number> = {
    WATCH: 1, WARNING: 2, CRITICAL: 3, EMERGENCY: 4,
  };
  const minRank = severityRank[minSeverity] ?? 1;

  const severities = Object.entries(severityRank)
    .filter(([, rank]) => rank >= minRank)
    .map(([s]) => s);

  const result = await query(
    `SELECT
       id, time, severity, ci_score, threat_profile,
       h3_cells, signal_types, signal_z_scores,
       ST_Y(ST_Centroid(affected_area)) as lat,
       ST_X(ST_Centroid(affected_area)) as lon
     FROM convergence_alerts
     WHERE severity = ANY($1)
       AND status = 'active'
       AND time > NOW() - INTERVAL '48 hours'
     ORDER BY ci_score DESC
     LIMIT $2`,
    [severities, limit]
  );

  return result.rows;
}

export async function getRecentEvents(
  eventType: string,
  hours: number = 24,
  lat?: number,
  lon?: number,
  radiusKm: number = 500
): Promise<any[]> {
  if (lat !== undefined && lon !== undefined) {
    const result = await query(
      `SELECT id, time, event_type, severity, properties, confidence,
              ST_Y(location) as lat, ST_X(location) as lon, h3_resolution5
       FROM events
       WHERE event_type = $1
         AND time > NOW() - ($2 || ' hours')::INTERVAL
         AND ST_DWithin(
           location::geography,
           ST_MakePoint($3, $4)::geography,
           $5 * 1000
         )
       ORDER BY time DESC LIMIT 500`,
      [eventType, hours, lon, lat, radiusKm]
    );
    return result.rows;
  }

  const result = await query(
    `SELECT id, time, event_type, severity, properties, confidence,
            ST_Y(location) as lat, ST_X(location) as lon, h3_resolution5
     FROM events
     WHERE event_type = $1
       AND time > NOW() - ($2 || ' hours')::INTERVAL
     ORDER BY time DESC LIMIT 1000`,
    [eventType, hours]
  );
  return result.rows;
}
