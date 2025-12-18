
import { extractPayload } from "./apiUtils";

export interface AdminStatus {
  hasAdmin: boolean;
  adminName?: string | null;
}

export async function fetchAdminStatus(): Promise<AdminStatus> {
  const backendURL = process.env.BACKEND_URL ?? "http://localhost:3000";

  const res = await fetch(`${backendURL}/api/v1/users/admin-status`, {
    cache: "no-store",
  });

  if (!res.ok) {
    console.error("❌ Backend respondió status no OK:", res.status);
    throw new Error("No se pudo consultar el estado del administrador");
  }

  const raw = await res.json();

  const payload = extractPayload<AdminStatus>(raw);

  const hasAdmin = Boolean(payload?.hasAdmin);
  const adminName =
    typeof payload?.adminName === "string" ? payload.adminName : null;

  // Log para depurar en consola del servidor (opcional)
  console.log("🧩 fetchAdminStatus payload crudo:", raw);
  console.log("🧩 fetchAdminStatus interpretado:", { hasAdmin, adminName });

  return { hasAdmin, adminName };
}

