# Gaia AI UI Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform Gaia AI from a terminal/cypherpunk aesthetic into a map-first "organic precision" environmental intelligence layer — full-screen globe, slide-in context panels, deep forest greens.

**Architecture:** Single-page map IS the product. Four zones: TopBar (h-12), LayerStrip (left 48px), ContextPanel (right w-96 slide-in), AlertStrip (bottom h-8). Route groups split site pages (with Header/Footer) from /map (standalone full-screen).

**Tech Stack:** Next.js 15 App Router, Tailwind CSS v4, motion/react (AnimatePresence + motion.div), clsx + tailwind-merge (cn utility), Geist Sans/Mono fonts already in layout.

---

### Task 1: Install dependencies and create cn utility

**Files:**
- Modify: `package.json` (via npm install)
- Create: `lib/cn.ts`

**Step 1: Install motion/react, clsx, tailwind-merge**

```bash
cd /Users/samu/gaia-ai && npm install motion clsx tailwind-merge
```

Expected: packages installed, no peer dep errors

**Step 2: Verify install**

```bash
cd /Users/samu/gaia-ai && node -e "require('motion/react'); require('clsx'); require('tailwind-merge'); console.log('OK')"
```

Expected: prints "OK"

**Step 3: Create lib/cn.ts**

```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

**Step 4: Verify TypeScript compiles**

```bash
cd /Users/samu/gaia-ai && npx tsc --noEmit 2>&1 | head -20
```

Expected: no errors for lib/cn.ts

**Step 5: Commit**

```bash
cd /Users/samu/gaia-ai && git add package.json package-lock.json lib/cn.ts && git commit -m "feat: add motion/react, clsx, tailwind-merge + cn utility"
```

---

### Task 2: Replace globals.css with organic precision design system

**Files:**
- Modify: `app/globals.css` (full replacement)

**Step 1: Replace globals.css entirely**

The current file has a terminal/cypherpunk burnt-orange style. Replace it completely:

```css
@import "tailwindcss";
@import "leaflet/dist/leaflet.css";

/* Organic Precision — Gaia AI Design System */
:root {
  /* Backgrounds */
  --bg-deep:    #060d08;
  --bg-surface: #0d1f12;
  --bg-raised:  #132a18;

  /* Signal colors */
  --signal-bio:      #22c55e;
  --signal-atmo:     #06b6d4;
  --signal-heat:     #f97316;
  --signal-critical: #ef4444;
  --signal-warn:     #eab308;

  /* Text */
  --text-1: #f0fdf4;
  --text-2: #bbf7d0;
  --text-3: #86efac;
  --text-4: #4ade80;

  /* Borders */
  --border-1: rgba(34, 197, 94, 0.15);
  --border-2: rgba(34, 197, 94, 0.07);

  /* Typography */
  --font-ui:   var(--font-geist-sans), system-ui, sans-serif;
  --font-data: var(--font-geist-mono), 'Courier New', monospace;
}

html, body {
  background-color: var(--bg-deep);
  color: var(--text-1);
  font-family: var(--font-ui);
  height: 100%;
}

/* Remove old terminal classes — all removed */
```

**Step 2: Verify no build errors**

```bash
cd /Users/samu/gaia-ai && npx next build 2>&1 | tail -20
```

Expected: build succeeds (may have type errors in old components referencing old CSS vars — those will be fixed in later tasks)

**Step 3: Commit**

```bash
cd /Users/samu/gaia-ai && git add app/globals.css && git commit -m "feat: replace terminal aesthetic with organic precision design tokens"
```

---

### Task 3: Route restructure — site layout group + map standalone layout

**Goal:** Move all site pages (landing, about, demo, login) under `app/(site)/` so they get Header+Footer. Map page at `app/map/` gets its own empty layout (no header/footer). Root layout becomes html/body/providers only.

**Files:**
- Modify: `app/layout.tsx` — remove Header+Footer, keep html/body/providers
- Create: `app/(site)/layout.tsx` — wraps with Header + Footer
- Create: `app/(site)/page.tsx` — move landing page content here (placeholder for now — Task 9 will redesign it)
- Create: `app/map/layout.tsx` — standalone (just children)
- Check: `app/about/`, `app/demo/`, `app/login/` — these stay at top level OR move to (site)/; only move if they currently import Header from layout

**Step 1: Read app/layout.tsx to see current structure**

```bash
cat /Users/samu/gaia-ai/app/layout.tsx
```

**Step 2: Update app/layout.tsx to html/body/providers only**

Current app/layout.tsx wraps everything in `<Header/>` + `<Footer/>`. Strip those out:

```tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Gaia AI — Environmental Intelligence",
  description: "Real-time environmental data legibility layer",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body style={{ background: "var(--bg-deep)", color: "var(--text-1)" }}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

