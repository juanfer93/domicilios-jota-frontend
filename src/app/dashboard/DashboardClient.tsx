"use client";

import { useEffect } from "react";
import { useDashboardStore } from "@/store/useDashboardStore";

type Props = {
  adminName: string;
};

export function DashboardClient({ adminName }: Props) {
  const {
    summary,
    loading,
    error,
    fetchSummary,
  } = useDashboardStore();

  useEffect(() => {
    if (!summary) {
      fetchSummary();
    }
  }, [summary, fetchSummary]);

  const totalPedidos = summary?.totalPedidos ?? 0;
  const totalDomiciliarios = summary?.totalDomiciliarios ?? 0;

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
        <header className="flex flex-col gap-1">
          <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-[#174A8B]/70">
            Panel del administrador
          </span>
          <h1 className="text-2xl sm:text-3xl font-semibold">
            Bienvenido, {adminName} 👋
          </h1>
          <p className="text-xs sm:text-sm text-[#174A8B]/80">
            Aquí verás un resumen rápido de tus domiciliarios y pedidos.
          </p>
        </header>

        <section className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-2">
          <div className="rounded-3xl border border-[#F5E9C8]/40 bg-[#102F59]/90 px-4 py-4 sm:px-5 sm:py-5 shadow-2xl flex flex-col justify-between">
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
          </div>

          <div className="rounded-3xl border border-[#F5E9C8]/40 bg-[#102F59]/90 px-4 py-4 sm:px-5 sm:py-5 shadow-2xl flex flex-col justify-between">
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.18em] text-[#F5E9C8]/70">
              Pedidos
            </span>
            {loading ? (
              <p className="mt-2 text-lg sm:text-2xl font-bold opacity-70">
                ...
              </p>
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
    </div>
  );
}

