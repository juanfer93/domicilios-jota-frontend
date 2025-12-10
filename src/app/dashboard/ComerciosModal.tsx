"use client";

import type { ComercioItem } from "@/lib/api";

type ComerciosModalProps = {
  isOpen: boolean;
  onClose: () => void;
  comercios: ComercioItem[];
  loadingList: boolean;
  errorList: string | null;
  onCreateCommerce: () => void;
  onSelectComercioToDelete: (comercio: ComercioItem) => void;
};

export function ComerciosModal({
  isOpen,
  onClose,
  comercios,
  loadingList,
  errorList,
  onCreateCommerce,
  onSelectComercioToDelete
}: ComerciosModalProps) {
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
          Comercios
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-[#174A8B]/80">
          Lista de comercios registrados.
        </p>

        <div className="mt-4 space-y-3 max-h-72 overflow-y-auto">
          {loadingList && (
            <p className="text-xs text-[#174A8B]/80">Cargando...</p>
          )}

          {!loadingList && comercios.length === 0 && (
            <p className="text-xs text-[#174A8B]/80">
              Aún no hay comercios.
            </p>
          )}

          {!loadingList &&
            comercios.length > 0 &&
            comercios.map((comercio) => (
              <div
                key={comercio.id}
                className="flex items-center justify-between bg-[#102F59] text-[#F5E9C8] rounded-2xl px-3 py-2"
              >
                <div>
                  <p className="text-sm font-semibold">{comercio.nombre}</p>
                  <p className="text-xs text-[#F5E9C8]/80">
                    {comercio.direccion}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectComercioToDelete(comercio)}
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
            onClick={onCreateCommerce}
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
            Crear comercio
          </button>
        </div>
      </div>
    </div>
  );
}
