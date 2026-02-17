"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type { BiodiversityData } from "@/types/biodiversity";
import "leaflet/dist/leaflet.css";

// Dynamically import map component to avoid SSR issues
const BiodiversityMap = dynamic(() => import("./BiodiversityMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] border border-white bg-code flex items-center justify-center text-white-dim font-mono text-sm">
      <span className="text-blue">&gt;</span> LOADING_MAP
      <span className="cursor"></span>
    </div>
  ),
});

interface BiodiversityWidgetProps {
  defaultLocation?: string;
  defaultLat?: number;
  defaultLon?: number;
}

export default function BiodiversityWidget({
  defaultLocation = "Salt Spring Island, BC",
  defaultLat = 48.8167,
  defaultLon = -123.5,
}: BiodiversityWidgetProps) {
  const [bioData, setBioData] = useState<BiodiversityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState(defaultLocation);
  const [coordinates, setCoordinates] = useState({ lat: defaultLat, lon: defaultLon });

  const fetchBiodiversityData = async (locationName: string, lat: number, lon: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/biodiversity?location=${encodeURIComponent(locationName)}&lat=${lat}&lon=${lon}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch biodiversity data");
      }

      const data = await response.json();
      setBioData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBiodiversityData(location, coordinates.lat, coordinates.lon);
  }, []);

  const handleLocationChange = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newLocation = formData.get("location") as string;
    if (newLocation.trim()) {
      setLocation(newLocation);
      // In production, geocode the location first
      // For demo, use default coordinates
      fetchBiodiversityData(newLocation, coordinates.lat, coordinates.lon);
    }
  };

  return (
    <div className="terminal-window p-6">
      <div className="window-header mb-6">
        <span className="text-blue">[BIODIVERSITY_MODULE]</span>
        <div className="window-controls">
          <div className="window-control"></div>
          <div className="window-control"></div>
          <div className="window-control"></div>
        </div>
      </div>

      {/* Demo mode banner */}
      <div className="mb-4 border border-blue bg-code p-3">
        <div className="flex items-center gap-2 text-blue text-xs font-mono">
          <span className="status-indicator status-active"></span>
          <div>
            <div className="font-bold uppercase">GBIF_CONNECTED</div>
            <div className="text-[10px] text-white-dim">
              SPECIES OCCURRENCE DATA • 2+ BILLION RECORDS
            </div>
          </div>
        </div>
      </div>

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
          <span className="text-blue">&gt;</span> FETCHING_BIODIVERSITY_DATA
          <span className="cursor"></span>
        </div>
      )}

      {error && (
        <div className="border border-white bg-code p-4 text-white font-mono text-sm">
          <span>&gt;&gt; ERROR:</span> {error}
        </div>
      )}

      {bioData && !loading && !error && (
        <>
          {/* Summary Stats */}
          <div className="border border-white bg-code p-6 mb-6">
            <h3 className="text-xl font-bold text-white uppercase tracking-wider mb-4">
              {bioData.location.name}
            </h3>
            <div className="text-xs text-white-dim uppercase tracking-widest mb-4">
              LAT: {bioData.location.lat.toFixed(4)} • LON: {bioData.location.lon.toFixed(4)}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-mono">
              <div className="border border-white p-3">
                <div className="text-white-dim uppercase mb-1">SPECIES</div>
                <div className="text-white text-lg">
                  {bioData.summary.uniqueSpecies}
                </div>
                <div className="text-white-dim text-[10px]">UNIQUE</div>
              </div>

              <div className="border border-white p-3">
                <div className="text-white-dim uppercase mb-1">OBSERVATIONS</div>
                <div className="text-white text-lg">
                  {bioData.summary.totalOccurrences}
                </div>
                <div className="text-white-dim text-[10px]">TOTAL</div>
              </div>

              <div className="border border-white p-3">
                <div className="text-white-dim uppercase mb-1">KINGDOMS</div>
                <div className="text-white text-lg">
                  {Object.keys(bioData.summary.kingdoms).length}
                </div>
                <div className="text-white-dim text-[10px]">REPRESENTED</div>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="mb-6">
            <div className="text-white-dim uppercase text-xs tracking-widest mb-4 font-mono">
              <span className="text-blue">&gt;&gt;</span> OCCURRENCE_DENSITY_MAP
            </div>
            <BiodiversityMap
              center={[bioData.location.lat, bioData.location.lon]}
              zoom={10}
            />
          </div>

          {/* Top Species List */}
          <div className="border border-white bg-code p-4 mb-6">
            <div className="text-white-dim uppercase text-xs tracking-widest mb-4 font-mono">
              <span className="text-blue">&gt;&gt;</span> TOP_SPECIES_OBSERVED
            </div>
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {bioData.occurrences.slice(0, 10).map((species, idx) => (
                <div
                  key={idx}
                  className="border border-white p-3 font-mono text-xs"
                >
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex-1">
                      <div className="text-white italic">{species.scientificName}</div>
                      {species.commonName && (
                        <div className="text-white-dim text-[10px] uppercase">
                          {species.commonName}
                        </div>
                      )}
                    </div>
                    <div className="text-blue text-sm font-bold ml-2">
                      {species.count}
                    </div>
                  </div>
                  <div className="flex justify-between text-[10px] text-white-dim">
                    <span>{species.kingdom}</span>
                    {species.lastSeen && <span>LAST: {species.lastSeen}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Natural Capital Valuation */}
          {(bioData as any).valuation && (
            <div className="border-2 border-blue bg-code p-4 mb-6">
              <div className="text-blue uppercase text-xs tracking-widest mb-3 font-mono font-bold">
                <span className="text-white">$$</span> BIODIVERSITY_VALUE
              </div>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="border border-white p-3">
                  <div className="text-white-dim uppercase mb-1 text-[10px]">ANNUAL_TOTAL</div>
                  <div className="text-blue text-xl font-bold">{(bioData as any).valuation.naturalCapital.annualTotalFormatted}</div>
                  <div className="text-[10px] text-white-dim">ECOSYSTEM SERVICES</div>
                </div>
                <div className="border border-white p-3">
                  <div className="text-white-dim uppercase mb-1 text-[10px]">EXTINCTION_RISK</div>
                  <div className="text-orange text-xl font-bold">{(bioData as any).valuation.extinctionRisk.potentialLossValueFormatted}</div>
                  <div className="text-[10px] text-white-dim">{(bioData as any).valuation.extinctionRisk.atRiskSpecies} SPECIES AT RISK</div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-[10px] font-mono">
                <div className="border border-white p-2">
                  <div className="text-white-dim mb-1">EXISTENCE</div>
                  <div className="text-white">{(bioData as any).valuation.annualEcosystemServices.breakdown.existenceValue.formatted}</div>
                </div>
                <div className="border border-white p-2">
                  <div className="text-white-dim mb-1">GENETIC</div>
                  <div className="text-white">{(bioData as any).valuation.annualEcosystemServices.breakdown.geneticResources.formatted}</div>
                </div>
                <div className="border border-white p-2">
                  <div className="text-white-dim mb-1">POLLINAT</div>
                  <div className="text-white">{(bioData as any).valuation.annualEcosystemServices.breakdown.pollination.formatted}</div>
                </div>
              </div>
              <div className="mt-2 text-[10px] text-white-dim font-mono">
                <span className="text-blue">&gt;</span> {(bioData as any).valuation.analysisArea} • {(bioData as any).valuation.methodology}
              </div>
            </div>
          )}

          {/* Kingdom Distribution */}
          <div className="border border-blue bg-code p-4">
            <div className="text-xs text-white-dim font-mono space-y-1">
              <div>
                <span className="text-blue">&gt;</span> DATASET: Global Biodiversity Information Facility
              </div>
              <div>
                <span className="text-blue">&gt;</span> COVERAGE: 2+ billion species occurrence records
              </div>
              {Object.entries(bioData.summary.kingdoms).map(([kingdom, count]) => (
                <div key={kingdom}>
                  <span className="text-blue">&gt;</span> {kingdom.toUpperCase()}: {count} observations
                </div>
              ))}
            </div>
          </div>

          {/* Status bar */}
          <div className="mt-6 pt-4 border-t border-white flex justify-between text-[10px] text-white-dim uppercase tracking-widest">
            <div>
              DATA_SOURCE: <span className="text-blue">GBIF_API</span>
            </div>
            <div>
              RADIUS: <span className="text-blue">10KM</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
