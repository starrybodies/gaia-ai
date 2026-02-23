"use client";

import { useEffect, useState } from "react";
import { MetricRow } from "../MetricRow";
import { SectionHeader } from "../SectionHeader";

interface AirQualitySectionProps { lat: number; lon: number; }

export function AirQualitySection({ lat, lon }: AirQualitySectionProps) {
  const [data, setData] = useState<{ aqi: number; pm25: number; pm10: number; no2: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    fetch(`/api/airquality?lat=${lat}&lon=${lon}`, { signal: controller.signal })
      .then(r => r.ok ? r.json() : null)
      .then(json => {
        if (json?.aqi !== undefined) {
          setData({
            aqi: json.aqi,
            pm25: json.pollutants?.pm25?.value ?? 0,
            pm10: json.pollutants?.pm10?.value ?? 0,
            no2: json.pollutants?.no2?.value ?? 0,
          });
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

  const aqiStatus = !loaded ? 'loading'
    : !data ? 'nominal'
    : data.aqi <= 50 ? 'nominal'
    : data.aqi <= 100 ? 'watch'
    : data.aqi <= 150 ? 'warning'
    : 'critical';

  return (
    <div className="px-3 py-2" style={{ borderBottom: '1px solid var(--border)' }}>
      <SectionHeader label="AIR QUALITY" status={aqiStatus as any} />
      {loading ? (
        <div className="space-y-1 mt-1">
          {[70, 50, 65, 55].map((w, i) => (
            <div key={i} className="h-3 rounded" style={{ width: `${w}%`, background: 'var(--bg-raised)' }} />
          ))}
        </div>
      ) : (
        <div className="mt-1 space-y-0.5">
          <MetricRow label="AQI"   value={data?.aqi ?? '—'} status={aqiStatus as any} />
          <MetricRow label="PM2.5" value={data?.pm25 ? data.pm25.toFixed(1) : '—'} unit="μg/m³" />
          <MetricRow label="PM10"  value={data?.pm10 ? data.pm10.toFixed(1) : '—'} unit="μg/m³" />
          <MetricRow label="NO₂"   value={data?.no2 ? data.no2.toFixed(1) : '—'} unit="μg/m³" />
        </div>
      )}
    </div>
  );
}
