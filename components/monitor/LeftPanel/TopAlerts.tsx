"use client";

import { useEffect, useState } from "react";
import { SectionHeader } from "../SectionHeader";

interface Alert {
  id: number;
  severity: string;
  ci_score: number;
  signal_types: string[];
  lat: number | null;
  lon: number | null;
  time: string;
}

const SEV_COLOR: Record<string, string> = {
  EMERGENCY: 'var(--emergency)',
  CRITICAL:  'var(--critical)',
  WARNING:   'var(--warning)',
  WATCH:     'var(--watch)',
};

interface TopAlertsProps {
  onAlertClick: (lat: number, lon: number) => void;
}

export function TopAlerts({ onAlertClick }: TopAlertsProps) {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    const load = () =>
      fetch('/api/convergence?min_severity=WATCH&limit=3')
        .then(r => r.ok ? r.json() : null)
        .then(data => { if (data?.alerts) setAlerts(data.alerts); })
        .catch(() => {});
    load();
    const id = setInterval(load, 30_000);
    return () => clearInterval(id);
  }, []);

  const topSeverity = alerts[0]?.severity.toLowerCase() as 'watch' | 'warning' | 'critical' | 'emergency' | undefined;

  return (
    <div className="px-3 py-2" style={{ borderBottom: '1px solid var(--border)' }}>
      <SectionHeader label="TOP ALERTS" status={topSeverity} />
      <div className="mt-1 space-y-3">
        {alerts.length === 0 && (
          <p className="text-[11px]" style={{ color: 'var(--text-3)' }}>No active alerts</p>
        )}
        {alerts.map(alert => {
          const color = SEV_COLOR[alert.severity] ?? 'var(--watch)';
          const minsAgo = Math.round((Date.now() - new Date(alert.time).getTime()) / 60_000);
          const clickable = alert.lat != null && alert.lon != null;
          return (
            <button
              key={alert.id}
              onClick={() => clickable && onAlertClick(alert.lat!, alert.lon!)}
              className="w-full text-left space-y-0.5"
              style={{ cursor: clickable ? 'pointer' : 'default' }}
            >
              <div className="flex items-center gap-1.5">
                <span className="text-[10px]" style={{ color }}>■</span>
                <span className="text-[10px] font-medium" style={{ color, fontFamily: 'var(--font-data)' }}>
                  {alert.severity}
                </span>
                <span className="text-[10px] tabular-nums ml-auto" style={{ color: 'var(--text-3)', fontFamily: 'var(--font-data)' }}>
                  {minsAgo}m ago
                </span>
              </div>
              <div className="text-[10px] pl-4" style={{ color: 'var(--text-2)', fontFamily: 'var(--font-data)' }}>
                CI={alert.ci_score.toFixed(1)} · {alert.signal_types.slice(0, 2).join(', ')}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
