import { getAuthHeaders } from "./GetAuthHeaders";
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

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  usuario: {
    id: string;
    nombre: string;
    email: string;
    rol: string;
  };
}

export interface CreateDomiciliarioPayload {
  nombre: string;
  email: string;
}

export interface CreateDomiciliarioResponse {
  id: string;
  nombre: string;
  email: string;
  rol: string;
}

export interface SetPasswordDomiciliarioPayload {
  token: string;
  password: string;
}

export interface SetPasswordDomiciliarioResponse {
  message: string;
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

export const login = async (payload: LoginPayload) => {
  const { data } = await api.post("/api/v1/auth/login", payload);

  const payloadData = (data as any)?.data ?? data;

  return payloadData as LoginResponse
}

export const getDashboardSummary = async (): Promise<DashboardSummary> => {
  const { data } = await api.get<DashboardSummary>(
    "/api/v1/users/dashboard-summary"
  );
  return data;
}

export const createDomiciliario = async (
  payload: CreateDomiciliarioPayload
): Promise<CreateDomiciliarioResponse> => {
  const { data } = await api.post(
    "/api/v1/usuarios/domiciliarios",
    payload,
    {
      headers: {
        ...getAuthHeaders(),
      },
    }
  );

  const payloadData = (data as any)?.data ?? data;

  return payloadData as CreateDomiciliarioResponse;
};

export const setPasswordDomiciliario = async (
  payload: SetPasswordDomiciliarioPayload
): Promise<SetPasswordDomiciliarioResponse> => {
  const { data } = await api.post(
    "/api/v1/auth/domiciliarios/set-password",
    payload
  );

  const payloadData = (data as any)?.data ?? data;

  return payloadData as SetPasswordDomiciliarioResponse;
};
