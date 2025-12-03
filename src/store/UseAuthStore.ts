"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AuthUser = {
  id: string;
  nombre: string;
  email: string;
  rol: string;
};

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  expiresAt: number | null; 
  setAuth: (token: string, user: AuthUser, expiresAtFromServer?: number | null) => void;
  clearAuth: () => void;
  isAuthenticated: () => boolean;
}

function decodeJwtExp(token: string): number | null {
  try {
    const [, payloadBase64] = token.split(".");
    const payloadJson = typeof window !== "undefined"
      ? window.atob(payloadBase64)
      : Buffer.from(payloadBase64, "base64").toString("utf-8");

    const payload = JSON.parse(payloadJson) as { exp?: number };

    if (typeof payload.exp === "number") {
      return payload.exp * 1000;
    }

    return null;
  } catch (error) {
    console.error("Error decodificando JWT:", error);
    return null;
  }
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      expiresAt: null,

      setAuth: (token, user, expiresAtFromServer) => {
        const exp = expiresAtFromServer ?? decodeJwtExp(token);
        set({
          token,
          user,
          expiresAt: exp ?? null,
        });
      },

      clearAuth: () => {
        set({
          token: null,
          user: null,
          expiresAt: null,
        });
      },

      isAuthenticated: () => {
        const { token, expiresAt } = get();

        if (!token) return false;

        if (expiresAt && Date.now() >= expiresAt) {
          set({
            token: null,
            user: null,
            expiresAt: null,
          });
          return false;
        }

        return true;
      },
    }),
    {
      name: "auth-store", 
    }
  )
);

