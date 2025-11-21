"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface DonutData {
  name: string;
  value: number;
  color?: string;
}

interface DonutChartProps {
  data: DonutData[];
  centerLabel?: string;
  centerValue?: string | number;
  height?: number;
  showLegend?: boolean;
}

const defaultColors = [
  "#00A7E1", // blue
  "#FF8C42", // orange
  "#E8E8E8", // white
  "#98D8C8", // mint
  "#FFB347", // light orange
  "#87CEEB", // sky blue
  "#DDA0DD", // plum
];

export default function DonutChart({
  data,
  centerLabel,
  centerValue,
  height = 200,
  showLegend = true,
}: DonutChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="flex items-center gap-4">
      <div className="relative flex-shrink-0" style={{ width: height, height }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius="60%"
              outerRadius="80%"
              paddingAngle={2}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color || defaultColors[index % defaultColors.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#D2691E",
                border: "1px solid #FFFFFF",
                borderRadius: "0",
                fontFamily: "monospace",
                fontSize: "11px",
              }}
              formatter={(value: number) => [
                `${value} (${((value / total) * 100).toFixed(1)}%)`,
                "",
              ]}
            />
          </PieChart>
        </ResponsiveContainer>
        {(centerLabel || centerValue) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {centerValue && (
              <div className="text-xl font-bold font-mono text-white">
                {centerValue}
              </div>
            )}
            {centerLabel && (
              <div className="text-[10px] text-white-dim uppercase tracking-wider">
                {centerLabel}
              </div>
            )}
          </div>
        )}
      </div>

      {showLegend && (
        <div className="flex-1 space-y-2">
          {data.map((item, idx) => (
            <div key={item.name} className="flex items-center gap-2 text-xs font-mono">
              <div
                className="w-3 h-3 flex-shrink-0"
                style={{
                  backgroundColor:
                    item.color || defaultColors[idx % defaultColors.length],
                }}
              />
              <span className="text-white-dim uppercase flex-1 truncate">
                {item.name}
              </span>
              <span className="text-white">
                {((item.value / total) * 100).toFixed(0)}%
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
