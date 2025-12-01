"use client";

import { create } from "zustand";
import { createAdmin as apiCreateAdmin, getAdminStatus } from "@/lib/api";

type AdminState = {
  hasAdmin: boolean | null;
  adminName: string | null;
  loading: boolean;
  error: string | null;
  checkStatus: () => Promise<void>;
  createAdmin: (payload: {
    nombre: string;
    email: string;
    password: string;
  }) => Promise<void>;
};

export const useAdminStore = create<AdminState>((set) => ({
  hasAdmin: null,
  adminName: null,
  loading: false,
  error: null,

  checkStatus: async () => {
    set({ loading: true, error: null });
    try {
      const data = await getAdminStatus();
      set({
        hasAdmin: data.hasAdmin,
        adminName: data.adminName ?? null,
      });
    } catch (err) {
      console.error("Error checking admin status", err);
      set({ error: "No se pudo consultar el estado del administrador." });
    } finally {
      set({ loading: false });
    }
  },

  createAdmin: async (payload) => {
    set({ loading: true, error: null });
    try {
      await apiCreateAdmin(payload);
      set({
        hasAdmin: true,
        adminName: payload.nombre,
      });
    } catch (err) {
      console.error("Error creating admin", err);
      set({
        error: "No se pudo crear el administrador. Intenta de nuevo.",
      });
    } finally {
      set({ loading: false });
    }
  },
}));