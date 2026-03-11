import data from "@/lib/data.json";
import { VelocityClient } from "@/components/VelocityClient";

export default function VelocityPage() {
  return <VelocityClient data={data} />;
}
