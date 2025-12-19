/* eslint-disable no-restricted-globals */
const NOTIFICATION_TITLE = "Nuevo pedido";
const NOTIFICATION_OPTIONS = {
  body: "Toca para ver el pedido en curso.",
  icon: "/favicon.ico",
};

self.addEventListener("push", (event) => {
  let data = {};

  try {
    data = event.data ? event.data.json() : {};
  } catch (error) {
    // If payload is not JSON, fallback to text.
    data = { body: event.data?.text() };
  }

  const title = data.title || NOTIFICATION_TITLE;
  const options = {
    ...NOTIFICATION_OPTIONS,
    ...data,
    data: {
      url: data.url || "/profile-delivery/current-delivery",
    },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const destination = event.notification.data?.url || "/profile-delivery/current-delivery";

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      const matchingClient = clientList.find((client) => client.url.includes(destination));

      if (matchingClient) {
        matchingClient.focus();
        return;
      }

      return self.clients.openWindow(destination);
    })
  );
});
