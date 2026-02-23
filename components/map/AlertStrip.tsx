"use client";

import { useEffect, useState } from "react";

interface Alert {
  id: number;
  severity: string;
  ci_score: number;
  signal_types: string[];
}

const SEVERITY_COLORS: Record<string, string> = {
  EMERGENCY: "var(--signal-critical)",
  CRITICAL:  "var(--signal-critical)",
  WARNING:   "var(--signal-warn)",
  WATCH:     "var(--signal-bio)",
};

export function AlertStrip() {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    fetch("/api/convergence?min_severity=WATCH&limit=10")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.alerts) setAlerts(data.alerts);
      })
      .catch(() => {/* silent if API not ready */});
  }, []);

  return (
    <div
      className="absolute bottom-0 left-12 right-0 z-20 h-8 flex items-center gap-3 px-3 overflow-x-auto"
      style={{
        background: "var(--bg-deep)",
        borderTop: "1px solid var(--border-1)",
      }}
    >
      {alerts.length === 0 ? (
        <span className="text-xs" style={{ color: "var(--text-4)" }}>
          No active alerts
        </span>
      ) : (
        alerts.map((alert) => (
          <div
            key={alert.id}
            className="flex items-center gap-1.5 shrink-0 text-xs tabular-nums"
            style={{ color: "var(--text-2)" }}
          >
            <span
              className="size-2 rounded-full shrink-0"
              style={{ background: SEVERITY_COLORS[alert.severity] ?? "var(--signal-warn)" }}
              aria-hidden="true"
            />
            <span style={{ color: SEVERITY_COLORS[alert.severity] }}>{alert.severity}</span>
            <span style={{ color: "var(--text-3)" }}>CI={alert.ci_score.toFixed(1)}</span>
            <span style={{ color: "var(--text-4)" }}>{alert.signal_types.join(", ")}</span>
          </div>
        ))
      )}
    </div>
  );
}
