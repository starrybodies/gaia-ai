# Gaia Monitor — UI Design Document

**Date:** 2026-02-23
**Status:** Approved

---

## Goal

Replace the current generic green marketing aesthetic with a mission-control-grade environmental data monitor. Two modes: global watch (map + live vitals) and drill-down (map compresses, data wall opens). Inspired by SpaceX mission control — dark, grid-based, dense, every pixel carries information.

---

## Layout

Three-column fixed chrome. Bottom ticker always present.

```
┌─ LEFT PANEL ────┬──────────────────────────────┬─ DATA WALL ──────┐
│ 280px           │   MAP (flex, compresses)      │ 400px on click   │
│ always visible  │                               │                  │
│ live-polling    │                               │                  │
│ every 30s       │                               │                  │
└─────────────────┴──────────────────────────────┴──────────────────┘
│ TICKER 40px — scrolling convergence events                         │
└────────────────────────────────────────────────────────────────────┘
```

### Watch Mode
Left panel active. Map fills center + right. Ticker scrolling.

### Drill-Down Mode
User clicks map → data wall slides in from right (400px). Map compresses to fill remaining center space. Left panel unchanged.

---

## Color System

| Token | Value | Use |
|---|---|---|
| `--bg-base` | `#080c10` | page background |
| `--bg-panel` | `#0e1419` | panels |
| `--bg-raised` | `#141d24` | cards, hover |
| `--border` | `rgba(255,255,255,0.07)` | hairline grid lines |
| `--text-1` | `#e8edf2` | values, readings |
| `--text-2` | `#8da0b0` | labels, units |
| `--text-3` | `#4a5a6a` | timestamps, metadata |
| `--accent` | `#00b4d8` | panel headers, active states |
| `--nominal` | `#22c55e` | systems normal |
| `--watch` | `#eab308` | elevated |
| `--warning` | `#f97316` | action required |
| `--critical` | `#ef4444` | high priority |
| `--emergency` | `#a855f7` | extreme event |

---

## Typography

- **Data/numbers:** Geist Mono, `tabular-nums`, tight tracking
- **Section labels:** Geist Sans, 10–11px, uppercase, `letter-spacing: 0.08em`
- **Body/briefing:** Geist Sans, 13px
- **Status indicator:** solid `■` colored by severity level

---

## Left Panel — World Vitals

Four sections, polling every 30s.

### ACTIVE EVENTS
- Fire count (from `/api/fires`)
- Deforestation alert count (from `/api/convergence` filtered by signal type)
- Convergence counts by severity: WATCH / WARNING / CRITICAL / EMERGENCY

### ATMOSPHERE
- CO₂ ppm (from `/api/carbon`)
- Global AQI (from `/api/airquality`)

### TOP ALERTS
- Top 3 convergence alerts from `/api/convergence?min_severity=WATCH&limit=3`
- Per alert: `■ CRITICAL  Amazon Basin  CI=8.4  fire, deforestation  3m ago`

### SYSTEM
- Data freshness: last FIRMS update timestamp, pipeline health dot

---

## Center Map

- Dark basemap: Stadia Alidade Smooth Dark (or Mapbox dark-v11 equivalent free tile)
- Existing layers preserved: fire (ScatterplotLayer), convergence (H3HexagonLayer), deforestation (MVT)
- Cursor: crosshair
- Click anywhere → open data wall for that lat/lon
- Zoom controls: minimal, bottom-right
- No other map chrome

---

## Right Panel — Data Wall

Opens on map click. 400px wide. Slides in (motion/react, 200ms easeOut). Six collapsible sections.

Each section header: `■ STATUS  SECTION NAME` in cyan/accent uppercase mono.

| Section | Endpoint | Key fields |
|---|---|---|
| FIRE | `/api/fires` | detection count, max brightness K, max FRP MW, severity |
| AIR QUALITY | `/api/airquality` | AQI, PM2.5 μg/m³, PM10, NO₂, WHO status |
| VEGETATION | `/api/satellite` | NDVI, EVI, canopy cover %, deforestation alerts |
| WEATHER | `/api/weather` | temp °C, humidity %, wind m/s, condition |
| CONVERGENCE | `/api/convergence` | nearby alerts, CI score, dominant signals |
| BRIEFING | `/api/briefing` | streaming AI summary, collapsed by default |

Each metric row: `LABEL .............. VALUE  UNIT  ■STATUS`

Close button top-right. Escape key closes.

---

## Bottom Ticker

- Polls `/api/convergence?min_severity=WATCH&limit=20` every 60s
- Auto-scrolls left continuously via CSS animation
- Format: `14:32  ■CRITICAL  Amazon Basin  CI=8.4  fire, deforestation`
- Pauses on hover
- Separator: `·` between items

---

## Component File Map

```
app/globals.css                          ← mission control tokens
app/map/page.tsx                         ← render MonitorShell
components/monitor/
  MonitorShell.tsx                       ← layout orchestrator
  LeftPanel/
    LeftPanel.tsx                        ← world vitals container
    ActiveEvents.tsx                     ← fire/deforestation/convergence counts
    AtmosphereReadings.tsx               ← CO₂, AQI
    TopAlerts.tsx                        ← top 3 convergence alerts
    SystemStatus.tsx                     ← data freshness
  DataWall/
    DataWall.tsx                         ← right panel container + slide animation
    FireSection.tsx                      ← fire metrics
    AirQualitySection.tsx                ← AQI metrics
    VegetationSection.tsx                ← NDVI/canopy metrics
    WeatherSection.tsx                   ← weather metrics
    ConvergenceSection.tsx               ← nearby alerts
    BriefingSection.tsx                  ← streaming AI briefing
  Ticker.tsx                             ← bottom scrolling alert feed
  MetricRow.tsx                          ← shared: LABEL ... VALUE UNIT ■STATUS
  SectionHeader.tsx                      ← shared: ■ STATUS  SECTION NAME
components/map/                          ← existing map components (keep)
  MapShell.tsx                           ← refactor: accept onLocationSelect, no side panels
```

---

## Interactions

| Action | Result |
|---|---|
| Click map | Data wall opens for that lat/lon, map compresses |
| Click data wall close / press Escape | Data wall closes, map expands back |
| Hover ticker item | Ticker pauses |
| Click ticker item | Data wall opens for that alert's location |
| Click top alert in left panel | Data wall opens for that location |

---

## What Gets Deleted

- `components/map/LayerControls.tsx` — replaced by layer toggles in MonitorShell header
- `components/map/ContextPanel.tsx` — replaced by DataWall
- `components/map/TopBar.tsx` — replaced by MonitorShell header
- `components/map/AlertStrip.tsx` — replaced by Ticker
- `app/(site)/page.tsx` — landing page rewrite (minimal, links to monitor)
- `components/Header.tsx` — rewrite to match mission control aesthetic
