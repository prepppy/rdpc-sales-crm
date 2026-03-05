import data from "@/lib/data.json";
import { RetailersClient } from "@/components/RetailersClient";

export default function RetailersPage() {
  return <RetailersClient data={data} />;
}
