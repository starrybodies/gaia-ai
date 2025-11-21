"use client";

import { useEffect, useState } from "react";
import type { SoilData } from "@/types/soil";
import { getPHDescription, getSoilHealthColor, SOIL_TYPES } from "@/lib/soil";
import { Gauge, HorizontalBars, DonutChart } from "./visualizations";

interface SoilWidgetProps {
  defaultLocation?: string;
  defaultLat?: number;
  defaultLon?: number;
}

// Optimal nutrient ranges (kg/ha)
const NUTRIENT_OPTIMAL = {
  nitrogen: 150,
  phosphorus: 50,
  potassium: 200,
};

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

  // Soil composition donut data
  const getCompositionData = () => {
    if (!data) return [];
    // Typical soil composition percentages
    const organicMatter = data.properties.organicMatter;
    const mineralContent = 100 - organicMatter - 25 - 25; // Remaining after water, air, organic
    return [
      { name: "Minerals", value: Math.max(mineralContent, 40), color: "#FF8C42" },
      { name: "Water", value: 25, color: "#00A7E1" },
      { name: "Air", value: 25, color: "#E8E8E8" },
      { name: "Organic", value: organicMatter, color: "#98D8C8" },
    ];
  };

  // Nutrient bars data
  const getNutrientBars = () => {
    if (!data) return [];
    return [
      {
        label: "N (Nitrogen)",
        value: data.properties.nitrogen,
        max: NUTRIENT_OPTIMAL.nitrogen * 1.5,
        color: data.properties.nitrogen >= NUTRIENT_OPTIMAL.nitrogen * 0.8 ? "#00A7E1" : "#FF8C42",
      },
      {
        label: "P (Phosphorus)",
        value: data.properties.phosphorus,
        max: NUTRIENT_OPTIMAL.phosphorus * 1.5,
        color: data.properties.phosphorus >= NUTRIENT_OPTIMAL.phosphorus * 0.8 ? "#00A7E1" : "#FF8C42",
      },
      {
        label: "K (Potassium)",
        value: data.properties.potassium,
        max: NUTRIENT_OPTIMAL.potassium * 1.5,
        color: data.properties.potassium >= NUTRIENT_OPTIMAL.potassium * 0.8 ? "#00A7E1" : "#FF8C42",
      },
    ];
  };

  // Health score thresholds
  const healthThresholds = [
    { value: 25, color: "#FF8C42" }, // Poor
    { value: 50, color: "#FFB347" }, // Fair
    { value: 75, color: "#E8E8E8" }, // Good
    { value: 100, color: "#00A7E1" }, // Excellent
  ];

  return (
    <div className="terminal-window p-6 h-full">
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
          {/* Header */}
          <div className="border border-white bg-code p-4 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-1">
                  {data.location.name}
                </h3>
                <div className="text-xs text-white-dim uppercase">
                  {data.properties.soilType} • {data.properties.texture}
                </div>
              </div>
              <div className="text-right">
                <div className={`text-2xl font-bold text-${getSoilHealthColor(data.health.score)} font-mono`}>
                  {data.health.score}/100
                </div>
                <div className="text-[10px] text-white-dim">HEALTH</div>
              </div>
            </div>
          </div>

          {/* Health Gauge + Composition Donut */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Health Gauge */}
            <div className="border border-white bg-code p-4">
              <div className="text-white-dim uppercase text-[10px] tracking-widest mb-2 font-mono">
                SOIL_HEALTH
              </div>
              <Gauge
                value={data.health.score}
                min={0}
                max={100}
                label={data.health.rating.toUpperCase()}
                thresholds={healthThresholds}
                size="sm"
              />
            </div>

            {/* Composition Donut */}
            <div className="border border-white bg-code p-4">
              <div className="text-white-dim uppercase text-[10px] tracking-widest mb-2 font-mono">
                COMPOSITION
              </div>
              <DonutChart
                data={getCompositionData()}
                height={100}
                showLegend={false}
                centerValue={`${data.properties.organicMatter}%`}
                centerLabel="ORGANIC"
              />
            </div>
          </div>

          {/* Key metrics row */}
          <div className="grid grid-cols-4 gap-3 text-xs font-mono mb-6">
            <div className="border border-white p-3">
              <div className="text-white-dim uppercase mb-1 text-[10px]">pH</div>
              <div className="text-white text-lg">{data.properties.pH}</div>
              <div className="text-[10px] text-white-dim truncate">
                {getPHDescription(data.properties.pH).toUpperCase().split(" ")[0]}
              </div>
            </div>
            <div className="border border-white p-3">
              <div className="text-white-dim uppercase mb-1 text-[10px]">CARBON</div>
              <div className="text-white text-lg">{data.health.carbonContent}</div>
              <div className="text-[10px] text-white-dim">T/HA</div>
            </div>
            <div className="border border-white p-3">
              <div className="text-white-dim uppercase mb-1 text-[10px]">MOISTURE</div>
              <div className="text-white text-lg">{data.moisture.current}%</div>
              <div className="text-[10px] text-white-dim">{data.moisture.status.toUpperCase().slice(0, 6)}</div>
            </div>
            <div className="border border-white p-3">
              <div className="text-white-dim uppercase mb-1 text-[10px]">DRAINAGE</div>
              <div className="text-white text-lg truncate">{data.properties.drainage.slice(0, 4).toUpperCase()}</div>
              <div className="text-[10px] text-white-dim">CLASS</div>
            </div>
          </div>

          {/* Nutrient Bars */}
          <div className="border border-white bg-code p-4 mb-6">
            <div className="text-white-dim uppercase text-xs tracking-widest mb-4 font-mono">
              <span className="text-blue">&gt;&gt;</span> NUTRIENT_LEVELS (KG/HA)
            </div>
            <HorizontalBars
              data={getNutrientBars()}
              showValues={true}
              unit=" kg/ha"
            />
            <div className="mt-3 text-[10px] text-white-dim font-mono">
              <span className="text-blue">BLUE</span> = ADEQUATE • <span className="text-orange">ORANGE</span> = LOW
            </div>
          </div>

          {/* Info panel */}
          <div className="border border-blue bg-code p-3">
            <div className="text-xs text-white-dim font-mono space-y-1">
              <div><span className="text-blue">&gt;</span> TYPE: {SOIL_TYPES[data.properties.soilType as keyof typeof SOIL_TYPES] || data.properties.soilType}</div>
              <div><span className="text-blue">&gt;</span> EROSION: {data.health.erosionRisk.toUpperCase()} • BIO: {data.health.biodiversity.toUpperCase()}</div>
              <div><span className="text-blue">&gt;</span> CROPS: {data.landUse.cropSuitability.slice(0, 3).join(", ")}</div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white flex justify-between text-[10px] text-white-dim uppercase tracking-widest">
            <div>SOURCE: <span className="text-blue">ISRIC_SOILGRIDS</span></div>
            <div>LAND: <span className="text-blue">{data.landUse.type.toUpperCase()}</span></div>
          </div>
        </>
      )}
    </div>
  );
}
