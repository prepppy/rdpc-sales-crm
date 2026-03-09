export interface Retailer {
  code: string;
  name: string;
  weeks: WeekData;
  total: number;
}

export interface SKU {
  code: string;
  name: string;
  fullName: string;
  weeks: Record<string, number>;
  total: number;
}

export interface StoreItem {
  retailerCode: string;
  retailer: string;
  store: string;
  itemCode: string;
  item: string;
  weeks: WeekData;
  total: number;
}

export interface Customer {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  totalUnits: number;
}

export interface WeekData {
  [key: string]: number;
}

export interface Summary {
  totalUnits: number;
  totalRetailers: number;
  totalStores: number;
  totalSKUs: number;
  weeklyTotals: Record<string, number>;
}

export interface AppData {
  retailers: Retailer[];
  skus: SKU[];
  storeItems: StoreItem[];
  customers: Customer[];
  summary: Summary;
}

export const SKU_COLORS: Record<string, string> = {
  "Curd Your Enthusiasm": "#f4a81d",
  "Peppin' Ain't Easy": "#ef473d",
  "Okie Dokie Artichokie": "#b4bd35",
  "Lost in the Sausage": "#c14f9d",
  "The Wisco Kid": "#40c3d6",
};

export const SKU_COLOR_BY_CODE: Record<string, string> = {
  "47005": "#f4a81d",
  "47001": "#ef473d",
  "47004": "#b4bd35",
  "47002": "#c14f9d",
  "47000": "#40c3d6",
};

export function getSkuColor(name: string): string {
  for (const [key, color] of Object.entries(SKU_COLORS)) {
    if (name.includes(key)) return color;
  }
  return "#26225d";
}

export const WEEK_LABELS: Record<string, string> = {
  w5: "Wk 5",
  w6: "Wk 6",
  w7: "Wk 7",
  w8: "Wk 8",
  w9: "Wk 9",
  w10: "Wk 10",
};
