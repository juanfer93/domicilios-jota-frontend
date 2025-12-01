import { redirect } from "next/navigation";
import { fetchAdminStatus } from "@/lib/adminStatusServer";

export default async function Home() {
  const { hasAdmin } = await fetchAdminStatus();

  if (!hasAdmin) {
    redirect("/create-admin");
  }

  redirect("/welcome");
}

