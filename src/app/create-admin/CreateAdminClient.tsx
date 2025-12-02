"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { createAdmin } from "@/lib/api";

const createAdminSchema = z
  .object({
    nombre: z
      .string()
      .min(1, "El nombre es requerido"),
    email: z
      .string()
      .min(1, "El email es requerido")
      .email("El email debe ser válido"),
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres."),
    confirmPassword: z
      .string()
      .min(1, "Confirma la contraseña"),
  })
  .refine(
    (data) => data.password === data.confirmPassword,
    {
      message: "Las contraseñas no coinciden.",
      path: ["confirmPassword"], 
    },
  );

type FormValues = z.infer<typeof createAdminSchema>;

export function CreateAdminClient() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(createAdminSchema),
  });

  const onSubmit = async (data: FormValues) => {
    setServerError(null);

    try {
      setSubmitting(true);
      await createAdmin({
        nombre: data.nombre,
        email: data.email,
        password: data.password,
      });

      router.replace("/dashboard");
    } catch (err) {
      console.error("Error creando admin", err);
      setServerError("No se pudo crear el administrador. Intenta de nuevo.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF9E8] text-[#F5E9C8]">
      <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-10 px-6 py-12 lg:px-12">
        <header className="flex items-center justify-between rounded-3xl border border-[#F5E9C8]/30 bg-[#102F59] p-6 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F5E9C8] text-2xl font-bold text-[#174A8B]">
              J
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-[#F5E9C8]/80">
                Jota Jota Delivery
              </p>
              <h1 className="text-2xl font-semibold leading-tight">
                Crear administrador inicial
              </h1>
              <p className="text-sm text-[#F5E9C8]/80">
                Esta acción solo está disponible mientras no exista un
                administrador.
              </p>
            </div>
          </div>
        </header>

        <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-[#F5E9C8]/40 bg-[#102F59] p-8 shadow-2xl">
            <form className="grid gap-5" onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-2">
                <label className="text-sm" htmlFor="nombre">
                  Nombre completo
                </label>
                <input
                  id="nombre"
                  {...register("nombre")}
                  className="rounded-xl border border-[#F5E9C8]/40 bg-[#FFF9E8] px-4 py-3 text-sm text-[#174A8B] placeholder:text-[#7a6a45] outline-none transition focus:border-[#174A8B] focus:ring-2 focus:ring-[#F5E9C8]/70"
                  placeholder="Ej. Ana Martínez"
                />
                {errors.nombre && (
                  <p className="text-xs text-red-200">
                    {errors.nombre.message}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <label className="text-sm" htmlFor="email">
                  Correo electrónico
                </label>
                <input
                  id="email"
                  type="email"
                  {...register("email")}
                  className="rounded-xl border border-[#F5E9C8]/40 bg-[#FFF9E8] px-4 py-3 text-sm text-[#174A8B] placeholder:text-[#7a6a45] outline-none transition focus:border-[#174A8B] focus:ring-2 focus:ring-[#F5E9C8]/70"
                  placeholder="admin@jotajota.com"
                />
                {errors.email && (
                  <p className="text-xs text-red-200">{errors.email.message}</p>
                )}
              </div>

              <div className="grid gap-2">
                <label className="text-sm" htmlFor="password">
                  Contraseña
                </label>
                <input
                  id="password"
                  type="password"
                  {...register("password")}
                  className="rounded-xl border border-[#F5E9C8]/40 bg-[#FFF9E8] px-4 py-3 text-sm text-[#174A8B] placeholder:text-[#7a6a45] outline-none transition focus:border-[#174A8B] focus:ring-2 focus:ring-[#F5E9C8]/70"
                  placeholder="Mínimo 8 caracteres"
                />
                {errors.password && (
                  <p className="text-xs text-red-200">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <label className="text-sm" htmlFor="confirmPassword">
                  Confirmar contraseña
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  {...register("confirmPassword")}
                  className="rounded-xl border border-[#F5E9C8]/40 bg-[#FFF9E8] px-4 py-3 text-sm text-[#174A8B] placeholder:text-[#7a6a45] outline-none transition focus:border-[#174A8B] focus:ring-2 focus:ring-[#F5E9C8]/70"
                  placeholder="Repite la contraseña"
                />
                {errors.confirmPassword && (
                  <p className="text-xs text-red-200">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {serverError && (
                <div className="flex items-center gap-2 rounded-xl border border-red-400/40 bg-red-500/30 px-3 py-2 text-sm text-red-50">
                  <span className="text-lg">⚠️</span>
                  <p>{serverError}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FFF9E8] px-5 py-3 text-sm font-semibold text-[#174A8B] transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#F5E9C8] focus:ring-offset-2 focus:ring-offset-[#174A8B] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting ? "Creando administrador..." : "Crear administrador"}
              </button>
            </form>
          </div>

          {/* Lateral */}
          <aside className="flex flex-col justify-between gap-6 rounded-3xl border border-[#F5E9C8]/40 bg-[#102F59] p-8 shadow-[0_25px_80px_-35px_rgba(0,0,0,0.75)]">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.25em] text-[#F5E9C8]/80">
                Seguridad
              </p>
              <h3 className="text-xl font-semibold">Una sola cuenta</h3>
              <p className="text-sm leading-relaxed text-[#F5E9C8]/90">
                El sistema solo admite un administrador. Una vez creado, el alta
                se bloquea y toda la gestión se realiza desde el panel.
              </p>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}
