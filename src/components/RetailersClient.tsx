"use client";

import { useState, useMemo } from "react";
import { AppData, getSkuColor } from "@/lib/types";
import { WeeklyChart } from "./WeeklyChart";
import Image from "next/image";

export function RetailersClient({ data }: { data: AppData }) {
  const { retailers, storeItems } = data;
  const [search, setSearch] = useState("");
  const [expandedRetailer, setExpandedRetailer] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"total" | "name">("total");

  const filtered = useMemo(() => {
    let list = [...retailers];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.code.toLowerCase().includes(q)
      );
    }
    if (sortBy === "name") {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }
    return list;
  }, [retailers, search, sortBy]);

  const maxTotal = retailers[0]?.total || 1;

  function getRetailerStores(retailerCode: string) {
    const items = storeItems.filter((si) => si.retailerCode === retailerCode);
    const storeMap = new Map<string, { name: string; items: typeof items; total: number }>();
    for (const item of items) {
      if (!storeMap.has(item.store)) {
        storeMap.set(item.store, { name: item.store, items: [], total: 0 });
      }
      const store = storeMap.get(item.store)!;
      store.items.push(item);
      store.total += item.total;
    }
    return Array.from(storeMap.values()).sort((a, b) => b.total - a.total);
  }

  function getRetailerWeeklyData(r: (typeof retailers)[0]) {
    return Object.entries(r.weeks)
      .filter(([, v]) => v > 0)
      .map(([key, value]) => ({
        week: `WK ${key.replace("w", "")}`,
        units: value,
      }));
  }

  return (
    <div className="max-w-lg mx-auto px-4 pt-2">
      {/* Header */}
      <header className="py-4 flex items-center gap-3">
        <Image src="/rd-logo.svg" alt="Real Dough Pizza Co." width={32} height={32} className="shrink-0" />
        <div>
          <h1 className="heading-section text-xl text-navy">Retailers</h1>
          <p className="text-navy/50 text-xs font-medium">
            {retailers.length} retail chains
          </p>
        </div>
      </header>

      {/* Search + Sort */}
      <div className="flex gap-2 mb-4">
        <div className="flex-1 relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 text-navy/30"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search retailers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 bg-white rounded-xl text-sm text-navy placeholder:text-navy/30 border border-navy/8 focus:outline-none focus:border-curd transition-colors"
          />
        </div>
        <button
          onClick={() => setSortBy(sortBy === "total" ? "name" : "total")}
          className="px-3 py-2.5 bg-white rounded-xl border border-navy/8 text-navy/60 hover:border-curd transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {sortBy === "total" ? (
              <>
                <path d="M3 6h18M3 12h12M3 18h6" />
              </>
            ) : (
              <>
                <path d="M3 6h6M3 12h12M3 18h18" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Retailer Cards */}
      <div className="space-y-3 mb-4">
        {filtered.map((r, i) => {
          const isExpanded = expandedRetailer === r.code;
          const stores = isExpanded ? getRetailerStores(r.code) : [];
          const weekData = getRetailerWeeklyData(r);
          const barPct = (r.total / maxTotal) * 100;

          return (
            <div key={r.code} className="card overflow-hidden">
              <button
                onClick={() =>
                  setExpandedRetailer(isExpanded ? null : r.code)
                }
                className="w-full p-4 text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-navy flex items-center justify-center shrink-0">
                    <span className="stat-number text-cream text-xs">
                      {sortBy === "total" ? i + 1 : r.name[0]}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-navy text-sm font-semibold truncate">
                      {r.name}
                    </p>
                    <div className="mt-1.5 h-1.5 rounded-full bg-navy/5 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-curd"
                        style={{ width: `${barPct}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-2">
                    <p className="stat-number text-lg text-navy">
                      {r.total.toLocaleString()}
                    </p>
                    <p className="text-[0.6rem] text-navy/40 font-medium">UNITS</p>
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
                  {weekData.length > 1 && (
                    <div className="mt-3 mb-4">
                      <p className="label-upper text-navy/40 mb-2">Weekly Trend</p>
                      <WeeklyChart data={weekData} color="#f4a81d" height={120} />
                    </div>
                  )}

                  {/* Store List */}
                  <p className="label-upper text-navy/40 mb-2">
                    Stores ({stores.length})
                  </p>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {stores.map((store) => (
                      <div
                        key={store.name}
                        className="bg-cream-light rounded-xl p-3"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs font-semibold text-navy truncate flex-1 mr-2">
                            {store.name}
                          </p>
                          <span className="stat-number text-sm text-navy">
                            {store.total.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {store.items.map((item) => {
                            const color = getSkuColor(item.item);
                            return (
                              <span
                                key={item.itemCode}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[0.6rem] font-semibold text-white"
                                style={{ backgroundColor: color }}
                              >
                                {item.item.split(" ").slice(0, 2).join(" ")}
                                <span className="opacity-80">{item.total}</span>
                              </span>
                            );
                          })}
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

      {filtered.length === 0 && (
        <div className="text-center py-12 text-navy/30">
          <p className="text-sm">No retailers found</p>
        </div>
      )}
    </div>
  );
}
