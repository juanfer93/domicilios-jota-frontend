import { redirect } from "next/navigation";
import { fetchAdminStatus } from "@/lib/adminStatusServer";
import { DeliveryClient } from "./DeliveryClient";

export default async function DeliveryPage() {
  const { hasAdmin, adminName } = await fetchAdminStatus();

  if (!hasAdmin) {
    redirect("/create-admin");
  }

  return <DeliveryClient adminName={adminName ?? "Administrador"} />;
}
