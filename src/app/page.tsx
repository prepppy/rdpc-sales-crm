import data from "@/lib/data.json";
import { DashboardClient } from "@/components/DashboardClient";

export default function Dashboard() {
  return <DashboardClient data={data} />;
}
