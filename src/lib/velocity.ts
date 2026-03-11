import { Retailer, StoreItem } from "./types";

export interface RetailerVelocity {
  code: string;
  name: string;
  avgVelocity: number;
  latestVelocity: number;
  latestStores: number;
  totalStores: number;
  weeklyVelocities: {
    week: string;
    velocity: number;
    stores: number;
    skus: number;
    units: number;
  }[];
}

export function computeRetailerVelocity(
  retailers: Retailer[],
  storeItems: StoreItem[],
  weeklyTotals: Record<string, number>
): RetailerVelocity[] {
  // retailerCode -> week -> Set of active stores / SKUs
  const activeStoresByWeek: Record<string, Record<string, Set<string>>> = {};
  const activeSkusByWeek: Record<string, Record<string, Set<string>>> = {};

  for (const item of storeItems) {
    const rc = item.retailerCode;
    if (!activeStoresByWeek[rc]) {
      activeStoresByWeek[rc] = {};
      activeSkusByWeek[rc] = {};
    }
    for (const [week, units] of Object.entries(item.weeks)) {
      if (units > 0) {
        if (!activeStoresByWeek[rc][week]) {
          activeStoresByWeek[rc][week] = new Set();
          activeSkusByWeek[rc][week] = new Set();
        }
        activeStoresByWeek[rc][week].add(item.store);
        activeSkusByWeek[rc][week].add(item.itemCode);
      }
    }
  }

  const weekKeys = Object.keys(weeklyTotals);

  return retailers
    .map((r) => {
      let totalStoreSkuWeeks = 0;
      const weeklyVelocities = weekKeys.map((wk) => {
        const stores = activeStoresByWeek[r.code]?.[wk]?.size ?? 0;
        const skuCount = activeSkusByWeek[r.code]?.[wk]?.size ?? 0;
        const units = r.weeks[wk] ?? 0;
        const denom = stores * skuCount;
        totalStoreSkuWeeks += denom;
        return {
          week: `WK ${wk.replace("w", "")}`,
          velocity: denom > 0 ? units / denom : 0,
          stores,
          skus: skuCount,
          units,
        };
      });

      const avgVelocity =
        totalStoreSkuWeeks > 0 ? r.total / totalStoreSkuWeeks : 0;

      const latestWk = weekKeys[weekKeys.length - 1];
      const latestStores = activeStoresByWeek[r.code]?.[latestWk]?.size ?? 0;
      const latestSkus = activeSkusByWeek[r.code]?.[latestWk]?.size ?? 0;
      const latestDenom = latestStores * latestSkus;
      const latestUnits = r.weeks[latestWk] ?? 0;
      const latestVelocity = latestDenom > 0 ? latestUnits / latestDenom : 0;

      const allStores = new Set<string>();
      for (const storeSet of Object.values(
        activeStoresByWeek[r.code] ?? {}
      )) {
        for (const s of storeSet) allStores.add(s);
      }

      return {
        code: r.code,
        name: r.name,
        avgVelocity,
        latestVelocity,
        latestStores,
        totalStores: allStores.size,
        weeklyVelocities,
      };
    })
    .filter((rv) => rv.totalStores > 0)
    .sort((a, b) => b.avgVelocity - a.avgVelocity);
}