**Step 3: Create app/(site)/layout.tsx**

```tsx
import { Header } from "@/components/Header";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-dvh">
      <Header />
      <main className="flex-1">{children}</main>
    </div>
  );
}
```

**Step 4: Create app/(site)/page.tsx — temporary placeholder**

Just move the landing page here so routing works. Task 9 will redesign it.

```tsx
export { default } from "../page";
```

Wait — that won't work cleanly. Instead create a minimal placeholder:

```tsx
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 p-8">
      <h1 className="text-4xl font-bold" style={{ color: "var(--text-1)" }}>
        Read the planet.
      </h1>
      <p style={{ color: "var(--text-3)" }}>
        Real-time environmental intelligence. Coming soon.
      </p>
      <Link
        href="/map"
        className="px-6 py-3 rounded-lg text-sm font-medium"
        style={{ background: "var(--signal-bio)", color: "var(--bg-deep)" }}
      >
        Open Map
      </Link>
    </div>
  );
}
```

**Step 5: Create app/map/layout.tsx — empty standalone**

```tsx
export default function MapLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
```

**Step 6: Verify routing**

```bash
cd /Users/samu/gaia-ai && npx next build 2>&1 | grep -E "(error|Error|✓|✗)" | head -30
```

Expected: both `/` and `/map` routes build without errors.

**Step 7: Commit**

```bash
cd /Users/samu/gaia-ai && git add app/layout.tsx "app/(site)/layout.tsx" "app/(site)/page.tsx" app/map/layout.tsx && git commit -m "feat: route groups — site pages get header/footer, map is standalone"
```

---

### Task 4: TopBar component

**Files:**
- Create: `components/map/TopBar.tsx`

**Step 1: Create TopBar**

```tsx
"use client";

import { cn } from "@/lib/cn";

interface TopBarProps {
  className?: string;
}

export function TopBar({ className }: TopBarProps) {
  return (
    <div
      className={cn(
        "absolute top-0 left-0 right-0 z-30 h-12 flex items-center px-4 gap-4",
        className
      )}
      style={{
        background: "var(--bg-deep)",
        borderBottom: "1px solid var(--border-1)",
      }}
    >
      {/* Logo */}
      <div
        className="size-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold"
        style={{ background: "var(--signal-bio)", color: "var(--bg-deep)" }}
        aria-label="Gaia AI"
      >
        G
      </div>

      {/* Search — centered */}
      <div className="flex-1 flex justify-center">
        <input
          type="text"
          placeholder="Search location…"
          className="w-full max-w-xs h-8 rounded-md px-3 text-sm outline-none"
          style={{
            background: "var(--bg-raised)",
            color: "var(--text-1)",
            border: "1px solid var(--border-1)",
            fontFamily: "var(--font-ui)",
          }}
        />
      </div>

      {/* Status */}
      <div className="flex items-center gap-2 text-xs shrink-0" style={{ color: "var(--text-3)" }}>
        <span
          className="size-2 rounded-full"
          style={{ background: "var(--signal-bio)" }}
          aria-hidden="true"
        />
        Alpha
      </div>
    </div>
  );
}
```

**Step 2: Verify TypeScript**

```bash
cd /Users/samu/gaia-ai && npx tsc --noEmit 2>&1 | grep "TopBar" | head -10
```

Expected: no errors

**Step 3: Commit**

```bash
cd /Users/samu/gaia-ai && git add components/map/TopBar.tsx && git commit -m "feat: TopBar component — logo, search, status"
```

---

### Task 5: LayerStrip component

**Files:**
- Create: `components/map/LayerStrip.tsx`

