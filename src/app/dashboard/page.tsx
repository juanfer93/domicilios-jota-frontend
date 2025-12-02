import { redirect } from "next/navigation";
import { fetchAdminStatus } from "@/lib/adminStatusServer";
import { DashboardClient } from "./DashboardClient";

export default async function WelcomePage() {
  const { hasAdmin, adminName } = await fetchAdminStatus();

  if (!hasAdmin) {
    redirect("/create-admin");
  }

  return <DashboardClient adminName={adminName ?? "Administrador"} />;
}

