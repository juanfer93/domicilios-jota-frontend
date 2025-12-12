"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDeliveryStore } from "@/store/useDeliveryStore";
import { useAuthStore } from "@/store/UseAuthStore";
import { AssignPedidoModal } from "./AssignPedidoModal";

export function DeliveryCreateClient({ adminName }: { adminName: string }) {
  const router = useRouter();
  const { token } = useAuthStore();

  const {
    domiciliarios,
    comercios,
    statusRefs,
    error,
    clearError,

    selectedDomiciliarioId,
    selectedComercioId,

    loadRefs,
    selectDomiciliario,
    selectComercio,
    resetCreate,
  } = useDeliveryStore();

  useEffect(() => {
    loadRefs();
  }, [token]);

  const lockedDomiciliarios = selectedDomiciliarioId !== null;
  const lockedComercios = selectedComercioId !== null;

  return (
    <div className="min-h-screen bg-[#FFF9E8]">
      <div className="mx-auto w-full max-w-6xl px-4 py-6">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="mr-auto text-2xl font-extrabold text-[#030303ff]">
            Crear pedido · <span className="text-[#174A8B]">{adminName}</span>
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
          <p className="text-sm text-[#030303ff]/80">
            Selecciona <span className="font-extrabold text-[#174A8B]">1 domiciliario</span> y{" "}
            <span className="font-extrabold text-[#174A8B]">1 comercio</span>. Al elegir ambos se abre el modal.
          </p>
        </div>

        {statusRefs === "loading" ? (
          <div className="mt-5 rounded-2xl border border-black/10 bg-white p-6 text-[#030303ff]">
            Cargando...
          </div>
        ) : (
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {/* Domiciliarios */}
            <div className="rounded-2xl border border-black/10 bg-white p-4">
              <h2 className="mb-3 text-base font-extrabold text-[#030303ff]">Domiciliarios</h2>

              <div className="space-y-3">
                {domiciliarios.map((d) => {
                  const checked = selectedDomiciliarioId === d.id;
                  const disabled = lockedDomiciliarios && !checked;

                  return (
                    <label
                      key={d.id}
                      className={[
                        "flex items-start gap-3 rounded-2xl border p-3 transition",
                        disabled
                          ? "cursor-not-allowed border-black/10 bg-black/[0.02] opacity-60"
                          : "cursor-pointer border-black/10 bg-[#FFF9E8] hover:opacity-95",
                      ].join(" ")}
                    >
                      <input
                        type="checkbox"
                        className="mt-1 h-4 w-4 accent-[#174A8B]"
                        checked={checked}
                        disabled={disabled}
                        onChange={() => selectDomiciliario(checked ? null : d.id)}
                      />
                      <div className="flex flex-col">
                        <span className="font-extrabold text-[#030303ff]">{d.nombre}</span>
                        <span className="text-sm text-[#030303ff]/70">{d.email}</span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Comercios */}
            <div className="rounded-2xl border border-black/10 bg-white p-4">
              <h2 className="mb-3 text-base font-extrabold text-[#030303ff]">Comercios</h2>

              <div className="space-y-3">
                {comercios.map((c) => {
                  const checked = selectedComercioId === c.id;
                  const disabled = lockedComercios && !checked;

                  return (
                    <label
                      key={c.id}
                      className={[
                        "flex items-start gap-3 rounded-2xl border p-3 transition",
                        disabled
                          ? "cursor-not-allowed border-black/10 bg-black/[0.02] opacity-60"
                          : "cursor-pointer border-black/10 bg-[#FFF9E8] hover:opacity-95",
                      ].join(" ")}
                    >
                      <input
                        type="checkbox"
                        className="mt-1 h-4 w-4 accent-[#174A8B]"
                        checked={checked}
                        disabled={disabled}
                        onChange={() => selectComercio(checked ? null : c.id)}
                      />
                      <div className="flex flex-col">
                        <span className="font-extrabold text-[#030303ff]">{c.nombre}</span>
                        <span className="text-sm text-[#030303ff]/70">{c.direccion}</span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <div className="mt-4">
          <button
            onClick={resetCreate}
            disabled={!selectedDomiciliarioId && !selectedComercioId}
            className="
                rounded-xl 
                border border-black/10 
                bg-white 
                px-4 
                py-2 
                text-sm 
                font-semibold 
                text-[#030303ff] 
                hover:bg-black/5 
                disabled:cursor-not-allowed 
                disabled:opacity-60"
          >
            Limpiar selección
          </button>
        </div>
      </div>

      <AssignPedidoModal />
    </div>
  );
}
