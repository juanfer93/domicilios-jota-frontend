import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000",
});

export interface AdminStatus {
  hasAdmin: boolean;
  adminName?: string | null
}

export interface CreateAdminPayload {
  nombre: string;
  email: string;
  password: string;
}

export interface DashboardSummary {
  totalPedidos: number;
  totalDomiciliarios: number;
}

export const getAdminStatus = async (): Promise<AdminStatus> => {
  const { data } = await api.get<AdminStatus>("/api/v1/users/admin-status");
  return data;
};

export const createAdmin = async (payload: CreateAdminPayload) => {
  const body = {
    ...payload,
    rol: "admin", 
  };

  const { data } = await api.post("/api/v1/users/admin", body);
  return data;
};

export const getDashboardSummary = async (): Promise<DashboardSummary> => {
  const { data } = await api.get<DashboardSummary>(
    "/api/v1/users/dashboard-summary"
  );
  return data;
}
