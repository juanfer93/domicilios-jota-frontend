export type NotificationMessage = {
  type: "NEW_PEDIDO";
  targetUserId: string;
  pedidoId: string;
  createdAt: number;
};

const CHANNEL_NAME = "jj-delivery-notifications";

export function sendNewPedidoNotification(
  targetUserId: string,
  pedidoId: string
) {
  if (typeof window === "undefined") return;

  const channel = new BroadcastChannel(CHANNEL_NAME);
  const message: NotificationMessage = {
    type: "NEW_PEDIDO",
    targetUserId,
    pedidoId,
    createdAt: Date.now(),
  };

  channel.postMessage(message);
  channel.close();
}

export function listenNotifications(
  listener: (message: NotificationMessage) => void
) {
  if (typeof window === "undefined") return () => {};

  const channel = new BroadcastChannel(CHANNEL_NAME);
  const handler = (event: MessageEvent<NotificationMessage>) => {
    if (!event.data) return;
    listener(event.data);
  };

  channel.addEventListener("message", handler);

  return () => {
    channel.removeEventListener("message", handler);
    channel.close();
  };
}
