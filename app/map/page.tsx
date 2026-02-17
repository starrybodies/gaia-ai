"use client";

import dynamic from "next/dynamic";

// Dynamically import the map view to avoid SSR issues
const IntegratedMapView = dynamic(() => import("@/components/IntegratedMapView"), {
  ssr: false,
  loading: () => (
    <div className="h-screen w-screen bg-terminal flex items-center justify-center">
      <div className="terminal-window p-8">
        <div className="text-white-dim font-mono text-sm">
          <div className="mb-4">
            <span className="text-blue">&gt;</span> INITIALIZING_GAIA_MAP_ENGINE
            <span className="cursor"></span>
          </div>
          <div className="text-[10px] space-y-1">
            <div><span className="text-blue">&gt;</span> LOADING_GEOSPATIAL_LAYERS...</div>
            <div><span className="text-blue">&gt;</span> CONNECTING_DATA_MODULES...</div>
            <div><span className="text-blue">&gt;</span> PREPARING_VALUATION_ENGINE...</div>
          </div>
        </div>
      </div>
    </div>
  ),
});

export default function MapPage() {
  return <IntegratedMapView />;
}