The LayerStrip is a 48px-wide vertical icon strip on the left side. Each layer has an emoji icon, aria-label, and shows an active indicator (left border) when visible. Tooltip appears on hover.

**Step 1: Create LayerStrip**

```tsx
"use client";

import { cn } from "@/lib/cn";

export interface LayerDef {
  id: string;
  label: string;
  color: string;
  icon: string;
}

interface LayerStripProps {
  layers: LayerDef[];
  visibility: Record<string, boolean>;
  onToggle: (id: string) => void;
}

export function LayerStrip({ layers, visibility, onToggle }: LayerStripProps) {
  return (
    <div
      className="absolute left-0 top-12 bottom-8 z-20 w-12 flex flex-col items-center py-2 gap-1"
      style={{
        background: "var(--bg-deep)",
        borderRight: "1px solid var(--border-1)",
      }}
    >
      {layers.map((layer) => {
        const active = visibility[layer.id] ?? false;
        return (
          <div key={layer.id} className="relative group">
            <button
              onClick={() => onToggle(layer.id)}
              aria-label={`${active ? "Hide" : "Show"} ${layer.label}`}
              aria-pressed={active}
              className="size-10 flex items-center justify-center rounded-md text-lg transition-opacity"
              style={{
                opacity: active ? 1 : 0.4,
                boxShadow: active ? `inset 2px 0 0 ${layer.color}` : undefined,
                background: active ? "var(--bg-raised)" : "transparent",
              }}
            >
              {layer.icon}
            </button>
            {/* Tooltip */}
            <div
              className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 rounded text-xs whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
              style={{
                background: "var(--bg-raised)",
                color: "var(--text-1)",
                border: "1px solid var(--border-1)",
              }}
            >
              {layer.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}
```

**Step 2: Verify TypeScript**

```bash
cd /Users/samu/gaia-ai && npx tsc --noEmit 2>&1 | grep "LayerStrip" | head -10
```

**Step 3: Commit**

```bash
cd /Users/samu/gaia-ai && git add components/map/LayerStrip.tsx && git commit -m "feat: LayerStrip component — icon buttons with active state and tooltips"
```

---

### Task 6: AlertStrip component

**Files:**
- Create: `components/map/AlertStrip.tsx`

The AlertStrip is a 32px-high bar at the bottom. It fetches `/api/convergence?min_severity=WATCH&limit=10` on mount and displays active alerts as scrolling pills.

**Step 1: Create AlertStrip**

```tsx
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
```

**Step 2: Verify TypeScript**

```bash
cd /Users/samu/gaia-ai && npx tsc --noEmit 2>&1 | grep "AlertStrip" | head -10
```

**Step 3: Commit**

```bash
cd /Users/samu/gaia-ai && git add components/map/AlertStrip.tsx && git commit -m "feat: AlertStrip component — live convergence alerts at bottom"
```

---

### Task 7: ContextPanel component with streaming briefing

**Files:**
- Create: `components/map/ContextPanel.tsx`

This is the main side panel. It slides in from the right when a region is selected. It streams a RAG briefing from `/api/briefing` via SSE, then shows active signals and EVS score.

**Step 1: Create ContextPanel**

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

interface Region {
  lat: number;
  lon: number;
  name?: string;
}

interface ContextPanelProps {
  region: Region;
  onClose: () => void;
}

function useBriefing(region: Region) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    abortRef.current?.abort();
    abortRef.current = new AbortController();
    setText("");
    setLoading(true);

    (async () => {
      try {
        const res = await fetch("/api/briefing", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lat: region.lat,
            lon: region.lon,
            locationName: region.name,
          }),
          signal: abortRef.current!.signal,
        });

        if (!res.ok || !res.body) {
          setLoading(false);
          return;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const payload = line.slice(6);
            if (payload === "[DONE]") {
              setLoading(false);
              return;
            }
            try {
              const { text: chunk } = JSON.parse(payload);
              if (chunk) setText((prev) => prev + chunk);
            } catch {
              // malformed chunk — skip
            }
          }
        }
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          setText("Unable to load briefing.");
        }
      } finally {
        setLoading(false);
      }
    })();

    return () => abortRef.current?.abort();
  }, [region.lat, region.lon, region.name]);

  return { text, loading };
}

