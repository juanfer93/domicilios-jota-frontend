export type NotificationMessage = {
  type: "NEW_PEDIDO";
  targetUserId: string;
  pedidoId: string;
  createdAt: number;
};

const CHANNEL_NAME = "jj-delivery-notifications";
const NOTIFICATION_TITLE = "Nuevo pedido";

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

function canUseBrowserNotifications() {
  return typeof window !== "undefined" && "Notification" in window;
}

export async function ensureBrowserNotificationPermission(): Promise<
  NotificationPermission | null
> {
  if (!canUseBrowserNotifications()) return null;

  if (Notification.permission === "default") {
    try {
      return await Notification.requestPermission();
    } catch {
      return null;
    }
  }

  return Notification.permission;
}

export async function notifyNewPedidoBrowser(pedidoId: string) {
  if (!canUseBrowserNotifications()) return;

  const permission = await ensureBrowserNotificationPermission();
  if (permission !== "granted") return;

  const notification = new Notification(NOTIFICATION_TITLE, {
    body: "Toca para ver el pedido en curso.",
    tag: `pedido-${pedidoId}`,
    icon: "/favicon.ico",
  });

  notification.onclick = (event) => {
    event.preventDefault();
    window.focus();
    window.location.href = "/profile-delivery/current-delivery";
  };
}
