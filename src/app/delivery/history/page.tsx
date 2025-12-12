import { redirect } from "next/navigation";
import { fetchAdminStatus } from "@/lib/adminStatusServer";
import { DeliveryHistoryClient } from "./DeliveryHistoryClient";

export default async function DeliveryHistoryPage() {
  const { hasAdmin, adminName } = await fetchAdminStatus();
  if (!hasAdmin) redirect("/create-admin");
  return <DeliveryHistoryClient adminName={adminName ?? "Administrador"} />;
}