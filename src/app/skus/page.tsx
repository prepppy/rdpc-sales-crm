import data from "@/lib/data.json";
import { SkusClient } from "@/components/SkusClient";

export default function SkusPage() {
  return <SkusClient data={data} />;
}