export function ContextPanel({ region, onClose }: ContextPanelProps) {
  const { text, loading } = useBriefing(region);

  const regionLabel = region.name ?? `${region.lat.toFixed(2)}, ${region.lon.toFixed(2)}`;

  return (
    <motion.div
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      transition={{ ease: "easeOut", duration: 0.2 }}
      className="absolute right-0 top-12 bottom-8 w-96 z-20 flex flex-col overflow-hidden"
      style={{
        background: "var(--bg-surface)",
        borderLeft: "1px solid var(--border-1)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 shrink-0"
        style={{ borderBottom: "1px solid var(--border-2)" }}
      >
        <div>
          <div className="text-sm font-medium text-pretty" style={{ color: "var(--text-1)" }}>
            {regionLabel}
          </div>
          <div className="text-xs mt-0.5" style={{ color: "var(--text-4)" }}>
            {region.lat.toFixed(4)}°, {region.lon.toFixed(4)}°
          </div>
        </div>
        <button
          onClick={onClose}
          aria-label="Close panel"
          className="size-8 flex items-center justify-center rounded-md text-lg transition-opacity hover:opacity-70"
          style={{ color: "var(--text-3)" }}
        >
          ×
        </button>
      </div>

      {/* Briefing section */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        <div className="text-xs font-medium uppercase tracking-wide mb-2" style={{ color: "var(--text-4)" }}>
          Live Briefing
        </div>

        {loading && text === "" ? (
          /* Skeleton while loading */
          <div className="space-y-2" aria-busy="true" aria-label="Loading briefing">
            {[100, 90, 95, 80, 85].map((w, i) => (
              <div
                key={i}
                className="h-3 rounded"
                style={{
                  width: `${w}%`,
                  background: "var(--bg-raised)",
                  opacity: 0.6,
                }}
              />
            ))}
          </div>
        ) : (
          <div
            className="text-sm leading-relaxed whitespace-pre-wrap text-pretty"
            style={{ color: "var(--text-2)" }}
          >
            {text || "No briefing available for this location."}
            {loading && (
              <span
                className="inline-block w-2 h-4 ml-0.5 align-middle"
                style={{ background: "var(--signal-bio)", opacity: 0.8 }}
                aria-hidden="true"
              />
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
```

**Step 2: Verify TypeScript**

```bash
cd /Users/samu/gaia-ai && npx tsc --noEmit 2>&1 | grep "ContextPanel" | head -10
```

**Step 3: Commit**

```bash
cd /Users/samu/gaia-ai && git add components/map/ContextPanel.tsx && git commit -m "feat: ContextPanel with streaming RAG briefing and slide animation"
```

---

### Task 8: MapShell + update GaiaMap props + update app/map/page.tsx

**Files:**
- Create: `components/map/MapShell.tsx`
- Modify: `components/map/GaiaMap.tsx` — accept layerVisibility as prop, remove LayerControls
- Modify: `app/map/page.tsx` — render MapShell

**Step 1: Update GaiaMap to accept layerVisibility as a required prop**

Read `components/map/GaiaMap.tsx` first to see current state (already reviewed above).

Changes needed:
1. Remove `useState` for `layerVisibility`
2. Remove `toggleLayer` callback
3. Remove `layerDefs` useMemo
4. Accept `layerVisibility` and `onLocationSelect` as props
5. Remove `<LayerControls>` from JSX
6. Keep hover tooltip div

New GaiaMap.tsx:

```tsx
"use client";

import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import type maplibregl from 'maplibre-gl';
import { GaiaMapBase } from './GaiaMapBase';
import { DeckGLOverlay } from './DeckGLOverlay';
import { buildFireLayer } from './layers/FireLayer';
import { buildConvergenceLayer } from './layers/ConvergenceLayer';
import { buildEventsVectorLayer } from './layers/VectorTileLayer';
import type { Viewport } from './types';

interface GaiaMapProps {
  layerVisibility: {
    fire: boolean;
    deforestation: boolean;
    convergence: boolean;
    airQuality: boolean;
  };
  onLocationSelect?: (lat: number, lon: number) => void;
}

interface FireEvent {
  id: string;
  lat: number;
  lon: number;
  confidence: number;
  brightness: number;
  timestamp: string;
}

interface ConvergenceAlert {
  h3Index: string;
  ci: number;
  lat: number;
  lon: number;
}

export function GaiaMap({ layerVisibility, onLocationSelect }: GaiaMapProps) {
  const [map, setMap] = useState<maplibregl.Map | null>(null);
  const [fireEvents, setFireEvents] = useState<FireEvent[]>([]);
  const [convergenceAlerts, setConvergenceAlerts] = useState<ConvergenceAlert[]>([]);
  const [hoveredFeature, setHoveredFeature] = useState<unknown>(null);

  const abortRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleViewportChange = useCallback((viewport: Viewport) => {
    if (viewport.zoom < 3) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      abortRef.current?.abort();
      abortRef.current = new AbortController();
      try {
        const res = await fetch(
          `/api/fires?lat=${viewport.latitude}&lon=${viewport.longitude}&radius=500`,
          { signal: abortRef.current.signal }
        );
        if (res.ok) {
          const data = await res.json();
          setFireEvents(data.events ?? []);
        }
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          // Non-abort errors: stale data persists on map
        }
      }
    }, 500);
  }, []);

  useEffect(() => {
    fetch('/api/convergence?min_severity=WATCH')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.alerts) {
          setConvergenceAlerts(
            data.alerts
              .filter((a: { lat: number | null; lon: number | null }) => a.lat != null && a.lon != null)
              .map((a: { ci_score: number; lat: number; lon: number; h3_cells?: string[] }) => ({
                h3Index: a.h3_cells?.[0] ?? '',
                ci: a.ci_score,
                lat: a.lat,
                lon: a.lon,
              }))
          );
        }
      })
      .catch(() => {/* convergence API not yet available — silent */});
  }, []);

  const layers = useMemo(() => {
    const result = [];
    if (layerVisibility.fire) result.push(buildFireLayer(fireEvents));
    if (layerVisibility.deforestation) result.push(buildEventsVectorLayer('deforestation'));
    if (layerVisibility.convergence) result.push(buildConvergenceLayer(convergenceAlerts));
    return result;
  }, [fireEvents, convergenceAlerts, layerVisibility]);

  return (
    <div className="relative w-full h-full">
      <GaiaMapBase
        initialLat={20}
        initialLon={0}
        initialZoom={2}
        onMapReady={setMap}
        onViewportChange={handleViewportChange}
        onMapClick={onLocationSelect}
      />
      <DeckGLOverlay
        map={map}
        layers={layers}
        onHover={(info) => setHoveredFeature(info.object ?? null)}
      />
      {Boolean(hoveredFeature) && (
        <div className="absolute bottom-8 left-4 bg-black/80 text-white text-xs p-2 rounded font-mono pointer-events-none max-w-xs overflow-auto">
          <pre>{JSON.stringify(hoveredFeature, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
```

**Step 2: Create MapShell**

```tsx
"use client";

import { useState, useCallback, useMemo } from "react";
import { AnimatePresence } from "motion/react";
import { GaiaMap } from "./GaiaMap";
import { TopBar } from "./TopBar";
import { LayerStrip } from "./LayerStrip";
import { AlertStrip } from "./AlertStrip";
import { ContextPanel } from "./ContextPanel";

const LAYER_DEFS = [
  { id: "fire",          label: "Fire Detection",     color: "#f97316", icon: "🔥" },
  { id: "deforestation", label: "Deforestation",      color: "#22c55e", icon: "🌿" },
  { id: "convergence",   label: "Convergence Alerts", color: "#ef4444", icon: "⚡" },
  { id: "airQuality",    label: "Air Quality",        color: "#06b6d4", icon: "🌫️" },
];

interface FocusedRegion {
  lat: number;
  lon: number;
  name?: string;
}

export function MapShell() {
  const [layerVisibility, setLayerVisibility] = useState({
    fire: true,
    deforestation: true,
    convergence: true,
    airQuality: false,
  });

  const [focusedRegion, setFocusedRegion] = useState<FocusedRegion | null>(null);

  const toggleLayer = useCallback((id: string) => {
    setLayerVisibility((prev) => ({ ...prev, [id]: !prev[id as keyof typeof prev] }));
  }, []);

  const handleLocationSelect = useCallback((lat: number, lon: number) => {
    setFocusedRegion({ lat, lon });
  }, []);

  const visibilityRecord = useMemo(() => layerVisibility as Record<string, boolean>, [layerVisibility]);

  return (
    <div
      className="relative w-full h-dvh overflow-hidden"
      style={{ background: "var(--bg-deep)" }}
    >
      <TopBar />

      <LayerStrip
        layers={LAYER_DEFS}
        visibility={visibilityRecord}
        onToggle={toggleLayer}
      />

      {/* Map fills remaining space: below TopBar, right of LayerStrip, above AlertStrip */}
      <div className="absolute inset-0 top-12 left-12 bottom-8">
        <GaiaMap
          layerVisibility={layerVisibility}
          onLocationSelect={handleLocationSelect}
        />
      </div>

      <AnimatePresence>
        {focusedRegion && (
          <ContextPanel
            key={`${focusedRegion.lat},${focusedRegion.lon}`}
            region={focusedRegion}
            onClose={() => setFocusedRegion(null)}
          />
        )}
      </AnimatePresence>

      <AlertStrip />
    </div>
  );
}
```

**Step 3: Update app/map/page.tsx**

```tsx
import { MapShell } from "@/components/map/MapShell";

export default function MapPage() {
  return <MapShell />;
}
```

**Step 4: Verify build**

```bash
cd /Users/samu/gaia-ai && npx next build 2>&1 | grep -E "(error|Error)" | grep -v "node_modules" | head -20
```

Expected: no errors

**Step 5: Commit**

```bash
cd /Users/samu/gaia-ai && git add components/map/GaiaMap.tsx components/map/MapShell.tsx app/map/page.tsx && git commit -m "feat: MapShell orchestrates TopBar/LayerStrip/ContextPanel/AlertStrip; lift layerVisibility state"
```

---

### Task 9: Landing page redesign

**Files:**
- Modify: `app/(site)/page.tsx` — full redesign, no terminal windows

The landing page should convey "environmental intelligence layer" — clean, green, data-forward. No terminal windows, no glow effects, no all-caps. Typography: Geist Sans, proportional, text-balance headings.

**Step 1: Replace app/(site)/page.tsx with redesigned landing**

```tsx
import Link from "next/link";

const SIGNALS = [
  { label: "Fire Detection",     color: "var(--signal-heat)",     desc: "NASA FIRMS VIIRS near-real-time fire detections worldwide." },
  { label: "Deforestation",      color: "var(--signal-bio)",      desc: "Hansen/GFW canopy loss alerts at 30m resolution." },
  { label: "Convergence Alerts", color: "var(--signal-critical)", desc: "Multi-signal compound events scored by convergence index." },
  { label: "Air Quality",        color: "var(--signal-atmo)",     desc: "OpenAQ sensor network PM2.5, NO₂, and ozone readings." },
];

export default function HomePage() {
  return (
    <div style={{ background: "var(--bg-deep)", color: "var(--text-1)" }}>
      {/* Hero */}
      <section className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center gap-6">
        <div
          className="text-xs font-medium uppercase tracking-widest px-3 py-1 rounded-full"
          style={{
            color: "var(--signal-bio)",
            background: "rgba(34,197,94,0.1)",
            border: "1px solid rgba(34,197,94,0.2)",
          }}
        >
          Environmental Intelligence
        </div>
        <h1
          className="text-5xl sm:text-7xl font-bold text-balance max-w-2xl"
          style={{ color: "var(--text-1)", lineHeight: 1.1 }}
        >
          Read the planet.
        </h1>
        <p
          className="text-lg sm:text-xl text-pretty max-w-xl"
          style={{ color: "var(--text-3)" }}
        >
          Real-time environmental signals — fires, deforestation, air quality,
          convergence events — unified in a single legibility layer.
        </p>
        <Link
          href="/map"
          className="px-8 py-3.5 rounded-lg text-base font-semibold transition-opacity hover:opacity-90"
          style={{ background: "var(--signal-bio)", color: "var(--bg-deep)" }}
        >
          Open Map
        </Link>
      </section>

      {/* Signals grid */}
      <section className="max-w-4xl mx-auto px-6 pb-24">
        <h2
          className="text-sm font-medium uppercase tracking-widest mb-8 text-balance"
          style={{ color: "var(--text-4)" }}
        >
          Live data sources
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {SIGNALS.map((signal) => (
            <div
              key={signal.label}
              className="rounded-xl p-5"
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border-1)",
                borderLeft: `3px solid ${signal.color}`,
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="size-2 rounded-full shrink-0"
                  style={{ background: signal.color }}
                  aria-hidden="true"
                />
                <span className="text-sm font-medium" style={{ color: "var(--text-1)" }}>
                  {signal.label}
                </span>
              </div>
              <p className="text-sm text-pretty" style={{ color: "var(--text-3)" }}>
                {signal.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
```

**Step 2: Verify build**

```bash
cd /Users/samu/gaia-ai && npx next build 2>&1 | grep -E "^(error|Error)" | head -10
```

**Step 3: Commit**

```bash
cd /Users/samu/gaia-ai && git add "app/(site)/page.tsx" && git commit -m "feat: landing page redesign — organic precision, map-first, no terminal windows"
```

---

### Task 10: Header redesign

**Files:**
- Modify: `components/Header.tsx`

Current Header is terminal-style (`[ABOUT]`, `[DEMO]`, `SYS: ONLINE`, glow effects, all-caps). Redesign to: minimal nav, Geist Sans, green accent on active link, "Open Map" CTA button.

**Step 1: Read current Header.tsx**

```bash
cat /Users/samu/gaia-ai/components/Header.tsx
```

**Step 2: Replace with redesigned Header**

```tsx
import Link from "next/link";

const NAV_LINKS = [
  { href: "/about", label: "About" },
  { href: "/demo",  label: "Demo" },
  { href: "/docs",  label: "Docs" },
];

export function Header() {
  return (
    <header
      className="sticky top-0 z-40 h-14 flex items-center px-6 gap-6"
      style={{
        background: "var(--bg-deep)",
        borderBottom: "1px solid var(--border-1)",
      }}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 shrink-0">
        <div
          className="size-7 rounded-full flex items-center justify-center text-xs font-bold"
          style={{ background: "var(--signal-bio)", color: "var(--bg-deep)" }}
          aria-hidden="true"
        >
          G
        </div>
        <span
          className="text-sm font-semibold hidden sm:block"
          style={{ color: "var(--text-1)" }}
        >
          Gaia AI
        </span>
      </Link>

      {/* Nav */}
      <nav className="flex items-center gap-1 flex-1">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="px-3 py-1.5 rounded-md text-sm transition-colors hover:opacity-80"
            style={{ color: "var(--text-3)" }}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {/* CTA */}
      <Link
        href="/map"
        className="px-4 py-1.5 rounded-lg text-sm font-medium shrink-0 transition-opacity hover:opacity-90"
        style={{ background: "var(--signal-bio)", color: "var(--bg-deep)" }}
      >
        Open Map
      </Link>
    </header>
  );
}
```

**Step 3: Verify full build passes**

```bash
cd /Users/samu/gaia-ai && npx next build 2>&1 | tail -15
```

Expected: clean build, all routes compile

**Step 4: Run existing tests to confirm nothing broken**

```bash
cd /Users/samu/gaia-ai && npm test -- --passWithNoTests 2>&1 | tail -20
```

**Step 5: Commit**

```bash
cd /Users/samu/gaia-ai && git add components/Header.tsx && git commit -m "feat: Header redesign — minimal nav, Geist Sans, green CTA"
```

---

## Summary

10 tasks. Each is self-contained and commits cleanly.

| Task | What it builds |
|------|---------------|
| 1    | motion/react + cn utility |
| 2    | globals.css organic precision tokens |
| 3    | Route groups (site vs map) |
| 4    | TopBar component |
| 5    | LayerStrip component |
| 6    | AlertStrip component |
| 7    | ContextPanel (streaming briefing) |
| 8    | MapShell + GaiaMap prop refactor |
| 9    | Landing page redesign |
| 10   | Header redesign |

After Task 8 all four map zones are wired. Tasks 9 and 10 polish the site pages.
