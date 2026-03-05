"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";

interface WeeklyChartProps {
  data: { week: string; units: number }[];
  color: string;
  height?: number;
}

export function WeeklyChart({ data, color, height = 180 }: WeeklyChartProps) {
  const maxVal = Math.max(...data.map((d) => d.units));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 20, right: 0, bottom: 0, left: 0 }}>
        <XAxis
          dataKey="week"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 11, fill: "#26225d", opacity: 0.5 }}
        />
        <YAxis hide />
        <Bar dataKey="units" radius={[8, 8, 0, 0]} maxBarSize={48}>
          {data.map((entry, i) => (
            <Cell
              key={i}
              fill={entry.units === maxVal ? color : `${color}30`}
              stroke={color}
              strokeWidth={entry.units === maxVal ? 0 : 1.5}
            />
          ))}
          <LabelList
            dataKey="units"
            position="top"
            formatter={(v) => v != null ? Number(v).toLocaleString() : ""}
            style={{
              fontSize: 11,
              fontWeight: 600,
              fill: "#26225d",
              fontFamily: "var(--font-barlow-condensed)",
            }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
