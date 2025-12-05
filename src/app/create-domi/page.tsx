import { fetchAdminStatus } from "@/lib/adminStatusServer";
import { redirect } from "next/navigation";
import { CreateDeliveryPage } from "./CreateDelivery"

export default async function CreateDomiPage() {
    const { hasAdmin } = await fetchAdminStatus();

    if (!hasAdmin) {
        redirect("/create-admin");
    }

    return <CreateDeliveryPage />
}