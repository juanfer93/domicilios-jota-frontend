import { fetchAdminStatus } from "@/lib/adminStatusServer";
import { redirect } from "next/navigation";
import { CreatePasswordDomi } from "./CreatePassword";

export default async function CreatePasswordDomiPage() {

    const { hasAdmin } = await fetchAdminStatus();

    if (!hasAdmin) {
        redirect("/create-admin");
    }

    return <CreatePasswordDomi />

}