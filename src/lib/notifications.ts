export const NOTIFICATION_TITLE = "Nuevo pedido";

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
