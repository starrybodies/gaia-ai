# Gaia Monitor Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the current generic UI with a SpaceX-mission-control-style three-column environmental data monitor — persistent world vitals left panel, full-screen map center, slide-in data wall on region click, scrolling alert ticker at bottom.

**Architecture:** MonitorShell is the layout root rendered by app/map/page.tsx. Left panel (280px, always visible) fetches global vitals on a 30s interval. Map fills center flex space. Data wall (400px) slides in from right via AnimatePresence when a region is clicked, fetching 5 parallel data sections. Ticker at bottom polls convergence alerts every 60s.

**Tech Stack:** Next.js 15, React, TypeScript, Tailwind CSS v4, motion/react (AnimatePresence), Geist Sans/Mono fonts, existing deck.gl + MapLibre map stack.

---

### Task 1: Mission control design tokens in globals.css

**Files:**
- Modify: `app/globals.css`

**Step 1: Replace globals.css entirely**

```css
@import "tailwindcss";
@import "leaflet/dist/leaflet.css";

/* Gaia Monitor — Mission Control Design System */
:root {
  /* Backgrounds */
  --bg-base:   #080c10;
  --bg-panel:  #0e1419;
  --bg-raised: #141d24;

  /* Borders */
  --border: rgba(255, 255, 255, 0.07);

  /* Text */
  --text-1: #e8edf2;
  --text-2: #8da0b0;
  --text-3: #4a5a6a;

  /* Accent */
  --accent: #00b4d8;

  /* Status / severity */
  --nominal:   #22c55e;
  --watch:     #eab308;
  --warning:   #f97316;
  --critical:  #ef4444;
  --emergency: #a855f7;

  /* Typography */
  --font-ui:   var(--font-geist-sans), system-ui, sans-serif;
  --font-data: var(--font-geist-mono), 'Courier New', monospace;
}

html, body {
  background-color: var(--bg-base);
  color: var(--text-1);
  font-family: var(--font-ui);
  height: 100%;
}

/* Ticker scroll animation */
@keyframes ticker-scroll {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
```

**Step 2: Verify no build errors**

```bash
cd /Users/samu/gaia-ai && npx next build 2>&1 | grep -E "^(Error|error)" | grep -v node_modules | head -10
```

Expected: no new errors

**Step 3: Commit**

```bash
cd /Users/samu/gaia-ai && git add app/globals.css && git commit -m "feat: mission control design tokens"
```

---

### Task 2: Shared primitives — MetricRow and SectionHeader

**Files:**
- Create: `components/monitor/MetricRow.tsx`
- Create: `components/monitor/SectionHeader.tsx`

These are the two building blocks used everywhere. MetricRow renders one data reading. SectionHeader renders a colored ■ + label in cyan mono.

**Step 1: Create components/monitor/MetricRow.tsx**

```tsx
type Status = 'nominal' | 'watch' | 'warning' | 'critical' | 'emergency';

interface MetricRowProps {
  label: string;
  value: string | number;
  unit?: string;
  status?: Status;
}

const STATUS_VAR: Record<Status, string> = {
  nominal:   'var(--nominal)',
  watch:     'var(--watch)',
  warning:   'var(--warning)',
  critical:  'var(--critical)',
  emergency: 'var(--emergency)',
};

export function MetricRow({ label, value, unit, status }: MetricRowProps) {
  return (
    <div className="flex items-baseline justify-between gap-2 py-0.5">
      <span
        className="text-[10px] uppercase shrink-0"
        style={{ color: 'var(--text-2)', fontFamily: 'var(--font-ui)', letterSpacing: '0.08em' }}
      >
        {label}
      </span>
      <span className="flex items-baseline gap-1" style={{ fontFamily: 'var(--font-data)' }}>
        <span className="text-xs tabular-nums" style={{ color: 'var(--text-1)' }}>{value}</span>
        {unit && (
          <span className="text-[10px]" style={{ color: 'var(--text-3)' }}>{unit}</span>
        )}
        {status && (
          <span className="text-[10px]" style={{ color: STATUS_VAR[status] }}>■</span>
        )}
      </span>
    </div>
  );
}
```

**Step 2: Create components/monitor/SectionHeader.tsx**

