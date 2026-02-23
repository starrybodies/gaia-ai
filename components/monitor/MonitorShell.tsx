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

        {/* Map fills remaining space */}
        <div className="flex-1 relative overflow-hidden">
          <GaiaMap
            layerVisibility={LAYER_VISIBILITY}
            onLocationSelect={(lat, lon) => openRegion(lat, lon)}
          />
        </div>

        {/* DataWall overlays right side of map */}
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
