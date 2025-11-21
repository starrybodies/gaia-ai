"use client";

import { useEffect, useState } from "react";
import type { SoilData } from "@/types/soil";
import { getPHDescription, getSoilHealthColor, SOIL_TYPES } from "@/lib/soil";

interface SoilWidgetProps {
  defaultLocation?: string;
  defaultLat?: number;
  defaultLon?: number;
}

export default function SoilWidget({
  defaultLocation = "Salt Spring Island, BC",
  defaultLat = 48.8167,
  defaultLon = -123.5,
}: SoilWidgetProps) {
  const [data, setData] = useState<SoilData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/soil?location=${encodeURIComponent(defaultLocation)}&lat=${defaultLat}&lon=${defaultLon}`
      );

      if (!response.ok) throw new Error("Failed to fetch soil data");
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
        <span className="text-blue">[SOIL_DATA_MODULE]</span>
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
            <div className="font-bold uppercase">SOIL_INTELLIGENCE</div>
            <div className="text-[10px] text-white-dim">
              COMPOSITION • NUTRIENTS • HEALTH METRICS
            </div>
          </div>
        </div>
      </div>

      {loading && (
        <div className="text-white-dim font-mono text-sm">
          <span className="text-blue">&gt;</span> ANALYZING_SOIL_COMPOSITION
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
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-white uppercase tracking-wider mb-1">
                  {data.location.name}
                </h3>
                <div className="text-xs text-white-dim uppercase">
                  {data.properties.soilType} • {data.properties.texture}
                </div>
              </div>
              <div className="text-right">
                <div className={`text-3xl font-bold text-${getSoilHealthColor(data.health.score)} font-mono`}>
                  {data.health.score}
                </div>
                <div className="text-xs text-white-dim">HEALTH SCORE</div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
              <div className="border border-white p-3">
                <div className="text-white-dim uppercase mb-1">pH</div>
                <div className="text-white text-lg">{data.properties.pH}</div>
                <div className="text-white-dim text-[10px]">
                  {getPHDescription(data.properties.pH).toUpperCase()}
                </div>
              </div>

              <div className="border border-white p-3">
                <div className="text-white-dim uppercase mb-1">ORGANIC</div>
                <div className="text-white text-lg">{data.properties.organicMatter}%</div>
                <div className="text-white-dim text-[10px]">MATTER</div>
              </div>

              <div className="border border-white p-3">
                <div className="text-white-dim uppercase mb-1">CARBON</div>
                <div className="text-white text-lg">{data.health.carbonContent}</div>
                <div className="text-white-dim text-[10px]">T/HA</div>
              </div>

              <div className="border border-white p-3">
                <div className="text-white-dim uppercase mb-1">MOISTURE</div>
                <div className="text-white text-lg">{data.moisture.current}%</div>
                <div className="text-white-dim text-[10px]">{data.moisture.status.toUpperCase()}</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            <div className="border border-white bg-code p-4">
              <div className="text-white-dim uppercase text-xs tracking-widest mb-4 font-mono">
                <span className="text-blue">&gt;&gt;</span> NUTRIENTS (KG/HA)
              </div>
              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-white-dim">NITROGEN (N)</span>
                  <span className="text-white">{data.properties.nitrogen}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white-dim">PHOSPHORUS (P)</span>
                  <span className="text-white">{data.properties.phosphorus}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white-dim">POTASSIUM (K)</span>
                  <span className="text-white">{data.properties.potassium}</span>
                </div>
              </div>
            </div>

            <div className="border border-white bg-code p-4">
              <div className="text-white-dim uppercase text-xs tracking-widest mb-4 font-mono">
                <span className="text-blue">&gt;&gt;</span> LAND_USE
              </div>
              <div className="space-y-2 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-white-dim">TYPE</span>
                  <span className="text-white">{data.landUse.type.toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white-dim">COVERAGE</span>
                  <span className="text-white">{data.landUse.coverage}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white-dim">DRAINAGE</span>
                  <span className="text-white">{data.properties.drainage.toUpperCase()}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border border-blue bg-code p-4">
            <div className="text-xs text-white-dim font-mono space-y-1">
              <div><span className="text-blue">&gt;</span> SOIL_TYPE: {SOIL_TYPES[data.properties.soilType as keyof typeof SOIL_TYPES] || data.properties.soilType}</div>
              <div><span className="text-blue">&gt;</span> BIODIVERSITY: {data.health.biodiversity.toUpperCase()}</div>
              <div><span className="text-blue">&gt;</span> EROSION_RISK: {data.health.erosionRisk.toUpperCase()}</div>
              <div><span className="text-blue">&gt;</span> SUITABLE_CROPS: {data.landUse.cropSuitability.join(", ")}</div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white flex justify-between text-[10px] text-white-dim uppercase tracking-widest">
            <div>SOURCE: <span className="text-blue">ISRIC_SOILGRIDS</span></div>
            <div>RATING: <span className="text-blue">{data.health.rating.toUpperCase()}</span></div>
          </div>
        </>
      )}
    </div>
  );
}