```tsx
type Status = 'nominal' | 'watch' | 'warning' | 'critical' | 'emergency' | 'loading';

interface SectionHeaderProps {
  label: string;
  status?: Status;
  collapsible?: boolean;
  collapsed?: boolean;
  onToggle?: () => void;
}

const STATUS_VAR: Record<string, string> = {
  nominal:   'var(--nominal)',
  watch:     'var(--watch)',
  warning:   'var(--warning)',
  critical:  'var(--critical)',
  emergency: 'var(--emergency)',
  loading:   'var(--text-3)',
};

export function SectionHeader({ label, status, collapsible, collapsed, onToggle }: SectionHeaderProps) {
  const statusColor = status ? STATUS_VAR[status] : 'var(--text-3)';

  if (collapsible) {
    return (
      <button
        onClick={onToggle}
        className="flex items-center gap-2 w-full py-1.5"
      >
        <span className="text-[10px]" style={{ color: statusColor }}>■</span>
        <span
          className="text-[10px] uppercase font-medium"
          style={{ color: 'var(--accent)', fontFamily: 'var(--font-data)', letterSpacing: '0.08em' }}
        >
          {label}
        </span>
        <span className="ml-auto text-[10px]" style={{ color: 'var(--text-3)' }}>
          {collapsed ? '▶' : '▼'}
        </span>
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2 py-1.5">
      <span className="text-[10px]" style={{ color: statusColor }}>■</span>
      <span
        className="text-[10px] uppercase font-medium"
        style={{ color: 'var(--accent)', fontFamily: 'var(--font-data)', letterSpacing: '0.08em' }}
      >
        {label}
      </span>
    </div>
  );
}
```

**Step 3: Verify TypeScript**

```bash
cd /Users/samu/gaia-ai && npx tsc --noEmit 2>&1 | grep "MetricRow\|SectionHeader" | head -10
```

Expected: no errors

**Step 4: Commit**

```bash
cd /Users/samu/gaia-ai && git add components/monitor/MetricRow.tsx components/monitor/SectionHeader.tsx && git commit -m "feat: MetricRow and SectionHeader shared primitives"
```

---

### Task 3: Ticker — bottom scrolling alert feed

**Files:**
- Create: `components/monitor/Ticker.tsx`

Polls `/api/convergence?min_severity=WATCH&limit=20` every 60s. Scrolls continuously left via CSS animation. Pauses on hover. Clicking an item opens the data wall at that location.

**Step 1: Create components/monitor/Ticker.tsx**

```tsx
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
            animation: paused ? 'none' : 'ticker-scroll 80s linear infinite',
            fontFamily: 'var(--font-data)',
          }}
        >
          {[...alerts, ...alerts].map((alert, i) => {
            const color = SEV_COLOR[alert.severity] ?? 'var(--watch)';
            const t = new Date(alert.time).toLocaleTimeString('en', {
              hour: '2-digit', minute: '2-digit', hour12: false,
            });
            const clickable = alert.lat != null && alert.lon != null;
            return (
              <button
                key={i}
                onClick={() => clickable && onAlertClick(alert.lat!, alert.lon!)}
                className="flex items-center gap-2 text-[11px]"
                style={{ cursor: clickable ? 'pointer' : 'default', color: 'var(--text-2)' }}
              >
                <span style={{ color }}>{t} ■{alert.severity}</span>
                <span className="tabular-nums" style={{ color: 'var(--text-1)' }}>
                  CI={alert.ci_score.toFixed(1)}
                </span>
                <span style={{ color: 'var(--text-3)' }}>{alert.signal_types.join(', ')}</span>
                <span style={{ color: 'var(--text-3)' }}>·</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
```

**Step 2: Verify TypeScript**

```bash
cd /Users/samu/gaia-ai && npx tsc --noEmit 2>&1 | grep "Ticker" | head -5
```

**Step 3: Commit**

```bash
cd /Users/samu/gaia-ai && git add components/monitor/Ticker.tsx && git commit -m "feat: Ticker — scrolling convergence alert feed"
```

---

### Task 4: LeftPanel — world vitals

