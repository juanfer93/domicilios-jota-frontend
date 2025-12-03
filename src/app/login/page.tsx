import { redirect } from "next/navigation";
import { fetchAdminStatus } from "@/lib/adminStatusServer";
import { LoginClient } from "./LoginClient";

export default async function LoginPage() {
  const { hasAdmin } = await fetchAdminStatus();

  if (!hasAdmin) {
    redirect("/create-admin");
  }

  return <LoginClient />;
}
