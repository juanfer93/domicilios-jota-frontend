import { redirect } from "next/navigation";
import { fetchAdminStatus } from "@/lib/adminStatusServer";
import { WelcomeClient } from "./WelcomeClient";

export default async function WelcomePage() {
  const { hasAdmin, adminName } = await fetchAdminStatus();

  if (!hasAdmin) {
    redirect("/create-admin");
  }

  return <WelcomeClient adminName={adminName ?? "Administrador"} />;
}

