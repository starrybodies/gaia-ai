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
      className="absolute right-0 top-0 bottom-0 w-[400px] z-20 flex flex-col overflow-hidden"
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
