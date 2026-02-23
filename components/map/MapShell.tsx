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
