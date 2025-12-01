import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000",
});

export interface AdminStatus {
  hasAdmin: boolean;
}

export interface CreateAdminPayload {
  name: string;
  email: string;
  password: string;
}

export const getAdminStatus = async (): Promise<AdminStatus> => {
  const { data } = await api.get<AdminStatus>("/users/admin-status");
  return data;
};

export const createAdmin = async (payload: CreateAdminPayload) => {
  const { data } = await api.post("/users/admin", payload);
  return data;
};
