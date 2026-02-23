"use client";

import { useEffect, useState } from "react";

interface TickerAlert {
  id: number;
  severity: string;
  lat: number | null;
  lon: number | null;
  ci_score: number;
  signal_types: string[];
  time: string;
}

const SEV_COLOR: Record<string, string> = {
  EMERGENCY: 'var(--emergency)',
  CRITICAL:  'var(--critical)',
  WARNING:   'var(--warning)',
  WATCH:     'var(--watch)',
};

interface TickerProps {
  onAlertClick: (lat: number, lon: number) => void;
}

export function Ticker({ onAlertClick }: TickerProps) {
  const [alerts, setAlerts] = useState<TickerAlert[]>([]);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const load = () =>
      fetch('/api/convergence?min_severity=WATCH&limit=20')
        .then(r => r.ok ? r.json() : null)
        .then(data => { if (data?.alerts) setAlerts(data.alerts); })
        .catch(() => {});
    load();
    const id = setInterval(load, 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="h-10 flex items-center overflow-hidden shrink-0"
      style={{ background: 'var(--bg-panel)', borderTop: '1px solid var(--border)' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Static label */}
      <span
        className="text-[10px] uppercase px-3 shrink-0 z-10"
        style={{
          color: 'var(--accent)',
          background: 'var(--bg-panel)',
          fontFamily: 'var(--font-data)',
          letterSpacing: '0.08em',
        }}
      >
        ALERTS
      </span>

      {alerts.length === 0 ? (
        <span className="text-[10px]" style={{ color: 'var(--text-3)', fontFamily: 'var(--font-data)' }}>
          No active alerts
        </span>
      ) : (
        /* Duplicate items for seamless loop */
        <div
          className="flex gap-8 whitespace-nowrap"
          style={{
            animation: 'ticker-scroll 80s linear infinite',
            animationPlayState: paused ? 'paused' : 'running',
            fontFamily: 'var(--font-data)',
          }}
        >
          {[...alerts, ...alerts].map((alert, i) => {
            const color = SEV_COLOR[alert.severity] ?? 'var(--watch)';
            const t = new Date(alert.time).toLocaleTimeString('en', {
              hour: '2-digit', minute: '2-digit', hour12: false,
            });
            const clickable = alert.lat != null && alert.lon != null;

            if (clickable) {
              return (
                <button
                  key={`${alert.id}-${i < alerts.length ? 'a' : 'b'}`}
                  onClick={() => onAlertClick(alert.lat!, alert.lon!)}
                  className="flex items-center gap-2 text-[11px]"
                  style={{ cursor: 'pointer', color: 'var(--text-2)' }}
                >
                  <span style={{ color }}>{t} ■{alert.severity}</span>
                  <span className="tabular-nums" style={{ color: 'var(--text-1)' }}>CI={alert.ci_score.toFixed(1)}</span>
                  <span style={{ color: 'var(--text-3)' }}>{alert.signal_types.join(', ')}</span>
                  <span style={{ color: 'var(--text-3)' }}>·</span>
                </button>
              );
            }
            return (
              <span
                key={`${alert.id}-${i < alerts.length ? 'a' : 'b'}`}
                className="flex items-center gap-2 text-[11px]"
                style={{ color: 'var(--text-2)' }}
              >
                <span style={{ color }}>{t} ■{alert.severity}</span>
                <span className="tabular-nums" style={{ color: 'var(--text-1)' }}>CI={alert.ci_score.toFixed(1)}</span>
                <span style={{ color: 'var(--text-3)' }}>{alert.signal_types.join(', ')}</span>
                <span style={{ color: 'var(--text-3)' }}>·</span>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
