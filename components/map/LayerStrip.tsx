"use client";

import { cn } from "@/lib/cn";

export interface LayerDef {
  id: string;
  label: string;
  color: string;
  icon: string;
}

interface LayerStripProps {
  layers: LayerDef[];
  visibility: Record<string, boolean>;
  onToggle: (id: string) => void;
}

export function LayerStrip({ layers, visibility, onToggle }: LayerStripProps) {
  return (
    <div
      className="absolute left-0 top-12 bottom-8 z-20 w-12 flex flex-col items-center py-2 gap-1"
      style={{
        background: "var(--bg-deep)",
        borderRight: "1px solid var(--border-1)",
      }}
    >
      {layers.map((layer) => {
        const active = visibility[layer.id] ?? false;
        return (
          <div key={layer.id} className="relative group">
            <button
              onClick={() => onToggle(layer.id)}
              aria-label={`${active ? "Hide" : "Show"} ${layer.label}`}
              aria-pressed={active}
              className={cn(
                "size-10 flex items-center justify-center rounded-md text-lg transition-opacity"
              )}
              style={{
                opacity: active ? 1 : 0.4,
                boxShadow: active ? `inset 2px 0 0 ${layer.color}` : undefined,
                background: active ? "var(--bg-raised)" : "transparent",
              }}
            >
              {layer.icon}
            </button>
            {/* Tooltip */}
            <div
              className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 rounded text-xs whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
              style={{
                background: "var(--bg-raised)",
                color: "var(--text-1)",
                border: "1px solid var(--border-1)",
              }}
            >
              {layer.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}
