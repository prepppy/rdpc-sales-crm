"use client";

import { useState, useMemo } from "react";
import { AppData } from "@/lib/types";
import { computeRetailerVelocity } from "@/lib/velocity";
import { WeeklyChart } from "./WeeklyChart";
import Image from "next/image";

export function VelocityClient({ data }: { data: AppData }) {
  const { retailers, storeItems, summary } = data;
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"velocity" | "name">("velocity");
  const [expandedRetailer, setExpandedRetailer] = useState<string | null>(null);

  const velocityData = useMemo(
    () => computeRetailerVelocity(retailers, storeItems, summary.weeklyTotals),
    [retailers, storeItems, summary.weeklyTotals]
  );

  // Network-wide UPSPW
  const networkVelocity = useMemo(() => {
    const totalUnits = summary.totalUnits;
    const totalSlots = velocityData.reduce(
      (sum, rv) =>
        sum +
        rv.weeklyVelocities.reduce((ws, wv) => ws + wv.stores * wv.skus, 0),
      0
    );
    return totalSlots > 0 ? totalUnits / totalSlots : 0;
  }, [summary.totalUnits, velocityData]);

  const filtered = useMemo(() => {
    let list = [...velocityData];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (rv) =>
          rv.name.toLowerCase().includes(q) ||
          rv.code.toLowerCase().includes(q)
      );
    }
    if (sortBy === "name") {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }
    return list;
  }, [velocityData, search, sortBy]);

  const maxVelocity = velocityData[0]?.avgVelocity || 1;

  return (
    <div className="max-w-lg mx-auto px-4 pt-2">
      {/* Header */}
      <header className="py-4 flex items-center gap-3">
        <Image
          src="/rd-logo.svg"
          alt="Real Dough Pizza Co."
          width={32}
          height={32}
          className="shrink-0"
        />
        <div>
          <h1 className="heading-section text-xl text-navy">Store Velocity</h1>
          <p className="text-navy/50 text-xs font-medium">
            Units per SKU per Store per Week
          </p>
        </div>
      </header>

      {/* Network Summary */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-navy rounded-2xl p-3.5">
          <p className="label-upper text-cream/60 mb-1">Network UPSPW</p>
          <p className="stat-number text-2xl text-curd">
            {networkVelocity.toFixed(1)}
          </p>
        </div>
        <div className="bg-curd rounded-2xl p-3.5">
          <p className="label-upper text-navy/60 mb-1">Retailers</p>
          <p className="stat-number text-2xl text-navy">
            {velocityData.length}
          </p>
        </div>
        <div className="bg-wisco rounded-2xl p-3.5">
          <p className="label-upper text-navy/60 mb-1">Stores</p>
          <p className="stat-number text-2xl text-navy">
            {velocityData.reduce((s, rv) => s + rv.totalStores, 0)}
          </p>
        </div>
      </div>

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
          onClick={() =>
            setSortBy(sortBy === "velocity" ? "name" : "velocity")
          }
          className="px-3 py-2.5 bg-white rounded-xl border border-navy/8 text-navy/60 hover:border-curd transition-colors"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            {sortBy === "velocity" ? (
              <path d="M3 6h18M3 12h12M3 18h6" />
            ) : (
              <path d="M3 6h6M3 12h12M3 18h18" />
            )}
          </svg>
        </button>
      </div>

      {/* Retailer Velocity Cards */}
      <div className="space-y-3 mb-4">
        {filtered.map((rv, i) => {
          const isExpanded = expandedRetailer === rv.code;
          const trendUp = rv.latestVelocity >= rv.avgVelocity;
          const barPct = (rv.avgVelocity / maxVelocity) * 100;
          const weeklyChartData = rv.weeklyVelocities.map((wv) => ({
            week: wv.week,
            units: parseFloat(wv.velocity.toFixed(2)),
          }));

          return (
            <div key={rv.code} className="card overflow-hidden">
              <button
                onClick={() =>
                  setExpandedRetailer(isExpanded ? null : rv.code)
                }
                className="w-full p-4 text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-navy flex items-center justify-center shrink-0">
                    <span className="stat-number text-cream text-xs">
                      {sortBy === "velocity" ? i + 1 : rv.name[0]}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-navy text-sm font-semibold truncate">
                      {rv.name}
                    </p>
                    <div className="mt-1.5 h-1.5 rounded-full bg-navy/5 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-curd"
                        style={{ width: `${barPct}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-2">
                    <div className="flex items-baseline gap-1 justify-end">
                      <p className="stat-number text-lg text-navy">
                        {rv.avgVelocity.toFixed(1)}
                      </p>
                      <span
                        className={`text-[10px] font-semibold ${
                          trendUp ? "text-okie" : "text-peppin"
                        }`}
                      >
                        {trendUp ? "\u25B2" : "\u25BC"}
                      </span>
                    </div>
                    <p className="text-[0.6rem] text-navy/40 font-medium">
                      UPSPW
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
                  {/* UPSPW Trend Chart */}
                  {weeklyChartData.length > 1 && (
                    <div className="mt-3 mb-4">
                      <p className="label-upper text-navy/40 mb-2">
                        UPSPW Trend
                      </p>
                      <WeeklyChart
                        data={weeklyChartData}
                        color="#f4a81d"
                        height={120}
                      />
                    </div>
                  )}

                  {/* Weekly Breakdown Table */}
                  <p className="label-upper text-navy/40 mb-2">
                    Weekly Breakdown
                  </p>
                  <div className="bg-cream-light rounded-xl overflow-hidden">
                    <div className="grid grid-cols-4 gap-px text-[0.6rem] font-semibold text-navy/50 uppercase tracking-wider px-3 py-2 border-b border-navy/5">
                      <span>Week</span>
                      <span className="text-right">Stores</span>
                      <span className="text-right">Units</span>
                      <span className="text-right">UPSPW</span>
                    </div>
                    {rv.weeklyVelocities.map((wv) => (
                      <div
                        key={wv.week}
                        className="grid grid-cols-4 gap-px px-3 py-1.5 text-xs border-b border-navy/3 last:border-0"
                      >
                        <span className="font-medium text-navy/70">
                          {wv.week}
                        </span>
                        <span className="text-right stat-number text-navy/60">
                          {wv.stores}
                        </span>
                        <span className="text-right stat-number text-navy/60">
                          {wv.units.toLocaleString()}
                        </span>
                        <span className="text-right stat-number text-navy font-bold">
                          {wv.velocity.toFixed(1)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Summary Stats */}
                  <div className="flex gap-2 mt-3">
                    <div className="flex-1 bg-navy/5 rounded-lg p-2.5 text-center">
                      <p className="stat-number text-lg text-navy">
                        {rv.totalStores}
                      </p>
                      <p className="text-[0.6rem] text-navy/40 font-medium">
                        Total Stores
                      </p>
                    </div>
                    <div className="flex-1 bg-navy/5 rounded-lg p-2.5 text-center">
                      <p className="stat-number text-lg text-navy">
                        {rv.latestVelocity.toFixed(1)}
                      </p>
                      <p className="text-[0.6rem] text-navy/40 font-medium">
                        Latest UPSPW
                      </p>
                    </div>
                    <div className="flex-1 bg-curd/15 rounded-lg p-2.5 text-center">
                      <p className="stat-number text-lg text-navy">
                        {rv.avgVelocity.toFixed(1)}
                      </p>
                      <p className="text-[0.6rem] text-navy/40 font-medium">
                        Avg UPSPW
                      </p>
                    </div>
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
