"use client";

import { useEffect, useState } from "react";
import { MetricRow } from "../MetricRow";
import { SectionHeader } from "../SectionHeader";

interface VegetationSectionProps { lat: number; lon: number; }

export function VegetationSection({ lat, lon }: VegetationSectionProps) {
  const [data, setData] = useState<{ ndvi: number; evi: number; canopy: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/satellite?lat=${lat}&lon=${lon}`)
      .then(r => r.ok ? r.json() : null)
      .then(json => {
        if (json?.ndvi !== undefined) {
          setData({ ndvi: json.ndvi, evi: json.evi ?? 0, canopy: json.forestCover ?? json.canopy ?? 0 });
        }
        setLoading(false);
      })
      .catch(() => { setLoading(false); });
  }, [lat, lon]);

  const ndviStatus = !data ? 'loading'
    : data.ndvi > 0.6 ? 'nominal'
    : data.ndvi > 0.4 ? 'watch'
    : data.ndvi > 0.2 ? 'warning'
    : 'critical';

  return (
    <div className="px-3 py-2" style={{ borderBottom: '1px solid var(--border)' }}>
      <SectionHeader label="VEGETATION" status={ndviStatus as any} />
      {loading ? (
        <div className="space-y-1 mt-1">
          {[60, 50, 70].map((w, i) => (
            <div key={i} className="h-3 rounded" style={{ width: `${w}%`, background: 'var(--bg-raised)' }} />
          ))}
        </div>
      ) : (
        <div className="mt-1 space-y-0.5">
          <MetricRow label="NDVI"   value={data?.ndvi != null ? data.ndvi.toFixed(2) : '—'} status={ndviStatus as any} />
          <MetricRow label="EVI"    value={data?.evi != null ? data.evi.toFixed(2) : '—'} />
          <MetricRow label="Canopy" value={data?.canopy != null ? data.canopy.toFixed(0) : '—'} unit="%" />
        </div>
      )}
    </div>
  );
}
