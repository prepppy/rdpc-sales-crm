"use client";

import { AppData, getSkuColor } from "@/lib/types";
import { WeeklyChart } from "./WeeklyChart";
import { SkuDonut } from "./SkuDonut";
import Link from "next/link";

export function DashboardClient({ data }: { data: AppData }) {
  const { summary, retailers, skus } = data;
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

  return (
    <div className="max-w-lg mx-auto px-4 pt-2">
      {/* Header */}
      <header className="flex items-center justify-between py-4">
        <div>
          <h1 className="heading-section text-xl text-navy">Real Dough</h1>
          <p className="text-navy/50 text-xs font-medium mt-0.5">Sales Dashboard</p>
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

      {/* Weekly Trend */}
      <section className="card p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="heading-card text-sm text-navy">Weekly Units</h2>
          <span className="pill bg-cream text-navy/70">Wks 6-9</span>
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
