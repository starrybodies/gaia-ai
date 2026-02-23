"use client";

import { useState, useEffect } from "react";
import { ActiveEvents } from "./ActiveEvents";
import { TopAlerts } from "./TopAlerts";

interface LeftPanelProps {
  onAlertClick: (lat: number, lon: number) => void;
}

export function LeftPanel({ onAlertClick }: LeftPanelProps) {
  const [utc, setUtc] = useState(() => new Date().toISOString().slice(0, 16).replace('T', ' ') + ' UTC');
  useEffect(() => {
    const id = setInterval(() => setUtc(new Date().toISOString().slice(0, 16).replace('T', ' ') + ' UTC'), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="w-[280px] shrink-0 flex flex-col overflow-y-auto"
      style={{ background: 'var(--bg-panel)', borderRight: '1px solid var(--border)' }}
    >
      {/* Header */}
      <div className="px-3 py-2.5 shrink-0" style={{ borderBottom: '1px solid var(--border)' }}>
        <div
          className="text-[11px] font-medium uppercase"
          style={{ color: 'var(--accent)', fontFamily: 'var(--font-data)', letterSpacing: '0.08em' }}
        >
          GAIA MONITOR
        </div>
        <div
          className="text-[10px] tabular-nums mt-0.5"
          style={{ color: 'var(--text-3)', fontFamily: 'var(--font-data)' }}
        >
          {utc}
        </div>
      </div>

      <ActiveEvents />
      <TopAlerts onAlertClick={onAlertClick} />
    </div>
  );
}
