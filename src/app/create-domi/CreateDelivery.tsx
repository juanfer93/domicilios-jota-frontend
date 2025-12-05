"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDomiciliariosStore } from "@/store/useDomiciliariosStore";

const createDomiciliarioSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  email: z.string().email("Correo electrónico inválido"),
});

type CreateDomiciliarioFormValues = z.infer<typeof createDomiciliarioSchema>;

export const CreateDeliveryPage = () => {
  const {
    loadingCreate,
    mensajeCreate,
    errorCreate,
    clearCreateMessages,
    createDomiciliario,
  } = useDomiciliariosStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateDomiciliarioFormValues>({
    resolver: zodResolver(createDomiciliarioSchema),
    defaultValues: { nombre: "", email: "" },
  });

  const onSubmit = async (values: CreateDomiciliarioFormValues) => {
    clearCreateMessages();
    const ok = await createDomiciliario(values);
    if (ok) reset();
  };

  return (
    <main className="min-h-screen w-full bg-[#174A8B] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-6">
        <h1 className="text-xl font-semibold text-[#174A8B] mb-2">Crear domiciliario</h1>

        <p className="text-sm text-gray-600 mb-6 text-[#030303ff]">
          Registra un domiciliario. Le enviaremos un correo para que cree su contraseña.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <div className="grid gap-1">
            <label className="text-sm font-medium text-jjBlueDark">Nombre</label>
            <input
              type="text"
              {...register("nombre")}
              className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-[#174A8B]"
            />
            {errors.nombre && (
              <span className="text-red-600 text-sm">{errors.nombre.message}</span>
            )}
          </div>

          <div className="grid gap-1">
            <label className="text-sm font-medium text-jjBlueDark">Correo electrónico</label>
            <input
              type="email"
              {...register("email")}
              className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-jjBlue"
            />
            {errors.email && (
              <span className="text-red-600 text-sm">{errors.email.message}</span>
            )}
          </div>

          <button
            type="submit"
            disabled={loadingCreate}
            className={`mt-2 py-2 rounded-lg text-white font-medium transition-colors
            ${loadingCreate 
              ? "bg-gray-400 cursor-not-allowed" 
              : "bg-[#174A8B] hover:bg-[#030303ff] cursor-pointer"}`}
          >
            {loadingCreate ? "Creando..." : "Crear domiciliario"}
          </button>
        </form>

        {/* MENSAJES */}
        {mensajeCreate && (
          <p className="mt-4 text-green-600 text-sm">{mensajeCreate}</p>
        )}
        {errorCreate && (
          <p className="mt-4 text-red-600 text-sm">{errorCreate}</p>
        )}
      </div>
    </main>
  );
};
