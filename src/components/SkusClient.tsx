"use client";

import { useState, useMemo } from "react";
import { AppData, getSkuColor } from "@/lib/types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";

export function SkusClient({ data }: { data: AppData }) {
  const { skus, storeItems, retailers } = data;
  const [expandedSku, setExpandedSku] = useState<string | null>(null);

  const weeklyBySku = useMemo(() => {
    return skus.map((s) => {
      const color = getSkuColor(s.name);
      const weeks = Object.entries(s.weeks)
        .filter(([, v]) => v > 0)
        .map(([key, value]) => ({
          week: `WK ${key.replace("w", "")}`,
          units: value,
        }));
      return { ...s, color, weeks };
    });
  }, [skus]);

  function getSkuByRetailer(skuName: string) {
    const items = storeItems.filter((si) => si.item === skuName);
    const retailerMap = new Map<
      string,
      { code: string; name: string; total: number; stores: number }
    >();
    for (const item of items) {
      if (!retailerMap.has(item.retailerCode)) {
        retailerMap.set(item.retailerCode, {
          code: item.retailerCode,
          name: item.retailer,
          total: 0,
          stores: 0,
        });
      }
      const r = retailerMap.get(item.retailerCode)!;
      r.total += item.total;
    }
    // Count distinct stores per retailer
    for (const [code, r] of retailerMap) {
      const storeSet = new Set(
        items.filter((i) => i.retailerCode === code).map((i) => i.store)
      );
      r.stores = storeSet.size;
    }
    return Array.from(retailerMap.values()).sort((a, b) => b.total - a.total);
  }

  // Comparison chart data
  const comparisonData = skus.map((s) => ({
    name: s.name.split(" ").slice(0, 2).join(" "),
    fullName: s.name,
    total: s.total,
    color: getSkuColor(s.name),
  }));

  return (
    <div className="max-w-lg mx-auto px-4 pt-2">
      {/* Header */}
      <header className="py-4">
        <h1 className="heading-section text-xl text-navy">SKU Breakdown</h1>
        <p className="text-navy/50 text-xs font-medium mt-0.5">
          {skus.length} pizza varieties
        </p>
      </header>

      {/* Comparison Chart */}
      <section className="card p-4 mb-4">
        <h2 className="heading-card text-sm text-navy mb-3">
          Total Units by SKU
        </h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart
            data={comparisonData}
            layout="vertical"
            margin={{ top: 0, right: 50, bottom: 0, left: 0 }}
          >
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="name"
              axisLine={false}
              tickLine={false}
              width={90}
              tick={{ fontSize: 10, fill: "#26225d" }}
            />
            <Bar dataKey="total" radius={[0, 8, 8, 0]} maxBarSize={28}>
              {comparisonData.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
              <LabelList
                dataKey="total"
                position="right"
                formatter={(v) => v != null ? Number(v).toLocaleString() : ""}
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  fill: "#26225d",
                  fontFamily: "var(--font-barlow-condensed)",
                }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </section>

      {/* Individual SKU Cards */}
      <div className="space-y-3 mb-4">
        {weeklyBySku.map((sku) => {
          const isExpanded = expandedSku === sku.code;
          const retailerBreakdown = isExpanded
            ? getSkuByRetailer(sku.name)
            : [];
          const topRetailerMax = retailerBreakdown[0]?.total || 1;

          return (
            <div key={sku.code} className="card overflow-hidden">
              <button
                onClick={() =>
                  setExpandedSku(isExpanded ? null : sku.code)
                }
                className="w-full p-4 text-left"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: sku.color }}
                  >
                    <span className="stat-number text-white text-xs">
                      {sku.code.slice(-2)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-navy text-sm font-semibold truncate">
                      {sku.name}
                    </p>
                    <p className="text-navy/40 text-xs mt-0.5">
                      SKU {sku.code}
                    </p>
                  </div>
                  <div className="text-right shrink-0 ml-2">
                    <p className="stat-number text-lg text-navy">
                      {sku.total.toLocaleString()}
                    </p>
                    <p className="text-[0.6rem] text-navy/40 font-medium">
                      {((sku.total / data.summary.totalUnits) * 100).toFixed(
                        1
                      )}
                      %
                    </p>
                  </div>
                  <svg
                    className={`w-4 h-4 text-navy/30 transition-transform shrink-0 ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 border-t border-navy/5">
                  {/* Weekly Trend */}
                  {sku.weeks.length > 1 && (
                    <div className="mt-3 mb-4">
                      <p className="label-upper text-navy/40 mb-2">
                        Weekly Trend
                      </p>
                      <ResponsiveContainer width="100%" height={120}>
                        <BarChart
                          data={sku.weeks}
                          margin={{ top: 20, right: 0, bottom: 0, left: 0 }}
                        >
                          <XAxis
                            dataKey="week"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 11, fill: "#26225d", opacity: 0.5 }}
                          />
                          <YAxis hide />
                          <Bar
                            dataKey="units"
                            radius={[6, 6, 0, 0]}
                            maxBarSize={36}
                            fill={sku.color}
                          >
                            <LabelList
                              dataKey="units"
                              position="top"
                              formatter={(v) => v != null ? Number(v).toLocaleString() : ""}
                              style={{
                                fontSize: 10,
                                fontWeight: 600,
                                fill: "#26225d",
                              }}
                            />
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}

                  {/* Retailer Breakdown */}
                  <p className="label-upper text-navy/40 mb-2">
                    By Retailer ({retailerBreakdown.length})
                  </p>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {retailerBreakdown.map((r) => (
                      <div
                        key={r.code}
                        className="bg-cream-light rounded-xl p-3"
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <p className="text-xs font-semibold text-navy truncate flex-1 mr-2">
                            {r.name}
                          </p>
                          <span className="stat-number text-sm text-navy">
                            {r.total.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 rounded-full bg-navy/5 overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${(r.total / topRetailerMax) * 100}%`,
                                backgroundColor: sku.color,
                              }}
                            />
                          </div>
                          <span className="text-[0.6rem] text-navy/40 font-medium shrink-0">
                            {r.stores} stores
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
