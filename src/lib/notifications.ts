export const NOTIFICATION_TITLE = "Nuevo pedido";

const SERVICE_WORKER_PATH = "/sw.js";
const PUSH_PUBLIC_KEY = process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY;

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

export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return null;

  try {
    const registration = await navigator.serviceWorker.register(SERVICE_WORKER_PATH);
    return registration;
  } catch (error) {
    console.error("No se pudo registrar el Service Worker para notificaciones", error);
    return null;
  }
}

async function getExistingPushSubscription(
  registration: ServiceWorkerRegistration
): Promise<PushSubscription | null> {
  try {
    return await registration.pushManager.getSubscription();
  } catch (error) {
    console.error("Error obteniendo la suscripción push existente", error);
    return null;
  }
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

async function createPushSubscription(
  registration: ServiceWorkerRegistration
): Promise<PushSubscription | null> {
  if (!PUSH_PUBLIC_KEY) {
    console.warn("Falta la variable de entorno NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY para suscribir push");
    return null;
  }

  try {
    return await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(PUSH_PUBLIC_KEY),
    });
  } catch (error) {
    console.error("No se pudo crear la suscripción push", error);
    return null;
  }
}

export async function ensurePushSubscription(
  onSubscription?: (subscription: PushSubscription) => Promise<void> | void
): Promise<void> {
  if (typeof window === "undefined" || !canUseBrowserNotifications()) return;

  const permission = await ensureBrowserNotificationPermission();
  if (permission !== "granted") return;

  const registration = await registerServiceWorker();
  if (!registration) return;

  const existingSubscription = await getExistingPushSubscription(registration);
  const subscription = existingSubscription ?? (await createPushSubscription(registration));

  if (subscription && onSubscription) {
    try {
      await onSubscription(subscription);
    } catch (error) {
      console.error("No se pudo persistir la suscripción push en el servidor", error);
    }
  }
}
