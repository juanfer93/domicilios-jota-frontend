import { redirect } from "next/navigation";
import { fetchAdminStatus } from "@/lib/adminStatusServer";
import { DeliveryCreateClient } from "./DeliveryCreateClient";

export default async function DeliveryCreatePage() {
  const { hasAdmin, adminName } = await fetchAdminStatus();
  if (!hasAdmin) redirect("/create-admin");
  return <DeliveryCreateClient adminName={adminName ?? "Administrador"} />;
}
