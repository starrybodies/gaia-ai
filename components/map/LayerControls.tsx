"use client";

interface LayerDef {
  id: string;
  label: string;
  visible: boolean;
  color: string;
}

interface LayerControlsProps {
  layers: LayerDef[];
  onToggle: (layerId: string) => void;
}

export function LayerControls({ layers, onToggle }: LayerControlsProps) {
  return (
    <div className="absolute top-4 left-4 z-10 bg-black/70 rounded-lg p-3 space-y-2 backdrop-blur-sm border border-white/10">
      <div className="text-xs font-mono text-white/60 uppercase tracking-wider mb-2">
        Layers
      </div>
      {layers.map((layer) => (
        <button
          key={layer.id}
          onClick={() => onToggle(layer.id)}
          className="flex items-center gap-2 w-full text-left hover:bg-white/10 rounded px-2 py-1 transition-colors"
        >
          <div
            className="w-3 h-3 rounded-sm flex-shrink-0"
            style={{
              backgroundColor: layer.visible ? layer.color : 'transparent',
              border: `2px solid ${layer.color}`,
            }}
          />
          <span className={`text-xs font-mono ${layer.visible ? 'text-white' : 'text-white/40'}`}>
            {layer.label}
          </span>
        </button>
      ))}
    </div>
  );
}
