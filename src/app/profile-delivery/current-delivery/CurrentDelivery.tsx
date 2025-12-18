"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/UseAuthStore";
import { getCurrentDelivery, type CurrentDeliveryItem } from "@/lib/api";
import { getApiErrorMessage } from "@/lib/apiUtils";
import { NewPedidoNotification } from "../NewPedidoNotification";

export default function CurrentDeliveryClient() {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  const [loading, setLoading] = useState(true);
  const [pedido, setPedido] = useState<CurrentDeliveryItem | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isDomiciliario =
    !!user && user.rol && user.rol.toLowerCase() === "domiciliario";

  useEffect(() => {
    if (!token || !user) {
      router.replace("/login");
      return;
    }

    if (!isDomiciliario) {
      clearAuth();
      router.replace("/login");
      return;
    }

    const fetchCurrent = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getCurrentDelivery();
        setPedido(data);
      } catch (err: unknown) {
        setError(
          getApiErrorMessage(
            err,
            "No se pudo cargar el servicio en curso."
          )
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCurrent();
  }, [token, user, isDomiciliario, router, clearAuth]);

  if (!token || !user || !isDomiciliario) return null;

  const handleClose = () => {
    router.back();
  };


  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FFF9E8] text-[#030303ff]">
        <header className="bg-[#174A8B] pt-4 pb-3 px-4 flex justify-between items-center text-[#FFF9E8]">
          <span className="font-semibold text-sm">Detalles</span>
          <button onClick={handleClose} className="text-sm underline">
            Cerrar
          </button>
        </header>
        <main className="flex-1 flex items-center justify-center px-4">
          Cargando servicio en curso...
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FFF9E8] text-[#030303ff]">
        <header className="bg-[#174A8B] pt-4 pb-3 px-4 flex justify-between items-center text-[#FFF9E8]">
          <span className="font-semibold text-sm">Detalles</span>
          <button onClick={handleClose} className="text-sm underline">
            Cerrar
          </button>
        </header>
        <main className="flex-1 flex items-center justify-center px-4">
          <p>{error}</p>
        </main>
      </div>
    );
  }

  if (!pedido) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FFF9E8] text-[#030303ff]">
        <header className="bg-[#174A8B] pt-4 pb-3 px-4 flex justify-between items-center text-[#FFF9E8]">
          <span className="font-semibold text-sm">Detalles</span>
          <button onClick={handleClose} className="text-sm underline">
            Cerrar
          </button>
        </header>
        <main className="flex-1 flex items-center justify-center px-4 text-center">
          <p>No tienes ningún servicio en curso.</p>
        </main>
      </div>
    );
  }


  const comercioNombre = pedido.comercio?.nombre ?? "Comercio";
  const comercioDireccion =
    pedido.comercio?.direccion ?? "Dirección no disponible";

  const valorFinal = Number(pedido.valorFinal ?? 0);
  const valorDomicilio = Number(pedido.valorDomicilio ?? 0);

  const formatCOP = (n: number) =>
    n.toLocaleString("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    });

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF9E8] text-[#030303ff]">
      <header className="bg-[#174A8B] pt-4 pb-3 px-4 flex justify-between items-center text-[#FFF9E8]">
        <span className="font-semibold text-sm">Detalles</span>
        <button onClick={handleClose} className="text-sm underline">
          Cerrar
        </button>
      </header>

      <div className="h-40 bg-[#F5E9C8]" />

      <main className="-mt-8 px-4 pb-6 flex-1">
        <div className="bg-[#174A8B] rounded-3xl shadow-lg px-5 py-4 border border-[#F5E9C8] text-[#FFF9E8]">
          <div className="flex justify-center mb-4">
            <div className="bg-[#FFF9E8] px-4 py-2 rounded-full">
              <span className="text-[#174A8B] font-semibold text-sm">
                {comercioNombre}
              </span>
            </div>
          </div>

          <hr className="border-[#F5E9C8]/40 my-2" />

          <p className="text-sm font-semibold mt-2 mb-1">
            IR A RESTAURANTE
          </p>
          <p className="text-sm mb-3">{comercioDireccion}</p>

          <p className="text-sm font-semibold mb-1">Entrega A:</p>
          <p className="text-sm mb-3">{pedido.direccionDestino}</p>

          <hr className="border-[#F5E9C8]/40 my-2" />

          <div className="space-y-1 mt-3">
            <p className="text-sm">
              <span className="font-semibold">Valor compra: </span>
              {formatCOP(valorFinal)}
            </p>
            <p className="text-sm">
              <span className="font-semibold">Domicilio: </span>
              {formatCOP(valorDomicilio)}
            </p>
          </div>
        </div>
      </main>

      <NewPedidoNotification />
    </div>
  );
}
