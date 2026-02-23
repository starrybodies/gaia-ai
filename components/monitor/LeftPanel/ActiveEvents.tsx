"use client";

import { useEffect, useState } from "react";
import { MetricRow } from "../MetricRow";
import { SectionHeader } from "../SectionHeader";

interface Counts {
  fires: number;
  WATCH: number;
  WARNING: number;
  CRITICAL: number;
  EMERGENCY: number;
}

function toSeverityStatus(counts: Counts) {
  if (counts.EMERGENCY > 0) return 'emergency' as const;
  if (counts.CRITICAL > 0) return 'critical' as const;
  if (counts.WARNING > 0) return 'warning' as const;
  if (counts.WATCH > 0) return 'watch' as const;
  return 'nominal' as const;
}

export function ActiveEvents() {
  const [counts, setCounts] = useState<Counts | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [firesRes, convRes] = await Promise.allSettled([
          fetch('/api/fires?lat=0&lon=0&radius=20000').then(r => r.ok ? r.json() : null),
          fetch('/api/convergence?min_severity=WATCH&limit=500').then(r => r.ok ? r.json() : null),
        ]);

        const fires = firesRes.status === 'fulfilled' ? firesRes.value : null;
        const conv = convRes.status === 'fulfilled' ? convRes.value : null;

        const c: Counts = { fires: 0, WATCH: 0, WARNING: 0, CRITICAL: 0, EMERGENCY: 0 };
        if (fires?.events) c.fires = fires.events.length;
        if (conv?.alerts) {
          for (const a of conv.alerts) {
            if (a.severity in c) c[a.severity as keyof Counts] = (c[a.severity as keyof Counts] as number) + 1;
          }
        }
        setCounts(c);
      } catch { /* silent */ }
    };

    load();
    const id = setInterval(load, 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="px-3 py-2" style={{ borderBottom: '1px solid var(--border)' }}>
      <SectionHeader label="ACTIVE EVENTS" status={counts ? toSeverityStatus(counts) : 'loading'} />
      <div className="mt-1 space-y-0.5">
        <MetricRow
          label="Fires"
          value={counts?.fires ?? '—'}
          status={counts ? (counts.fires > 200 ? 'warning' : counts.fires > 50 ? 'watch' : 'nominal') : undefined}
        />
        <MetricRow label="Watch"     value={counts?.WATCH ?? '—'}     status={counts?.WATCH ? 'watch' : 'nominal'} />
        <MetricRow label="Warning"   value={counts?.WARNING ?? '—'}   status={counts?.WARNING ? 'warning' : 'nominal'} />
        <MetricRow label="Critical"  value={counts?.CRITICAL ?? '—'}  status={counts?.CRITICAL ? 'critical' : 'nominal'} />
        <MetricRow label="Emergency" value={counts?.EMERGENCY ?? '—'} status={counts?.EMERGENCY ? 'emergency' : 'nominal'} />
      </div>
    </div>
  );
}
