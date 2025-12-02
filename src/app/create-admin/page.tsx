import { redirect } from "next/navigation";
import { fetchAdminStatus } from "@/lib/adminStatusServer";
import { CreateAdminClient } from "./CreateAdminClient";

export default async function CreateAdminPage() {
  const { hasAdmin } = await fetchAdminStatus();

  if (hasAdmin) {
    redirect("/dashboard");
  }

  return <CreateAdminClient />;
}
