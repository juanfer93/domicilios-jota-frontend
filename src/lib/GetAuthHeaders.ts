import { useAuthStore } from "@/store/UseAuthStore";

export const getAuthHeaders = () => {
  if (typeof window === "undefined") {
    // En el servidor (SSR) no hay localStorage ni Zustand
    return {};
  }

  const token = useAuthStore.getState().token;
  if (!token) return {};

  return {
    Authorization: `Bearer ${token}`,
  };
};