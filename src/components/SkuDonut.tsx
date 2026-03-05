"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface SkuDonutProps {
  data: { name: string; value: number; color: string }[];
  total: number;
}

export function SkuDonut({ data, total }: SkuDonutProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="relative w-32 h-32 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={36}
              outerRadius={56}
              paddingAngle={3}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="stat-number text-lg text-navy">
            {(total / 1000).toFixed(1)}k
          </span>
          <span className="text-[0.55rem] text-navy/40 font-medium">TOTAL</span>
        </div>
      </div>
      <div className="flex-1 space-y-1.5">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-xs text-navy/70 truncate flex-1">
              {item.name}
            </span>
            <span className="text-xs font-semibold text-navy tabular-nums">
              {((item.value / total) * 100).toFixed(0)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
