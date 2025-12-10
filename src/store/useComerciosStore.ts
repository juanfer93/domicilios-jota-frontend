"use client";

import { create } from "zustand";
import { getComercios, deleteComercios, type ComercioItem } from "@/lib/api";

type ComerciosState = {
  list: ComercioItem[];
  loadingList: boolean;
  errorList: string | null;
  fetchComercios: () => Promise<void>;
  deleteComercio: (id: string) => Promise<boolean>;
};

export const useComerciosStore = create<ComerciosState>((set) => ({
  list: [],
  loadingList: false,
  errorList: null,

  fetchComercios: async () => {
    try {
      set({ loadingList: true, errorList: null });
      const comercios = await getComercios();
      set({ list: comercios, loadingList: false });
    } catch (error: any) {
      console.error(error);
      set({
        loadingList: false,
        errorList:
          error?.response?.data?.message ??
          "Ocurrió un error al cargar los comercios.",
      });
    }
  },

  deleteComercio: async (id: string) => {
    try {
      await deleteComercios(id);
      set((state) => ({
        list: state.list.filter((c) => c.id !== id),
      }));
      return true;
    } catch (error: any) {
      console.error(error);
      return false;
    }
  },
}));
