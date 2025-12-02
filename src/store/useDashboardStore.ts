import { create } from "zustand";
import {
  getDashboardSummary,
  DashboardSummary,
} from "@/lib/api";

interface DashboardState {
  summary: DashboardSummary | null;
  loading: boolean;
  error: string | null;
  fetchSummary: () => Promise<void>;
  reset: () => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  summary: null,
  loading: false,
  error: null,

  fetchSummary: async () => {
    try {
      set({ loading: true, error: null });
      const data = await getDashboardSummary();
      set({ summary: data, loading: false });
    } catch (err) {
      console.error("Error cargando resumen del dashboard", err);
      set({
        error: "No se pudo cargar el resumen. Intenta recargar más tarde.",
        loading: false,
      });
    }
  },

  reset: () => set({ summary: null, loading: false, error: null }),
}));
