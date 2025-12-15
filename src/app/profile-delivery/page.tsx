import { redirect } from "next/navigation";
import { fetchAdminStatus } from "@/lib/adminStatusServer";
import ProfileDeliveryClient from "./ProfileDeliveryClient";

export default async function ProfileDeliverypage() {
    const { hasAdmin } = await fetchAdminStatus();

    if (!hasAdmin) {
        redirect("/create-admin");
    }

    return <ProfileDeliveryClient />
}