"use client";

import { useEffect, useState } from "react";
import { MetricRow } from "../MetricRow";
import { SectionHeader } from "../SectionHeader";

interface FireSectionProps { lat: number; lon: number; }

export function FireSection({ lat, lon }: FireSectionProps) {
  const [data, setData] = useState<{ count: number; maxBrightness: number; maxFrp: number; severity: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    fetch(`/api/fires?lat=${lat}&lon=${lon}&radius=200`, { signal: controller.signal })
      .then(r => r.ok ? r.json() : null)
      .then(json => {
        if (json?.events && json.events.length > 0) {
          const events = json.events;
          setData({
            count: events.length,
            maxBrightness: Math.max(...events.map((e: { brightness: number }) => e.brightness || 0)),
            maxFrp: Math.max(...events.map((e: { frp?: number }) => e.frp || 0)),
            severity: events.some((e: { severity: string }) => e.severity === 'CRITICAL') ? 'CRITICAL'
              : events.some((e: { severity: string }) => e.severity === 'HIGH') ? 'HIGH'
              : 'LOW',
          });
        } else {
          setData({ count: 0, maxBrightness: 0, maxFrp: 0, severity: 'NONE' });
        }
        setLoaded(true);
        setLoading(false);
      })
      .catch(e => {
        if (e.name !== 'AbortError') {
          setLoaded(true);
          setLoading(false);
        }
      });
    return () => controller.abort();
  }, [lat, lon]);

  const status = !loaded ? 'loading'
    : !data || data.count === 0 ? 'nominal'
    : data.severity === 'CRITICAL' ? 'critical'
    : data.severity === 'HIGH' ? 'warning'
    : 'watch';

  return (
    <div className="px-3 py-2" style={{ borderBottom: '1px solid var(--border)' }}>
      <SectionHeader label="FIRE" status={status as any} />
      {loading ? (
        <div className="space-y-1 mt-1">
          {[60, 80, 70].map((w, i) => (
            <div key={i} className="h-3 rounded" style={{ width: `${w}%`, background: 'var(--bg-raised)' }} />
          ))}
        </div>
      ) : (
        <div className="mt-1 space-y-0.5">
          <MetricRow label="Detections" value={data?.count ?? 0} />
          <MetricRow label="Max Brightness" value={data?.maxBrightness ? data.maxBrightness.toFixed(0) : '—'} unit="K" />
          <MetricRow label="Max FRP" value={data?.maxFrp ? data.maxFrp.toFixed(1) : '—'} unit="MW" />
          <MetricRow label="Severity" value={data?.severity ?? '—'} status={status as any} />
        </div>
      )}
    </div>
  );
}
