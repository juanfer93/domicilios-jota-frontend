import { create } from "zustand";
import {
  createDomiciliario as createDomiciliarioRequest,
  setPasswordDomiciliario as setPasswordDomiciliarioRequest,
} from "./../lib/api";

interface DomiciliariosState {
  loadingCreate: boolean;
  mensajeCreate: string | null;
  errorCreate: string | null;
  clearCreateMessages: () => void;
  createDomiciliario: (payload: { nombre: string; email: string }) => Promise<boolean>;

  loadingPassword: boolean;
  mensajePassword: string | null;
  errorPassword: string | null;
  clearPasswordMessages: () => void;
  setPasswordForDomiciliario: (payload: { token: string; password: string }) => Promise<boolean>;
}

export const useDomiciliariosStore = create<DomiciliariosState>((set) => ({
  loadingCreate: false,
  mensajeCreate: null,
  errorCreate: null,

  clearCreateMessages: () => set({ mensajeCreate: null, errorCreate: null }),

  createDomiciliario: async ({ nombre, email }) => {
    set({ loadingCreate: true, mensajeCreate: null, errorCreate: null });

    try {
      await createDomiciliarioRequest({ nombre, email });

      set({
        mensajeCreate:
          "Domiciliario creado. Se ha enviado un correo de confirmación.",
      });

      return true;
    } catch (err: any) {
      const apiMessage =
        err?.response?.data?.message ??
        "Error al crear el domiciliario. Intenta de nuevo.";

      set({
        errorCreate: Array.isArray(apiMessage)
          ? apiMessage.join(", ")
          : apiMessage,
      });

      return false;
    } finally {
      set({ loadingCreate: false });
    }
  },

  loadingPassword: false,
  mensajePassword: null,
  errorPassword: null,

  clearPasswordMessages: () => set({ mensajePassword: null, errorPassword: null }),

  setPasswordForDomiciliario: async ({ token, password }) => {
    set({ loadingPassword: true, mensajePassword: null, errorPassword: null });

    try {
      await setPasswordDomiciliarioRequest({ token, password });

      set({
        mensajePassword:
          "Contraseña creada correctamente. Ya puedes iniciar sesión.",
      });

      return true;
    } catch (err: any) {
      const apiMessage =
        err?.response?.data?.message ??
        "No se pudo crear la contraseña. El enlace puede haber expirado.";

      set({
        errorPassword: Array.isArray(apiMessage)
          ? apiMessage.join(", ")
          : apiMessage,
      });

      return false;
    } finally {
      set({ loadingPassword: false });
    }
  },
}));