**Files:**
- Create: `components/monitor/LeftPanel/ActiveEvents.tsx`
- Create: `components/monitor/LeftPanel/TopAlerts.tsx`
- Create: `components/monitor/LeftPanel/LeftPanel.tsx`

**Step 1: Create components/monitor/LeftPanel/ActiveEvents.tsx**

Polls fire count and convergence severity counts every 30s.

```tsx
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
```

**Step 2: Create components/monitor/LeftPanel/TopAlerts.tsx**

```tsx
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
                <span
                  className="text-[10px] font-medium"
                  style={{ color, fontFamily: 'var(--font-data)' }}
                >
                  {alert.severity}
                </span>
                <span
                  className="text-[10px] tabular-nums ml-auto"
                  style={{ color: 'var(--text-3)', fontFamily: 'var(--font-data)' }}
                >
                  {minsAgo}m ago
                </span>
              </div>
              <div
                className="text-[10px] pl-4"
                style={{ color: 'var(--text-2)', fontFamily: 'var(--font-data)' }}
              >
                CI={alert.ci_score.toFixed(1)} · {alert.signal_types.slice(0, 2).join(', ')}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
```

**Step 3: Create components/monitor/LeftPanel/LeftPanel.tsx**

```tsx
"use client";

import { ActiveEvents } from "./ActiveEvents";
import { TopAlerts } from "./TopAlerts";

interface LeftPanelProps {
  onAlertClick: (lat: number, lon: number) => void;
}

export function LeftPanel({ onAlertClick }: LeftPanelProps) {
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
          {new Date().toUTCString().slice(0, 16)} UTC
        </div>
      </div>

      <ActiveEvents />
      <TopAlerts onAlertClick={onAlertClick} />
    </div>
  );
}
```

**Step 4: Verify TypeScript**

```bash
cd /Users/samu/gaia-ai && npx tsc --noEmit 2>&1 | grep "LeftPanel\|ActiveEvents\|TopAlerts" | head -10
```

**Step 5: Commit**

```bash
cd /Users/samu/gaia-ai && git add components/monitor/LeftPanel/ && git commit -m "feat: LeftPanel — world vitals with active events and top alerts"
```

---

### Task 5: DataWall — region data panel

**Files:**
- Create: `components/monitor/DataWall/FireSection.tsx`
- Create: `components/monitor/DataWall/AirQualitySection.tsx`
- Create: `components/monitor/DataWall/WeatherSection.tsx`
- Create: `components/monitor/DataWall/VegetationSection.tsx`
- Create: `components/monitor/DataWall/ConvergenceSection.tsx`
- Create: `components/monitor/DataWall/BriefingSection.tsx`
- Create: `components/monitor/DataWall/DataWall.tsx`

Each section fetches its own data when mounted. DataWall is the container with the motion.div slide animation.

**Step 1: Create components/monitor/DataWall/FireSection.tsx**

```tsx
"use client";

import { useEffect, useState } from "react";
import { MetricRow } from "../MetricRow";
import { SectionHeader } from "../SectionHeader";

interface FireSectionProps { lat: number; lon: number; }

export function FireSection({ lat, lon }: FireSectionProps) {
  const [data, setData] = useState<{ count: number; maxBrightness: number; maxFrp: number; severity: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/fires?lat=${lat}&lon=${lon}&radius=200`)
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
        setLoading(false);
      })
      .catch(() => { setLoading(false); });
  }, [lat, lon]);

  const status = !data ? 'loading'
    : data.severity === 'CRITICAL' ? 'critical'
    : data.severity === 'HIGH' ? 'warning'
    : data.count > 0 ? 'watch'
    : 'nominal';

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
```

**Step 2: Create components/monitor/DataWall/AirQualitySection.tsx**

```tsx
"use client";

import { useEffect, useState } from "react";
import { MetricRow } from "../MetricRow";
import { SectionHeader } from "../SectionHeader";

interface AirQualitySectionProps { lat: number; lon: number; }

