"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDashboardStore } from "@/store/useDashboardStore";
import { useAuthStore } from "@/store/UseAuthStore";
import { useDomiciliariosStore } from "@/store/useDomiciliariosStore";
import { useComerciosStore } from "@/store/useComerciosStore";
import type { DomiciliarioItem, ComercioItem } from "@/lib/api";
import { DomiciliariosModal } from "./DomiciliariosModal";
import { DeleteDomiciliarioModal } from "./DeleteDomiciliarioModal";
import { ComerciosModal } from "./ComerciosModal";
import { DeleteComercioModal } from "./DeleteComercioModal";

type Props = {
  adminName: string;
};

export function DashboardClient({ adminName }: Props) {
  const router = useRouter();

  const { isAuthenticated, clearAuth } = useAuthStore();
  const {
    list: domiciliarios,
    loadingList,
    errorList,
    fetchDomiciliarios,
    deleteDomiciliario,
  } = useDomiciliariosStore();
  const {
    list: comercios,
    loadingList: loadingComercios,
    errorList: errorComercios,
    fetchComercios,
    deleteComercio,
  } = useComerciosStore();
  const { summary, loading, error, fetchSummary, reset } = useDashboardStore();
  const [closeSession, setCloseSession] = useState(false);
  const [createDomi, setCreateDomi] = useState(false);
  const [showDomisModal, setShowDomisModal] = useState(false);
  const [showComerciosModal, setShowComerciosModal] = useState(false);
  const [domiToDelete, setDomiToDelete] = useState<DomiciliarioItem | null>(null);
  const [comercioToDelete, setComercioToDelete] = useState<ComercioItem | null>(null);


  const totalPedidos = summary?.totalPedidos ?? 0;
  const totalDomiciliarios = summary?.totalDomiciliarios ?? 0;
  const totalComercios = summary?.totalComercios ?? 0;


  const handleLogout = () => {
    setCloseSession(true);
    clearAuth();
    reset();
    router.replace("/login");
  };

  const handleCreateDomi = () => {
    setCreateDomi(true);
    router.replace("/create-domi");
  };

  const handleCreateCommerce = () => {
    router.replace("/create-commerce");
  };

  const handleOpenDelivery = () => {
    router.replace("/delivery");
  };

  const handleConfirmDelete = async () => {
    if (!domiToDelete) return;
    const ok = await deleteDomiciliario(domiToDelete.id);
    if (ok) {
      setDomiToDelete(null);
      fetchSummary();
      fetchDomiciliarios();
    }
  };

  const handleConfirmDeleteComercio = async () => {
    if (!comercioToDelete) return;
    const ok = await deleteComercio(comercioToDelete.id);
    if (ok) {
      setComercioToDelete(null);
      fetchSummary();
      fetchComercios();
    }
  };

  const handleOpenDomisModal = () => setShowDomisModal(true);

  const handleCloseDomisModal = () => setShowDomisModal(false);

  const handleOpenComerciosModal = () => setShowComerciosModal(true);

  const handleCloseComerciosModal = () => setShowComerciosModal(false);

  const handleCancelDelete = () => setDomiToDelete(null);

  const handleCancelDeleteComercio = () => setComercioToDelete(null);


  useEffect(() => {
    if (!isAuthenticated()) {
      clearAuth();
      reset();
      router.replace("/login");
    }
  }, [isAuthenticated, clearAuth, router, reset]);

  useEffect(() => {
    if (isAuthenticated()) {
      fetchSummary();
    }
  }, [isAuthenticated, fetchSummary]);

  useEffect(() => {
    if (!showDomisModal) return;
    fetchDomiciliarios();
  }, [showDomisModal, fetchDomiciliarios]);

  useEffect(() => {
    if (!showComerciosModal) return;
    fetchComercios();
  }, [showComerciosModal, fetchComercios]);


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
          <button
            type="button"
            onClick={handleOpenComerciosModal}
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
              Comercios
            </span>

            {loading ? (
              <p className="mt-2 text-lg sm:text-2xl font-bold opacity-70">
                ...
              </p>
            ) : (
              <p className="mt-2 text-2xl sm:text-3xl font-bold text-[#F5E9C8]">
                {totalComercios}
              </p>
            )}
          </button>

          <button
            type="button"
            onClick={handleOpenDomisModal}
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
            type="button"
            onClick={handleOpenDelivery}
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
          </button>
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

      <DomiciliariosModal
        isOpen={showDomisModal}
        onClose={handleCloseDomisModal}
        domiciliarios={domiciliarios}
        loadingList={loadingList}
        errorList={errorList}
        onSelectDomiToDelete={setDomiToDelete}
        createDomi={createDomi}
        handleCreateDomi={handleCreateDomi}
      />

      <ComerciosModal
        isOpen={showComerciosModal}
        onClose={handleCloseComerciosModal}
        comercios={comercios}
        loadingList={loadingComercios}
        errorList={errorComercios}
        onCreateCommerce={handleCreateCommerce}
        onSelectComercioToDelete={setComercioToDelete}

      />

      <DeleteDomiciliarioModal
        domiToDelete={domiToDelete}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />

      <DeleteComercioModal
        comercioToDelete={comercioToDelete}
        onCancel={handleCancelDeleteComercio}
        onConfirm={handleConfirmDeleteComercio}
      />
    </div>
  );
}
