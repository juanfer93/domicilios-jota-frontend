"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ensureBrowserNotificationPermission,
  ensurePushSubscription,
  notifyNewPedidoBrowser,
} from "@/lib/notifications";
import { api, getCurrentDelivery } from "@/lib/api";
import { getAuthHeaders } from "@/lib/GetAuthHeaders";
import { useAuthStore } from "@/store/UseAuthStore";

type NewPedidoState = {
  pedidoId: string;
  createdAt: number;
} | null;

const POLL_INTERVAL_MS = 3000;

export function NewPedidoNotification() {
  const router = useRouter();

  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);

  const isDomiciliario =
    !!user && user.rol && user.rol.toLowerCase() === "domiciliario";

  const [pedido, setPedido] = useState<NewPedidoState>(null);
  const [lastPedidoId, setLastPedidoId] = useState<string | null>(null);

  useEffect(() => {
    if (!isDomiciliario || !user) return;

    let isMounted = true;
    let intervalId: ReturnType<typeof setInterval>;

    const checkCurrentDelivery = async () => {
      try {
        const current = await getCurrentDelivery();
        const currentId = current?.id ?? null;

        if (!isMounted) return;

        setLastPedidoId((prevId) => {
          if (prevId === null && currentId !== null) {
            return currentId;
          }

          if (currentId && currentId !== prevId) {
            setPedido({
              pedidoId: currentId,
              createdAt: Date.now(),
            });
            return currentId;
          }

          if (!currentId) {
            return null;
          }

          return prevId;
        });
      } catch {
        if (!isMounted) return;
        setLastPedidoId(null);
      }
    };

    checkCurrentDelivery();
    intervalId = setInterval(checkCurrentDelivery, POLL_INTERVAL_MS);

    return () => {
      isMounted = false;
      if (intervalId) clearInterval(intervalId);
    };
  }, [isDomiciliario, user]);

  useEffect(() => {
    if (!pedido) return;
    notifyNewPedidoBrowser(pedido.pedidoId);
  }, [pedido]);

  useEffect(() => {
    if (!isDomiciliario) return;

    if (!token) {
      ensureBrowserNotificationPermission(); // igual pide permiso
      return;
    }

    ensureBrowserNotificationPermission();

    ensurePushSubscription(async (subscription) => {
      await api.post(
        "/api/v1/notifications/subscribe",
        subscription.toJSON(),
        { headers: { ...getAuthHeaders() } }
      );
    });
  }, [isDomiciliario, token]);

  if (!pedido) return null;

  return (
    <div className="fixed inset-x-0 bottom-4 z-50 flex justify-center px-4">
      <div className="w-full max-w-lg rounded-2xl bg-[#174A8B] text-[#FFF9E8] shadow-xl border border-[#F5E9C8]/60 flex items-start gap-3">
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
