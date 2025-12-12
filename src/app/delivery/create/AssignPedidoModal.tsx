"use client";

import { useMemo } from "react";
import { useDeliveryStore } from "@/store/useDeliveryStore";

export function AssignPedidoModal() {
  const {
    modalOpen,
    setModalOpen,
    resetCreate,

    domiciliarios,
    comercios,
    selectedDomiciliarioId,
    selectedComercioId,

    valorFinal,
    valorDomicilio,
    setValorFinal,
    setValorDomicilio,

    statusCreate,
    assignPedido,
  } = useDeliveryStore();

  const selectedDomiciliario = useMemo(
    () => domiciliarios.find((d) => d.id === selectedDomiciliarioId) ?? null,
    [domiciliarios, selectedDomiciliarioId]
  );

  const selectedComercio = useMemo(
    () => comercios.find((c) => c.id === selectedComercioId) ?? null,
    [comercios, selectedComercioId]
  );

  if (!modalOpen || !selectedDomiciliario || !selectedComercio) return null;

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      onClick={() => setModalOpen(false)}
    >
      <div
        className="w-full max-w-lg rounded-2xl border border-black/10 bg-white p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-extrabold text-[#030303ff]">
          Confirmar asignación
        </h3>

        <div className="mt-4 space-y-3">
          <div className="rounded-2xl border border-black/10 bg-[#FFF9E8] p-4">
            <div className="text-sm font-extrabold text-[#030303ff]">Comercio</div>
            <div className="font-bold text-[#174A8B]">{selectedComercio.nombre}</div>
            <div className="text-sm text-[#030303ff]/70">{selectedComercio.direccion}</div>
          </div>

          <div className="rounded-2xl border border-black/10 bg-[#FFF9E8] p-4">
            <div className="text-sm font-extrabold text-[#030303ff]">Domiciliario</div>
            <div className="font-bold text-[#174A8B]">{selectedDomiciliario.nombre}</div>
            <div className="text-sm text-[#030303ff]/70">{selectedDomiciliario.email}</div>
          </div>

          <div className="grid gap-3">
            <label className="grid gap-2">
              <span className="text-sm font-extrabold text-[#030303ff]">
                Valor del pedido
              </span>
              <input
                type="number"
                value={valorFinal}
                onChange={(e) => setValorFinal(e.target.value)}
                placeholder="Ej: 25000"
                className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-[#030303ff] focus:outline-none focus:ring-2 focus:ring-[#174A8B]/30"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-extrabold text-[#030303ff]">
                Valor domicilio (opcional)
              </span>
              <input
                type="number"
                value={valorDomicilio}
                onChange={(e) => setValorDomicilio(e.target.value)}
                placeholder="Ej: 5000"
                className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-[#030303ff] focus:outline-none focus:ring-2 focus:ring-[#174A8B]/30"
              />
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={resetCreate}
              disabled={statusCreate === "loading"}
              className="rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-[#030303ff] hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancelar
            </button>

            <button
              onClick={assignPedido}
              disabled={statusCreate === "loading"}
              className="rounded-xl bg-[#174A8B] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {statusCreate === "loading" ? "Asignando..." : "Asignar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
