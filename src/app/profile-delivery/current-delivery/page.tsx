import { redirect } from "next/navigation";
import { fetchAdminStatus } from "@/lib/adminStatusServer";
import CurrentDeliveryClient from "./CurrentDelivery";

export default async function CurrentDeliveryPage() {
    const { hasAdmin } = await fetchAdminStatus();

    if (!hasAdmin) {
        redirect("/create-admin");
    }

    return <CurrentDeliveryClient />
}