"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useDomiciliariosStore } from "@/store/useDomiciliariosStore";

const setPasswordSchema = z
  .object({
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
    confirmPassword: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

type SetPasswordFormValues = z.infer<typeof setPasswordSchema>;

export const CreatePasswordDomi = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const {
    loadingPassword,
    mensajePassword,
    errorPassword,
    clearPasswordMessages,
    setPasswordForDomiciliario,
  } = useDomiciliariosStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SetPasswordFormValues>({
    resolver: zodResolver(setPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    clearPasswordMessages();
  }, [clearPasswordMessages]);

  const onSubmit = async (values: SetPasswordFormValues) => {
    if (!token) return;

    clearPasswordMessages();

    const ok = await setPasswordForDomiciliario({
      token,
      password: values.password,
    });

    if (ok) {
      reset();
      router.push("/login");
    }
  };

  if (!token) {
    return (
      <main className="min-h-screen w-full  flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-xl shadow-lg border border-jjBeige p-6">
          <h1 className="text-xl font-semibold mb-2">
            Crear contraseña
          </h1>
          <p className="text-sm text-red-600">
            Token no válido. Abre el enlace directamente desde tu correo.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full bg-[#174A8B] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg border border-jjBeige p-6">
        <h1 className="text-xl font-semibold text-[#030303ff] mb-2">
          Crear contraseña
        </h1>
        <p className="text-sm text-gray-600 mb-6">
          Define tu nueva contraseña para poder iniciar sesión como domiciliario.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          {/* Password */}
          <div className="grid gap-1">
            <label className="text-sm font-medium text-[#030303ff]">
              Nueva contraseña
            </label>
            <input
              type="password"
              {...register("password")}
              className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-jjBlue"
            />
            {errors.password && (
              <span className="text-red-600 text-sm">
                {errors.password.message}
              </span>
            )}
          </div>

          {/* Confirm password */}
          <div className="grid gap-1">
            <label className="text-sm font-medium text-[#030303ff]">
              Confirmar contraseña
            </label>
            <input
              type="password"
              {...register("confirmPassword")}
              className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-jjBlue"
            />
            {errors.confirmPassword && (
              <span className="text-red-600 text-sm">
                {errors.confirmPassword.message}
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={loadingPassword}
            className={`mt-2 py-2 rounded-lg text-white font-medium transition-colors
              ${loadingPassword
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#174A8B] hover:bg-jjBlueDark cursor-pointer"
              }`}
          >
            {loadingPassword ? "Guardando..." : "Guardar contraseña"}
          </button>
        </form>

        {mensajePassword && (
          <p className="mt-4 text-green-600 text-sm">{mensajePassword}</p>
        )}
        {errorPassword && (
          <p className="mt-4 text-red-600 text-sm">{errorPassword}</p>
        )}
      </div>
    </main>
  );
};
