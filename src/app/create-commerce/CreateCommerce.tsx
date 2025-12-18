"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/store/UseAuthStore";
import { createComercios, type ComercioPayload } from "@/lib/api";
import { getApiErrorMessage } from "@/lib/apiUtils";

const createCommerceSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  direccion: z.string().min(1, "La dirección es obligatoria"),
});

type CreateCommerceFormValues = ComercioPayload;

export default function CreateCommerce() {
  const router = useRouter();
  const { token, isAuthenticated } = useAuthStore();
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateCommerceFormValues>({
    resolver: zodResolver(createCommerceSchema),
  });

  const onSubmit = async (values: CreateCommerceFormValues) => {
    try {
      if (!isAuthenticated() || !token) {
        setServerError("Sesión no válida. Inicia sesión nuevamente.");
        router.replace("/login");
        return;
      }

      setSubmitting(true);
      setServerError(null);

      await createComercios(values); 

      router.replace("/dashboard");
    } catch (error: unknown) {
      console.error(error);
      setServerError(
        getApiErrorMessage(
          error,
          "Ocurrió un error al crear el comercio."
        )
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF9E8] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#102F59]/90 rounded-3xl shadow-2xl px-6 py-6 sm:px-8 sm:py-8 text-[#F5E9C8]">
        <h1 className="text-xl sm:text-2xl font-semibold mb-2">
          Crear comercio
        </h1>
        <p className="text-xs sm:text-sm text-[#F5E9C8]/80 mb-4">
          Registra un nuevo comercio en el sistema.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs sm:text-sm mb-1">
              Nombre del comercio
            </label>
            <input
              type="text"
              {...register("nombre")}
              className="w-full rounded-2xl px-3 py-2 text-sm bg-[#FFF9E8] text-[#102F59] focus:outline-none focus:ring-2 focus:ring-[#F5E9C8]"
              placeholder="Ej: Hamburguesas Don Pepe"
            />
            {errors.nombre && (
              <p className="mt-1 text-[11px] text-red-200">
                {errors.nombre.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs sm:text-sm mb-1">
              Dirección
            </label>
            <input
              type="text"
              {...register("direccion")}
              className="w-full rounded-2xl px-3 py-2 text-sm bg-[#FFF9E8] text-[#102F59] focus:outline-none focus:ring-2 focus:ring-[#F5E9C8]"
              placeholder="Dirección del comercio"
            />
            {errors.direccion && (
              <p className="mt-1 text-[11px] text-red-200">
                {errors.direccion.message}
              </p>
            )}
          </div>

          {serverError && (
            <p className="text-[11px] sm:text-xs text-red-200 bg-red-900/40 border border-red-200/30 rounded-2xl px-3 py-2">
              {serverError}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-2 h-10 sm:h-11 bg-[#FFF9E8] rounded-3xl text-[10px] sm:text-xs font-medium text-[#102F59] shadow-md flex items-center justify-center hover:bg-[#f3ebd4] transition-colors disabled:opacity-70"
          >
            {submitting ? "Creando comercio..." : "Crear comercio"}
          </button>
        </form>
      </div>
    </div>
  );
}
