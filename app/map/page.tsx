"use client";

import dynamic from "next/dynamic";

const GaiaMap = dynamic(
  () => import("@/components/map/GaiaMap").then((m) => ({ default: m.GaiaMap })),
  {
    ssr: false,
    loading: () => (
      <div className="h-screen w-screen bg-black flex items-center justify-center">
        <div className="text-white font-mono text-sm animate-pulse">
          INITIALIZING GAIA MAP ENGINE...
        </div>
      </div>
    ),
  }
);

export default function MapPage() {
  return (
    <div className="h-screen w-screen">
      <GaiaMap />
    </div>
  );
}
