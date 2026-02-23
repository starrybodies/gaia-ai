"use client";

import { useEffect, useState } from "react";
import { SectionHeader } from "../SectionHeader";

interface Alert {
  id: number;
  severity: string;
  ci_score: number;
  signal_types: string[];
}

interface ConvergenceSectionProps { lat: number; lon: number; }

const SEV_COLOR: Record<string, string> = {
  EMERGENCY: 'var(--emergency)',
  CRITICAL:  'var(--critical)',
  WARNING:   'var(--warning)',
  WATCH:     'var(--watch)',
};

type Status = 'nominal' | 'watch' | 'warning' | 'critical' | 'emergency' | 'loading';
const VALID_STATUS = new Set<string>(['nominal', 'watch', 'warning', 'critical', 'emergency']);

export function ConvergenceSection({ lat, lon }: ConvergenceSectionProps) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  // lat/lon intentionally omitted — convergence API does not support location filtering
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    fetch('/api/convergence?min_severity=WATCH&limit=100', { signal: controller.signal })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.alerts) setAlerts(data.alerts.slice(0, 5));
        setLoading(false);
      })
      .catch(e => {
        if (e.name !== 'AbortError') setLoading(false);
      });
    return () => controller.abort();
  }, []);

  const rawSev = alerts[0]?.severity.toLowerCase() ?? '';
  const topSev: Status = VALID_STATUS.has(rawSev) ? (rawSev as Status) : 'nominal';

  // suppress unused-vars warning — props exist for parent compatibility
  void lat; void lon;

  return (
    <div className="px-3 py-2" style={{ borderBottom: '1px solid var(--border)' }}>
      <SectionHeader label="CONVERGENCE" status={loading ? 'loading' : topSev} />
      {loading ? (
        <div className="space-y-1 mt-1">
          {[70, 55].map((w, i) => (
            <div key={i} className="h-3 rounded" style={{ width: `${w}%`, background: 'var(--bg-raised)' }} />
          ))}
        </div>
      ) : alerts.length === 0 ? (
        <p className="text-[11px] mt-1" style={{ color: 'var(--text-3)' }}>No active alerts</p>
      ) : (
        <div className="mt-1 space-y-1.5">
          {alerts.map(alert => (
            <div key={alert.id} className="space-y-0.5">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px]" style={{ color: SEV_COLOR[alert.severity] ?? 'var(--watch)' }}>■</span>
                <span className="text-[10px] tabular-nums" style={{ color: 'var(--text-1)', fontFamily: 'var(--font-data)' }}>
                  {alert.severity} CI={alert.ci_score.toFixed(1)}
                </span>
              </div>
              <p className="text-[10px] pl-4" style={{ color: 'var(--text-3)', fontFamily: 'var(--font-data)' }}>
                {alert.signal_types.join(', ')}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
