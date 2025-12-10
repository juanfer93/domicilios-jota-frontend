"use client";

import type { DomiciliarioItem } from "@/lib/api";

type DomiciliariosModalProps = {
  isOpen: boolean;
  onClose: () => void;
  domiciliarios: DomiciliarioItem[];
  loadingList: boolean;
  errorList: string | null;
  onSelectDomiToDelete: (domi: DomiciliarioItem) => void;
  createDomi: boolean;
  handleCreateDomi: () => void;
};

export function DomiciliariosModal({
  isOpen,
  onClose,
  domiciliarios,
  loadingList,
  errorList,
  onSelectDomiToDelete,
  handleCreateDomi,
  createDomi,
}: DomiciliariosModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
      <div className="bg-[#FFF9E8] rounded-3xl shadow-2xl w-full max-w-md mx-4 p-4 sm:p-6 relative">
        <button
          type="button"
          onClick={onClose}
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

          {!loadingList &&
            domiciliarios.length > 0 &&
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
                  onClick={() => onSelectDomiToDelete(domi)}
                  className="text-[11px] sm:text-xs px-2 py-1 rounded-full bg-[#F5E9C8] text-[#102F59] hover:bg-[#f3ebd4] transition-colors"
                >
                  Eliminar
                </button>
              </div>
            ))}
        </div>

        {errorList && (
          <p className="mt-3 text-xs text-red-600">{errorList}</p>
        )}

        <div className="mt-5 flex justify-end">
          <button
            onClick={handleCreateDomi}
            className="
              px-4 py-2
              rounded-full 
              bg-[#102F59]
              text-[#F5E9C8] 
              text-[11px] sm:text-xs 
              font-medium 
              shadow-md 
              hover:bg-[#174A8B] 
              transition-colors
            "
          >
            {createDomi ? "Cargando..." : "Crear Domiciliario"}
          </button>
        </div>
      </div>
    </div>
  );
}
