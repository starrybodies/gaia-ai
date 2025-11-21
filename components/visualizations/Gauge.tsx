"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface GaugeProps {
  value: number;
  min?: number;
  max?: number;
  label?: string;
  unit?: string;
  thresholds?: { value: number; color: string }[];
  size?: "sm" | "md" | "lg";
}

const defaultThresholds = [
  { value: 33, color: "#00A7E1" }, // blue - good
  { value: 66, color: "#E8E8E8" }, // white - moderate
  { value: 100, color: "#FF8C42" }, // orange - poor
];

export default function Gauge({
  value,
  min = 0,
  max = 100,
  label,
  unit = "",
  thresholds = defaultThresholds,
  size = "md",
}: GaugeProps) {
  const normalizedValue = Math.min(Math.max(value, min), max);
  const percentage = ((normalizedValue - min) / (max - min)) * 100;

  // Determine color based on thresholds
  const getColor = () => {
    for (const threshold of thresholds) {
      if (percentage <= threshold.value) {
        return threshold.color;
      }
    }
    return thresholds[thresholds.length - 1]?.color || "#FF8C42";
  };

  const data = [
    { name: "value", value: percentage },
    { name: "remaining", value: 100 - percentage },
  ];

  const sizes = {
    sm: { height: 80, innerRadius: 25, outerRadius: 35, fontSize: "text-lg" },
    md: { height: 120, innerRadius: 40, outerRadius: 55, fontSize: "text-2xl" },
    lg: { height: 160, innerRadius: 55, outerRadius: 75, fontSize: "text-3xl" },
  };

  const config = sizes[size];

  return (
    <div className="relative" style={{ height: config.height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="75%"
            startAngle={180}
            endAngle={0}
            innerRadius={config.innerRadius}
            outerRadius={config.outerRadius}
            paddingAngle={0}
            dataKey="value"
            stroke="none"
          >
            <Cell fill={getColor()} />
            <Cell fill="rgba(255, 255, 255, 0.1)" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pt-4">
        <div className={`${config.fontSize} font-bold font-mono text-white`}>
          {Math.round(normalizedValue)}
          <span className="text-xs text-white-dim">{unit}</span>
        </div>
        {label && (
          <div className="text-[10px] text-white-dim uppercase tracking-wider mt-1">
            {label}
          </div>
        )}
      </div>
    </div>
  );
}
