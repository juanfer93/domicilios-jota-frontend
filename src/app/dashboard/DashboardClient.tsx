"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDashboardStore } from "@/store/useDashboardStore";
import { useAuthStore } from "@/store/UseAuthStore";
import { useDomiciliariosStore } from "@/store/useDomiciliariosStore";
import type { DomiciliarioItem } from "@/lib/api";

type Props = {
  adminName: string;
};

export function DashboardClient({ adminName }: Props) {
  const router = useRouter()

  const { isAuthenticated, clearAuth } = useAuthStore()
  const {
    list: domiciliarios,
    loadingList,
    errorList,
    fetchDomiciliarios,
    deleteDomiciliario,
  } = useDomiciliariosStore();
  const { summary, loading, error, fetchSummary, reset } = useDashboardStore();
  const [closeSession, setCloseSession] = useState(false)
  const [createDomi, setCreateDomi] = useState(false)
  const [showDomisModal, setShowDomisModal] = useState(false);
  const [domiToDelete, setDomiToDelete] = useState<DomiciliarioItem | null>(null);

  const totalPedidos = summary?.totalPedidos ?? 0;
  const totalDomiciliarios = summary?.totalDomiciliarios ?? 0;
  const totalComercios = summary?.totalComercios ?? 0

  const handleLogout = () => {
    setCloseSession(true)
    clearAuth();
    reset();
    router.replace("/login");
  }

  const handleCreateDomi = () => {
    setCreateDomi(true)
    router.replace("/create-domi");
  }

  useEffect(() => {
    if (!isAuthenticated()) {
      clearAuth();
      reset();
      router.replace("/login");
    }
  }, [isAuthenticated, clearAuth, router]);

  useEffect(() => {
    if (!summary && isAuthenticated()) {
      fetchSummary();
    }
  }, [summary, fetchSummary, isAuthenticated]);

  useEffect(() => {
    if (!showDomisModal) return;

    fetchDomiciliarios();
  }, [showDomisModal, fetchDomiciliarios]);



  return (
    <div className="relative min-h-screen bg-[#FFF9E8] text-[#102F59] flex flex-col">
      <div className="pointer-events-none select-none absolute inset-0 flex items-center justify-center">
        <p className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-widest text-[#102F59]/30 text-center leading-tight">
          Leyendas del norte
          <br />
          fantasmas del sur
        </p>
      </div>

      <div className="relative z-10 flex-1 flex flex-col px-4 py-6 max-w-xl w-full mx-auto gap-6">
        <header className="flex flex-col gap-3">
          <div className="flex items-center justify-between bg-[#102F59]/10 border border-[#102F59]/20 rounded-2xl px-3 py-2">
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-[#174A8B]/70">
              Panel del administrador
            </span>

            <button
              onClick={handleLogout}
              className="px-4 py-1.5 rounded-full bg-[#102F59] text-[#F5E9C8] text-[10px] sm:text-xs font-medium shadow-md hover:bg-[#174A8B] transition-all"
            >
              {closeSession ? "Cerrando sesión..." : "Cerrar sesión"}
            </button>
          </div>

          <div className="flex flex-col gap-1">
            <h1 className="text-2xl sm:text-3xl font-semibold">
              Bienvenido, {adminName} 👋
            </h1>

            <p className="text-xs sm:text-sm text-[#174A8B]/80">
              Aquí verás un resumen rápido de tus domiciliarios y pedidos.
            </p>
          </div>
        </header>


        <section className="flex flex-col gap-3 sm:gap-4 items-start">
          <div
            className="
              w-full md:w-1/2
              rounded-3xl 
              border border-[#F5E9C8]/40 
              bg-[#102F59]/90 
              px-4 py-4 
              sm:px-5 sm:py-5 
              shadow-2xl 
              flex flex-col justify-between
            "
          >
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.18em] text-[#F5E9C8]/70">
              Comercios
            </span>

            {loading ? (
              <p className="mt-2 text-lg sm:text-2xl font-bold opacity-70">...</p>
            ) : (
              <p className="mt-2 text-2xl sm:text-3xl font-bold text-[#F5E9C8]">
                {totalComercios}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={() => setShowDomisModal(true)}
            className="
              w-full md:w-1/2
              rounded-3xl 
              border border-[#F5E9C8]/40 
              bg-[#102F59]/90 
              px-4 py-4 
              sm:px-5 sm:py-5 
              shadow-2xl 
              flex flex-col justify-between
              text-left
            "
          >
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.18em] text-[#F5E9C8]/70">
              Domiciliarios
            </span>
            {loading ? (
              <p className="mt-2 text-lg sm:text-2xl font-bold opacity-70">
                ...
              </p>
            ) : (
              <p className="mt-2 text-2xl sm:text-3xl font-bold text-[#F5E9C8]">
                {totalDomiciliarios}
              </p>
            )}
          </button>


          <button
            onClick={handleCreateDomi}
            className="
              w-full md:w-1/2
              h-10 sm:h-11
              bg-[#FFF9E8] 
              rounded-3xl 
              text-[10px] sm:text-xs 
              font-medium 
              shadow-md 
              flex items-center justify-center 
              hover:bg-[#f3ebd4] 
              transition-colors
            "
          >
            {createDomi ? "Cargando..." : "Crear Domiciliario"}
          </button>

          <div
            className="
              w-full md:w-1/2
              rounded-3xl 
              border border-[#F5E9C8]/40 
              bg-[#102F59]/90 
              px-4 py-4 
              sm:px-5 sm:py-5 
              shadow-2xl 
              flex flex-col justify-between
            "
          >
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.18em] text-[#F5E9C8]/70">
              Pedidos
            </span>

            {loading ? (
              <p className="mt-2 text-lg sm:text-2xl font-bold opacity-70">...</p>
            ) : (
              <p className="mt-2 text-2xl sm:text-3xl font-bold text-[#F5E9C8]">
                {totalPedidos}
              </p>
            )}
          </div>
        </section>

        {error && (
          <p className="text-xs sm:text-sm text-red-200 bg-red-900/40 border border-red-200/30 rounded-2xl px-3 py-2">
            {error}
          </p>
        )}

        <p className="mt-auto text-[11px] sm:text-xs text-[#F5E9C8]/70">
          Más adelante aquí mismo podrás crear y gestionar manualmente tus
          domiciliarios y pedidos.
        </p>
      </div>

      {showDomisModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
          <div className="bg-[#FFF9E8] rounded-3xl shadow-2xl w-full max-w-md mx-4 p-4 sm:p-6 relative">
            <button
              type="button"
              onClick={() => setShowDomisModal(false)}
              className="absolute right-3 top-3 text-xs text-[#102F59]/70 hover:text-[#102F59]"
            >
              ✕
            </button>

            <h2 className="text-lg sm:text-xl font-semibold text-[#102F59]">
              Domiciliarios
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-[#174A8B]/80">
              Lista de domiciliarios registrados.
            </p>

            <div className="mt-4 space-y-3 max-h-72 overflow-y-auto">
              {loadingList && (
                <p className="text-xs text-[#174A8B]/80">Cargando...</p>
              )}

              {!loadingList && domiciliarios.length === 0 && (
                <p className="text-xs text-[#174A8B]/80">
                  No hay domiciliarios registrados.
                </p>
              )}

              {!loadingList && domiciliarios.length > 0 &&
                domiciliarios.map((domi) => (
                  <div
                    key={domi.id}
                    className="flex items-center justify-between bg-[#102F59] text-[#F5E9C8] rounded-2xl px-3 py-2"
                  >
                    <div>
                      <p className="text-sm font-semibold">{domi.nombre}</p>
                      <p className="text-xs text-[#F5E9C8]/80">{domi.email}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setDomiToDelete(domi)}
                      className="text-[11px] sm:text-xs px-2 py-1 rounded-full bg-[#F5E9C8] text-[#102F59] hover:bg-[#f3ebd4] transition-colors"
                    >
                      Eliminar
                    </button>
                  </div>
                ))
              }
            </div>

            {errorList && (
              <p className="mt-3 text-xs text-red-600">
                {errorList}
              </p>
            )}
          </div>
        </div>
      )}

      {domiToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-[#FFF9E8] rounded-3xl shadow-2xl w-full max-w-sm mx-4 p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-[#102F59]">
              ¿Eliminar domiciliario?
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-[#174A8B]/80">
              Se eliminará{" "}
              <span className="font-semibold">{domiToDelete.nombre}</span>{" "}
              ({domiToDelete.email}). Esta acción no se puede deshacer.
            </p>

            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDomiToDelete(null)}
                className="px-3 py-1.5 text-[11px] sm:text-xs rounded-full border border-[#102F59]/40 text-[#102F59]"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={async () => {
                  const ok = await deleteDomiciliario(domiToDelete.id);
                  if (ok) {
                    setDomiToDelete(null);
                    fetchSummary();
                  }
                }}
                className="px-3 py-1.5 text-[11px] sm:text-xs rounded-full bg-red-600 text-white hover:bg-red-700"
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

