"use client";

import { create } from "zustand";
import { getComercios, deleteComercios, type ComercioItem } from "@/lib/api";
import { getApiErrorMessage } from "@/lib/apiUtils";

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
    } catch (error: unknown) {
      console.error(error);
      set({
        loadingList: false,
        errorList: getApiErrorMessage(
          error,
          "Ocurrió un error al cargar los comercios."
        ),
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
    } catch (error: unknown) {
      console.error(error);
      return false;
    }
  },
}));
