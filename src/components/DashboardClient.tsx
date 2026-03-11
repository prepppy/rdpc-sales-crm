"use client";

import { useMemo } from "react";
import { AppData, getSkuColor } from "@/lib/types";
import { computeRetailerVelocity } from "@/lib/velocity";
import { WeeklyChart } from "./WeeklyChart";
import { SkuDonut } from "./SkuDonut";
import Image from "next/image";
import Link from "next/link";

export function DashboardClient({ data }: { data: AppData }) {
  const { summary, retailers, skus, storeItems } = data;
  const topRetailers = retailers.slice(0, 5);

  const weeklyData = Object.entries(summary.weeklyTotals).map(([key, value]) => ({
    week: `WK ${key.replace("w", "")}`,
    units: value,
  }));

  const skuData = skus.map((s) => ({
    name: s.name,
    value: s.total,
    color: getSkuColor(s.name),
  }));

  const retailerVelocity = useMemo(
    () => computeRetailerVelocity(retailers, storeItems, summary.weeklyTotals),
    [retailers, storeItems, summary.weeklyTotals]
  );

  return (
    <div className="max-w-lg mx-auto px-4 pt-2">
      {/* Header */}
      <header className="flex items-center justify-between py-4">
        <div className="flex items-center gap-3">
          <Image src="/rd-logo.svg" alt="Real Dough Pizza Co." width={36} height={36} className="shrink-0" />
          <div>
            <h1 className="heading-section text-lg text-navy leading-tight">Real Dough</h1>
            <p className="text-navy/50 text-xs font-medium">Sales Dashboard</p>
          </div>
        </div>
        <div className="pill bg-navy text-cream">
          2026
        </div>
      </header>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <StatCard
          label="Total Units"
          value={summary.totalUnits.toLocaleString()}
          color="bg-curd"
          textColor="text-navy"
          sub="Across all weeks"
        />
        <StatCard
          label="Retailers"
          value={summary.totalRetailers.toString()}
          color="bg-navy"
          textColor="text-cream"
          sub="Active chains"
        />
        <StatCard
          label="Stores"
          value={summary.totalStores.toString()}
          color="bg-wisco"
          textColor="text-navy"
          sub="Locations stocked"
        />
        <StatCard
          label="SKUs"
          value={summary.totalSKUs.toString()}
          color="bg-peppin"
          textColor="text-white"
          sub="Pizza varieties"
        />
      </div>

      {/* Retailer Velocity */}
      <section className="card p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="heading-card text-sm text-navy">Store Velocity</h2>
          <Link href="/velocity" className="pill bg-cream-light text-navy/60 hover:bg-cream transition-colors">
            View All
          </Link>
        </div>
        <div className="flex gap-2.5 overflow-x-auto pb-2 -mx-1 px-1 snap-x snap-mandatory">
          {retailerVelocity.slice(0, 10).map((rv, i) => {
            const trendUp = rv.latestVelocity >= rv.avgVelocity;
            return (
              <div
                key={rv.code}
                className={`shrink-0 rounded-xl p-3 min-w-[112px] snap-start border ${
                  i === 0
                    ? "bg-navy border-navy"
                    : "bg-cream-light border-navy/8"
                }`}
              >
                <p
                  className={`text-[11px] font-medium truncate ${
                    i === 0 ? "text-cream/70" : "text-navy/50"
                  }`}
                >
                  {rv.name}
                </p>
                <div className="flex items-baseline gap-1 mt-1.5">
                  <span
                    className={`stat-number text-xl ${
                      i === 0 ? "text-curd" : "text-navy"
                    }`}
                  >
                    {rv.avgVelocity.toFixed(1)}
                  </span>
                  <span
                    className={`text-[10px] font-semibold ${
                      trendUp ? "text-okie" : "text-peppin"
                    }`}
                  >
                    {trendUp ? "\u25B2" : "\u25BC"}
                  </span>
                </div>
                <p
                  className={`text-[10px] mt-1 font-medium ${
                    i === 0 ? "text-cream/40" : "text-navy/35"
                  }`}
                >
                  {rv.totalStores} store{rv.totalStores !== 1 ? "s" : ""}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Weekly Trend */}
      <section className="card p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="heading-card text-sm text-navy">Weekly Units</h2>
          <span className="pill bg-cream text-navy/70">Wks {Object.keys(summary.weeklyTotals).map(k => k.replace("w", "")).join("-")}</span>
        </div>
        <WeeklyChart data={weeklyData} color="#26225d" />
      </section>

      {/* SKU Mix */}
      <section className="card p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="heading-card text-sm text-navy">SKU Mix</h2>
          <Link href="/skus" className="pill bg-cream-light text-navy/60 hover:bg-cream transition-colors">
            View All
          </Link>
        </div>
        <SkuDonut data={skuData} total={summary.totalUnits} />
      </section>

      {/* Top Retailers */}
      <section className="card-navy p-4 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="heading-card text-sm text-cream">Top Retailers</h2>
          <Link href="/retailers" className="pill bg-cream/15 text-cream/80 hover:bg-cream/25 transition-colors">
            View All
          </Link>
        </div>
        <div className="space-y-3">
          {topRetailers.map((r, i) => (
            <div key={r.code} className="flex items-center gap-3">
              <span className="stat-number text-curd text-lg w-6 text-right">{i + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="text-cream text-sm font-medium truncate">{r.name}</p>
                <div className="mt-1 h-1.5 rounded-full bg-cream/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-curd transition-all"
                    style={{
                      width: `${(r.total / topRetailers[0].total) * 100}%`,
                    }}
                  />
                </div>
              </div>
              <span className="stat-number text-cream text-sm">
                {r.total.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* SKU Leaderboard */}
      <section className="card p-4 mb-4">
        <h2 className="heading-card text-sm text-navy mb-3">SKU Leaderboard</h2>
        <div className="space-y-2.5">
          {skus.map((s) => {
            const color = getSkuColor(s.name);
            return (
              <div key={s.code} className="flex items-center gap-3">
                <div
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: color }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-navy text-sm font-medium truncate">{s.name}</p>
                  <div className="mt-1 h-1.5 rounded-full bg-navy/5 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${(s.total / skus[0].total) * 100}%`,
                        backgroundColor: color,
                      }}
                    />
                  </div>
                </div>
                <span className="stat-number text-navy text-sm">
                  {s.total.toLocaleString()}
                </span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
  textColor,
  sub,
}: {
  label: string;
  value: string;
  color: string;
  textColor: string;
  sub: string;
}) {
  return (
    <div className={`${color} rounded-2xl p-4 transition-transform active:scale-[0.97]`}>
      <p className={`label-upper ${textColor} opacity-70 mb-1`}>{label}</p>
      <p className={`stat-number text-3xl ${textColor}`}>{value}</p>
      <p className={`${textColor} opacity-50 text-xs mt-1 font-medium`}>{sub}</p>
    </div>
  );
}
