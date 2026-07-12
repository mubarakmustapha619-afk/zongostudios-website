import { getSiteData } from "@/lib/blob-store";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const data = await getSiteData();
  return <AdminDashboard initialData={data} />;
}
