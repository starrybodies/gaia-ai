"use client";

import { useEffect, useState } from "react";
import type { SatelliteData } from "@/types/satellite";
import { getNDVIDescription, getNDVIColor } from "@/lib/satellite";

interface SatelliteWidgetProps {
  defaultLocation?: string;
  defaultLat?: number;
  defaultLon?: number;
}

export default function SatelliteWidget({
  defaultLocation = "Salt Spring Island, BC",
  defaultLat = 48.8167,
  defaultLon = -123.5,
}: SatelliteWidgetProps) {
  const [data, setData] = useState<SatelliteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/satellite?location=${encodeURIComponent(defaultLocation)}&lat=${defaultLat}&lon=${defaultLon}`
      );

      if (!response.ok) throw new Error("Failed to fetch satellite data");
      setData(await response.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [defaultLocation]);

  return (
    <div className="terminal-window p-6">
      <div className="window-header mb-6">
        <span className="text-blue">[SATELLITE_OBSERVATION_MODULE]</span>
        <div className="window-controls">
          <div className="window-control"></div>
          <div className="window-control"></div>
          <div className="window-control"></div>
        </div>
      </div>

      <div className="mb-4 border border-blue bg-code p-3">
        <div className="flex items-center gap-2 text-blue text-xs font-mono">
          <span className="status-indicator status-active"></span>
          <div>
            <div className="font-bold uppercase">NASA_EARTH_OBSERVATORY</div>
            <div className="text-[10px] text-white-dim">
              MODIS • LANDSAT • VEGETATION INDICES • EVENT TRACKING
            </div>
          </div>
        </div>
      </div>

      {loading && (
        <div className="text-white-dim font-mono text-sm">
          <span className="text-blue">&gt;</span> DOWNLOADING_SATELLITE_DATA
          <span className="cursor"></span>
        </div>
      )}

      {error && (
        <div className="border border-white bg-code p-4 text-white font-mono text-sm">
          <span>&gt;&gt; ERROR:</span> {error}
        </div>
      )}

      {data && !loading && !error && (
        <>
          <div className="border border-white bg-code p-6 mb-6">
            <h3 className="text-xl font-bold text-white uppercase tracking-wider mb-1">
              {data.location.name}
            </h3>
            <div className="text-xs text-white-dim uppercase tracking-widest mb-4">
              {data.location.lat.toFixed(4)}°N, {Math.abs(data.location.lon).toFixed(4)}°W
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
              <div className="border border-white p-3">
                <div className="text-white-dim uppercase mb-1">NDVI</div>
                <div className={`text-${getNDVIColor(data.indices.ndvi || 0)} text-lg`}>
                  {data.indices.ndvi?.toFixed(2)}
                </div>
                <div className="text-white-dim text-[10px]">
                  {getNDVIDescription(data.indices.ndvi || 0).toUpperCase()}
                </div>
              </div>

              <div className="border border-white p-3">
                <div className="text-white-dim uppercase mb-1">EVI</div>
                <div className="text-white text-lg">
                  {data.indices.evi?.toFixed(2)}
                </div>
                <div className="text-white-dim text-[10px]">ENHANCED_VEG</div>
              </div>

              <div className="border border-white p-3">
                <div className="text-white-dim uppercase mb-1">NDWI</div>
                <div className="text-white text-lg">
                  {data.indices.ndwi?.toFixed(2)}
                </div>
                <div className="text-white-dim text-[10px]">WATER_INDEX</div>
              </div>

              <div className="border border-white p-3">
                <div className="text-white-dim uppercase mb-1">LST</div>
                <div className="text-white text-lg">
                  {data.indices.lst?.toFixed(1)}°C
                </div>
                <div className="text-white-dim text-[10px]">LAND_SURFACE</div>
              </div>
            </div>
          </div>

          {data.events.length > 0 && (
            <div className="border border-white bg-code p-4 mb-6">
              <div className="text-white-dim uppercase text-xs tracking-widest mb-4 font-mono">
                <span className="text-blue">&gt;&gt;</span> NEARBY_EARTH_EVENTS
              </div>
              <div className="space-y-2">
                {data.events.map((event) => (
                  <div key={event.id} className="border border-white p-3 font-mono text-xs">
                    <div className="flex justify-between items-start">
                      <div className="text-white">{event.title}</div>
                      <div className="text-blue">{event.distance}km</div>
                    </div>
                    <div className="text-white-dim text-[10px] mt-1">
                      {event.category} • {event.date}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="border border-blue bg-code p-4">
            <div className="text-xs text-white-dim font-mono space-y-1">
              <div><span className="text-blue">&gt;</span> NDVI: Vegetation health indicator (-1 to 1, higher = greener)</div>
              <div><span className="text-blue">&gt;</span> EVI: Enhanced vegetation index, corrects for atmospheric effects</div>
              <div><span className="text-blue">&gt;</span> NDWI: Water content in vegetation and soil</div>
              <div><span className="text-blue">&gt;</span> LST: Land surface temperature from thermal sensors</div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white flex justify-between text-[10px] text-white-dim uppercase tracking-widest">
            <div>SOURCE: <span className="text-blue">NASA_MODIS</span></div>
            <div>UPDATED: <span className="text-blue">{new Date(data.lastUpdated).toLocaleDateString()}</span></div>
          </div>
        </>
      )}
    </div>
  );
}
