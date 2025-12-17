"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ensureBrowserNotificationPermission,
  listenNotifications,
  notifyNewPedidoBrowser,
} from "@/lib/notifications";
import { useAuthStore } from "@/store/UseAuthStore";

type NewPedidoState = {
  pedidoId: string;
  createdAt: number;
} | null;

export function NewPedidoNotification() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isDomiciliario =
    !!user && user.rol && user.rol.toLowerCase() === "domiciliario";

  const [pedido, setPedido] = useState<NewPedidoState>(null);

  useEffect(() => {
    if (!isDomiciliario || !user) return;

    const unsubscribe = listenNotifications((message) => {
      if (
        message.type === "NEW_PEDIDO" &&
        message.targetUserId === user.id
      ) {
        setPedido({
          pedidoId: message.pedidoId,
          createdAt: message.createdAt,
        });
      }
    });

    return unsubscribe;
  }, [isDomiciliario, user]);

  useEffect(() => {
    if (!pedido) return;
    notifyNewPedidoBrowser(pedido.pedidoId);
  }, [pedido]);

  useEffect(() => {
    if (!isDomiciliario) return;
    ensureBrowserNotificationPermission();
  }, [isDomiciliario]);

  if (!pedido) return null;

  return (
    <div className="fixed inset-x-0 bottom-4 z-50 flex justify-center px-4">
      <div className="w-full max-w-lg rounded-2xl bg-[#174A8B] text-[#FFF9E8] px-4 py-3 shadow-xl border border-[#F5E9C8]/60 flex items-start gap-3">
        <div className="h-10 w-10 rounded-full bg-[#F5E9C8] text-[#174A8B] flex items-center justify-center font-extrabold text-sm">
          !
        </div>

        <div className="flex-1">
          <p className="text-sm font-bold leading-tight">Nuevo pedido</p>
          <p className="text-xs opacity-90 leading-snug">
            Toca para ver el pedido en curso.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setPedido(null)}
            className="text-xs font-semibold px-3 py-1 rounded-full bg-white/15 hover:bg-white/25 transition"
          >
            Cerrar
          </button>
          <button
            onClick={() => {
              setPedido(null);
              router.push("/profile-delivery/current-delivery");
            }}
            className="text-xs font-semibold px-3 py-1 rounded-full bg-[#FFF9E8] text-[#174A8B] hover:bg-white transition"
          >
            Ver pedido
          </button>
        </div>
      </div>
    </div>
  );
}
