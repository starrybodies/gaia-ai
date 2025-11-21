"use client";

interface BarData {
  label: string;
  value: number;
  max?: number;
  color?: string;
}

interface HorizontalBarsProps {
  data: BarData[];
  showValues?: boolean;
  unit?: string;
}

export default function HorizontalBars({
  data,
  showValues = true,
  unit = "",
}: HorizontalBarsProps) {
  const maxValue = Math.max(...data.map((d) => d.max || d.value));

  const defaultColors = ["#00A7E1", "#E8E8E8", "#FF8C42", "#98D8C8", "#FFB347"];

  return (
    <div className="space-y-3">
      {data.map((item, idx) => {
        const percentage = (item.value / (item.max || maxValue)) * 100;
        const color = item.color || defaultColors[idx % defaultColors.length];

        return (
          <div key={item.label} className="space-y-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-white-dim uppercase tracking-wider">
                {item.label}
              </span>
              {showValues && (
                <span className="text-white">
                  {item.value.toFixed(1)}
                  {unit}
                </span>
              )}
            </div>
            <div className="h-2 bg-white bg-opacity-10 relative">
              <div
                className="h-full transition-all duration-500 ease-out"
                style={{
                  width: `${Math.min(percentage, 100)}%`,
                  backgroundColor: color,
                }}
              />
              {item.max && (
                <div
                  className="absolute top-0 bottom-0 w-px bg-white bg-opacity-50"
                  style={{ left: "100%" }}
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
