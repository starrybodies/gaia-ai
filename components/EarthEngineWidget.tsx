"use client";

import { useEffect, useState } from "react";

interface EarthEngineWidgetProps {
  defaultLocation?: string;
  defaultLat?: number;
  defaultLon?: number;
}

interface NDVIData {
  mean: number;
  min: number;
  max: number;
  stdDev: number;
  cloudCover: number;
}

interface LandCoverData {
  classes: {
    [key: string]: {
      name: string;
      percentage: number;
      area_km2: number;
    };
  };
}

interface EcosystemHealthData {
  score: number;
  components: {
    ndvi: number;
    landCoverDiversity: number;
    temperatureStability: number;
  };
  details: {
    ndvi: NDVIData;
    landCover: LandCoverData;
    temperature: {
      mean_celsius: number;
      min_celsius: number;
      max_celsius: number;
    };
  };
}

export default function EarthEngineWidget({
  defaultLocation = "Salt Spring Island, BC",
  defaultLat = 48.8167,
  defaultLon = -123.5,
}: EarthEngineWidgetProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState(defaultLocation);
  const [coordinates, setCoordinates] = useState({ lat: defaultLat, lon: defaultLon });
  const [healthData, setHealthData] = useState<EcosystemHealthData | null>(null);
  const [status, setStatus] = useState<string>("demo");

  const fetchData = async (locationName: string, lat: number, lon: number) => {
    setLoading(true);
    setError(null);

    try {
      // Fetch ecosystem health (includes NDVI and land cover)
      const healthResponse = await fetch(
        `/api/earth-engine/ecosystem-health?location=${encodeURIComponent(locationName)}&lat=${lat}&lon=${lon}`
      );

      if (!healthResponse.ok) {
        throw new Error("Failed to fetch Earth Engine data");
      }

      const healthResult = await healthResponse.json();
      setHealthData(healthResult.ecosystemHealth);

      // Check status
      const statusResponse = await fetch('/api/earth-engine/status');
      const statusResult = await statusResponse.json();
      setStatus(statusResult.status);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(location, coordinates.lat, coordinates.lon);
  }, []);

  const handleLocationChange = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newLocation = formData.get("location") as string;
    if (newLocation.trim()) {
      setLocation(newLocation);
      fetchData(newLocation, coordinates.lat, coordinates.lon);
    }
  };

  const getHealthColor = (score: number) => {
    if (score >= 80) return "text-blue";
    if (score >= 60) return "text-white";
    if (score >= 40) return "text-orange";
    return "text-white-dim";
  };

  return (
    <div className="terminal-window p-6">
      <div className="window-header mb-6">
        <span className="text-blue">[GOOGLE_EARTH_ENGINE]</span>
        <div className="flex items-center gap-2">
          {status === "demo" && (
            <span className="text-orange text-[10px] uppercase tracking-wider">DEMO_MODE</span>
          )}
          {status === "active" && (
            <span className="text-blue text-[10px] uppercase tracking-wider">AUTHENTICATED</span>
          )}
          <div className="window-controls">
            <div className="window-control"></div>
            <div className="window-control"></div>
            <div className="window-control"></div>
          </div>
        </div>
      </div>

      {/* Status Banner */}
      {status === "demo" && (
        <div className="mb-4 border border-orange bg-code p-3">
          <div className="flex items-center gap-2 text-orange text-xs font-mono">
            <span className="status-indicator bg-orange animate-pulse"></span>
            <div>
              <div className="font-bold uppercase">SIMULATED_DATA</div>
              <div className="text-[10px] text-white-dim">
                Using biome-based models. Add GOOGLE_EARTH_ENGINE_KEY for real satellite data.
              </div>
            </div>
          </div>
        </div>
      )}

      {status === "active" && (
        <div className="mb-4 border border-blue bg-code p-3">
          <div className="flex items-center gap-2 text-blue text-xs font-mono">
            <span className="status-indicator status-active"></span>
            <div>
              <div className="font-bold uppercase">EARTH_ENGINE_CONNECTED</div>
              <div className="text-[10px] text-white-dim">
                SENTINEL-2 • MODIS • ESA WORLDCOVER • Real-time satellite data
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Location input */}
      <form onSubmit={handleLocationChange} className="mb-6">
        <div className="flex gap-2">
          <div className="flex-1 border border-white bg-code p-2 flex items-center">
            <span className="text-blue mr-2">&gt;</span>
            <input
              type="text"
              name="location"
              defaultValue={location}
              placeholder="ENTER_LOCATION"
              className="bg-transparent border-none outline-none text-white font-mono text-sm flex-1 uppercase tracking-wider placeholder:text-white-dim placeholder:opacity-50"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 border-2 border-blue text-blue hover:bg-blue hover:text-white transition-all font-mono text-xs uppercase tracking-wider"
          >
            QUERY
          </button>
        </div>
      </form>

      {loading && (
        <div className="text-white-dim font-mono text-sm">
          <span className="text-blue">&gt;</span> QUERYING_EARTH_ENGINE
          <span className="cursor"></span>
        </div>
      )}

      {error && (
        <div className="border border-orange bg-code p-4 text-white font-mono text-sm">
          <span>&gt;&gt; ERROR:</span> {error}
        </div>
      )}

      {healthData && !loading && !error && (
        <>
          {/* Ecosystem Health Score */}
          <div className="border-2 border-blue bg-code p-6 mb-6">
            <h3 className="text-sm text-white-dim uppercase tracking-widest mb-3 font-mono">
              ECOSYSTEM_HEALTH_SCORE
            </h3>
            <div className={`text-6xl font-bold font-mono mb-2 ${getHealthColor(healthData.score)}`}>
              {healthData.score.toFixed(1)}
            </div>
            <div className="text-xs text-white-dim uppercase tracking-widest">
              {location}
            </div>
          </div>

          {/* Component Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="border border-white bg-terminal p-4">
              <div className="text-white-dim uppercase text-[10px] tracking-widest mb-2">
                NDVI
              </div>
              <div className={`text-2xl font-bold font-mono ${getHealthColor(healthData.components.ndvi)}`}>
                {healthData.components.ndvi.toFixed(1)}
              </div>
              <div className="text-[10px] text-white-dim mt-1">Vegetation Health</div>
            </div>

            <div className="border border-white bg-terminal p-4">
              <div className="text-white-dim uppercase text-[10px] tracking-widest mb-2">
                DIVERSITY
              </div>
              <div className={`text-2xl font-bold font-mono ${getHealthColor(healthData.components.landCoverDiversity)}`}>
                {healthData.components.landCoverDiversity.toFixed(1)}
              </div>
              <div className="text-[10px] text-white-dim mt-1">Land Cover</div>
            </div>

            <div className="border border-white bg-terminal p-4">
              <div className="text-white-dim uppercase text-[10px] tracking-widest mb-2">
                TEMPERATURE
              </div>
              <div className={`text-2xl font-bold font-mono ${getHealthColor(healthData.components.temperatureStability)}`}>
                {healthData.components.temperatureStability.toFixed(1)}
              </div>
              <div className="text-[10px] text-white-dim mt-1">Stability</div>
            </div>
          </div>

          {/* NDVI Details */}
          <div className="border border-white bg-code p-4 mb-6">
            <div className="text-white-dim uppercase text-xs tracking-widest mb-3 font-mono">
              <span className="text-blue">&gt;&gt;</span> NORMALIZED_DIFFERENCE_VEGETATION_INDEX
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div>
                <div className="text-white-dim mb-1">MEAN</div>
                <div className="text-white text-lg">{healthData.details.ndvi.mean.toFixed(3)}</div>
              </div>
              <div>
                <div className="text-white-dim mb-1">MIN</div>
                <div className="text-white text-lg">{healthData.details.ndvi.min.toFixed(3)}</div>
              </div>
              <div>
                <div className="text-white-dim mb-1">MAX</div>
                <div className="text-white text-lg">{healthData.details.ndvi.max.toFixed(3)}</div>
              </div>
              <div>
                <div className="text-white-dim mb-1">STD_DEV</div>
                <div className="text-white text-lg">{healthData.details.ndvi.stdDev.toFixed(3)}</div>
              </div>
            </div>
            <div className="mt-3 text-[10px] text-white-dim">
              <span className="text-blue">&gt;</span> Cloud Cover: {healthData.details.ndvi.cloudCover}%
              • Source: Sentinel-2 Level 2A
            </div>
          </div>

          {/* Land Cover */}
          <div className="border border-white bg-code p-4 mb-6">
            <div className="text-white-dim uppercase text-xs tracking-widest mb-3 font-mono">
              <span className="text-blue">&gt;&gt;</span> LAND_COVER_CLASSIFICATION
            </div>
            <div className="space-y-2">
              {Object.entries(healthData.details.landCover.classes)
                .sort((a, b) => b[1].percentage - a[1].percentage)
                .map(([key, data]) => (
                  <div key={key} className="border border-white p-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-white text-xs uppercase">{data.name}</span>
                      <span className="text-blue text-sm font-bold">{data.percentage.toFixed(1)}%</span>
                    </div>
                    <div className="h-2 bg-terminal border border-white relative overflow-hidden">
                      <div
                        className="absolute inset-y-0 left-0 bg-blue"
                        style={{ width: `${data.percentage}%` }}
                      />
                    </div>
                    <div className="text-[10px] text-white-dim mt-1">
                      {data.area_km2.toFixed(1)} km² (10km radius assessment)
                    </div>
                  </div>
                ))}
            </div>
            <div className="mt-3 text-[10px] text-white-dim">
              <span className="text-blue">&gt;</span> Source: ESA WorldCover 10m • MODIS Land Cover
            </div>
          </div>

          {/* Surface Temperature */}
          <div className="border border-white bg-code p-4 mb-6">
            <div className="text-white-dim uppercase text-xs tracking-widest mb-3 font-mono">
              <span className="text-blue">&gt;&gt;</span> LAND_SURFACE_TEMPERATURE
            </div>
            <div className="grid grid-cols-3 gap-3 text-xs font-mono">
              <div>
                <div className="text-white-dim mb-1">MEAN</div>
                <div className="text-white text-lg">{healthData.details.temperature.mean_celsius.toFixed(1)}°C</div>
              </div>
              <div>
                <div className="text-white-dim mb-1">MIN</div>
                <div className="text-white text-lg">{healthData.details.temperature.min_celsius.toFixed(1)}°C</div>
              </div>
              <div>
                <div className="text-white-dim mb-1">MAX</div>
                <div className="text-white text-lg">{healthData.details.temperature.max_celsius.toFixed(1)}°C</div>
              </div>
            </div>
            <div className="mt-3 text-[10px] text-white-dim">
              <span className="text-blue">&gt;</span> Source: MODIS LST (1km resolution) • Landsat 8/9 Thermal
            </div>
          </div>

          {/* Methodology */}
          <div className="border border-blue bg-terminal p-4">
            <div className="text-xs text-white-dim font-mono space-y-1">
              <div>
                <span className="text-blue">&gt;</span> METHODOLOGY: Composite ecosystem health score
              </div>
              <div>
                <span className="text-blue">&gt;</span> NDVI weight: 50% • Diversity: 30% • Temperature: 20%
              </div>
              <div>
                <span className="text-blue">&gt;</span> SATELLITES: Sentinel-2 (10m) • MODIS (1km) • Landsat 8/9 (30m)
              </div>
              <div>
                <span className="text-blue">&gt;</span> UPDATE_FREQUENCY: 5-day revisit • Cloud-masked
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
