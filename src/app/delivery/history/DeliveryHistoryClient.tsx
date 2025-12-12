"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useDeliveryStore } from "@/store/useDeliveryStore";
import { useAuthStore } from "@/store/UseAuthStore";

export function DeliveryHistoryClient({ adminName }: { adminName: string }) {
  const router = useRouter();
  const { token } = useAuthStore();

  const {
    pedidosHistorial,
    historyDate,
    setHistoryDate,
    statusHistory,
    error,
    clearError,
    loadPedidosHistorial,
		setTab
  } = useDeliveryStore();

  useEffect(() => {
		setTab("history");
    loadPedidosHistorial();
  }, [token]);

  const countByEstado = useMemo(() => {
    const c = { "En proceso": 0, "Hecho": 0, "Cancelado": 0 };
    for (const p of pedidosHistorial) c[p.estado as keyof typeof c] += 1;
    return c;
  }, [pedidosHistorial]);

  return (
    <div className="min-h-screen bg-[#FFF9E8]">
      <div className="mx-auto w-full max-w-6xl px-4 py-6">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="mr-auto text-2xl font-extrabold text-[#030303ff]">
            Historial · <span className="text-[#174A8B]">{adminName}</span>
          </h1>

          <button
            onClick={() => router.push("/delivery")}
            className="rounded-xl border border-[#174A8B] bg-white px-4 py-2 text-sm font-semibold text-[#174A8B] hover:bg-[#F5E9C8]"
          >
            Volver
          </button>

          <button
            onClick={() => router.push("/dashboard")}
            className="rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-[#030303ff] hover:bg-black/5"
          >
            Cerrar
          </button>
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-white p-3 text-sm text-[#030303ff]">
            <div className="flex items-center gap-3">
              <div className="font-semibold text-red-600">Error</div>
              <div className="flex-1">{error}</div>
              <button
                onClick={clearError}
                className="rounded-lg bg-[#F5E9C8] px-3 py-1 text-xs font-semibold text-[#030303ff] hover:opacity-95"
              >
                OK
              </button>
            </div>
          </div>
        )}

        <div className="mt-5 rounded-2xl border border-black/10 bg-white p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="text-sm font-extrabold text-[#030303ff]">Fecha</div>

            <input
              type="date"
              value={historyDate}
              onChange={(e) => setHistoryDate(e.target.value)}
              className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-[#030303ff] focus:outline-none focus:ring-2 focus:ring-[#174A8B]/30"
            />

            <button
              onClick={() => loadPedidosHistorial(historyDate)}
              className="rounded-xl bg-[#174A8B] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-95"
            >
              Buscar
            </button>

            <div className="ml-auto flex flex-wrap gap-2">
              <span className="rounded-full bg-[#F5E9C8] px-3 py-1 text-xs font-bold text-[#030303ff]">
                En proceso: {countByEstado["En proceso"]}
              </span>
              <span className="rounded-full bg-[#F5E9C8] px-3 py-1 text-xs font-bold text-[#030303ff]">
                Hecho: {countByEstado["Hecho"]}
              </span>
              <span className="rounded-full bg-[#F5E9C8] px-3 py-1 text-xs font-bold text-[#030303ff]">
                Cancelado: {countByEstado["Cancelado"]}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-5">
          {statusHistory === "loading" ? (
            <div className="rounded-2xl border border-black/10 bg-white p-6 text-[#030303ff]">
              Cargando...
            </div>
          ) : pedidosHistorial.length === 0 ? (
            <div className="rounded-2xl border border-black/10 bg-white p-6 text-[#030303ff]">
              No hay pedidos en esta fecha.
            </div>
          ) : (
            <div className="space-y-3">
              {pedidosHistorial.map((p) => (
                <div key={p.id} className="rounded-2xl border border-black/10 bg-white p-4">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-[#030303ff]">
                    <span className="font-extrabold text-[#174A8B]">
                      {p.comercio?.nombre ?? p.comercio_id}
                    </span>
                    <span className="opacity-60">·</span>
                    <span>
                      Domiciliario:{" "}
                      <span className="font-extrabold">
                        {p.usuario?.nombre ?? p.usuario_id}
                      </span>
                    </span>
                    <span className="opacity-60">·</span>
                    <span>
                      Valor:{" "}
                      <span className="font-extrabold">
                        {Number(p.valor_final ?? 0).toLocaleString()}
                      </span>
                    </span>
                    <span className="opacity-60">·</span>
                    <span>
                      Estado: <span className="font-extrabold">{p.estado}</span>
                    </span>
                  </div>

                  {p.comercio?.direccion && (
                    <div className="mt-2 text-sm text-[#030303ff]/80">
                      Dirección: {p.comercio.direccion}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
