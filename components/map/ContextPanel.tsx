"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

interface Region {
  lat: number;
  lon: number;
  name?: string;
}

interface ContextPanelProps {
  region: Region;
  onClose: () => void;
}

function useBriefing(region: Region) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    abortRef.current?.abort();
    abortRef.current = new AbortController();
    setText("");
    setLoading(true);

    (async () => {
      try {
        const res = await fetch("/api/briefing", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lat: region.lat,
            lon: region.lon,
            locationName: region.name,
          }),
          signal: abortRef.current!.signal,
        });

        if (!res.ok || !res.body) {
          setLoading(false);
          return;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const payload = line.slice(6);
            if (payload === "[DONE]") {
              setLoading(false);
              return;
            }
            try {
              const { text: chunk } = JSON.parse(payload);
              if (chunk) setText((prev) => prev + chunk);
            } catch {
              // malformed chunk — skip
            }
          }
        }
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          setText("Unable to load briefing.");
        }
      } finally {
        setLoading(false);
      }
    })();

    return () => abortRef.current?.abort();
  }, [region.lat, region.lon, region.name]);

  return { text, loading };
}

export function ContextPanel({ region, onClose }: ContextPanelProps) {
  const { text, loading } = useBriefing(region);

  const regionLabel = region.name ?? `${region.lat.toFixed(2)}, ${region.lon.toFixed(2)}`;

  return (
    <motion.div
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      transition={{ ease: "easeOut", duration: 0.2 }}
      className="absolute right-0 top-12 bottom-8 w-96 z-20 flex flex-col overflow-hidden"
      style={{
        background: "var(--bg-surface)",
        borderLeft: "1px solid var(--border-1)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 shrink-0"
        style={{ borderBottom: "1px solid var(--border-2)" }}
      >
        <div>
          <div className="text-sm font-medium text-pretty" style={{ color: "var(--text-1)" }}>
            {regionLabel}
          </div>
          <div className="text-xs mt-0.5" style={{ color: "var(--text-4)" }}>
            {region.lat.toFixed(4)}°, {region.lon.toFixed(4)}°
          </div>
        </div>
        <button
          onClick={onClose}
          aria-label="Close panel"
          className="size-8 flex items-center justify-center rounded-md text-lg transition-opacity hover:opacity-70"
          style={{ color: "var(--text-3)" }}
        >
          ×
        </button>
      </div>

      {/* Briefing section */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        <div className="text-xs font-medium uppercase tracking-wide mb-2" style={{ color: "var(--text-4)" }}>
          Live Briefing
        </div>

        {loading && text === "" ? (
          /* Skeleton while loading */
          <div className="space-y-2" aria-busy="true" aria-label="Loading briefing">
            {[100, 90, 95, 80, 85].map((w, i) => (
              <div
                key={i}
                className="h-3 rounded"
                style={{
                  width: `${w}%`,
                  background: "var(--bg-raised)",
                  opacity: 0.6,
                }}
              />
            ))}
          </div>
        ) : (
          <div
            className="text-sm leading-relaxed whitespace-pre-wrap text-pretty"
            style={{ color: "var(--text-2)" }}
          >
            {text || "No briefing available for this location."}
            {loading && (
              <span
                className="inline-block w-2 h-4 ml-0.5 align-middle"
                style={{ background: "var(--signal-bio)", opacity: 0.8 }}
                aria-hidden="true"
              />
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
