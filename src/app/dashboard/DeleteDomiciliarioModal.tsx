"use client";

import type { DomiciliarioItem } from "@/lib/api";

type DeleteDomiciliarioModalProps = {
  domiToDelete: DomiciliarioItem | null;
  onCancel: () => void;
  onConfirm: () => Promise<void> | void;
};

export function DeleteDomiciliarioModal({
  domiToDelete,
  onCancel,
  onConfirm,
}: DeleteDomiciliarioModalProps) {
  if (!domiToDelete) return null;

  return (
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
            onClick={onCancel}
            className="px-3 py-1.5 text-[11px] sm:text-xs rounded-full border border-[#102F59]/40 text-[#102F59]"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={async () => {
              await onConfirm();
            }}
            className="px-3 py-1.5 text-[11px] sm:text-xs rounded-full bg-red-600 text-white hover:bg-red-700"
          >
            Sí, eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
