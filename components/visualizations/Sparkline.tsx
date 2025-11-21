"use client";

import { LineChart, Line, ResponsiveContainer, YAxis } from "recharts";

interface SparklineProps {
  data: number[];
  color?: string;
  height?: number;
  showDots?: boolean;
  trend?: "up" | "down" | "flat";
}

export default function Sparkline({
  data,
  color = "#00A7E1",
  height = 40,
  showDots = false,
}: SparklineProps) {
  const chartData = data.map((value, index) => ({ value, index }));

  // Calculate trend
  const firstHalf = data.slice(0, Math.floor(data.length / 2));
  const secondHalf = data.slice(Math.floor(data.length / 2));
  const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
  const trend = secondAvg > firstAvg * 1.05 ? "up" : secondAvg < firstAvg * 0.95 ? "down" : "flat";

  const trendColors = {
    up: "#00A7E1",
    down: "#FF8C42",
    flat: "#E8E8E8",
  };

  const trendColor = trendColors[trend];

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <YAxis domain={["dataMin", "dataMax"]} hide />
            <Line
              type="monotone"
              dataKey="value"
              stroke={color || trendColor}
              strokeWidth={2}
              dot={showDots ? { fill: color || trendColor, r: 2 } : false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="text-xs font-mono">
        {trend === "up" && <span className="text-blue">+{((secondAvg - firstAvg) / firstAvg * 100).toFixed(1)}%</span>}
        {trend === "down" && <span className="text-orange">-{((firstAvg - secondAvg) / firstAvg * 100).toFixed(1)}%</span>}
        {trend === "flat" && <span className="text-white-dim">~0%</span>}
      </div>
    </div>
  );
}
