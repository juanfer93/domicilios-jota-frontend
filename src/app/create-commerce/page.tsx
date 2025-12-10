import { fetchAdminStatus } from "@/lib/adminStatusServer";
import { redirect } from "next/navigation";
import CreateCommerce from "./CreateCommerce";

export default async function CreatePasswordPage() {
  const { hasAdmin } = await fetchAdminStatus();

  if (!hasAdmin) {
    redirect("/create-admin");
  }

  return <CreateCommerce />
}