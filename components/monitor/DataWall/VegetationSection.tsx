"use client";

import { useEffect, useState } from "react";
import { MetricRow } from "../MetricRow";
import { SectionHeader } from "../SectionHeader";

interface VegetationSectionProps { lat: number; lon: number; }

type Status = 'nominal' | 'watch' | 'warning' | 'critical' | 'emergency' | 'loading';

export function VegetationSection({ lat, lon }: VegetationSectionProps) {
  const [data, setData] = useState<{ ndvi: number; evi: number; canopy: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    fetch(`/api/satellite?lat=${lat}&lon=${lon}`, { signal: controller.signal })
      .then(r => r.ok ? r.json() : null)
      .then(json => {
        if (json?.ndvi !== undefined) {
          setData({ ndvi: json.ndvi, evi: json.evi ?? 0, canopy: json.forestCover ?? json.canopy ?? 0 });
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

  const ndviStatus: Status = !loaded ? 'loading'
    : !data ? 'nominal'
    : data.ndvi > 0.6 ? 'nominal'
    : data.ndvi > 0.4 ? 'watch'
    : data.ndvi > 0.2 ? 'warning'
    : 'critical';

  return (
    <div className="px-3 py-2" style={{ borderBottom: '1px solid var(--border)' }}>
      <SectionHeader label="VEGETATION" status={ndviStatus !== 'loading' ? ndviStatus : undefined} />
      {loading ? (
        <div className="space-y-1 mt-1">
          {[60, 50, 70].map((w, i) => (
            <div key={i} className="h-3 rounded" style={{ width: `${w}%`, background: 'var(--bg-raised)' }} />
          ))}
        </div>
      ) : (
        <div className="mt-1 space-y-0.5">
          <MetricRow label="NDVI"   value={data?.ndvi != null ? data.ndvi.toFixed(2) : '—'} status={ndviStatus !== 'loading' ? ndviStatus : undefined} />
          <MetricRow label="EVI"    value={data?.evi != null ? data.evi.toFixed(2) : '—'} />
          <MetricRow label="Canopy" value={data?.canopy != null ? data.canopy.toFixed(0) : '—'} unit="%" />
        </div>
      )}
    </div>
  );
}
