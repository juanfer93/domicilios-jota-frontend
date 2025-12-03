"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { login } from "@/lib/api";
import { useAuthStore } from "@/store/UseAuthStore";
import Image from "next/image";
import favicon from "./../../../public/favicon.ico";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "El correo es requerido")
    .email("Ingresa un correo válido"),
  password: z.string().min(1, "La contraseña es requerida"),
});

type FormValues = z.infer<typeof loginSchema>;

export function LoginClient() {
  const router = useRouter();
  const { setAuth, isAuthenticated, clearAuth } = useAuthStore();
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: FormValues) => {
    setServerError(null);

    try {
      setSubmitting(true);

      const data = await login({
        email: values.email,
        password: values.password,
      });

      setAuth(data.accessToken, {
        id: data.usuario.id,
        nombre: data.usuario.nombre,
        email: data.usuario.email,
        rol: data.usuario.rol,
      });

      router.replace("/dashboard");
    } catch (err: any) {
      console.error("Error en login:", err);
      clearAuth();

      const message =
        err?.response?.data?.message ??
        "No se pudo iniciar sesión. Verifica tus credenciales.";
      setServerError(Array.isArray(message) ? message[0] : String(message));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF9E8] text-[#102F59] flex flex-col">
      <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-10 px-6 py-12 lg:px-12">
        <header className="flex items-center justify-between rounded-3xl border border-[#F5E9C8]/30 bg-[#102F59] p-6 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F5E9C8] overflow-hidden">
              <Image
                src={favicon}
                alt="Logo"
                width={48}
                height={48}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-[#F5E9C8]/80">
                Jota Jota Delivery
              </p>
              <h1 className="text-2xl font-semibold leading-tight text-[#F5E9C8]">
                Iniciar sesión como administrador
              </h1>
              <p className="text-sm text-[#F5E9C8]/80">
                Ingresa con el correo y contraseña del administrador para
                acceder al panel.
              </p>
            </div>
          </div>
        </header>

        <section className="rounded-3xl border border-[#102F59]/10 bg-white/80 p-6 shadow-md backdrop-blur-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Correo</label>
              <input
                type="email"
                className="w-full rounded-xl border border-[#E0D2B5] px-3 py-2 text-sm outline-none focus:border-[#174A8B] focus:ring-2 focus:ring-[#174A8B]/30 bg-white"
                placeholder="admin@tudominio.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Contraseña</label>
              <input
                type="password"
                className="w-full rounded-xl border border-[#E0D2B5] px-3 py-2 text-sm outline-none focus:border-[#174A8B] focus:ring-2 focus:ring-[#174A8B]/30 bg-white"
                placeholder="••••••••"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-xs text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            {serverError && (
              <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
                {serverError}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center rounded-2xl bg-[#174A8B] px-4 py-2.5 text-sm font-medium text-[#F5E9C8] shadow-md hover:bg-[#102F59] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Iniciando sesión..." : "Ingresar"}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