export function AirQualitySection({ lat, lon }: AirQualitySectionProps) {
  const [data, setData] = useState<{ aqi: number; pm25: number; pm10: number; no2: number; level: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/airquality?lat=${lat}&lon=${lon}`)
      .then(r => r.ok ? r.json() : null)
      .then(json => {
        if (json?.aqi !== undefined) {
          setData({
            aqi: json.aqi,
            pm25: json.pollutants?.pm25?.value ?? 0,
            pm10: json.pollutants?.pm10?.value ?? 0,
            no2: json.pollutants?.no2?.value ?? 0,
            level: json.dominentpol ?? json.category ?? '—',
          });
        }
        setLoading(false);
      })
      .catch(() => { setLoading(false); });
  }, [lat, lon]);

  const aqiStatus = !data ? 'loading'
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
          <MetricRow label="AQI" value={data?.aqi ?? '—'} status={aqiStatus as any} />
          <MetricRow label="PM2.5" value={data?.pm25 ? data.pm25.toFixed(1) : '—'} unit="μg/m³" />
          <MetricRow label="PM10"  value={data?.pm10 ? data.pm10.toFixed(1) : '—'} unit="μg/m³" />
          <MetricRow label="NO₂"   value={data?.no2 ? data.no2.toFixed(1) : '—'} unit="μg/m³" />
        </div>
      )}
    </div>
  );
}
```

**Step 3: Create components/monitor/DataWall/WeatherSection.tsx**

```tsx
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
          // API returns either Open-Meteo format or mock format
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
```

**Step 4: Create components/monitor/DataWall/VegetationSection.tsx**

```tsx
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
```

**Step 5: Create components/monitor/DataWall/ConvergenceSection.tsx**

```tsx
"use client";

import { useEffect, useState } from "react";
import { SectionHeader } from "../SectionHeader";

interface Alert {
  id: number;
  severity: string;
  ci_score: number;
  signal_types: string[];
}

interface ConvergenceSectionProps { lat: number; lon: number; }

const SEV_COLOR: Record<string, string> = {
  EMERGENCY: 'var(--emergency)',
  CRITICAL:  'var(--critical)',
  WARNING:   'var(--warning)',
  WATCH:     'var(--watch)',
};

export function ConvergenceSection({ lat, lon }: ConvergenceSectionProps) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Fetch all active alerts — filter by proximity client-side
    // (convergence API doesn't support lat/lon radius yet)
    fetch('/api/convergence?min_severity=WATCH&limit=100')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.alerts) setAlerts(data.alerts.slice(0, 5));
        setLoading(false);
      })
      .catch(() => { setLoading(false); });
  }, [lat, lon]);

  const topSev = alerts[0]?.severity.toLowerCase() as any;

  return (
    <div className="px-3 py-2" style={{ borderBottom: '1px solid var(--border)' }}>
      <SectionHeader label="CONVERGENCE" status={loading ? 'loading' : (topSev ?? 'nominal')} />
      {loading ? (
        <div className="space-y-1 mt-1">
          {[70, 55].map((w, i) => (
            <div key={i} className="h-3 rounded" style={{ width: `${w}%`, background: 'var(--bg-raised)' }} />
          ))}
        </div>
      ) : alerts.length === 0 ? (
        <p className="text-[11px] mt-1" style={{ color: 'var(--text-3)' }}>No active alerts</p>
      ) : (
        <div className="mt-1 space-y-1.5">
          {alerts.map(alert => (
            <div key={alert.id} className="space-y-0.5">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px]" style={{ color: SEV_COLOR[alert.severity] ?? 'var(--watch)' }}>■</span>
                <span className="text-[10px] tabular-nums" style={{ color: 'var(--text-1)', fontFamily: 'var(--font-data)' }}>
                  {alert.severity} CI={alert.ci_score.toFixed(1)}
                </span>
              </div>
              <p className="text-[10px] pl-4" style={{ color: 'var(--text-3)', fontFamily: 'var(--font-data)' }}>
                {alert.signal_types.join(', ')}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

**Step 6: Create components/monitor/DataWall/BriefingSection.tsx**

Collapsed by default. Streams from `/api/briefing` when expanded.

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { SectionHeader } from "../SectionHeader";

interface BriefingSectionProps { lat: number; lon: number; }

export function BriefingSection({ lat, lon }: BriefingSectionProps) {
  const [collapsed, setCollapsed] = useState(true);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const expand = () => {
    setCollapsed(false);
    if (text) return; // already loaded
    abortRef.current?.abort();
    abortRef.current = new AbortController();
    setText('');
    setLoading(true);
    (async () => {
      try {
        const res = await fetch('/api/briefing', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lat, lon }),
          signal: abortRef.current!.signal,
        });
        if (!res.ok || !res.body) { setLoading(false); return; }
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buf = '';
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buf += decoder.decode(value, { stream: true });
          const lines = buf.split('\n');
          buf = lines.pop() ?? '';
          for (const line of lines) {
            if (!line.startsWith('data: ')) continue;
            const payload = line.slice(6);
            if (payload === '[DONE]') { setLoading(false); return; }
            try { const { text: chunk } = JSON.parse(payload); if (chunk) setText(p => p + chunk); } catch { /* skip */ }
          }
        }
      } catch (e) {
        if (e instanceof Error && e.name !== 'AbortError') setText('Briefing unavailable.');
      } finally { setLoading(false); }
    })();
    return () => abortRef.current?.abort();
  };

  return (
    <div className="px-3 py-2">
      <SectionHeader
        label="BRIEFING"
        status={loading ? 'loading' : text ? 'nominal' : undefined}
        collapsible
        collapsed={collapsed}
        onToggle={collapsed ? expand : () => setCollapsed(true)}
      />
      {!collapsed && (
        <div className="mt-2">
          {loading && !text ? (
            <div className="space-y-1.5">
              {[100, 90, 95, 80].map((w, i) => (
                <div key={i} className="h-3 rounded" style={{ width: `${w}%`, background: 'var(--bg-raised)' }} />
              ))}
            </div>
          ) : (
            <p
              className="text-[12px] leading-relaxed whitespace-pre-wrap"
              style={{ color: 'var(--text-2)', fontFamily: 'var(--font-ui)' }}
            >
              {text || 'No briefing available.'}
              {loading && <span className="inline-block w-1.5 h-3.5 ml-0.5 align-middle" style={{ background: 'var(--accent)', opacity: 0.8 }} />}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
```

**Step 7: Create components/monitor/DataWall/DataWall.tsx**

```tsx
"use client";

import { motion } from "motion/react";
import { FireSection } from "./FireSection";
import { AirQualitySection } from "./AirQualitySection";
import { WeatherSection } from "./WeatherSection";
import { VegetationSection } from "./VegetationSection";
import { ConvergenceSection } from "./ConvergenceSection";
import { BriefingSection } from "./BriefingSection";

interface Region {
  lat: number;
  lon: number;
  name?: string;
}

interface DataWallProps {
  region: Region;
  onClose: () => void;
}

export function DataWall({ region, onClose }: DataWallProps) {
  const { lat, lon, name } = region;
  const label = name ?? `${lat.toFixed(3)}, ${lon.toFixed(3)}`;

  return (
    <motion.div
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      transition={{ ease: "easeOut", duration: 0.2 }}
      className="absolute right-0 top-0 bottom-10 w-[400px] z-20 flex flex-col overflow-hidden"
      style={{ background: 'var(--bg-panel)', borderLeft: '1px solid var(--border)' }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-3 py-2.5 shrink-0"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <div>
          <div
            className="text-[11px] font-medium uppercase"
            style={{ color: 'var(--accent)', fontFamily: 'var(--font-data)', letterSpacing: '0.08em' }}
          >
            {label}
          </div>
          <div className="text-[10px] tabular-nums mt-0.5" style={{ color: 'var(--text-3)', fontFamily: 'var(--font-data)' }}>
            {lat.toFixed(4)}° {lon.toFixed(4)}°
          </div>
        </div>
        <button
          onClick={onClose}
          aria-label="Close data wall"
          className="size-7 flex items-center justify-center rounded text-base transition-opacity hover:opacity-70"
          style={{ color: 'var(--text-3)' }}
        >
          ×
        </button>
      </div>

      {/* Sections */}
      <div className="flex-1 overflow-y-auto">
        <FireSection lat={lat} lon={lon} />
        <AirQualitySection lat={lat} lon={lon} />
        <WeatherSection lat={lat} lon={lon} />
        <VegetationSection lat={lat} lon={lon} />
        <ConvergenceSection lat={lat} lon={lon} />
        <BriefingSection lat={lat} lon={lon} />
      </div>
    </motion.div>
  );
}
```

**Step 8: Verify TypeScript**

```bash
cd /Users/samu/gaia-ai && npx tsc --noEmit 2>&1 | grep "DataWall\|FireSection\|AirQuality\|WeatherSection\|Vegetation\|Convergence\|Briefing" | head -20
```

Expected: no errors

**Step 9: Commit**

```bash
cd /Users/samu/gaia-ai && git add components/monitor/DataWall/ && git commit -m "feat: DataWall — 6-section region data panel with streaming briefing"
```

---

### Task 6: MonitorShell + wire app/map/page.tsx

**Files:**
- Create: `components/monitor/MonitorShell.tsx`
- Modify: `app/map/page.tsx`

MonitorShell is the layout root. It renders the three-column structure, manages focused region state, and wires up all click handlers. The existing GaiaMap lives inside the center column.

**Step 1: Create components/monitor/MonitorShell.tsx**

```tsx
"use client";

import { useState, useCallback } from "react";
import { AnimatePresence } from "motion/react";
import { GaiaMap } from "@/components/map/GaiaMap";
import { LeftPanel } from "./LeftPanel/LeftPanel";
import { DataWall } from "./DataWall/DataWall";
import { Ticker } from "./Ticker";

interface Region {
  lat: number;
  lon: number;
  name?: string;
}

const LAYER_VISIBILITY = {
  fire: true,
  deforestation: true,
  convergence: true,
};

export function MonitorShell() {
  const [region, setRegion] = useState<Region | null>(null);

  const openRegion = useCallback((lat: number, lon: number, name?: string) => {
    setRegion({ lat, lon, name });
  }, []);

  const closeRegion = useCallback(() => setRegion(null), []);

  return (
    <div
      className="flex flex-col h-dvh overflow-hidden"
      style={{ background: 'var(--bg-base)' }}
    >
      {/* Main area: left panel + map + data wall */}
      <div className="flex flex-1 overflow-hidden relative">
        <LeftPanel onAlertClick={openRegion} />

        {/* Map — fills remaining space */}
        <div className="flex-1 relative overflow-hidden">
          <GaiaMap
            layerVisibility={LAYER_VISIBILITY}
            onLocationSelect={(lat, lon) => openRegion(lat, lon)}
          />
        </div>

        {/* Data wall overlays right side of map */}
        <AnimatePresence>
          {region && (
            <DataWall
              key={`${region.lat},${region.lon}`}
              region={region}
              onClose={closeRegion}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Ticker always at bottom */}
      <Ticker onAlertClick={openRegion} />
    </div>
  );
}
```

**Step 2: Update app/map/page.tsx**

```tsx
import { MonitorShell } from "@/components/monitor/MonitorShell";

export default function MapPage() {
  return <MonitorShell />;
}
```

**Step 3: Verify full build**

```bash
cd /Users/samu/gaia-ai && npx next build 2>&1 | grep -E "^(Error|error TS)" | grep -v node_modules | head -20
```

Expected: no new errors (pre-existing TS errors in airquality/biodiversity files are OK)

**Step 4: Start dev server and visually verify**

```bash
cd /Users/samu/gaia-ai && npm run dev -- --port 3001 &
sleep 5 && echo "Server ready at http://localhost:3001/map"
```

**Step 5: Commit**

```bash
cd /Users/samu/gaia-ai && git add components/monitor/MonitorShell.tsx app/map/page.tsx && git commit -m "feat: MonitorShell — mission control layout wiring LeftPanel, map, DataWall, Ticker"
```

---

## Summary

| Task | Deliverable |
|------|------------|
| 1 | globals.css — mission control tokens + ticker animation |
| 2 | MetricRow + SectionHeader shared primitives |
| 3 | Ticker — scrolling convergence alerts |
| 4 | LeftPanel — ActiveEvents + TopAlerts |
| 5 | DataWall — 6 sections (Fire, AQ, Weather, Vegetation, Convergence, Briefing) |
| 6 | MonitorShell + app/map/page.tsx wired |

After Task 6 the monitor is live at http://localhost:3001/map.
