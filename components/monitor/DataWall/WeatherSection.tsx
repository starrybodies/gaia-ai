"use client";

import { useEffect, useState } from "react";
import { MetricRow } from "../MetricRow";
import { SectionHeader } from "../SectionHeader";

interface WeatherSectionProps { lat: number; lon: number; }

export function WeatherSection({ lat, lon }: WeatherSectionProps) {
  const [data, setData] = useState<{ temp: number; humidity: number; windSpeed: number; description: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/weather?lat=${lat}&lon=${lon}`)
      .then(r => r.ok ? r.json() : null)
      .then(json => {
        if (json) {
          const temp = json.main?.temp ?? json.current?.temperature ?? null;
          const humidity = json.main?.humidity ?? json.current?.humidity ?? null;
          const windSpeed = json.wind?.speed ?? json.current?.wind_speed ?? null;
          const description = json.weather?.[0]?.description ?? json.current?.description ?? '—';
          if (temp !== null) {
            setData({ temp, humidity: humidity ?? 0, windSpeed: windSpeed ?? 0, description });
          }
        }
        setLoading(false);
      })
      .catch(() => { setLoading(false); });
  }, [lat, lon]);

  return (
    <div className="px-3 py-2" style={{ borderBottom: '1px solid var(--border)' }}>
      <SectionHeader label="WEATHER" status={loading ? 'loading' : 'nominal'} />
      {loading ? (
        <div className="space-y-1 mt-1">
          {[65, 55, 60].map((w, i) => (
            <div key={i} className="h-3 rounded" style={{ width: `${w}%`, background: 'var(--bg-raised)' }} />
          ))}
        </div>
      ) : (
        <div className="mt-1 space-y-0.5">
          <MetricRow label="Temp"      value={data?.temp != null ? data.temp.toFixed(1) : '—'} unit="°C" />
          <MetricRow label="Humidity"  value={data?.humidity ?? '—'} unit="%" />
          <MetricRow label="Wind"      value={data?.windSpeed != null ? data.windSpeed.toFixed(1) : '—'} unit="m/s" />
          <MetricRow label="Condition" value={data?.description ?? '—'} />
        </div>
      )}
    </div>
  );
}
